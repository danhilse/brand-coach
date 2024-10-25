// components/BrandPersonalitySection.tsx
import type { VoicePersonalityEvaluation } from '@/lib/types';
import { AnalysisSection } from './AnalysisSection';
import { Card } from './Card';

interface BrandPersonalitySectionProps {
  personalityEvaluation: VoicePersonalityEvaluation['personalityEvaluation'];
}

export const BrandPersonalitySection = ({ 
  personalityEvaluation 
}: BrandPersonalitySectionProps) => (
  <Card>
    <h3 className="text-[24px] leading-[36px] font-semibold text-[var(--text)] mb-4">
      Brand Personality
    </h3>
    <AnalysisSection 
      title="Supportive Challenger"
      analysis={personalityEvaluation.supportiveChallenger.analysis}
      score={personalityEvaluation.supportiveChallenger.score}
      colorClass="purple"
    />
    <AnalysisSection 
      title="White-Collar Mechanic"
      analysis={personalityEvaluation.whiteCollarMechanic.analysis}
      score={personalityEvaluation.whiteCollarMechanic.score}
      colorClass="purple"
    />
  </Card>
);