import { supabase } from '../supabase/client';
import type { Database } from '../supabase/types';
import type { ProfileInterests } from '@/types';

type InterestsRow = Database['public']['Tables']['profile_interests']['Row'];
type InterestsInsert = Database['public']['Tables']['profile_interests']['Insert'];
type InterestsUpdate = Database['public']['Tables']['profile_interests']['Update'];

export class InterestsRepository {
  /**
   * Create or update profile interests
   */
  static async upsert(data: InterestsInsert): Promise<ProfileInterests> {
    const { data: interests, error } = await supabase
      .from('profile_interests')
      .upsert(data, {
        onConflict: 'profile_id',
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to save profile interests: ${error.message}`);
    }

    return this.mapRowToInterests(interests);
  }

  /**
   * Get interests by profile ID
   */
  static async getByProfile(profileId: string): Promise<ProfileInterests | null> {
    const { data: interests, error } = await supabase
      .from('profile_interests')
      .select()
      .eq('profile_id', profileId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw new Error(`Failed to get profile interests: ${error.message}`);
    }

    return this.mapRowToInterests(interests);
  }

  /**
   * Update interests
   */
  static async update(profileId: string, data: Partial<InterestsUpdate>): Promise<ProfileInterests> {
    const { data: interests, error } = await supabase
      .from('profile_interests')
      .update(data)
      .eq('profile_id', profileId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update profile interests: ${error.message}`);
    }

    return this.mapRowToInterests(interests);
  }

  /**
   * Get profiles by civic sector
   */
  static async getProfilesBySector(sector: string): Promise<string[]> {
    const { data: interests, error } = await supabase
      .from('profile_interests')
      .select('profile_id')
      .contains('civic_sectors', [sector]);

    if (error) {
      throw new Error(`Failed to get profiles by sector: ${error.message}`);
    }

    return interests.map(i => i.profile_id);
  }

  /**
   * Get profiles by innovation domain
   */
  static async getProfilesByDomain(domain: string): Promise<string[]> {
    const { data: interests, error } = await supabase
      .from('profile_interests')
      .select('profile_id')
      .contains('innovation_domains', [domain]);

    if (error) {
      throw new Error(`Failed to get profiles by domain: ${error.message}`);
    }

    return interests.map(i => i.profile_id);
  }

  /**
   * Get profiles by skill
   */
  static async getProfilesBySkill(skill: string): Promise<string[]> {
    const { data: interests, error } = await supabase
      .from('profile_interests')
      .select('profile_id')
      .contains('skills', [skill]);

    if (error) {
      throw new Error(`Failed to get profiles by skill: ${error.message}`);
    }

    return interests.map(i => i.profile_id);
  }

  /**
   * Get interest analytics
   */
  static async getAnalytics(): Promise<{
    sector_distribution: Record<string, number>;
    domain_distribution: Record<string, number>;
    skill_distribution: Record<string, number>;
    time_commitment_distribution: Record<string, number>;
  }> {
    const { data: allInterests, error } = await supabase
      .from('profile_interests')
      .select('civic_sectors, innovation_domains, skills, time_commitment');

    if (error) {
      throw new Error(`Failed to get interests analytics: ${error.message}`);
    }

    const sectorDistribution: Record<string, number> = {};
    const domainDistribution: Record<string, number> = {};
    const skillDistribution: Record<string, number> = {};
    const timeCommitmentDistribution: Record<string, number> = {};

    allInterests.forEach(interests => {
      // Count civic sectors
      interests.civic_sectors.forEach(sector => {
        sectorDistribution[sector] = (sectorDistribution[sector] || 0) + 1;
      });

      // Count innovation domains
      if (interests.innovation_domains) {
        interests.innovation_domains.forEach(domain => {
          domainDistribution[domain] = (domainDistribution[domain] || 0) + 1;
        });
      }

      // Count skills
      if (interests.skills) {
        interests.skills.forEach(skill => {
          skillDistribution[skill] = (skillDistribution[skill] || 0) + 1;
        });
      }

      // Count time commitment
      if (interests.time_commitment) {
        timeCommitmentDistribution[interests.time_commitment] =
          (timeCommitmentDistribution[interests.time_commitment] || 0) + 1;
      }
    });

    return {
      sector_distribution: sectorDistribution,
      domain_distribution: domainDistribution,
      skill_distribution: skillDistribution,
      time_commitment_distribution: timeCommitmentDistribution,
    };
  }

  /**
   * Search for profiles with similar interests
   */
  static async findSimilarProfiles(
    profileId: string,
    limit: number = 10
  ): Promise<{ profile_id: string; similarity_score: number }[]> {
    const currentInterests = await this.getByProfile(profileId);
    if (!currentInterests) {
      return [];
    }

    // For now, we'll use a simple intersection-based similarity
    // In the future, this could be enhanced with more sophisticated algorithms
    const { data: allProfiles, error } = await supabase
      .from('profile_interests')
      .select('profile_id, civic_sectors, innovation_domains, skills')
      .neq('profile_id', profileId);

    if (error) {
      throw new Error(`Failed to find similar profiles: ${error.message}`);
    }

    const similarities = allProfiles.map(profile => {
      let totalSimilarity = 0;
      let totalFields = 0;

      // Compare civic sectors
      const sectorIntersection = profile.civic_sectors.filter(s =>
        currentInterests.civic_sectors.includes(s)
      );
      const sectorUnion = Array.from(new Set([
        ...profile.civic_sectors,
        ...currentInterests.civic_sectors
      ]));

      if (sectorUnion.length > 0) {
        totalSimilarity += sectorIntersection.length / sectorUnion.length;
        totalFields++;
      }

      // Compare innovation domains
      if (profile.innovation_domains && currentInterests.innovation_domains) {
        const domainIntersection = profile.innovation_domains.filter(d =>
          currentInterests.innovation_domains!.includes(d)
        );
        const domainUnion = Array.from(new Set([
          ...profile.innovation_domains,
          ...currentInterests.innovation_domains
        ]));

        if (domainUnion.length > 0) {
          totalSimilarity += domainIntersection.length / domainUnion.length;
          totalFields++;
        }
      }

      // Compare skills
      if (profile.skills && currentInterests.skills) {
        const skillIntersection = profile.skills.filter(s =>
          currentInterests.skills!.includes(s)
        );
        const skillUnion = Array.from(new Set([
          ...profile.skills,
          ...currentInterests.skills
        ]));

        if (skillUnion.length > 0) {
          totalSimilarity += skillIntersection.length / skillUnion.length;
          totalFields++;
        }
      }

      const averageSimilarity = totalFields > 0 ? totalSimilarity / totalFields : 0;

      return {
        profile_id: profile.profile_id,
        similarity_score: averageSimilarity,
      };
    });

    return similarities
      .filter(s => s.similarity_score > 0)
      .sort((a, b) => b.similarity_score - a.similarity_score)
      .slice(0, limit);
  }

  /**
   * Delete interests
   */
  static async delete(profileId: string): Promise<void> {
    const { error } = await supabase
      .from('profile_interests')
      .delete()
      .eq('profile_id', profileId);

    if (error) {
      throw new Error(`Failed to delete profile interests: ${error.message}`);
    }
  }

  /**
   * Map database row to ProfileInterests type
   */
  private static mapRowToInterests(row: InterestsRow): ProfileInterests {
    return {
      id: row.id,
      profile_id: row.profile_id,
      created_at: row.created_at,
      civic_sectors: row.civic_sectors,
      primary_civic_sector: row.primary_civic_sector || undefined,
      innovation_domains: row.innovation_domains || undefined,
      skills: row.skills || undefined,
      time_commitment: row.time_commitment || undefined,
    };
  }
}