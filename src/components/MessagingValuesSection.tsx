import { useState } from 'react';
import type { MessagingValuesEvaluation, Rating } from '@/lib/types';
import { Card } from './Card';
import { ChevronDown, ChevronUp } from 'lucide-react';


interface RatingBadgeProps {
  rating: 'strong' | 'moderate' | 'not_present' | 'needs_work';
}

const RatingBadge = ({ rating }: RatingBadgeProps) => {
  const styles = {
    strong: {
      background: 'rgba(105, 180, 102, 0.1)', // --success-base with 10% opacity
      text: 'rgb(105, 180, 102)' // --success-base
    },
    moderate: {
      background: 'rgba(255, 205, 0, 0.1)', // --warning-base with 10% opacity
      text: 'rgb(255, 205, 0)' // --warning-base
    },
    not_present: {
      background: 'rgba(242, 86, 86, 0.1)', // --alert-base with 10% opacity
      text: 'rgb(242, 86, 86)' // --alert-base
    },
    needs_work: {
      background: 'rgba(242, 86, 86, 0.1)', // --alert-base with 10% opacity
      text: 'rgb(242, 86, 86)' // --alert-base
    }
  } as const;

  const style = styles[rating];

  return (
    <span 
      className={`
        inline-flex items-center px-3 py-1 rounded
        text-[12px] leading-[18px] font-semibold
        capitalize
      `}
      style={{
        backgroundColor: style.background,
        color: style.text
      }}
    >
      {rating.replace('_', ' ')}
    </span>
  );
};

interface ValueAnalysisSectionProps {
  title: string;
  analysis: {
    rating: Rating;  // Now using the Rating type that includes all values
    rationale: string;
    keyEvidence?: string[];
  };
}

const ValueAnalysisSection = ({ title, analysis }: ValueAnalysisSectionProps) => (
  <div className="bg-[#F7F9FB] rounded-tl-lg rounded-br-lg p-8 h-full">
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <h4 className="text-[18px] leading-[30px] font-bold text-[var(--text)]">{title}</h4>
        <RatingBadge rating={analysis.rating} />
      </div>
      <p className="text-[12px] leading-[20px] text-[var(--text-dark)]">{analysis.rationale}</p>
      {analysis.keyEvidence && analysis.keyEvidence.length > 0 && (
        <div>
          <h5 className="text-[14px] leading-[20px] font-semibold text-[var(--text)] mb-2">
            Key Evidence:
          </h5>
          <ul className="space-y-2">
            {analysis.keyEvidence.map((evidence, index) => (
              <li 
                key={index}
                className="text-[12px] leading-[16px] text-[var(--text-light)] pl-4 relative before:content-['•'] before:absolute before:left-0"
              >
                {evidence}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  </div>
);

interface MessagePointSectionProps {
  title: string;
  point: {
    rating: 'strong' | 'moderate' | 'not_present' | 'needs_work';
    rationale: string;
  };
}


interface MessagingPillarProps {
  title: string;
  points: Record<string, {
    rating: 'strong' | 'moderate' | 'not_present' | 'needs_work';
    rationale: string;
  }>;
}

const MessagePointSection = ({ title, point }: MessagePointSectionProps) => {
  const ratingStyles = {
    strong: {
      border: 'rgb(105, 180, 102)', // --success-base
      background: 'rgba(105, 180, 102, 0.1)' // --success-base with 10% opacity
    },
    moderate: {
      border: 'rgb(255, 205, 0)', // --warning-base
      background: 'rgba(255, 205, 0, 0.1)' // --warning-base with 10% opacity
    },
    not_present: {
      border: 'rgb(242, 86, 86)', // --alert-base
      background: 'rgba(242, 86, 86, 0.1)' // --alert-base with 10% opacity
    },
    needs_work: {  // Add this case
      border: 'rgb(242, 86, 86)', // --alert-base
      background: 'rgba(242, 86, 86, 0.1)' // --alert-base with 10% opacity
    }
  } as const;  // 

  const style = ratingStyles[point.rating];

  return (
    <div 
      className="rounded-lg p-6 flex-1"
      style={{
        backgroundColor: style.background,
        border: `1px solid ${style.border}`
      }}
    >
      <div>
        <div className="text-[#949494] text-[10px] leading-[18px] uppercase tracking-wider">
          SUPPORTING POINT
        </div>
        <h5 className="text-[14px] leading-[20px] font-bold text-[var(--text)] mt-1 mb-3">
          {title}
        </h5>
        <p className="text-[12px] leading-[20px] text-[var(--text-light)]">
          {point.rationale}
        </p>
      </div>
    </div>
  );
};

const MessagingPillar = ({ title, points }: MessagingPillarProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="space-y-4">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-left p-2 rounded-lg transition-colors"
      >
        <div>
          <div className="text-[#949494] text-[12px] leading-[18px] uppercase tracking-wider mb-1">
            PILLAR
          </div>
          <h4 className="text-[18px] leading-[26px] font-bold text-[var(--text)]">{title}</h4>
        </div>
        {isExpanded ? (
          <ChevronUp className="text-[var(--text-light)] w-5 h-5" />
        ) : (
          <ChevronDown className="text-[var(--text-light)] w-5 h-5" />
        )}
      </button>
      
      {isExpanded && (
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(points).map(([title, point]) => (
            <MessagePointSection
              key={title}
              title={title}
              point={point}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface MessagingValuesSectionProps {
  evaluation: MessagingValuesEvaluation;
}

export const MessagingValuesSection = ({ evaluation }: MessagingValuesSectionProps) => {
  return (
    <section className="space-y-8">
      <h2 className="text-[28px] leading-[40px] font-semibold text-[var(--text)]">
        Messaging & Values
      </h2>
      
      <Card>
        <h3 className="text-[24px] leading-[36px] font-semibold text-[var(--text)] mb-2">
          Core Values
        </h3>
        <div className="grid grid-cols-2 gap-6">
          {Object.entries(evaluation.values).map(([value, analysis]) => (
            <ValueAnalysisSection 
              key={value}
              title={value}
              analysis={analysis}
            />
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="text-[24px] leading-[36px] font-semibold text-[var(--text)] mb-6">
          Messaging Framework
        </h3>
        <div className="space-y-6">
          {Object.entries(evaluation.messaging).map(([pillar, points]) => (
            <MessagingPillar
              key={pillar}
              title={pillar}
              points={points}
            />
          ))}
        </div>
      </Card>
    </section>
  );
};