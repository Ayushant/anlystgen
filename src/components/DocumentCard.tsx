import { FileText, Trash2, CheckCircle, Loader2, AlertCircle, Globe, ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { formatFileSize } from '@/lib/pdfProcessor';
import { ProcessedDocument } from '@/hooks/useDocuments';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface DocumentCardProps {
  document: ProcessedDocument;
  onRemove: (id: string) => void;
}

export function DocumentCard({ document, onRemove }: DocumentCardProps) {
  const statusConfig = {
    processing: {
      icon: Loader2,
      color: 'text-yellow-400',
      label: 'Processing',
      iconClass: 'animate-spin',
    },
    ready: {
      icon: CheckCircle,
      color: 'text-green-400',
      label: 'Ready',
      iconClass: '',
    },
    error: {
      icon: AlertCircle,
      color: 'text-red-400',
      label: 'Error',
      iconClass: '',
    },
  };

  const config = statusConfig[document.status];
  const StatusIcon = config.icon;
  const isUrl = document.type === 'url';

  return (
    <TooltipProvider>
      <Card className="glass-card p-4 hover:border-primary/60 transition-all group animate-fade-in">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${isUrl ? 'bg-blue-500/10' : 'bg-primary/10'}`}>
            {isUrl ? (
              <Globe className="w-5 h-5 text-blue-500" />
            ) : (
              <FileText className="w-5 h-5 text-primary" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <h4 className="font-medium truncate cursor-help">{document.name}</h4>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-sm">
                  <p className="text-xs">{document.name}</p>
                </TooltipContent>
              </Tooltip>
            </div>

            {/* Show URL for web documents */}
            {isUrl && document.url && (
              <a 
                href={document.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-600 hover:underline mb-2 group/link"
              >
                <span className="truncate max-w-[200px]">{document.url}</span>
                <ExternalLink className="w-3 h-3 flex-shrink-0 opacity-0 group-hover/link:opacity-100 transition-opacity" />
              </a>
            )}
            
            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
              {isUrl ? (
                <>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 font-medium">
                    <Globe className="w-3 h-3" />
                    Webpage
                  </span>
                  <span>•</span>
                </>
              ) : (
                <>
                  <span>{document.pageCount} pages</span>
                  <span>•</span>
                  <span>{formatFileSize(document.fileSize || 0)}</span>
                  <span>•</span>
                </>
              )}
              <span className="font-medium">{document.chunks.length} chunks</span>
            </div>

            <div className="flex items-center gap-2">
              <StatusIcon className={`w-4 h-4 ${config.color} ${config.iconClass}`} />
              <span className={`text-xs font-medium ${config.color}`}>
                {config.label}
              </span>
            </div>

            {document.status === 'processing' && document.progress !== undefined && (
              <Progress value={document.progress} className="mt-2 h-1" />
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(document.id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/20 hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </TooltipProvider>
  );
}
