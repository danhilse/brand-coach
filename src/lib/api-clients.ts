// lib/api-clients.ts
import { Anthropic } from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { mockEvaluations } from './mockEvaluations';
import type { ApiProvider } from './types';

export interface ApiClient {
  generateResponse: (prompt: string) => Promise<string>;
}

class AnthropicClient implements ApiClient {
  private client: Anthropic;

  constructor(apiKey: string) {
    this.client = new Anthropic({ apiKey });
  }

  async generateResponse(prompt: string): Promise<string> {
    const response = await this.client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2048,
      temperature: 0.3,
      messages: [{ role: 'user', content: prompt }],
    });

    if (response?.content?.[0]?.type === 'text') {
      return response.content[0].text;
    }
    throw new Error('Unexpected response format from Anthropic API');
  }
}

class OpenAIClient implements ApiClient {
  private client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey });
  }

  async generateResponse(prompt: string): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 2048
    });

    const content = response.choices[0]?.message?.content;
    if (content) {
      return content;
    }
    throw new Error('Unexpected response format from OpenAI API');
  }
}

class TestClient implements ApiClient {
  async generateResponse(prompt: string): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockEvaluations.overall;
  }
}

export const getApiClient = (provider: ApiProvider): ApiClient => {
  switch (provider) {
    case 'anthropic':
      const anthropicKey = process.env.ANTHROPIC_API_KEY;
      if (!anthropicKey) throw new Error('Anthropic API key not configured');
      return new AnthropicClient(anthropicKey);
    
    case 'openai':
      const openaiKey = process.env.OPENAI_API_KEY;
      if (!openaiKey) throw new Error('OpenAI API key not configured');
      return new OpenAIClient(openaiKey);
    
    case 'test':
      return new TestClient();
    
    default:
      throw new Error(`Unknown API provider: ${provider}`);
  }
};