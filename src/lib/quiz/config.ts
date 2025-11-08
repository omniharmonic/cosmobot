// OpenCivics Onboarding Quiz Configuration
// Based on the Product Requirements Document

import { QuizConfig, QuizQuestion, Archetype } from '@/types';

// Quiz questions following the PRD specification
export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // ===== SECTION 1: INTRODUCTION & CONTEXT =====
  {
    id: 'intro_welcome',
    type: 'conversation',
    text: 'Welcome to OpenCivics! Before we begin, what should we call you?',
    purpose: 'profile_enrichment',
    required: false,
    archetype_signals: {},
  },
  {
    id: 'intro_motivation',
    type: 'conversation',
    text: 'What brings you to OpenCivics today? What are you hoping to explore or achieve?',
    purpose: 'archetype_detection',
    required: true,
    archetype_signals: {
      allies: 0.3,
      innovators: 0.3,
      organizers: 0.3,
      patrons: 0.3,
    },
  },

  // ===== SECTION 2: ARCHETYPE DETECTION (PRIMARY SIGNALS) =====
  {
    id: 'resource_contribution_primary',
    type: 'single_select',
    text: 'If you were to get involved with OpenCivics, what resource would you most naturally contribute?',
    description: 'This helps us understand how you might best participate in the OpenCivics ecosystem.',
    purpose: 'archetype_detection',
    required: true,
    options: [
      {
        value: 'time_learning',
        label: 'Time to learn and explore civic innovation',
        archetype: 'allies',
        weight: 1.0,
      },
      {
        value: 'time_organizing',
        label: 'Time to coordinate, facilitate, and bring people together',
        archetype: 'organizers',
        weight: 1.0,
      },
      {
        value: 'skills_building',
        label: 'Skills and expertise to build tools, systems, or infrastructure',
        archetype: 'innovators',
        weight: 1.0,
      },
      {
        value: 'capital_funding',
        label: 'Financial resources to fund civic innovation and infrastructure',
        archetype: 'patrons',
        weight: 1.0,
      },
      {
        value: 'hybrid_multiple',
        label: 'A combination of the above',
        weight: 0.0,
        note: 'Triggers follow-up multi-select question',
      },
    ],
  },
  {
    id: 'resource_contribution_multiple',
    type: 'multi_select',
    text: 'Which of these resources can you contribute? (Select all that apply)',
    purpose: 'archetype_detection',
    required: true,
    show_if: "resource_contribution_primary === 'hybrid_multiple'",
    validation: {
      min_selections: 2,
      max_selections: 4,
    },
    options: [
      {
        value: 'time_learning',
        label: 'Time to learn and explore',
        archetype: 'allies',
        weight: 0.7,
      },
      {
        value: 'time_organizing',
        label: 'Time to organize and facilitate',
        archetype: 'organizers',
        weight: 0.7,
      },
      {
        value: 'skills_technical',
        label: 'Technical skills (coding, design, etc.)',
        archetype: 'innovators',
        weight: 0.7,
      },
      {
        value: 'skills_facilitation',
        label: 'Facilitation and coordination skills',
        archetype: 'organizers',
        weight: 0.5,
      },
      {
        value: 'capital_funding',
        label: 'Financial resources',
        archetype: 'patrons',
        weight: 0.7,
      },
      {
        value: 'networks',
        label: 'Networks and connections',
        archetype: 'patrons',
        weight: 0.4,
      },
    ],
  },

  {
    id: 'participation_mode',
    type: 'single_select',
    text: 'How do you see yourself participating in open civic innovation?',
    purpose: 'archetype_detection',
    required: true,
    options: [
      {
        value: 'learning',
        label: 'Learning & exploring — I want to understand these ideas and frameworks',
        archetype: 'allies',
        weight: 1.0,
      },
      {
        value: 'building',
        label: 'Building & prototyping — I want to create tools, systems, or protocols',
        archetype: 'innovators',
        weight: 1.0,
      },
      {
        value: 'organizing',
        label: 'Organizing & weaving — I want to facilitate, coordinate, and bring people together',
        archetype: 'organizers',
        weight: 1.0,
      },
      {
        value: 'funding',
        label: 'Funding & resourcing — I want to support civic innovation through capital',
        archetype: 'patrons',
        weight: 1.0,
      },
      {
        value: 'exploring',
        label: 'Still exploring — I\'m not sure yet',
        archetype: 'allies',
        weight: 0.8,
      },
    ],
  },

  {
    id: 'engagement_stage',
    type: 'single_select',
    text: 'Where are you in your civic innovation journey?',
    purpose: 'archetype_detection',
    required: true,
    options: [
      {
        value: 'new_curious',
        label: 'Brand new — Just discovered open civics and curious to learn more',
        archetype: 'allies',
        weight: 0.6,
      },
      {
        value: 'learning_exploring',
        label: 'Learning — Actively exploring frameworks and trying to understand the landscape',
        archetype: 'allies',
        weight: 0.8,
      },
      {
        value: 'building_something',
        label: 'Building — Already working on a civic project, tool, or system',
        archetype: 'innovators',
        weight: 0.9,
      },
      {
        value: 'organizing_locally',
        label: 'Organizing — Leading or facilitating civic work in my community',
        archetype: 'organizers',
        weight: 0.9,
      },
      {
        value: 'funding_supporting',
        label: 'Funding — Looking to support civic innovation with resources',
        archetype: 'patrons',
        weight: 0.9,
      },
      {
        value: 'experienced_looking',
        label: 'Experienced — I\'ve been doing this work and looking for collaboration opportunities',
        weight: 0.0,
      },
    ],
  },

  // ===== SECTION 3: INTEREST MAPPING =====
  {
    id: 'civic_sectors',
    type: 'multi_select',
    text: 'Which civic sectors are you most interested in? (Select 1-5)',
    purpose: 'interest_mapping',
    required: true,
    validation: {
      min_selections: 1,
      max_selections: 5,
    },
    options: [
      {
        value: 'governance',
        label: 'Governance & Political Systems',
        description: 'Decision-making, policy, participatory governance',
      },
      {
        value: 'civic_engagement',
        label: 'Civic Engagement & Participation',
        description: 'Assemblies, dialogue, collective action',
      },
      {
        value: 'justice',
        label: 'Justice & Legal Systems',
        description: 'Fairness, accountability, restorative justice',
      },
      {
        value: 'education',
        label: 'Educational & Learning Systems',
        description: 'Lifelong learning, civic literacy, open knowledge',
      },
      {
        value: 'environment',
        label: 'Environmental & Sustainability',
        description: 'Regeneration, ecosystems, biodiversity, stewardship',
      },
      {
        value: 'economy',
        label: 'Economic & Resource Sharing',
        description: 'Cooperation, mutual aid, shared wealth',
      },
      {
        value: 'health',
        label: 'Health & Well-Being',
        description: 'Physical, mental, social health and care',
      },
      {
        value: 'transportation',
        label: 'Transportation & Mobility',
        description: 'Equitable, sustainable movement systems',
      },
      {
        value: 'culture',
        label: 'Cultural & Creative Systems',
        description: 'Art, storytelling, ritual, shared meaning',
      },
      {
        value: 'security',
        label: 'Security & Safety',
        description: 'Care, preparedness, mutual responsibility',
      },
      {
        value: 'technology',
        label: 'Digital & Technological Systems',
        description: 'Ethical tech, digital infrastructure',
      },
      {
        value: 'media',
        label: 'Information & Media Systems',
        description: 'Open journalism, collective sensemaking',
      },
    ],
  },

  {
    id: 'innovation_domains',
    type: 'multi_select',
    text: 'Which innovation approaches resonate with you? (Select up to 3)',
    purpose: 'interest_mapping',
    required: false,
    show_if: "resource_contribution_primary === 'skills_building' || resource_contribution_primary === 'time_organizing' || participation_mode === 'building' || participation_mode === 'organizing'",
    validation: {
      min_selections: 1,
      max_selections: 3,
    },
    options: [
      {
        value: 'network_governance',
        label: 'Network Governance',
        description: 'Decentralized coordination through shared principles',
      },
      {
        value: 'bioregional',
        label: 'Bioregional Coordination',
        description: 'Place-based governance aligned with ecosystems',
      },
      {
        value: 'open_protocols',
        label: 'Open Protocols',
        description: 'Shared standards for interoperability',
      },
      {
        value: 'digital_infrastructure',
        label: 'Digital Public Infrastructure',
        description: 'Commons-based digital systems (identity, data, payments)',
      },
      {
        value: 'knowledge_commoning',
        label: 'Knowledge Commoning',
        description: 'Collective stewardship of information and research',
      },
      {
        value: 'capital_allocation',
        label: 'Capital Allocation',
        description: 'Redesigning value flows for regeneration',
      },
      {
        value: 'collective_intelligence',
        label: 'Collective Intelligence',
        description: 'Group thinking, learning, and decision-making',
      },
    ],
  },

  // ===== SECTION 4: SKILLS & CAPACITY =====
  {
    id: 'specific_skills',
    type: 'multi_select',
    text: 'What specific skills or expertise do you bring?',
    purpose: 'profile_enrichment',
    required: false,
    show_if: "resource_contribution_primary === 'skills_building' || resource_contribution_primary === 'time_organizing' || resource_contribution_multiple.includes('skills_technical') || resource_contribution_multiple.includes('skills_facilitation')",
    options: [
      // Technical skills (Innovators)
      {
        value: 'software_dev',
        label: 'Software Development',
      },
      {
        value: 'systems_design',
        label: 'Systems & Protocol Design',
      },
      {
        value: 'data_research',
        label: 'Data Science & Research',
      },
      {
        value: 'ux_design',
        label: 'UX/UI Design',
      },
      {
        value: 'product_management',
        label: 'Product Management',
      },
      // Organizing skills (Organizers)
      {
        value: 'facilitation',
        label: 'Facilitation & Group Process',
      },
      {
        value: 'community_building',
        label: 'Community Organizing',
      },
      {
        value: 'event_coordination',
        label: 'Event Planning & Coordination',
      },
      {
        value: 'participatory_governance',
        label: 'Participatory Governance',
      },
      // Cross-cutting skills
      {
        value: 'writing_comms',
        label: 'Writing & Communication',
      },
      {
        value: 'teaching',
        label: 'Teaching & Education',
      },
      {
        value: 'legal_policy',
        label: 'Legal & Policy',
      },
      {
        value: 'finance_ops',
        label: 'Finance & Operations',
      },
      {
        value: 'other',
        label: 'Other (tell us more!)',
      },
    ],
  },

  {
    id: 'time_commitment',
    type: 'single_select',
    text: 'How much time can you dedicate to civic innovation?',
    purpose: 'engagement_planning',
    required: true,
    options: [
      {
        value: 'casual',
        label: 'Casual — A few hours per month',
        description: 'Occasional learning, events, and exploration',
      },
      {
        value: 'regular',
        label: 'Regular — A few hours per week',
        description: 'Consistent participation in projects or organizing',
      },
      {
        value: 'dedicated',
        label: 'Dedicated — Multiple hours per week',
        description: 'Deep engagement in building, organizing, or supporting',
      },
      {
        value: 'full_time',
        label: 'Full-time — This is (or could be) my primary work',
        description: 'Professional or near-professional involvement',
      },
    ],
  },

  // ===== SECTION 5: CONTEXT & CONNECTION =====
  {
    id: 'location',
    type: 'text',
    text: 'Where are you located? (City, Region, or "Prefer not to say")',
    description: 'Helps connect you with local organizers and bioregional initiatives',
    purpose: 'profile_enrichment',
    required: false,
  },

  {
    id: 'experience_background',
    type: 'conversation',
    text: 'Tell us briefly about your background or experience with civic organizing, community work, or systems innovation. (Optional but helps us understand you better!)',
    purpose: 'profile_enrichment',
    required: false,
  },

  {
    id: 'current_work',
    type: 'conversation',
    text: 'Are you currently working on any civic projects, initiatives, or funding strategies? Tell us about it!',
    purpose: 'profile_enrichment',
    required: false,
    show_if: "engagement_stage === 'building_something' || engagement_stage === 'organizing_locally' || engagement_stage === 'funding_supporting' || engagement_stage === 'experienced_looking'",
  },
];

// Archetype weights configuration
// Used for algorithmic scoring of responses
export const ARCHETYPE_WEIGHTS: QuizConfig['archetype_weights'] = {
  // Question weights for each archetype
  resource_contribution_primary: {
    allies: 1.0,
    innovators: 1.0,
    organizers: 1.0,
    patrons: 1.0,
  },
  participation_mode: {
    allies: 1.0,
    innovators: 1.0,
    organizers: 1.0,
    patrons: 1.0,
  },
  engagement_stage: {
    allies: 0.8,
    innovators: 0.8,
    organizers: 0.8,
    patrons: 0.8,
  },
  time_commitment: {
    allies: 0.2,
    innovators: 0.2,
    organizers: 0.2,
    patrons: 0.2,
  },
};

// Complete quiz configuration
export const QUIZ_CONFIG: QuizConfig = {
  version: 'v1.0',
  questions: QUIZ_QUESTIONS,
  archetype_weights: ARCHETYPE_WEIGHTS,
};

// Helper function to get the next question based on responses
export function getNextQuestion(
  currentQuestionIndex: number,
  responses: Record<string, any>
): QuizQuestion | null {
  const nextIndex = currentQuestionIndex + 1;

  // Check if we've reached the end
  if (nextIndex >= QUIZ_QUESTIONS.length) {
    return null;
  }

  const nextQuestion = QUIZ_QUESTIONS[nextIndex];

  // Check conditional logic
  if (nextQuestion.show_if) {
    const shouldShow = evaluateCondition(nextQuestion.show_if, responses);
    if (!shouldShow) {
      // Skip this question and check the next one
      return getNextQuestion(nextIndex, responses);
    }
  }

  return nextQuestion;
}

// Helper function to evaluate conditional logic
function evaluateCondition(condition: string, responses: Record<string, any>): boolean {
  try {
    // Simple condition evaluation
    // Format: "question_id === 'value'" or "question_id.includes('value')"

    // Handle equality checks
    const equalityMatch = condition.match(/(\w+)\s*===\s*['"]([^'"]+)['"]/);
    if (equalityMatch) {
      const [, questionId, value] = equalityMatch;
      return responses[questionId] === value;
    }

    // Handle includes checks
    const includesMatch = condition.match(/(\w+)\.includes\(['"]([^'"]+)['"]\)/);
    if (includesMatch) {
      const [, questionId, value] = includesMatch;
      const response = responses[questionId];
      return Array.isArray(response) && response.includes(value);
    }

    // Handle OR conditions
    if (condition.includes('||')) {
      const orConditions = condition.split('||').map(c => c.trim());
      return orConditions.some(c => evaluateCondition(c, responses));
    }

    // Handle AND conditions (not in current quiz but good to have)
    if (condition.includes('&&')) {
      const andConditions = condition.split('&&').map(c => c.trim());
      return andConditions.every(c => evaluateCondition(c, responses));
    }

    return false;
  } catch (error) {
    console.error('Error evaluating condition:', condition, error);
    return false;
  }
}

// Get question by ID
export function getQuestionById(questionId: string): QuizQuestion | undefined {
  return QUIZ_QUESTIONS.find(q => q.id === questionId);
}

// Get total number of questions (including conditional ones)
export function getTotalQuestions(): number {
  return QUIZ_QUESTIONS.length;
}

// Get progress percentage
export function getProgressPercentage(currentQuestionIndex: number): number {
  return Math.round((currentQuestionIndex / QUIZ_QUESTIONS.length) * 100);
}
