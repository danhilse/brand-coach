// components/ToneSpectrumSection.tsx
import { Card } from './Card';

interface ToneEvaluation {
  analysis: string;
  score: number;
}

const spectrumData = [
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

export const ToneSpectrumSection = ({ toneEvaluation }: { toneEvaluation: ToneEvaluation }) => {
  const getCurrentCategory = (score: number) => {
    return spectrumData.find((data, index) => {
      const lowerBound = index === 0 ? 0 : spectrumData[index - 1].threshold;
      const upperBound = data.threshold;
      return score > lowerBound && score <= upperBound;
    });
  };

  const currentCategory = getCurrentCategory(toneEvaluation.score);

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
              className={`space-y-1 ${section === currentCategory ? 'text-[var(--primary-base)] font-semibold' : ''}`}
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
              <div key={i} className="flex-1">
                {section.isMiddle ? (
                  <div className="relative h-full">
                    <div className="absolute inset-x-0 top-0 h-1/2 bg-[#f1a4ab]" />
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[#8bd7d2]" />
                  </div>
                ) : (
                    <div key={i} className={`relative h-full flex-1 ${section.color}`} />
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
              className={`space-y-1 pl-4 ${section === currentCategory ? 'text-[var(--primary-base)] font-semibold' : ''}`}
            >
              {section.content.map((item, j) => (
                <div key={j}>{item}</div>
              ))}
            </div>
          ))}
        </div>

        {/* Analysis Text */}
        <div className="pt-2">
          <p className="text-[14px] leading-[20px] text-[var(--text-light)]">
            {toneEvaluation.analysis}
          </p>
        </div>
      </div>
    </Card>
  );
};