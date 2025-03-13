
import { Trade } from '../types/trade';
import { toast } from '@/components/ui/toast';

// Local storage key
const TRADES_STORAGE_KEY = 'trading-journal-trades';

// Get all trades from localStorage
export const getTrades = (): Trade[] => {
  try {
    const tradesJson = localStorage.getItem(TRADES_STORAGE_KEY);
    if (!tradesJson) return [];
    return JSON.parse(tradesJson);
  } catch (error) {
    console.error('Error fetching trades from localStorage:', error);
    toast({
      title: 'Error fetching trades',
      description: 'Could not load your trades. Please try again.',
      variant: 'destructive',
    });
    return [];
  }
};

// Add a new trade
export const addTrade = (trade: Trade): void => {
  try {
    const trades = getTrades();
    trades.push(trade);
    localStorage.setItem(TRADES_STORAGE_KEY, JSON.stringify(trades));
    toast({
      title: 'Trade added',
      description: `Successfully added ${trade.symbol} trade`,
    });
  } catch (error) {
    console.error('Error adding trade to localStorage:', error);
    toast({
      title: 'Error adding trade',
      description: 'Could not save your trade. Please try again.',
      variant: 'destructive',
    });
  }
};

// Update an existing trade
export const updateTrade = (updatedTrade: Trade): void => {
  try {
    const trades = getTrades();
    const tradeIndex = trades.findIndex(trade => trade.id === updatedTrade.id);
    
    if (tradeIndex !== -1) {
      trades[tradeIndex] = updatedTrade;
      localStorage.setItem(TRADES_STORAGE_KEY, JSON.stringify(trades));
      toast({
        title: 'Trade updated',
        description: `Successfully updated ${updatedTrade.symbol} trade`,
      });
    } else {
      throw new Error('Trade not found');
    }
  } catch (error) {
    console.error('Error updating trade in localStorage:', error);
    toast({
      title: 'Error updating trade',
      description: 'Could not update your trade. Please try again.',
      variant: 'destructive',
    });
  }
};

// Delete a trade
export const deleteTrade = (tradeId: string): void => {
  try {
    const trades = getTrades();
    const updatedTrades = trades.filter(trade => trade.id !== tradeId);
    
    if (trades.length !== updatedTrades.length) {
      localStorage.setItem(TRADES_STORAGE_KEY, JSON.stringify(updatedTrades));
      toast({
        title: 'Trade deleted',
        description: 'Successfully deleted trade',
      });
    } else {
      throw new Error('Trade not found');
    }
  } catch (error) {
    console.error('Error deleting trade from localStorage:', error);
    toast({
      title: 'Error deleting trade',
      description: 'Could not delete your trade. Please try again.',
      variant: 'destructive',
    });
  }
};

// Get a single trade by ID
export const getTradeById = (tradeId: string): Trade | undefined => {
  try {
    const trades = getTrades();
    return trades.find(trade => trade.id === tradeId);
  } catch (error) {
    console.error('Error fetching trade by ID from localStorage:', error);
    toast({
      title: 'Error fetching trade',
      description: 'Could not load the trade details. Please try again.',
      variant: 'destructive',
    });
    return undefined;
  }
};

// Calculate profit/loss statistics
export const getTradeStatistics = () => {
  const trades = getTrades();
  const closedTrades = trades.filter(trade => trade.status === 'closed' && trade.profitLoss !== undefined);
  
  if (closedTrades.length === 0) {
    return {
      totalTrades: 0,
      winningTrades: 0,
      losingTrades: 0,
      winRate: 0,
      totalProfitLoss: 0,
      averageProfitLoss: 0,
      largestWin: 0,
      largestLoss: 0,
    };
  }

  const winningTrades = closedTrades.filter(trade => (trade.profitLoss || 0) > 0);
  const losingTrades = closedTrades.filter(trade => (trade.profitLoss || 0) < 0);
  
  const totalProfitLoss = closedTrades.reduce((total, trade) => total + (trade.profitLoss || 0), 0);
  
  const largestWin = winningTrades.length > 0 
    ? Math.max(...winningTrades.map(trade => trade.profitLoss || 0)) 
    : 0;
    
  const largestLoss = losingTrades.length > 0 
    ? Math.min(...losingTrades.map(trade => trade.profitLoss || 0)) 
    : 0;
  
  return {
    totalTrades: closedTrades.length,
    winningTrades: winningTrades.length,
    losingTrades: losingTrades.length,
    winRate: (winningTrades.length / closedTrades.length) * 100,
    totalProfitLoss,
    averageProfitLoss: totalProfitLoss / closedTrades.length,
    largestWin,
    largestLoss,
  };
};
