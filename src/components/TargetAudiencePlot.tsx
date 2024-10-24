// components/TargetAudiencePlot.tsx
interface TargetAudienceData {
    userBuyerFocus: {
      analysis: string;
      score: number;
    };
    customerTypeFocus: {
      analysis: string;
      score: number;
    };
  }
  
  const TargetAudienceQuadrant = ({ 
    x, y, 
    label 
  }: { 
    x: number; 
    y: number; 
    label: string;
  }) => (
    <div 
      className="absolute text-xs text-gray-600 text-center w-24"
      style={{ 
        left: `${x}%`, 
        top: `${y}%`,
        transform: 'translate(-50%, -50%)'
      }}
    >
      {label}
    </div>
  );
  
  export const TargetAudienceAnalysis = ({ data }: { data: TargetAudienceData }) => {
    const xPos = data.userBuyerFocus.score;
    const yPos = data.customerTypeFocus.score;
  
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-4">Target Audience Analysis</h3>
        
        <div className="relative w-full aspect-square max-w-xl mx-auto mb-6 border border-gray-200">
          <TargetAudienceQuadrant x={25} y={25} label="User-Focused Graduator" />
          <TargetAudienceQuadrant x={75} y={25} label="Buyer-Focused Graduator" />
          <TargetAudienceQuadrant x={25} y={75} label="User-Focused Disenfranchised" />
          <TargetAudienceQuadrant x={75} y={75} label="Buyer-Focused Disenfranchised" />
          
          <div className="absolute left-0 top-1/2 w-full h-px bg-gray-300" />
          <div className="absolute left-1/2 top-0 w-px h-full bg-gray-300" />
          
          <div className="absolute -bottom-6 left-0 text-sm text-gray-600">User</div>
          <div className="absolute -bottom-6 right-0 text-sm text-gray-600">Buyer</div>
          <div className="absolute -left-4 top-0 text-sm text-gray-600 -rotate-90">Graduator</div>
          <div className="absolute -right-4 bottom-0 text-sm text-gray-600 rotate-90">Disenfranchised</div>
  
          <div 
            className="absolute w-4 h-4 bg-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"
            style={{ 
              left: `${xPos}%`, 
              top: `${yPos}%` 
            }}
          >
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs whitespace-nowrap">
              ({xPos}, {yPos})
            </div>
          </div>
        </div>
  
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">User vs. Buyer Focus</h4>
            <p className="text-gray-700">{data.userBuyerFocus.analysis}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Customer Type Focus</h4>
            <p className="text-gray-700">{data.customerTypeFocus.analysis}</p>
          </div>
        </div>
      </div>
    );
  };