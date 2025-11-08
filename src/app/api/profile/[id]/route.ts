// GET /api/profile/[id]
// Get a profile by ID

import { NextRequest, NextResponse } from 'next/server';
import { ProfileRepository } from '@/lib/repositories/profile-repository';
import { InterestsRepository } from '@/lib/repositories/interests-repository';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const profileRepo = new ProfileRepository();
    const interestsRepo = new InterestsRepository();

    const profile = await profileRepo.getById(id);

    if (!profile) {
      return NextResponse.json(
        {
          success: false,
          error: 'Profile not found',
        },
        { status: 404 }
      );
    }

    const interests = await interestsRepo.getByProfileId(id);

    return NextResponse.json({
      success: true,
      data: {
        profile,
        interests,
      },
    });
  } catch (error) {
    console.error('Error fetching profile:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch profile',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
