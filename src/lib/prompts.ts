// lib/prompts.ts
import { brandGuidelines, icp, messaging, personality } from './brandGuidelines';

export function formatVoicePersonalityEvaluation(text: string): string {
  return `You are a brand voice expert tasked with analyzing text based on Act-On's brand guidelines. Your focus is on evaluating voice, personality, and tone alignment. Please read the following brand guidelines carefully, as they will form the basis of your evaluation:

<brand_guidelines>
${personality}
</brand_guidelines>

Now, you will analyze the following text for voice and personality alignment:

<input_text>
${text}
</input_text>

Please consider the following aspects in your evaluation:

1. Supportive Challenger personality:
- How well does the text balance being supportive while challenging readers to achieve more?
- Does it demonstrate empathy while encouraging growth?
- Is it proactive in offering solutions?
- Does it reflect the empathetic, encouraging, empowering, proactive, and innovative qualities described in the guidelines?

2. White-Collar Mechanic personality:
- Does it show technical expertise while remaining approachable?
- How well does it balance professionalism with hands-on knowledge?
- Is it detail-oriented while maintaining accessibility?
- Does it embody the technically proficient, detail-oriented, professional, reliable, and approachable qualities outlined in the guidelines?

3. Brand Voice characteristics:
- Natural & Conversational: Is it straightforward without being overly casual? Does it avoid corporate-speak and jargon?
- Authentic & Approachable: Does it convey confidence without arrogance? Is humor used appropriately?
- Gender-Neutral & Inclusive: Does it avoid any exclusionary language and use gender-neutral pronouns?
- Channel-Appropriate: Is the tone suitable for the content type, considering the Tone of Voice Spectrum provided in the guidelines?

Before beginning your evaluation, please complete the following steps:

<preparation>
1. Extract and list key phrases from the brand guidelines for each personality and voice characteristic.
2. Identify specific examples from the input text that align or misalign with each guideline.
</preparation>

For each aspect of your evaluation, first analyze the text in detail, providing specific examples and explanations. Then, assign a score from 0 to 100, where 0 indicates no alignment with the guidelines and 100 indicates perfect alignment.

After completing your analysis for each section, reflect on your evaluation to ensure consistency between your detailed analysis and the assigned score.

Wrap your evaluation in the following tags:

<personality_evaluation>
  <supportive_challenger>
    <analysis>
      [Provide a detailed analysis of how well the text aligns with the Supportive Challenger personality, citing specific examples from the text and referencing the brand guidelines.]
    </analysis>
    <reflection>
      [Reflect on your analysis and ensure your score accurately represents your detailed observations.]
    </reflection>
    <score>[0-100]</score>
  </supportive_challenger>
  <white_collar_mechanic>
    <analysis>
      [Provide a detailed analysis of how well the text aligns with the White-Collar Mechanic personality, citing specific examples from the text and referencing the brand guidelines.]
    </analysis>
    <reflection>
      [Reflect on your analysis and ensure your score accurately represents your detailed observations.]
    </reflection>
    <score>[0-100]</score>
  </white_collar_mechanic>
</personality_evaluation>

<voice_evaluation>
  <natural_conversational>
    <analysis>
      [Analyze the natural and conversational qualities of the text, providing specific examples and referencing the guidelines.]
    </analysis>
    <reflection>
      [Reflect on your analysis and ensure your score accurately represents your detailed observations.]
    </reflection>
    <score>[0-100]</score>
  </natural_conversational>
  <authentic_approachable>
    <analysis>
      [Evaluate the authenticity and approachability of the text, providing specific examples and referencing the guidelines.]
    </analysis>
    <reflection>
      [Reflect on your analysis and ensure your score accurately represents your detailed observations.]
    </reflection>
    <score>[0-100]</score>
  </authentic_approachable>
  <gender_neutral>
    <analysis>
      [Assess the inclusivity and use of gender-neutral language in the text, providing specific examples and referencing the guidelines.]
    </analysis>
    <reflection>
      [Reflect on your analysis and ensure your score accurately represents your detailed observations.]
    </reflection>
    <score>[0-100]</score>
  </gender_neutral>
  <channel_tailored>
    <analysis>
      [Evaluate how well the text is tailored to its channel, considering the Tone of Voice Spectrum provided in the guidelines. If the channel is not specified, make a reasonable assumption based on the content.]
    </analysis>
    <reflection>
      [Reflect on your analysis and ensure your score accurately represents your detailed observations.]
    </reflection>
    <score>[0-100]</score>
  </channel_tailored>
</voice_evaluation>

<tone_evaluation>
  <analysis>
    [Analyze the balance between supportive and challenging elements in the text, citing specific examples and referencing the Tone of Voice Spectrum in the guidelines.]
  </analysis>
  <reflection>
    [Reflect on your analysis and ensure your score accurately represents your detailed observations.]
  </reflection>
  <score>[0-100]</score>
</tone_evaluation>

After completing your evaluation, please review your scores and analyses to ensure they accurately reflect the brand guidelines and your detailed observations.`;
}

export function formatTargetAudienceEvaluation(text: string): string {
  return `You are a brand targeting expert tasked with analyzing text based on Act-On's brand guidelines, specifically focusing on audience alignment. Your analysis will help ensure that marketing content is properly tailored to the target audience.

First, carefully review the brand guidelines, which contain information about Act-On's Ideal Customer Profile (ICP):

<brand_guidelines>
${icp}
</brand_guidelines>

Now, analyze the following text for target audience alignment:

<input_text>
${text}
</input_text>

Your analysis should focus on two key aspects:

1. User vs. Buyer Focus:
   - Users: Marketing practitioners, hands-on platform users
   - Buyers: Decision-makers, strategic planners

2. Customer Journey Stage:
   - Graduator: Moving from basic email to marketing automation, needs guidance
   - Disenfranchised: Experienced with MAP but frustrated, needs solutions

For each aspect, consider the following:

User vs. Buyer Focus:
- Identify specific language, examples, and pain points that resonate with each group
- Assess the balance between technical details (for users) and strategic content (for buyers)

Customer Journey Stage:
- Evaluate the complexity of terminology and assumed knowledge level
- Analyze how well the text addresses specific pain points for each customer type
- Look for messaging related to migration, transformation, or guidance

Before providing your final evaluation, wrap your analysis inside <detailed_analysis> tags. Follow these steps to ensure a thorough interpretation of the text:

1. Quote relevant passages from the text that demonstrate targeting for users and buyers.
2. Analyze the language used in these quotes, considering technical vs. strategic focus.
3. Identify specific pain points addressed for each group.
4. Consider potential counterarguments to your analysis.
5. Repeat steps 1-4 for the Customer Journey Stage aspect, focusing on graduators and disenfranchised customers.
6. Summarize your findings for each aspect.

This detailed analysis will ensure a comprehensive interpretation of the text.

After your analysis, provide your evaluation in the following format:

<target_audience_evaluation>
<user_buyer_focus>
<analysis>
Detailed analysis of user vs. buyer targeting:
- Specific language examples that indicate audience focus
- Pain points and solutions addressed
- Level of technical detail and strategic content
</analysis>
<score>75</score>
</user_buyer_focus>

<customer_type_focus>
<analysis>
Detailed analysis of graduator vs. disenfranchised targeting:
- Knowledge level assumptions
- Pain points addressed
- Migration or transformation messaging
</analysis>
<score>75</score>
</customer_type_focus>
</target_audience_evaluation>

Ensure that your analysis is thorough and supported by specific examples from the text. The scores should reflect how well the text aligns with the target audience, with 100 being perfect alignment and 0 being completely misaligned.`;
}

export function formatMessagingValuesEvaluation(text: string): string {
  return `You are a brand messaging expert tasked with analyzing text based on Act-On's brand guidelines. Your goal is to evaluate how well the given text aligns with Act-On's messaging pillars and brand values.

First, carefully review the following brand guidelines:

<brand_guidelines>
${messaging}
</brand_guidelines>

Now, analyze the following text based on these guidelines:

<input_text>
${text}
</input_text>

In your analysis, follow these steps:

1. List out each messaging pillar and brand value from the guidelines.

2. For each messaging pillar:
   a. Write down relevant quotes from the input text that relate to this pillar.
   b. Identify specific examples in the input text that align with the pillar.
   c. Consider how well the text addresses each sub-type within the pillar.
   d. Consider both positive and negative aspects of alignment.
   e. Provide a score from 0 to 100, where 0 means no alignment and 100 means perfect alignment.

3. For each brand value:
   a. Write down relevant quotes from the input text that relate to this value.
   b. Identify specific examples in the input text that embody the value.
   c. Consider how well the text reflects the description of the value.
   d. Consider both positive and negative aspects of alignment.
   e. Provide a score from 0 to 100, where 0 means no alignment and 100 means perfect alignment.

Before providing your final structured output, wrap your analysis inside <detailed_analysis> tags to break down your thought process for each pillar and value. This will help ensure a thorough and well-reasoned evaluation.

Your final output should follow this structure:

<messaging_alignment>
  <pillar name="[Pillar Name]">
    <sub_type name="[Sub-type Name]">
      <analysis>[Your analysis of alignment with this sub-type]</analysis>
      <score>[0-100]</score>
    </sub_type>
    [Repeat for each sub-type within the pillar]
    <overall_analysis>[Your overall analysis of alignment with this pillar]</overall_analysis>
    <overall_score>[0-100]</overall_score>
  </pillar>
  [Repeat for each messaging pillar]
</messaging_alignment>

<value_alignment>
  <value name="[Value Name]">
    <analysis>[Your analysis of how the text embodies this value]</analysis>
    <score>[0-100]</score>
  </value>
  [Repeat for each brand value]
</value_alignment>

Remember to provide specific examples from the input text to support your analysis and scores. Be thorough in your evaluation, considering both explicit and implicit alignment with Act-On's messaging and values.`;
}

export function formatOverallEvaluation(text: string): string {
  return `You are a brand alignment expert for Act-On, a marketing automation company. Your task is to provide a comprehensive evaluation of a given text against Act-On's brand guidelines. 

First, carefully review the following brand guidelines:

<brand_guidelines>
${brandGuidelines}
</brand_guidelines>

Now, analyze the following text for overall brand alignment:

<input_text>
{{text}}
</input_text>

Conduct a step-by-step analysis of the input text against the brand guidelines. For each step, wrap your analysis in <brand_analysis> tags:

1. Dual Personality:
   - Analyze how well the text represents Act-On's "Supportive Challenger" and "White-Collar Mechanic" personas.
   - Provide specific examples from the text that align with or deviate from these personalities.

2. Messaging Framework:
   - Evaluate the text's alignment with "Act-On Fuels Agile Marketing," "Innovative Solutions for Innovative Marketers," and "Your Partner in Marketing Success at Every Stage."
   - Highlight any instances where these messages are effectively conveyed or missed opportunities.

3. Brand Voice:
   - Assess how well the text embodies the brand voice characteristics: refreshingly direct, natural, authentic, gender-neutral, and inclusive.
   - Provide examples of language that exemplify these traits or areas where improvement is needed.

4. Tone:
   - Determine if the tone used in the text is appropriate based on the Tone of Voice Spectrum in the guidelines.
   - Explain why the tone is suitable or needs adjustment for the content type.

5. ICP Relevance:
   - Evaluate how well the text speaks to Act-On's Ideal Customer Profiles (ICPs).
   - Identify elements that resonate with the target audience or areas where the messaging could be more tailored.

After your analysis, provide your evaluation in the following format:

<overall_evaluation>
<overall_score>
<brand_analysis>Provide a comprehensive analysis of how well the text aligns with Act-On's brand identity, citing specific examples from the input text and referencing relevant parts of the brand guidelines.</brand_analysis>
<score>[Insert a numerical score between 0-100]</score>
</overall_score>

<strengths>
- [Specific strength with example from the input text]
- [Specific strength with example from the input text]
- [Specific strength with example from the input text]
</strengths>

<improvement_areas>
- [Specific area for improvement with example from the input text]
- [Specific area for improvement with example from the input text]
- [Specific area for improvement with example from the input text]
</improvement_areas>

<suggestions>
1. [Actionable suggestion with example of implementation]
2. [Actionable suggestion with example of implementation]
3. [Actionable suggestion with example of implementation]
</suggestions>
</overall_evaluation>

Ensure that your evaluation is thorough, specific, and directly tied to Act-On's brand guidelines. Provide concrete examples from the input text to support your assessment and suggestions.`;
}

