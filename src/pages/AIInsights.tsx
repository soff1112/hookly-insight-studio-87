import { useState } from "react";
import { Link } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { ProjectAccountSelector } from "@/components/ProjectAccountSelector";
import { ExecutiveOverview } from "@/components/insights/ExecutiveOverview";
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
import { Separator } from "@/components/ui/separator";
import { Search, Sparkles, ArrowRight, RefreshCw, Brain, ChevronDown } from "lucide-react";
const AIInsights = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [timePeriod, setTimePeriod] = useState("7D");
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());
  const timePeriods = ["1D", "2D", "3D", "7D", "All"];
  const handleRegenerate = () => {
    setIsRegenerating(true);
    setTimeout(() => setIsRegenerating(false), 1500);
  };
  const toggleSection = (section: string) => {
    setCollapsedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };
  return <div className="flex min-h-screen bg-background w-full">
      <Sidebar />
      
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-[1400px] mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Brain className="w-8 h-8 text-primary" />
                <h1 className="text-3xl font-bold text-foreground">AI Insights</h1>
              </div>
              <p className="text-muted-foreground">Deep competitive intelligence </p>
              <div className="flex items-center gap-3 mt-2">
                <ProjectAccountSelector />
              </div>
              <div className="flex items-center gap-2 text-sm mt-2">
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  5 accounts connected
                </Badge>
                <Badge variant="outline">Pro Plan</Badge>
                <span className="text-xs text-muted-foreground">Last updated: 2 min ago</span>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                
              </div>
              
              <div className="flex gap-1 bg-muted rounded-lg p-1">
                {timePeriods.map(period => <Button key={period} variant={timePeriod === period ? "default" : "ghost"} size="sm" className="h-8 px-3" onClick={() => setTimePeriod(period)}>
                    {period}
                  </Button>)}
              </div>

              <Button variant="outline" size="sm" className="gap-2" onClick={handleRegenerate} disabled={isRegenerating}>
                <RefreshCw className={`w-4 h-4 ${isRegenerating ? 'animate-spin' : ''}`} />
                Regenerate All
              </Button>
            </div>
          </div>

          {/* LEVEL 1: Executive Overview */}
          <section id="executive-overview">
            <ExecutiveOverview />
          </section>

          <Separator className="my-8" />

          {/* LEVEL 2: Competitive Benchmarking */}
          <section id="competitive-benchmarking" className="space-y-6">
            <div className="flex items-center gap-2 cursor-pointer group" onClick={() => toggleSection('benchmarking')}>
              
              <h2 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                Competitive Benchmarking
              </h2>
              <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${collapsedSections.has('benchmarking') ? '-rotate-90' : ''}`} />
              <span className="text-xs text-muted-foreground ml-auto">
                Why is this happening compared to competitors?
              </span>
            </div>

            {!collapsedSections.has('benchmarking') && <div className="space-y-6">
                <CompetitorPerformanceChart />
                <EngagementByPlatformChart />
              </div>}
          </section>

          <Separator className="my-8" />

          {/* LEVEL 3: Actionable Strategy Insights */}
          <section id="strategy-insights" className="space-y-6">
            <div className="flex items-center gap-2 cursor-pointer group" onClick={() => toggleSection('strategy')}>
              
              <h2 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                Actionable Strategy
              </h2>
              <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${collapsedSections.has('strategy') ? '-rotate-90' : ''}`} />
              <span className="text-xs text-muted-foreground ml-auto">
                What should I do next?
              </span>
            </div>

            {!collapsedSections.has('strategy') && <div className="space-y-6">
                <PostingRhythmTable />
                <KeyInsightsGrid />
              </div>}
          </section>

          <Separator className="my-8" />

          {/* LEVEL 4: Deep Dive Analytics */}
          <section id="deep-dive" className="space-y-6">
            <div className="flex items-center gap-2 cursor-pointer group" onClick={() => toggleSection('deepdive')}>
              
              <h2 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                Deep Dive Analytics
              </h2>
              <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${collapsedSections.has('deepdive') ? '-rotate-90' : ''}`} />
              <span className="text-xs text-muted-foreground ml-auto">
                Where exactly are the issues or opportunities?
              </span>
            </div>

            {!collapsedSections.has('deepdive') && <div className="space-y-6">
                <BloggerStatisticsChart />
                <VideoStatisticsTable />
                <EngagementHeatmap />
              </div>}
          </section>

          {/* Strategy CTA - Sticky at bottom */}
          
        </div>
      </main>
    </div>;
};
export default AIInsights;