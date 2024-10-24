import { Anthropic } from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';
import { formatBrandEvaluation } from '../../../lib/prompts';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(request: Request) {
  try {
    const { text } = await request.json();
    if (!text) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 });
    }

    const message = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 2048,
      temperature: 0.7,
      messages: [{ role: 'user', content: formatBrandEvaluation(text) }],
    });

    return NextResponse.json({ response: message.content[0].text });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to evaluate text' },
      { status: 500 }
    );
  }
}