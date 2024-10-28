// types.ts

// Common Types
export type Rating = 'strong' | 'moderate' | 'not_present' | 'needs_work';

export interface EvaluationSection {
  rating: Rating;
  rationale: string;
  keyEvidence: string[];
}

export interface ScoreBasedEvaluation {
  analysis: string;
  score: number;
}

// API Related Types
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

export interface ParsedResponse {
  [key: string]: any;
}

// Voice & Personality Types
export interface VoicePersonalityEvaluation {
  personalityEvaluation: {
    supportiveChallenger: ScoreBasedEvaluation;
    whiteCollarMechanic: ScoreBasedEvaluation;
  };
  voiceEvaluation: {
    naturalConversational: ScoreBasedEvaluation;
    authenticApproachable: ScoreBasedEvaluation;
    genderNeutral: ScoreBasedEvaluation;
    channelTailored: ScoreBasedEvaluation;
  };
  toneEvaluation: ScoreBasedEvaluation;
}

// Tone Related Types
export type ToneEvaluation = ScoreBasedEvaluation;


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

export interface ToneAdjustmentOptions {
  challengingPercentage: number;
  supportivePercentage: number;
  contentTypes: string[];
}

export interface ToneAdjustmentEvaluation {
  currentStateAnalysis: {
    toneBalance: string;
  };
  specificAdjustments: {
    phrasingChanges: Array<{
      original: string;
      suggested: string;
      rationale: string;
    }>;
  };
}

// Target Audience Types
export interface TargetAudienceEvaluation {
  userBuyerFocus: ScoreBasedEvaluation;
  customerTypeFocus: ScoreBasedEvaluation;
}

// Messaging & Values Types
export interface MessagePoint extends EvaluationSection {}

export type MessagingPillar = Record<string, MessagePoint>;


export interface MessagingValuesEvaluation {
  values: {
    'Put People First': EvaluationSection;
    'Be Yourself': EvaluationSection;
    'Make It Better': EvaluationSection;
    'Do Your Best (Together)': EvaluationSection;
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

// Brand Evaluation Types
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

// Complete Evaluation Type
export interface CompleteEvaluation {
  voicePersonality: VoicePersonalityEvaluation;
  targetAudience: TargetAudienceEvaluation;
  messagingValues: MessagingValuesEvaluation;
  overall: BrandEvaluation;
}