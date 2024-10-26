import { Anthropic } from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import type { ApiProvider } from './types';

// Create singleton instances of clients
const anthropicClient = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
const openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

// Add rate limiting utility
class RateLimit {
  private queue: Array<() => Promise<void>> = [];
  private processing = false;
  private lastRequestTime = 0;
  private minRequestGap: number;

  constructor(requestsPerSecond: number) {
    this.minRequestGap = 1000 / requestsPerSecond;
  }

  async add<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await fn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      
      if (!this.processing) {
        this.processQueue();
      }
    });
  }

  private async processQueue() {
    if (this.processing || this.queue.length === 0) return;
    
    this.processing = true;
    
    while (this.queue.length > 0) {
      const now = Date.now();
      const timeToWait = Math.max(0, this.lastRequestTime + this.minRequestGap - now);
      
      if (timeToWait > 0) {
        await new Promise(resolve => setTimeout(resolve, timeToWait));
      }
      
      const fn = this.queue.shift();
      if (fn) {
        this.lastRequestTime = Date.now();
        await fn();
      }
    }
    
    this.processing = false;
  }
}

// Create rate limiters - adjust these values based on your API limits
const anthropicRateLimit = new RateLimit(3); // 3 requests per second
const openaiRateLimit = new RateLimit(3);

async function callAnthropic(prompt: string) {
    const startTime = Date.now();
    console.log(`${new Date().toISOString()} - Starting Anthropic API call`);
    
    try {
      const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
      console.log('Client created, sending request...');
      
      const response = await client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2048,
        temperature: 0.3,
        messages: [{ role: 'user', content: prompt }]
      });
      
      const duration = Date.now() - startTime;
      console.log(`Anthropic API call completed in ${duration}ms`);
      
      const content = response.content.find(block => block.type === 'text');
      if (!content || !('text' in content)) {
        throw new Error('Unexpected response format from Anthropic API');
      }
      return content.text;
    } catch (error) {
      console.error('Anthropic API call failed:', error);
      throw error;
    }
  }

async function callOpenAI(prompt: string) {
  return openaiRateLimit.add(async () => {
    console.log('Making OpenAI API call at:', new Date().toISOString());
    const response = await openaiClient.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 2048
    });

    if (!response.choices[0]?.message?.content) {
      throw new Error('Unexpected response format from OpenAI API');
    }
    return response.choices[0].message.content;
  });
}

async function callTestApi(prompt: string) {
  return 'test response';
}

const apiClients = {
  anthropic: callAnthropic,
  openai: callOpenAI,
  test: callTestApi
} as const;

export async function generateResponse(
  prompt: string, 
  provider: ApiProvider = 'anthropic'
): Promise<string> {
  const apiCall = apiClients[provider];
  return await apiCall(prompt);
}