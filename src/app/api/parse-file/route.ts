// app/api/parse-file/route.ts
import { NextRequest } from 'next/server';
import { parseFile } from './parse-file';

export const maxDuration = 300; // 5 minutes timeout
export const dynamic = 'force-dynamic'; // No caching

// Handle POST requests
export async function POST(request: NextRequest) {
  return parseFile(request);
}

// Handle OPTIONS requests (for CORS)
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}