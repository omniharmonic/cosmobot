// OpenCivics Onboarding Assistant - Core Types

// ===== PARTICIPANT ARCHETYPES =====
export type Archetype = 'allies' | 'innovators' | 'organizers' | 'patrons';

export type ConsortiumRole = 'ally' | 'citizen' | 'contributor' | 'patron';

export interface ArchetypeAnalysis {
  validated_archetype: Archetype;
  confidence: number;
  secondary_archetype?: Archetype;
  reasoning: string;
  archetype_breakdown: Record<Archetype, number>;
  consortium_role_suggestion: ConsortiumRole;
  key_characteristics: string[];
  engagement_strengths: string[];
  recommended_next_steps: string[];
}

// ===== QUIZ SYSTEM =====
export type QuestionType =
  | 'single_select'
  | 'multi_select'
  | 'text'
  | 'conversation'
  | 'rating'
  | 'ranking';

export interface QuizOption {
  value: string;
  label: string;
  description?: string;
  archetype?: Archetype;
  weight?: number;
  note?: string;
}

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  text: string;
  description?: string;
  purpose: 'archetype_detection' | 'interest_mapping' | 'engagement_planning' | 'profile_enrichment';
  required: boolean;
  show_if?: string; // Conditional logic
  validation?: {
    min_selections?: number;
    max_selections?: number;
    min_length?: number;
    max_length?: number;
  };
  options?: QuizOption[];
  archetype_signals?: Partial<Record<Archetype, number>>;
}

export interface QuizResponse {
  id: string;
  profile_id: string;
  question_id: string;
  question_text: string;
  question_type: QuestionType;
  response_value: any; // JSON value - could be string, string[], number, etc.
  response_raw_text?: string;
  question_order: number;
  time_spent_seconds?: number;
  created_at: string;
}

export interface QuizSession {
  session_id: string;
  profile_id: string;
  current_question_index: number;
  responses: QuizResponse[];
  quiz_config: QuizConfig;
  started_at: string;
  completed_at?: string;
}

export interface QuizConfig {
  version: string;
  questions: QuizQuestion[];
  archetype_weights: Record<string, Record<Archetype, number>>;
}

// ===== PROFILES =====
export interface Profile {
  id: string;
  created_at: string;
  updated_at: string;

  // Basic info
  name?: string;
  email?: string;
  location?: string;

  // Archetype classification
  primary_archetype: Archetype;
  primary_confidence: number;
  secondary_archetype?: Archetype;
  archetype_reasoning?: string;

  // Consortium role
  consortium_role?: ConsortiumRole;

  // Quiz metadata
  quiz_completed: boolean;
  quiz_started_at?: string;
  quiz_completed_at?: string;
  quiz_version?: string;

  // Generated outputs
  profile_image_url?: string;
  onboarding_summary?: string;

  // Engagement tracking
  engagement_actions: EngagementAction[];
  last_active_at?: string;

  // Extensibility
  metadata: Record<string, any>;
}

export interface ProfileInterests {
  id: string;
  profile_id: string;
  created_at: string;

  // Interest mappings
  civic_sectors: string[];
  primary_civic_sector?: string;
  innovation_domains?: string[];

  // Skills & capacity
  skills?: string[];
  time_commitment?: 'casual' | 'regular' | 'dedicated' | 'full_time';
}

// ===== RESOURCES & RECOMMENDATIONS =====
export interface NotionResource {
  id: string;
  title: string;
  description: string;
  type: 'pattern' | 'playbook' | 'protocol' | 'civic_stack' | 'primitive';
  civic_sectors?: string[];
  innovation_domains?: string[];
  archetype_relevance?: Archetype[];
  tags?: string[];
  url: string;
  status: 'draft' | 'published' | 'archived';
  notion_page_id: string;
}

export interface ResourceRecommendation extends NotionResource {
  relevance_score: number;
  recommendation_reason: string;
  viewed?: boolean;
  viewed_at?: string;
  rated_helpful?: boolean;
}

// ===== CONVERSATIONS =====
export interface ConversationMessage {
  id: string;
  profile_id?: string;
  created_at: string;

  message_role: 'user' | 'assistant' | 'system';
  message_content: string;

  conversation_type: 'quiz' | 'general' | 'resource_query' | 'blueprint_composition';
  session_id?: string;

  // LLM metadata
  gemini_model?: string;
  tokens_used?: number;

  metadata?: Record<string, any>;
}

// ===== ENGAGEMENT ACTIONS =====
export interface EngagementAction {
  id: string;
  type: 'newsletter_signup' | 'event_registration' | 'consortium_application' | 'resource_view' | 'profile_share' | 'chat_interaction';
  label: string;
  url?: string;
  completed: boolean;
  completed_at?: string;
  metadata?: Record<string, any>;
}

// ===== API RESPONSES =====
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface QuizStartResponse {
  session_id: string;
  profile_id: string;
  quiz_config: QuizConfig;
  first_question: QuizQuestion;
}

export interface QuizResponseResponse {
  saved: boolean;
  next_question?: QuizQuestion;
  is_complete: boolean;
}

export interface QuizCompleteResponse {
  profile: Profile;
  recommended_resources: ResourceRecommendation[];
  next_steps: EngagementAction[];
  analysis: ArchetypeAnalysis;
}

// ===== CIVIC SECTORS & DOMAINS =====
export interface CivicSector {
  value: string;
  label: string;
  description: string;
}

export interface InnovationDomain {
  value: string;
  label: string;
  description: string;
  thumbnail?: string;
}

// ===== UI STATE =====
export interface QuizUIState {
  currentQuestion: number;
  totalQuestions: number;
  responses: Record<string, any>;
  isLoading: boolean;
  error?: string;
  canGoBack: boolean;
  canGoNext: boolean;
}

export interface AppState {
  user?: Profile;
  quiz?: QuizUIState;
  recommendations?: ResourceRecommendation[];
  isAuthenticated: boolean;
}

// ===== UTILITY TYPES =====
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};