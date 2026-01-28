import { useState } from "react";
import { Link } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { ProjectAccountSelector } from "@/components/ProjectAccountSelector";
import { CompetitorPerformanceChart } from "@/components/CompetitorPerformanceChart";
import { EngagementByPlatformChart } from "@/components/EngagementByPlatformChart";
import { PostingRhythmTable } from "@/components/PostingRhythmTable";
import { KeyInsightsGrid } from "@/components/KeyInsightsGrid";
import { BloggerStatisticsChart } from "@/components/BloggerStatisticsChart";
import { VideoStatisticsTable } from "@/components/VideoStatisticsTable";
import { EngagementHeatmap } from "@/components/EngagementHeatmap";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Sparkles, 
  ArrowRight,
  RefreshCw,
  Brain
} from "lucide-react";

const AIInsights = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [timePeriod, setTimePeriod] = useState("7D");
  const [isRegenerating, setIsRegenerating] = useState(false);

  const timePeriods = ["1D", "2D", "3D", "7D", "All"];

  const handleRegenerate = () => {
    setIsRegenerating(true);
    setTimeout(() => setIsRegenerating(false), 1500);
  };

  return (
    <div className="flex min-h-screen bg-background w-full">
      <Sidebar />
      
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-[1400px] mx-auto">
          <p className="text-muted-foreground">AI Insights content has been removed.</p>
        </div>
      </main>
    </div>
  );
};

export default AIInsights;
