// evaluations.ts
import {
    parseVoicePersonalityEvaluation,
    parseTargetAudienceEvaluation,
    parseMessagingValuesEvaluation,
    parseOverallEvaluation,
    parseToneAdjustmentEvaluation,
    getLastToneScore
  } from '@/lib/parsers';
  
  import {
    formatVoicePersonalityEvaluation,
    formatTargetAudienceEvaluation,
    formatMessagingValuesEvaluation,
    formatOverallEvaluation,
    formatToneSpectrumAdjustment
  } from '@/lib/prompts';
  
  import type { 
    VoicePersonalityEvaluation,
    TargetAudienceEvaluation,
    MessagingValuesEvaluation,
    OverallEvaluation,
    ToneAdjustmentEvaluation
  } from '@/lib/types';
  
  // Global config for API provider
  const API_PROVIDER = 'anthropic'; // Can be 'anthropic', 'openai', or 'test'
  
  async function makeAPICall(content: string) {
    console.log("Making API Call")
    const response = await fetch('/api/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    });
    
    const result = await response.json();
    if (result.error) throw new Error(result.error);
    return result.data;
  }
  
  export async function evaluateVoicePersonality(content: string): Promise<VoicePersonalityEvaluation> {
    const prompt = formatVoicePersonalityEvaluation(content);
    const response = await makeAPICall(prompt);
    return parseVoicePersonalityEvaluation(response);
  }
  
  export async function evaluateTargetAudience(content: string): Promise<TargetAudienceEvaluation> {
    const prompt = formatTargetAudienceEvaluation(content);
    const response = await makeAPICall(prompt);
    return parseTargetAudienceEvaluation(response);
  }
  
  export async function evaluateMessagingValues(content: string): Promise<MessagingValuesEvaluation> {
    const prompt = formatMessagingValuesEvaluation(content);
    const response = await makeAPICall(prompt);
    return parseMessagingValuesEvaluation(response);
  }
  
  export async function evaluateOverall(content: string): Promise<OverallEvaluation> {
    const prompt = formatOverallEvaluation(content);
    const response = await makeAPICall(prompt);
    return parseOverallEvaluation(response);
  }
  
  export async function adjustToneSpectrum(
    content: string, 
    targetTone: {
      challengingPercentage: number;
      supportivePercentage: number;
    }
  ): Promise<ToneAdjustmentEvaluation> {
    const prompt = formatToneSpectrumAdjustment(content, targetTone);
    const response = await makeAPICall(prompt);
    return parseToneAdjustmentEvaluation(response);
  }
  
  export async function evaluateAll(content: string) {
    console.log(`Starting all evaluations at ${new Date().toISOString()}`);
    
    try {
      const [
        voicePersonality,
        targetAudience,
        messagingValues,
        overall
      ] = await Promise.all([
        evaluateVoicePersonality(content),
        evaluateTargetAudience(content),
        evaluateMessagingValues(content),
        evaluateOverall(content)
      ]);
  
      console.log(`All evaluations completed at ${new Date().toISOString()}`);
  
      return {
        voicePersonality,
        targetAudience,
        messagingValues,
        overall
      };
    } catch (error) {
      console.error('Evaluation failed:', error);
      throw error;
    }
  }