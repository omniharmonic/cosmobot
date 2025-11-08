// POST /api/chat
// Handle chat messages with AI assistant

import { NextRequest, NextResponse } from 'next/server';
import { handleChatMessage } from '@/lib/gemini/chat-handler';
import { ProfileRepository } from '@/lib/repositories/profile-repository';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, profile_id } = body;

    // Validate required fields
    if (!message) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          message: 'message is required',
        },
        { status: 400 }
      );
    }

    // Get profile if profile_id is provided
    let profile = null;
    if (profile_id) {
      const profileRepo = new ProfileRepository();
      profile = await profileRepo.getById(profile_id);
    }

    // Handle the chat message
    const response = await handleChatMessage(
      message,
      profile,
      [] // TODO: Add conversation history management
    );

    return NextResponse.json({
      success: true,
      data: {
        message: response,
      },
    });
  } catch (error) {
    console.error('Error handling chat message:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to handle chat message',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
