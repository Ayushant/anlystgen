# TH Intelligence Platform with RAG

A production-ready Document Intelligence Platform with Retrieval-Augmented Generation (RAG) capabilities, powered by Google Gemini API.

![Analyst Intelligence Layer](https://img.shields.io/badge/AI-Gemini%201.5%20Flash-purple)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![React](https://img.shields.io/badge/React-18-cyan)

## 🚀 Features

### Core Capabilities
- **Multi-PDF Upload**: Drag-and-drop interface for multiple PDF documents
- **Intelligent Text Extraction**: PDF.js-powered text extraction with metadata
- **RAG Pipeline**: Complete implementation with chunking, embedding, and retrieval
- **Contextual Chat**: Natural language queries with source attribution
- **Real-time Processing**: Live progress tracking for document processing
- **Analytics Dashboard**: Comprehensive metrics on documents and embeddings

### Technical Highlights
- **Vector Search**: Cosine similarity-based retrieval with top-K results
- **Chunking Strategy**: 800-character chunks with 200-character overlap
- **Embeddings**: Google Gemini text-embedding-004 model
- **Generation**: Gemini 1.5 Flash for contextual responses
- **Source Attribution**: Confidence scores and document citations

## 🎨 Design

Modern dark theme with:
- Glassmorphic UI elements with backdrop blur
- Purple gradient accents (#a855f7)
- Smooth animations and transitions
- Fully responsive mobile-first design

## 📋 Prerequisites

- Node.js 18+ and npm
- Google Gemini API key (get one at [ai.google.dev](https://ai.google.dev))

## ⚙️ Setup

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd <YOUR_PROJECT_NAME>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API Key**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:8080
   ```

## 🏗️ Architecture

### RAG Pipeline Flow

```
1. PDF Upload → Extract Text (PDF.js)
2. Text → Chunk into segments (800 chars + 200 overlap)
3. Chunks → Generate Embeddings (Gemini text-embedding-004)
4. Store in Vector DB (in-memory array)
5. User Query → Generate Query Embedding
6. Similarity Search → Retrieve Top 3 Chunks (Cosine Similarity)
7. Context + Query → Gemini 1.5 Flash → Response
8. Display with source attribution
```

### Project Structure

```
src/
├── components/
│   ├── Analytics.tsx          # Analytics dashboard
│   ├── ChatInterface.tsx      # Chat UI with streaming
│   ├── DocumentCard.tsx       # Document display cards
│   └── DocumentUpload.tsx     # Drag-and-drop upload
├── hooks/
│   └── useDocuments.ts        # Document state management
├── lib/
│   ├── gemini.ts             # Gemini API client
│   ├── rag.ts                # RAG pipeline functions
│   └── pdfProcessor.ts       # PDF extraction utilities
└── pages/
    └── Index.tsx             # Main application page
```

## 🔧 Key Functions

### RAG Functions (`lib/rag.ts`)

```typescript
// Chunk text with overlap
chunkText(text: string, documentId: string, documentName: string)

// Generate embeddings
embedChunks(chunks: TextChunk[], apiKey: string)

// Similarity search
findTopKSimilar(queryEmbedding: number[], chunks: TextChunk[], k = 3)

// Execute RAG query
ragQuery(query: string, chunks: TextChunk[], apiKey: string)
```

### Gemini API (`lib/gemini.ts`)

```typescript
// Generate embeddings
generateEmbedding(text: string, apiKey: string)

// Chat completion
generateChatResponse(messages: GeminiMessage[], apiKey: string)

// Streaming chat (for future enhancement)
streamChatResponse(messages: GeminiMessage[], apiKey: string)
```

## 💡 Usage

1. **Upload Documents**: Drag and drop PDF files or click to browse
2. **Wait for Processing**: Watch progress as documents are chunked and embedded
3. **Start Chatting**: Ask questions in natural language
4. **View Sources**: See which documents and passages informed each answer
5. **Check Analytics**: Monitor document metrics and pipeline status

## 🎯 Example Queries

- "Summarize the main points across all documents"
- "What are the key findings mentioned?"
- "List all important dates and numbers"
- "Compare the conclusions of different documents"
- "What recommendations are made?"

## 🔒 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_GEMINI_API_KEY` | Google Gemini API key | Yes |

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **AI/ML**: Google Gemini API (1.5 Flash, text-embedding-004)
- **PDF Processing**: PDF.js
- **Icons**: Lucide React

## 📊 Models Used

- **Chat**: `gemini-1.5-flash` (fast, cost-effective)
- **Embeddings**: `text-embedding-004` (768 dimensions)

## 🚦 Rate Limits

Be aware of Gemini API rate limits:
- Embeddings: Rate limited by Google
- Chat: Rate limited by Google

The application includes automatic delays between embedding requests.

## 🎨 Customization

### Adjust Chunk Size
```typescript
// In lib/rag.ts
chunkText(text, docId, docName, 1000, 250) // Larger chunks
```

### Change Retrieval Count
```typescript
// In lib/rag.ts
findTopKSimilar(queryEmbedding, chunks, 5) // Retrieve top 5
```

### Modify Theme
```css
/* In src/index.css */
--primary: 283 89% 60%; /* Change purple to another color */
```

## 🐛 Troubleshooting

**API Key Issues**
- Ensure `.env` file exists in root directory
- Verify API key is valid at [ai.google.dev](https://ai.google.dev)
- Restart development server after adding key

**PDF Upload Fails**
- Check file is valid PDF
- Ensure file size is reasonable (<10MB recommended)
- Try re-uploading or different PDF

**No Results in Chat**
- Ensure documents are fully processed (status: "Ready")
- Check that embeddings were generated
- View Analytics tab to verify chunks exist

## 📈 Performance

- **Processing**: ~5-10 seconds per PDF (depends on size)
- **Embedding**: ~100ms per chunk
- **Query**: ~1-2 seconds (including retrieval + generation)

## 🌐 Deployment

Build for production:
```bash
npm run build
```




#
- [Gemini API Docs](https://ai.google.dev/docs)
- [GitHub Issues](YOUR_REPO_URL/issues)

---

