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
  
  export type OverallEvaluation = {
    overallScore: {
      analysis: string;
      score: number;
    };
    strengths: EvaluationItem[];
    improvementAreas: EvaluationItem[];
    suggestions: EvaluationItem[];
  };

  export type Rating = 'strong' | 'moderate' | 'needs_work';

export interface EvaluationSection {
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

  export interface MessagingValuesEvaluation {
    messagingAlignment: Array<{
      pillar: string;
      analysis: string;
      score: number;
    }>;
    valueAlignment: Array<{
      value: string;
      analysis: string;
      score: number;
    }>;
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
  overall: OverallEvaluation;
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