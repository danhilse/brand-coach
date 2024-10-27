// page.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { ApiProvider } from '@/lib/types';
import { evaluateAll } from '@/lib/services/evaluationService';
import type { 
  VoicePersonalityEvaluation, 
  TargetAudienceEvaluation,
  MessagingValuesEvaluation,
  OverallEvaluation 
} from '@/lib/types';
import type { 
  Platform
} from '@/components/ContentContext';
import { DocumentInput } from '@/components/DocumentInput';
import { BrandPersonalitySection } from '@/components/BrandPersonalitySection';
import { VoiceAnalysisSection } from '@/components/VoiceAnalysisSection';
import { ToneSpectrumSection } from '@/components/ToneSpectrumSection';
import { TargetAudienceMatrix } from '@/components/TargetAudienceMatrix';
import { MessagingValuesSection } from '@/components/MessagingValuesSection';
import { OverallEvaluationSection } from '@/components/OverallEvaluation';
import { LoadingState } from '@/components/ui/LoadingState';
import { LoadingButton } from '@/components/ui/LoadingButton';

interface Evaluation {
  voicePersonality?: VoicePersonalityEvaluation;
  targetAudience?: TargetAudienceEvaluation;
  messagingValues?: MessagingValuesEvaluation;
  overall?: OverallEvaluation;
}

export default function Home() {
  const [input, setInput] = useState('');
  const [platform, setPlatform] = useState<Platform>('General');
  const [goals, setGoals] = useState('');
  const [evaluation, setEvaluation] = useState<Evaluation>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');


  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    
    setIsLoading(true);
    setError('');
    setEvaluation({});

    try {
      const result = await evaluateAll(input, platform, goals); // Update evaluateAll to accept platform and goals
      setEvaluation(result);
      console.log(result);
    } catch (err: any) {
      setError(err.message || 'An error occurred during evaluation');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="container-acton py-8">
      <div>
        <div className="mb-6 flex pt-8">
          <Image 
            src="/logo.svg" 
            alt="Logo" 
            width={200} 
            height={0} 
            priority 
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          <DocumentInput 
            value={input}
            platform={platform}
            goals={goals}
            onChange={setInput}
            onPlatformChange={setPlatform}
            onGoalsChange={setGoals}
            onError={setError}
          />
          
          <LoadingButton
            type="submit"
            isLoading={isLoading}
            disabled={!input.trim()}
            className="w-full"
          >
            Evaluate
          </LoadingButton>
        </form> 

        {error && (
          <div className="bg-[var(--alert-base)] bg-opacity-10 border border-[var(--alert-base)] text-[var(--alert-base)] px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {isLoading ? (
          <LoadingState />
        ) : evaluation.overall && (
          <div className="space-y-8">
            <OverallEvaluationSection evaluation={evaluation.overall} />
            
            {evaluation.voicePersonality && (
              <section className="space-y-6">
                <h2>Voice & Personality</h2>
                <BrandPersonalitySection 
                  personalityEvaluation={evaluation.voicePersonality.personalityEvaluation} 
                />
                <ToneSpectrumSection 
                  toneEvaluation={evaluation.voicePersonality.toneEvaluation}
                  content={input}
                />
                <VoiceAnalysisSection 
                  voiceEvaluation={evaluation.voicePersonality.voiceEvaluation} 
                />
              </section>
            )}

            {evaluation.messagingValues && (
              <MessagingValuesSection evaluation={evaluation.messagingValues} />
            )}
            
            {evaluation.targetAudience && (
              <section className="space-y-6">
                <h2>Target Audience</h2>
                <TargetAudienceMatrix evaluation={evaluation.targetAudience} />
              </section>
            )}
          </div>
        )}
      </div>
    </main>
  );
}