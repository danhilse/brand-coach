// app/api/evaluate/route.ts
import { Anthropic } from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';
import { 
  formatVoicePersonalityEvaluation, 
  formatTargetAudienceEvaluation,
  formatMessagingValuesEvaluation,
  formatOverallEvaluation 
} from '@/lib/prompts';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(request: Request) {
  try {
    const { text } = await request.json();
    if (!text) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 });
    }

    const [voicePersonalityResponse, targetAudienceResponse, messagingValuesResponse, overallResponse] = await Promise.all([
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
        messages: [{ role: 'user', content: formatTargetAudienceEvaluation(text) }],
      }),
      anthropic.messages.create({
        model: 'claude-3-opus-20240229',
        max_tokens: 2048,
        temperature: 0.7,
        messages: [{ role: 'user', content: formatMessagingValuesEvaluation(text) }],
      }),
      anthropic.messages.create({
        model: 'claude-3-opus-20240229',
        max_tokens: 2048,
        temperature: 0.7,
        messages: [{ role: 'user', content: formatOverallEvaluation(text) }],
      })
    ]);

    // Extract the text content safely from the responses
    const getContent = (response: typeof voicePersonalityResponse) => {
      const content = response.content[0];
      if ('text' in content) {
        return content.text;
      }
      return ''; // or handle other content types if needed
    };

    return NextResponse.json({ 
      voicePersonality: getContent(voicePersonalityResponse),
      targetAudience: getContent(targetAudienceResponse),
      messagingValues: getContent(messagingValuesResponse),
      overall: getContent(overallResponse)
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to evaluate text' },
      { status: 500 }
    );
  }
}