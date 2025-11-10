import { getGeminiModel, parseGeminiJson, handleGeminiError, GENERATION_CONFIG } from './client';
import type { ArchetypeAnalysis, QuizResponse, Archetype } from '@/types';

/**
 * Analyze quiz responses and determine participant archetype
 */
export async function analyzeArchetype(
  responses: QuizResponse[],
  algorithmicScores?: Record<Archetype, number>
): Promise<ArchetypeAnalysis> {
  try {
    const model = getGeminiModel('PRO', GENERATION_CONFIG.archetype_analysis);

    const prompt = buildArchetypeAnalysisPrompt(responses, algorithmicScores);
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return parseGeminiJson<ArchetypeAnalysis>(text);
  } catch (error) {
    handleGeminiError(error);
  }
}

/**
 * Validate and refine algorithmic archetype classification
 */
export async function validateArchetypeClassification(
  responses: QuizResponse[],
  algorithmicResult: {
    primary_archetype: Archetype;
    confidence: number;
    archetype_scores: Record<Archetype, number>;
  }
): Promise<ArchetypeAnalysis> {
  try {
    const model = getGeminiModel('PRO', GENERATION_CONFIG.archetype_analysis);

    const prompt = buildValidationPrompt(responses, algorithmicResult);
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return parseGeminiJson<ArchetypeAnalysis>(text);
  } catch (error) {
    handleGeminiError(error);
  }
}

/**
 * Generate quick archetype insights from partial responses
 */
export async function getPartialArchetypeInsights(
  responses: QuizResponse[]
): Promise<{
  likely_archetypes: Archetype[];
  confidence: number;
  insights: string[];
}> {
  try {
    const model = getGeminiModel('FLASH', GENERATION_CONFIG.archetype_analysis);

    const prompt = `You are analyzing partial quiz responses for OpenCivics archetype detection.

# Quick Analysis Task
Based on these partial responses, provide quick insights about likely archetypes.

# Quiz Responses So Far
${formatResponsesForPrompt(responses)}

# OpenCivics Archetypes
- **Allies**: Learners, curious explorers, want to understand frameworks
- **Innovators**: Builders, technical skills, creating systems/tools
- **Organizers**: Facilitators, bringing people together, local action
- **Patrons**: Funders, providing capital/resources, strategic support

Respond in JSON format:
{
  "likely_archetypes": ["archetype1", "archetype2"],
  "confidence": 0.65,
  "insights": ["insight 1", "insight 2"]
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return parseGeminiJson(text);
  } catch (error) {
    handleGeminiError(error);
  }
}

/**
 * Build the main archetype analysis prompt
 */
function buildArchetypeAnalysisPrompt(
  responses: QuizResponse[],
  algorithmicScores?: Record<Archetype, number>
): string {
  return `You are an expert civic engagement analyst for OpenCivics.

Your task is to analyze quiz responses and determine the participant's archetype classification.

# OpenCivics Archetypes

## 1. **Allies** — The Fundamentals Layer
- **Who**: Curious learners, early supporters, aligned with vision
- **Contribute**: Time for learning, cultural signal-boosting, stories
- **Signals**: Wants to explore, understand, learn; new to civic innovation
- **Resources**: Time for learning and exploration
- **Participation**: Learning & exploring

## 2. **Innovators** — The Systems Builders
- **Who**: Technologists, designers, researchers building civic tools
- **Contribute**: Technical skills, expertise, systems/protocols
- **Signals**: Building things, creating tools, prototyping; has technical skills
- **Resources**: Skills, expertise, technical capacity
- **Participation**: Building & prototyping

## 3. **Organizers** — The Community Weavers
- **Who**: Facilitators, civic hosts, local leaders
- **Contribute**: Time for coordination, facilitation capacity
- **Signals**: Bringing people together, organizing locally, facilitating
- **Resources**: Time for organizing, convening, coordinating
- **Participation**: Connecting & organizing

## 4. **Patrons** — The Regenerative Stewards
- **Who**: Funders, philanthropists, institutional allies
- **Contribute**: Financial capital, social capital, cultural capital
- **Signals**: Providing resources, funding, supporting with capital
- **Resources**: Financial resources, funding, capital
- **Participation**: Supporting & funding

# Quiz Responses
${formatResponsesForPrompt(responses)}

${algorithmicScores ? `
# Algorithmic Pre-Classification
${JSON.stringify(algorithmicScores, null, 2)}
` : ''}

# Analysis Framework

Consider these key signals:
1. **Resource Contribution** (strongest signal): What can they contribute?
2. **Participation Mode**: How do they want to participate?
3. **Current Stage**: Where are they in their journey?
4. **Background & Experience**: What's their context?
5. **Skills & Capacity**: What abilities do they have?

# Your Task

Analyze these responses and provide a comprehensive archetype classification.

Look for:
- Clear resource contribution preferences (time/skills/capital)
- Participation mode alignment (learning/building/organizing/funding)
- Current engagement level and experience
- Skills and background that match archetypes
- Any contradictions or nuances that suggest hybrid profiles

Respond in valid JSON format only:
{
  "validated_archetype": "allies|innovators|organizers|patrons",
  "confidence": 0.85,
  "secondary_archetype": "allies|innovators|organizers|patrons|null",
  "reasoning": "Clear 2-3 sentence explanation of classification",
  "archetype_breakdown": {
    "allies": 0.15,
    "innovators": 0.10,
    "organizers": 0.05,
    "patrons": 0.70
  },
  "consortium_role_suggestion": "ally|citizen|contributor|patron",
  "key_characteristics": ["characteristic 1", "characteristic 2"],
  "engagement_strengths": ["strength 1", "strength 2"],
  "recommended_next_steps": ["action 1", "action 2", "action 3"]
}`;
}

/**
 * Build validation prompt for algorithmic results
 */
function buildValidationPrompt(
  responses: QuizResponse[],
  algorithmicResult: {
    primary_archetype: Archetype;
    confidence: number;
    archetype_scores: Record<Archetype, number>;
  }
): string {
  return `You are validating an algorithmic archetype classification for OpenCivics.

# Algorithmic Classification Result
- Primary Archetype: ${algorithmicResult.primary_archetype}
- Confidence: ${algorithmicResult.confidence}
- Scores: ${JSON.stringify(algorithmicResult.archetype_scores, null, 2)}

# Original Quiz Responses
${formatResponsesForPrompt(responses)}

# OpenCivics Archetypes
- **Allies**: Learners exploring civic innovation, contribute time for learning
- **Innovators**: Builders creating tools/systems, contribute technical skills
- **Organizers**: Facilitators bringing people together, contribute coordination time
- **Patrons**: Funders providing capital, contribute financial resources

# Validation Task

Review the algorithmic classification against the actual responses.

Consider:
1. Does the primary archetype match the strongest signals in responses?
2. Is the confidence level appropriate given response clarity?
3. Are there any contradictions or missed nuances?
4. Should the classification be adjusted?

Either confirm the algorithmic result or provide a corrected classification.

Respond in JSON format:
{
  "validated_archetype": "allies|innovators|organizers|patrons",
  "confidence": 0.85,
  "secondary_archetype": "allies|innovators|organizers|patrons|null",
  "reasoning": "Brief explanation of validation decision",
  "archetype_breakdown": {
    "allies": 0.15,
    "innovators": 0.10,
    "organizers": 0.05,
    "patrons": 0.70
  },
  "consortium_role_suggestion": "ally|citizen|contributor|patron",
  "key_characteristics": ["characteristic 1", "characteristic 2"],
  "engagement_strengths": ["strength 1", "strength 2"],
  "recommended_next_steps": ["action 1", "action 2", "action 3"]
}`;
}

/**
 * Format quiz responses for inclusion in prompts
 */
function formatResponsesForPrompt(responses: QuizResponse[]): string {
  return responses.map((response, index) => {
    const valueStr = typeof response.response_value === 'string'
      ? response.response_value
      : JSON.stringify(response.response_value);

    return `
${index + 1}. **${response.question_id}** (${response.question_type})
   Q: ${response.question_text}
   A: ${valueStr}${response.response_raw_text ? `
   Raw: ${response.response_raw_text}` : ''}`;
  }).join('\n');
}

/**
 * Calculate algorithmic archetype scores
 */
export function calculateAlgorithmicScores(
  responses: QuizResponse[],
  questionWeights: Record<string, Record<Archetype, number>>
): Record<Archetype, number> {
  const scores: Record<Archetype, number> = {
    allies: 0,
    innovators: 0,
    organizers: 0,
    patrons: 0,
  };

  responses.forEach(response => {
    const weights = questionWeights[response.question_id];
    if (!weights) return;

    // Apply weights based on response value
    Object.entries(weights).forEach(([archetype, weight]) => {
      scores[archetype as Archetype] += weight;
    });
  });

  return scores;
}

/**
 * Normalize scores to get confidence percentages
 */
export function normalizeArchetypeScores(
  scores: Record<Archetype, number>
): { normalized: Record<Archetype, number>; primary: Archetype; confidence: number } {
  const total = Object.values(scores).reduce((sum, score) => sum + score, 0);

  if (total === 0) {
    return {
      normalized: { allies: 0.25, innovators: 0.25, organizers: 0.25, patrons: 0.25 },
      primary: 'allies',
      confidence: 0,
    };
  }

  const normalized = Object.entries(scores).reduce((acc, [archetype, score]) => {
    acc[archetype as Archetype] = score / total;
    return acc;
  }, {} as Record<Archetype, number>);

  const entries = Object.entries(normalized);
  const primary = entries.reduce((max, [archetype, score]) => {
    const maxScore = normalized[max as Archetype];
    return score > maxScore ? archetype as Archetype : max;
  }, entries[0][0] as Archetype);

  const confidence = normalized[primary];

  return { normalized, primary, confidence };
}