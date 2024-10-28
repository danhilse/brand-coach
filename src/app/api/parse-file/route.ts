import { NextRequest, NextResponse } from 'next/server';
import { cleanText, validateFile, FileSizeLimitError, UnsupportedFileTypeError } from '@/lib/textUtils';

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