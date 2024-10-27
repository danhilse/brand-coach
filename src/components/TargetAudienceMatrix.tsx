// components/TargetAudienceMatrix.tsx
import type { TargetAudienceEvaluation } from '@/lib/types';
import { Card } from './Card';

interface QuadrantTextProps {
  title: string;
  description: string;
  className: string;
}

const QuadrantText = ({ 
  title, 
  description, 
  className 
}: QuadrantTextProps) => (
  <div className={`absolute w-[45%] h-[45%] flex flex-col justify-center ${className}`}>
    <div className="font-semibold mb-2 text-center text-[14px] leading-[20px] text-[var(--text)]">
      {title}
    </div>
    <div className="text-[12px] leading-[18px] text-[var(--text-light)] text-center">
      {description}
    </div>
  </div>
);

interface AxisLabelProps {
  text: string;
  className: string;
}

const AxisLabel = ({ 
  text, 
  className 
}: AxisLabelProps) => (
  <div className={`absolute text-[var(--text-light)] text-[12px] leading-[18px] ${className}`}>
    {text}
  </div>
);

export const TargetAudienceMatrix = ({ evaluation }: { evaluation: TargetAudienceEvaluation }) => {
  return (
    <Card>
      <h3 className="text-[24px] leading-[36px] font-semibold text-[var(--text)] mb-6">
        Target Audience Analysis
      </h3>
      
      {/* Updated container with a max-width that matches Act-On's specs */}
      <div className="flex justify-center mb-6">
        <div className="relative w-full max-w-[550px] aspect-square">
          {/* Axes */}
          <div className="absolute left-0 top-1/2 w-full h-px bg-[var(--border)]">
            {/* Left arrow */}
            <div className="absolute left-0 -translate-y-1/2">
              <svg width="12" height="12" className="text-[var(--border)]">
                <path d="M12 6H2M2 6L7 1M2 6L7 11" stroke="currentColor" fill="none" strokeWidth="1.5"/>
              </svg>
            </div>
            {/* Right arrow */}
            <div className="absolute right-0 -translate-y-1/2">
              <svg width="12" height="12" className="text-[var(--border)]">
                <path d="M0 6H10M10 6L5 1M10 6L5 11" stroke="currentColor" fill="none" strokeWidth="1.5"/>
              </svg>
            </div>
          </div>
          <div className="absolute left-1/2 top-0 w-px h-full bg-[var(--border)]">
            {/* Top arrow */}
            <div className="absolute -translate-x-1/2 top-0">
              <svg width="12" height="12" className="text-[var(--border)]">
                <path d="M6 12V2M6 2L1 7M6 2L11 7" stroke="currentColor" fill="none" strokeWidth="1.5"/>
              </svg>
            </div>
            {/* Bottom arrow */}
            <div className="absolute -translate-x-1/2 bottom-0">
              <svg width="12" height="12" className="text-[var(--border)]">
                <path d="M6 0V10M6 10L1 5M6 10L11 5" stroke="currentColor" fill="none" strokeWidth="1.5"/>
              </svg>
            </div>
          </div>

          {/* Axis Labels */}
          <AxisLabel 
            text="DISENFRANCHISED" 
            className="left-1/2 -top-6 transform -translate-x-1/2 text-center"
          />
          <AxisLabel 
            text="GRADUATOR" 
            className="left-1/2 -bottom-6 transform -translate-x-1/2 text-center"
          />
          <AxisLabel 
            text="USER" 
            className="top-1/2 -left-10 transform -translate-y-1/2 text-center"
          />
          <AxisLabel 
            text="BUYER" 
            className="top-1/2 -right-12 transform -translate-y-1/2 text-center"
          />

          {/* Quadrant Text */}
          <QuadrantText
            title="THE 'DISENFRANCHISED' USER"
            description="Experience marketing automation user that's frustrated with their existing software platform. Looking for solutions that make their jobs easier."
            className="left-[-2.5%] top-[2.5%]"
          />
          
          <QuadrantText
            title="THE 'DISENFRANCHISED' BUYER"
            description="Marketing leader that is replacing an existing marketing automation platform. They have to lower their lower costs due to budgetary pressure, and they have to prove marketing's ROI; migration is a point of friction."
            className="right-[-2.5%] top-[2.5%]"
          />
          
          <QuadrantText
            title="THE 'GRADUATOR' USER"
            description="A user that is new to marketing automation. They don't know what's possible since they haven't done it before, but they know what they want to do. Need software to achieve that desire, and education on how to use that software."
            className="left-[-2.5%] bottom-[2.5%]"
          />
          
          <QuadrantText
            title="THE 'GRADUATOR' BUYER"
            description="Marketing leader that is building a new department, or graduating to marketing automation platforms in order to automate and scale their marketing efforts."
            className="right-[-2.5%] bottom-[2.5%]"
          />

          {/* Position Indicator */}
          <div 
            className="absolute w-3 h-3 bg-[var(--primary-base)] rounded-full transform -translate-x-1/2 -translate-y-1/2"
            style={{ 
              left: `${evaluation.userBuyerFocus.score}%`, 
              top: `${evaluation.customerTypeFocus.score}%` 
            }}
          >
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full bg-[var(--table-hover-1)] text-[var(--primary-base)] px-2 py-1 rounded text-[12px] leading-[18px] whitespace-nowrap font-semibold">
              ({evaluation.userBuyerFocus.score}, {evaluation.customerTypeFocus.score})
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-[18px] leading-[26px] font-semibold text-[var(--text)] mb-2">
            User vs. Buyer Focus
          </h4>
          <p className="text-[14px] leading-[20px] text-[var(--text-light)]">
            {evaluation.userBuyerFocus.analysis}
          </p>
        </div>
        <div>
          <h4 className="text-[18px] leading-[26px] font-semibold text-[var(--text)] mb-2">
            Customer Type Focus
          </h4>
          <p className="text-[14px] leading-[20px] text-[var(--text-light)]">
            {evaluation.customerTypeFocus.analysis}
          </p>
        </div>
      </div>
    </Card>
  );
};