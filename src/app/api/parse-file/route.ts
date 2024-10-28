import { NextRequest, NextResponse } from 'next/server';

export class UnsupportedFileTypeError extends Error {
  constructor(fileType: string) {
    super(`Unsupported file type: ${fileType}`);
    this.name = 'UnsupportedFileTypeError';
  }
}

export class FileSizeLimitError extends Error {
  constructor() {
    super('File size exceeds 10MB limit');
    this.name = 'FileSizeLimitError';
  }
}

export function cleanText(text: string): string {
  return text
    .replace(/\r\n/g, '\n')  // Normalize line endings (CRLF -> LF)
    .replace(/\r/g, '\n')    // Convert any remaining CR to LF
    .replace(/\t/g, '    ')  // Convert tabs to spaces
    .replace(/[^\S\n]+/g, ' ')  // Replace multiple spaces with single space (preserve line breaks)
    .replace(/^ +/gm, '')    // Remove leading spaces from each line
    .replace(/ +$/gm, '')    // Remove trailing spaces from each line
    .replace(/\n{3,}/g, '\n\n')  // Replace three or more line breaks with two
    .trim();  // Remove leading/trailing whitespace from the entire text
}

export async function validateFile(file: File) {
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    throw new FileSizeLimitError();
  }

  const extension = file.name.toLowerCase().split('.').pop();
  const supportedTypes = ['txt'];
  
  if (!extension || !supportedTypes.includes(extension)) {
    throw new UnsupportedFileTypeError(extension || 'unknown');
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    await validateFile(file);
    
    // Read the file as text with proper encoding
    const decoder = new TextDecoder('utf-8');
    const arrayBuffer = await file.arrayBuffer();
    const rawText = decoder.decode(arrayBuffer);
    
    const cleanedText = cleanText(rawText);

    if (!cleanedText.length) {
      return NextResponse.json(
        { error: 'Extracted text is empty' },
        { status: 400 }
      );
    }

    return NextResponse.json({ text: cleanedText });

  } catch (error) {
    console.error('File parsing error:', error);
    
    if (error instanceof FileSizeLimitError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    if (error instanceof UnsupportedFileTypeError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { 
        error: 'Failed to process file',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}