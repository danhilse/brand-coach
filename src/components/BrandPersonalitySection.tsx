// components/BrandPersonalitySection.tsx
import type { VoicePersonalityEvaluation } from '@/lib/types';
import { AnalysisSection } from './AnalysisSection';

interface BrandPersonalitySectionProps {
  personalityEvaluation: VoicePersonalityEvaluation['personalityEvaluation'];
}

export const BrandPersonalitySection = ({ 
  personalityEvaluation 
}: BrandPersonalitySectionProps) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <h3 className="text-xl font-bold mb-4">Brand Personality</h3>
    <AnalysisSection 
      title="Supportive Challenger"
      analysis={personalityEvaluation.supportiveChallenger.analysis}
      score={personalityEvaluation.supportiveChallenger.score}
      colorClass="bg-purple-600"
    />
    <AnalysisSection 
      title="White-Collar Mechanic"
      analysis={personalityEvaluation.whiteCollarMechanic.analysis}
      score={personalityEvaluation.whiteCollarMechanic.score}
      colorClass="bg-purple-600"
    />
  </div>
); 