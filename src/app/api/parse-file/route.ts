// app/api/parse-file/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { extractPdfText } from '@/lib/services/pdfService';

export const config = {
  api: {
    bodyParser: false,
    responseLimit: '10mb',
  },
};

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

    // Check file size
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      );
    }

    let text = '';
    const extension = file.name.toLowerCase().split('.').pop();

    switch (extension) {
      case 'txt': {
        text = await file.text();
        break;
      }

      case 'pdf': {
        try {
          const arrayBuffer = await file.arrayBuffer();
          text = await extractPdfText(arrayBuffer);
          
          if (!text) {
            throw new Error('No text content found in PDF');
          }
        } catch (pdfError) {
          console.error('PDF parsing error:', pdfError);
          return NextResponse.json(
            { error: 'Failed to parse PDF file' },
            { status: 400 }
          );
        }
        break;
      }

      case 'doc':
      case 'docx': {
        try {
          const mammoth = (await import('mammoth')).default;
          const arrayBuffer = await file.arrayBuffer();
          const result = await mammoth.extractRawText({ arrayBuffer });
          text = result.value;
          
          if (result.messages.length > 0) {
            console.warn('Mammoth warnings:', result.messages);
          }
        } catch (docError) {
          console.error('Word document parsing error:', docError);
          return NextResponse.json(
            { error: 'Failed to parse Word document' },
            { status: 400 }
          );
        }
        break;
      }

      default:
        return NextResponse.json(
          { error: 'Unsupported file type' },
          { status: 400 }
        );
    }

    // Text validation and cleaning
    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Failed to extract text from file' },
        { status: 400 }
      );
    }

    text = text
      .trim()
      .replace(/\n{3,}/g, '\n\n')  // Replace multiple newlines with double newline
      .replace(/\s{2,}/g, ' ')     // Replace multiple spaces with single space
      .replace(/[^\S\n]+/g, ' ');  // Replace whitespace (except newlines) with single space

    if (!text.length) {
      return NextResponse.json(
        { error: 'Extracted text is empty' },
        { status: 400 }
      );
    }

    return NextResponse.json({ text });

  } catch (error) {
    console.error('File parsing error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process file',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}