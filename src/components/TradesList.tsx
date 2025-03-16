
import { useState, useEffect } from 'react';
import { getTrades } from '@/lib/tradeStorage';
import { Trade } from '@/types/trade';
import TradeCard from './TradeCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface TradesListProps {
  limit?: number;
}

export default function TradesList({ limit }: TradesListProps = {}) {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [filteredTrades, setFilteredTrades] = useState<Trade[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('dateDesc');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const loadedTrades = await getTrades();
        setTrades(loadedTrades);
        setFilteredTrades(loadedTrades);
      } catch (error) {
        console.error("Error fetching trades:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTrades();
  }, []);
  
  useEffect(() => {
    filterAndSortTrades();
  }, [searchTerm, statusFilter, typeFilter, sortBy, trades]);
  
  const filterAndSortTrades = () => {
    let result = [...trades];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(trade => 
        trade.symbol.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (trade.notes && trade.notes.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (trade.strategy && trade.strategy.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (trade.tags && trade.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(trade => trade.status === statusFilter);
    }
    
    // Apply type filter
    if (typeFilter !== 'all') {
      result = result.filter(trade => trade.type === typeFilter);
    }
    
    // Apply sorting
    switch(sortBy) {
      case 'dateAsc':
        result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case 'dateDesc':
        result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case 'symbolAsc':
        result.sort((a, b) => a.symbol.localeCompare(b.symbol));
        break;
      case 'symbolDesc':
        result.sort((a, b) => b.symbol.localeCompare(a.symbol));
        break;
      case 'profitDesc':
        result.sort((a, b) => (b.profitLoss || 0) - (a.profitLoss || 0));
        break;
      case 'profitAsc':
        result.sort((a, b) => (a.profitLoss || 0) - (b.profitLoss || 0));
        break;
      default:
        result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    
    // Apply limit if provided
    if (limit && limit > 0) {
      result = result.slice(0, limit);
    }
    
    setFilteredTrades(result);
  };
  
  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setTypeFilter('all');
  };
  
  const hasActiveFilters = searchTerm || statusFilter !== 'all' || typeFilter !== 'all';
  
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-pulse text-muted-foreground">Loading trades...</div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search symbols, notes, strategies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <div className="flex space-x-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="buy">Buy</SelectItem>
                <SelectItem value="sell">Sell</SelectItem>
                <SelectItem value="buy_to_cover">Buy to Cover</SelectItem>
                <SelectItem value="sell_short">Sell Short</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dateDesc">Newest</SelectItem>
                <SelectItem value="dateAsc">Oldest</SelectItem>
                <SelectItem value="symbolAsc">Symbol A-Z</SelectItem>
                <SelectItem value="symbolDesc">Symbol Z-A</SelectItem>
                <SelectItem value="profitDesc">Profit High-Low</SelectItem>
                <SelectItem value="profitAsc">Profit Low-High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {hasActiveFilters && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center space-x-2"
          >
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Active filters:</span>
            
            {searchTerm && (
              <Badge variant="outline" className="flex items-center gap-1 pl-2">
                Search: {searchTerm}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => setSearchTerm('')}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            
            {statusFilter !== 'all' && (
              <Badge variant="outline" className="flex items-center gap-1 pl-2">
                Status: {statusFilter}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => setStatusFilter('all')}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            
            {typeFilter !== 'all' && (
              <Badge variant="outline" className="flex items-center gap-1 pl-2">
                Type: {typeFilter.replace('_', ' ')}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => setTypeFilter('all')}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            
            <Button variant="ghost" size="sm" onClick={resetFilters} className="text-xs h-7">
              Clear all
            </Button>
          </motion.div>
        )}
      </div>
      
      <div className="space-y-3">
        {filteredTrades.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed rounded-lg border-border">
            <div className="text-muted-foreground">
              {trades.length === 0 ? (
                <p>No trades added yet. Add your first trade to get started.</p>
              ) : (
                <p>No trades match your filters. Try adjusting your search criteria.</p>
              )}
            </div>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              Showing {filteredTrades.length} of {trades.length} trades
            </p>
            
            <div className="space-y-3">
              {filteredTrades.map((trade, index) => (
                <TradeCard key={trade.id} trade={trade} index={index} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
