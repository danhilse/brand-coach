// lib/prompts.ts
import { brandGuidelines } from './brandGuidelines';

export function formatVoicePersonalityEvaluation(text: string): string {
  return `You are a brand voice expert analyzing text based on Act-On's brand guidelines. Focus on voice, personality, and tone evaluation.

<brand_guidelines>
${brandGuidelines}
</brand_guidelines>

Analyze this text for voice and personality alignment:
<input_text>
${text}
</input_text>

Consider these specific aspects in your evaluation:

1. Supportive Challenger personality:
- How well does the text balance being supportive while challenging readers to achieve more?
- Does it demonstrate empathy while encouraging growth?
- Is it proactive in offering solutions?

2. White-Collar Mechanic personality:
- Does it show technical expertise while remaining approachable?
- How well does it balance professionalism with hands-on knowledge?
- Is it detail-oriented while maintaining accessibility?

3. Brand Voice characteristics:
- Natural & Conversational: Is it straightforward without being overly casual?
- Authentic & Approachable: Does it convey confidence without arrogance?
- Gender-Neutral & Inclusive: Does it avoid any exclusionary language?
- Channel-Appropriate: Is the tone suitable for the content type?

Provide your evaluation in this format:

<personality_evaluation>
<supportive_challenger>
<analysis>Provide specific examples and analysis of Supportive Challenger alignment</analysis>
<score>75</score>
</supportive_challenger>
<white_collar_mechanic>
<analysis>Provide specific examples and analysis of White-Collar Mechanic alignment</analysis>
<score>75</score>
</white_collar_mechanic>
</personality_evaluation>

<voice_evaluation>
<natural_conversational>
<analysis>Analyze natural and conversational qualities with examples</analysis>
<score>75</score>
</natural_conversational>
<authentic_approachable>
<analysis>Evaluate authenticity and approachability with examples</analysis>
<score>75</score>
</authentic_approachable>
<gender_neutral>
<analysis>Assess inclusivity and gender-neutral language with examples</analysis>
<score>75</score>
</gender_neutral>
<channel_tailored>
<analysis>Evaluate channel appropriateness with context</analysis>
<score>75</score>
</channel_tailored>
</voice_evaluation>

<tone_evaluation>
<analysis>Analyze the balance between supportive and challenging elements, citing specific examples</analysis>
<score>75</score>
</tone_evaluation>`;
}

export function formatTargetAudienceEvaluation(text: string): string {
  return `You are a brand targeting expert analyzing text based on Act-On's brand guidelines. Focus specifically on audience alignment.

<brand_guidelines>
${brandGuidelines}
</brand_guidelines>

Analyze this text for target audience alignment:
<input_text>
${text}
</input_text>

Consider these key aspects:

1. User vs. Buyer Focus:
- Users: Marketing practitioners, hands-on platform users
- Buyers: Decision-makers, strategic planners
- Look for language, examples, and pain points that resonate with each group

2. Customer Journey Stage:
- Graduator: Moving from basic email to marketing automation, needs guidance
- Disenfranchised: Experienced with MAP but frustrated, needs solutions
- Analyze terminology complexity, assumed knowledge, and pain points addressed

Provide your evaluation in this format:

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
</target_audience_evaluation>`;
}

export function formatOverallEvaluation(text: string): string {
  return `You are a brand alignment expert providing a comprehensive evaluation of text against Act-On's brand guidelines.

<brand_guidelines>
${brandGuidelines}
</brand_guidelines>

Analyze this text for overall brand alignment:
<input_text>
${text}
</input_text>

Provide a holistic evaluation considering:
1. Overall brand alignment
2. Key strengths in brand representation
3. Specific areas for improvement
4. Actionable suggestions for better alignment

Format your response as follows:

<overall_evaluation>
<overall_score>
<analysis>Provide a comprehensive analysis of how well the text aligns with Act-On's brand identity, citing specific examples</analysis>
<score>75</score>
</overall_score>

<strengths>
- [Specific strength with example]
- [Specific strength with example]
- [Specific strength with example]
</strengths>

<improvement_areas>
- [Specific area for improvement with example]
- [Specific area for improvement with example]
- [Specific area for improvement with example]
</improvement_areas>

<suggestions>
1. [Actionable suggestion with example of implementation]
2. [Actionable suggestion with example of implementation]
3. [Actionable suggestion with example of implementation]
</suggestions>
</overall_evaluation>`;
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