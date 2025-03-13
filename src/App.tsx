
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Trades from "./pages/Trades";
import AddTrade from "./pages/AddTrade";
import TradeDetails from "./pages/TradeDetails";
import NotFound from "./pages/NotFound";

// Add framer-motion
import { AnimatePresence } from "framer-motion";

// Create QueryClient
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/trades" element={<Trades />} />
            <Route path="/add-trade" element={<AddTrade />} />
            <Route path="/trade/:id" element={<TradeDetails />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
