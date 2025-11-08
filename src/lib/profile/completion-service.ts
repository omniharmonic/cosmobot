// OpenCivics Profile Completion Service
// Orchestrates profile generation after quiz completion

import { Profile, ArchetypeAnalysis, ResourceRecommendation, QuizResponse } from '@/types';
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
  private profileRepo: ProfileRepository;
  private interestsRepo: InterestsRepository;
  private quizRepo: QuizRepository;
  private detectionService: ArchetypeDetectionService;

  constructor() {
    this.profileRepo = new ProfileRepository();
    this.interestsRepo = new InterestsRepository();
    this.quizRepo = new QuizRepository();
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
   */
  async completeProfile(profile_id: string): Promise<ProfileCompletionResult> {
    // Step 1: Get all quiz responses
    const responses = await this.quizRepo.getResponsesByProfile(profile_id);

    if (responses.length === 0) {
      throw new Error('No quiz responses found for profile');
    }

    // Step 2: Detect archetype
    const analysis = await this.detectionService.detectArchetype(responses);

    // Step 3: Update profile with archetype
    await this.profileRepo.update(profile_id, {
      primary_archetype: analysis.validated_archetype,
      primary_confidence: analysis.confidence,
      secondary_archetype: analysis.secondary_archetype || undefined,
      archetype_reasoning: analysis.reasoning,
      consortium_role: analysis.consortium_role_suggestion,
      quiz_completed: true,
      quiz_completed_at: new Date().toISOString(),
    });

    // Step 4: Extract and save interests
    await this.saveInterests(profile_id, responses);

    // Step 5: Get recommended resources
    const interests = await this.interestsRepo.getByProfileId(profile_id);
    const resources = await this.getRecommendedResources(
      analysis.validated_archetype,
      interests?.civic_sectors || [],
      interests?.innovation_domains || []
    );

    // Step 6: Generate onboarding summary
    const profile = await this.profileRepo.getById(profile_id);
    if (!profile) {
      throw new Error('Profile not found');
    }

    const onboardingSummary = await generateOnboardingSummary(
      profile,
      analysis,
      resources.slice(0, 3)
    );

    // Step 7: Update profile with summary
    await this.profileRepo.update(profile_id, {
      onboarding_summary: onboardingSummary,
    });

    // TODO: Step 8: Generate profile image
    // const profileImageUrl = await this.generateProfileImage(profile, analysis);
    // await this.profileRepo.update(profile_id, { profile_image_url: profileImageUrl });

    // Get updated profile
    const updatedProfile = await this.profileRepo.getById(profile_id);
    if (!updatedProfile) {
      throw new Error('Failed to retrieve updated profile');
    }

    return {
      profile: updatedProfile,
      analysis,
      recommended_resources: resources,
      onboarding_summary,
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
    const time_commitment = timeCommitmentResponse?.response_value as 'casual' | 'regular' | 'dedicated' | 'full_time' | undefined;

    // Determine primary civic sector (most important one, or first selected)
    const primary_civic_sector = civic_sectors.length > 0 ? civic_sectors[0] : undefined;

    // Save to database
    await this.interestsRepo.upsert({
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
    archetype: string,
    civic_sectors: string[],
    innovation_domains: string[]
  ): Promise<ResourceRecommendation[]> {
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
    const profile = await this.profileRepo.getById(profile_id);
    const interests = await this.interestsRepo.getByProfileId(profile_id);

    return {
      is_complete: profile?.quiz_completed || false,
      has_archetype: !!profile?.primary_archetype,
      has_interests: !!interests && interests.civic_sectors.length > 0,
      has_summary: !!profile?.onboarding_summary,
      has_profile_image: !!profile?.profile_image_url,
    };
  }
}
