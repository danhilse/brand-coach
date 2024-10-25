// lib/mockEvaluations.ts

const mockEvaluations: Record<string, string> = {
    voicePersonality: `<personality_evaluation>
    <supportive_challenger>
      <analysis>
        Mock analysis of Supportive Challenger personality alignment. Example text shows good balance of support and challenge.
      </analysis>
      <reflection>
        The score reflects strong alignment with guidance while maintaining encouragement.
      </reflection>
      <score>85</score>
    </supportive_challenger>
    <white_collar_mechanic>
      <analysis>
        Mock analysis of White-Collar Mechanic personality. Text demonstrates technical expertise with approachability.
      </analysis>
      <reflection>
        Score indicates good balance of professional expertise and accessibility.
      </reflection>
      <score>80</score>
    </white_collar_mechanic>
  </personality_evaluation>
  
  <voice_evaluation>
    <natural_conversational>
      <analysis>Mock analysis of natural and conversational qualities.</analysis>
      <reflection>Score reflects good conversational tone.</reflection>
      <score>90</score>
    </natural_conversational>
    <authentic_approachable>
      <analysis>Mock analysis of authenticity and approachability.</analysis>
      <reflection>Score indicates strong authentic voice.</reflection>
      <score>85</score>
    </authentic_approachable>
    <gender_neutral>
      <analysis>Mock analysis of gender-neutral language usage.</analysis>
      <reflection>Score shows excellent inclusivity.</reflection>
      <score>95</score>
    </gender_neutral>
    <channel_tailored>
      <analysis>Mock analysis of channel appropriateness.</analysis>
      <reflection>Score indicates good channel alignment.</reflection>
      <score>85</score>
    </channel_tailored>
        <tone_evaluation>
      <analysis>
        The content demonstrates a balanced approach to tone, leaning slightly towards the supportive end of the spectrum. 
        This aligns well with email marketing and blog content guidelines, striking an effective balance between being 
        helpful and directing the audience towards specific actions. Consider adjusting the tone to be slightly more 
        supportive when discussing technical features or implementation details.
      </analysis>
      <score>35</score>
    </tone_evaluation>
  </voice_evaluation>`,
  
    targetAudience: `<target_audience_evaluation>
  <user_buyer_focus>
  <analysis>
  Mock analysis of user vs. buyer targeting. Text shows good balance of technical and strategic content.
  - Example technical language for users
  - Example strategic messaging for buyers
  - Balanced pain point addressing
  </analysis>
  <score>85</score>
  </user_buyer_focus>
  
  <customer_type_focus>
  <analysis>
  Mock analysis of graduator vs. disenfranchised targeting.
  - Appropriate knowledge level assumptions
  - Clear migration messaging
  - Well-addressed pain points
  </analysis>
  <score>80</score>
  </customer_type_focus>
  </target_audience_evaluation>`,
  
    messagingValues: `<messaging_alignment>
    <pillar name="Agile Marketing">
      <sub_type name="Efficiency">
        <analysis>Mock analysis of efficiency messaging alignment.</analysis>
        <score>85</score>
      </sub_type>
      <overall_analysis>Mock overall analysis of Agile Marketing pillar.</overall_analysis>
      <overall_score>80</overall_score>
    </pillar>
  </messaging_alignment>
  
  <value_alignment>
    <value name="Put People First">
      <analysis>Mock analysis of people-first value alignment.</analysis>
      <score>90</score>
    </value>
  </value_alignment>`,
  
    overall: `<overall_evaluation>
  <overall_score>
  <brand_analysis>Mock comprehensive analysis of brand alignment. Text demonstrates strong adherence to Act-On's brand identity.</brand_analysis>
  <score>85</score>
  </overall_score>
  
  <strengths>
  - Strong supportive challenger voice
  - Excellent technical expertise balance
  - Effective audience targeting
  </strengths>
  
  <improvement_areas>
  - Could strengthen strategic messaging
  - Minor tone adjustments needed
  - Additional customer pain points could be addressed
  </improvement_areas>
  
  <suggestions>
  1. Enhance strategic value propositions
  2. Adjust tone for better channel alignment
  3. Include more specific customer examples
  </suggestions>
  </overall_evaluation>`
  };
  
  export { mockEvaluations };