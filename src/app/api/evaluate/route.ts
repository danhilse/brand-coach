// app/api/evaluate/route.ts
import { NextResponse } from 'next/server';
import { getApiClient } from '@/lib/api-clients';
import type { ApiProvider } from '@/lib/types';
import {
  parseVoicePersonalityEvaluation,
  parseTargetAudienceEvaluation,
  parseMessagingValuesEvaluation,
  parseOverallEvaluation
} from '@/lib/parsers';

type BaseEvaluationType = 
  | 'voicePersonality'
  | 'targetAudience'
  | 'messagingValues'
  | 'overall';

type SpecialEvaluationType = 'toneAdjustment';

type EvaluationType = BaseEvaluationType | SpecialEvaluationType;

const evaluationParsers = {
  voicePersonality: parseVoicePersonalityEvaluation,
  targetAudience: parseTargetAudienceEvaluation,
  messagingValues: parseMessagingValuesEvaluation,
  overall: parseOverallEvaluation
} as const;

export async function POST(request: Request) {
  try {
    const { text, type, provider = 'anthropic' } = await request.json();

    if (!text || !type) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    try {
      const client = getApiClient(provider as ApiProvider);
      const response = await client.generateResponse(text);

      // Special handling for tone adjustment - no parsing needed
      if (type === 'toneAdjustment') {
        return NextResponse.json({ data: response });
      }

      // Regular evaluations with parsers
      const parser = evaluationParsers[type as BaseEvaluationType];
      if (!parser) {
        return NextResponse.json(
          { error: `Unknown evaluation type: ${type}` },
          { status: 400 }
        );
      }

      const parsedResponse = parser(response);
      return NextResponse.json({ data: parsedResponse });
    } catch (error: any) {
      console.error('API Error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: error.status || 500 }
      );
    }
  } catch (error: any) {
    console.error('Server Error:', error);
    return NextResponse.json(
      { error: 'Server error occurred' },
      { status: 500 }
    );
  }
}