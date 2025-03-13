
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
  screenshot?: string; // URL or base64 string
  tags?: string[];
}
