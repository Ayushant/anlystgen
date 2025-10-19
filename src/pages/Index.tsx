import { useState } from 'react';
import { Brain, FileSearch, Sparkles, Database } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DocumentUpload } from '@/components/DocumentUpload';
import { UrlInput } from '@/components/UrlInput';
import { DocumentCard } from '@/components/DocumentCard';
import { ChatInterface } from '@/components/ChatInterface';
import { Analytics } from '@/components/Analytics';
import { useDocuments } from '@/hooks/useDocuments';

const Index = () => {
  const { documents, isProcessing, processDocument, processUrl, removeDocument, getAllChunks } = useDocuments();
  const [activeTab, setActiveTab] = useState('upload');

  const hasDocuments = documents.length > 0;
  const hasReadyDocuments = documents.some(doc => doc.status === 'ready');

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-purple">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">Analyst Intelligence Layer</h1>
              <p className="text-sm text-muted-foreground">
                TH Intelligence Platform with RAG
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-140px)]">
          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-4 overflow-y-auto">
            <div className="glass-card p-4 rounded-lg">
              <h2 className="font-semibold mb-3 flex items-center gap-2">
                <FileSearch className="w-4 h-4 text-primary" />
                Documents ({documents.length})
              </h2>
              
              {documents.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No documents uploaded yet
                </p>
              ) : (
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <DocumentCard
                      key={doc.id}
                      document={doc}
                      onRemove={removeDocument}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Tech Stack */}
            <div className="glass-card p-4 rounded-lg">
              <h3 className="text-xs font-semibold mb-3 text-muted-foreground">POWERED BY</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Sparkles className="w-3 h-3 text-purple-400" />
                  <span>Google Gemini 1.5 Flash</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Database className="w-3 h-3 text-blue-400" />
                  <span>RAG Pipeline</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Brain className="w-3 h-3 text-green-400" />
                  <span>Vector Search</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <TabsList className="glass-card w-full mb-4">
                <TabsTrigger value="upload" className="flex-1">
                  <FileSearch className="w-4 h-4 mr-2" />
                  Upload
                </TabsTrigger>
                <TabsTrigger value="chat" className="flex-1" disabled={!hasReadyDocuments}>
                  <Brain className="w-4 h-4 mr-2" />
                  Chat
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex-1" disabled={!hasDocuments}>
                  <Database className="w-4 h-4 mr-2" />
                  Analytics
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-hidden">
                <TabsContent value="upload" className="h-full m-0 animate-fade-in">
                  <div className="h-full overflow-y-auto p-8">
                    <div className="w-full max-w-2xl mx-auto space-y-6">
                      <DocumentUpload
                        onUpload={processDocument}
                        isProcessing={isProcessing}
                      />
                      
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-px bg-border"></div>
                        <span className="text-sm text-muted-foreground">OR</span>
                        <div className="flex-1 h-px bg-border"></div>
                      </div>

                      <UrlInput
                        onUrlSubmit={processUrl}
                        isProcessing={isProcessing}
                      />
                      
                      {hasDocuments && (
                        <div className="mt-6 text-center">
                          <p className="text-sm text-muted-foreground mb-3">
                            Ready to analyze your documents?
                          </p>
                          <button
                            onClick={() => setActiveTab('chat')}
                            disabled={!hasReadyDocuments}
                            className="text-primary hover:text-primary/80 text-sm font-medium underline underline-offset-4 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Go to Chat →
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="chat" className="h-full m-0">
                  <div className="glass-card rounded-lg h-full overflow-hidden">
                    <ChatInterface
                      chunks={getAllChunks()}
                      disabled={!hasReadyDocuments}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="analytics" className="h-full m-0 overflow-y-auto">
                  <div className="glass-card rounded-lg h-full">
                    <Analytics documents={documents} />
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </main>
        </div>
      </div>

      {/** Footer removed as requested **/}
    </div>
  );
};

export default Index;
