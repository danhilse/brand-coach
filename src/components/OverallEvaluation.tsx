import React, { useState } from 'react';
import { Card } from './Card';
import { ChevronDown } from 'lucide-react';

type EvaluationItem = {
  description: string;
  example: string;
};

type OverallEvaluation = {
  overallScore: {
    analysis: string;
    score: number;
  };
  strengths: EvaluationItem[];
  improvementAreas: EvaluationItem[];
  suggestions: EvaluationItem[];
};

interface AccordionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}



const Accordion = ({ title, isOpen, onToggle, children }: AccordionProps) => (
  
  <div className="">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between py-4 text-left"
    >
      <h4 className="text-[18px] leading-[26px] font-semibold text-[var(--text)]">
        {title}
      </h4>
      <ChevronDown 
        className={`w-5 h-5 text-[var(--text)] transition-transform duration-200 ${
          isOpen ? 'transform rotate-180' : ''
        }`}
      />
    </button>
    {isOpen && <div className="pb-6">{children}</div>}
  </div>
);



const EvaluationList = ({
  items,
  type
}: {
  items: EvaluationItem[];
  type: 'bullet' | 'number';
}) => (
  <div className="space-y-4 pl-4">
    {items.map((item, index) => (
      <div key={index} className="pl-10 relative">
        <div className="absolute left-0 top-1.5">
          {type === 'bullet' ? (
            <div className="w-2 h-2 rounded-full bg-[var(--primary-base)]" />
          ) : (
            <div className="absolute left-0 top-[-9px]">
              <span className="text-[var(--primary-base)] text-[20px] leading-[30px] font-semibold">
                {index + 1}.
              </span>
            </div>
          )}
        </div>
        <div className="space-y-2">
          <p className="text-[14px] leading-[20px] font-medium text-[var(--text)]">
            {item.description}
          </p>
          <div className="space-x-1">
            <span className="text-[13px] leading-[19px] text-[var(--text)]">
              Example:
            </span>
            <span className="text-[13px] leading-[19px] text-[var(--text-light)] italic">
              {item.example}
            </span>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export const OverallEvaluationSection = ({ 
  evaluation 
}: { 
  evaluation: OverallEvaluation 
}) => {
  const [openSections, setOpenSections] = useState({
    strengths: false,
    improvements: false,
    recommendations: true
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[24px] leading-[36px] font-semibold text-[var(--text)]">
          Brand Alignment Analysis
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-[14px] leading-[20px] text-[var(--text-light)]">
            Score
          </span>
          <div className="text-[28px] leading-[40px] font-bold text-[var(--primary-base)]">
            {evaluation.overallScore.score}/100
          </div>
        </div>
      </div>

      <div className="mb-8">
        <p className="text-[14px] leading-[22px] text-[var(--text)]">
          {evaluation.overallScore.analysis}
        </p>
      </div>

      <div className="">


        <Accordion 
          title="Recommendations" 
          isOpen={openSections.recommendations}
          onToggle={() => toggleSection('recommendations')}
        >
          <EvaluationList items={evaluation.suggestions} type="number" />
        </Accordion>

        <Accordion 
          title="Key Strengths" 
          isOpen={openSections.strengths}
          onToggle={() => toggleSection('strengths')}
        >
          <EvaluationList items={evaluation.strengths} type="bullet" />
        </Accordion>

        <Accordion 
          title="Areas for Improvement" 
          isOpen={openSections.improvements}
          onToggle={() => toggleSection('improvements')}
        >
          <EvaluationList items={evaluation.improvementAreas} type="bullet" />
        </Accordion>
      </div>
    </Card>
  );
};

export default OverallEvaluationSection;