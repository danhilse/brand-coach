// app/api/evaluate/route.ts
import { Anthropic } from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';
import { 
  formatVoicePersonalityEvaluation, 
  formatTargetAudienceEvaluation,
  formatMessagingValuesEvaluation,
  formatOverallEvaluation 
} from '@/lib/prompts';

export async function POST(request: Request) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    
    // Initialize Anthropic
    const anthropic = new Anthropic({
      apiKey: apiKey
    });

    const { text } = await request.json();
    console.log('Received text length:', text?.length);

    if (!text) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 });
    }

    try {
      console.log('Sending requests to Anthropic API...');

      // Make API calls one at a time to isolate any issues
      console.log('Requesting voice personality evaluation...');
      const voicePersonalityResponse = await anthropic.messages.create({
        model: 'claude-3-opus-20240229',
        max_tokens: 2048,
        temperature: 0.7,
        messages: [{ role: 'user', content: formatVoicePersonalityEvaluation(text) }],
      }).catch(err => {
        console.error('Voice Personality Error:', {
          message: err.message,
          name: err.name,
          status: err.status,
          type: err.type
        });
        throw err;
      });
      console.log('Voice personality evaluation successful');

      console.log('Requesting target audience evaluation...');
      const targetAudienceResponse = await anthropic.messages.create({
        model: 'claude-3-opus-20240229',
        max_tokens: 2048,
        temperature: 0.7,
        messages: [{ role: 'user', content: formatTargetAudienceEvaluation(text) }],
      }).catch(err => {
        console.error('Target Audience Error:', err);
        throw err;
      });
      console.log('Target audience evaluation successful');

      console.log('Requesting messaging values evaluation...');
      const messagingValuesResponse = await anthropic.messages.create({
        model: 'claude-3-opus-20240229',
        max_tokens: 2048,
        temperature: 0.7,
        messages: [{ role: 'user', content: formatMessagingValuesEvaluation(text) }],
      }).catch(err => {
        console.error('Messaging Values Error:', err);
        throw err;
      });
      console.log('Messaging values evaluation successful');

      console.log('Requesting overall evaluation...');
      const overallResponse = await anthropic.messages.create({
        model: 'claude-3-opus-20240229',
        max_tokens: 2048,
        temperature: 0.7,
        messages: [{ role: 'user', content: formatOverallEvaluation(text) }],
      }).catch(err => {
        console.error('Overall Evaluation Error:', err);
        throw err;
      });
      console.log('Overall evaluation successful');

      // Extract content safely
      const getContent = (response: any) => {
        if (response?.content?.[0]?.type === 'text') {
          return response.content[0].text;
        }
        throw new Error('Unexpected response format from API');
      };

      return NextResponse.json({ 
        voicePersonality: getContent(voicePersonalityResponse),
        targetAudience: getContent(targetAudienceResponse),
        messagingValues: getContent(messagingValuesResponse),
        overall: getContent(overallResponse)
      });

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