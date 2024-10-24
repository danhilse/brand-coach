// components/OverallEvaluation.tsx
import type { OverallEvaluation } from '@/lib/types';

export const OverallEvaluationSection = ({ 
  evaluation 
}: { 
  evaluation: OverallEvaluation 
}) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-xl font-bold">Overall Brand Alignment</h3>
      <div className="text-3xl font-bold text-blue-600">
        {evaluation.overallScore.score}/100
      </div>
    </div>

    <div className="prose max-w-none">
      <div className="mb-6">
        <p className="text-gray-700">{evaluation.overallScore.analysis}</p>
      </div>

      <div className="mb-6">
        <h4 className="font-semibold text-lg mb-2">Key Strengths</h4>
        <ul className="list-disc pl-5 space-y-2">
          {evaluation.strengths.map((strength, index) => (
            <li key={index} className="text-gray-700">{strength}</li>
          ))}
        </ul>
      </div>

      <div className="mb-6">
        <h4 className="font-semibold text-lg mb-2">Areas for Improvement</h4>
        <ul className="list-disc pl-5 space-y-2">
          {evaluation.improvementAreas.map((area, index) => (
            <li key={index} className="text-gray-700">{area}</li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="font-semibold text-lg mb-2">Suggestions</h4>
        <ol className="list-decimal pl-5 space-y-2">
          {evaluation.suggestions.map((suggestion, index) => (
            <li key={index} className="text-gray-700">{suggestion}</li>
          ))}
        </ol>
      </div>
    </div>
  </div>
);