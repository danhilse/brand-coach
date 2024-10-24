// components/MessagingValuesSection.tsx
import type { MessagingValuesEvaluation } from '@/lib/types';
import { AnalysisSection } from './AnalysisSection';

interface MessagingValuesSectionProps {
  evaluation: MessagingValuesEvaluation;
}

export const MessagingValuesSection = ({ evaluation }: MessagingValuesSectionProps) => (
  <section className="space-y-6">
    <h2 className="text-2xl font-bold">Messaging & Values</h2>
    
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-bold mb-4">Messaging Pillars</h3>
      {evaluation.messagingAlignment.map((pillar, index) => (
        <AnalysisSection 
          key={index}
          title={pillar.pillar}
          analysis={pillar.analysis}
          score={pillar.score}
          colorClass="bg-indigo-600"
        />
      ))}
    </div>

    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-bold mb-4">Value Alignment</h3>
      {evaluation.valueAlignment.map((value, index) => (
        <AnalysisSection 
          key={index}
          title={value.value}
          analysis={value.analysis}
          score={value.score}
          colorClass="bg-teal-600"
        />
      ))}
    </div>
  </section>
);