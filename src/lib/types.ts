// types.ts
// export type ApiProvider = 'anthropic' | 'openai' | 'test';

// export interface ApiResponse<T> {
//   data?: T;
//   error?: string;
// }

export interface ParsedResponse {
  [key: string]: any;
}

// lib/types.ts
export interface VoicePersonalityEvaluation {
    personalityEvaluation: {
      supportiveChallenger: {
        analysis: string;
        score: number;
      };
      whiteCollarMechanic: {
        analysis: string;
        score: number;
      };
    };
    voiceEvaluation: {
      naturalConversational: {
        analysis: string;
        score: number;
      };
      authenticApproachable: {
        analysis: string;
        score: number;
      };
      genderNeutral: {
        analysis: string;
        score: number;
      };
      channelTailored: {
        analysis: string;
        score: number;
      };
    };
    toneEvaluation: {
      analysis: string;
      score: number;
    };
  }

  export interface ToneEvaluation {
    analysis: string;
    score: number;
  }
  
  export interface SpectrumSection {
    label: { 
      top: string;
      bottom: string;
    };
    content: string[];
    color?: string;
    isMiddle?: boolean;
    threshold: number;
  }
  
  export interface AdditionalAnalysis {
    section: string;
    analysis: string;
  }
  
  export interface ToneAdjustmentOptions {
    challengingPercentage: number;
    supportivePercentage: number;
    contentTypes: string[];
  }
  
  export interface TargetAudienceEvaluation {
    userBuyerFocus: {
      analysis: string;
      score: number;
    };
    customerTypeFocus: {
      analysis: string;
      score: number;
    };
  }
  
  export type EvaluationItem = {
    description: string;
    example: string;
  };
  

export type Rating = 'strong' | 'moderate' | 'not_present' | 'needs_work';

export interface EvaluationSection {
  rating: Rating;
  rationale: string;
  keyEvidence: string[];
}
export interface EvaluationSection_m {
  rating: Rating;
  rationale: string;
  keyEvidence: string[];
}

export interface PriorityAdjustment {
  focus: string;
  currentState: string;
  targetState: string;
  implementationExample: string;
}

export interface BrandEvaluation {
  diagnosis: {
    brandFit: EvaluationSection;
    audienceAlignment: EvaluationSection;
    toneEffectiveness: EvaluationSection;
  };
  guidance: {
    priorityAdjustments: PriorityAdjustment[];
  };
}




// Update ValueAnalysis to use the specific union type
interface ValueAnalysis {
  rating: 'strong' | 'moderate' | 'not_present' | 'needs_work';  // Changed from string
  rationale: string;
  keyEvidence: string[];
}

// You can also create a RatingType type alias for reuse
export type RatingType = 'strong' | 'moderate' | 'not_present' | 'needs_work';

interface ValueAnalysis {
  rating: RatingType;
  rationale: string;
  keyEvidence: string[];
}

interface MessagePoint {
  rating: Rating;
  rationale: string;
}

interface MessagingPillar {
  [key: string]: MessagePoint;
}

export interface MessagingValuesEvaluation {
  values: {
    'Put People First': ValueAnalysis;
    'Be Yourself': ValueAnalysis;
    'Make It Better': ValueAnalysis;
    'Do Your Best (Together)': ValueAnalysis;
  };
  messaging: {
    'ACT-ON FUELS AGILE MARKETING': {
      'Unlock your potential': MessagePoint;
      'Go from idea to impact in record time': MessagePoint;
      'Invest in your business\' growth': MessagePoint;
    };
    'INNOVATIVE SOLUTIONS FOR INNOVATIVE MARKETERS': {
      'Generate demand and amplify your brand': MessagePoint;
      'Leverage groundbreaking AI and Analytics': MessagePoint;
      'Connect the dots faster to outpace your competitors': MessagePoint;
    };
    'YOUR PARTNER IN MARKETING SUCCESS AT EVERY STAGE': {
      'Get quick support every time': MessagePoint;
      'Leverage resources and expertise to win': MessagePoint;
      'Pursue ambitious goals': MessagePoint;
    };
  };
}

  // Add this interface to types.ts
export interface ToneAdjustmentEvaluation {
    currentStateAnalysis: {
      toneBalance: string;
    //   brandAlignment: string;
    };
    specificAdjustments: {
      phrasingChanges: Array<{
        original: string;
        suggested: string;
        rationale: string;
      }>;
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

export interface CompleteEvaluation {
  voicePersonality: VoicePersonalityEvaluation;
  targetAudience: TargetAudienceEvaluation;
  messagingValues: MessagingValuesEvaluation;
  overall: BrandEvaluation;
}

export type ApiProvider = 'anthropic' | 'openai' | 'test';

export interface ApiResponse {
  data: any;
  error?: string;
}

export interface ApiRequest {
  text: string;
  prompt: (text: string) => string;
  parser: (response: string) => any;
  provider?: ApiProvider;
}