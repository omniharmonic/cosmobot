import { NextRequest, NextResponse } from 'next/server';
import { ChatService } from '@/lib/services/chat-service';
import { ProfileRepository } from '@/lib/repositories/profile-repository';
import { QuizRepository } from '@/lib/repositories/quiz-repository';
import { supabase } from '@/lib/supabase/client';
import { Profile } from '@/types';

const chatService = new ChatService();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, conversationHistory, profileId, sessionId } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Process the chat message and get response
    // ChatService handles profile lookup internally from session store or database
    const response = await chatService.processOnboardingMessage({
      message,
      conversationHistory: conversationHistory || [],
      profile: profileId ? { id: profileId } as Profile : null, // Pass minimal profile for lookup
      sessionId: sessionId || generateSessionId()
    });

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error in chat onboarding:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}

function generateSessionId(): string {
  return `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}