// lib/api-clients.ts
import { Anthropic } from '@anthropic-ai/sdk';
import OpenAI from 'openai';

export interface ApiClient {
  generateResponse: (prompt: string) => Promise<string>;
}

export class AnthropicClient implements ApiClient {
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

export class OpenAIClient implements ApiClient {
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
