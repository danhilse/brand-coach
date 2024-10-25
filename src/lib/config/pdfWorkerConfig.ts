// lib/config/pdfWorkerConfig.ts
import { GlobalWorkerOptions } from 'pdfjs-dist';

export function configurePdfWorker() {
  if (typeof window === 'undefined') {
    GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${GlobalWorkerOptions.workerSrc}/pdf.worker.min.js`;
  }
}