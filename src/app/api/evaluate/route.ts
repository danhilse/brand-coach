// app/api/evaluate/route.ts
import { NextResponse } from 'next/server';
import { 
  formatVoicePersonalityEvaluation, 
  formatTargetAudienceEvaluation,
  formatMessagingValuesEvaluation,
  formatOverallEvaluation,
  formatToneSpectrumAdjustment // Add new formatters here
} from '@/lib/prompts';
import { AnthropicClient, OpenAIClient, type ApiClient } from '@/lib/api-clients';

type BaseEvaluationType = 'voicePersonality' | 'targetAudience' | 'messagingValues' | 'overall';
type SpecializedEvaluationType = 'toneAdjustment'; // Add new specialized types here
type EvaluationType = BaseEvaluationType | SpecializedEvaluationType;

interface BaseEvaluationConfig {
  formatter: (text: string) => string;
  name: string;
  type: 'base';
}

interface SpecializedEvaluationConfig {
  formatter: (text: string, options: any) => string;
  name: string;
  type: 'specialized';
}

type EvaluationConfig = BaseEvaluationConfig | SpecializedEvaluationConfig;

const evaluationConfigs: Record<EvaluationType, EvaluationConfig> = {
  // Base evaluations
  voicePersonality: {
    formatter: formatVoicePersonalityEvaluation,
    name: 'Voice Personality',
    type: 'base'
  },
  targetAudience: {
    formatter: formatTargetAudienceEvaluation,
    name: 'Target Audience',
    type: 'base'
  },
  messagingValues: {
    formatter: formatMessagingValuesEvaluation,
    name: 'Messaging Values',
    type: 'base'
  },
  overall: {
    formatter: formatOverallEvaluation,
    name: 'Overall',
    type: 'base'
  },
  // Specialized evaluations
  toneAdjustment: {
    formatter: formatToneSpectrumAdjustment,
    name: 'Tone Adjustment',
    type: 'specialized'
  }
  // Add new specialized evaluations here
};

async function performEvaluation(
  client: ApiClient,
  text: string, 
  type: EvaluationType,
  options?: any
): Promise<string> {
  const config = evaluationConfigs[type];
  console.log(`Requesting ${config.name} evaluation...`);
  
  try {
    let result;
    if (config.type === 'specialized') {
      result = await client.generateResponse(config.formatter(text, options));
    } else {
      result = await client.generateResponse(config.formatter(text));
    }
    console.log(`${config.name} evaluation successful`);
    return result;
  } catch (err: any) {
    console.error(`${config.name} Error:`, {
      message: err.message,
      name: err.name,
      status: err.status,
      type: err.type
    });
    throw err;
  }
}

export async function POST(request: Request) {
  try {
    const { 
      text, 
      api = 'anthropic',
      evaluationType,
      options 
    } = await request.json();

    console.log('Received text length:', text?.length);

    if (!text) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 });
    }

    let client: ApiClient;
    if (api === 'anthropic') {
      const apiKey = process.env.ANTHROPIC_API_KEY;
      if (!apiKey) throw new Error('Anthropic API key not configured');
      client = new AnthropicClient(apiKey);
    } else {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) throw new Error('OpenAI API key not configured');
      client = new OpenAIClient(apiKey);
    }

    try {
      console.log('Starting evaluation process...');
      
      // Handle specialized evaluation request
      if (evaluationType) {
        const config = evaluationConfigs[evaluationType as EvaluationType];
        if (!config) {
          throw new Error(`Unknown evaluation type: ${evaluationType}`);
        }
        
        const result = await performEvaluation(client, text, evaluationType as EvaluationType, options);
        return NextResponse.json({ result });
      }
      
      // Handle base evaluations (maintains existing functionality)
      const baseEvaluations = Object.entries(evaluationConfigs)
        .filter(([_, config]) => config.type === 'base');
      
      const evaluationResults = await Promise.all(
        baseEvaluations.map(async ([type]) => {
          const result = await performEvaluation(client, text, type as BaseEvaluationType);
          return [type, result];
        })
      );

      return NextResponse.json(
        Object.fromEntries(evaluationResults)
      );

    } catch (apiError: any) {
      console.error('API Error Details:', apiError);
      return NextResponse.json(
        { 
          error: 'Failed to process text',
          details: `API Error (${apiError.type}): ${apiError.message}`,
          errorType: apiError.type,
          errorStatus: apiError.status
        },
        { status: apiError.status || 500 }
      );
    }
  } catch (error: any) {
    console.error('Server Error Details:', error);
    return NextResponse.json(
      { 
        error: 'Server error occurred',
        details: error.message,
        errorType: error.name
      },
      { status: 500 }
    );
  }
}