
export type TradeType = 'buy' | 'sell' | 'buy_to_cover' | 'sell_short';
export type TradeStatus = 'open' | 'closed';
export type TradeSentiment = 'bullish' | 'bearish' | 'neutral';

export interface Trade {
  id: string;
  symbol: string;
  date: string; // ISO date string
  type: TradeType;
  price: number;
  quantity: number;
  status: TradeStatus;
  exitPrice?: number;
  exitDate?: string; // ISO date string
  profitLoss?: number;
  profitLossPercentage?: number;
  notes?: string;
  sentiment: TradeSentiment;
  strategy?: string;
  setup?: string;
  risk?: number;
  reward?: number;
  images?: string[]; // URLs or base64 strings for multiple images
  tags?: string[];
  accountBalance?: number; // For risk management
  stopLoss?: number; // For risk management
  riskPercentage?: number; // Calculated risk percentage
  riskManagementFeedback?: string; // Feedback from OpenAI
}
