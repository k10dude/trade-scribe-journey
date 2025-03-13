
import { Trade } from '@/types/trade';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistance } from 'date-fns';
import { useState } from 'react';
import { ArrowDownRight, ArrowUpRight, ChevronRight, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface TradeCardProps {
  trade: Trade;
  index: number;
}

export default function TradeCard({ trade, index }: TradeCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };
  
  const getTimeSince = (dateString: string) => {
    try {
      return formatDistance(new Date(dateString), new Date(), { addSuffix: true });
    } catch (error) {
      return 'Invalid date';
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'closed':
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };
  
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'buy':
      case 'buy_to_cover':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'sell':
      case 'sell_short':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };
  
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'bearish':
        return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
      case 'neutral':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };
  
  const getProfitLossIcon = () => {
    if (!trade.profitLoss) return <Minus className="h-4 w-4" />;
    if (trade.profitLoss > 0) return <ArrowUpRight className="h-4 w-4 text-profit" />;
    return <ArrowDownRight className="h-4 w-4 text-loss" />;
  };
  
  const handleClick = () => {
    navigate(`/trade/${trade.id}`);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Card 
        className={cn(
          "border border-border hover:border-primary/20 transition-all duration-300 cursor-pointer",
          isHovered ? "shadow-md" : "shadow-sm"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
      >
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-bold">{trade.symbol}</h3>
                  <Badge variant="outline" className={getTypeColor(trade.type)}>
                    {trade.type.replace('_', ' ')}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{formatDate(trade.date)} ({getTimeSince(trade.date)})</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="flex flex-col items-end">
                {trade.status === 'closed' && trade.profitLoss !== undefined && (
                  <span className={cn("text-base font-semibold", 
                    trade.profitLoss > 0 ? "text-profit" : trade.profitLoss < 0 ? "text-loss" : "text-neutral"
                  )}>
                    {trade.profitLoss > 0 ? '+' : ''}{formatCurrency(trade.profitLoss)}
                    {trade.profitLossPercentage && (
                      <span className="text-xs ml-1">
                        ({trade.profitLossPercentage > 0 ? '+' : ''}{trade.profitLossPercentage.toFixed(2)}%)
                      </span>
                    )}
                  </span>
                )}
                <div className="flex space-x-2 mt-1">
                  <Badge variant="outline" className={getStatusColor(trade.status)}>
                    {trade.status}
                  </Badge>
                  <Badge variant="outline" className={getSentimentColor(trade.sentiment)}>
                    {trade.sentiment}
                  </Badge>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
          
          <div className="mt-3 flex justify-between items-center text-sm">
            <div className="grid grid-cols-2 gap-x-4 text-muted-foreground">
              <div>Entry: {formatCurrency(trade.price)}</div>
              <div>Qty: {trade.quantity}</div>
              {trade.exitPrice && (
                <div>Exit: {formatCurrency(trade.exitPrice)}</div>
              )}
              {trade.strategy && (
                <div>Strategy: {trade.strategy}</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
