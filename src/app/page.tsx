'use client';

import { useState } from 'react';
import type { 
  VoicePersonalityEvaluation, 
  TargetAudienceEvaluation,
  OverallEvaluation 
} from '@/lib/types';
import { 
  parseVoicePersonalityEvaluation, 
  parseTargetAudienceEvaluation,
  parseOverallEvaluation 
} from '@/lib/parsers'; // Updated import from parsers instead of prompts
import { BrandPersonalitySection } from '@/components/BrandPersonalitySection';
import { VoiceAnalysisSection } from '@/components/VoiceAnalysisSection';
import { TargetAudienceMatrix } from '@/components/TargetAudienceMatrix';
import { OverallEvaluationSection } from '@/components/OverallEvaluation';

interface Evaluation {
  voicePersonality: VoicePersonalityEvaluation;
  targetAudience: TargetAudienceEvaluation;
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
      if (data.error) throw new Error(data.error);
      
      const evaluation = {
        voicePersonality: parseVoicePersonalityEvaluation(data.voicePersonality),
        targetAudience: parseTargetAudienceEvaluation(data.targetAudience),
        overall: parseOverallEvaluation(data.overall)
      };
      
      setEvaluation(evaluation);
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to evaluate text. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Brand Coach</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          <div>
            <label htmlFor="text" className="block text-sm font-medium mb-2">
              Enter text to evaluate:
            </label>
            <textarea
              id="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full min-h-[200px] p-3 border rounded-lg"
              placeholder="Paste your text here..."
            />
          </div>
          
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
            {/* Overall Evaluation */}
            <OverallEvaluationSection evaluation={evaluation.overall} />

            {/* Voice & Personality Section */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold">Voice & Personality</h2>
              <BrandPersonalitySection personalityEvaluation={evaluation.voicePersonality.personalityEvaluation} />
              <VoiceAnalysisSection voiceEvaluation={evaluation.voicePersonality.voiceEvaluation} />
            </section>

            {/* Target Audience Section */}
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