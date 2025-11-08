// POST /api/resources/search
// Search for resources from Notion

import { NextRequest, NextResponse } from 'next/server';
import { searchResources } from '@/lib/notion/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { civic_sectors, innovation_domains, archetype, query, limit } = body;

    const resources = await searchResources({
      civicSectors: civic_sectors,
      innovationDomains: innovation_domains,
      archetypes: archetype ? [archetype] : undefined,
      query,
      limit: limit || 10,
    });

    return NextResponse.json({
      success: true,
      data: {
        resources,
        total: resources.length,
      },
    });
  } catch (error) {
    console.error('Error searching resources:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to search resources',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
