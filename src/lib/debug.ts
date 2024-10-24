// lib/debug.ts

export function logError(location: string, error: unknown) {
    console.error(`Error in ${location}:`, {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      details: error
    });
  }