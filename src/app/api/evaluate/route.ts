// app/api/evaluate/route.ts
import { Anthropic, MessageContent } from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';
import { 
  formatVoicePersonalityEvaluation, 
  formatTargetAudienceEvaluation,
  formatMessagingValuesEvaluation,
  formatOverallEvaluation 
} from '@/lib/prompts';

// Configure response type
type ApiResponse = {
  voicePersonality?: string;
  targetAudience?: string;
  messagingValues?: string;
  overall?: string;
  error?: string;
  details?: string;
  errorType?: string;
  errorStatus?: number;
};

// Configure Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || ''
});

function isTextContent(content: MessageContent): content is MessageContent & { type: 'text' } {
  return content.type === 'text';
}

async function makeAnthropicRequest(content: string): Promise<string> {
  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 2048,
      temperature: 0.7,
      messages: [{ role: 'user', content }],
    });

    const firstContent = response.content[0];
    
    if (!firstContent || !isTextContent(firstContent)) {
      throw new Error('Unexpected response format from API');
    }

    return firstContent.text;
  } catch (error) {
    console.error('Anthropic API Error:', error);
    throw error;
  }
}

export async function POST(request: Request): Promise<NextResponse<ApiResponse>> {
  try {
    const { text } = await request.json();
    
    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'No text provided or invalid input' },
        { status: 400 }
      );
    }

    console.log('Starting evaluation with text length:', text.length);

    try {
      const [
        voicePersonality,
        targetAudience,
        messagingValues,
        overall
      ] = await Promise.all([
        makeAnthropicRequest(formatVoicePersonalityEvaluation(text)),
        makeAnthropicRequest(formatTargetAudienceEvaluation(text)),
        makeAnthropicRequest(formatMessagingValuesEvaluation(text)),
        makeAnthropicRequest(formatOverallEvaluation(text))
      ]);

      return NextResponse.json({
        voicePersonality,
        targetAudience,
        messagingValues,
        overall
      });

    } catch (apiError: any) {
      console.error('API Error Details:', apiError);
      
      return NextResponse.json(
        {
          error: 'Failed to process text',
          details: apiError.message || 'Unknown API error',
          errorType: apiError.name,
          errorStatus: apiError.status
        },
        { status: apiError.status || 500 }
      );
    }
  } catch (error: any) {
    console.error('Server Error:', error);
    
    return NextResponse.json(
      {
        error: 'Server error occurred',
        details: error.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Configure maxDuration
export const config = {
  maxDuration: 60
};