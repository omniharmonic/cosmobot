import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Model configurations for different use cases
export const MODELS = {
  PRO: 'gemini-1.5-pro',      // For complex analysis
  FLASH: 'gemini-1.5-flash',  // For fast responses
} as const;

// Default generation configurations
export const GENERATION_CONFIG = {
  archetype_analysis: {
    temperature: 0.3,  // Lower temperature for consistency
    topP: 0.8,
    maxOutputTokens: 2048,
  },
  summary_generation: {
    temperature: 0.7,  // More creative for summaries
    topP: 0.9,
    maxOutputTokens: 1024,
  },
  chat_response: {
    temperature: 0.6,  // Balanced for conversation
    topP: 0.9,
    maxOutputTokens: 1024,
  },
  resource_analysis: {
    temperature: 0.4,  // Consistent for recommendations
    topP: 0.8,
    maxOutputTokens: 2048,
  },
} as const;

/**
 * Get a Gemini model instance with specified configuration
 */
export function getGeminiModel(
  modelName: keyof typeof MODELS = 'FLASH',
  generationConfig?: typeof GENERATION_CONFIG[keyof typeof GENERATION_CONFIG]
) {
  return genAI.getGenerativeModel({
    model: MODELS[modelName],
    generationConfig,
  });
}

/**
 * Parse JSON response from Gemini, handling potential markdown formatting
 */
export function parseGeminiJson<T = any>(text: string): T {
  try {
    // Clean potential markdown formatting
    const jsonText = text
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    return JSON.parse(jsonText);
  } catch (error) {
    console.error('Failed to parse Gemini JSON response:', text);
    throw new Error(`Invalid JSON response from Gemini: ${error}`);
  }
}

/**
 * Handle errors from Gemini API calls
 */
export function handleGeminiError(error: unknown): never {
  console.error('Gemini API error:', error);

  if (error instanceof Error) {
    // Check for common API errors
    if (error.message.includes('API_KEY')) {
      throw new Error('Gemini API key is invalid or missing');
    }

    if (error.message.includes('QUOTA_EXCEEDED')) {
      throw new Error('Gemini API quota exceeded. Please try again later.');
    }

    if (error.message.includes('RATE_LIMIT')) {
      throw new Error('Too many requests to Gemini API. Please wait and try again.');
    }

    throw new Error(`Gemini API error: ${error.message}`);
  }

  throw new Error('Unknown error occurred with Gemini API');
}

/**
 * Test Gemini API connection
 */
export async function testGeminiConnection(): Promise<boolean> {
  try {
    const model = getGeminiModel('FLASH');
    const result = await model.generateContent('Say "Hello" if you can respond');
    const response = result.response.text();

    return response.toLowerCase().includes('hello');
  } catch (error) {
    console.error('Gemini connection test failed:', error);
    return false;
  }
}

/**
 * Count tokens in text (approximate)
 */
export async function countTokens(text: string, modelName: keyof typeof MODELS = 'FLASH'): Promise<number> {
  try {
    const model = getGeminiModel(modelName);
    const { totalTokens } = await model.countTokens(text);
    return totalTokens;
  } catch (error) {
    // Fallback to rough estimation if counting fails
    return Math.ceil(text.length / 4);
  }
}