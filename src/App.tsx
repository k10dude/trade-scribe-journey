
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

import Auth from "./pages/Auth";
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
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } />
              <Route path="/trades" element={
                <ProtectedRoute>
                  <Trades />
                </ProtectedRoute>
              } />
              <Route path="/add-trade" element={
                <ProtectedRoute>
                  <AddTrade />
                </ProtectedRoute>
              } />
              <Route path="/trade/:id" element={
                <ProtectedRoute>
                  <TradeDetails />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
