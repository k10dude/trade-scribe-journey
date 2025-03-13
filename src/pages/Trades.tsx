
import Navbar from '@/components/Navbar';
import TradesList from '@/components/TradesList';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Trades() {
  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0 md:pt-20">
      <Navbar />
      
      <main className="container px-4 pt-8 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="page-transition"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Trade Journal</h1>
              <p className="text-muted-foreground mt-1">View and filter all your recorded trades</p>
            </div>
            <Button asChild className="mt-4 md:mt-0">
              <Link to="/add-trade">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Trade
              </Link>
            </Button>
          </div>
          
          <TradesList />
        </motion.div>
      </main>
    </div>
  );
}
