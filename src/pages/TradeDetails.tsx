import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getTradeById, deleteTrade } from '@/lib/tradeStorage';
import { Trade } from '@/types/trade';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ChevronLeft, Trash2, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function TradeDetails() {
  const { id } = useParams<{ id: string }>();
  const [trade, setTrade] = useState<Trade | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchTrade = async () => {
      if (id) {
        try {
          const fetchedTrade = await getTradeById(id);
          if (fetchedTrade) {
            setTrade(fetchedTrade);
          }
        } catch (error) {
          console.error("Error fetching trade:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchTrade();
  }, [id]);
  
  const handleDelete = async () => {
    if (id) {
      try {
        await deleteTrade(id);
        navigate('/trades');
      } catch (error) {
        console.error("Error deleting trade:", error);
      }
    }
  };
  
  const formatCurrency = (value: number | undefined) => {
    if (value === undefined) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
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
    if (!trade?.profitLoss) return <Minus className="h-5 w-5" />;
    return trade.profitLoss > 0 ? 
      <ArrowUpRight className="h-5 w-5 text-profit" /> : 
      <ArrowDownRight className="h-5 w-5 text-loss" />;
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-20 md:pb-0 md:pt-20">
        <Navbar />
        <main className="container px-4 pt-8 mx-auto max-w-7xl">
          <div className="flex items-center justify-center h-[60vh]">
            <div className="animate-pulse text-muted-foreground">Loading trade details...</div>
          </div>
        </main>
      </div>
    );
  }
  
  if (!trade) {
    return (
      <div className="min-h-screen bg-background pb-20 md:pb-0 md:pt-20">
        <Navbar />
        <main className="container px-4 pt-8 mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <h2 className="text-2xl font-bold mb-2">Trade Not Found</h2>
            <p className="text-muted-foreground mb-4">The trade you're looking for doesn't exist or has been deleted.</p>
            <Button onClick={() => navigate('/trades')}>
              Return to Journal
            </Button>
          </div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0 md:pt-20">
      <Navbar />
      
      <main className="container px-4 pt-8 mx-auto max-w-4xl">
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
              onClick={() => navigate(-1)}
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Back
            </Button>
            
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center space-x-2">
                <h1 className="text-3xl font-bold tracking-tight">{trade.symbol}</h1>
                <Badge variant="outline" className={getTypeColor(trade.type)}>
                  {trade.type.replace('_', ' ')}
                </Badge>
                <Badge variant="outline" className={getStatusColor(trade.status)}>
                  {trade.status}
                </Badge>
                <Badge variant="outline" className={getSentimentColor(trade.sentiment)}>
                  {trade.sentiment}
                </Badge>
              </div>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" className="mt-4 md:mt-0">
                    <Trash2 className="h-4 w-4 mr-1" /> Delete Trade
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete this trade from your journal.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h2 className="text-lg font-semibold mb-4">Trade Information</h2>
                    
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Entry Date</dt>
                        <dd className="font-medium">{formatDate(trade.date)}</dd>
                      </div>
                      
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Entry Price</dt>
                        <dd className="font-medium">{formatCurrency(trade.price)}</dd>
                      </div>
                      
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Quantity</dt>
                        <dd className="font-medium">{trade.quantity}</dd>
                      </div>
                      
                      <Separator className="my-2" />
                      
                      {trade.status === 'closed' && (
                        <>
                          <div className="flex justify-between">
                            <dt className="text-muted-foreground">Exit Date</dt>
                            <dd className="font-medium">{formatDate(trade.exitDate)}</dd>
                          </div>
                          
                          <div className="flex justify-between">
                            <dt className="text-muted-foreground">Exit Price</dt>
                            <dd className="font-medium">{formatCurrency(trade.exitPrice)}</dd>
                          </div>
                          
                          <Separator className="my-2" />
                        </>
                      )}
                      
                      {trade.status === 'closed' && trade.profitLoss !== undefined && (
                        <div className="flex justify-between items-center">
                          <dt className="text-muted-foreground">Profit/Loss</dt>
                          <dd className={cn(
                            "font-semibold flex items-center",
                            trade.profitLoss > 0 ? "text-profit" : 
                            trade.profitLoss < 0 ? "text-loss" : ""
                          )}>
                            {getProfitLossIcon()}
                            <span className="ml-1">
                              {trade.profitLoss > 0 ? '+' : ''}{formatCurrency(trade.profitLoss)}
                              {trade.profitLossPercentage && (
                                <span className="text-xs ml-1">
                                  ({trade.profitLossPercentage > 0 ? '+' : ''}{trade.profitLossPercentage.toFixed(2)}%)
                                </span>
                              )}
                            </span>
                          </dd>
                        </div>
                      )}
                    </dl>
                  </div>
                  
                  <div>
                    <h2 className="text-lg font-semibold mb-4">Analysis</h2>
                    
                    <dl className="space-y-2">
                      {trade.strategy && (
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Strategy</dt>
                          <dd className="font-medium">{trade.strategy}</dd>
                        </div>
                      )}
                      
                      {trade.setup && (
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Setup</dt>
                          <dd className="font-medium">{trade.setup}</dd>
                        </div>
                      )}
                      
                      {(trade.risk !== undefined || trade.reward !== undefined) && (
                        <>
                          <Separator className="my-2" />
                          
                          {trade.risk !== undefined && (
                            <div className="flex justify-between">
                              <dt className="text-muted-foreground">Risk</dt>
                              <dd className="font-medium">{formatCurrency(trade.risk)}</dd>
                            </div>
                          )}
                          
                          {trade.reward !== undefined && (
                            <div className="flex justify-between">
                              <dt className="text-muted-foreground">Reward</dt>
                              <dd className="font-medium">{formatCurrency(trade.reward)}</dd>
                            </div>
                          )}
                          
                          {trade.risk !== undefined && trade.reward !== undefined && (
                            <div className="flex justify-between">
                              <dt className="text-muted-foreground">Risk/Reward Ratio</dt>
                              <dd className="font-medium">1:{(trade.reward / trade.risk).toFixed(2)}</dd>
                            </div>
                          )}
                        </>
                      )}
                    </dl>
                  </div>
                </div>
                
                {trade.notes && (
                  <div className="mt-6">
                    <h2 className="text-lg font-semibold mb-2">Notes</h2>
                    <div className="p-4 rounded-md bg-muted">
                      <p className="whitespace-pre-line">{trade.notes}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
