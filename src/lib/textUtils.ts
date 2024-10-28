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
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/\t/g, '    ')
      .replace(/[^\S\n]+/g, ' ')
      .replace(/^ +/gm, '')
      .replace(/ +$/gm, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
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