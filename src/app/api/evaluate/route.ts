// route.ts
import { NextResponse } from 'next/server';
import { generateResponse } from '@/lib/api-clients';

export async function POST(request: Request) {
  try {
    // Clone the request before reading it
    const clonedRequest = request.clone();
    
    // Read the body from the cloned request
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