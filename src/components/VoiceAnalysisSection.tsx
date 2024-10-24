// components/VoiceAnalysisSection.tsx
import { AnalysisSection } from './AnalysisSection';
import type { VoicePersonalityEvaluation } from '@/lib/types';

interface VoiceAnalysisSectionProps {
  voiceEvaluation: VoicePersonalityEvaluation['voiceEvaluation'];
}

export const VoiceAnalysisSection = ({ 
  voiceEvaluation 
}: VoiceAnalysisSectionProps) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <h3 className="text-xl font-bold mb-4">Voice Analysis</h3>
    <AnalysisSection 
      title="Natural & Conversational"
      analysis={voiceEvaluation.naturalConversational.analysis}
      score={voiceEvaluation.naturalConversational.score}
      colorClass="bg-blue-600"
    />
    <AnalysisSection 
      title="Authentic & Approachable"
      analysis={voiceEvaluation.authenticApproachable.analysis}
      score={voiceEvaluation.authenticApproachable.score}
      colorClass="bg-blue-600"
    />
    <AnalysisSection 
      title="Gender-Neutral & Inclusive"
      analysis={voiceEvaluation.genderNeutral.analysis}
      score={voiceEvaluation.genderNeutral.score}
      colorClass="bg-blue-600"
    />
    <AnalysisSection 
      title="Channel-Appropriate"
      analysis={voiceEvaluation.channelTailored.analysis} // Fixed the typo here
      score={voiceEvaluation.channelTailored.score}      // And here
      colorClass="bg-blue-600"
    />
  </div>
);