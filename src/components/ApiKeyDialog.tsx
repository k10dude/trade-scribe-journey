
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { Settings } from 'lucide-react';

const API_KEY_STORAGE_KEY = 'trade-journal-openai-api-key';

export const ApiKeyDialog = () => {
  const [open, setOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [hasStoredKey, setHasStoredKey] = useState(false);

  useEffect(() => {
    // Check if API key exists in localStorage
    const storedKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    setHasStoredKey(!!storedKey);
    if (storedKey) {
      // Show only first few characters for security
      setApiKey(storedKey.substring(0, 3) + '...' + storedKey.substring(storedKey.length - 4));
    }
  }, []);

  const saveApiKey = (key: string) => {
    if (key.trim()) {
      localStorage.setItem(API_KEY_STORAGE_KEY, key.trim());
      setHasStoredKey(true);
      toast({
        title: 'API Key Saved',
        description: 'Your OpenAI API key has been saved securely.',
      });
      setOpen(false);
    } else {
      toast({
        title: 'Invalid API Key',
        description: 'Please enter a valid API key.',
        variant: 'destructive',
      });
    }
  };

  const clearApiKey = () => {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
    setApiKey('');
    setHasStoredKey(false);
    toast({
      title: 'API Key Removed',
      description: 'Your OpenAI API key has been removed.',
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          API Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>OpenAI API Key</DialogTitle>
          <DialogDescription>
            Enter your OpenAI API key to enable risk management feedback.
            Your key is stored locally in your browser and is never sent to our servers.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <Input
            id="apiKey"
            placeholder={hasStoredKey ? apiKey : "Enter your OpenAI API key"}
            type={hasStoredKey ? "text" : "password"}
            value={hasStoredKey ? apiKey : ""}
            onChange={hasStoredKey ? undefined : (e) => setApiKey(e.target.value)}
            readOnly={hasStoredKey}
            className={hasStoredKey ? "bg-muted" : ""}
          />
          {!hasStoredKey && (
            <p className="text-sm text-muted-foreground">
              You can get your API key from{" "}
              <a 
                href="https://platform.openai.com/api-keys" 
                target="_blank" 
                rel="noreferrer"
                className="text-primary underline"
              >
                OpenAI's dashboard
              </a>.
            </p>
          )}
        </div>
        <DialogFooter className="sm:justify-between">
          {hasStoredKey ? (
            <Button variant="destructive" onClick={clearApiKey}>
              Remove API Key
            </Button>
          ) : (
            <Button onClick={() => saveApiKey(apiKey)}>
              Save API Key
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
