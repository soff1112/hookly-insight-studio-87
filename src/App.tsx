import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProjectProvider } from "@/contexts/ProjectContext";
import { StrategyProvider } from "@/contexts/StrategyContext";
import Index from "./pages/Index";
import AIInsights from "./pages/AIInsights";
import CompetitorAnalysis from "./pages/CompetitorAnalysis";
import VideoAnalysis from "./pages/VideoAnalysis";
import InWork from "./pages/InWork";
import MyAccounts from "./pages/MyAccounts";
import MarketingStrategy from "./pages/MarketingStrategy";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ProjectProvider>
      <StrategyProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/competitor-analysis" element={<CompetitorAnalysis />} />
              <Route path="/video-analysis" element={<VideoAnalysis />} />
              <Route path="/in-work" element={<InWork />} />
              <Route path="/ai-insights" element={<AIInsights />} />
              <Route path="/marketing-strategy" element={<MarketingStrategy />} />
              <Route path="/my-accounts" element={<MyAccounts />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </StrategyProvider>
    </ProjectProvider>
  </QueryClientProvider>
);

export default App;
