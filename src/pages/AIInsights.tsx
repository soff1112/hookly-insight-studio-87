import { useState } from "react";
import { Link } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";

// Legacy components (keeping for now)
import { CompetitorPerformanceChart } from "@/components/CompetitorPerformanceChart";
import { EngagementByPlatformChart } from "@/components/EngagementByPlatformChart";
import { PostingRhythmTable as LegacyPostingRhythmTable } from "@/components/PostingRhythmTable";
import { PlatformStatsDashboard } from "@/components/analytics/PlatformStatsDashboard";
import { BloggerStatsTable } from "@/components/analytics/BloggerStatsTable";
import { VideoStatsTable } from "@/components/analytics/VideoStatsTable";
import { EngagementHeatmap } from "@/components/analytics/EngagementHeatmap";

// New workspace-aware components
import { WorkspaceSwitcher } from "@/components/workspace/WorkspaceSwitcher";
import { CompetitorSelector } from "@/components/workspace/CompetitorSelector";
import { TimeRangeSelector } from "@/components/dashboard/TimeRangeSelector";
import { RankingCard } from "@/components/dashboard/RankingCard";
import { PerformanceOverviewChart } from "@/components/dashboard/PerformanceOverviewChart";
import { PlatformEngagementChart } from "@/components/dashboard/PlatformEngagementChart";
import { PostingRhythmTable } from "@/components/dashboard/PostingRhythmTable";
import { OptimalTimesHeatmap } from "@/components/dashboard/OptimalTimesHeatmap";
import { AIInsightsHub } from "@/components/dashboard/AIInsightsHub";

import { 
  CompetitorAlertCard, 
  EngagementGapCard, 
  ViralityTrendsCard, 
  ContentFrequencyCard 
} from "@/components/analytics/EnhancedInsightCards";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Sparkles, 
  ArrowRight,
  Layers,
  Download,
  RefreshCw
} from "lucide-react";
import { useWorkspace } from "@/contexts/WorkspaceContext";

const AIInsights = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const { activeWorkspace, getMainAccount, getTopCompetitors } = useWorkspace();

  const mainAccount = getMainAccount();
  const competitors = getTopCompetitors(5);

  return (
    <div className="flex min-h-screen bg-background w-full">
      <Sidebar />
      
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-[1800px] mx-auto space-y-6">
          {/* Header with Workspace Switcher */}
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <WorkspaceSwitcher />
                <h1 className="text-2xl font-bold text-foreground">AI Insights</h1>
              </div>
              <p className="text-muted-foreground">
                Enterprise-grade analytics • {competitors.length + 1} tracked accounts • AI-powered strategic insights
              </p>
              <div className="flex items-center gap-2 text-sm">
                <Badge variant="secondary" className="bg-accent/10 text-accent-foreground">
                  {activeWorkspace?.niche || 'All Niches'}
                </Badge>
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  {mainAccount?.platform || 'Multi-Platform'}
                </Badge>
                <Badge variant="outline">Pro Plan</Badge>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search insights..." 
                  className="pl-10 w-[200px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <TimeRangeSelector />
              <CompetitorSelector />

              <Button variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>

              <Button variant="outline" size="sm" className="gap-2">
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full max-w-[900px] grid-cols-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="platforms">Platforms</TabsTrigger>
              <TabsTrigger value="bloggers">Bloggers</TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
              <TabsTrigger value="timing">Timing</TabsTrigger>
            </TabsList>

            {/* Overview Tab - New Workspace-Aware Components */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Ranking Card */}
                <div className="lg:col-span-1">
                  <RankingCard />
                </div>
                
                {/* AI Insights */}
                <div className="lg:col-span-3">
                  <AIInsightsHub />
                </div>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <PerformanceOverviewChart />
                <PlatformEngagementChart />
              </div>

              {/* Posting Rhythm */}
              <PostingRhythmTable />

              {/* Generate Strategy CTA */}
              <div className="bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-xl p-6 space-y-4 border border-primary/20">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      AI Strategy Workspace
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-lg">
                      Generate personalized marketing strategies with SWOT analysis, 90-day action plans, 
                      and interactive follow-up conversations based on your workspace data.
                    </p>
                  </div>

                  <Button 
                    size="lg" 
                    className="gap-2 group"
                    asChild
                  >
                    <Link to="/marketing-strategy">
                      <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                      Open Marketing Strategy
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Performance Tab - Detailed competitor analysis */}
            <TabsContent value="performance" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <PerformanceOverviewChart />
                </div>
                <RankingCard />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CompetitorAlertCard
                  competitorHandle={competitors[0]?.handle || "@top_competitor"}
                  followerGain="5.2%"
                  strategy="short hooks (under 15s)"
                  theirDuration={`${competitors[0]?.metrics.avgVideoDuration || 12}s`}
                  yourDuration={`${mainAccount?.metrics.avgVideoDuration || 28}s`}
                  topHookPatterns={["Question (32%)", "Shock (28%)", "Emotional (24%)"]}
                  potentialViewsIncrease="+12%"
                  onRegenerateHooks={() => console.log("Regenerate hooks")}
                />

                <EngagementGapCard
                  userER={mainAccount?.metrics.engagementRate || 4.2}
                  competitorAvgER={5.5}
                  topPerformerER={competitors[0]?.metrics.engagementRate || 6.8}
                  gapPercent="38%"
                  platformRecommendation="Your TikTok ER (8.1%) exceeds Instagram (4.2%) by 93%. Platform mismatch: underposting on strongest channel."
                  onViewBreakdown={() => console.log("View breakdown")}
                />
              </div>

              <PostingRhythmTable />
            </TabsContent>

            {/* Platforms Tab */}
            <TabsContent value="platforms" className="space-y-6">
              <PlatformEngagementChart />
              <PlatformStatsDashboard />
              <EngagementByPlatformChart />
            </TabsContent>

            {/* Bloggers Tab */}
            <TabsContent value="bloggers" className="space-y-6">
              <BloggerStatsTable />
            </TabsContent>

            {/* Videos Tab */}
            <TabsContent value="videos" className="space-y-6">
              <VideoStatsTable />
            </TabsContent>

            {/* Timing Tab */}
            <TabsContent value="timing" className="space-y-6">
              <OptimalTimesHeatmap />
              <EngagementHeatmap />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default AIInsights;
