
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlusCircle, ChevronRight, Key } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Navbar from '@/components/Navbar';
import DashboardStats from '@/components/DashboardStats';
import TradesList from '@/components/TradesList';
import { ApiKeyDialog } from '@/components/ApiKeyDialog';

const Index = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Trading Journal Dashboard</h1>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={() => document.getElementById('openai-api-dialog-trigger')?.click()}>
              <Key className="h-4 w-4" />
              OpenAI API Key
            </Button>
            <div className="hidden">
              <ApiKeyDialog />
            </div>
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
