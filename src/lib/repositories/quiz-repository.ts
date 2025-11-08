import { supabase } from '../supabase/client';
import type { Database } from '../supabase/types';
import type { QuizResponse, QuizQuestion } from '@/types';

type QuizResponseRow = Database['public']['Tables']['quiz_responses']['Row'];
type QuizResponseInsert = Database['public']['Tables']['quiz_responses']['Insert'];

export class QuizRepository {
  /**
   * Save a quiz response
   */
  static async saveResponse(data: {
    profile_id: string;
    question_id: string;
    question_text: string;
    question_type: string;
    response_value: any;
    response_raw_text?: string;
    question_order: number;
    time_spent_seconds?: number;
  }): Promise<QuizResponse> {
    const { data: response, error } = await supabase
      .from('quiz_responses')
      .upsert(data, {
        onConflict: 'profile_id,question_id',
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to save quiz response: ${error.message}`);
    }

    return this.mapRowToQuizResponse(response);
  }

  /**
   * Get all responses for a profile
   */
  static async getResponsesByProfile(profileId: string): Promise<QuizResponse[]> {
    const { data: responses, error } = await supabase
      .from('quiz_responses')
      .select()
      .eq('profile_id', profileId)
      .order('question_order');

    if (error) {
      throw new Error(`Failed to get quiz responses: ${error.message}`);
    }

    return responses.map(this.mapRowToQuizResponse);
  }

  /**
   * Get a specific response
   */
  static async getResponse(
    profileId: string,
    questionId: string
  ): Promise<QuizResponse | null> {
    const { data: response, error } = await supabase
      .from('quiz_responses')
      .select()
      .eq('profile_id', profileId)
      .eq('question_id', questionId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw new Error(`Failed to get quiz response: ${error.message}`);
    }

    return this.mapRowToQuizResponse(response);
  }

  /**
   * Delete a response (for back navigation)
   */
  static async deleteResponse(profileId: string, questionId: string): Promise<void> {
    const { error } = await supabase
      .from('quiz_responses')
      .delete()
      .eq('profile_id', profileId)
      .eq('question_id', questionId);

    if (error) {
      throw new Error(`Failed to delete quiz response: ${error.message}`);
    }
  }

  /**
   * Get completion status for a profile
   */
  static async getCompletionStatus(
    profileId: string,
    totalQuestions: number
  ): Promise<{
    completed_questions: number;
    total_questions: number;
    is_complete: boolean;
    completion_percentage: number;
  }> {
    const { data: responses, error } = await supabase
      .from('quiz_responses')
      .select('question_id')
      .eq('profile_id', profileId);

    if (error) {
      throw new Error(`Failed to get completion status: ${error.message}`);
    }

    const completedQuestions = responses.length;
    const isComplete = completedQuestions >= totalQuestions;
    const completionPercentage = Math.round((completedQuestions / totalQuestions) * 100);

    return {
      completed_questions: completedQuestions,
      total_questions: totalQuestions,
      is_complete: isComplete,
      completion_percentage: completionPercentage,
    };
  }

  /**
   * Get analytics for a specific question across all users
   */
  static async getQuestionAnalytics(questionId: string): Promise<{
    total_responses: number;
    response_distribution: Record<string, number>;
    avg_time_spent: number;
  }> {
    const { data: responses, error } = await supabase
      .from('quiz_responses')
      .select('response_value, time_spent_seconds')
      .eq('question_id', questionId);

    if (error) {
      throw new Error(`Failed to get question analytics: ${error.message}`);
    }

    const totalResponses = responses.length;
    const responseDistribution: Record<string, number> = {};
    let totalTimeSpent = 0;
    let timeSpentCount = 0;

    responses.forEach(response => {
      // Count response values
      const value = JSON.stringify(response.response_value);
      responseDistribution[value] = (responseDistribution[value] || 0) + 1;

      // Calculate average time spent
      if (response.time_spent_seconds) {
        totalTimeSpent += response.time_spent_seconds;
        timeSpentCount++;
      }
    });

    const avgTimeSpent = timeSpentCount > 0 ? totalTimeSpent / timeSpentCount : 0;

    return {
      total_responses: totalResponses,
      response_distribution: responseDistribution,
      avg_time_spent: avgTimeSpent,
    };
  }

  /**
   * Batch save multiple responses (for quiz restore)
   */
  static async saveResponses(responses: QuizResponseInsert[]): Promise<QuizResponse[]> {
    const { data, error } = await supabase
      .from('quiz_responses')
      .upsert(responses, {
        onConflict: 'profile_id,question_id',
      })
      .select();

    if (error) {
      throw new Error(`Failed to save quiz responses: ${error.message}`);
    }

    return data.map(this.mapRowToQuizResponse);
  }

  /**
   * Get responses for archetype analysis
   */
  static async getResponsesForAnalysis(profileId: string): Promise<{
    question_id: string;
    question_type: string;
    response_value: any;
    raw_text?: string;
  }[]> {
    const { data: responses, error } = await supabase
      .from('quiz_responses')
      .select('question_id, question_type, response_value, response_raw_text')
      .eq('profile_id', profileId)
      .order('question_order');

    if (error) {
      throw new Error(`Failed to get responses for analysis: ${error.message}`);
    }

    return responses.map(r => ({
      question_id: r.question_id,
      question_type: r.question_type,
      response_value: r.response_value,
      raw_text: r.response_raw_text || undefined,
    }));
  }

  /**
   * Delete all responses for a profile (for quiz restart)
   */
  static async deleteAllResponses(profileId: string): Promise<void> {
    const { error } = await supabase
      .from('quiz_responses')
      .delete()
      .eq('profile_id', profileId);

    if (error) {
      throw new Error(`Failed to delete all quiz responses: ${error.message}`);
    }
  }

  /**
   * Map database row to QuizResponse type
   */
  private static mapRowToQuizResponse(row: QuizResponseRow): QuizResponse {
    return {
      id: row.id,
      profile_id: row.profile_id,
      question_id: row.question_id,
      question_text: row.question_text,
      question_type: row.question_type as any,
      response_value: row.response_value,
      response_raw_text: row.response_raw_text || undefined,
      question_order: row.question_order,
      time_spent_seconds: row.time_spent_seconds || undefined,
      created_at: row.created_at,
    };
  }
}