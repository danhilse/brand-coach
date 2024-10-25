'use client';

import { useState } from 'react';
import type { 
  VoicePersonalityEvaluation, 
  TargetAudienceEvaluation,
  MessagingValuesEvaluation,
  OverallEvaluation 
} from '@/lib/types';
import { 
  parseVoicePersonalityEvaluation, 
  parseTargetAudienceEvaluation,
  parseMessagingValuesEvaluation,
  parseOverallEvaluation 
} from '@/lib/parsers';
import { DocumentInput } from '@/components/DocumentInput';
import { BrandPersonalitySection } from '@/components/BrandPersonalitySection';
import { VoiceAnalysisSection } from '@/components/VoiceAnalysisSection';
import { ToneSpectrumSection } from '@/components/ToneSpectrumSection';
import { TargetAudienceMatrix } from '@/components/TargetAudienceMatrix';
import { MessagingValuesSection } from '@/components/MessagingValuesSection';
import { OverallEvaluationSection } from '@/components/OverallEvaluation';

interface Evaluation {
  voicePersonality: VoicePersonalityEvaluation;
  targetAudience: TargetAudienceEvaluation;
  messagingValues: MessagingValuesEvaluation;
  overall: OverallEvaluation;
}

export default function Home() {
  const [input, setInput] = useState('');
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError('');
  
    try {
      const res = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.details || data.error || 'An error occurred');
      }
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      const evaluation = {
        voicePersonality: parseVoicePersonalityEvaluation(data.voicePersonality),
        targetAudience: parseTargetAudienceEvaluation(data.targetAudience),
        messagingValues: parseMessagingValuesEvaluation(data.messagingValues),
        overall: parseOverallEvaluation(data.overall)
      };
      
      setEvaluation(evaluation);
    } catch (error: any) {
      console.error('Error details:', error);
      setError(error.message || 'Failed to evaluate text. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Brand Coach</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          <DocumentInput 
            value={input}
            onChange={setInput}
            onError={setError}
          />
          
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Evaluating...' : 'Evaluate'}
          </button>
        </form>

        {error && (
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {evaluation && (
          <div className="space-y-8">
            <OverallEvaluationSection evaluation={evaluation.overall} />
            
            <section className="space-y-6">
              <h2 className="text-2xl font-bold">Voice & Personality</h2>
              <BrandPersonalitySection personalityEvaluation={evaluation.voicePersonality.personalityEvaluation} />
              <VoiceAnalysisSection voiceEvaluation={evaluation.voicePersonality.voiceEvaluation} />
              <ToneSpectrumSection toneEvaluation={evaluation.voicePersonality.toneEvaluation} />
            </section>

            <MessagingValuesSection evaluation={evaluation.messagingValues} />
            
            <section className="space-y-6">
              <h2 className="text-2xl font-bold">Target Audience</h2>
              <TargetAudienceMatrix evaluation={evaluation.targetAudience} />
            </section>
          </div>
        )}
      </div>
    </main>
  );
}