import { useCallback } from 'react';
import { Upload, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { isPDF } from '@/lib/pdfProcessor';
import { toast } from '@/hooks/use-toast';

interface DocumentUploadProps {
  onUpload: (file: File) => void;
  isProcessing: boolean;
}

export function DocumentUpload({ onUpload, isProcessing }: DocumentUploadProps) {
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const pdfFiles = files.filter(isPDF);

    if (pdfFiles.length === 0) {
      toast({
        title: "Invalid Files",
        description: "Please upload PDF files only",
        variant: "destructive",
      });
      return;
    }

    pdfFiles.forEach(onUpload);
  }, [onUpload]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const pdfFiles = files.filter(isPDF);

    if (pdfFiles.length === 0) {
      toast({
        title: "Invalid Files",
        description: "Please upload PDF files only",
        variant: "destructive",
      });
      return;
    }

    pdfFiles.forEach(onUpload);
    e.target.value = ''; // Reset input
  }, [onUpload]);

  return (
    <Card
      className="glass-card p-12 border-dashed border-2 border-primary/30 hover:border-primary/60 transition-all cursor-pointer group"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onClick={() => document.getElementById('file-upload')?.click()}
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="p-6 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-all">
          <Upload className="w-12 h-12 text-primary animate-pulse-glow" />
        </div>
        
        <div>
          <h3 className="text-xl font-semibold mb-2">Upload PDF Documents</h3>
          <p className="text-muted-foreground">
            Drag and drop your PDFs here, or click to browse
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FileText className="w-4 h-4" />
          <span>Supports multiple PDFs up to 10MB each</span>
        </div>

        <input
          id="file-upload"
          type="file"
          multiple
          accept=".pdf,application/pdf"
          className="hidden"
          onChange={handleFileInput}
          disabled={isProcessing}
        />

        <Button
          variant="default"
          size="lg"
          className="mt-4 bg-gradient-purple hover:opacity-90"
          disabled={isProcessing}
          onClick={(e) => e.stopPropagation()}
        >
          <Upload className="w-4 h-4 mr-2" />
          {isProcessing ? 'Processing...' : 'Select Files'}
        </Button>
      </div>
    </Card>
  );
}
