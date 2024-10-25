// app/api/test-key/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  
  return NextResponse.json({ 
    hasKey: !!apiKey,
    keyLength: apiKey?.length || 0,
    startsWithCorrectPrefix: apiKey?.startsWith('sk-ant-') || false,
    // Only show first 10 characters for security
    keyPrefix: apiKey?.substring(0, 10) + '...',
    containsQuotes: apiKey?.includes('"') || apiKey?.includes("'") || false,
    containsSpaces: apiKey?.includes(' ') || false
  });
}