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
        <div className="max-w-[1400px] mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Brain className="w-8 h-8 text-primary" />
                <h1 className="text-3xl font-bold text-foreground">AI Insights</h1>
              </div>
              <p className="text-muted-foreground">
                Deep competitive intelligence • 5-10 tracked accounts • Personalized strategy generation
              </p>
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
                <Input 
                  placeholder="Search insights..." 
                  className="pl-10 w-[250px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex gap-1 bg-muted rounded-lg p-1">
                {timePeriods.map((period) => (
                  <Button
                    key={period}
                    variant={timePeriod === period ? "default" : "ghost"}
                    size="sm"
                    className="h-8 px-3"
                    onClick={() => setTimePeriod(period)}
                  >
                    {period}
                  </Button>
                ))}
              </div>

              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                onClick={handleRegenerate}
                disabled={isRegenerating}
              >
                <RefreshCw className={`w-4 h-4 ${isRegenerating ? 'animate-spin' : ''}`} />
                Regenerate
              </Button>
            </div>
          </div>

          {/* Section 1: Competitor Performance Overview */}
          <section>
            <CompetitorPerformanceChart />
          </section>

          {/* Section 2: Engagement Trends by Platform */}
          <section>
            <EngagementByPlatformChart />
          </section>

          {/* Section 3: Posting Rhythm & Virality */}
          <section>
            <PostingRhythmTable />
          </section>

          {/* Section 4: Key Insights Grid */}
          <section>
            <KeyInsightsGrid />
          </section>

          {/* Section 5: Blogger Statistics */}
          <section>
            <BloggerStatisticsChart />
          </section>

          {/* Section 6: Video Statistics */}
          <section>
            <VideoStatisticsTable />
          </section>

          {/* Section 7: Engagement Heatmap */}
          <section>
            <EngagementHeatmap />
          </section>

          {/* Strategy CTA - Sticky at bottom */}
          <section className="sticky bottom-0 bg-gradient-to-t from-background via-background to-transparent pt-8 pb-4">
            <div className="flex items-center justify-between bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-xl p-6 border border-primary/20">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Ready to create your marketing strategy?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Generate personalized SWOT analysis, 90-day action plans, and have AI-powered conversations about your growth.
                </p>
              </div>
              <Button size="lg" className="gap-2 shrink-0" asChild>
                <Link to="/marketing-strategy">
                  <Sparkles className="w-5 h-5" />
                  Open Strategy Workspace
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default AIInsights;
