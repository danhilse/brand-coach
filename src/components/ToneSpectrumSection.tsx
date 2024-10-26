// components/ToneSpectrumSection.tsx
import React, { useState } from 'react';
import { Card } from './Card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { evaluationService } from '@/lib/services/evaluationService';

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

interface AdditionalAnalysis {
  section: string;
  analysis: string;
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


// Update the component props to include originalContent
export const ToneSpectrumSection = ({ 
    toneEvaluation,
    originalContent
  }: { 
    toneEvaluation: ToneEvaluation;
    originalContent: string;
  }) => {
    const [loading, setLoading] = useState<string | null>(null);
    const [additionalAnalyses, setAdditionalAnalyses] = useState<AdditionalAnalysis[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
    // Keep this function for determining the current category based on score
    const getCurrentCategory = (score: number): SpectrumSection | undefined => {
        return spectrumData.find((data, index) => {
        const lowerBound = index === 0 ? 0 : spectrumData[index - 1].threshold;
        const upperBound = data.threshold;
        return score > lowerBound && score <= upperBound;
        });
    };

    // Calculate current category
    const currentCategory = getCurrentCategory(toneEvaluation.score);

    const handleSectionClick = async (section: SpectrumSection) => {
        try {
          setLoading(section.label.top);
          setError(null);
      
          const result = await evaluationService.evaluateToneAdjustment(
            originalContent,
            {
              challengingPercentage: parseInt(section.label.top.split('%')[0]),
              supportivePercentage: parseInt(section.label.bottom.split('%')[0]),
            }
          );
      
          if (result.error) {
            throw new Error(result.error);
          }
      
          // Only update state if we have data
          if (result.data && typeof result.data === 'string') {
            setAdditionalAnalyses(prev => [
              ...prev, 
              {
                section: section.label.top,
                analysis: result.data as string // Now we know this is definitely a string
              }
            ]);
          } else {
            throw new Error('No analysis was returned');
          }
        } catch (err) {
          console.error('Analysis error:', err);
          setError(err instanceof Error ? err.message : 'Failed to analyze tone');
        } finally {
          setLoading(null);
        }
      };

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
                    <div className="bg-black text-white px-3 py-2 rounded-md text-sm whitespace-nowrap">
                      <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black rotate-45" />
                      {section.content.map(c => c.replace('-', '')).join(', ')}
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
            <div className="flex items-center space-x-2 text-[var(--text-light)]">
              <div className="animate-spin h-4 w-4 border-2 border-[var(--primary-base)] border-t-transparent rounded-full" />
              <span>Loading analysis for {loading}...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Additional Analyses */}
          {additionalAnalyses.map((item, index) => (
            <div key={index} className="p-4 bg-slate-50 rounded-lg">
              <h4 className="font-semibold mb-2">{item.section} Analysis:</h4>
              <p className="text-[14px] leading-[20px] text-[var(--text-light)]">
                {item.analysis}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default ToneSpectrumSection;