// components/VoiceAnalysisSection.tsx
import { AnalysisSection } from './AnalysisSection';
import { Card } from './Card';
import type { VoicePersonalityEvaluation } from '@/lib/types';

interface VoiceAnalysisSectionProps {
  voiceEvaluation: VoicePersonalityEvaluation['voiceEvaluation'];
}

export const VoiceAnalysisSection = ({ 
  voiceEvaluation 
}: VoiceAnalysisSectionProps) => (
  <Card>
    <h3 className="text-[24px] leading-[36px] font-semibold text-[var(--text)] mb-4">
      Voice Analysis
    </h3>
    <AnalysisSection 
      title="Natural & Conversational"
      analysis={voiceEvaluation.naturalConversational.analysis}
      score={voiceEvaluation.naturalConversational.score}
      colorClass="primary"
    />
    <AnalysisSection 
      title="Authentic & Approachable"
      analysis={voiceEvaluation.authenticApproachable.analysis}
      score={voiceEvaluation.authenticApproachable.score}
      colorClass="primary"
    />
    <AnalysisSection 
      title="Gender-Neutral & Inclusive"
      analysis={voiceEvaluation.genderNeutral.analysis}
      score={voiceEvaluation.genderNeutral.score}
      colorClass="primary"
    />
    <AnalysisSection 
      title="Channel-Appropriate"
      analysis={voiceEvaluation.channelTailored.analysis}
      score={voiceEvaluation.channelTailored.score}
      colorClass="primary"
    />
  </Card>
);