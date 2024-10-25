// components/ToneSpectrumSection.tsx
import { ScoreBar } from './ScoreBar';

interface ToneEvaluation {
  analysis: string;
  score: number;
}

export const ToneSpectrumSection = ({ toneEvaluation }: { toneEvaluation: ToneEvaluation }) => {
  // Convert score to position on the spectrum (0 = fully supportive, 100 = fully challenging)
  const spectrumLabels = [
    { label: "90/10", threshold: 10, desc: "VIDEO, SOCIAL, ADVERTISING" },
    { label: "70/30", threshold: 30, desc: "BLOGS, EMAIL MKTG" },
    { label: "50/50", threshold: 50, desc: "WEBINAR, EBOOKS, PR, WEBSITE" },
    { label: "30/70", threshold: 70, desc: "CUSTOMER MARKETING, PRODUCT" },
    { label: "10/90", threshold: 90, desc: "CS TEAM, CONNECT.ACT-ON.COM" }
  ];

  const getSpectrumPosition = (score: number) => {
    for (const label of spectrumLabels) {
      if (score <= label.threshold) {
        return label;
      }
    }
    return spectrumLabels[spectrumLabels.length - 1];
  };

  const position = getSpectrumPosition(toneEvaluation.score);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-bold mb-4">Tone Spectrum Analysis</h3>
      
      {/* Score and Analysis */}
      <div className="mb-6">
        <ScoreBar 
          score={toneEvaluation.score} 
          label="Supportive ← → Challenging" 
          colorClass="bg-green-600"
        />
        <p className="text-gray-700 mt-4">{toneEvaluation.analysis}</p>
      </div>

      {/* Spectrum Visualization */}
      <div className="mt-8">
        <div className="relative h-20 bg-gray-100 rounded-lg">
          {spectrumLabels.map((label, index) => (
            <div
              key={index}
              className={`absolute text-xs text-center ${
                label.threshold === position.threshold 
                  ? 'text-green-600 font-bold' 
                  : 'text-gray-600'
              }`}
              style={{
                left: `${label.threshold}%`,
                top: '0',
                transform: 'translateX(-50%)',
                width: '80px'
              }}
            >
              <div className="mb-1">{label.label}</div>
              <div className="text-[10px] leading-tight">{label.desc}</div>
            </div>
          ))}
          
          {/* Position Indicator */}
          <div 
            className="absolute w-3 h-12 bg-green-600 rounded transform -translate-x-1/2"
            style={{ 
              left: `${toneEvaluation.score}%`,
              bottom: '0'
            }} 
          />
        </div>
      </div>
    </div>
  );
};