import React, { useState, useEffect } from 'react';
import { Card } from './Card';
import { ChevronDown } from 'lucide-react';
import type { BrandEvaluation, Rating, EvaluationSection } from '@/lib/types';

const getRatingStyle = (rating: Rating) => {
  const baseStyle = 'flex items-center gap-2 min-w-[120px]';
  
  switch (rating) {
    case 'strong':
      return `${baseStyle} text-[var(--success-base)] bg-opacity-10`;
    case 'moderate':
      return `${baseStyle} text-[var(--warning-base)] bg-opacity-10`;
    case 'needs_work':
      return `${baseStyle} text-[var(--alert-base)] bg-opacity-10`;
  }
};

const RatingBadge = ({ rating }: { rating: Rating }) => (
  <div className={`${getRatingStyle(rating)} px-3 py-1 rounded`}>
    <div className={`w-2 h-2 rounded-full bg-current`} />
    <span className="text-[12px] leading-[18px] font-semibold">
      {rating.replace('_', ' ').toUpperCase()}
    </span>
  </div>
);

interface AccordionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  rating?: Rating;
}

const Accordion = ({ title, isOpen, onToggle, children, rating }: AccordionProps) => (
  <div className="border border-[var(--border)] rounded-lg last:mb-0 overflow-hidden">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between p-4 text-left bg-[var(--app-background)]"
    >
      <div className="flex items-center justify-between w-full">
        <h4 className="text-[16px] leading-[24px] font-semibold text-[var(--text)] min-w-[200px]">
          {title}
        </h4>
        <div className="flex items-center gap-4">
          {rating && <RatingBadge rating={rating} />}
          <ChevronDown 
            className={`w-5 h-5 text-[var(--text-light)] transition-transform duration-200 ${
              isOpen ? 'transform rotate-180' : ''
            }`}
          />
        </div>
      </div>
    </button>
    {isOpen && (
      <div className="p-6 bg-white border-t border-[var(--border)]">
        {children}
      </div>
    )}
  </div>
);

const PriorityAdjustments = ({ 
  adjustments 
}: { 
  adjustments: BrandEvaluation['guidance']['priorityAdjustments']
}) => (
  <div className="space-y-6">
    {adjustments.map((adjustment, index) => (
      <div 
        key={index} 
        className="p-4 bg-[var(--app-background)] rounded-lg border border-[var(--border)]"
      >
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[var(--primary-base)] text-white font-semibold">
              {index + 1}
            </span>
          </div>
          <div className="space-y-4 flex-grow">
            <h5 className="text-[16px] leading-[24px] font-semibold text-[var(--text)]">
              {adjustment.focus}
            </h5>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <span className="text-[14px] leading-[20px] font-semibold text-[var(--text)]">
                  Current State:
                </span>
                <p className="mt-1 text-[14px] leading-[20px] text-[var(--text-light)]">
                  {adjustment.currentState}
                </p>
              </div>
              <div>
                <span className="text-[14px] leading-[20px] font-semibold text-[var(--text)]">
                  Target State:
                </span>
                <p className="mt-1 text-[14px] leading-[20px] text-[var(--text-light)]">
                  {adjustment.targetState}
                </p>
              </div>
            </div>
            <div>
              <span className="text-[14px] leading-[20px] font-semibold text-[var(--text)]">
                Example:
              </span>
              <p className="mt-1 text-[14px] leading-[20px] text-[var(--text-light)] italic">
                {adjustment.implementationExample}
              </p>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export const BrandEvaluationSection = ({ 
  evaluation 
}: { 
  evaluation: BrandEvaluation 
}) => {
  const [openSections, setOpenSections] = useState({
    brandFit: true,
    audienceAlignment: true,
    toneEffectiveness: true,
    priorityAdjustments: true
  });

  useEffect(() => {
    // Close sections that are rated as 'strong' by default
    setOpenSections(prev => ({
      ...prev,
      brandFit: evaluation.diagnosis.brandFit.rating !== 'strong',
      audienceAlignment: evaluation.diagnosis.audienceAlignment.rating !== 'strong',
      toneEffectiveness: evaluation.diagnosis.toneEffectiveness.rating !== 'strong',
      priorityAdjustments: true // Always open as it doesn't have a rating
    }));
  }, [evaluation]);

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

const EvaluationContent = ({ section }: { section: EvaluationSection }) => (
  <div className="space-y-4">
    <p className="text-[14px] leading-[20px] text-[var(--text)]">
      {section.rationale}
    </p>
    <div className="space-y-2 pl-4">
      {section.keyEvidence.map((evidence, index) => (
        <div key={index} className="pl-5 relative">
          <div className="absolute left-0 top-1.5">
            <div className="w-2 h-2 rounded-full bg-[var(--primary-base)]" />
          </div>
          <p className="text-[14px] leading-[20px] text-[var(--text-light)]">
            {evidence}
          </p>
        </div>
      ))}
    </div>
  </div>
);

  return (
    <Card>
      <h3 className="text-[24px] leading-[36px] font-semibold text-[var(--text)] mb-6">
        Brand Alignment Analysis
      </h3>
      

      <div className="space-y-2">
        <Accordion 
          title="Brand Fit" 
          isOpen={openSections.brandFit}
          onToggle={() => toggleSection('brandFit')}
          rating={evaluation.diagnosis.brandFit.rating}
        >
          <EvaluationContent section={evaluation.diagnosis.brandFit} />
        </Accordion>

        <Accordion 
          title="Audience Alignment" 
          isOpen={openSections.audienceAlignment}
          onToggle={() => toggleSection('audienceAlignment')}
          rating={evaluation.diagnosis.audienceAlignment.rating}
        >
          <EvaluationContent section={evaluation.diagnosis.audienceAlignment} />
        </Accordion>

        <Accordion 
          title="Tone Effectiveness" 
          isOpen={openSections.toneEffectiveness}
          onToggle={() => toggleSection('toneEffectiveness')}
          rating={evaluation.diagnosis.toneEffectiveness.rating}
        >
          <EvaluationContent section={evaluation.diagnosis.toneEffectiveness} />
        </Accordion>
        <h3 className="pt-10 pb-4">Priority Adjustments</h3>
        {/* <Accordion 
          title="Priority Adjustments" 
          isOpen={openSections.priorityAdjustments}
          onToggle={() => toggleSection('priorityAdjustments')}
        >
          </Accordion> */}
          <PriorityAdjustments adjustments={evaluation.guidance.priorityAdjustments} />
        
      </div>
    </Card>
  );
};

export default BrandEvaluationSection;