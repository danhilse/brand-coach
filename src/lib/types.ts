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
  
  export interface OverallEvaluation {
    overallScore: {
      analysis: string;
      score: number;
    };
    strengths: string[];
    improvementAreas: string[];
    suggestions: string[];
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

export interface CompleteEvaluation {
  voicePersonality: VoicePersonalityEvaluation;
  targetAudience: TargetAudienceEvaluation;
  messagingValues: MessagingValuesEvaluation;
  overall: OverallEvaluation;
}