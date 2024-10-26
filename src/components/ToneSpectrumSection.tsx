// components/ToneSpectrumSection.tsx
import React, { useState } from 'react';
import { Card } from './Card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { adjustToneSpectrum } from '@/lib/services/evaluationService';

interface ToneEvaluation {
    analysis: string;
    score: number;
  }
  
  interface SpectrumSection {
    label: { 
      top: string;
      bottom: string;
    };
    content: string[];
    color?: string;
    isMiddle?: boolean;
    threshold: number;
  }
  
  interface PhrasingChange {
    original: string;
    suggested: string;
    rationale: string;
  }
  
  interface ToneAdjustmentEvaluation {
    currentStateAnalysis: {
      toneBalance: string;
    //   brandAlignment: string;
    };
    specificAdjustments: {
      phrasingChanges: PhrasingChange[];
    };
    // bestPractices: {
    //   do: string[];
    //   dont: string[];
    // };
    // implementationPriority: {
    //   highImpact: string[];
    //   secondary: string[];
    // };
  }
  
  interface AdditionalAnalysis {
    section: string;
    analysis: ToneAdjustmentEvaluation;
  }
  

const spectrumData: SpectrumSection[] = [
  {
    label: { top: "10% CHALLENGING", bottom: "90% SUPPORTIVE" },
    content: ["-VIDEO", "-SOCIAL", "-ADVERTISING"],
    color: "bg-[#0bbbb4]",
    threshold: 20
  },
  {
    label: { top: "30% CHALLENGING", bottom: "70% SUPPORTIVE" },
    content: ["-BLOGS", "-EMAIL MKTG"],
    color: "bg-[#52c9c4]",
    threshold: 40
  },
  {
    label: { top: "50% CHALLENGING", bottom: "50% SUPPORTIVE" },
    content: ["-WEBINAR", "-EBOOKS", "-PR", "-WEBSITE"],
    isMiddle: true,
    threshold: 60
  },
  {
    label: { top: "70% CHALLENGING", bottom: "30% SUPPORTIVE" },
    content: ["-CUSTOMER MARKETING", "-PRODUCT"],
    color: "bg-[#f07a85]",
    threshold: 80
  },
  {
    label: { top: "90% CHALLENGING", bottom: "10% SUPPORTIVE" },
    content: ["-CS TEAM", "-CONNECT.ACT-ON.COM"],
    color: "bg-[#ef4b5d]",
    threshold: 100
  }
];

const ToneAnalysisSection = ({ 
    title, 
    content 
  }: { 
    title: string;
    content: string;
  }) => (
    <div className="mb-4">
      <h4 className="font-semibold text-[16px] mb-2">{title}</h4>
      <p className="text-[14px] leading-[20px] text-[var(--text-light)]">{content}</p>
    </div>
  );
  
  const PhrasingChangeSection = ({ 
    change 
  }: { 
    change: {
      original: string;
      suggested: string;
      rationale: string;
    }
  }) => (
    <div className="mb-4 p-4 bg-slate-50 rounded-lg">
      <div className="space-y-2">
        <div className="flex gap-2">
          <span className="font-medium text-[var(--text-light)]">Original:</span>
          <span className="text-[var(--text)]">{change.original}</span>
        </div>
        <div className="flex gap-2">
          <span className="font-medium text-[var(--text-light)]">Suggested:</span>
          <span className="text-[var(--text)] text-[var(--primary-base)]">{change.suggested}</span>
        </div>
        <div className="flex gap-2">
          <span className="font-medium text-[var(--text-light)]">Rationale:</span>
          <span className="text-[var(--text-light)]">{change.rationale}</span>
        </div>
      </div>
    </div>
  );
  
  const ListSection = ({ 
    title, 
    items 
  }: { 
    title: string;
    items: string[];
  }) => (
    <div className="mb-4">
      <h4 className="font-semibold text-[16px] mb-2">{title}</h4>
      <ul className="list-disc pl-4 space-y-1">
        {items.map((item, index) => (
          <li key={index} className="text-[14px] leading-[20px] text-[var(--text-light)]">
            {item.replace(/^-\s*/, '')}
          </li>
        ))}
      </ul>
    </div>
  );
  
  const AdditionalAnalysisSection = ({ 
    analysis 
  }: { 
    analysis: ToneAdjustmentEvaluation 
  }) => (
    <div className="space-y-6">
      <div className="space-y-4">
        <ToneAnalysisSection 
          title="Current Tone Balance" 
          content={analysis.currentStateAnalysis.toneBalance} 
        />
        {/* <ToneAnalysisSection 
          title="Brand Alignment" 
          content={analysis.currentStateAnalysis.brandAlignment} 
        /> */}
      </div>
  
      <div>
        <h3 className="text-[18px] font-semibold mb-4">Recommended Changes</h3>
        {analysis.specificAdjustments.phrasingChanges.map((change, index) => (
          <PhrasingChangeSection key={index} change={change} />
        ))}
      </div>
  
      {/* <div className="grid grid-cols-2 gap-4">
        <ListSection title="Best Practices" items={analysis.bestPractices.do} />
        <ListSection title="Things to Avoid" items={analysis.bestPractices.dont} />
      </div>
  
      <div className="grid grid-cols-2 gap-4">
        <ListSection 
          title="High Priority Actions" 
          items={analysis.implementationPriority.highImpact} 
        />
        <ListSection 
          title="Secondary Actions" 
          items={analysis.implementationPriority.secondary} 
        />
      </div> */}
    </div>
  );
  

  export const ToneSpectrumSection = ({ 
    toneEvaluation,
    content
  }: { 
    toneEvaluation: ToneEvaluation;
    content: string;
  }) => {
    const [loading, setLoading] = useState<string | null>(null);
    const [currentAnalysis, setCurrentAnalysis] = useState<AdditionalAnalysis | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const getCurrentCategory = (score: number): SpectrumSection | undefined => {
        return spectrumData.find((data, index) => {
          const lowerBound = index === 0 ? 0 : spectrumData[index - 1].threshold;
          const upperBound = data.threshold;
          return score > lowerBound && score <= upperBound;
        });
      };
    
    const currentCategory = getCurrentCategory(toneEvaluation.score);
  
    const handleSectionClick = async (section: SpectrumSection) => {
        try {
          setLoading(section.label.top);
          setError(null);
          setCurrentAnalysis(null); // Clear current analysis while loading
    
          const result = await adjustToneSpectrum(content, {
            challengingPercentage: parseInt(section.label.top.split('%')[0]),
            supportivePercentage: parseInt(section.label.bottom.split('%')[0])
          });
    
          setCurrentAnalysis({
            section: section.label.top,
            analysis: result
          });
        } catch (err) {
          console.error('Analysis error:', err);
          setError(err instanceof Error ? err.message : 'Failed to analyze tone');
        } finally {
          setLoading(null);
        }
      };
    
      const PhrasingChangeCard = ({ change }: { change: PhrasingChange }) => (
        <div className="bg-[var(--table-hover-1)] rounded p-4 mb-4">
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <span className="font-semibold text-[14px] leading-[20px] text-[var(--text)] min-w-[80px]">
                Original:
              </span>
              <span className="text-[14px] leading-[20px] text-[var(--text-light)]">
                {change.original}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold text-[14px] leading-[20px] text-[var(--text)] min-w-[80px]">
                Suggested:
              </span>
              <span className="text-[14px] leading-[20px] text-[var(--primary-base)]">
                {change.suggested}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold text-[14px] leading-[20px] text-[var(--text)] min-w-[80px]">
                Rationale:
              </span>
              <span className="text-[14px] leading-[20px] text-[var(--text-light)]">
                {change.rationale}
              </span>
            </div>
          </div>
        </div>
      );
    
      const AdditionalAnalysisCallout = ({ analysis }: { analysis: ToneAdjustmentEvaluation }) => (
        <div className="mt-8 p-6 bg-[var(--app-background)] rounded-lg border border-[var(--border)]">
          <div className="space-y-6">
            {/* Current State Analysis */}
            <div>
              <h4 className="text-[16px] leading-[24px] font-semibold text-[var(--text)] mb-2">
                Current Tone Balance
              </h4>
              <p className="text-[14px] leading-[20px] text-[var(--text-light)]">
                {analysis.currentStateAnalysis.toneBalance}
              </p>
            </div>
    
            {/* Recommended Changes */}
            <div>
              <h4 className="text-[16px] leading-[24px] font-semibold text-[var(--text)] mb-4">
                Recommended Changes
              </h4>
              <div className="space-y-4">
                {analysis.specificAdjustments.phrasingChanges.map((change, index) => (
                  <PhrasingChangeCard key={index} change={change} />
                ))}
              </div>
            </div>
          </div>
        </div>
      );

  return (
    <Card>
      <h3 className="text-[24px] leading-[36px] font-semibold text-[var(--text)] mb-6">
        Tone Spectrum Analysis
      </h3>

      <div className="space-y-8">
        {/* Labels */}
        <div className="grid grid-cols-5 text-center text-[12px] leading-[18px] text-[var(--text-light)]">
          {spectrumData.map((section, i) => (
            <div 
              key={i}
              className={`space-y-1
                ${section === currentCategory ? 'text-[var(--primary-base)] font-semibold' : ''}`}
              onClick={() => handleSectionClick(section)}
            >
              <div>{section.label.top}</div>
              <div>{section.label.bottom}</div>
            </div>
          ))}
        </div>

        {/* Spectrum Bar */}
        <div className="relative">
          <div className="absolute left-0 -top-6 text-[var(--text-light)]">SUPPORTIVE</div>
          <div className="absolute right-0 -top-6 text-[var(--text-light)]">CHALLENGING</div>
          <div className="flex h-8 relative">
            {spectrumData.map((section, i) => (
              <div 
                key={i}
                className="flex-1 relative"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => handleSectionClick(section)}
              >
                {section.isMiddle ? (
                  <div className="relative h-full cursor-pointer hover:opacity-70 transition-opacity">
                    <div className="absolute inset-x-0 top-0 h-1/2 bg-[#f1a4ab]" />
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[#8bd7d2]" />
                  </div>
                ) : (
                  <div className={`relative h-full flex-1 cursor-pointer hover:opacity-70 transition-opacity ${section.color}`} />
                )}
                
                {/* Tooltip */}
                {hoveredIndex === i && (
                <div className="absolute z-50 left-1/2 transform -translate-x-1/2 top-full mt-2">
                    <div
                    className="bg-[rgba(68,68,68,1)] text-white px-3 py-2 rounded-md text-sm whitespace-nowrap shadow-[0px_6px_12px_0px_rgba(0,0,0,0.06)] relative"
                    >
                    <div
                        className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-[rgba(68,68,68,1)] rotate-45"
                    />
                    Adjust content to be:
                    <br />
                    {section.label.top} / {section.label.bottom}
                    </div>
                </div>
                )}
              </div>
            ))}
            {/* Position Indicator */}
            <div 
              className="absolute bottom-0 w-1 h-8 bg-black transform -translate-x-1/2"
              style={{ left: `${toneEvaluation.score}%` }}
            />
          </div>
        </div>

        {/* Content Labels */}
        <div className="grid grid-cols-5 text-[12px] leading-[18px] text-[var(--text)]">
          {spectrumData.map((section, i) => (
            <div 
              key={i}
              className={`space-y-1 pl-4
                ${section === currentCategory ? 'text-[var(--primary-base)] font-semibold' : ''}`}
              onClick={() => handleSectionClick(section)}
            >
              {section.content.map((item, j) => (
                <div key={j}>{item}</div>
              ))}
            </div>
          ))}
        </div>

          {/* Analysis Text */}
        <div className="space-y-4">
            <div className="pt-2">
            <p className="text-[14px] leading-[20px] text-[var(--text-light)]">
                {toneEvaluation.analysis}
            </p>
            </div>

        {/* Loading State */}
        {loading && (
          <div className="mt-8 p-6 bg-[var(--app-background)] rounded-lg border border-[var(--border)]">
            <div className="flex items-center gap-3 text-[var(--text-light)]">
              <div className="h-5 w-5 border-2 border-[var(--primary-base)] border-t-transparent rounded-full animate-spin" />
              <span className="text-[14px] leading-[20px]">
                Analyzing tone adjustment for {loading}...
              </span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Additional Analysis */}
        {currentAnalysis && !loading && (
          <div>
            <h3 className="text-[20px] leading-[30px] font-semibold text-[var(--text)] mb-4">
              Recommendations to adjust tone to be {currentAnalysis.section}
            </h3>
            <AdditionalAnalysisCallout analysis={currentAnalysis.analysis} />
          </div>
        )}
      </div>
      </div>
    </Card>
  );
};

export default ToneSpectrumSection;