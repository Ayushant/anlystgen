import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Crown, 
  Zap, 
  Check, 
  Globe, 
  FileText, 
  Sparkles, 
  Mail, 
  Lock,
  CreditCard,
  Star
} from 'lucide-react';

interface SubscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SubscriptionDialog({ open, onOpenChange }: SubscriptionDialogProps) {
  const [activeTab, setActiveTab] = useState<'upgrade' | 'signin'>('upgrade');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock sign in - would integrate with auth provider
    console.log('Sign in:', { email, password });
  };

  const handleUpgrade = () => {
    // Mock upgrade - would integrate with payment provider
    console.log('Upgrade to premium');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl">Unlock Premium Features</DialogTitle>
              <DialogDescription className="text-base mt-1">
                Get unlimited URL processing and advanced AI capabilities
              </DialogDescription>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-muted rounded-lg p-1">
            <button
              onClick={() => setActiveTab('upgrade')}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all ${
                activeTab === 'upgrade'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Crown className="w-4 h-4 mr-2 inline" />
              Upgrade
            </button>
            <button
              onClick={() => setActiveTab('signin')}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all ${
                activeTab === 'signin'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Lock className="w-4 h-4 mr-2 inline" />
              Sign In
            </button>
          </div>
        </DialogHeader>

        {activeTab === 'upgrade' && (
          <div className="space-y-6 mt-6">
            <div className="max-w-md mx-auto">
              <Card className="border-2 border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-blue-500/5">
                <CardHeader className="text-center space-y-3">
                  <div className="mx-auto p-3 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 w-fit">
                    <Crown className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl">Upgrade to Premium</CardTitle>
                  <p className="text-muted-foreground">
                    Unlock unlimited URL processing and advanced features
                  </p>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-purple-500" />
                      <span>Unlimited URL processing</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Zap className="w-5 h-5 text-purple-500" />
                      <span>Priority AI responses</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-purple-500" />
                      <span>Advanced document analysis</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-5 h-5 text-purple-500" />
                      <span>Premium support</span>
                    </div>
                  </div>

                  <Button 
                    onClick={handleUpgrade}
                    className="w-full h-12 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium text-lg"
                  >
                    <Crown className="w-5 h-5 mr-2" />
                    Upgrade Now
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    Cancel anytime • 30-day money back guarantee
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'signin' && (
          <div className="space-y-6 mt-6">
            <div className="max-w-md mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Sign In to Your Account
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Access your premium features and subscription
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full">
                      <Mail className="w-4 h-4 mr-2" />
                      Sign In
                    </Button>
                  </form>

                  <div className="mt-4 space-y-2 text-center">
                    <p className="text-sm text-muted-foreground">
                      Don't have an account?
                    </p>
                    <Button variant="outline" className="w-full">
                      Create Free Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}