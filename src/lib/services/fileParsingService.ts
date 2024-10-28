// lib/services/fileParsingService.ts
import { NextRequest } from 'next/server';

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

export async function parseTextFile(file: File): Promise<string> {
  return await file.text();
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

export function cleanText(text: string): string {
  return text
    .trim()
    .replace(/\n{3,}/g, '\n\n')  // Replace multiple newlines with double newline
    .replace(/\s{2,}/g, ' ')     // Replace multiple spaces with single space
    .replace(/[^\S\n]+/g, ' ');  // Replace whitespace (except newlines) with single space
}
