// app/api/evaluate/route.ts
import { Anthropic } from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';
import { 
  formatVoicePersonalityEvaluation, 
  formatMessagingValuesEvaluation 
} from '../../../lib/prompts';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(request: Request) {
  try {
    const { text } = await request.json();
    if (!text) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 });
    }

    // Make both evaluations in parallel
    const [voicePersonalityResponse, messagingValuesResponse] = await Promise.all([
      anthropic.messages.create({
        model: 'claude-3-opus-20240229',
        max_tokens: 2048,
        temperature: 0.7,
        messages: [{ role: 'user', content: formatVoicePersonalityEvaluation(text) }],
      }),
      anthropic.messages.create({
        model: 'claude-3-opus-20240229',
        max_tokens: 2048,
        temperature: 0.7,
        messages: [{ role: 'user', content: formatMessagingValuesEvaluation(text) }],
      })
    ]);

    return NextResponse.json({ 
      voicePersonality: voicePersonalityResponse.content[0].text,
      messagingValues: messagingValuesResponse.content[0].text
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to evaluate text' },
      { status: 500 }
    );
  }
}