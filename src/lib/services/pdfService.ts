// lib/services/pdfService.ts
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';

// Configure the worker
if (typeof window === 'undefined') {
  // Server-side
  GlobalWorkerOptions.workerSrc = 'pdf.worker.js';
}

export async function extractPdfText(buffer: ArrayBuffer): Promise<string> {
  try {
    // Disable worker to run in Node.js environment
    const loadingTask = getDocument({
      data: buffer,
      useWorkerFetch: false,
      isEvalSupported: false,
      useSystemFonts: true,
      disableFontFace: true, // Disable font loading
      standardFontDataUrl: 'pdf.worker.js', // Dummy URL for fonts
    });

    const doc = await loadingTask.promise;
    let fullText = '';

    // Get text content from all pages
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .filter((item: any) => item.str)
        .map((item: any) => item.str)
        .join(' ');
      
      fullText += pageText + '\n';
    }

    return fullText.trim();
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error('Failed to extract text from PDF');
  }
}