import { getGeminiModel, parseGeminiJson, handleGeminiError, GENERATION_CONFIG } from './client';
import type { Profile, ConversationMessage } from '@/types';

/**
 * Handle general chat message
 */
export async function handleChatMessage(
  message: string,
  profile: Profile | null,
  conversationHistory: ConversationMessage[],
  notionContext?: string[]
): Promise<string> {
  try {
    const model = getGeminiModel('FLASH', GENERATION_CONFIG.chat_response);

    const prompt = buildChatPrompt(message, profile, conversationHistory, notionContext);
    const result = await model.generateContent(prompt);

    return result.response.text();
  } catch (error) {
    handleGeminiError(error);
  }
}

/**
 * Handle resource query with Notion context
 */
export async function handleResourceQuery(
  query: string,
  profile: Profile | null,
  relevantResources: string[]
): Promise<{
  response: string;
  suggested_resources: string[];
  follow_up_questions: string[];
}> {
  try {
    const model = getGeminiModel('FLASH', GENERATION_CONFIG.resource_analysis);

    const prompt = buildResourceQueryPrompt(query, profile, relevantResources);
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return parseGeminiJson(text);
  } catch (error) {
    handleGeminiError(error);
  }
}

/**
 * Generate conversation starter suggestions
 */
export async function generateConversationStarters(
  profile: Profile | null
): Promise<string[]> {
  try {
    const model = getGeminiModel('FLASH', GENERATION_CONFIG.chat_response);

    const prompt = `Generate 4-6 conversation starter questions for the OpenCivics chat interface.

${profile ? `
# User Context
- Archetype: ${profile.primary_archetype}
- Interests: ${profile.name ? 'Available' : 'Not specified'}
` : '# User Context: New visitor, no profile yet'}

Generate questions that:
- Help people explore OpenCivics concepts
- Are appropriate for their archetype (if known)
- Encourage deeper engagement
- Cover different aspects: frameworks, participation, resources, community

Examples:
- "How do I get started with civic innovation?"
- "What's the difference between patterns and protocols?"
- "How can I connect with other organizers in my area?"
- "What funding opportunities exist for civic projects?"

Return as JSON array: ["question 1", "question 2", ...]`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return parseGeminiJson<string[]>(text);
  } catch (error) {
    handleGeminiError(error);
  }
}

/**
 * Analyze conversation sentiment and engagement
 */
export async function analyzeConversation(
  messages: ConversationMessage[]
): Promise<{
  engagement_level: 'high' | 'medium' | 'low';
  sentiment: 'positive' | 'neutral' | 'negative';
  key_interests: string[];
  suggested_actions: string[];
}> {
  try {
    const model = getGeminiModel('FLASH', GENERATION_CONFIG.archetype_analysis);

    const prompt = `Analyze this conversation for engagement and interests.

# Conversation History
${messages.map((msg, i) => `
${i + 1}. ${msg.message_role}: ${msg.message_content}
`).join('')}

Analyze for:
1. **Engagement Level**: How engaged is the user? (high/medium/low)
2. **Sentiment**: Overall conversation tone (positive/neutral/negative)
3. **Key Interests**: What topics are they most interested in?
4. **Suggested Actions**: What should we recommend next?

Respond in JSON format:
{
  "engagement_level": "high|medium|low",
  "sentiment": "positive|neutral|negative",
  "key_interests": ["interest 1", "interest 2"],
  "suggested_actions": ["action 1", "action 2"]
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return parseGeminiJson(text);
  } catch (error) {
    handleGeminiError(error);
  }
}

/**
 * Build chat prompt with context
 */
function buildChatPrompt(
  message: string,
  profile: Profile | null,
  conversationHistory: ConversationMessage[],
  notionContext?: string[]
): string {
  return `You are the OpenCivics AI assistant — a knowledgeable, warm guide helping people explore open civic innovation.

# Your Role
- Help people understand OpenCivics concepts, archetypes, and frameworks
- Answer questions about civic sectors, innovation domains, and participation
- Guide people to relevant resources and opportunities
- Be encouraging and empowering, not prescriptive
- Use concrete examples when explaining concepts

# User Context
${profile ? `
- Name: ${profile.name || 'Not provided'}
- Archetype: ${profile.primary_archetype}
- Quiz Completed: ${profile.quiz_completed}
- Last Active: ${profile.last_active_at || 'First visit'}
` : 'New visitor, no profile yet'}

# Conversation History
${conversationHistory.length > 0 ? conversationHistory.slice(-6).map((msg, i) => `
${i + 1}. ${msg.message_role}: ${msg.message_content}
`).join('') : 'This is the start of the conversation.'}

${notionContext ? `
# Relevant Resources from Knowledge Base
${notionContext.join('\n\n')}
` : ''}

# Conversation Guidelines
- Conversational and friendly, not robotic
- Concise but thorough (2-4 paragraphs usually)
- Use bullet points for lists/steps
- Offer to dive deeper if user wants more detail
- Suggest relevant resources when appropriate
- Reference their archetype if known and relevant

# OpenCivics Concepts to Know
- **Archetypes**: Allies (learners), Innovators (builders), Organizers (facilitators), Patrons (funders)
- **Civic Sectors**: Governance, education, environment, economy, etc.
- **Innovation Domains**: Network governance, open protocols, collective intelligence, etc.
- **Consortium**: The coordinating body for active practitioners
- **Commons**: Shared knowledge repository of patterns, playbooks, protocols

# Current Message
User: ${message}

Respond helpfully to their message:`;
}

/**
 * Build resource query prompt
 */
function buildResourceQueryPrompt(
  query: string,
  profile: Profile | null,
  relevantResources: string[]
): string {
  return `You are helping someone find relevant OpenCivics resources.

# User Query
"${query}"

# User Context
${profile ? `
- Archetype: ${profile.primary_archetype}
- Completed Quiz: ${profile.quiz_completed}
` : 'New visitor, no profile yet'}

# Relevant Resources Available
${relevantResources.join('\n\n')}

# Your Task
1. **Answer their query** with helpful information
2. **Recommend specific resources** that match their needs
3. **Suggest follow-up questions** they might want to explore

Be specific about which resources would be most helpful and why.

Respond in JSON format:
{
  "response": "Helpful answer to their query, 2-3 paragraphs",
  "suggested_resources": ["resource 1", "resource 2", "resource 3"],
  "follow_up_questions": ["question 1", "question 2", "question 3"]
}`;
}

/**
 * Extract keywords from conversation for resource search
 */
export function extractKeywords(message: string): string[] {
  // Simple keyword extraction - could be enhanced with NLP
  const words = message.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3);

  // Remove common words
  const stopWords = new Set([
    'what', 'how', 'where', 'when', 'why', 'who', 'which', 'this', 'that',
    'with', 'from', 'they', 'them', 'their', 'there', 'here', 'about',
    'could', 'would', 'should', 'might', 'will', 'can', 'does', 'did',
    'have', 'has', 'had', 'been', 'being', 'are', 'was', 'were'
  ]);

  return words.filter(word => !stopWords.has(word));
}

/**
 * Determine conversation type from message content
 */
export function classifyConversationType(message: string): 'general' | 'resource_query' | 'quiz' | 'blueprint_composition' {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('resource') || lowerMessage.includes('pattern') ||
      lowerMessage.includes('protocol') || lowerMessage.includes('playbook')) {
    return 'resource_query';
  }

  if (lowerMessage.includes('quiz') || lowerMessage.includes('archetype') ||
      lowerMessage.includes('take the') || lowerMessage.includes('assessment')) {
    return 'quiz';
  }

  if (lowerMessage.includes('blueprint') || lowerMessage.includes('compose') ||
      lowerMessage.includes('build') || lowerMessage.includes('design')) {
    return 'blueprint_composition';
  }

  return 'general';
}