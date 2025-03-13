
import { toast } from '@/hooks/use-toast';

export const calculateRiskPercentage = (
  price: number,
  quantity: number,
  stopLoss: number | undefined,
  accountBalance: number | undefined
): number | undefined => {
  if (!stopLoss || !accountBalance || accountBalance <= 0) {
    return undefined;
  }

  const positionSize = price * quantity;
  const potentialLoss = Math.abs((price - stopLoss) * quantity);
  return (potentialLoss / accountBalance) * 100;
};

export const generateRiskFeedback = async (
  symbol: string,
  riskPercentage: number | undefined,
  tradeType: string,
  strategy?: string
): Promise<string> => {
  if (riskPercentage === undefined) {
    return "Add your account balance and stop-loss to receive risk management feedback.";
  }

  try {
    const prompt = `As a trading risk management advisor, provide brief feedback (1-2 sentences) on this trade:
- Symbol: ${symbol}
- Trade type: ${tradeType}
- Strategy: ${strategy || 'Not specified'}
- Risk percentage: ${riskPercentage.toFixed(2)}% of account balance

Focus on whether the risk percentage is appropriate, and suggest any improvements.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY || ''}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 150,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get risk management feedback');
    }

    const data = await response.json();
    return data.choices[0].message.content.trim() || 
      "Consider keeping risk below 2% of your account balance for better risk management.";
  } catch (error) {
    console.error('Error generating risk feedback:', error);
    // Provide a default response if the API call fails
    if (riskPercentage > 3) {
      return `Your risk of ${riskPercentage.toFixed(2)}% is relatively high. Consider reducing to 1-2% of your account balance for better risk management.`;
    } else if (riskPercentage > 1) {
      return `Your risk of ${riskPercentage.toFixed(2)}% is within reasonable limits for most trading strategies.`;
    } else {
      return `Your risk of ${riskPercentage.toFixed(2)}% is conservative, which is good for capital preservation.`;
    }
  }
};
