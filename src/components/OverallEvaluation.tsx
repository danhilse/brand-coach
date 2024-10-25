// components/OverallEvaluation.tsx
import type { OverallEvaluation } from '@/lib/types';
import { Card } from './Card';

export const OverallEvaluationSection = ({ 
  evaluation 
}: { 
  evaluation: OverallEvaluation 
}) => (
  <Card>
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-[24px] leading-[36px] font-semibold text-[var(--text)]">
        Overall Brand Alignment
      </h3>
      <div className="text-[28px] leading-[40px] font-bold text-[var(--primary-base)]">
        {evaluation.overallScore.score}/100
      </div>
    </div>

    <div className="space-y-6">
      <div>
        <p className="text-[14px] leading-[20px] text-[var(--text-light)]">
          {evaluation.overallScore.analysis}
        </p>
      </div>

      <div>
        <h4 className="text-[18px] leading-[26px] font-semibold text-[var(--text)] mb-2">
          Key Strengths
        </h4>
        <ul className="list-disc pl-5 space-y-2">
          {evaluation.strengths.map((strength, index) => (
            <li key={index} className="text-[14px] leading-[20px] text-[var(--text-light)]">
              {strength}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="text-[18px] leading-[26px] font-semibold text-[var(--text)] mb-2">
          Areas for Improvement
        </h4>
        <ul className="list-disc pl-5 space-y-2">
          {evaluation.improvementAreas.map((area, index) => (
            <li key={index} className="text-[14px] leading-[20px] text-[var(--text-light)]">
              {area}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="text-[18px] leading-[26px] font-semibold text-[var(--text)] mb-2">
          Suggestions
        </h4>
        <ol className="list-decimal pl-5 space-y-2">
          {evaluation.suggestions.map((suggestion, index) => (
            <li key={index} className="text-[14px] leading-[20px] text-[var(--text-light)]">
              {suggestion}
            </li>
          ))}
        </ol>
      </div>
    </div>
  </Card>
);