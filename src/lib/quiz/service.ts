// OpenCivics Quiz Service
// Manages quiz sessions and responses

import { v4 as uuidv4 } from 'uuid';
import { QuizSession, QuizResponse, QuizQuestion, Profile } from '@/types';
import { QUIZ_CONFIG, getNextQuestion, getProgressPercentage } from './config';
import { ProfileRepository } from '../repositories/profile-repository';
import { QuizRepository} from '../repositories/quiz-repository';

export class QuizService {
  private profileRepo: ProfileRepository;
  private quizRepo: QuizRepository;

  constructor() {
    this.profileRepo = new ProfileRepository();
    this.quizRepo = new QuizRepository();
  }

  /**
   * Start a new quiz session
   * Creates a new profile and returns the first question
   */
  async startQuiz(): Promise<{
    session_id: string;
    profile_id: string;
    first_question: QuizQuestion;
    quiz_config: typeof QUIZ_CONFIG;
  }> {
    // Create a new profile with default archetype (will be updated after quiz)
    const profile = await this.profileRepo.create({
      primary_archetype: 'allies', // Default, will be updated
      quiz_completed: false,
      quiz_started_at: new Date().toISOString(),
      quiz_version: QUIZ_CONFIG.version,
      engagement_actions: [],
      metadata: {},
      primary_confidence: 0,
    });

    const session_id = uuidv4();
    const first_question = QUIZ_CONFIG.questions[0];

    return {
      session_id,
      profile_id: profile.id,
      first_question,
      quiz_config: QUIZ_CONFIG,
    };
  }

  /**
   * Save a quiz response and get the next question
   */
  async saveResponse(params: {
    profile_id: string;
    question_id: string;
    response_value: any;
    time_spent_seconds?: number;
  }): Promise<{
    saved: boolean;
    next_question: QuizQuestion | null;
    is_complete: boolean;
    progress_percentage: number;
  }> {
    const { profile_id, question_id, response_value, time_spent_seconds } = params;

    // Find the question to get its metadata
    const question = QUIZ_CONFIG.questions.find(q => q.id === question_id);
    if (!question) {
      throw new Error(`Question not found: ${question_id}`);
    }

    // Get current question index
    const question_order = QUIZ_CONFIG.questions.findIndex(q => q.id === question_id);

    // Save the response
    await this.quizRepo.saveResponse({
      profile_id,
      question_id,
      question_text: question.text,
      question_type: question.type,
      response_value,
      response_raw_text: typeof response_value === 'string' ? response_value : undefined,
      question_order,
      time_spent_seconds,
    });

    // Get all responses so far to evaluate conditional logic
    const allResponses = await this.quizRepo.getResponsesByProfile(profile_id);
    const responsesMap = allResponses.reduce((acc, r) => {
      acc[r.question_id] = r.response_value;
      return acc;
    }, {} as Record<string, any>);

    // Get the next question (handles conditional logic)
    const next_question = getNextQuestion(question_order, responsesMap);
    const is_complete = next_question === null;

    // Calculate progress
    const progress_percentage = getProgressPercentage(question_order + 1);

    // Update profile's last_active_at
    await this.profileRepo.update(profile_id, {
      last_active_at: new Date().toISOString(),
    });

    return {
      saved: true,
      next_question,
      is_complete,
      progress_percentage,
    };
  }

  /**
   * Get all responses for a profile
   */
  async getResponses(profile_id: string): Promise<QuizResponse[]> {
    return this.quizRepo.getResponsesByProfile(profile_id);
  }

  /**
   * Resume a quiz session
   * Returns the next unanswered question
   */
  async resumeQuiz(profile_id: string): Promise<{
    next_question: QuizQuestion | null;
    progress_percentage: number;
    is_complete: boolean;
  }> {
    const responses = await this.quizRepo.getResponsesByProfile(profile_id);

    // Build responses map
    const responsesMap = responses.reduce((acc, r) => {
      acc[r.question_id] = r.response_value;
      return acc;
    }, {} as Record<string, any>);

    // Find the last answered question
    const lastQuestionOrder = responses.length > 0
      ? Math.max(...responses.map(r => r.question_order))
      : -1;

    // Get the next question
    const next_question = getNextQuestion(lastQuestionOrder, responsesMap);
    const is_complete = next_question === null;
    const progress_percentage = getProgressPercentage(lastQuestionOrder + 1);

    return {
      next_question,
      progress_percentage,
      is_complete,
    };
  }

  /**
   * Check if quiz is complete
   */
  async isQuizComplete(profile_id: string): Promise<boolean> {
    const profile = await this.profileRepo.getById(profile_id);
    return profile?.quiz_completed || false;
  }

  /**
   * Mark quiz as complete
   */
  async markQuizComplete(profile_id: string): Promise<void> {
    await this.profileRepo.update(profile_id, {
      quiz_completed: true,
      quiz_completed_at: new Date().toISOString(),
    });
  }

  /**
   * Get quiz statistics
   */
  async getQuizStats(profile_id: string): Promise<{
    total_questions: number;
    answered_questions: number;
    completion_percentage: number;
    time_started: string | undefined;
  }> {
    const profile = await this.profileRepo.getById(profile_id);
    const responses = await this.quizRepo.getResponsesByProfile(profile_id);

    return {
      total_questions: QUIZ_CONFIG.questions.length,
      answered_questions: responses.length,
      completion_percentage: Math.round((responses.length / QUIZ_CONFIG.questions.length) * 100),
      time_started: profile?.quiz_started_at,
    };
  }

  /**
   * Get responses as a map for easy access
   */
  async getResponsesMap(profile_id: string): Promise<Record<string, any>> {
    const responses = await this.quizRepo.getResponsesByProfile(profile_id);
    return responses.reduce((acc, r) => {
      acc[r.question_id] = r.response_value;
      return acc;
    }, {} as Record<string, any>);
  }
}
