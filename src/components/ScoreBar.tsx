// components/ScoreBar.tsx
interface ScoreBarProps {
    score: number;
    label: string;
    colorClass?: 'primary' | 'teal' | 'purple' | 'blue';
  }
  
  export const ScoreBar = ({ 
    score, 
    label, 
    colorClass = 'primary'
  }: ScoreBarProps) => {
    const getColorClass = () => {
      switch (colorClass) {
        case 'primary':
          return 'bg-[var(--primary-base)]';
        case 'teal':
          return 'bg-[#007B80]';
        case 'purple':
          return 'bg-[#A83FEA]';
        case 'blue':
          return 'bg-[#304A71]';
        default:
          return 'bg-[var(--primary-base)]';
      }
    };
  
    return (
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <span className="text-[14px] leading-[20px] font-semibold text-[var(--text)]">
            {label}
          </span>
          <span className="text-[14px] leading-[20px] font-semibold text-[var(--text)]">
            {score}/100
          </span>
        </div>
        <div className="w-full h-3 bg-[var(--border)] rounded">
          <div 
            className={`${getColorClass()} h-3 rounded transition-all duration-300`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>
    );
  };