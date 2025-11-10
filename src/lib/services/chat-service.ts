import { Profile, QuizResponse } from '@/types';
import { QuizService } from '@/lib/quiz/service';
import { ArchetypeDetectionService } from '@/lib/archetype/detection-service';
import { ProfileCompletionService } from '@/lib/profile/completion-service';
import { supabase } from '@/lib/supabase/client';
import { ProfileRepository } from '@/lib/repositories/profile-repository';
import { QuizRepository } from '@/lib/repositories/quiz-repository';
import { getGeminiModel, GENERATION_CONFIG, parseGeminiJson } from '@/lib/gemini/client';
import { searchResources } from '@/lib/notion/client';
import { QUIZ_QUESTIONS, getNextQuestion, getQuestionById } from '../quiz/config';

interface ChatMessage {
  role: 'user' | 'bot' | 'system';
  content: string;
  timestamp: Date;
  buttons?: MessageButton[];
  inputField?: {
    type: 'text' | 'textarea';
    placeholder: string;
    questionId: string;
  };
}

interface MessageButton {
  id: string;
  label: string;
  value: string;
  icon?: string;
}

interface OnboardingRequest {
  message: string;
  conversationHistory: ChatMessage[];
  profile?: Profile | null;
  sessionId: string;
}

interface OnboardingResponse {
  message: ChatMessage;
  profile?: Profile;
  sessionData?: any;
  completed?: boolean;
}

// In-memory session store for ephemeral profiles and quiz responses
const sessionProfiles = new Map<string, Profile>();
const sessionQuizResponses = new Map<string, QuizResponse[]>(); // key: sessionId, value: array of responses

export class ChatService {
  private quizService: QuizService;
  private archetypeDetectionService: ArchetypeDetectionService;
  private profileCompletionService: ProfileCompletionService;

  constructor() {
    this.quizService = new QuizService();
    this.archetypeDetectionService = new ArchetypeDetectionService();
    this.profileCompletionService = new ProfileCompletionService();
  }

  // Get profile from session store or database
  private async getProfileForSession(profileId: string | null, sessionId: string): Promise<Profile | null> {
    // First check session store for ephemeral profiles
    const sessionProfile = sessionProfiles.get(sessionId);
    if (sessionProfile) {
      console.log('📁 Found profile in session store:', sessionProfile.name);
      return sessionProfile;
    }

    // Fallback to database if profileId provided and not ephemeral
    if (profileId && !profileId.startsWith('ephemeral_')) {
      try {
        return await ProfileRepository.getById(profileId);
      } catch (error) {
        console.warn('Could not fetch profile from database:', error);
        return null;
      }
    }

    return null;
  }

  // Handle quiz responses for ephemeral sessions
  private async getQuizResponsesForSession(profileId: string, sessionId: string): Promise<QuizResponse[]> {
    // Check if this is an ephemeral profile
    if (profileId.startsWith('ephemeral_')) {
      const responses = sessionQuizResponses.get(sessionId) || [];
      console.log(`📋 Found ${responses.length} quiz responses in session store for:`, sessionId);
      return responses;
    }

    // Fallback to database for real profiles
    try {
      return await QuizRepository.getResponsesByProfile(profileId);
    } catch (error) {
      console.warn('Could not fetch quiz responses from database:', error);
      return [];
    }
  }

  private async saveQuizResponseToSession(response: QuizResponse, sessionId: string): Promise<void> {
    const existing = sessionQuizResponses.get(sessionId) || [];
    existing.push(response);
    sessionQuizResponses.set(sessionId, existing);
    console.log('💾 Saved quiz response to session store:', { questionId: response.question_id, sessionId });
  }

  async processOnboardingMessage(request: OnboardingRequest): Promise<OnboardingResponse> {
    const { message, conversationHistory, sessionId } = request;

    // Get profile from session store first, then fallback to provided profile
    const profile = (await this.getProfileForSession(request.profile?.id || null, sessionId) || request.profile) ?? null;

    console.log('🔄 Processing message:', { message, profileId: profile?.id, sessionId, historyLength: conversationHistory.length });

    // First check if this is a specific quiz trigger
    if (this.isQuizTrigger(message, conversationHistory)) {
      const state = this.determineConversationState(message, conversationHistory, profile);
      return this.handleQuizFlow(state, message, profile, sessionId);
    }

    // Check for specific action button clicks
    if (this.isSpecificAction(message)) {
      return this.handleSpecificAction(message, profile, sessionId);
    }

    // Default to natural conversation with AI
    return this.handleNaturalConversation(message, conversationHistory, profile, sessionId);
  }

  private async handleQuizFlow(state: any, message: string, profile: Profile | null, sessionId: string): Promise<OnboardingResponse> {
    console.log('🎯 Handling quiz flow with state:', state);

    // Route based on detected conversation phase
    switch (state.phase) {
      case 'name_collection':
        return this.handleNameCollection(message, sessionId);

      case 'interest_exploration':
        return this.handleInterestExploration(message, profile, sessionId);

      case 'quiz_introduction':
        return this.handleQuizIntroduction();

      case 'welcome':
        return this.handleWelcome();

      case 'quiz_question':
        if (!profile) throw new Error('Profile required for quiz question');
        return this.processQuizResponse(message, profile, sessionId);

      default:
        // Fallback to old logic for backwards compatibility
        break;
    }

    // Handle name input response (first question) - can happen with or without profile
    if (message.includes('intro_welcome:')) {
      const name = message.split('intro_welcome:')[1]?.trim();
      if (!name) {
        return {
          message: {
            role: 'bot',
            content: 'I didn\'t catch your name. What should I call you?\n\n*Just type your name in the chat below.*',
            timestamp: new Date()
          }
        };
      }

      // Create or update profile with name
      let currentProfile: Profile;
      if (!profile) {
        currentProfile = await ProfileRepository.create({
          name: name,
          email: '',
          primary_archetype: 'allies', // Default, will be updated later
          quiz_completed: false,
          quiz_started_at: new Date().toISOString(),
          engagement_actions: [],
          metadata: {}
        });
      } else {
        currentProfile = await ProfileRepository.update(profile.id, { name });
      }

      // Save the name response
      await QuizRepository.saveResponse({
        profile_id: currentProfile.id,
        question_id: 'intro_welcome',
        question_text: 'Welcome to OpenCivics! Before we begin, what should we call you?',
        question_type: 'conversation',
        response_value: name,
        response_raw_text: name,
        question_order: 0
      });

      console.log('✅ Name collected, moving to first quiz question...');

      // Move to first real quiz question
      const nextQuestionResponse = await this.presentNextQuestion(currentProfile.id, 0, sessionId);
      // Include the profile in the response so frontend can track it
      return {
        ...nextQuestionResponse,
        profile: currentProfile
      };
    }

    // If no profile exists and no name provided, start with quiz introduction (name collection)
    if (!profile) {
      return this.handleQuizIntroduction();
    }

    return this.processQuizResponse(message, profile, sessionId);
  }

  private isQuizTrigger(message: string, history: ChatMessage[]): boolean {
    // Check for explicit quiz triggers
    const quizTriggers = [
      'start_quiz',      // Button value
      'start quiz',      // Natural language
      'take_quiz',       // Alt button value
      'take the quiz',   // Natural language
      'begin quiz',
      'quiz',
      'assessment',
      'find my archetype',
      'discover my role'
    ];

    const messageLower = message.toLowerCase().replace(/[_\s]/g, ' '); // Normalize underscores and spaces
    const isExplicitTrigger = quizTriggers.some(trigger => {
      const normalizedTrigger = trigger.toLowerCase().replace(/[_\s]/g, ' ');
      return messageLower.includes(normalizedTrigger) || message === trigger;
    });

    // Check if we're responding to a quiz question (has questionId: format)
    const hasQuestionResponse = message.includes(':') && QUIZ_QUESTIONS.some(q => message.startsWith(`${q.id}:`));

    // Check if we're already in quiz flow
    const isInQuizFlow = this.isCurrentlyInQuizFlow(history);

    return isExplicitTrigger || hasQuestionResponse || isInQuizFlow;
  }

  private isCurrentlyInQuizFlow(history: ChatMessage[]): boolean {
    // Check if recent messages indicate we're in quiz mode
    const recentMessages = history.slice(-3);
    return recentMessages.some(msg =>
      msg.content.includes('what should I call you') ||
      msg.content.includes('Question ') && msg.content.includes(' of ') ||
      msg.content.includes('What brings you to OpenCivics') ||
      msg.content.includes('If you were to get involved') ||
      msg.content.includes('How do you see yourself participating') ||
      msg.content.includes('Which civic sectors') ||
      msg.content.includes('Where are you in your civic innovation journey')
    );
  }

  private isSpecificAction(message: string): boolean {
    const specificActions = [
      'Learn More',
      'Explore Resources',
      'View Recommendations',
      'Join the Network',
      'Tell me about your interests',
      'explore_interests'
    ];

    const messageLower = message.toLowerCase();
    return specificActions.some(action =>
      messageLower.includes(action.toLowerCase()) ||
      action.toLowerCase().includes(messageLower)
    );
  }

  private async handleSpecificAction(message: string, profile: Profile | null, sessionId: string): Promise<OnboardingResponse> {
    const messageLower = message.toLowerCase();

    // Handle Learn More
    if (messageLower.includes('learn more')) {
      return this.handleLearnMore();
    }

    // Handle Explore Resources
    if (messageLower.includes('explore resources')) {
      return this.handleExploreResources(profile);
    }

    // Handle View Recommendations (post-quiz)
    if (messageLower.includes('view recommendations') || messageLower.includes('view_resources')) {
      return this.handleViewRecommendations(profile);
    }

    // Handle Join Network
    if (messageLower.includes('join the network') || messageLower.includes('join_network')) {
      return this.handleJoinNetwork(profile);
    }

    // Handle interest exploration
    if (messageLower.includes('tell me about your interests') || messageLower.includes('explore_interests')) {
      return this.handleStartInterestExploration(profile);
    }

    // Fallback to general action handler
    return this.handleDefault();
  }

  private async handleNaturalConversation(
    message: string,
    history: ChatMessage[],
    profile: Profile | null,
    sessionId: string
  ): Promise<OnboardingResponse> {
    try {
      // Use Gemini to generate a natural response that's contextually aware
      const geminiModel = getGeminiModel('FLASH', GENERATION_CONFIG.chat_response);

      const conversationContext = this.buildConversationContext(message, history, profile);
      const prompt = this.buildNaturalChatPrompt(message, conversationContext);

      const result = await geminiModel.generateContent(prompt);
      const aiResponse = result.response.text();

      // Parse the response to check if AI suggests quiz or resources
      const responseAnalysis = this.analyzeAIResponse(aiResponse);

      const chatMessage: ChatMessage = {
        role: 'bot',
        content: aiResponse,
        timestamp: new Date(),
        buttons: responseAnalysis.suggestedActions
      };

      return { message: chatMessage, profile };
    } catch (error) {
      console.error('Error in natural conversation:', error);
      return this.handleConversationFallback(message);
    }
  }

  private buildConversationContext(message: string, history: ChatMessage[], profile: Profile | null): string {
    const recentHistory = history.slice(-5).map(msg =>
      `${msg.role}: ${msg.content}`
    ).join('\n');

    const profileContext = profile ? `User Profile: ${profile.name || 'Anonymous'}${profile.primary_archetype ? `, Archetype: ${profile.primary_archetype}` : ''}` : 'New visitor';

    return `Recent conversation:\n${recentHistory}\n\n${profileContext}`;
  }

  private buildNaturalChatPrompt(message: string, context: string): string {
    return `You are an AI assistant for OpenCivics, a platform for civic innovation and collaboration. You help people discover their role in civic change through natural conversation.

CONTEXT:
${context}

USER MESSAGE: ${message}

INSTRUCTIONS:
- Be conversational, warm, and genuinely interested in the user
- Ask follow-up questions to understand their interests in civic innovation
- If they express interest in finding their role/archetype, gently suggest the quiz
- If they ask about resources, offer to help find relevant materials
- If they want to get involved, suggest concrete next steps
- Keep responses concise but engaging (2-3 sentences max)
- Use markdown formatting for emphasis when appropriate

AVAILABLE ACTIONS (suggest when appropriate):
- Take the archetype quiz to discover their civic role
- Explore resources based on their interests
- Learn about specific civic innovation topics
- Connect with the OpenCivics community

Respond naturally and helpfully:`;
  }

  private analyzeAIResponse(response: string): { suggestedActions?: MessageButton[] } {
    const buttons: MessageButton[] = [];

    // Check if AI suggests taking quiz
    if (response.toLowerCase().includes('quiz') || response.toLowerCase().includes('discover your role')) {
      buttons.push({
        id: 'start_quiz',
        label: 'Take the Quiz',
        value: 'start_quiz',
        icon: '🎓'
      });
    }

    // Check if AI suggests exploring resources
    if (response.toLowerCase().includes('resources') || response.toLowerCase().includes('explore')) {
      buttons.push({
        id: 'explore',
        label: 'Explore Resources',
        value: 'explore_resources',
        icon: '🔍'
      });
    }

    // Check if AI suggests learning more
    if (response.toLowerCase().includes('learn more') || response.toLowerCase().includes('tell you more')) {
      buttons.push({
        id: 'learn',
        label: 'Learn More',
        value: 'learn_more',
        icon: '📚'
      });
    }

    return { suggestedActions: buttons.length > 0 ? buttons : undefined };
  }

  private handleConversationFallback(message: string): OnboardingResponse {
    const fallbackMessage: ChatMessage = {
      role: 'bot',
      content: "I'd love to chat more about your interests in civic innovation! Feel free to ask me anything about OpenCivics, or if you'd like to discover your role in civic change, I can help with that too.",
      timestamp: new Date(),
      buttons: [
        { id: 'start_quiz', label: 'Take the Quiz', value: 'start_quiz', icon: '🎓' },
        { id: 'learn', label: 'Learn More', value: 'learn_more', icon: '📚' },
        { id: 'explore', label: 'Explore Resources', value: 'explore_resources', icon: '🔍' }
      ]
    };

    return { message: fallbackMessage };
  }

  private determineConversationState(message: string, history: ChatMessage[], profile?: Profile | null) {
    console.log('🔍 Determining state:', { message, hasProfile: !!profile, profileName: profile?.name, historyLength: history.length });
    // Check if this is an explicit quiz start
    const messageLower = message.toLowerCase();
    const isExplicitQuizStart = message === 'start_quiz' ||
                               message === 'take_quiz' ||
                               messageLower.includes('start quiz') ||
                               messageLower.includes('take the quiz') ||
                               messageLower.includes('begin quiz');

    // If explicit quiz start at ANY time, go to quiz introduction
    if (isExplicitQuizStart) {
      console.log('✅ Detected explicit quiz start');
      return { phase: 'quiz_introduction' };
    }

    // If no history and not explicit quiz start, show welcome
    if (!history || history.length === 0) {
      return { phase: 'welcome' };
    }

    const lastBotMessage = history.filter(m => m.role === 'bot').pop();
    const userMessages = history.filter(m => m.role === 'user');


    // Check if we're collecting name (no profile exists and bot recently asked for name)
    if (!profile && userMessages.length > 0) {
      const lastBotMessage = history.filter(m => m.role === 'bot').slice(-1)[0];
      console.log('🔍 Checking name collection:', { lastBotContent: lastBotMessage?.content?.substring(0, 50) });
      if (lastBotMessage?.content.includes('what should I call you') ||
          lastBotMessage?.content.includes('didn\'t catch your name')) {
        console.log('✅ Detected name_collection phase');
        return { phase: 'name_collection' };
      }
    }

    // Check if we're in interest exploration phase
    if (message.startsWith('interest_exploration:')) {
      return { phase: 'interest_exploration' };
    }

    // Check for direct interest exploration (bot recently asked about interests)
    if (profile && userMessages.length > 0) {
      const lastBotMessage = history.filter(m => m.role === 'bot').slice(-1)[0];
      if (lastBotMessage?.content.includes('explore your interests') ||
          lastBotMessage?.content.includes('civic topics are you most passionate about')) {
        return { phase: 'interest_exploration' };
      }
    }

    // Check if we're in quiz phase
    if (profile && !profile.quiz_completed) {
      // Count total quiz responses (including resource selection as first question)
      // Look for the button labels that appear in conversation history
      const allQuizResponses = userMessages.filter(m =>
        // Resource selection options (question 0: resource_contribution_primary)
        m.content.includes('Time to learn and explore civic innovation') ||
        m.content.includes('Time to coordinate, facilitate, and bring people together') ||
        m.content.includes('Skills and expertise to build tools, systems, or infrastructure') ||
        m.content.includes('Financial resources to fund civic innovation and infrastructure') ||
        m.content.includes('A combination of the above') ||
        // Participation options (question 1: participation_mode)
        m.content.includes('Learning & exploring — I want to understand these ideas') ||
        m.content.includes('Building & prototyping — I want to create tools') ||
        m.content.includes('Organizing & weaving — I want to facilitate') ||
        m.content.includes('Funding & resourcing — I want to support') ||
        m.content.includes('Still exploring — I\'m not sure yet') ||
        // Engagement stage options (question 2: engagement_stage)
        m.content.includes('Brand new — Just discovered open civics') ||
        m.content.includes('Learning — Actively exploring frameworks') ||
        m.content.includes('Building — Already working on a civic project') ||
        m.content.includes('Organizing — Leading or facilitating civic work') ||
        m.content.includes('Funding — Looking to support civic innovation') ||
        m.content.includes('Experienced — I\'ve been doing this work') ||
        // Time commitment options (question 3: time_commitment)
        m.content.includes('Casual — A few hours per month') ||
        m.content.includes('Regular — A few hours per week') ||
        m.content.includes('Dedicated — Multiple hours per week') ||
        m.content.includes('Full-time — This is (or could be) my primary work')
      );

      // Total questions: resource selection + 3 additional questions = 4 total
      if (allQuizResponses.length < 4) {
        return { phase: 'quiz_question', questionIndex: allQuizResponses.length };
      } else {
        return { phase: 'archetype_analysis' };
      }
    }

    // Check for specific button values
    if (message === 'start_quiz') {
      return { phase: 'quiz_introduction' };
    }

    // Check for onboarding actions
    if (['join_network', 'subscribe_updates', 'explore_resources', 'book_call'].includes(message)) {
      return { phase: 'onboarding_action' };
    }

    return { phase: 'welcome' };
  }

  private async handleNameCollection(userMessage: string, sessionId: string): Promise<OnboardingResponse> {
    // Parse name from direct chat message (no prefix needed)
    const name = userMessage.trim();
    console.log('👤 Handling name collection:', { userMessage, parsedName: name });

    // Create ephemeral profile (no database save)
    const profile: Profile = {
      id: `ephemeral_${sessionId}`,
      name: name,
      email: '',
      primary_archetype: 'allies', // Default archetype, will be updated later
      quiz_completed: false,
      quiz_started_at: new Date().toISOString(),
      engagement_actions: [],
      metadata: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Store in session store for future requests
    sessionProfiles.set(sessionId, profile);
    console.log('💾 Stored profile in session store for:', sessionId);

    // Save the name response to session store
    const nameResponse: QuizResponse = {
      id: `response_${Date.now()}_0`,
      profile_id: profile.id,
      question_id: 'intro_welcome',
      question_text: 'Welcome to OpenCivics! Before we begin, what should we call you?',
      question_type: 'conversation',
      response_value: name,
      response_raw_text: name,
      question_order: 0,
      time_spent_seconds: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    await this.saveQuizResponseToSession(nameResponse, sessionId);
    console.log('💾 Saved name response to session store');

    // Now present the next question using the standard flow
    return this.presentNextQuestion(profile.id, 0, sessionId);
  }

  private async handleWelcome(): Promise<OnboardingResponse> {
    const message: ChatMessage = {
      role: 'bot',
      content: `👋 **Welcome to OpenCivics!**\n\nI'm here to help you discover how you can get involved with civic innovation and connect you with opportunities that match your interests and skills.\n\nWould you like to take a quick quiz to find your civic archetype and get personalized recommendations?\n\n*Type "start quiz" or just tell me what you're interested in!*`,
      timestamp: new Date(),
      buttons: [
        { id: 'start_quiz', label: 'Start Quiz', value: 'start_quiz', icon: '🎯' },
        { id: 'explore_interests', label: 'Explore My Interests', value: 'explore_interests', icon: '🔍' },
      ]
    };

    return { message };
  }

  private async handleQuizIntroduction(): Promise<OnboardingResponse> {
    const message: ChatMessage = {
      role: 'bot',
      content: 'Awesome! Let\'s begin. First, what should I call you?\n\n*Just type your name in the chat below.*',
      timestamp: new Date()
    };

    return { message };
  }

  private async handleQuizQuestion(questionIndex: number, userMessage: string, profile: Profile | null, sessionId: string): Promise<OnboardingResponse> {
    // Map questionIndex to actual quiz question IDs from config
    const quizQuestionIds = [
      'resource_contribution_primary', // Index 0: resource selection
      'participation_mode',            // Index 1: participation style
      'engagement_stage',             // Index 2: engagement level
      'time_commitment'               // Index 3: time commitment
    ];

    if (profile?.id && questionIndex < quizQuestionIds.length) {
      const questionId = quizQuestionIds[questionIndex];

      await this.quizService.saveResponse({
        profile_id: profile.id,
        question_id: questionId,
        response_value: userMessage
      });
    }

    // Get next question from the actual quiz config
    const questions = [
      // Question 1: participation_mode
      {
        content: 'How do you see yourself participating in open civic innovation?',
        buttons: [
          { id: 'learning', label: 'Learning & exploring — I want to understand these ideas and frameworks', value: 'learning', icon: '🎓' },
          { id: 'building', label: 'Building & prototyping — I want to create tools, systems, or protocols', value: 'building', icon: '🛠️' },
          { id: 'organizing', label: 'Organizing & weaving — I want to facilitate, coordinate, and bring people together', value: 'organizing', icon: '🤝' },
          { id: 'funding', label: 'Funding & resourcing — I want to support civic innovation through capital', value: 'funding', icon: '💰' },
          { id: 'exploring', label: 'Still exploring — I\'m not sure yet', value: 'exploring', icon: '🔍' },
        ]
      },
      // Question 2: engagement_stage
      {
        content: 'Where are you in your civic innovation journey?',
        buttons: [
          { id: 'new_curious', label: 'Brand new — Just discovered open civics and curious to learn more', value: 'new_curious', icon: '🌱' },
          { id: 'learning_exploring', label: 'Learning — Actively exploring frameworks and trying to understand the landscape', value: 'learning_exploring', icon: '📚' },
          { id: 'building_something', label: 'Building — Already working on a civic project, tool, or system', value: 'building_something', icon: '🔧' },
          { id: 'organizing_locally', label: 'Organizing — Leading or facilitating civic work in my community', value: 'organizing_locally', icon: '👥' },
          { id: 'funding_supporting', label: 'Funding — Looking to support civic innovation with resources', value: 'funding_supporting', icon: '💰' },
          { id: 'experienced_looking', label: 'Experienced — I\'ve been doing this work and looking for collaboration opportunities', value: 'experienced_looking', icon: '🌟' },
        ]
      },
      // Question 3: time_commitment
      {
        content: 'How much time can you dedicate to civic innovation?',
        buttons: [
          { id: 'casual', label: 'Casual — A few hours per month', value: 'casual', icon: '⏰' },
          { id: 'regular', label: 'Regular — A few hours per week', value: 'regular', icon: '⏳' },
          { id: 'dedicated', label: 'Dedicated — Multiple hours per week', value: 'dedicated', icon: '⚡' },
          { id: 'full_time', label: 'Full-time — This is (or could be) my primary work', value: 'full_time', icon: '🚀' },
        ]
      },
    ];

    // Resource selection is questionIndex 0, so the additional questions start at index 1
    // Adjust the question array index by subtracting 1
    const adjustedIndex = questionIndex - 1;

    if (adjustedIndex >= 0 && adjustedIndex < questions.length) {
      const question = questions[adjustedIndex];
      const message: ChatMessage = {
        role: 'bot',
        content: question.content,
        timestamp: new Date(),
        buttons: question.buttons
      };
      return { message };
    } else {
      // Complete quiz
      console.log('📊 All quiz questions answered, completing quiz...');
      return this.handleArchetypeAnalysis(profile, sessionId);
    }
  }

  private async handleArchetypeAnalysis(profile: Profile | null, sessionId: string): Promise<OnboardingResponse> {
    if (!profile?.id) {
      console.warn('⚠️ No profile provided for archetype analysis');
      return this.handleDefault();
    }

    try {
      console.log('🔬 Starting archetype analysis...', { profileId: profile.id, sessionId });
      
      // For ephemeral profiles, we need to pass quiz responses from session storage
      const quizResponses = profile.id.startsWith('ephemeral_') 
        ? await this.getQuizResponsesForSession(profile.id, sessionId)
        : undefined;
      
      console.log('📋 Passing quiz responses to completion service:', {
        isEphemeral: profile.id.startsWith('ephemeral_'),
        responseCount: quizResponses?.length || 0
      });
      
      // Use ProfileCompletionService for comprehensive completion
      const completionResult = await this.profileCompletionService.completeProfile(profile.id, quizResponses);

      // Show results with archetype explanation and start interest gathering
      const message: ChatMessage = {
        role: 'bot',
        content: this.generateArchetypeResultsMessage(completionResult.analysis, completionResult.onboarding_summary),
        timestamp: new Date(),
        buttons: [
          { id: 'explore_interests', label: "Tell me about your interests", value: 'explore_interests', icon: '🎯' },
          { id: 'view_resources', label: 'View Recommendations', value: 'view_resources', icon: '📚' },
          { id: 'join_network', label: 'Join the Network', value: 'join_network', icon: '🤝' },
        ]
      };

      return {
        message,
        profile: completionResult.profile,
        completed: true,
        metadata: {
          completionResult: completionResult,
          phase: 'results_shown'
        }
      };
    } catch (error) {
      console.error('Error completing quiz:', error);
      return this.handleDefault();
    }
  }

  private generateArchetypeResultsMessage(analysis: any, onboardingSummary: string): string {
    const archetypeEmojis = {
      allies: '🤝',
      innovators: '🚀',
      organizers: '🌐',
      patrons: '💰'
    };

    const emoji = archetypeEmojis[analysis.validated_archetype] || '✨';
    const confidence = Math.round(analysis.confidence * 100);

    return `🎉 **Amazing!** Based on your responses, you're a **${analysis.validated_archetype}** (${confidence}% confidence).

${emoji} **${analysis.validated_archetype.charAt(0).toUpperCase() + analysis.validated_archetype.slice(1)}** ${analysis.archetype_description || 'are essential to the OpenCivics ecosystem.'}

${onboardingSummary}

I'd love to learn more about your specific interests so I can recommend the most relevant resources from our library. What civic areas or innovation domains are you most passionate about?`;
  }

  private async handleInterestExploration(message: string, profile: Profile | null, sessionId: string): Promise<OnboardingResponse> {
    if (!profile?.id) {
      return this.handleDefault();
    }

    // Use Gemini to extract interests from natural language
    try {
      const model = getGeminiModel('FLASH', GENERATION_CONFIG.chat_response);
      const prompt = `Extract civic sectors and innovation domains from this user message: "${message}"

      Respond with JSON in this format:
      {
        "civic_sectors": ["sector1", "sector2"],
        "innovation_domains": ["domain1", "domain2"],
        "summary": "One sentence about their interests"
      }

      Common civic sectors: governance, environment, economics, community, health, education, justice, technology
      Common innovation domains: blockchain, ai, collective intelligence, network governance, regenerative finance`;

      const result = await model.generateContent(prompt);
      const response = result.response.text();
      const extractedData = parseGeminiJson(response);

      // Search Notion for resources based on extracted interests
      const resources = await searchResources({
        civicSectors: extractedData.civic_sectors,
        innovationDomains: extractedData.innovation_domains,
        archetypes: [profile.primary_archetype as any],
        limit: 5
      });

      // Generate response with resource cards
      const resourceCards = this.generateResourceCards(resources);

      const message: ChatMessage = {
        role: 'bot',
        content: `Perfect! I found some excellent resources related to ${extractedData.summary.toLowerCase()}:\n\n${resourceCards}\n\nWould you like to explore any of these, or tell me about other interests?`,
        timestamp: new Date(),
        buttons: [
          { id: 'more_interests', label: 'Tell me about other interests', value: 'more_interests', icon: '💭' },
          { id: 'join_network', label: 'Join the Network', value: 'join_network', icon: '🤝' },
          { id: 'book_call', label: 'Book a Call', value: 'book_call', icon: '📅' },
        ]
      };

      return { message, profile };
    } catch (error) {
      console.error('Error in interest exploration:', error);
      return {
        message: {
          role: 'bot',
          content: "I'd love to help you explore resources! Could you tell me a bit more about what civic areas interest you most?",
          timestamp: new Date(),
        }
      };
    }
  }

  private generateResourceCards(resources: any[]): string {
    return resources.map(resource => {
      const title = resource.title || 'Resource';
      const description = resource.description || 'No description available';
      const url = resource.url || '#';

      return `📄 **[${title}](${url})**\n${description.substring(0, 100)}${description.length > 100 ? '...' : ''}`;
    }).join('\n\n');
  }

  private async handleCompletion(profile: Profile | null): Promise<OnboardingResponse> {
    const message: ChatMessage = {
      role: 'bot',
      content: `Your OpenCivics journey is ready to begin! You can explore resources, connect with others, and start contributing to civic innovation. What would you like to do first?`,
      timestamp: new Date(),
      buttons: [
        { id: 'explore_resources', label: 'Explore Resources', value: 'explore_resources', icon: '📚' },
        { id: 'join_community', label: 'Join Community', value: 'join_community', icon: '👥' },
        { id: 'start_project', label: 'Start a Project', value: 'start_project', icon: '🚀' },
      ]
    };

    return { message };
  }

  private async handleOnboardingAction(action: string, profile: Profile | null, sessionId: string): Promise<OnboardingResponse> {
    const archetype = profile?.primary_archetype || 'allies';

    switch (action) {
      case 'explore_interests':
        return {
          message: {
            role: 'bot',
            content: `🎯 **Let's explore your interests!**\n\nI'd love to recommend specific resources from our Notion library based on your passions. Tell me about:\n\n• **Civic sectors** you care about (governance, environment, economics, community, etc.)\n• **Innovation areas** that excite you (AI, blockchain, collective intelligence, etc.)\n• **Specific challenges** you want to address\n\nJust describe what you're passionate about in your own words!\n\n*Type your response in the chat below.*`,
            timestamp: new Date()
          }
        };

      case 'join_network':
        return {
          message: {
            role: 'bot',
            content: `🤝 **Welcome to the OpenCivics Network!**\n\nAs an **${archetype}**, here's how you can connect:\n\n• **Discord Community**: Join our active discussions and working groups\n• **Monthly Assembly**: Participate in our open governance calls\n• **Regional Hubs**: Connect with local organizers in your area\n• **Working Groups**: Join archetype-specific groups\n\nI'll send you an invitation link shortly. What would you like to do next?`,
            timestamp: new Date(),
            buttons: [
              { id: 'subscribe_updates', label: 'Get Newsletter', value: 'subscribe_updates', icon: '📧' },
              { id: 'explore_resources', label: 'Explore Resources', value: 'explore_resources', icon: '📚' },
            ]
          }
        };

      case 'subscribe_updates':
        return {
          message: {
            role: 'bot',
            content: `📧 **Stay Connected!**\n\nI'll subscribe you to our **${archetype}** newsletter with:\n\n• Weekly civic innovation insights\n• Archetype-specific opportunities and resources\n• Community updates and events\n• Exclusive access to new tools and frameworks\n\nYou should receive a welcome email within the next few minutes. What would you like to explore next?`,
            timestamp: new Date(),
            buttons: [
              { id: 'explore_resources', label: 'Browse Resources', value: 'explore_resources', icon: '📚' },
              { id: 'book_call', label: 'Book a Call', value: 'book_call', icon: '📅' },
            ]
          }
        };

      case 'explore_resources':
        const resourceSuggestions = this.getArchetypeResources(archetype);
        return {
          message: {
            role: 'bot',
            content: `📚 **Resources for ${archetype}**\n\nBased on your archetype, here are some curated resources to get you started:\n\n${resourceSuggestions.map(r => `• **${r.title}**: ${r.description}`).join('\n')}\n\nI can also help you find resources on specific topics. Just ask me about anything you're curious about!`,
            timestamp: new Date(),
            buttons: [
              { id: 'book_call', label: 'Book a Call', value: 'book_call', icon: '📅' },
              { id: 'ask_question', label: 'Ask a Question', value: 'ask_question', icon: '❓' },
            ]
          }
        };

      case 'book_call':
        return {
          message: {
            role: 'bot',
            content: `📅 **Book a Strategic Call**\n\nGreat choice! As an **${archetype}**, you'll benefit from a personalized conversation about:\n\n• Your specific civic innovation interests\n• How to best contribute to the network\n• Potential collaboration opportunities\n• Archetype-specific resources and pathways\n\n[**Book your 30-minute call here →**](https://calendly.com/opencivics/onboarding)\n\nIs there anything else I can help you with today?`,
            timestamp: new Date(),
            buttons: [
              { id: 'ask_question', label: 'Ask a Question', value: 'ask_question', icon: '❓' },
              { id: 'explore_more', label: 'Continue Exploring', value: 'explore_more', icon: '🔍' },
            ]
          }
        };

      default:
        return this.handleDefault();
    }
  }

  private async handleDefault(): Promise<OnboardingResponse> {
    const message: ChatMessage = {
      role: 'bot',
      content: 'I\'m here to help you discover your role in civic innovation. Would you like to start over?',
      timestamp: new Date(),
      buttons: [
        { id: 'restart', label: 'Start Over', value: 'start_quiz', icon: '🔄' },
        { id: 'help', label: 'Get Help', value: 'help', icon: '❓' },
      ]
    };

    return { message };
  }

  private getArchetypeDescription(archetype: string | null): string {
    switch (archetype) {
      case 'allies':
        return 'learning, exploring, and supporting civic innovation through knowledge sharing and community building';
      case 'innovators':
        return 'building tools, systems, and technological solutions that enable civic participation and social change';
      case 'organizers':
        return 'facilitating connections, coordinating initiatives, and weaving communities together for collective action';
      case 'patrons':
        return 'providing resources, funding, and strategic support to enable regenerative civic systems';
      default:
        return 'contributing to civic innovation in your unique way';
    }
  }

  private generateArchetypeCompletionMessage(archetypeAnalysis: any, nextSteps: string[]): string {
    const archetype = archetypeAnalysis.validated_archetype;
    const confidence = Math.round(archetypeAnalysis.confidence * 100);

    let message = `🎉 **Amazing!** Based on your responses, you're a **${archetype}** (${confidence}% confidence).\n\n`;

    // Add reasoning
    if (archetypeAnalysis.reasoning) {
      message += `${archetypeAnalysis.reasoning}\n\n`;
    }

    // Add key characteristics
    if (archetypeAnalysis.key_characteristics?.length > 0) {
      message += `**Your key characteristics:**\n`;
      archetypeAnalysis.key_characteristics.forEach((char: string) => {
        message += `• ${char}\n`;
      });
      message += `\n`;
    }

    // Add engagement strengths
    if (archetypeAnalysis.engagement_strengths?.length > 0) {
      message += `**Your strengths in civic innovation:**\n`;
      archetypeAnalysis.engagement_strengths.forEach((strength: string) => {
        message += `• ${strength}\n`;
      });
      message += `\n`;
    }

    // Add next steps
    if (nextSteps.length > 0) {
      message += `**Recommended next steps:**\n`;
      nextSteps.slice(0, 3).forEach((step: string) => {
        message += `• ${step}\n`;
      });
      message += `\n`;
    }

    message += `Ready to join the OpenCivics network? Choose how you'd like to get started below! 🚀`;

    return message;
  }

  private async handleLearnMore(): Promise<OnboardingResponse> {
    const message: ChatMessage = {
      role: 'bot',
      content: `📚 **Welcome to OpenCivics!**

OpenCivics is a platform that helps you discover your role in **civic innovation** — the practice of reimagining and rebuilding the systems that shape our communities.

**What we're about:**
• 🌍 **Regenerative Systems**: Building civic infrastructure that strengthens communities and ecosystems
• 🤝 **Collective Intelligence**: Harnessing the wisdom of diverse groups for better decision-making
• 🔄 **Network Governance**: Creating decentralized, participatory models of coordination
• 🛠️ **Open Innovation**: Developing tools and protocols anyone can use and improve

**Your journey here:**
Take our brief quiz to discover your **civic archetype** — your unique way of contributing to positive change. Then explore curated resources, connect with like-minded people, and find specific ways to get involved.

Ready to find your role in shaping the future?`,
      timestamp: new Date(),
      buttons: [
        { id: 'start_quiz', label: 'Take the Quiz', value: 'start_quiz', icon: '🎓' },
        { id: 'explore_resources', label: 'Browse Resources', value: 'explore_resources', icon: '📚' },
        { id: 'learn_archetypes', label: 'Learn About Archetypes', value: 'learn_archetypes', icon: '👥' }
      ]
    };

    return { message };
  }

  private async handleExploreResources(profile: Profile | null): Promise<OnboardingResponse> {
    try {
      const message: ChatMessage = {
        role: 'bot',
        content: `📚 **Explore Our Knowledge Commons**

Ready to dive into civic innovation resources?

**[Browse Knowledge Commons →](https://opencivics.super.site/)**

Our Knowledge Commons contains:
• Frameworks & methodologies
• Case studies & examples
• Tools & templates
• Research & analysis
• Community insights

${profile ?
  `As a **${profile.primary_archetype}**, you'll find resources specifically relevant to your civic role and interests.` :
  'Complete our quiz first to get personalized resource recommendations!'
}`,
        timestamp: new Date(),
        buttons: [
          { id: 'open_knowledge_commons', label: 'Browse Knowledge Commons', value: 'https://opencivics.super.site/', icon: '📚', url: 'https://opencivics.super.site/' },
          { id: 'take_quiz_resources', label: 'Take Quiz for Personalized Resources', value: 'start_quiz', icon: '🎯' }
        ]
      };

      return { message };
    } catch (error) {
      console.error('Error in handleExploreResources:', error);
      return this.handleDefault();
    }
  }

  private async handleViewRecommendations(profile: Profile | null): Promise<OnboardingResponse> {
    if (!profile) {
      return this.handleExploreResources(null);
    }

    try {
      // Get personalized recommendations
      const resources = await searchResources({
        archetypes: [profile.primary_archetype as any],
        limit: 5
      });

      const resourcesText = resources.map(r =>
        `📌 **${r.title}**\n   ${r.description}\n`
      ).join('\n');

      const message: ChatMessage = {
        role: 'bot',
        content: `🎯 **Your Personalized Recommendations**

Based on your **${profile.primary_archetype}** archetype, here are resources selected just for you:

${resourcesText}

These resources align with your strengths and interests. Want to dive deeper or explore other areas?`,
        timestamp: new Date(),
        buttons: [
          { id: 'get_more_recs', label: 'More Recommendations', value: 'get_more_recs', icon: '🎯' },
          { id: 'explore_interests', label: 'Explore Different Topics', value: 'explore_interests', icon: '🌟' },
          { id: 'join_network', label: 'Join Our Network', value: 'join_network', icon: '🤝' }
        ]
      };

      return { message };
    } catch (error) {
      console.error('Error in handleViewRecommendations:', error);
      return this.handleDefault();
    }
  }

  private async handleJoinNetwork(profile: Profile | null): Promise<OnboardingResponse> {
    const archetype = profile?.primary_archetype || 'community member';

    const message: ChatMessage = {
      role: 'bot',
      content: `🤝 **Ready to Join OpenCivics?**

Perfect! Click the link below to join our network:

**[Join OpenCivics Network →](https://www.opencivics.co/join)**

This will give you access to:
• Discord Community & Working Groups
• Monthly Assembly participation
• Regional Hub connections
• Newsletter updates
• Resource libraries

${profile ? `As a **${archetype}**, you'll find like-minded collaborators and opportunities that align with your interests!` : 'Complete the quiz first to get matched with the right working groups and opportunities.'}`,
      timestamp: new Date(),
      buttons: [
        { id: 'open_join_page', label: 'Join OpenCivics', value: 'https://www.opencivics.co/join', icon: '🌐', url: 'https://www.opencivics.co/join' }
      ]
    };

    return { message };
  }

  private async handleStartInterestExploration(profile: Profile | null): Promise<OnboardingResponse> {
    const message: ChatMessage = {
      role: 'bot',
      content: `🌟 **Let's Explore Your Interests**

I'd love to learn more about what drives your passion for civic innovation! This will help me recommend the most relevant resources, connections, and opportunities.

You can tell me about:
• Civic areas you care about (governance, environment, education, etc.)
• Innovation domains that excite you (tech, organizing, finance, etc.)
• Specific challenges or problems you want to address
• Skills you want to develop or contribute

What civic topics are you most passionate about?

*Type your response in the chat below.*`,
      timestamp: new Date()
    };

    return { message };
  }

  private getArchetypeResources(archetype: string): Array<{title: string, description: string}> {
    const resourceMap = {
      allies: [
        { title: 'OpenCivics Framework', description: 'Core principles and approaches to civic innovation' },
        { title: 'Civic Learning Library', description: 'Curated collection of civic innovation resources' },
        { title: 'Community Onboarding Guide', description: 'How to get started and engage effectively' },
      ],
      innovators: [
        { title: 'Open Protocols Repository', description: 'Technical frameworks and standards for civic systems' },
        { title: 'Civic Tech Toolkit', description: 'Tools and patterns for building civic applications' },
        { title: 'Innovation Labs Projects', description: 'Active projects seeking technical contributors' },
      ],
      organizers: [
        { title: 'Facilitation Playbooks', description: 'Guides for organizing and facilitating civic initiatives' },
        { title: 'Community Building Toolkit', description: 'Resources for growing and sustaining civic communities' },
        { title: 'Local Implementation Guides', description: 'How to adapt frameworks to local contexts' },
      ],
      patrons: [
        { title: 'Funding Opportunity Database', description: 'Current grants and funding opportunities in civic innovation' },
        { title: 'Impact Measurement Framework', description: 'How to evaluate and measure civic innovation impact' },
        { title: 'Strategic Partnership Guide', description: 'Building sustainable funding relationships' },
      ]
    };

    return resourceMap[archetype as keyof typeof resourceMap] || resourceMap.allies;
  }

  // ===== COMPREHENSIVE QUIZ IMPLEMENTATION =====

  /**
   * Present the next question in the comprehensive 13-question quiz
   */
  private async presentNextQuestion(profileId: string, currentIndex: number, sessionId?: string): Promise<OnboardingResponse> {
    try {
      // Get the profile to include in the response
      const profile = sessionId 
        ? sessionProfiles.get(sessionId) || null
        : await ProfileRepository.getById(profileId);
      
      // Get all existing responses to check what's been answered
      // Use session storage for ephemeral profiles, database for persistent profiles
      const existingResponses = sessionId 
        ? await this.getQuizResponsesForSession(profileId, sessionId)
        : await QuizRepository.getResponsesByProfile(profileId);
      const answeredQuestionIds = new Set(existingResponses.map(r => r.question_id));

      // Build response map for conditional logic evaluation
      const responseMap: Record<string, any> = {};
      existingResponses.forEach(r => {
        responseMap[r.question_id] = r.response_value;
      });

      console.log('🔍 Quiz progression debug:', {
        currentIndex,
        totalResponses: existingResponses.length,
        answeredQuestions: Array.from(answeredQuestionIds),
        totalQuestions: QUIZ_QUESTIONS.length
      });

      // Find the next unanswered question that should be shown
      let nextQuestion = null;
      let questionNumber = 1;
      let questionsShown = 0; // Track questions actually presented to user

      for (let i = 1; i < QUIZ_QUESTIONS.length; i++) { // Start from 1 (skip intro_welcome)
        const question = QUIZ_QUESTIONS[i];

        // Check if this question should be shown based on conditional logic first
        let shouldShow = true;
        if (question.show_if) {
          shouldShow = this.evaluateCondition(question.show_if, responseMap);
          console.log(`📋 Question ${question.id}: show_if="${question.show_if}" -> ${shouldShow}`);
        }

        // If question should be shown, count it in our numbering
        if (shouldShow) {
          questionsShown++;

          // Check if this question has already been answered
          if (!answeredQuestionIds.has(question.id)) {
            // This is the next question to show!
            nextQuestion = question;
            questionNumber = questionsShown;
            console.log(`✅ Found next question: ${question.id} (will be question #${questionNumber})`);
            break;
          } else {
            console.log(`⏭️ Skipping ${question.id} - already answered`);
          }
        } else {
          console.log(`❌ Skipping ${question.id} - conditional logic failed`);
        }
      }

      if (!nextQuestion) {
        // Quiz is complete! Trigger profile completion
        console.log('🎯 All questions answered, completing quiz...');
        return this.completeComprehensiveQuiz(profileId, sessionId);
      }

      console.log(`📝 Presenting question: ${nextQuestion.id} (${questionNumber} of ~13)`);

      // Convert quiz question to ChatMessage format
      const message = this.formatQuestionAsMessage(nextQuestion, questionNumber, QUIZ_QUESTIONS.length);

      // Always include the profile in the response so frontend can track it
      return { message, profile: profile || undefined };
    } catch (error) {
      console.error('Error presenting next question:', error);
      return {
        message: {
          role: 'bot',
          content: 'Sorry, I encountered an error with the quiz. Let me try again.',
          timestamp: new Date()
        },
        profile: profile || undefined
      };
    }
  }

  /**
   * Process a quiz response and save it to the database
   */
  private async processQuizResponse(message: string, profile: Profile, sessionId: string): Promise<OnboardingResponse> {
    try {
      // Get all existing responses to determine which question we're answering
      const responses = await this.getQuizResponsesForSession(profile.id, sessionId);
      
      // Build response map for conditional logic
      const responseMap: Record<string, any> = {};
      const answeredQuestionIds = new Set<string>();
      responses.forEach(r => {
        responseMap[r.question_id] = r.response_value;
        answeredQuestionIds.add(r.question_id);
      });

      console.log('📋 Current quiz state:', {
        totalResponses: responses.length,
        answeredQuestions: Array.from(answeredQuestionIds),
        lastAnswered: responses[responses.length - 1]?.question_id
      });

      // Find the next unanswered question that should be shown
      let currentQuestion: QuizQuestion | null = null;
      let currentQuestionIndex = 0;
      
      for (let i = 0; i < QUIZ_QUESTIONS.length; i++) {
        const question = QUIZ_QUESTIONS[i];
        
        // Check if this question should be shown based on conditional logic
        let shouldShow = true;
        if (question.show_if) {
          shouldShow = this.evaluateCondition(question.show_if, responseMap);
        }
        
        // If it should be shown and hasn't been answered, this is the current question
        if (shouldShow && !answeredQuestionIds.has(question.id)) {
          currentQuestion = question;
          currentQuestionIndex = i;
          console.log(`✅ Found current question: ${question.id} (index ${i})`);
          break;
        }
      }

      if (!currentQuestion) {
        // All questions answered, complete quiz
        console.log('🎯 All questions answered, completing quiz...');
        return this.completeComprehensiveQuiz(profile.id, sessionId);
      }

      // Parse response based on question type
      let responseValue: any;
      let rawText: string | undefined;

      if (currentQuestion.type === 'conversation' || currentQuestion.type === 'text') {
        // For text/conversation questions, the entire message is the response
        rawText = message.trim();
        responseValue = rawText;
      } else if (currentQuestion.type === 'multi_select') {
        // For multi-select, parse as array if comma-separated
        if (typeof message === 'string' && message.includes(',')) {
          responseValue = message.split(',').map(v => v.trim());
          rawText = message;
        } else {
          responseValue = message;
          rawText = typeof message === 'string' ? message : JSON.stringify(message);
        }
      } else {
        // For button responses, the message is the selected value(s)
        responseValue = message;
        rawText = message;
      }

      // Save the response (to session store for ephemeral profiles, database for real profiles)
      const quizResponse: QuizResponse = {
        id: `response_${Date.now()}`,
        profile_id: profile.id,
        question_id: currentQuestion.id,
        question_text: currentQuestion.text,
        question_type: currentQuestion.type,
        response_value: responseValue,
        response_raw_text: rawText,
        question_order: currentQuestionIndex,
        time_spent_seconds: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      if (profile.id.startsWith('ephemeral_')) {
        // Save to session store for ephemeral profiles
        await this.saveQuizResponseToSession(quizResponse, sessionId);
      } else {
        // Save to database for real profiles
        await QuizRepository.saveResponse({
          profile_id: profile.id,
          question_id: currentQuestion.id,
          question_text: currentQuestion.text,
          question_type: currentQuestion.type,
          response_value: responseValue,
          response_raw_text: rawText,
          question_order: currentQuestionIndex
        });
      }

      console.log('✅ Quiz response saved, moving to next question...', {
        profileId: profile.id,
        questionId: currentQuestion.id,
        currentIndex: currentQuestionIndex,
        isEphemeral: profile.id.startsWith('ephemeral_')
      });

      // Present the next question (increment to move past current question)
      const nextQuestionResponse = await this.presentNextQuestion(profile.id, currentQuestionIndex + 1, sessionId);
      // Ensure profile is included in the response
      return {
        ...nextQuestionResponse,
        profile: nextQuestionResponse.profile || profile
      };
    } catch (error) {
      console.error('❌ Error processing quiz response:', error);
      console.error('Error details:', {
        profileId: profile?.id,
        sessionId,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      return {
        message: {
          role: 'bot',
          content: 'Sorry, I had trouble saving your response. Let me try again.',
          timestamp: new Date()
        },
        profile: profile || undefined
      };
    }
  }

  /**
   * Convert a quiz question to ChatMessage format
   */
  private formatQuestionAsMessage(question: any, current: number, total: number): ChatMessage {
    const progressText = `Question ${current} of ${total}`;

    let content = `**${progressText}**\n\n${question.text}`;
    if (question.description) {
      content += `\n\n*${question.description}*`;
    }

    const message: ChatMessage = {
      role: 'bot',
      content,
      timestamp: new Date()
    };

    // Add appropriate UI elements based on question type
    if (question.type === 'single_select' && question.options) {
      message.buttons = question.options.map((option: any) => ({
        id: option.value,
        label: option.label,
        value: option.value,
        icon: option.icon || undefined
      }));
    } else if (question.type === 'multi_select' && question.options) {
      message.buttons = question.options.map((option: any) => ({
        id: option.value,
        label: option.label,
        value: option.value,
        icon: option.icon || undefined
      }));
      // Add instruction for multi-select
      message.content += '\n\n*Select all that apply*';
    } else if (question.type === 'conversation' || question.type === 'text') {
      // For text/conversation questions, use the regular chat interface
      message.content += question.type === 'conversation'
        ? '\n\n*Please share your thoughts in the chat below*'
        : '\n\n*Please type your response in the chat below*';
    }

    return message;
  }

  /**
   * Complete the comprehensive quiz and trigger profile completion service
   */
  private async completeComprehensiveQuiz(profileId: string, sessionId?: string): Promise<OnboardingResponse> {
    try {
      console.log('🎯 Quiz completed! Running comprehensive profile completion...', {
        profileId,
        isEphemeral: profileId.startsWith('ephemeral_'),
        sessionId
      });

      // Get quiz responses for ephemeral profiles
      const quizResponses = profileId.startsWith('ephemeral_') && sessionId
        ? await this.getQuizResponsesForSession(profileId, sessionId)
        : undefined;

      console.log('📋 Quiz responses for completion:', {
        isEphemeral: profileId.startsWith('ephemeral_'),
        responseCount: quizResponses?.length || 0
      });

      // Add timeout wrapper for profile completion
      const completionPromise = this.profileCompletionService.completeProfile(profileId, quizResponses);
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Profile completion timed out')), 30000) // 30 second timeout
      );

      const completionResult = await Promise.race([completionPromise, timeoutPromise]) as any;

      console.log('✅ Profile completion result:', {
        archetype: completionResult.analysis.validated_archetype,
        confidence: completionResult.analysis.confidence,
        resourceCount: completionResult.recommended_resources.length
      });

      // Create completion message with archetype results and resources
      const archetype = completionResult.analysis.validated_archetype;
      const confidence = Math.round(completionResult.analysis.confidence * 100);
      const reasoning = completionResult.analysis.reasoning;
      const resources = completionResult.recommended_resources.slice(0, 3);

      // Get enhanced archetype info and OpenCivics role recommendations
      const archetypeInfo = this.getEnhancedArchetypeInfo(archetype);
      const openCivicsRole = this.getOpenCivicsRoleRecommendation(archetype);

      let content = `🎉 **Quiz Complete!**

You've been identified as **${this.getArticle(archetype)} ${archetype.charAt(0).toUpperCase() + archetype.slice(1)}** (${confidence}% confidence)

${archetypeInfo.description}

**Why this fits you:**
${this.convertToSecondPerson(reasoning)}

**Your role in OpenCivics:**
${openCivicsRole}

**Personalized recommendations:**
`;

      resources.forEach((resource: any, index: number) => {
        content += `${index + 1}. **${resource.title}** - ${resource.description}\n\n`;
      });

      content += `Ready to step into your role in the civic innovation ecosystem?`;

      const message: ChatMessage = {
        role: 'bot',
        content,
        timestamp: new Date(),
        buttons: [
          { id: 'view_resources', label: 'View More Resources', value: 'https://opencivics.super.site/', icon: '📚', url: 'https://opencivics.super.site/' },
          { id: 'join_network', label: 'Join Our Network', value: 'https://www.opencivics.co/join', icon: '🤝', url: 'https://www.opencivics.co/join' },
          { id: 'start_exploring', label: 'Start Exploring', value: 'explore_interests', icon: '🌟' }
        ]
      };

      return {
        message,
        profile: completionResult.profile,
        completed: true
      };
    } catch (error) {
      console.error('❌ Error completing comprehensive quiz:', error);

      // Try to get the profile and mark it as completed even if AI analysis failed
      let profile: Profile | null = null;
      try {
        profile = await ProfileRepository.findById(profileId);
        if (profile) {
          // Mark quiz as completed in database
          await ProfileRepository.update(profileId, {
            quiz_completed: true,
            quiz_completed_at: new Date().toISOString()
          });
          console.log('✅ Marked quiz as completed in database');
        }
      } catch (profileError) {
        console.error('Error updating profile:', profileError);
      }

      // Provide a graceful fallback with basic archetype assignment
      const message: ChatMessage = {
        role: 'bot',
        content: `🎉 **Quiz Complete!**

Thank you for completing the OpenCivics archetype quiz!

While I'm still processing your detailed results, you can start exploring the platform. Based on your responses, you seem interested in civic innovation and collaboration.

**Next steps:**
• Browse our resource library
• Connect with the OpenCivics community
• Explore different ways to get involved

Your personalized recommendations will be available shortly!`,
        timestamp: new Date(),
        buttons: [
          { id: 'explore_resources', label: 'Browse Resources', value: 'https://opencivics.super.site/', icon: '📚', url: 'https://opencivics.super.site/' },
          { id: 'join_network', label: 'Join Our Network', value: 'https://www.opencivics.co/join', icon: '🤝', url: 'https://www.opencivics.co/join' },
          { id: 'view_recommendations', label: 'Check for Results', value: 'view_recommendations', icon: '🔄' },
          { id: 'learn_more', label: 'Learn More', value: 'learn_more', icon: '💡' }
        ]
      };

      return {
        message,
        profile,
        completed: true // Mark as completed even with fallback
      };
    }
  }

  /**
   * Evaluate conditional logic for quiz questions
   */
  private evaluateCondition(condition: string, responses: Record<string, any>): boolean {
    try {
      // Handle equality checks
      const equalityMatch = condition.match(/(\w+)\s*===\s*['"]([^'"]+)['"]/);
      if (equalityMatch) {
        const [, questionId, value] = equalityMatch;
        return responses[questionId] === value;
      }

      // Handle includes checks for arrays
      const includesMatch = condition.match(/(\w+)\.includes\(['"]([^'"]+)['"]\)/);
      if (includesMatch) {
        const [, questionId, value] = includesMatch;
        const response = responses[questionId];
        return Array.isArray(response) && response.includes(value);
      }

      // Handle OR conditions
      if (condition.includes('||')) {
        const orConditions = condition.split('||').map(c => c.trim());
        return orConditions.some(c => this.evaluateCondition(c, responses));
      }

      // Handle AND conditions
      if (condition.includes('&&')) {
        const andConditions = condition.split('&&').map(c => c.trim());
        return andConditions.every(c => this.evaluateCondition(c, responses));
      }

      return false;
    } catch (error) {
      console.error('Error evaluating condition:', condition, error);
      return false;
    }
  }

  /**
   * Get enhanced archetype description with specific civic focus
   */
  private getEnhancedArchetypeInfo(archetype: string): { description: string } {
    const descriptions = {
      allies: `🤝 **Allies** are the connective tissue of civic movements. You excel at building bridges between different communities, facilitating dialogue, and helping others discover their role in civic change. Your superpower is creating inclusive spaces where diverse perspectives can contribute to collective solutions.`,

      innovators: `🚀 **Innovators** are the builders and creators in civic space. You thrive on designing new tools, systems, and approaches that address civic challenges. Whether through technology, methodology, or creative solutions, you translate ideas into tangible impacts that serve communities.`,

      organizers: `🌐 **Organizers** are the orchestrators of collective action. You have a gift for mobilizing communities, coordinating initiatives, and turning shared vision into coordinated movement. Your strength lies in building power through strategic collaboration and sustained engagement.`,

      patrons: `💰 **Patrons** are the enablers and amplifiers of civic innovation. You understand how to deploy resources—whether financial, network, or institutional—to catalyze meaningful change. Your strategic support helps promising initiatives scale their impact.`
    };

    return {
      description: descriptions[archetype] || `You bring unique value to the civic innovation ecosystem.`
    };
  }

  /**
   * Get OpenCivics role recommendation based on archetype
   */
  private getOpenCivicsRoleRecommendation(archetype: string): string {
    const recommendations = {
      allies: `As an **Ally**, we recommend you **join our Network** to connect with diverse civic innovators, participate in dialogue circles, and help bridge different communities working on systems change. You'll thrive in our monthly assemblies and cross-archetype working groups.`,

      organizers: `As an **Organizer**, you're perfect for our **Consortium**! You can participate as either a **Citizen** (with governance responsibilities and voting power) or **Collaborator** (contributing to projects and activities). This is where coordinators and movement builders collaborate on strategic initiatives, lead working groups, facilitate assemblies, and orchestrate collective impact.`,

      innovators: `As an **Innovator**, the **Consortium** is your home base. You can join as either a **Citizen** (with governance responsibilities and voting power) or **Collaborator** (participating in projects and activities). Connect with other builders working on civic infrastructure, contribute to our open protocols, and collaborate on tools that serve the broader movement.`,

      patrons: `As a **Patron**, we invite you to **join our Network** and explore opportunities to **support Consortium projects**. Your resources and strategic perspective can help promising civic innovations scale their impact. Consider becoming a network member and engaging with our funding and partnership opportunities.`
    };

    return recommendations[archetype] || `Join our network to connect with like-minded civic innovators and find your place in our ecosystem.`;
  }

  /**
   * Get the correct article (a/an) for an archetype
   */
  private getArticle(archetype: string): string {
    // "Allies" and "Organizers" start with vowels -> "an"
    // "Innovators" starts with vowel -> "an"
    // "Patrons" starts with consonant -> "a"
    const vowelStarting = ['allies', 'organizers', 'innovators'];
    return vowelStarting.includes(archetype.toLowerCase()) ? 'an' : 'a';
  }

  /**
   * Convert third person text to second person for "Why this fits you" section
   */
  private convertToSecondPerson(text: string): string {
    if (!text) return text;

    return text
      // Convert third person pronouns to second person
      .replace(/\bthey\b/gi, 'you')
      .replace(/\bthem\b/gi, 'you')
      .replace(/\btheir\b/gi, 'your')
      .replace(/\btheirs\b/gi, 'yours')
      .replace(/\bthemselves\b/gi, 'yourself')
      // Convert "this person" type phrases
      .replace(/\bthis person\b/gi, 'you')
      .replace(/\bthe user\b/gi, 'you')
      .replace(/\bthe individual\b/gi, 'you')
      // Convert verb forms (basic ones)
      .replace(/\bshows\b/gi, 'show')
      .replace(/\bdemonstrates\b/gi, 'demonstrate')
      .replace(/\bindicates\b/gi, 'indicate')
      .replace(/\bexhibits\b/gi, 'exhibit')
      .replace(/\bhas\b/gi, 'have')
      .replace(/\bis\b/gi, 'are')
      // Clean up any "You are" that should be "You're"
      .replace(/\bYou are\b/g, "You're")
      .replace(/\byou are\b/g, "you're");
  }
}