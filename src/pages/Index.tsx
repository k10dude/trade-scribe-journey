
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlusCircle, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Navbar from '@/components/Navbar';
import DashboardStats from '@/components/DashboardStats';
import TradesList from '@/components/TradesList';
import { toast } from '@/hooks/use-toast';

const API_KEY_STORAGE_KEY = 'trade-journal-openai-api-key';

const Index = () => {
  const [apiKeySet, setApiKeySet] = useState(false);

  useEffect(() => {
    // Check if API key exists in localStorage
    const storedKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    setApiKeySet(!!storedKey);
  }, []);

  const saveApiKey = () => {
    // This is a placeholder - in a real app, we'd use a secure method to handle API keys
    const apiKey = prompt("Enter your OpenAI API key:");
    
    if (apiKey && apiKey.trim()) {
      localStorage.setItem(API_KEY_STORAGE_KEY, apiKey.trim());
      setApiKeySet(true);
      toast({
        title: 'API Key Saved',
        description: 'Your OpenAI API key has been saved securely in your browser.',
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold">Trading Journal Dashboard</h1>
          <div className="flex items-center gap-4">
            {!apiKeySet ? (
              <Button variant="outline" size="sm" onClick={saveApiKey}>
                Set OpenAI API Key
              </Button>
            ) : (
              <Button variant="outline" size="sm" onClick={saveApiKey}>
                Update API Key
              </Button>
            )}
            <Button asChild>
              <Link to="/add-trade">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Trade
              </Link>
            </Button>
          </div>
        </div>
        
        <DashboardStats />

        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">Recent Trades</h2>
          <TradesList limit={5} />
          <div className="mt-6 text-center">
            <Link to="/trades" className="text-primary hover:underline inline-flex items-center">
              View All Trades <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </main>
    </motion.div>
  );
};

export default Index;
