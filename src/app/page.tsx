// app/page.tsx
'use client';

import { useState } from 'react';
import type { VoicePersonalityEvaluation, MessagingValuesEvaluation } from '../lib/types';
import { parseVoicePersonalityEvaluation, parseMessagingValuesEvaluation } from '../lib/prompts';
import { ScoreBar } from '@/components/ScoreBar';
import { AnalysisSection } from '@/components/AnalysisSection';
import { BrandPersonalitySection } from '@/components/BrandPersonalitySection';
import { VoiceAnalysisSection } from '@/components/VoiceAnalysisSection';
import { TargetAudienceAnalysis } from '@/components/TargetAudiencePlot';
 
interface Evaluation {
  voicePersonality: VoicePersonalityEvaluation;
  messagingValues: MessagingValuesEvaluation;
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
        messagingValues: parseMessagingValuesEvaluation(data.messagingValues)
      };
      
      setEvaluation(evaluation);
      console.log('Evaluation:', evaluation); // For debugging
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
            {/* Voice & Personality Section */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold">Voice & Personality</h2>
              <BrandPersonalitySection personalityEvaluation={evaluation.voicePersonality.personalityEvaluation} />
              <VoiceAnalysisSection voiceEvaluation={evaluation.voicePersonality.voiceEvaluation} />
              
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-bold mb-4">Tone Spectrum</h3>
                <p className="text-gray-700 mb-4">{evaluation.voicePersonality.toneEvaluation.analysis}</p>
                <ScoreBar 
                  score={evaluation.voicePersonality.toneEvaluation.score} 
                  label="Supportive ← → Challenging" 
                  colorClass="bg-green-600"
                />
              </div>
            </section>

            {/* Messaging & Values Section */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold">Messaging & Values</h2>
              
              {/* Messaging Pillars */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-bold mb-4">Messaging Pillars</h3>
                {evaluation.messagingValues.messagingAlignment.map((pillar, index) => (
                  <AnalysisSection 
                    key={index}
                    title={pillar.pillar}
                    analysis={pillar.analysis}
                    score={pillar.score}
                    colorClass="bg-indigo-600"
                  />
                ))}
              </div>

              {/* Values */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-bold mb-4">Value Alignment</h3>
                {evaluation.messagingValues.valueAlignment.map((value, index) => (
                  <AnalysisSection 
                    key={index}
                    title={value.value}
                    analysis={value.analysis}
                    score={value.score}
                    colorClass="bg-teal-600"
                  />
                ))}
              </div>

              {/* Target Audience Analysis */}
              <TargetAudienceAnalysis data={evaluation.messagingValues.targetAudience} />
            </section>

            {/* Average Score Section */}
            <section>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-bold mb-4">Overall Brand Alignment</h3>
                {calculateOverallScore(evaluation) && (
                  <ScoreBar 
                    score={calculateOverallScore(evaluation)} 
                    label="Overall Brand Alignment Score" 
                    colorClass="bg-purple-600" 
                  />
                )}
                <p className="text-gray-700 mt-4">
                  This score represents the average alignment across all evaluated dimensions including voice, personality, messaging, and values.
                </p>
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}

function calculateOverallScore(evaluation: Evaluation): number {
  const scores: number[] = [
    // Personality scores
    evaluation.voicePersonality.personalityEvaluation.supportiveChallenger.score,
    evaluation.voicePersonality.personalityEvaluation.whiteCollarMechanic.score,
    
    // Voice scores
    evaluation.voicePersonality.voiceEvaluation.naturalConversational.score,
    evaluation.voicePersonality.voiceEvaluation.authenticApproachable.score,
    evaluation.voicePersonality.voiceEvaluation.genderNeutral.score,
    evaluation.voicePersonality.voiceEvaluation.channelTailored.score,
    
    // Messaging scores
    ...evaluation.messagingValues.messagingAlignment.map(m => m.score),
    
    // Value scores
    ...evaluation.messagingValues.valueAlignment.map(v => v.score)
  ];

  // Calculate average, rounded to nearest integer
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}