// evaluations.ts

let currentScore = 0;

import type { 
  VoicePersonalityEvaluation,
  TargetAudienceEvaluation,
  MessagingValuesEvaluation,
  BrandEvaluation,
  ToneAdjustmentEvaluation,
  CompleteEvaluation
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
  
export async function evaluateVoicePersonality(content: string, platform: string): Promise<VoicePersonalityEvaluation> {
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
- Channel-Appropriate: Tone suitability for content type of ${platform}

4. Challenging vs Supportive Balance:
- Challenging elements: Content that pushes readers or questions status quo
- Supportive elements: Content offering guidance or reassurance
- Ratio: Percentage of challenging content (0 = fully supportive, 50 = neutral, 100 = fully challenging)

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
  const prompt = `You are a brand messaging expert tasked with analyzing text based on Act-On's brand guidelines. Your goal is to evaluate how well the given text aligns with Act-On's messaging framework and core values.

First, carefully review the following brand guidelines:
<brand_guidelines>
${messaging}
</brand_guidelines>

Now, analyze the following text based on these guidelines:
<input_text>
${content}
</input_text>

Return your analysis in the following JSON format. Return only the JSON object with no additional text or formatting:

{
  "values": {
    "Put People First": {
      "rating": "strong|moderate|not_present",
      "rationale": "Assessment of how well the content embodies leading with human connection, practicing respect, empathy and open communication",
      "keyEvidence": [
        "Quote or description showing value alignment/misalignment. If a quote, be sure to wrap in quotes.",
        // Additional examples as needed
      ]
    },
    "Be Yourself": {
      "rating": "strong|moderate|not_present",
      "rationale": "Assessment of how well the content demonstrates authenticity, honesty, and making room for diverse perspectives",
      "keyEvidence": [
        "Quote or description showing value alignment/misalignment. If a quote, be sure to wrap in quotes.",
        // Additional examples as needed
      ]
    },
    "Make It Better": {
      "rating": "strong|moderate|not_present",
      "rationale": "Assessment of how well the content shows innovation, creativity, growth mindset, and tackling challenges",
      "keyEvidence": [
        "Quote or description showing value alignment/misalignment. If a quote, be sure to wrap in quotes.",
        // Additional examples as needed
      ]
    },
    "Do Your Best (Together)": {
      "rating": "strong|moderate|not_present",
      "rationale": "Assessment of how well the content demonstrates excellence, collaboration, and empowerment",
      "keyEvidence": [
        "Quote or description showing value alignment/misalignment. If a quote, be sure to wrap in quotes.",
        // Additional examples as needed
      ]
    }
  },
  "messaging": {
    "ACT-ON FUELS AGILE MARKETING": {
      "Unlock your potential": {
        "rating": "strong|moderate|not_present",
        "rationale": "Assessment of how well the content communicates platform acceleration and business results"
      },
      "Go from idea to impact in record time": {
        "rating": "strong|moderate|not_present",
        "rationale": "Assessment of how well the content communicates speed and precision"
      },
      "Invest in your business' growth": {
        "rating": "strong|moderate|not_present",
        "rationale": "Assessment of how well the content communicates ROI and efficiency gains"
      }
    },
    "INNOVATIVE SOLUTIONS FOR INNOVATIVE MARKETERS": {
      "Generate demand and amplify your brand": {
        "rating": "strong|moderate|not_present",
        "rationale": "Assessment of how well the content communicates enterprise-level features"
      },
      "Leverage groundbreaking AI and Analytics": {
        "rating": "strong|moderate|not_present",
        "rationale": "Assessment of how well the content communicates AI capabilities and innovation"
      },
      "Connect the dots faster to outpace your competitors": {
        "rating": "strong|moderate|not_present",
        "rationale": "Assessment of how well the content communicates integration and data environment benefits"
      }
    },
    "YOUR PARTNER IN MARKETING SUCCESS AT EVERY STAGE": {
      "Get quick support every time": {
        "rating": "strong|moderate|not_present",
        "rationale": "Assessment of how well the content communicates support team responsiveness"
      },
      "Leverage resources and expertise to win": {
        "rating": "strong|moderate|not_present",
        "rationale": "Assessment of how well the content communicates partner/services ecosystem"
      },
      "Pursue ambitious goals": {
        "rating": "strong|moderate|not_present",
        "rationale": "Assessment of how well the content communicates revenue growth focus"
      }
    }
  }
}

Rating Guidelines:
- strong: Clear, explicit evidence of the value/message being conveyed
- moderate: Implicit or partial alignment with the value/message
- not_present: No clear evidence of the value/message in the content

For each analysis:
- Use direct quotes from the content as evidence
- Provide specific examples of alignment or misalignment
- Give clear reasoning for ratings
- Consider both explicit and implicit demonstrations of values/messaging
- Note any missed opportunities or areas for improvement

Remember to:
1. Be specific and detailed in your rationale
2. Use exact quotes when possible
3. Consider context and tone
4. Evaluate both presence and effectiveness of messaging
5. Look for missed opportunities to reinforce values and messages`;

  const response = await makeAPICall(prompt);
  return JSON.parse(response);
}

export async function evaluateOverall(content: string, platform: string): Promise<BrandEvaluation> {
    const prompt = `You are a brand alignment expert for Act-On, a marketing automation company. Your task is to evaluate how effectively content embodies Act-On's brand identity, providing analysis in a structured JSON format.

First, thoroughly review these brand guidelines:
<brand_guidelines>
${brandGuidelines}
</brand_guidelines>

Now, analyze this content for brand alignment:
<input_text>
${content}
</input_text>

This is contend intended for ${platform}.

Evaluate how well this content authentically represents Act-On's brand identity, considering context, audience, and purpose.

Provide your evaluation in this JSON format (return only the JSON, no other text):

{
  "diagnosis": {
    "brandFit": {
      "rating": "strong|moderate|needs_work",
      "rationale": "Clear explanation of how well the content embodies Act-On's brand identity overall",
      "keyEvidence": [
        "Specific example from the content demonstrating brand alignment or misalignment"
        // Additional examples as needed
      ]
    },
    "audienceAlignment": {
      "rating": "strong|moderate|needs_work",
      "rationale": "Assessment of how well the content speaks to intended audience",
      "keyEvidence": [
        "Specific example from the content showing audience alignment or misalignment"
        // Additional examples as needed
      ]
    },
    "toneEffectiveness": {
      "rating": "strong|moderate|needs_work",
      "rationale": "Evaluation of tone appropriateness for channel and purpose",
      "keyEvidence": [
        "Specific example from the content demonstrating tone effectiveness or issues"
        // Additional examples as needed
      ]
    }
  },
  "guidance": {
    "priorityAdjustments": [
      {
        "focus": "Specific aspect needing attention",
        "currentState": "Description of current approach",
        "targetState": "Description of desired approach",
        "implementationExample": "Concrete example of how to achieve the change"
      }
      // Additional priority adjustments as needed
    ]
  }
}`;
  
    const response = await makeAPICall(prompt);
    return JSON.parse(response);
  }

export async function _evaluateOverall(content: string, platform: string): Promise<BrandEvaluation> {
    const prompt = `You are a brand alignment expert for Act-On, a marketing automation company. Your task is to evaluate how effectively content embodies Act-On's brand identity, providing analysis in a structured JSON format.

First, thoroughly review these brand guidelines:
<brand_guidelines>
${brandGuidelines}
</brand_guidelines>

Now, analyze this content for brand alignment:
<input_text>
${content}
</input_text>

This content is intended for ${platform}.

Evaluate how well this content authentically represents Act-On's brand identity by:

1. Assessing alignment with Act-On's fundamental brand elements:
- Dual personality (Supportive Challenger and White-Collar Mechanic)
- Core messaging pillars
- Brand voice characteristics
- Values and audience focus

2. Considering context and purpose:
- Channel/content type and its position on the tone spectrum
- Intended audience and their needs
- Content objectives and how they align with brand goals

The goal is not to check boxes but to evaluate how naturally and effectively the content embodies Act-On's brand essence while achieving its communication objectives.

Provide your evaluation in this JSON format (return only the JSON, no other text):

{
  "overallScore": {
    "analysis": "Comprehensive analysis of how effectively the content embodies Act-On's brand identity, supported by specific examples",
    "score": 0-100
  },
  "strengths": [
    "strength": {
      "description": "Key strength demonstrating effective brand alignment",
      "example": "Supporting example from the content"
      }
    // Include additional strengths as needed for meaningful analysis
  ],
  "improvementAreas": [
    "improvement": {
      "description": "Specific opportunity to better align with brand identity.",
      "example": "Supporting example from the content"
    // Include additional improvement areas as needed for meaningful analysis
  ],
  "suggestions": [
    "suggestion": {
      "description": "Actionable recommendation to strengthen brand alignment",
      "example": "A specific implementation example"
    // Include additional suggestions as needed for meaningful analysis
  ]
}

Each section should include enough specific examples and recommendations to provide meaningful guidance for improvement while maintaining focus on authentic brand expression. Return only the JSON object with no additional text or formatting.`;
  
    const response = await makeAPICall(prompt);
    return JSON.parse(response);
  }

let platformVariable = ""

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
Content is intended for: ${platformVariable}
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

import testData from '@/lib/test/testData.json';

// Helper function to create a delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  
// In evaluateAll function, just add 'as CompleteEvaluation' to the return:

export async function evaluateAll(content: string, platform: string, goals: string) {
  if (content.trim().toLowerCase() === 'test') {
    await delay(1400);
    return testData as CompleteEvaluation;
  }

  platformVariable = platform;
  console.log(`Starting all evaluations at ${new Date().toISOString()}`);
  
  try {
    const [
      voicePersonality,
      targetAudience,
      messagingValues,
      overall
    ] = await Promise.all([
      evaluateVoicePersonality(content, platform),
      evaluateTargetAudience(content),
      evaluateMessagingValues(content),
      evaluateOverall(content, platform)
    ]);

    console.log(`All evaluations completed at ${new Date().toISOString()}`);

    return {
      voicePersonality,
      targetAudience,
      messagingValues,
      overall
    } as CompleteEvaluation;  // Add this type assertion
  } catch (error) {
    console.error('Evaluation failed:', error);
    throw error;
  }
}
