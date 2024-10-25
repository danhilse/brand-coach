// app/api/parse-file/parse-file.ts
import { NextRequest, NextResponse } from 'next/server';
import pdf from 'pdf-parse';

export async function parseFile(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Check file size (e.g., 10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      );
    }

    let text = '';
    const extension = file.name.toLowerCase().split('.').pop();

    // Handle different file types based on extension
    switch (extension) {
      case 'txt': {
        text = await file.text();
        break;
      }

      case 'pdf': {
        try {
          const arrayBuffer = await file.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const data = await pdf(buffer);
          text = data.text;
          
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

    // Basic text validation and cleaning
    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Failed to extract text from file' },
        { status: 400 }
      );
    }

    // Clean up the text
    text = text
      .trim()
      .replace(/\n{3,}/g, '\n\n')
      .replace(/\s{2,}/g, ' ')
      .replace(/[^\S\n]+/g, ' ');

    // Check if there's actual content
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