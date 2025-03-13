
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { CalendarIcon, Check, ChevronDown, Info } from 'lucide-react';
import { format } from 'date-fns';

import { Trade, TradeType, TradeStatus, TradeSentiment } from '@/types/trade';
import { addTrade } from '@/lib/tradeStorage';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/components/ui/toast';
import { Switch } from '@/components/ui/switch';
import { motion } from 'framer-motion';

// Define schema for trade entry form
const tradeEntrySchema = z.object({
  symbol: z.string().min(1, "Symbol is required"),
  date: z.date({
    required_error: "Trade date is required",
  }),
  type: z.enum(["buy", "sell", "buy_to_cover", "sell_short"], {
    required_error: "Trade type is required",
  }),
  price: z.coerce.number().positive("Price must be positive"),
  quantity: z.coerce.number().positive("Quantity must be positive"),
  status: z.enum(["open", "closed"], {
    required_error: "Trade status is required",
  }),
  sentiment: z.enum(["bullish", "bearish", "neutral"], {
    required_error: "Sentiment is required",
  }),
  strategy: z.string().optional(),
  setup: z.string().optional(),
  risk: z.coerce.number().optional(),
  reward: z.coerce.number().optional(),
  notes: z.string().optional(),
  exitPrice: z.coerce.number().optional(),
  exitDate: z.date().optional(),
});

type TradeFormValues = z.infer<typeof tradeEntrySchema>;

export default function TradeEntryForm() {
  const navigate = useNavigate();
  const [isClosedTrade, setIsClosedTrade] = useState(false);
  
  const form = useForm<TradeFormValues>({
    resolver: zodResolver(tradeEntrySchema),
    defaultValues: {
      symbol: "",
      date: new Date(),
      type: "buy",
      status: "open",
      sentiment: "neutral",
    },
  });

  const onSubmit = (values: TradeFormValues) => {
    try {
      const { exitPrice, exitDate, ...rest } = values;
      
      // Calculate P&L if it's a closed trade with exit price
      let profitLoss: number | undefined;
      let profitLossPercentage: number | undefined;
      
      if (rest.status === 'closed' && exitPrice) {
        const isLong = rest.type === 'buy' || rest.type === 'buy_to_cover';
        const entryValue = rest.price * rest.quantity;
        const exitValue = exitPrice * rest.quantity;
        
        if (isLong) {
          profitLoss = exitValue - entryValue;
        } else {
          profitLoss = entryValue - exitValue;
        }
        
        profitLossPercentage = (profitLoss / entryValue) * 100;
      }
      
      // Create new trade object
      const newTrade: Trade = {
        id: uuidv4(),
        ...rest,
        exitPrice: exitPrice,
        exitDate: exitDate ? format(exitDate, "yyyy-MM-dd") : undefined,
        date: format(rest.date, "yyyy-MM-dd"),
        profitLoss,
        profitLossPercentage,
      };
      
      // Add trade to storage
      addTrade(newTrade);
      
      toast({
        title: "Trade added successfully",
        description: `Added ${newTrade.symbol} trade to your journal`,
      });
      
      // Redirect to trades list
      navigate('/trades');
    } catch (error) {
      console.error("Error adding trade:", error);
      toast({
        title: "Error adding trade",
        description: "There was a problem adding your trade. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Handle trade status change
  const handleStatusChange = (status: TradeStatus) => {
    form.setValue("status", status);
    setIsClosedTrade(status === "closed");
    
    if (status === "closed") {
      // Set exit date to today if not already set
      if (!form.getValues("exitDate")) {
        form.setValue("exitDate", new Date());
      }
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">Trade Details</h3>
                
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="symbol"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Symbol *</FormLabel>
                        <FormControl>
                          <Input placeholder="AAPL" {...field} className="uppercase" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Entry Date *</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                              className={cn("p-3 pointer-events-auto")}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Trade Type *</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select trade type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="buy">Buy</SelectItem>
                            <SelectItem value="sell">Sell</SelectItem>
                            <SelectItem value="buy_to_cover">Buy to Cover</SelectItem>
                            <SelectItem value="sell_short">Sell Short</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="sentiment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sentiment *</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select sentiment" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="bullish">Bullish</SelectItem>
                            <SelectItem value="bearish">Bearish</SelectItem>
                            <SelectItem value="neutral">Neutral</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Entry Price *</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" placeholder="0.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity *</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Trade Status</h3>
                  
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="trade-status" className={cn(!isClosedTrade && "text-primary")}>Open</Label>
                    <Switch
                      id="trade-status"
                      checked={isClosedTrade}
                      onCheckedChange={(checked) => {
                        handleStatusChange(checked ? "closed" : "open");
                      }}
                    />
                    <Label htmlFor="trade-status" className={cn(isClosedTrade && "text-primary")}>Closed</Label>
                  </div>
                </div>
                
                {isClosedTrade && (
                  <motion.div 
                    className="grid grid-cols-1 gap-4 md:grid-cols-2"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FormField
                      control={form.control}
                      name="exitPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Exit Price *</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" placeholder="0.00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="exitDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Exit Date *</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                                className={cn("p-3 pointer-events-auto")}
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">Trade Analysis</h3>
                
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="strategy"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Strategy</FormLabel>
                        <FormControl>
                          <Input placeholder="Breakout, Swing, etc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="setup"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Setup</FormLabel>
                        <FormControl>
                          <Input placeholder="Flag, Head & Shoulders, etc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex space-x-4 md:col-span-2">
                    <FormField
                      control={form.control}
                      name="risk"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <div className="flex items-center space-x-1">
                            <FormLabel>Risk</FormLabel>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-4 w-4 p-0 rounded-full">
                                    <Info className="h-3 w-3" />
                                    <span className="sr-only">Risk info</span>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                  <p>The amount of money you're risking on this trade</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <FormControl>
                            <Input type="number" step="0.01" placeholder="0.00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="reward"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <div className="flex items-center space-x-1">
                            <FormLabel>Reward</FormLabel>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-4 w-4 p-0 rounded-full">
                                    <Info className="h-3 w-3" />
                                    <span className="sr-only">Reward info</span>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                  <p>The amount of money you're targeting to gain from this trade</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <FormControl>
                            <Input type="number" step="0.01" placeholder="0.00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="What made you enter this trade? Any observations?" 
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <div className="flex justify-end space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button type="submit">Save Trade</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
