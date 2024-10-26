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

import { formatToneSpectrumAdjustment } from '@/lib/prompts';


interface Evaluation {
  voicePersonality: VoicePersonalityEvaluation;
  targetAudience: TargetAudienceEvaluation;
  messagingValues: MessagingValuesEvaluation;
  overall: OverallEvaluation;
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
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeApi, setActiveApi] = useState<'anthropic' | 'openai'>('anthropic');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input, api: activeApi }),
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

  const handleSpectrumSectionClick = async (section: SpectrumSection) => {
    try {
      // Extract percentages from the section labels
      const challengingPercentage = parseInt(section.label.top.split('%')[0]);
      const supportivePercentage = parseInt(section.label.bottom.split('%')[0]);
      
      // Format content types
      const contentTypes = section.content.map(c => c.replace('-', '').trim());
  
      // Use the prompt function with the correct parameters
      const prompt = formatToneSpectrumAdjustment(input, {
        challengingPercentage,
        supportivePercentage
      });
  
      const res = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: prompt,
          api: activeApi 
        }),
      });
  
      if (!res.ok) {
        throw new Error('Failed to analyze tone section');
      }
  
      const data = await res.json();
      return data.overall;
    } catch (error) {
      console.error('Tone Analysis Error:', error);
      throw new Error('Failed to analyze tone section');
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
              originalContent={input} // Pass the original content
              onSectionClick={handleSpectrumSectionClick}
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