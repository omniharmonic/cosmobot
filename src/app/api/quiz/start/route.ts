// POST /api/quiz/start
// Starts a new quiz session

import { NextResponse } from 'next/server';
import { QuizService } from '@/lib/quiz/service';

export async function POST() {
  try {
    const quizService = new QuizService();
    const result = await quizService.startQuiz();

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error starting quiz:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to start quiz',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
