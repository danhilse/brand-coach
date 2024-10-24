// lib/prompts.ts
import { brandGuidelines } from './brandGuidelines';

export function formatVoicePersonalityEvaluation(text: string): string {
  return `You are a brand voice expert analyzing text based on Act-On's brand guidelines. Focus on voice, personality, and tone evaluation.

<brand_guidelines>
${brandGuidelines}
</brand_guidelines>

Analyze this text:
<input_text>
${text}
</input_text>

Provide your evaluation in this format:

<personality_evaluation>
<supportive_challenger>
<analysis>Evaluate how well the text embodies the Supportive Challenger personality</analysis>
<score>75</score>
</supportive_challenger>
<white_collar_mechanic>
<analysis>Evaluate how well the text embodies the White-Collar Mechanic personality</analysis>
<score>75</score>
</white_collar_mechanic>
</personality_evaluation>

<voice_evaluation>
<natural_conversational>
<analysis>Evaluate the text's natural and conversational quality</analysis>
<score>75</score>
</natural_conversational>
<authentic_approachable>
<analysis>Evaluate the text's authenticity and approachability</analysis>
<score>75</score>
</authentic_approachable>
<gender_neutral>
<analysis>Evaluate the text's gender neutrality and inclusivity</analysis>
<score>75</score>
</gender_neutral>
<channel_tailored>
<analysis>Evaluate how well the text is tailored to its channel</analysis>
<score>75</score>
</channel_tailored>
</voice_evaluation>

<tone_evaluation>
<analysis>Analyze where this text falls on the supportive-challenging spectrum</analysis>
<score>75</score>
</tone_evaluation>`;
}

export function formatMessagingValuesEvaluation(text: string): string {
  return `You are a brand messaging expert analyzing text based on Act-On's brand guidelines. Focus on messaging pillars, values, and target audience alignment.

<brand_guidelines>
${brandGuidelines}
</brand_guidelines>

Analyze this text:
<input_text>
${text}
</input_text>

Provide your evaluation in this format:

<messaging_alignment>
<pillar name="[Pillar Name]">
<analysis>Evaluate how well the text addresses this messaging pillar</analysis>
<score>75</score>
</pillar>
[Repeat for each relevant messaging pillar]
</messaging_alignment>

<value_alignment>
<value name="[Value Name]">
<analysis>Evaluate how well the text embodies this value</analysis>
<score>75</score>
</value>
[Repeat for each relevant value]
</value_alignment>

<target_audience>
<user_buyer_focus>
<analysis>Analyze whether the text targets users or buyers</analysis>
<score>75</score>
</user_buyer_focus>
<customer_type_focus>
<analysis>Analyze whether the text targets graduators or disenfranchised customers</analysis>
<score>75</score>
</customer_type_focus>
</target_audience>`;
}

// Parser functions for each evaluation type
export function parseVoicePersonalityEvaluation(response: string): VoicePersonalityEvaluation {
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

export function parseMessagingValuesEvaluation(response: string): MessagingValuesEvaluation {
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

  // Extract sections
  const messagingSection = extractContent(response, 'messaging_alignment');
  const valueSection = extractContent(response, 'value_alignment');
  const targetSection = extractContent(response, 'target_audience');

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
    valueAlignment: parsedValues,
    targetAudience: {
      userBuyerFocus: createEvaluation(
        extractContent(targetSection, 'user_buyer_focus')
      ),
      customerTypeFocus: createEvaluation(
        extractContent(targetSection, 'customer_type_focus')
      )
    }
  };
}