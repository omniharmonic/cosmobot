// OpenCivics Archetype Detection Service
// Implements hybrid algorithmic + AI detection system

import { Archetype, ArchetypeAnalysis, QuizResponse, ConsortiumRole } from '@/types';
import { QUIZ_CONFIG, getQuestionById } from '../quiz/config';
import { analyzeArchetype } from '../gemini/archetype-analyzer';

export interface ArchetypeScores {
  allies: number;
  innovators: number;
  organizers: number;
  patrons: number;
}

export interface DetectionResult {
  primary_archetype: Archetype;
  primary_confidence: number;
  secondary_archetype?: Archetype;
  archetype_scores: ArchetypeScores;
  reasoning: string;
  consortium_role_suggestion: ConsortiumRole;
}

export class ArchetypeDetectionService {
  /**
   * Detect archetype from quiz responses using hybrid approach
   * 1. Algorithmic scoring
   * 2. AI validation and refinement
   */
  async detectArchetype(responses: QuizResponse[]): Promise<ArchetypeAnalysis> {
    // Step 1: Calculate algorithmic scores
    const algorithmicScores = this.calculateAlgorithmicScores(responses);

    // Step 2: Get AI validation and refinement
    const aiAnalysis = await analyzeArchetype(responses, algorithmicScores);

    return aiAnalysis;
  }

  /**
   * Calculate archetype scores algorithmically based on weighted responses
   */
  private calculateAlgorithmicScores(responses: QuizResponse[]): ArchetypeScores {
    const scores: ArchetypeScores = {
      allies: 0,
      innovators: 0,
      organizers: 0,
      patrons: 0,
    };

    for (const response of responses) {
      const question = getQuestionById(response.question_id);
      if (!question) continue;

      // Get the weight for this question from config
      const questionWeight = QUIZ_CONFIG.archetype_weights[response.question_id];

      if (question.type === 'single_select') {
        // Find the selected option
        const selectedOption = question.options?.find(
          opt => opt.value === response.response_value
        );

        if (selectedOption?.archetype && selectedOption.weight) {
          const archetype = selectedOption.archetype;
          const optionWeight = selectedOption.weight;

          // Apply both question weight and option weight
          const baseWeight = questionWeight?.[archetype] || 0.5;
          scores[archetype] += baseWeight * optionWeight;
        }
      } else if (question.type === 'multi_select') {
        // Handle multi-select responses
        const selectedValues = Array.isArray(response.response_value)
          ? response.response_value
          : [];

        for (const value of selectedValues) {
          const selectedOption = question.options?.find(opt => opt.value === value);

          if (selectedOption?.archetype && selectedOption.weight) {
            const archetype = selectedOption.archetype;
            const optionWeight = selectedOption.weight;

            const baseWeight = questionWeight?.[archetype] || 0.3;
            scores[archetype] += baseWeight * optionWeight;
          }
        }
      } else if (question.type === 'conversation' || question.type === 'text') {
        // For conversational responses, apply signals if defined
        if (question.archetype_signals) {
          for (const [archetype, signal] of Object.entries(question.archetype_signals)) {
            scores[archetype as Archetype] += signal;
          }
        }
      }
    }

    // Normalize scores to sum to 1.0
    const total = Object.values(scores).reduce((sum, score) => sum + score, 0);
    if (total > 0) {
      for (const key in scores) {
        scores[key as Archetype] /= total;
      }
    }

    return scores;
  }

  /**
   * Determine primary archetype from scores
   */
  getPrimaryArchetype(scores: ArchetypeScores): {
    primary: Archetype;
    confidence: number;
    secondary?: Archetype;
  } {
    // Sort archetypes by score
    const sorted = (Object.entries(scores) as [Archetype, number][])
      .sort(([, a], [, b]) => b - a);

    const [primary, primaryScore] = sorted[0];
    const [secondary, secondaryScore] = sorted[1];

    return {
      primary,
      confidence: primaryScore,
      secondary: secondaryScore > 0.2 ? secondary : undefined,
    };
  }

  /**
   * Suggest consortium role based on archetype and responses
   */
  suggestConsortiumRole(
    archetype: Archetype,
    responses: QuizResponse[]
  ): ConsortiumRole {
    // Get time commitment
    const timeCommitmentResponse = responses.find(
      r => r.question_id === 'time_commitment'
    );
    const timeCommitment = timeCommitmentResponse?.response_value;

    // Get engagement stage
    const engagementStageResponse = responses.find(
      r => r.question_id === 'engagement_stage'
    );
    const engagementStage = engagementStageResponse?.response_value;

    // Map archetype and engagement to consortium role
    if (archetype === 'patrons') {
      return 'patron';
    }

    if (archetype === 'allies') {
      // Allies start as allies, can become citizens with regular engagement
      if (timeCommitment === 'regular' || timeCommitment === 'dedicated' || timeCommitment === 'full_time') {
        return 'citizen';
      }
      return 'ally';
    }

    if (archetype === 'innovators' || archetype === 'organizers') {
      // Check if actively building/organizing
      if (
        engagementStage === 'building_something' ||
        engagementStage === 'organizing_locally' ||
        engagementStage === 'experienced_looking'
      ) {
        return 'contributor';
      }

      // Check time commitment
      if (timeCommitment === 'dedicated' || timeCommitment === 'full_time') {
        return 'contributor';
      }

      // Otherwise citizen
      return 'citizen';
    }

    // Default to ally
    return 'ally';
  }

  /**
   * Extract key characteristics from responses
   */
  extractKeyCharacteristics(
    archetype: Archetype,
    responses: QuizResponse[]
  ): string[] {
    const characteristics: string[] = [];

    // Get civic sectors
    const civicSectorsResponse = responses.find(r => r.question_id === 'civic_sectors');
    if (civicSectorsResponse && Array.isArray(civicSectorsResponse.response_value)) {
      const sectors = civicSectorsResponse.response_value.slice(0, 3);
      characteristics.push(`Interested in ${sectors.join(', ')}`);
    }

    // Get innovation domains
    const innovationDomainsResponse = responses.find(r => r.question_id === 'innovation_domains');
    if (innovationDomainsResponse && Array.isArray(innovationDomainsResponse.response_value)) {
      const domains = innovationDomainsResponse.response_value;
      if (domains.length > 0) {
        characteristics.push(`Focus on ${domains.join(', ')}`);
      }
    }

    // Get skills
    const skillsResponse = responses.find(r => r.question_id === 'specific_skills');
    if (skillsResponse && Array.isArray(skillsResponse.response_value)) {
      const skills = skillsResponse.response_value;
      if (skills.length > 0) {
        characteristics.push(`Skills in ${skills.slice(0, 3).join(', ')}`);
      }
    }

    // Get location
    const locationResponse = responses.find(r => r.question_id === 'location');
    if (locationResponse && locationResponse.response_value) {
      const location = locationResponse.response_value;
      if (location && location.toLowerCase() !== 'prefer not to say') {
        characteristics.push(`Based in ${location}`);
      }
    }

    // Get time commitment
    const timeCommitmentResponse = responses.find(r => r.question_id === 'time_commitment');
    if (timeCommitmentResponse) {
      const commitment = timeCommitmentResponse.response_value;
      characteristics.push(`${commitment} time commitment`);
    }

    return characteristics;
  }

  /**
   * Get archetype-specific strengths
   */
  getArchetypeStrengths(archetype: Archetype): string[] {
    const strengthsMap: Record<Archetype, string[]> = {
      allies: [
        'Curious and eager to learn',
        'Helps spread awareness and cultural understanding',
        'Provides feedback and reflections',
        'Builds community awareness',
      ],
      innovators: [
        'Technical expertise and systems thinking',
        'Builds tools and infrastructure',
        'Creates open-source contributions',
        'Drives technical innovation',
      ],
      organizers: [
        'Facilitates and coordinates communities',
        'Bridges global frameworks to local action',
        'Relationship building and cultural translation',
        'Implements systems in real contexts',
      ],
      patrons: [
        'Provides financial and social capital',
        'Enables long-term sustainability',
        'Strategic systems-level perspective',
        'Resources conditions for emergence',
      ],
    };

    return strengthsMap[archetype] || [];
  }

  /**
   * Generate recommended next steps based on archetype
   */
  getRecommendedNextSteps(archetype: Archetype, responses: QuizResponse[]): string[] {
    const baseSteps: Record<Archetype, string[]> = {
      allies: [
        'Subscribe to the OpenCivics newsletter',
        'Explore learning materials and frameworks',
        'Join an upcoming intro call or assembly',
        'Connect with other allies in the network',
      ],
      innovators: [
        'Join the innovators channel on Discord',
        'Explore open protocols and patterns',
        'Apply for OpenCivics Labs projects',
        'Connect with other builders',
      ],
      organizers: [
        'Join the organizers network',
        'Access facilitation resources and playbooks',
        'Apply for implementation support',
        'Connect with local organizing groups',
      ],
      patrons: [
        'Connect with funding opportunities',
        'Join patron circles and calls',
        'Explore portfolio alignment',
        'Schedule a strategic conversation',
      ],
    };

    return baseSteps[archetype] || baseSteps.allies;
  }
}
