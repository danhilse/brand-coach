// lib/parsers.ts
import type { 
  VoicePersonalityEvaluation, 
  TargetAudienceEvaluation, 
  OverallEvaluation,
  MessagingValuesEvaluation 
} from './types';

const extractContent = (text: string, tag: string) => {
  const regex = new RegExp(`<${tag}>(.*?)</${tag}>`, 's');
  const match = text.match(regex);
  return match ? match[1].trim() : '';
};

const extractScore = (text: string): number => {
  const scoreContent = extractContent(text, 'score');
  const numberMatch = scoreContent.match(/\d+/);
  return numberMatch ? parseInt(numberMatch[0]) : 0;
};

const createEvaluation = (section: string) => ({
  analysis: extractContent(section, 'analysis'),
  score: extractScore(section)
});

// Add a store for the tone score
let lastToneScore: number | null = null;

// Add getter/setter
export function getLastToneScore(): number | null {
  return lastToneScore;
}

export function parseVoicePersonalityEvaluation(response: string): VoicePersonalityEvaluation {
  const personalitySection = extractContent(response, 'personality_evaluation');
  const voiceSection = extractContent(response, 'voice_evaluation');
  const toneSection = extractContent(response, 'challenging_supportive_evaluation');

  // Extract and store the tone score
  const toneEval = createEvaluation(toneSection);
  lastToneScore = toneEval.score;

  return {
    personalityEvaluation: {
      supportiveChallenger: createEvaluation(
        extractContent(personalitySection, 'supportive_challenger')
      ),
      whiteCollarMechanic: createEvaluation(
        extractContent(personalitySection, 'white_collar_mechanic')
      )
    },
    voiceEvaluation: {
      naturalConversational: createEvaluation(
        extractContent(voiceSection, 'natural_conversational')
      ),
      authenticApproachable: createEvaluation(
        extractContent(voiceSection, 'authentic_approachable')
      ),
      genderNeutral: createEvaluation(
        extractContent(voiceSection, 'gender_neutral')
      ),
      channelTailored: createEvaluation(
        extractContent(voiceSection, 'channel_tailored')
      )
    },
    toneEvaluation: toneEval
  };
}

export function parseMessagingValuesEvaluation(response: string): MessagingValuesEvaluation {
  const messagingSection = extractContent(response, 'messaging_alignment');
  const valueSection = extractContent(response, 'value_alignment');

  // Parse messaging pillars
  const messagingPillars = messagingSection
    .match(/<pillar[^>]*>[\s\S]*?<\/pillar>/g) || [];
  
  const parsedPillars = messagingPillars.map(pillar => {
    const nameMatch = pillar.match(/name="([^"]+)"/);
    return {
      pillar: nameMatch ? nameMatch[1] : 'Unnamed Pillar',
      analysis: extractContent(pillar, 'analysis'),
      score: extractScore(pillar)
    };
  });

  // Parse values
  const values = valueSection
    .match(/<value[^>]*>[\s\S]*?<\/value>/g) || [];
  
  const parsedValues = values.map(value => {
    const nameMatch = value.match(/name="([^"]+)"/);
    return {
      value: nameMatch ? nameMatch[1] : 'Unnamed Value',
      analysis: extractContent(value, 'analysis'),
      score: extractScore(value)
    };
  });

  return {
    messagingAlignment: parsedPillars,
    valueAlignment: parsedValues
  };
}

export function parseTargetAudienceEvaluation(response: string): TargetAudienceEvaluation {
  const targetSection = extractContent(response, 'target_audience_evaluation');

  return {
    userBuyerFocus: createEvaluation(
      extractContent(targetSection, 'user_buyer_focus')
    ),
    customerTypeFocus: createEvaluation(
      extractContent(targetSection, 'customer_type_focus')
    )
  };
}

export function parseOverallEvaluation(response: string): OverallEvaluation {
  const extractList = (text: string): string[] => {
    return text
      .split('\n')
      .map(line => line.replace(/^-\s*|\d+\.\s*/, '').trim())
      .filter(line => line.length > 0);
  };

  const overallSection = extractContent(response, 'overall_evaluation');
  const overallScoreSection = extractContent(overallSection, 'overall_score');

  return {
    overallScore: {
      analysis: extractContent(overallScoreSection, 'analysis'),
      score: parseInt(extractContent(overallScoreSection, 'score')) || 0
    },
    strengths: extractList(extractContent(overallSection, 'strengths')),
    improvementAreas: extractList(extractContent(overallSection, 'improvement_areas')),
    suggestions: extractList(extractContent(overallSection, 'suggestions'))
  };
}