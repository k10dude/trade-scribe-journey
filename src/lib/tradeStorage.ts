
import { Trade } from '../types/trade';
import { toast } from '@/hooks/use-toast';
import { supabase } from './supabase';

// Get all trades from Supabase
export const getTrades = async (): Promise<Trade[]> => {
  try {
    const { data: trades, error } = await supabase
      .from('trades')
      .select('*')
      .order('date', { ascending: false });

    if (error) throw error;
    return trades || [];
  } catch (error: any) {
    console.error('Error fetching trades from Supabase:', error);
    toast({
      title: 'Error fetching trades',
      description: 'Could not load your trades. Please try again.',
      variant: 'destructive',
    });
    return [];
  }
};

// Add a new trade
export const addTrade = async (trade: Trade): Promise<void> => {
  try {
    const { error } = await supabase
      .from('trades')
      .insert(trade);
    
    if (error) throw error;
    
    toast({
      title: 'Trade added',
      description: `Successfully added ${trade.symbol} trade`,
    });
  } catch (error: any) {
    console.error('Error adding trade to Supabase:', error);
    toast({
      title: 'Error adding trade',
      description: 'Could not save your trade. Please try again.',
      variant: 'destructive',
    });
  }
};

// Update an existing trade
export const updateTrade = async (updatedTrade: Trade): Promise<void> => {
  try {
    const { error } = await supabase
      .from('trades')
      .update(updatedTrade)
      .eq('id', updatedTrade.id);
    
    if (error) throw error;
    
    toast({
      title: 'Trade updated',
      description: `Successfully updated ${updatedTrade.symbol} trade`,
    });
  } catch (error: any) {
    console.error('Error updating trade in Supabase:', error);
    toast({
      title: 'Error updating trade',
      description: 'Could not update your trade. Please try again.',
      variant: 'destructive',
    });
  }
};

// Delete a trade
export const deleteTrade = async (tradeId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('trades')
      .delete()
      .eq('id', tradeId);
    
    if (error) throw error;
    
    toast({
      title: 'Trade deleted',
      description: 'Successfully deleted trade',
    });
  } catch (error: any) {
    console.error('Error deleting trade from Supabase:', error);
    toast({
      title: 'Error deleting trade',
      description: 'Could not delete your trade. Please try again.',
      variant: 'destructive',
    });
  }
};

// Get a single trade by ID
export const getTradeById = async (tradeId: string): Promise<Trade | undefined> => {
  try {
    const { data, error } = await supabase
      .from('trades')
      .select('*')
      .eq('id', tradeId)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Error fetching trade by ID from Supabase:', error);
    toast({
      title: 'Error fetching trade',
      description: 'Could not load the trade details. Please try again.',
      variant: 'destructive',
    });
    return undefined;
  }
};

// Calculate profit/loss statistics
export const getTradeStatistics = async () => {
  try {
    const trades = await getTrades();
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
        averageRiskPercentage: 0,
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
    
    // Calculate average risk percentage for trades with that info
    const tradesWithRisk = closedTrades.filter(trade => trade.riskPercentage !== undefined);
    const averageRiskPercentage = tradesWithRisk.length > 0
      ? tradesWithRisk.reduce((sum, trade) => sum + (trade.riskPercentage || 0), 0) / tradesWithRisk.length
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
      averageRiskPercentage,
    };
  } catch (error) {
    console.error('Error calculating trade statistics:', error);
    return {
      totalTrades: 0,
      winningTrades: 0,
      losingTrades: 0,
      winRate: 0,
      totalProfitLoss: 0,
      averageProfitLoss: 0,
      largestWin: 0,
      largestLoss: 0,
      averageRiskPercentage: 0,
    };
  }
};
