// POST /api/quiz/response
// Saves a quiz response and returns the next question

import { NextRequest, NextResponse } from 'next/server';
import { QuizService } from '@/lib/quiz/service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { profile_id, question_id, response_value, time_spent_seconds } = body;

    // Validate required fields
    if (!profile_id || !question_id || response_value === undefined) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          message: 'profile_id, question_id, and response_value are required',
        },
        { status: 400 }
      );
    }

    const quizService = new QuizService();
    const result = await quizService.saveResponse({
      profile_id,
      question_id,
      response_value,
      time_spent_seconds,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error saving quiz response:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to save quiz response',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
