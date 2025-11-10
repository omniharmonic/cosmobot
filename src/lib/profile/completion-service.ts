// OpenCivics Profile Completion Service
// Orchestrates profile generation after quiz completion

import { Profile, ArchetypeAnalysis, ResourceRecommendation, QuizResponse, Archetype } from '@/types';
import { ProfileRepository } from '../repositories/profile-repository';
import { InterestsRepository } from '../repositories/interests-repository';
import { QuizRepository } from '../repositories/quiz-repository';
import { ArchetypeDetectionService } from '../archetype/detection-service';
import { generateOnboardingSummary } from '../gemini/summary-generator';
import { searchResources } from '../notion/client';

export interface ProfileCompletionResult {
  profile: Profile;
  analysis: ArchetypeAnalysis;
  recommended_resources: ResourceRecommendation[];
  onboarding_summary: string;
}

export class ProfileCompletionService {
  private detectionService: ArchetypeDetectionService;

  constructor() {
    this.detectionService = new ArchetypeDetectionService();
  }

  /**
   * Complete profile generation after quiz is finished
   * This orchestrates:
   * 1. Archetype detection
   * 2. Interest extraction
   * 3. Resource recommendations
   * 4. Summary generation
   * 5. Profile image generation (TODO)
   * 
   * @param profile_id - The profile ID
   * @param quizResponses - Optional quiz responses (for ephemeral profiles using session storage)
   */
  async completeProfile(profile_id: string, quizResponses?: QuizResponse[]): Promise<ProfileCompletionResult> {
    console.log('🔄 Starting profile completion...', { 
      profile_id, 
      isEphemeral: profile_id.startsWith('ephemeral_'),
      providedResponses: !!quizResponses 
    });

    // Step 1: Get all quiz responses (use provided responses or fetch from database)
    const responses = quizResponses || await QuizRepository.getResponsesByProfile(profile_id);

    console.log('📋 Quiz responses:', {
      count: responses.length,
      questionIds: responses.map(r => r.question_id)
    });

    if (responses.length === 0) {
      throw new Error('No quiz responses found for profile');
    }

    // Step 2: Detect archetype
    console.log('🔬 Detecting archetype...');
    const analysis = await this.detectionService.detectArchetype(responses);
    console.log('✅ Archetype detected:', {
      archetype: analysis.validated_archetype,
      confidence: analysis.confidence
    });

    // Step 3: Update profile with archetype (skip for ephemeral profiles)
    const isEphemeral = profile_id.startsWith('ephemeral_');
    if (!isEphemeral) {
      await ProfileRepository.update(profile_id, {
        primary_archetype: analysis.validated_archetype,
        primary_confidence: analysis.confidence,
        secondary_archetype: analysis.secondary_archetype || undefined,
        archetype_reasoning: analysis.reasoning,
        consortium_role: analysis.consortium_role_suggestion,
        quiz_completed: true,
        quiz_completed_at: new Date().toISOString(),
      });
      console.log('✅ Profile updated in database');
    } else {
      console.log('⏭️ Skipping database update for ephemeral profile');
    }

    // Step 4: Extract and save interests (skip for ephemeral profiles)
    if (!isEphemeral) {
      await this.saveInterests(profile_id, responses);
      console.log('✅ Interests saved to database');
    }

    // Step 5: Get recommended resources
    // For ephemeral profiles, extract interests directly from responses
    let civic_sectors: string[] = [];
    let innovation_domains: string[] = [];
    
    if (isEphemeral) {
      const civicSectorsResponse = responses.find(r => r.question_id === 'civic_sectors');
      civic_sectors = Array.isArray(civicSectorsResponse?.response_value)
        ? civicSectorsResponse.response_value
        : [];
      
      const innovationDomainsResponse = responses.find(r => r.question_id === 'innovation_domains');
      innovation_domains = Array.isArray(innovationDomainsResponse?.response_value)
        ? innovationDomainsResponse.response_value
        : [];
      
      console.log('📊 Extracted interests from ephemeral responses:', { civic_sectors, innovation_domains });
    } else {
      const interests = await InterestsRepository.getByProfile(profile_id);
      civic_sectors = interests?.civic_sectors || [];
      innovation_domains = interests?.innovation_domains || [];
    }
    
    const resources = await this.getRecommendedResources(
      analysis.validated_archetype,
      civic_sectors,
      innovation_domains
    );

    // Step 6: Generate onboarding summary
    let profile: Profile | null = null;
    
    if (isEphemeral) {
      // For ephemeral profiles, create a minimal profile object
      profile = {
        id: profile_id,
        name: 'User',
        email: '',
        primary_archetype: analysis.validated_archetype,
        primary_confidence: analysis.confidence,
        quiz_completed: true,
        quiz_started_at: new Date().toISOString(),
        engagement_actions: [],
        metadata: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      console.log('📝 Created ephemeral profile object for summary generation');
    } else {
      profile = await ProfileRepository.getById(profile_id);
      if (!profile) {
        throw new Error('Profile not found');
      }
    }

    console.log('📝 Generating onboarding summary...');
    const onboardingSummary = await generateOnboardingSummary(
      profile,
      analysis,
      resources.slice(0, 3)
    );

    // Step 7: Update profile with summary (skip for ephemeral)
    if (!isEphemeral) {
      await ProfileRepository.update(profile_id, {
        onboarding_summary: onboardingSummary,
      });
      console.log('✅ Profile updated with summary');
    }

    // TODO: Step 8: Generate profile image
    // const profileImageUrl = await this.generateProfileImage(profile, analysis);
    // await this.profileRepo.update(profile_id, { profile_image_url: profileImageUrl });

    // Get updated profile (or use ephemeral profile)
    let updatedProfile: Profile;
    if (isEphemeral) {
      updatedProfile = {
        ...profile,
        primary_archetype: analysis.validated_archetype,
        primary_confidence: analysis.confidence,
        secondary_archetype: analysis.secondary_archetype,
        archetype_reasoning: analysis.reasoning,
        consortium_role: analysis.consortium_role_suggestion,
        quiz_completed: true,
        quiz_completed_at: new Date().toISOString(),
        onboarding_summary: onboardingSummary
      };
      console.log('✅ Created complete ephemeral profile');
    } else {
      const fetchedProfile = await ProfileRepository.getById(profile_id);
      if (!fetchedProfile) {
        throw new Error('Failed to retrieve updated profile');
      }
      updatedProfile = fetchedProfile;
    }

    console.log('🎉 Profile completion finished successfully');
    
    return {
      profile: updatedProfile,
      analysis,
      recommended_resources: resources,
      onboarding_summary: onboardingSummary,
    };
  }

  /**
   * Extract interests from quiz responses and save to database
   */
  private async saveInterests(profile_id: string, responses: QuizResponse[]): Promise<void> {
    // Extract civic sectors
    const civicSectorsResponse = responses.find(r => r.question_id === 'civic_sectors');
    const civic_sectors = Array.isArray(civicSectorsResponse?.response_value)
      ? civicSectorsResponse.response_value
      : [];

    // Extract innovation domains
    const innovationDomainsResponse = responses.find(r => r.question_id === 'innovation_domains');
    const innovation_domains = Array.isArray(innovationDomainsResponse?.response_value)
      ? innovationDomainsResponse.response_value
      : [];

    // Extract skills
    const skillsResponse = responses.find(r => r.question_id === 'specific_skills');
    const skills = Array.isArray(skillsResponse?.response_value)
      ? skillsResponse.response_value
      : [];

    // Extract time commitment
    const timeCommitmentResponse = responses.find(r => r.question_id === 'time_commitment');
    console.log('🔍 Time commitment response:', timeCommitmentResponse?.response_value);
    const time_commitment = this.mapTimeCommitmentValue(timeCommitmentResponse?.response_value);
    console.log('✅ Mapped time commitment:', time_commitment);

    // Determine primary civic sector (most important one, or first selected)
    const primary_civic_sector = civic_sectors.length > 0 ? civic_sectors[0] : undefined;

    // Save to database
    await InterestsRepository.upsert({
      profile_id,
      civic_sectors,
      primary_civic_sector,
      innovation_domains: innovation_domains.length > 0 ? innovation_domains : undefined,
      skills: skills.length > 0 ? skills : undefined,
      time_commitment,
    });
  }

  /**
   * Get recommended resources from Notion based on profile
   */
  private async getRecommendedResources(
    archetype: Archetype,
    civic_sectors: string[],
    innovation_domains: string[]
  ): Promise<ResourceRecommendation[]> {
    try {
      // Search Notion for resources matching the profile
      const resources = await searchResources({
        civicSectors: civic_sectors,
        innovationDomains: innovation_domains,
        archetypes: [archetype],
        limit: 10,
      });

      // Convert to ResourceRecommendation format
      // (In a real implementation, we'd use Gemini to rank relevance)
      return resources.map((resource, index) => ({
        ...resource,
        relevance_score: 1.0 - (index * 0.05), // Simple scoring for now
        recommendation_reason: `Matches your interest in ${civic_sectors[0] || 'civic innovation'}`,
        viewed: false,
      }));
    } catch (error) {
      console.error('Error getting recommended resources:', error);
      // Return empty array if resource search fails
      return [];
    }
  }

  /**
   * Get profile completion status
   */
  async getCompletionStatus(profile_id: string): Promise<{
    is_complete: boolean;
    has_archetype: boolean;
    has_interests: boolean;
    has_summary: boolean;
    has_profile_image: boolean;
  }> {
    const profile = await ProfileRepository.getById(profile_id);
    const interests = await InterestsRepository.getByProfile(profile_id);

    return {
      is_complete: profile?.quiz_completed || false,
      has_archetype: !!profile?.primary_archetype,
      has_interests: !!interests && interests.civic_sectors.length > 0,
      has_summary: !!profile?.onboarding_summary,
      has_profile_image: !!profile?.profile_image_url,
    };
  }

  /**
   * Map time commitment display text to database enum values
   */
  private mapTimeCommitmentValue(value: any): 'casual' | 'regular' | 'dedicated' | 'full_time' | undefined {
    if (!value || typeof value !== 'string') {
      return undefined;
    }

    // Map display text to enum values
    const mappings: Record<string, 'casual' | 'regular' | 'dedicated' | 'full_time'> = {
      'casual': 'casual',
      'regular': 'regular',
      'dedicated': 'dedicated',
      'full_time': 'full_time',
      // Map display text to enum values
      'Casual — Just exploring for now': 'casual',
      'Regular — A few hours per week': 'regular',
      'Dedicated — Ready to commit significant time': 'dedicated',
      'Full-time — This is my primary focus': 'full_time',
    };

    return mappings[value] || undefined;
  }
}
