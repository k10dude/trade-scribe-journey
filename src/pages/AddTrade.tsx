
import Navbar from '@/components/Navbar';
import TradeEntryForm from '@/components/TradeEntryForm';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function AddTrade() {
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
          <div className="mb-6">
            <Button 
              variant="ghost" 
              size="sm" 
              className="mb-2" 
              asChild
            >
              <Link to="/">
                <ChevronLeft className="h-4 w-4 mr-1" /> Back to Dashboard
              </Link>
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">Add New Trade</h1>
            <p className="text-muted-foreground mt-1">Record a new trade in your journal</p>
          </div>
          
          <TradeEntryForm />
        </motion.div>
      </main>
    </div>
  );
}
