// components/AnalysisSection.tsx
import { ScoreBar } from './ScoreBar';

interface AnalysisSectionProps {
  title: string;
  analysis: string;
  score: number;
  colorClass?: string;
}

export const AnalysisSection = ({ 
  title, 
  analysis, 
  score,
  colorClass
}: AnalysisSectionProps) => (
  <div className="mb-6">
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <ScoreBar score={score} label="Score" colorClass={colorClass} />
    <p className="text-gray-700">{analysis}</p>
  </div>
);
