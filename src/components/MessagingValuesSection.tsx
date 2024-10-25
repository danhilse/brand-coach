// components/MessagingValuesSection.tsx
import type { MessagingValuesEvaluation } from '@/lib/types';
import { AnalysisSection } from './AnalysisSection';
import { Card } from './Card';

interface MessagingValuesSectionProps {
  evaluation: MessagingValuesEvaluation;
}

export const MessagingValuesSection = ({ evaluation }: MessagingValuesSectionProps) => {
  return (
    <section className="space-y-6">
      <h2 className="text-[28px] leading-[40px] font-semibold text-[var(--text)]">
        Messaging & Values
      </h2>
      
      <Card>
        <h3 className="text-[24px] leading-[36px] font-semibold text-[var(--text)] mb-4">
          Messaging Pillars
        </h3>
        {evaluation.messagingAlignment.map((pillar, index) => (
          <AnalysisSection 
            key={index}
            title={pillar.pillar}
            analysis={pillar.analysis}
            score={pillar.score}
            colorClass="blue"
          />
        ))}
      </Card>

      <Card>
        <h3 className="text-[24px] leading-[36px] font-semibold text-[var(--text)] mb-4">
          Value Alignment
        </h3>
        {evaluation.valueAlignment.map((value, index) => (
          <AnalysisSection 
            key={index}
            title={value.value}
            analysis={value.analysis}
            score={value.score}
            colorClass="teal"
          />
        ))}
      </Card>
    </section>
  );
};
