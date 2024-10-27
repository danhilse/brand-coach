// route.ts
import { NextResponse } from 'next/server';
// import { generateResponse } from '@/lib/api-clients';

export async function POST(request: Request) {
  try {
    const { content, provider } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: 'Missing content parameter' },
        { status: 400 }
      );
    }

    try {
      const response = await console.log(content, provider);
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