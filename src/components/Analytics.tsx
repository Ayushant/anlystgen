import { FileText, Database, Boxes, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ProcessedDocument } from '@/hooks/useDocuments';

interface AnalyticsProps {
  documents: ProcessedDocument[];
}

export function Analytics({ documents }: AnalyticsProps) {
  const totalChunks = documents.reduce((sum, doc) => sum + doc.chunks.length, 0);
  const totalPages = documents.reduce((sum, doc) => sum + doc.pageCount, 0);
  const readyDocs = documents.filter(doc => doc.status === 'ready').length;
  const totalEmbeddings = documents.reduce(
    (sum, doc) => sum + doc.chunks.filter(c => c.embedding).length,
    0
  );

  const stats = [
    {
      icon: FileText,
      label: 'Documents',
      value: documents.length,
      description: `${readyDocs} ready`,
      color: 'text-blue-400',
    },
    {
      icon: Boxes,
      label: 'Text Chunks',
      value: totalChunks,
      description: `From ${totalPages} pages`,
      color: 'text-purple-400',
    },
    {
      icon: Database,
      label: 'Embeddings',
      value: totalEmbeddings,
      description: 'Vector embeddings',
      color: 'text-green-400',
    },
    {
      icon: Zap,
      label: 'Status',
      value: readyDocs === documents.length ? '100%' : `${Math.round((readyDocs / documents.length) * 100)}%`,
      description: 'Processing complete',
      color: 'text-yellow-400',
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold mb-2 gradient-text">Analytics Dashboard</h2>
        <p className="text-muted-foreground">
          Document processing and RAG pipeline metrics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} className="glass-card p-6 hover:border-primary/60 transition-all animate-fade-in">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-background/50">
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold mb-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="glass-card p-6">
        <h3 className="font-semibold mb-4">RAG Pipeline Overview</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-sm">Text Extraction (PDF.js)</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-blue-400" />
            <span className="text-sm">Chunking (800 chars with overlap)</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-purple-400" />
            <span className="text-sm">Embeddings (Gemini text-embedding-004)</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-yellow-400" />
            <span className="text-sm">Vector Search (Cosine Similarity)</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-pink-400" />
            <span className="text-sm">Generation (Gemini 1.5 Flash)</span>
          </div>
        </div>
      </Card>

      {documents.length > 0 && (
        <Card className="glass-card p-6">
          <h3 className="font-semibold mb-4">Document Details</h3>
          <div className="space-y-3">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between text-sm">
                <span className="truncate flex-1">{doc.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">
                    {doc.chunks.length} chunks
                  </span>
                  {doc.status === 'ready' && (
                    <span className="text-green-400">✓</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
