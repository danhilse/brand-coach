// src/app/api/evaluate/route.ts
import { NextResponse } from 'next/server';
import { generateResponse } from '@/lib/api-clients';

export const maxDuration = 60; // Set to 60 seconds
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const clonedRequest = request.clone();
    const { content, provider } = await clonedRequest.json();

    if (!content) {
      return NextResponse.json(
        { error: 'Missing content parameter' },
        { status: 400 }
      );
    }

    try {
      const response = await generateResponse(content, provider);
      return NextResponse.json({ data: response });
    } catch (error: any) {
      console.error('API Error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: error.status || 500 }
      );
    }
  } catch (error: any) {
    console.error('Server Error:', error);
    return NextResponse.json(
      { error: 'Server error occurred' },
      { status: 500 }
    );
  }
}