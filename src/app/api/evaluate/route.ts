// app/api/evaluate/test/route.ts
import { NextResponse } from 'next/server';
import { mockEvaluations } from '@/lib/mockEvaluations';

type EvaluationType = keyof typeof mockEvaluations;

interface EvaluationConfig {
  name: string;
}

const evaluationConfigs: Record<EvaluationType, EvaluationConfig> = {
  voicePersonality: {
    name: 'Voice Personality'
  },
  targetAudience: {
    name: 'Target Audience'
  },
  messagingValues: {
    name: 'Messaging Values'
  },
  overall: {
    name: 'Overall'
  }
};

async function performMockEvaluation(
  text: string, 
  type: EvaluationType
): Promise<string> {
  const config = evaluationConfigs[type];
  console.log(`Mock ${config.name} evaluation...`);
  
  // Simulate some processing time (optional, remove if not needed)
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return mockEvaluations[type];
}

export async function POST(request: Request) {
  try {
    const { text } = await request.json();
    console.log('Received text length:', text?.length);

    if (!text) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 });
    }

    try {
      console.log('Starting mock evaluation process...');
      
      const evaluationResults = await Promise.all(
        (Object.keys(mockEvaluations) as EvaluationType[]).map(async (type) => {
          const result = await performMockEvaluation(text, type);
          return [type, result];
        })
      );

      return NextResponse.json(
        Object.fromEntries(evaluationResults)
      );

    } catch (error: any) {
      console.error('Mock Evaluation Error:', error);
      return NextResponse.json(
        { 
          error: 'Failed to process text',
          details: error.message
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Server Error:', error);
    return NextResponse.json(
      { 
        error: 'Server error occurred',
        details: error.message
      },
      { status: 500 }
    );
  }
}