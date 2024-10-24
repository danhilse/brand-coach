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
      score: number; // 0-100 where 0 is fully supportive, 100 is fully challenging
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
    targetAudience: {
      userBuyerFocus: {
        analysis: string;
        score: number; // 0-100 where 0 is user-focused, 100 is buyer-focused
      };
      customerTypeFocus: {
        analysis: string;
        score: number; // 0-100 where 0 is graduator-focused, 100 is disenfranchised-focused
      };
    };
  }