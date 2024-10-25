// lib/services/pdfService.ts
import * as pdfjsLib from 'pdfjs-dist';

// Set worker path for pdf.js
if (typeof window === 'undefined') {
  // Server-side
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}

export async function extractPdfText(buffer: ArrayBuffer): Promise<string> {
  try {
    // Load the PDF document
    const loadingTask = pdfjsLib.getDocument({ data: buffer });
    const doc = await loadingTask.promise;
    
    let fullText = '';

    // Extract text from each page
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items
        .map((item: any) => 'str' in item ? item.str : '')
        .join(' ');
      fullText += pageText + '\n';
    }

    return fullText.trim();
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error('Failed to extract text from PDF');
  }
}