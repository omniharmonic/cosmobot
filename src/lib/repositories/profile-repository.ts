import { supabase, supabaseAdmin } from '../supabase/client';
import type { Database } from '../supabase/types';
import type { Profile, QuizResponse, ProfileInterests, EngagementAction } from '@/types';

type ProfileRow = Database['public']['Tables']['profiles']['Row'];
type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export class ProfileRepository {
  /**
   * Create a new profile
   */
  static async create(data: Partial<ProfileInsert>): Promise<Profile> {
    const { data: profile, error } = await supabase
      .from('profiles')
      .insert(data)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create profile: ${error.message}`);
    }

    return this.mapRowToProfile(profile);
  }

  /**
   * Get profile by ID
   */
  static async getById(id: string): Promise<Profile | null> {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select()
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw new Error(`Failed to get profile: ${error.message}`);
    }

    return this.mapRowToProfile(profile);
  }

  /**
   * Update profile
   */
  static async update(id: string, data: Partial<ProfileUpdate>): Promise<Profile> {
    const { data: profile, error } = await supabase
      .from('profiles')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update profile: ${error.message}`);
    }

    return this.mapRowToProfile(profile);
  }

  /**
   * Mark quiz as started
   */
  static async startQuiz(id: string, quizVersion: string): Promise<Profile> {
    return this.update(id, {
      quiz_started_at: new Date().toISOString(),
      quiz_version: quizVersion,
      last_active_at: new Date().toISOString(),
    });
  }

  /**
   * Mark quiz as completed
   */
  static async completeQuiz(
    id: string,
    archetypeData: {
      primary_archetype: ProfileRow['primary_archetype'];
      primary_confidence: number;
      secondary_archetype?: ProfileRow['secondary_archetype'];
      archetype_reasoning?: string;
      consortium_role?: ProfileRow['consortium_role'];
      onboarding_summary?: string;
    }
  ): Promise<Profile> {
    return this.update(id, {
      ...archetypeData,
      quiz_completed: true,
      quiz_completed_at: new Date().toISOString(),
      last_active_at: new Date().toISOString(),
    });
  }

  /**
   * Add engagement action
   */
  static async addEngagementAction(
    id: string,
    action: EngagementAction
  ): Promise<Profile> {
    const profile = await this.getById(id);
    if (!profile) {
      throw new Error('Profile not found');
    }

    const updatedActions = [...profile.engagement_actions, action];

    return this.update(id, {
      engagement_actions: updatedActions as any,
      last_active_at: new Date().toISOString(),
    });
  }

  /**
   * Update profile image URL
   */
  static async updateProfileImage(id: string, imageUrl: string): Promise<Profile> {
    return this.update(id, {
      profile_image_url: imageUrl,
    });
  }

  /**
   * Get profiles by archetype
   */
  static async getByArchetype(archetype: ProfileRow['primary_archetype']): Promise<Profile[]> {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select()
      .eq('primary_archetype', archetype)
      .eq('quiz_completed', true)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to get profiles by archetype: ${error.message}`);
    }

    return profiles.map(this.mapRowToProfile);
  }

  /**
   * Get completion statistics
   */
  static async getCompletionStats(): Promise<{
    total_started: number;
    total_completed: number;
    completion_rate: number;
    archetype_distribution: Record<string, number>;
  }> {
    const { data: stats, error } = await supabase
      .from('profiles')
      .select('quiz_completed, primary_archetype');

    if (error) {
      throw new Error(`Failed to get completion stats: ${error.message}`);
    }

    const totalStarted = stats.length;
    const totalCompleted = stats.filter(p => p.quiz_completed).length;
    const completionRate = totalStarted > 0 ? totalCompleted / totalStarted : 0;

    const archetypeDistribution = stats
      .filter(p => p.quiz_completed)
      .reduce((acc, p) => {
        acc[p.primary_archetype] = (acc[p.primary_archetype] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    return {
      total_started: totalStarted,
      total_completed: totalCompleted,
      completion_rate: completionRate,
      archetype_distribution: archetypeDistribution,
    };
  }

  /**
   * Search profiles (for admin/analytics)
   */
  static async search(filters: {
    archetype?: ProfileRow['primary_archetype'];
    completed?: boolean;
    location?: string;
    minConfidence?: number;
    limit?: number;
    offset?: number;
  }): Promise<{ profiles: Profile[]; total: number }> {
    let query = supabase
      .from('profiles')
      .select('*', { count: 'exact' });

    if (filters.archetype) {
      query = query.eq('primary_archetype', filters.archetype);
    }

    if (filters.completed !== undefined) {
      query = query.eq('quiz_completed', filters.completed);
    }

    if (filters.location) {
      query = query.ilike('location', `%${filters.location}%`);
    }

    if (filters.minConfidence) {
      query = query.gte('primary_confidence', filters.minConfidence);
    }

    query = query
      .order('created_at', { ascending: false })
      .range(filters.offset || 0, (filters.offset || 0) + (filters.limit || 50) - 1);

    const { data: profiles, error, count } = await query;

    if (error) {
      throw new Error(`Failed to search profiles: ${error.message}`);
    }

    return {
      profiles: (profiles || []).map(this.mapRowToProfile),
      total: count || 0,
    };
  }

  /**
   * Delete profile (admin only)
   */
  static async delete(id: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete profile: ${error.message}`);
    }
  }

  /**
   * Map database row to Profile type
   */
  private static mapRowToProfile(row: ProfileRow): Profile {
    return {
      id: row.id,
      created_at: row.created_at,
      updated_at: row.updated_at,
      name: row.name || undefined,
      email: row.email || undefined,
      location: row.location || undefined,
      primary_archetype: row.primary_archetype,
      primary_confidence: row.primary_confidence || 0,
      secondary_archetype: row.secondary_archetype || undefined,
      archetype_reasoning: row.archetype_reasoning || undefined,
      consortium_role: row.consortium_role || undefined,
      quiz_completed: row.quiz_completed,
      quiz_started_at: row.quiz_started_at || undefined,
      quiz_completed_at: row.quiz_completed_at || undefined,
      quiz_version: row.quiz_version || undefined,
      profile_image_url: row.profile_image_url || undefined,
      onboarding_summary: row.onboarding_summary || undefined,
      engagement_actions: (row.engagement_actions as EngagementAction[]) || [],
      last_active_at: row.last_active_at || undefined,
      metadata: (row.metadata as Record<string, any>) || {},
    };
  }
}