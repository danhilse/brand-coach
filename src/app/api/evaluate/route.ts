// app/api/evaluate/route.ts
import { Anthropic } from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';
import { 
  formatVoicePersonalityEvaluation, 
  formatTargetAudienceEvaluation,
  formatMessagingValuesEvaluation,
  formatOverallEvaluation 
} from '@/lib/prompts';

type EvaluationType = 'voicePersonality' | 'targetAudience' | 'messagingValues' | 'overall';

interface EvaluationConfig {
  formatter: (text: string) => string;
  name: string;
}

const evaluationConfigs: Record<EvaluationType, EvaluationConfig> = {
  voicePersonality: {
    formatter: formatVoicePersonalityEvaluation,
    name: 'Voice Personality'
  },
  targetAudience: {
    formatter: formatTargetAudienceEvaluation,
    name: 'Target Audience'
  },
  messagingValues: {
    formatter: formatMessagingValuesEvaluation,
    name: 'Messaging Values'
  },
  overall: {
    formatter: formatOverallEvaluation,
    name: 'Overall'
  }
};

async function performEvaluation(
  anthropic: Anthropic, 
  text: string, 
  type: EvaluationType
): Promise<string> {
  const config = evaluationConfigs[type];
  console.log(`Requesting ${config.name} evaluation...`);
  
  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2048,
      temperature: 0.3,
      messages: [{ role: 'user', content: config.formatter(text) }],
    });

    if (response?.content?.[0]?.type === 'text') {
      console.log(`${config.name} evaluation successful`);
      return response.content[0].text;
    }
    throw new Error('Unexpected response format from API');
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
    const apiKey = process.env.ANTHROPIC_API_KEY;
    const anthropic = new Anthropic({ apiKey });

    const { text } = await request.json();
    console.log('Received text length:', text?.length);

    if (!text) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 });
    }

    try {
      console.log('Starting evaluation process...');
      
      const evaluationResults = await Promise.all(
        Object.keys(evaluationConfigs).map(async (type) => {
          const result = await performEvaluation(anthropic, text, type as EvaluationType);
          return [type, result];
        })
      );

      return NextResponse.json(
        Object.fromEntries(evaluationResults)
      );

    } catch (apiError: any) {
      console.error('API Error Details:', {
        message: apiError.message,
        name: apiError.name,
        type: apiError.type,
        status: apiError.status,
        stack: apiError.stack
      });
      
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
    console.error('Server Error Details:', {
      message: error.message,
      name: error.name,
      stack: error.stack
    });
    
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