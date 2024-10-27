// evaluations.ts

let currentScore = 0;

import type { 
  VoicePersonalityEvaluation,
  TargetAudienceEvaluation,
  MessagingValuesEvaluation,
  OverallEvaluation,
  ToneAdjustmentEvaluation
} from '@/lib/types';

import { brandGuidelines, icp, messaging, personality } from '@/lib/brandGuidelines';

// Global config for API provider
const API_PROVIDER = 'anthropic'; // Can be 'anthropic', 'openai', or 'test'

async function makeAPICall(content: string) {
  const maxRetries = 2;
  const timeout = 55000; // Set to 55s to be under the 60s function limit
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      console.log(`Making API Call (attempt ${attempt})`);
      
      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      if (result.error) throw new Error(result.error);
      return result.data;
      
    } catch (error: any) {
      console.error(`Attempt ${attempt} failed:`, error);
      if (attempt === maxRetries) {
        throw error;
      }
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }
}
  
export async function evaluateVoicePersonality(content: string): Promise<VoicePersonalityEvaluation> {
  const prompt = `You are a brand voice expert tasked with analyzing text based on Act-On's brand guidelines. Your focus is on evaluating voice, personality, and tone alignment. Please read the following brand guidelines carefully:

<brand_guidelines>
${personality}
</brand_guidelines>

Now, analyze the following text for voice and personality alignment:

<input_text>
${content}
</input_text>

Consider the following in your evaluation:

1. Supportive Challenger personality:
- Balance between being supportive while challenging readers
- Demonstration of empathy while encouraging growth
- Proactive solution offering
- Alignment with empathetic, encouraging, empowering, proactive, and innovative qualities

2. White-Collar Mechanic persona:
- Technical expertise with approachability
- Balance of professionalism and hands-on knowledge
- Detail-orientation while maintaining accessibility
- Embodiment of technical proficiency, detail-orientation, professionalism, reliability, and approachability

3. Brand Voice characteristics:
- Natural & Conversational: Straightforward without being overly casual
- Authentic & Approachable: Confident without arrogance
- Gender-Neutral & Inclusive: Avoiding exclusionary language
- Channel-Appropriate: Tone suitability for content type

4. Challenging vs Supportive Balance:
- Challenging elements: Content that pushes readers or questions status quo
- Supportive elements: Content offering guidance or reassurance
- Ratio: Percentage of challenging content (0 = fully supportive, 100 = fully challenging)

Analyze each aspect thoroughly and provide your evaluation in the following JSON format. Return only the JSON object with no additional text or formatting:

{
  "personalityEvaluation": {
    "supportiveChallenger": {
      "analysis": "Detailed analysis of Supportive Challenger alignment with specific examples",
      "score": 0-100
    },
    "whiteCollarMechanic": {
      "analysis": "Detailed analysis of White-Collar Mechanic alignment with specific examples",
      "score": 0-100
    }
  },
  "voiceEvaluation": {
    "naturalConversational": {
      "analysis": "Analysis of natural and conversational qualities with examples",
      "score": 0-100
    },
    "authenticApproachable": {
      "analysis": "Evaluation of authenticity and approachability with examples",
      "score": 0-100
    },
    "genderNeutral": {
      "analysis": "Assessment of inclusivity and gender-neutral language with examples",
      "score": 0-100
    },
    "channelTailored": {
      "analysis": "Evaluation of channel appropriateness with examples",
      "score": 0-100
    }
  },
  "toneEvaluation": {
    "analysis": "Analysis of challenging vs supportive content ratio with examples",
    "score": 0-100
  }
}

Ensure your evaluation is thorough and specific, with concrete examples from the input text supporting each assessment. Each analysis should reference relevant guidelines and explain how the text aligns or deviates from them.

For the toneEvaluation score, use the percentage of challenging content (0 = fully supportive, 100 = fully challenging).`;

  const response = await makeAPICall(prompt);
  currentScore = (JSON.parse(response).toneEvaluation.score)
  return JSON.parse(response);
}

export async function evaluateTargetAudience(content: string): Promise<TargetAudienceEvaluation> {
  const prompt = `You are a brand targeting expert tasked with analyzing text based on Act-On's brand guidelines, specifically focusing on audience alignment. Your analysis will help ensure that marketing content is properly tailored to the target audience.

First, carefully review the brand guidelines, which contain information about Act-On's Ideal Customer Profile (ICP):

<brand_guidelines>
${icp}
</brand_guidelines>

Now, analyze the following text for target audience alignment:

<input_text>
${content}
</input_text>

Focus on two key aspects:

1. User vs. Buyer Focus:
    - Users: Marketing practitioners, hands-on platform users
    - Buyers: Decision-makers, strategic planners
    Scoring:
    - 0 = Completely user-focused
    - 50 = Equal user/buyer focus
    - 100 = Completely buyer-focused

2. Customer Journey Stage:
    - Graduator: Moving from basic email to marketing automation, needs guidance
    - Disenfranchised: Experienced with MAP but frustrated, needs solutions
    Scoring:
    - 0 = Completely graduator-focused
    - 50 = Equal graduator/disenfranchised focus
    - 100 = Completely disenfranchised-focused

Consider:
- User vs. Buyer Focus:
  * Language and examples that resonate with each group
  * Balance of technical details vs strategic content
  * Specific pain points addressed

- Customer Journey Stage:
  * Terminology complexity and assumed knowledge level
  * Pain points addressed for each customer type
  * Migration/transformation messaging

Analyze thoroughly with specific examples from the text and return your evaluation in the following JSON format. Return only the JSON object with no additional text or formatting:

{
  "userBuyerFocus": {
    "analysis": "Detailed analysis of user vs buyer targeting with specific examples of language, pain points addressed, and content balance. Express findings as approximate percentages (e.g., '60% buyer-focused, 40% user-focused') and explain reasoning.",
    "score": 0-100
  },
  "customerTypeFocus": {
    "analysis": "Detailed analysis of graduator vs disenfranchised targeting with specific examples of terminology, pain points, and messaging approach. Express findings as approximate percentages (e.g., '70% graduator-focused, 30% disenfranchised-focused') and explain reasoning.",
    "score": 0-100
  }
}

Ensure your analysis in each field:
1. Quotes relevant passages demonstrating targeting
2. Analyzes language choices and their audience implications
3. Identifies specific pain points addressed
4. Provides clear reasoning for the score
5. Explains the percentage breakdown of focus

The scores should reflect the targeting balance, where:
- userBuyerFocus: 0 = user, 100 = buyer
- customerTypeFocus: 0 = graduator, 100 = disenfranchised`;

  const response = await makeAPICall(prompt);
  return JSON.parse(response);
}

export async function evaluateMessagingValues(content: string): Promise<MessagingValuesEvaluation> {
  const prompt = `You are a brand messaging expert tasked with analyzing text based on Act-On's brand guidelines. Your goal is to evaluate how well the given text aligns with Act-On's messaging pillars and brand values.

First, carefully review the following brand guidelines:
<brand_guidelines>
${messaging}
</brand_guidelines>

Now, analyze the following text based on these guidelines:
<input_text>
${content}
</input_text>

For your analysis:
1. List out each messaging pillar and brand value from the guidelines
2. For each messaging pillar:
   - Find relevant quotes from the text
   - Identify specific examples of alignment
   - Consider sub-type alignment within each pillar
   - Analyze both positive and negative aspects
   - Score from 0-100 (0 = no alignment, 100 = perfect)

3. For each brand value:
   - Find relevant quotes from the text
   - Identify examples embodying the value
   - Consider alignment with value description
   - Analyze both positive and negative aspects
   - Score from 0-100 (0 = no alignment, 100 = perfect)

Analyze thoroughly with specific examples and return your evaluation in the following JSON format. Return only the JSON object with no additional text or formatting:

{
  "messagingAlignment": [
    {
      "pillar": "[Pillar Name]",
      "analysis": "Detailed analysis of alignment with this pillar, including specific examples, quotes, and consideration of sub-types",
      "score": 0-100
    },
    {
      "pillar": "[Pillar Name]",
      "analysis": "Detailed analysis...",
      "score": 0-100
    },
    {
      "pillar": "[Pillar Name]",
      "analysis": "Detailed analysis...",
      "score": 0-100
    }
  ],
  "valueAlignment": [
    {
      "value": "[Value Name]",
      "analysis": "Detailed analysis of how the text embodies this value, with specific examples and quotes",
      "score": 0-100
    },
    {
      "value": "[Value Name]",
      "analysis": "Detailed analysis...",
      "score": 0-100
    },
    {
      "value": "[Value Name]",
      "analysis": "Detailed analysis...",
      "score": 0-100
    },
    {
      "value": "[Value Name]",
      "analysis": "Detailed analysis...",
      "score": 0-100
    }
  ]
}

Ensure each analysis includes:
- Specific quotes from the text
- Examples of alignment or misalignment
- Clear reasoning for the score
- Consideration of all aspects of the pillar or value
- Both strengths and areas for improvement`;

  const response = await makeAPICall(prompt);
  return JSON.parse(response);
}

export async function evaluateOverall(content: string): Promise<OverallEvaluation> {
    const prompt = `You are a brand alignment expert for Act-On, a marketing automation company. Your task is to provide a comprehensive evaluation of a given text against Act-On's brand guidelines and return it in a specific JSON format. 
  
  First, carefully review the following brand guidelines:
  <brand_guidelines>
  ${brandGuidelines}
  </brand_guidelines>
  
  Now, analyze the following text for overall brand alignment:
  <input_text>
  ${content}
  </input_text>
  
  Conduct a step-by-step analysis of the input text against the brand guidelines, considering:
  
  1. Dual Personality:
     - How well the text represents Act-On's "Supportive Challenger" and "White-Collar Mechanic" personas
     - Specific examples from the text that align with or deviate from these personalities
  
  2. Messaging Framework:
     - Text's alignment with "Act-On Fuels Agile Marketing," "Innovative Solutions for Innovative Marketers," and "Your Partner in Marketing Success at Every Stage"
     - Instances where these messages are effectively conveyed or missed opportunities
  
  3. Brand Voice:
     - How well the text embodies: refreshingly direct, natural, authentic, gender-neutral, and inclusive
     - Examples of language that exemplify these traits or areas where improvement is needed
  
  4. Tone:
     - If the tone is appropriate based on the Tone of Voice Spectrum
     - Why the tone is suitable or needs adjustment for the content type
  
  5. ICP Relevance:
     - How well the text speaks to Act-On's Ideal Customer Profiles (ICPs)
     - Elements that resonate with the target audience or areas where messaging could be more tailored
  
  After your analysis, return your evaluation in the following JSON format. Do not include any other text or explanation outside of this JSON structure:
  
  {
    "overallScore": {
      "analysis": "Comprehensive analysis of brand alignment, citing specific examples and referencing guidelines",
      "score": 0-100
    },
    "strengths": [
      "Specific strength with example from the input text",
      "Specific strength with example from the input text",
      "Specific strength with example from the input text"
    ],
    "improvementAreas": [
      "Specific area for improvement with example from the input text",
      "Specific area for improvement with example from the input text",
      "Specific area for improvement with example from the input text"
    ],
    "suggestions": [
      "Actionable suggestion with example of implementation",
      "Actionable suggestion with example of implementation",
      "Actionable suggestion with example of implementation"
    ]
  }
  
  Ensure your evaluation is thorough, specific, and directly tied to Act-On's brand guidelines. Provide concrete examples from the input text to support your assessment and suggestions. Return only the JSON object with no additional text or formatting.`;
  
    const response = await makeAPICall(prompt);
    return JSON.parse(response);
  }
  
export async function adjustToneSpectrum(
  content: string, 
  targetTone: {
    challengingPercentage: number;
    supportivePercentage: number;
  }
): Promise<ToneAdjustmentEvaluation> {
  const prompt = `You are a tone analysis expert for Act-On's brand voice, tasked with analyzing content and providing specific recommendations for adjusting its tone balance.

<brand_guidelines>
${personality}
</brand_guidelines>

<content_to_analyze>
${content}
</content_to_analyze>

<tone_analysis>
Current Challenging/Supportive Balance: ${currentScore}% challenging, ${100 - currentScore}% supportive
Target Balance: ${targetTone.challengingPercentage}% challenging, ${targetTone.supportivePercentage}% supportive
Required Shift: ${targetTone.challengingPercentage - currentScore}% more challenging
</tone_analysis>

Analyze the content considering:
1. Current Tone Analysis:
- Current challenging vs supportive balance
- Alignment with Act-On's brand personality
- Appropriateness for target content types

2. Required Adjustments:
- Gap between current and target tone
- Specific phrases needing modification
- Content type-specific requirements

Return your analysis in the following JSON format. Return only the JSON object with no additional text or formatting:

{
  "currentStateAnalysis": {
    "toneBalance": "Detailed analysis of the current ${currentScore}% challenging, ${100 - currentScore}% supportive balance, with specific examples of each tone type"
  },
  "specificAdjustments": {
    "phrasingChanges": [
      {
        "original": "Exact quote from original content",
        "suggested": "Specific revised version that better matches ${targetTone.challengingPercentage}% challenging tone",
        "rationale": "Clear explanation of how this change helps achieve the target balance"
      },
      {
        "original": "Another exact quote...",
        "suggested": "Another specific revision...",
        "rationale": "Clear explanation..."
      },
      {
        "original": "Third exact quote...",
        "suggested": "Third specific revision...",
        "rationale": "Clear explanation..."
      }
    ]
  }
}

Ensure your recommendations:
- Are extremely specific and immediately actionable
- Include exact original text and specific replacement text
- Provide clear explanations for each change
- Align with Act-On's brand voice
- Consider content type requirements
- Focus on achieving the target tone balance of ${targetTone.challengingPercentage}% challenging, ${targetTone.supportivePercentage}% supportive`;

  const response = await makeAPICall(prompt);
  return JSON.parse(response);
}
  
export async function evaluateAll(content: string) {
  console.log(`Starting all evaluations at ${new Date().toISOString()}`);
  
  try {
    const [
      voicePersonality,
      targetAudience,
      messagingValues,
      overall
    ] = await Promise.all([
      evaluateVoicePersonality(content),
      evaluateTargetAudience(content),
      evaluateMessagingValues(content),
      evaluateOverall(content)
    ]);

    console.log(`All evaluations completed at ${new Date().toISOString()}`);

    return {
      voicePersonality,
      targetAudience,
      messagingValues,
      overall
    };
  } catch (error) {
    console.error('Evaluation failed:', error);
    throw error;
  }
}
