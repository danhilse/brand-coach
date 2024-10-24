// lib/parsers.ts
import type { VoicePersonalityEvaluation, TargetAudienceEvaluation, OverallEvaluation } from './types';

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

export function parseVoicePersonalityEvaluation(response: string): VoicePersonalityEvaluation {
  const personalitySection = extractContent(response, 'personality_evaluation');
  const voiceSection = extractContent(response, 'voice_evaluation');
  const toneSection = extractContent(response, 'tone_evaluation');

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
    toneEvaluation: createEvaluation(toneSection)
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