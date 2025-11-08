// POST /api/quiz/complete
// Completes the quiz and generates the profile

import { NextRequest, NextResponse } from 'next/server';
import { ProfileCompletionService } from '@/lib/profile/completion-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { profile_id } = body;

    // Validate required fields
    if (!profile_id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          message: 'profile_id is required',
        },
        { status: 400 }
      );
    }

    const completionService = new ProfileCompletionService();
    const result = await completionService.completeProfile(profile_id);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error completing quiz:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to complete quiz',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
