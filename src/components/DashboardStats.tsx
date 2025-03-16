
import { useEffect, useState } from 'react';
import { getTradeStatistics } from '@/lib/tradeStorage';
import { ArrowDownRight, ArrowUpRight, BarChart3, LineChart, PercentCircle, Wallet } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface StatsData {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  totalProfitLoss: number;
  averageProfitLoss: number;
  largestWin: number;
  largestLoss: number;
  averageRiskPercentage: number;
}

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  color: string;
  trend?: 'up' | 'down' | 'neutral';
  delay?: number;
}

const StatCard = ({ title, value, description, icon, color, trend, delay = 0 }: StatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
    >
      <Card className="overflow-hidden border border-border hover:border-primary/20 transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <h3 className={cn("text-2xl font-bold mt-1", {
                "text-profit": trend === 'up',
                "text-loss": trend === 'down',
                "text-neutral": trend === 'neutral'
              })}>
                {value}
              </h3>
              {description && (
                <p className="text-xs text-muted-foreground mt-1">{description}</p>
              )}
            </div>
            <div className={cn("p-2 rounded-full", `bg-${color}-500/10`)}>
              {icon}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function DashboardStats() {
  const [stats, setStats] = useState<StatsData>({
    totalTrades: 0,
    winningTrades: 0,
    losingTrades: 0,
    winRate: 0,
    totalProfitLoss: 0,
    averageProfitLoss: 0,
    largestWin: 0,
    largestLoss: 0,
    averageRiskPercentage: 0
  });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Update stats when component mounts
    const fetchStats = async () => {
      try {
        const data = await getTradeStatistics();
        setStats(data);
      } catch (error) {
        console.error("Error fetching trade statistics:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };
  
  const formatPercent = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(value / 100);
  };
  
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, index) => (
          <Card key={index} className="overflow-hidden border border-border">
            <CardContent className="p-6">
              <div className="animate-pulse h-24"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total P&L"
        value={formatCurrency(stats.totalProfitLoss)}
        description="All closed trades"
        icon={<Wallet className={cn("h-5 w-5", stats.totalProfitLoss >= 0 ? "text-profit" : "text-loss")} />}
        color={stats.totalProfitLoss >= 0 ? "emerald" : "red"}
        trend={stats.totalProfitLoss > 0 ? 'up' : stats.totalProfitLoss < 0 ? 'down' : 'neutral'}
        delay={0}
      />
      
      <StatCard
        title="Win Rate"
        value={formatPercent(stats.winRate)}
        description={`${stats.winningTrades} winning / ${stats.totalTrades} total`}
        icon={<PercentCircle className="h-5 w-5 text-violet-500" />}
        color="violet"
        trend="neutral"
        delay={1}
      />
      
      <StatCard
        title="Largest Win"
        value={formatCurrency(stats.largestWin)}
        icon={<ArrowUpRight className="h-5 w-5 text-profit" />}
        color="emerald"
        trend="up"
        delay={2}
      />
      
      <StatCard
        title="Largest Loss"
        value={formatCurrency(Math.abs(stats.largestLoss))}
        icon={<ArrowDownRight className="h-5 w-5 text-loss" />}
        color="red"
        trend="down"
        delay={3}
      />
    </div>
  );
}
