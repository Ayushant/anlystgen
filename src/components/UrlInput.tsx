import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Globe, Loader2, Link2, CheckCircle2, AlertCircle, Crown, Zap } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SubscriptionDialog } from '@/components/SubscriptionDialog';

interface UrlInputProps {
  onUrlSubmit: (url: string) => void;
  isProcessing: boolean;
}

export function UrlInput({ onUrlSubmit, isProcessing }: UrlInputProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);

  const validateUrl = (urlString: string): boolean => {
    try {
      const urlObj = new URL(urlString);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUrl(value);
    setError('');
    
    // Real-time validation
    if (value.trim() && !validateUrl(value)) {
      setError('Please enter a valid URL (must start with http:// or https://)');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedUrl = url.trim();
    
    if (!trimmedUrl) {
      setError('Please enter a URL');
      return;
    }

    if (!validateUrl(trimmedUrl)) {
      setError('Invalid URL format. Example: https://example.com');
      return;
    }

    setIsValidating(true);
    onUrlSubmit(trimmedUrl);
    setUrl('');
    setError('');
    setTimeout(() => setIsValidating(false), 1000);
  };

  return (
    <Card className="border-2 border-dashed border-blue-500/30 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 hover:border-blue-500/50 transition-all duration-300">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/20">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-xl">Add Web Content</CardTitle>
            <CardDescription className="text-sm mt-1">
              Analyze any public webpage with AI-powered extraction
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="url-input" className="text-sm font-medium flex items-center gap-2">
              <Link2 className="w-4 h-4 text-blue-500" />
              Webpage URL
            </label>
            
            <div className="relative">
              <Input
                id="url-input"
                type="text"
                placeholder="https://example.com/article"
                value={url}
                onChange={handleUrlChange}
                disabled={isProcessing || isValidating}
                className={`pr-12 h-12 text-base transition-all ${
                  error 
                    ? 'border-red-500 focus-visible:ring-red-500' 
                    : url && validateUrl(url)
                    ? 'border-green-500 focus-visible:ring-green-500'
                    : 'border-blue-500/30 focus-visible:ring-blue-500'
                }`}
              />
              
              {/* Validation Icon */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {url && (
                  validateUrl(url) ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  )
                )}
              </div>
            </div>

            {error && (
              <Alert variant="destructive" className="py-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">{error}</AlertDescription>
              </Alert>
            )}
          </div>

          <Button 
            type="submit" 
            disabled={isProcessing || isValidating || !url.trim() || !!error}
            className="w-full h-11 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium shadow-lg shadow-blue-500/30 transition-all duration-300"
          >
            {isProcessing || isValidating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processing Webpage...
              </>
            ) : (
              <>
                <Globe className="w-5 h-5 mr-2" />
                Analyze Webpage
              </>
            )}
          </Button>
        </form>

        {/* Add More URLs Button */}
        <div className="pt-4 border-t border-border/50">
          <Button
            onClick={() => setShowSubscription(true)}
            variant="outline"
            className="w-full border-dashed border-purple-500/30 hover:border-purple-500/50 hover:bg-purple-500/5"
          >
            Add More URLs
          </Button>
        </div>
      </CardContent>

      <SubscriptionDialog 
        open={showSubscription} 
        onOpenChange={setShowSubscription} 
      />
    </Card>
  );
}
