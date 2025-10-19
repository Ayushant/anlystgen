/**
 * RAG (Retrieval-Augmented Generation) Pipeline
 * Handles document chunking, embedding, and similarity search
 */

import { generateEmbedding, generateChatResponse, GeminiMessage } from './gemini';

export interface TextChunk {
  id: string;
  text: string;
  embedding?: number[];
  documentId: string;
  documentName: string;
  chunkIndex: number;
}

export interface SearchResult {
  chunk: TextChunk;
  similarity: number;
}

export interface RAGResponse {
  answer: string;
  sources: SearchResult[];
}

/**
 * Split text into overlapping chunks for better context retention
 */
export function chunkText(
  text: string,
  documentId: string,
  documentName: string,
  chunkSize = 800,
  overlap = 200
): TextChunk[] {
  const chunks: TextChunk[] = [];
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  let currentChunk = '';
  let chunkIndex = 0;
  
  for (const sentence of sentences) {
    const trimmedSentence = sentence.trim();
    if (currentChunk.length + trimmedSentence.length > chunkSize && currentChunk.length > 0) {
      chunks.push({
        id: `${documentId}-chunk-${chunkIndex}`,
        text: currentChunk.trim(),
        documentId,
        documentName,
        chunkIndex,
      });
      
      // Keep overlap for context continuity
      const words = currentChunk.split(' ');
      const overlapWords = words.slice(-Math.floor(overlap / 5));
      currentChunk = overlapWords.join(' ') + ' ' + trimmedSentence;
      chunkIndex++;
    } else {
      currentChunk += ' ' + trimmedSentence;
    }
  }
  
  // Add final chunk
  if (currentChunk.trim().length > 0) {
    chunks.push({
      id: `${documentId}-chunk-${chunkIndex}`,
      text: currentChunk.trim(),
      documentId,
      documentName,
      chunkIndex,
    });
  }
  
  return chunks;
}

/**
 * Calculate cosine similarity between two vectors
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) {
    throw new Error('Vectors must have same dimensions');
  }
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  
  const magnitude = Math.sqrt(normA) * Math.sqrt(normB);
  return magnitude === 0 ? 0 : dotProduct / magnitude;
}

/**
 * Find top K most similar chunks to query
 */
export function findTopKSimilar(
  queryEmbedding: number[],
  chunks: TextChunk[],
  k = 3
): SearchResult[] {
  const results: SearchResult[] = [];
  
  for (const chunk of chunks) {
    if (!chunk.embedding) continue;
    
    const similarity = cosineSimilarity(queryEmbedding, chunk.embedding);
    results.push({ chunk, similarity });
  }
  
  // Sort by similarity (descending) and take top K
  return results
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, k);
}

/**
 * Generate embeddings for all chunks
 */
export async function embedChunks(
  chunks: TextChunk[],
  apiKey: string,
  onProgress?: (current: number, total: number) => void
): Promise<TextChunk[]> {
  const embeddedChunks: TextChunk[] = [];
  
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    try {
      const embedding = await generateEmbedding(chunk.text, apiKey);
      embeddedChunks.push({ ...chunk, embedding });
      
      if (onProgress) {
        onProgress(i + 1, chunks.length);
      }
      
      // Rate limiting: small delay between requests
      if (i < chunks.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    } catch (error) {
      console.error(`Error embedding chunk ${chunk.id}:`, error);
      // Continue with next chunk
    }
  }
  
  return embeddedChunks;
}

/**
 * Perform RAG query: retrieve relevant chunks and generate answer
 */
export async function ragQuery(
  query: string,
  chunks: TextChunk[],
  apiKey: string,
  chatHistory: GeminiMessage[] = []
): Promise<RAGResponse> {
  // 1. Generate embedding for query
  const queryEmbedding = await generateEmbedding(query, apiKey);
  
  // 2. Find most relevant chunks
  const topResults = findTopKSimilar(queryEmbedding, chunks, 3);
  
  // 3. Build context from retrieved chunks
  const context = topResults
    .map((result, idx) => 
      `[Source ${idx + 1}: ${result.chunk.documentName}]\n${result.chunk.text}\n`
    )
    .join('\n---\n\n');
  
  // 4. Create prompt with context
  const systemPrompt = `You are an AI assistant analyzing documents. Answer questions based on the provided context.

Context from documents:
${context}

Instructions:
- Answer based ONLY on the context provided
- If the answer is not in the context, say "I cannot find this information in the uploaded documents"
- Cite source documents when relevant
- Be concise and accurate`;

  // 5. Generate response
  const messages: GeminiMessage[] = [
    ...chatHistory,
    {
      role: 'user',
      parts: [{ text: `${systemPrompt}\n\nQuestion: ${query}` }],
    },
  ];
  
  const answer = await generateChatResponse(messages, apiKey);
  
  return {
    answer,
    sources: topResults,
  };
}

/**
 * Extract key entities from text (simple NER)
 */
export function extractEntities(text: string): {
  dates: string[];
  numbers: string[];
  emails: string[];
} {
  const dateRegex = /\b\d{1,2}[-/]\d{1,2}[-/]\d{2,4}\b|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{1,2},? \d{4}\b/gi;
  const numberRegex = /\b\d+(?:,\d{3})*(?:\.\d+)?(?:%|\$)?\b/g;
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  
  return {
    dates: text.match(dateRegex) || [],
    numbers: text.match(numberRegex) || [],
    emails: text.match(emailRegex) || [],
  };
}
