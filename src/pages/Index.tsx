
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTradeStatistics, getTrades } from '@/lib/tradeStorage';
import { Trade } from '@/types/trade';
import DashboardStats from '@/components/DashboardStats';
import TradeCard from '@/components/TradeCard';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { PlusCircle, BarChart2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Index() {
  const [recentTrades, setRecentTrades] = useState<Trade[]>([]);
  const [stats, setStats] = useState(getTradeStatistics());
  
  useEffect(() => {
    // Get the 5 most recent trades
    const trades = getTrades();
    const sorted = [...trades].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setRecentTrades(sorted.slice(0, 5));
    setStats(getTradeStatistics());
  }, []);

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
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground mt-1">Your trading performance at a glance</p>
            </div>
            <Button asChild className="mt-4 md:mt-0">
              <Link to="/add-trade">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Trade
              </Link>
            </Button>
          </div>
          
          <div className="space-y-8">
            <section>
              <DashboardStats />
            </section>
            
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Recent Trades</h2>
                <Button variant="outline" asChild size="sm">
                  <Link to="/trades">View All</Link>
                </Button>
              </div>
              
              {recentTrades.length === 0 ? (
                <div className="rounded-lg border border-dashed p-8 text-center">
                  <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                    <BarChart2 className="h-10 w-10 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold">No trades yet</h3>
                    <p className="text-sm text-muted-foreground mt-2 mb-4">
                      You haven't added any trades to your journal yet. Add your first trade to start tracking your performance.
                    </p>
                    <Button asChild>
                      <Link to="/add-trade">
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Your First Trade
                      </Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentTrades.map((trade, index) => (
                    <TradeCard key={trade.id} trade={trade} index={index} />
                  ))}
                </div>
              )}
            </section>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
