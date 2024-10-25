'use client';

import { useState } from 'react';
import Image from 'next/image';
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
      
      if (!res.ok || data.error) {
        console.error('API Error Response:', data);
        throw new Error(
          `Error ${data.errorStatus || res.status}: ${data.details || data.error || 'Unknown error'}\n` +
          `Type: ${data.errorType || 'Unknown'}`
        );
      }
      
      const evaluation = {
        voicePersonality: parseVoicePersonalityEvaluation(data.voicePersonality),
        targetAudience: parseTargetAudienceEvaluation(data.targetAudience),
        messagingValues: parseMessagingValuesEvaluation(data.messagingValues),
        overall: parseOverallEvaluation(data.overall)
      };
      
      setEvaluation(evaluation);
    } catch (error: any) {
      console.error('Evaluation Error:', error);
      setError(error.message || 'Failed to evaluate text. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="container-acton py-8">
      <div>
                {/* Add the logo image here */}
          <div className="mb-6 flex">
            <Image 
              src="/logo.png" 
              alt="Logo" 
              width={150} 
              height={0} 
              priority 
            />
        </div>
        <h1 className="mb-6">Brand Coach</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          <DocumentInput 
            value={input}
            onChange={setInput}
            onError={setError}
          />
          
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="btn-acton btn-acton-primary w-full"
          >
            {isLoading ? 'Evaluating...' : 'Evaluate'}
          </button>
        </form>

        {error && (
          <div className="bg-[var(--alert-base)] bg-opacity-10 border border-[var(--alert-base)] text-[var(--alert-base)] px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {evaluation && (
          <div className="space-y-8">
            <OverallEvaluationSection evaluation={evaluation.overall} />
            
            <section className="space-y-6">
              <h2>Voice & Personality</h2>
              <BrandPersonalitySection 
                personalityEvaluation={evaluation.voicePersonality.personalityEvaluation} 
              />
              <ToneSpectrumSection 
                toneEvaluation={evaluation.voicePersonality.toneEvaluation} 
              />
              <VoiceAnalysisSection 
                voiceEvaluation={evaluation.voicePersonality.voiceEvaluation} 
              />

            </section>

            <MessagingValuesSection evaluation={evaluation.messagingValues} />
            
            <section className="space-y-6">
              <h2>Target Audience</h2>
              <TargetAudienceMatrix evaluation={evaluation.targetAudience} />
            </section>
          </div>
        )}
      </div>
    </main>
  );
}