// components/AnalysisSection.tsx
import { ScoreBar } from './ScoreBar';

interface AnalysisSectionProps {
  title: string;
  analysis: string;
  score: number;
  colorClass?: 'primary' | 'teal' | 'purple' | 'blue';
}

export const AnalysisSection = ({ 
  title, 
  analysis, 
  score,
  colorClass = 'primary'
}: AnalysisSectionProps) => (
  <div className="mb-6">
    <h3 className="text-[18px] leading-[26px] font-semibold text-[var(--text)] mb-2">
      {title}
    </h3>
    <ScoreBar score={score} label="Score" colorClass={colorClass} />
    <p className="text-[14px] leading-[20px] text-[var(--text-light)]">
      {analysis}
    </p>
  </div>
);