'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { ApiProvider } from '@/lib/types';


import { evaluationService } from '@/lib/services/evaluationService';
import type { 
  VoicePersonalityEvaluation, 
  TargetAudienceEvaluation,
  MessagingValuesEvaluation,
  OverallEvaluation 
} from '@/lib/types';
import { DocumentInput } from '@/components/DocumentInput';
import { BrandPersonalitySection } from '@/components/BrandPersonalitySection';
import { VoiceAnalysisSection } from '@/components/VoiceAnalysisSection';
import { ToneSpectrumSection } from '@/components/ToneSpectrumSection';
import { TargetAudienceMatrix } from '@/components/TargetAudienceMatrix';
import { MessagingValuesSection } from '@/components/MessagingValuesSection';
import { OverallEvaluationSection } from '@/components/OverallEvaluation';

import { ModelSelector } from '@/components/ModelSelector';


interface Evaluation {
  voicePersonality?: VoicePersonalityEvaluation;
  targetAudience?: TargetAudienceEvaluation;
  messagingValues?: MessagingValuesEvaluation;
  overall?: OverallEvaluation;
}

interface SpectrumSection {
  label: {
    top: string;
    bottom: string;
  };
  content: string[];
  color?: string;
  isMiddle?: boolean;
  threshold: number;
}

export default function Home() {
  const [input, setInput] = useState('');
  const [evaluation, setEvaluation] = useState<Evaluation>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeApi, setActiveApi] = useState<ApiProvider>('anthropic');


  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    
    setIsLoading(true);
    setError('');
    setEvaluation({});

    const result = await evaluationService.evaluateAll(input);
    
    if (result.errors) {
      setError(result.errors.join('; '));
    }
    
    setEvaluation(result);
    setIsLoading(false);
  }

  const handleSpectrumSectionClick = async (section: SpectrumSection) => {
    try {
      const challengingPercentage = parseInt(section.label.top.split('%')[0]);
      const supportivePercentage = parseInt(section.label.bottom.split('%')[0]);
      
      const result = await evaluationService.evaluateToneAdjustment(input, {
        challengingPercentage,
        supportivePercentage
      });
  
      if (result.error) {
        throw new Error(result.error);
      }
  
      return result.data || ''; // Ensure we always return a string
    } catch (error) {
      console.error('Tone Analysis Error:', error);
      return ''; // Return empty string on error
    }
  };
  return (
    <main className="container-acton py-8">
      <div>
        <div className="mb-6 flex pt-8">
          <Image 
            src="/logo.png" 
            alt="Logo" 
            width={200} 
            height={0} 
            priority 
          />

        </div>

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

        {evaluation.overall && (
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
                  originalContent={input}
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