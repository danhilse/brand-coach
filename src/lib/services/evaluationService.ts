// lib/services/evaluationService.ts
import type { 
    VoicePersonalityEvaluation, 
    TargetAudienceEvaluation,
    MessagingValuesEvaluation,
    OverallEvaluation,
    ApiProvider
  } from '@/lib/types';
  import {
    formatVoicePersonalityEvaluation,
    formatTargetAudienceEvaluation,
    formatMessagingValuesEvaluation,
    formatOverallEvaluation,
    formatToneSpectrumAdjustment
  } from '@/lib/prompts';
  
  export interface EvaluationResult<T> {
    data?: T;
    error?: string;
  }
  
  export interface ToneAdjustmentOptions {
    challengingPercentage: number;
    supportivePercentage: number;
  }
  
  interface EvaluationResults {
    voicePersonality?: VoicePersonalityEvaluation;
    targetAudience?: TargetAudienceEvaluation;
    messagingValues?: MessagingValuesEvaluation;
    overall?: OverallEvaluation;
    errors?: string[];
  }

  export interface ToneAdjustmentOptions {
    challengingPercentage: number;
    supportivePercentage: number;
    contentTypes?: string[];
  }
  
  class EvaluationService {
    private async makeRequest<T>(
      type: string, 
      text: string, 
      options?: any
    ): Promise<EvaluationResult<T>> {
      try {
        // Get the prompt text based on type
        let promptText: string;
        switch (type) {
          case 'voicePersonality':
            promptText = formatVoicePersonalityEvaluation(text);
            break;
          case 'targetAudience':
            promptText = formatTargetAudienceEvaluation(text);
            break;
          case 'messagingValues':
            promptText = formatMessagingValuesEvaluation(text);
            break;
          case 'overall':
            promptText = formatOverallEvaluation(text);
            break;
          case 'toneAdjustment':
            promptText = formatToneSpectrumAdjustment(text, options);
            break;
          default:
            throw new Error(`Unknown evaluation type: ${type}`);
        }
  
        const res = await fetch('/api/evaluate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            text: promptText,
            type,
            provider: 'anthropic' // You might want to make this configurable
          }),
        });
  
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || `Request failed: ${res.statusText}`);
        }
  
        const { data, error } = await res.json();
        if (error) throw new Error(error);
  
        return { data };
      } catch (error: any) {
        return { error: error.message };
      }
    }
  
    // Rest of the service methods remain the same...
    async evaluateVoicePersonality(text: string): Promise<EvaluationResult<VoicePersonalityEvaluation>> {
      return this.makeRequest<VoicePersonalityEvaluation>('voicePersonality', text);
    }
  
    async evaluateTargetAudience(text: string): Promise<EvaluationResult<TargetAudienceEvaluation>> {
      return this.makeRequest<TargetAudienceEvaluation>('targetAudience', text);
    }
  
    async evaluateMessagingValues(text: string): Promise<EvaluationResult<MessagingValuesEvaluation>> {
      return this.makeRequest<MessagingValuesEvaluation>('messagingValues', text);
    }
  
    async evaluateOverall(text: string): Promise<EvaluationResult<OverallEvaluation>> {
      return this.makeRequest<OverallEvaluation>('overall', text);
    }

    
    async evaluateToneAdjustment(
        text: string, 
        options: ToneAdjustmentOptions
      ): Promise<EvaluationResult<string>> {  // Now just returns string
        try {
          const res = await fetch('/api/evaluate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              text,
              type: 'toneAdjustment',
              options,
              provider: 'anthropic'
            }),
          });
    
          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || `Request failed: ${res.statusText}`);
          }
    
          const { data, error } = await res.json();
          if (error) throw new Error(error);
    
          return { data };
        } catch (error: any) {
          return { error: error.message };
        }
      }
    
  
    async evaluateAll(text: string): Promise<EvaluationResults> {
      const [
        voicePersonalityResult,
        targetAudienceResult,
        messagingValuesResult,
        overallResult
      ] = await Promise.all([
        this.evaluateVoicePersonality(text),
        this.evaluateTargetAudience(text),
        this.evaluateMessagingValues(text),
        this.evaluateOverall(text)
      ]);
  
      const result: EvaluationResults = {};
      const errors: string[] = [];
  
      if (voicePersonalityResult.data) {
        result.voicePersonality = voicePersonalityResult.data;
      }
      if (voicePersonalityResult.error) {
        errors.push(`voicePersonality: ${voicePersonalityResult.error}`);
      }
  
      if (targetAudienceResult.data) {
        result.targetAudience = targetAudienceResult.data;
      }
      if (targetAudienceResult.error) {
        errors.push(`targetAudience: ${targetAudienceResult.error}`);
      }
  
      if (messagingValuesResult.data) {
        result.messagingValues = messagingValuesResult.data;
      }
      if (messagingValuesResult.error) {
        errors.push(`messagingValues: ${messagingValuesResult.error}`);
      }
  
      if (overallResult.data) {
        result.overall = overallResult.data;
      }
      if (overallResult.error) {
        errors.push(`overall: ${overallResult.error}`);
      }
  
      return errors.length > 0 ? { ...result, errors } : result;
    }
  }
  
  export const evaluationService = new EvaluationService();