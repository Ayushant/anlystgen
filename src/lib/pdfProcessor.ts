/**
 * PDF Processing Utilities
 * Extract text from PDF files using PDF.js
 */

import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker - using local worker from node_modules
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

export interface PDFDocument {
  id: string;
  name: string;
  text: string;
  pageCount: number;
  fileSize?: number;
  uploadedAt?: Date;
  url?: string;
}

/**
 * Extract text from a PDF file
 */
export async function extractTextFromPDF(
  file: File,
  onProgress?: (current: number, total: number) => void
): Promise<PDFDocument> {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  
  let fullText = '';
  const totalPages = pdf.numPages;
  
  // Extract text from each page
  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    
    // Combine text items
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(' ');
    
    fullText += pageText + '\n\n';
    
    if (onProgress) {
      onProgress(pageNum, totalPages);
    }
  }
  
  return {
    id: generateId(),
    name: file.name,
    text: fullText.trim(),
    pageCount: totalPages,
    fileSize: file.size,
    uploadedAt: new Date(),
  };
}

/**
 * Validate if file is a PDF
 */
export function isPDF(file: File): boolean {
  return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Generate unique ID
 */
function generateId(): string {
  return `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generate summary of document (first N characters)
 */
export function generatePreview(text: string, maxLength = 200): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}
