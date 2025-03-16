
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

interface SupabaseCredentialsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SupabaseCredentialsDialog({ open, onOpenChange }: SupabaseCredentialsDialogProps) {
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabaseUrl || !supabaseKey) {
      toast({
        title: 'Missing credentials',
        description: 'Please provide both the Supabase URL and Anon Key',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Store the values in localStorage for development purposes
      localStorage.setItem('supabase_url', supabaseUrl);
      localStorage.setItem('supabase_key', supabaseKey);

      // In a production app, these would be stored server-side
      toast({
        title: 'Credentials saved',
        description: 'Supabase credentials have been saved. Please reload the page.',
      });

      // Close the dialog
      onOpenChange(false);
      
      // Prompt the user to reload
      setTimeout(() => {
        if (confirm('Reload the page to apply new Supabase credentials?')) {
          window.location.reload();
        }
      }, 1000);
    } catch (error) {
      console.error('Failed to save credentials:', error);
      toast({
        title: 'Error',
        description: 'Failed to save credentials',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Supabase Credentials</DialogTitle>
          <DialogDescription>
            Enter your Supabase URL and Anon Key to connect to your project.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="supabaseUrl">Supabase URL</Label>
              <Input
                id="supabaseUrl"
                placeholder="https://example.supabase.co"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="supabaseKey">Supabase Anon Key</Label>
              <Input
                id="supabaseKey"
                placeholder="eyJhb...(your anon key)"
                value={supabaseKey}
                onChange={(e) => setSupabaseKey(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Credentials'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
