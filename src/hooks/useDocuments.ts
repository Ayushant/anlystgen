import { useState, useCallback } from 'react';
import { PDFDocument, extractTextFromPDF } from '@/lib/pdfProcessor';
import { TextChunk, chunkText, embedChunks } from '@/lib/rag';
import { toast } from '@/hooks/use-toast';
import { scrapeWebPage, isValidUrl } from '@/lib/webScraper';

export interface ProcessedDocument extends PDFDocument {
  chunks: TextChunk[];
  status: 'processing' | 'ready' | 'error';
  progress?: number;
  type?: 'pdf' | 'url';
}

export function useDocuments() {
  const [documents, setDocuments] = useState<ProcessedDocument[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const processDocument = useCallback(async (file: File) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      toast({
        title: "API Key Missing",
        description: "Please set VITE_GEMINI_API_KEY in your environment",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Extract PDF text
      const pdfDoc = await extractTextFromPDF(file, (current, total) => {
        const progress = (current / total) * 30; // 30% for extraction
        setDocuments(prev => 
          prev.map(doc => 
            doc.id === pdfDoc.id 
              ? { ...doc, progress } 
              : doc
          )
        );
      });

      // Add document with processing status
      const newDoc: ProcessedDocument = {
        ...pdfDoc,
        chunks: [],
        status: 'processing',
        progress: 30,
      };

      setDocuments(prev => [...prev, newDoc]);

      // Chunk text
      const chunks = chunkText(pdfDoc.text, pdfDoc.id, pdfDoc.name);
      
      setDocuments(prev =>
        prev.map(doc =>
          doc.id === pdfDoc.id
            ? { ...doc, chunks, progress: 40 }
            : doc
        )
      );

      // Generate embeddings
      const embeddedChunks = await embedChunks(chunks, apiKey, (current, total) => {
        const progress = 40 + (current / total) * 60; // 60% for embeddings
        setDocuments(prev =>
          prev.map(doc =>
            doc.id === pdfDoc.id
              ? { ...doc, progress }
              : doc
          )
        );
      });

      // Update document with embedded chunks
      setDocuments(prev =>
        prev.map(doc =>
          doc.id === pdfDoc.id
            ? { ...doc, chunks: embeddedChunks, status: 'ready', progress: 100 }
            : doc
        )
      );

      toast({
        title: "Document Processed",
        description: `${pdfDoc.name} is ready for analysis`,
      });
    } catch (error) {
      console.error('Error processing document:', error);
      toast({
        title: "Processing Failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });

      setDocuments(prev =>
        prev.map(doc =>
          doc.status === 'processing'
            ? { ...doc, status: 'error' }
            : doc
        )
      );
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const processUrl = useCallback(async (url: string) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      toast({
        title: "API Key Missing",
        description: "Please set VITE_GEMINI_API_KEY in your environment",
        variant: "destructive",
      });
      return;
    }

    if (!isValidUrl(url)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL (e.g., https://example.com)",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Scrape webpage
      const scraped = await scrapeWebPage(url);
      
      if (scraped.error || !scraped.content) {
        throw new Error(scraped.error || 'No content extracted from webpage');
      }

      const webDoc: PDFDocument = {
        id: `url-${Date.now()}`,
        name: scraped.title,
        text: scraped.content,
        pageCount: 1,
        url: scraped.url,
      };

      // Add document with processing status
      const newDoc: ProcessedDocument = {
        ...webDoc,
        chunks: [],
        status: 'processing',
        progress: 30,
        type: 'url',
      };

      setDocuments(prev => [...prev, newDoc]);

      // Chunk text
      const chunks = chunkText(webDoc.text, webDoc.id, webDoc.name);
      
      setDocuments(prev =>
        prev.map(doc =>
          doc.id === webDoc.id
            ? { ...doc, chunks, progress: 40 }
            : doc
        )
      );

      // Generate embeddings
      const embeddedChunks = await embedChunks(chunks, apiKey, (current, total) => {
        const progress = 40 + (current / total) * 60;
        setDocuments(prev =>
          prev.map(doc =>
            doc.id === webDoc.id
              ? { ...doc, progress }
              : doc
          )
        );
      });

      // Update document with embedded chunks
      setDocuments(prev =>
        prev.map(doc =>
          doc.id === webDoc.id
            ? { ...doc, chunks: embeddedChunks, status: 'ready', progress: 100 }
            : doc
        )
      );

      toast({
        title: "Webpage Processed",
        description: `${scraped.title} is ready for analysis`,
      });
    } catch (error) {
      console.error('Error processing URL:', error);
      toast({
        title: "Processing Failed",
        description: error instanceof Error ? error.message : "Failed to fetch webpage",
        variant: "destructive",
      });

      setDocuments(prev =>
        prev.map(doc =>
          doc.status === 'processing' && doc.type === 'url'
            ? { ...doc, status: 'error' }
            : doc
        )
      );
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const removeDocument = useCallback((id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  }, []);

  const getAllChunks = useCallback(() => {
    return documents.flatMap(doc => doc.chunks);
  }, [documents]);

  return {
    documents,
    isProcessing,
    processDocument,
    processUrl,
    removeDocument,
    getAllChunks,
  };
}
