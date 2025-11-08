import { getGeminiModel, parseGeminiJson, handleGeminiError, GENERATION_CONFIG } from './client';
import type { Profile, ArchetypeAnalysis, ResourceRecommendation } from '@/types';

/**
 * Generate personalized onboarding summary
 */
export async function generateOnboardingSummary(
  profile: Profile,
  analysis: ArchetypeAnalysis,
  recommendedResources: ResourceRecommendation[]
): Promise<string> {
  try {
    const model = getGeminiModel('FLASH', GENERATION_CONFIG.summary_generation);

    const prompt = buildSummaryPrompt(profile, analysis, recommendedResources);
    const result = await model.generateContent(prompt);

    return result.response.text();
  } catch (error) {
    handleGeminiError(error);
  }
}

/**
 * Generate archetype explanation for results page
 */
export async function generateArchetypeExplanation(
  archetype: string,
  confidence: number,
  characteristics: string[]
): Promise<string> {
  try {
    const model = getGeminiModel('FLASH', GENERATION_CONFIG.summary_generation);

    const archetypeDescriptions = {
      allies: "You're an Ally — someone who senses the call and wants to orient. You form part of the global field of resonance around open civic innovation.",
      innovators: "You're an Innovator — a systems builder who experiments, prototypes, and pushes the field forward through technical and conceptual work.",
      organizers: "You're an Organizer — a community weaver who turns frameworks into lived practice, facilitating civic imagination at the community level.",
      patrons: "You're a Patron — a regenerative steward who resources the conditions for emergence, enabling long-term civic ecosystem sustainability."
    };

    const prompt = `Write a warm, inspiring explanation of someone's OpenCivics archetype.

# Archetype: ${archetype.charAt(0).toUpperCase() + archetype.slice(1)}
# Confidence: ${Math.round(confidence * 100)}%
# Key Characteristics: ${characteristics.join(', ')}

# Base Description
${archetypeDescriptions[archetype as keyof typeof archetypeDescriptions]}

# Your Task
Expand on this base description to create a personalized, inspiring explanation that:

1. **Validates their identity** - Make them feel seen and valued
2. **Explains their unique role** - What makes their contribution special
3. **Acknowledges their characteristics** - Reference specific traits they showed
4. **Inspires action** - Connect their archetype to meaningful impact

**Requirements**:
- 100-150 words
- Warm, empowering tone using "you"
- Reference their specific characteristics naturally
- End with an inspiring statement about their potential impact

Write the explanation:`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    handleGeminiError(error);
  }
}

/**
 * Generate interest summary from civic sectors and domains
 */
export async function generateInterestSummary(
  civicSectors: string[],
  innovationDomains?: string[]
): Promise<string> {
  try {
    const model = getGeminiModel('FLASH', GENERATION_CONFIG.summary_generation);

    const prompt = `Create a concise, inspiring summary of someone's civic interests.

# Civic Sectors: ${civicSectors.join(', ')}
${innovationDomains ? `# Innovation Domains: ${innovationDomains.join(', ')}` : ''}

Write a 1-2 sentence summary that:
- Captures the essence of their interests
- Shows the connections between different sectors
- Uses inspiring, active language
- Feels personal and meaningful

Example: "You're passionate about transforming governance and education systems through participatory processes that empower communities to shape their own futures."

Write the summary:`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    handleGeminiError(error);
  }
}

/**
 * Generate next steps recommendations
 */
export async function generateNextSteps(
  archetype: string,
  civicSectors: string[],
  timeCommitment?: string
): Promise<string[]> {
  try {
    const model = getGeminiModel('FLASH', GENERATION_CONFIG.summary_generation);

    const prompt = `Generate 4-5 specific, actionable next steps for an OpenCivics participant.

# Archetype: ${archetype}
# Interests: ${civicSectors.join(', ')}
# Time Commitment: ${timeCommitment || 'not specified'}

# Archetype-Specific Next Steps:

## For Allies:
- Subscribe to OpenCivics newsletter for learning updates
- Explore frameworks and attend intro events
- Join learning circles and online discussions
- Connect with recommended resources
- Share learnings with networks

## For Innovators:
- Join developer/builder channels and communities
- Explore technical protocols and tools
- Apply for Labs projects or hackathons
- Connect with other builders for collaboration
- Contribute to open-source civic projects

## For Organizers:
- Join organizer network and facilitation community
- Access facilitation resources and training
- Apply for implementation support or grants
- Connect with local organizing groups
- Host civic imagination sessions

## For Patrons:
- Connect with funding opportunities and portfolio alignment
- Join patron circles and strategic discussions
- Schedule calls with program staff
- Explore impact investment opportunities
- Support specific civic innovation projects

Generate 4-5 specific next steps tailored to this person's archetype and interests.

Respond as a JSON array of strings:
["action 1", "action 2", "action 3", "action 4", "action 5"]`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return parseGeminiJson<string[]>(text);
  } catch (error) {
    handleGeminiError(error);
  }
}

/**
 * Build the main summary prompt
 */
function buildSummaryPrompt(
  profile: Profile,
  analysis: ArchetypeAnalysis,
  recommendedResources: ResourceRecommendation[]
): string {
  const archetypeDescriptions = {
    allies: "You're an Ally — someone who senses the call and wants to orient. You form part of the global field of resonance around open civic innovation.",
    innovators: "You're an Innovator — a systems builder who experiments, prototypes, and pushes the field forward through technical and conceptual work.",
    organizers: "You're an Organizer — a community weaver who turns frameworks into lived practice, facilitating civic imagination at the community level.",
    patrons: "You're a Patron — a regenerative steward who resources the conditions for emergence, enabling long-term civic ecosystem sustainability."
  };

  return `You are writing a warm, inspiring welcome message for a new OpenCivics participant.

# Participant Profile
- Name: ${profile.name || 'Friend'}
- Archetype: ${analysis.validated_archetype}
- Confidence: ${(analysis.confidence * 100).toFixed(0)}%
- Key Characteristics: ${analysis.key_characteristics.join(', ')}
- Engagement Strengths: ${analysis.engagement_strengths.join(', ')}

# Archetype Description
${archetypeDescriptions[analysis.validated_archetype as keyof typeof archetypeDescriptions]}

# Recommended Resources (Top 3)
${recommendedResources.slice(0, 3).map((r, i) => `${i+1}. ${r.title} - ${r.description}`).join('\n')}

# Your Task
Write a personalized onboarding summary that:

1. **Opens warmly** - Welcome them by name (if provided)
2. **Reflects their archetype** - Acknowledge their unique role and gifts
3. **Acknowledges their characteristics** - Mention their key strengths
4. **Provides concrete next steps** tailored to their archetype:
   - For Allies: Subscribe to newsletter, explore frameworks, join intro calls, connect with learning resources
   - For Innovators: Join developer channels, explore protocols, apply for Labs projects, connect with other builders
   - For Organizers: Join organizer network, access facilitation resources, apply for implementation support, connect with local groups
   - For Patrons: Connect with funding opportunities, join patron circles, explore portfolio alignment, schedule strategic calls
5. **References resources** - Mention the specific recommended resources
6. **Ends with vision** - Brief inspiring statement about the open civic movement

**Requirements**:
- 250-350 words
- Warm, conversational, but professional tone
- Use "you" (second person)
- Concrete and actionable
- Authentic and inspiring, not generic
- Reference specific characteristics and resources naturally

Write the summary now:`;
}

/**
 * Generate social sharing text for profile images
 */
export async function generateSharingText(
  name: string | undefined,
  archetype: string,
  confidence: number
): Promise<string> {
  try {
    const model = getGeminiModel('FLASH', GENERATION_CONFIG.summary_generation);

    const prompt = `Create engaging social media text for sharing an OpenCivics civic identity profile.

# Profile Details
- Name: ${name || 'OpenCivics participant'}
- Archetype: ${archetype}
- Confidence: ${Math.round(confidence * 100)}%

Write social sharing text that:
- Is 1-2 sentences
- Is inspiring and engaging
- Includes relevant hashtags
- Encourages others to take the quiz
- Feels authentic, not overly promotional

Example: "Just discovered I'm an Innovator in the OpenCivics ecosystem! 🚀 Ready to build the civic systems of tomorrow. What's your civic archetype? #OpenCivics #CivicInnovation #SystemsBuilder"

Write the sharing text:`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    handleGeminiError(error);
  }
}

/**
 * Generate brief archetype badge text
 */
export function getArchetypeBadgeText(archetype: string): string {
  const badges = {
    allies: "🌱 Curious Explorer",
    innovators: "⚡ Systems Builder",
    organizers: "🤝 Community Weaver",
    patrons: "🎯 Regenerative Steward"
  };

  return badges[archetype as keyof typeof badges] || "◯ Civic Participant";
}