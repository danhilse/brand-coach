// components/ScoreBar.tsx
interface ScoreBarProps {
    score: number;
    label: string;
    colorClass?: string;
  }
  
  export const ScoreBar = ({ 
    score, 
    label, 
    colorClass = "bg-blue-600" 
  }: ScoreBarProps) => (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm font-medium">{score}/100</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`${colorClass} h-2 rounded-full transition-all duration-300`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
  