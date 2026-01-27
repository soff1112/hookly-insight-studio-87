import { useState } from "react";
import { Link } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { CompetitorPerformanceChart } from "@/components/CompetitorPerformanceChart";
import { EngagementByPlatformChart } from "@/components/EngagementByPlatformChart";
import { PostingRhythmTable } from "@/components/PostingRhythmTable";
import { PlatformStatsDashboard } from "@/components/analytics/PlatformStatsDashboard";
import { BloggerStatsTable } from "@/components/analytics/BloggerStatsTable";
import { VideoStatsTable } from "@/components/analytics/VideoStatsTable";
import { EngagementHeatmap } from "@/components/analytics/EngagementHeatmap";
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
  Download
} from "lucide-react";

// Project-level analytics mock data
const projectAnalytics = [
  { name: "Yoga Studio", views: 156000, engagement: 8200, er: 5.3, posts: 42, momentum: 12.5 },
  { name: "Crypto Blog", views: 89000, engagement: 3100, er: 3.5, posts: 28, momentum: -2.1 },
  { name: "Beauty Brand", views: 234000, engagement: 15600, er: 6.7, posts: 68, momentum: 18.2 },
  { name: "Fitness Coach", views: 112000, engagement: 7800, er: 7.0, posts: 35, momentum: 8.4 },
];

const AIInsights = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [timePeriod, setTimePeriod] = useState("7D");
  const [activeTab, setActiveTab] = useState("overview");

  const timePeriods = ["1D", "2D", "3D", "7D", "All"];

  // Calculate aggregated metrics
  const totalViews = projectAnalytics.reduce((sum, p) => sum + p.views, 0);
  const avgER = (projectAnalytics.reduce((sum, p) => sum + p.er, 0) / projectAnalytics.length).toFixed(1);
  const topProject = [...projectAnalytics].sort((a, b) => b.momentum - a.momentum)[0];
  const underperformingProject = [...projectAnalytics].sort((a, b) => a.momentum - b.momentum)[0];

  return (
    <div className="flex min-h-screen bg-background w-full">
      <Sidebar />
      
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-[1800px] mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">AI Insights</h1>
              <p className="text-muted-foreground">
                Enterprise-grade analytics • 100+ creators • AI-powered strategic insights
              </p>
              <div className="flex items-center gap-2 text-sm">
                <Badge variant="secondary" className="bg-accent/10 text-accent-foreground">
                  8 competitors tracked
                </Badge>
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  4 projects • 100+ bloggers
                </Badge>
                <Badge variant="outline">Pro Plan</Badge>
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
              
              <div className="flex gap-1">
                {timePeriods.map((period) => (
                  <Button
                    key={period}
                    variant={timePeriod === period ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTimePeriod(period)}
                    className="text-xs"
                  >
                    {period}
                  </Button>
                ))}
              </div>

              <Button variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>

              <Button variant="outline" size="sm" className="gap-2">
                <Sparkles className="w-4 h-4" />
                Regenerate
              </Button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full max-w-[800px] grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="platforms">Platforms</TabsTrigger>
              <TabsTrigger value="bloggers">Bloggers</TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
              <TabsTrigger value="engagement">Engagement</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Left Column - Analytics (60%) */}
                <div className="lg:col-span-3 space-y-6">
                  <CompetitorPerformanceChart />
                  <EngagementByPlatformChart />
                  <PostingRhythmTable />

                  {/* Project-Level Analytics Card */}
                  <div className="p-6 rounded-lg border border-border bg-card shadow-card space-y-4">
                    <div className="flex items-center gap-3">
                      <Layers className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-semibold text-foreground">Project-Level Analytics</h3>
                      <Badge variant="outline" className="text-xs">Cross-Niche Comparison</Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      Aggregated performance across all projects • Normalized by content volume
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div className="bg-muted/30 rounded-lg p-3 space-y-1">
                        <div className="text-xs text-muted-foreground">Total Views</div>
                        <div className="text-lg font-semibold text-foreground">{(totalViews / 1000).toFixed(0)}K</div>
                        <div className="text-xs text-accent">+12.4% vs last period</div>
                      </div>
                      <div className="bg-muted/30 rounded-lg p-3 space-y-1">
                        <div className="text-xs text-muted-foreground">Avg ER Across Projects</div>
                        <div className="text-lg font-semibold text-foreground">{avgER}%</div>
                        <div className="text-xs text-muted-foreground">Industry avg: 4.2%</div>
                      </div>
                      <div className="bg-muted/30 rounded-lg p-3 space-y-1">
                        <div className="text-xs text-muted-foreground">Top Performer</div>
                        <div className="text-lg font-semibold text-foreground">{topProject.name}</div>
                        <div className="text-xs text-accent">+{topProject.momentum}% momentum</div>
                      </div>
                      <div className="bg-muted/30 rounded-lg p-3 space-y-1">
                        <div className="text-xs text-muted-foreground">Needs Attention</div>
                        <div className="text-lg font-semibold text-foreground">{underperformingProject.name}</div>
                        <div className="text-xs text-destructive">{underperformingProject.momentum}% momentum</div>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-2 font-medium text-muted-foreground">Project</th>
                            <th className="text-right py-2 font-medium text-muted-foreground">Views</th>
                            <th className="text-right py-2 font-medium text-muted-foreground">ER %</th>
                            <th className="text-right py-2 font-medium text-muted-foreground">Posts</th>
                            <th className="text-right py-2 font-medium text-muted-foreground">Momentum</th>
                          </tr>
                        </thead>
                        <tbody>
                          {projectAnalytics.map((project) => (
                            <tr key={project.name} className="border-b border-border/50">
                              <td className="py-2 font-medium text-foreground">{project.name}</td>
                              <td className="py-2 text-right text-foreground">{(project.views / 1000).toFixed(0)}K</td>
                              <td className="py-2 text-right text-foreground">{project.er}%</td>
                              <td className="py-2 text-right text-foreground">{project.posts}</td>
                              <td className={`py-2 text-right font-medium ${project.momentum >= 0 ? 'text-accent' : 'text-destructive'}`}>
                                {project.momentum > 0 ? '+' : ''}{project.momentum}%
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-2">
                      <p className="text-sm font-semibold text-foreground">
                        💡 Resource Allocation Insight
                      </p>
                      <p className="text-sm text-foreground">
                        <strong>{topProject.name}</strong> shows +{topProject.momentum}% momentum with highest ER ({topProject.er}%). 
                        Consider reallocating 20% of <strong>{underperformingProject.name}</strong> content effort to capitalize on this outperformance.
                      </p>
                      <p className="text-xs text-muted-foreground">
                        <strong>Niche comparison:</strong> Lifestyle niches (Beauty, Fitness) outperform technical niches (Crypto) by ~40% ER on average.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Column - Insights (40%) */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      Key Insights
                    </h3>

                    <CompetitorAlertCard
                      competitorHandle="@topcompetitor"
                      followerGain="5.2%"
                      strategy="short hooks (under 15s)"
                      theirDuration="12.4s"
                      yourDuration="28.2s"
                      topHookPatterns={["Question (32%)", "Shock (28%)", "Emotional (24%)"]}
                      potentialViewsIncrease="+12%"
                      onRegenerateHooks={() => console.log("Regenerate hooks")}
                    />

                    <EngagementGapCard
                      userER={4.2}
                      competitorAvgER={5.5}
                      topPerformerER={6.8}
                      gapPercent="38%"
                      platformRecommendation="Your TikTok ER (8.1%) exceeds Instagram (4.2%) by 93%. Platform mismatch: underposting on strongest channel."
                      onViewBreakdown={() => console.log("View breakdown")}
                    />

                    <ViralityTrendsCard
                      viralityRange="87-92%"
                      topVideos={[
                        { title: "This stretch changed my life", virality: 92 },
                        { title: "Glass skin routine you NEED", virality: 89 },
                        { title: "Why you're not seeing results", virality: 87 },
                      ]}
                      hookPatternToReplicate="Educational hooks in fashion niche with emotional storytelling format"
                      onAnalyzeVideos={() => console.log("Analyze videos")}
                    />

                    <ContentFrequencyCard
                      userPostsPerDay={2.3}
                      topPerformerRange="8-10"
                      gapPercent="77%"
                      expectedLift="+25-40%"
                    />
                  </div>

                  {/* Generate Strategy CTA */}
                  <div className="sticky top-6 space-y-4">
                    <div className="bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-lg p-6 space-y-4 border border-primary/20">
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-primary" />
                          AI Strategy Workspace
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Generate personalized marketing strategies with SWOT analysis, 90-day action plans, and interactive follow-up conversations.
                        </p>
                      </div>

                      <Button 
                        size="lg" 
                        className="w-full gap-2 group"
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
                </div>
              </div>
            </TabsContent>

            {/* Platforms Tab */}
            <TabsContent value="platforms" className="space-y-6">
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

            {/* Engagement Tab */}
            <TabsContent value="engagement" className="space-y-6">
              <EngagementHeatmap />
              <PostingRhythmTable />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default AIInsights;
