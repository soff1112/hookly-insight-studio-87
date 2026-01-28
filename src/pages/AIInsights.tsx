import { useState } from "react";
import { Link } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { CompetitorPerformanceChart } from "@/components/CompetitorPerformanceChart";
import { EngagementByPlatformChart } from "@/components/EngagementByPlatformChart";
import { PostingRhythmTable } from "@/components/PostingRhythmTable";
import { BloggerStatisticsChart } from "@/components/BloggerStatisticsChart";
import { AIInsightCard } from "@/components/AIInsightCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Sparkles, 
  TrendingUp, 
  AlertCircle, 
  Target,
  BarChart3,
  Clock,
  Zap,
  ArrowRight,
  Users,
  Video,
  Layers
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

// Enhanced analytics data
const pieData = [
  { name: "You", value: 4.2 },
  { name: "Competitor Avg", value: 5.5 },
  { name: "Top Performer", value: 6.8 }
];

const COLORS = ["hsl(163 82% 36%)", "hsl(var(--muted-foreground))", "hsl(var(--primary))"];

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
  const [activeTab, setActiveTab] = useState("analytics");

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
        <div className="max-w-[1600px] mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">AI Insights</h1>
              <p className="text-muted-foreground">
                Deep competitive intelligence • Enterprise-grade analytics • AI-powered strategic interpretation
              </p>
              <div className="flex items-center gap-2 text-sm">
                <Badge variant="secondary" className="bg-accent/10 text-accent-foreground">
                  8 competitors tracked
                </Badge>
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  4 projects active
                </Badge>
                <Badge variant="outline">Pro Plan</Badge>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search insights..." 
                  className="pl-10 w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                {timePeriods.map((period) => (
                  <Button
                    key={period}
                    variant={timePeriod === period ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTimePeriod(period)}
                  >
                    {period}
                  </Button>
                ))}
              </div>

              <Button variant="outline" size="sm" className="gap-2">
                <Sparkles className="w-4 h-4" />
                Regenerate Tip
              </Button>
            </div>
          </div>

          {/* Tabs for different views */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
              <TabsTrigger value="analytics" className="gap-2">
                <BarChart3 className="w-4 h-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="bloggers" className="gap-2">
                <Users className="w-4 h-4" />
                Blogger Stats
              </TabsTrigger>
            </TabsList>

            {/* Blogger Statistics Tab */}
            <TabsContent value="bloggers" className="space-y-6">
              <BloggerStatisticsChart />
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics">
              {/* Two-Column Layout */}
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
                  {/* Insight Cards */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <Zap className="w-5 h-5 text-primary" />
                      Key Insights
                    </h3>

                <AIInsightCard
                  icon={TrendingUp}
                  title="🚀 Competitor Growth Alert"
                  variant="default"
                  methodology={{
                    metric: "Competitor Growth Analysis",
                    formula: "Follower Growth = (End - Start) ÷ Start × 100%",
                    interpretation: "Identifies competitor tactics driving faster growth for replication."
                  }}
                  impactScore={{ value: "+12%", label: "Potential" }}
                  content={
                    <>
                      <p>
                        <strong>@topcompetitor</strong> gained <strong>5.2% followers</strong> this week via short hooks (under 15s). 
                      </p>
                      <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                        <div className="bg-muted/50 rounded p-2">
                          <div className="text-muted-foreground">Their avg duration</div>
                          <div className="font-semibold text-foreground">12.4s</div>
                        </div>
                        <div className="bg-muted/50 rounded p-2">
                          <div className="text-muted-foreground">Your avg duration</div>
                          <div className="font-semibold text-destructive">28.2s</div>
                        </div>
                      </div>
                      <p className="pt-2 text-xs">
                        <strong>Why it matters:</strong> Shorter hooks (under 15s) have 2.3× higher completion rates, driving algorithm distribution.
                      </p>
                      <div className="pt-2 text-xs text-primary">
                        → Top 3 hook patterns: Question (32%), Shock (28%), Emotional (24%)
                      </div>
                    </>
                  }
                  actionLabel="🎬 Generate Short-Form Hooks"
                  onAction={() => console.log("Navigate to In Work")}
                />

                <AIInsightCard
                  icon={BarChart3}
                  title="📊 Engagement Gap Analysis"
                  variant="warning"
                  methodology={{
                    metric: "Engagement Rate Comparison",
                    formula: "ER = (Likes + Comments + Shares) ÷ Views × 100%",
                    interpretation: "3-6% = good, 6%+ = excellent. Gap indicates optimization opportunity."
                  }}
                  impactScore={{ value: "38%", label: "Gap" }}
                  content={
                    <>
                      <ResponsiveContainer width="100%" height={120}>
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={30}
                            outerRadius={50}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'hsl(var(--card))',
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px',
                              fontSize: '12px'
                            }}
                            formatter={(value: number) => [`${value}%`, 'ER']}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="grid grid-cols-3 gap-2 text-xs text-center">
                        <div>
                          <div className="font-semibold text-foreground">4.2%</div>
                          <div className="text-muted-foreground">You</div>
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">5.5%</div>
                          <div className="text-muted-foreground">Competitor Avg</div>
                        </div>
                        <div>
                          <div className="font-semibold text-primary">6.8%</div>
                          <div className="text-muted-foreground">Top Performer</div>
                        </div>
                      </div>
                      <p className="text-xs pt-2">
                        <strong>Diagnosis:</strong> Your TikTok ER (8.1%) exceeds Instagram (4.2%) by 93%. Platform mismatch: underposting on strongest channel.
                      </p>
                    </>
                  }
                  actionLabel="📱 View Platform Breakdown"
                  onAction={() => console.log("Scroll to chart")}
                />

                <AIInsightCard
                  icon={Video}
                  title="🎯 Video Performance Decay"
                  variant="success"
                  methodology={{
                    metric: "Performance Decay Curve",
                    formula: "First-Hour Views ÷ 24h Views × 100%",
                    interpretation: "Higher first-hour ratio = stronger hook. Top videos: 40-60% in first hour."
                  }}
                  impactScore={{ value: "Top 15%", label: "Rank" }}
                  content={
                    <>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span>Your top 3 videos: 87-92% virality score</span>
                          <Badge variant="secondary" className="bg-accent/10 text-accent-foreground">
                            +15% vs avg
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="bg-muted/50 rounded p-2 text-center">
                            <div className="font-semibold text-foreground">42%</div>
                            <div className="text-muted-foreground">1st hour</div>
                          </div>
                          <div className="bg-muted/50 rounded p-2 text-center">
                            <div className="font-semibold text-foreground">78%</div>
                            <div className="text-muted-foreground">24h total</div>
                          </div>
                          <div className="bg-muted/50 rounded p-2 text-center">
                            <div className="font-semibold text-accent">Strong</div>
                            <div className="text-muted-foreground">Decay curve</div>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs pt-2">
                        <strong>Success pattern:</strong> Educational hooks in fashion niche with emotional storytelling format. Replicate this template.
                      </p>
                    </>
                  }
                  actionLabel="🔍 Analyze Top Videos"
                  onAction={() => console.log("Navigate to Video Analysis")}
                />

                <AIInsightCard
                  icon={Clock}
                  title="⏰ Optimal Posting Windows"
                  variant="default"
                  methodology={{
                    metric: "Time-Based ER Analysis",
                    formula: "ER per hour slot averaged across 30 days",
                    interpretation: "Identify high-engagement windows for maximum reach."
                  }}
                  content={
                    <>
                      <p>
                        Competitors with highest ER post during <strong>6-9 PM</strong>. 
                        Your current schedule peaks at <strong>2 PM</strong> — missing prime engagement window.
                      </p>
                      <div className="grid grid-cols-3 gap-2 pt-2 text-xs">
                        <div className="bg-muted rounded p-2 text-center">
                          <div className="font-semibold">6-9 PM</div>
                          <div className="text-muted-foreground">Best ER (8.2%)</div>
                        </div>
                        <div className="bg-muted rounded p-2 text-center">
                          <div className="font-semibold">2 PM</div>
                          <div className="text-muted-foreground">Your Peak (5.1%)</div>
                        </div>
                        <div className="bg-primary/10 rounded p-2 text-center">
                          <div className="font-semibold text-primary">+18%</div>
                          <div className="text-muted-foreground">Potential ER lift</div>
                        </div>
                      </div>
                      <p className="text-xs pt-2 text-primary">
                        → Quick Win: Shift 50% of posts to 6-9 PM for immediate engagement boost.
                      </p>
                    </>
                  }
                />

                <AIInsightCard
                  icon={Users}
                  title="👤 Creator Performance Analysis"
                  variant="default"
                  methodology={{
                    metric: "Creator Contribution Share",
                    formula: "Creator Views ÷ Total Views × 100%",
                    interpretation: "Identify top performers and flag underperformers for optimization."
                  }}
                  content={
                    <>
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                          <span className="font-medium">@yoga_ig</span>
                          <span className="text-accent">32% contribution • 94% consistency</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                          <span className="font-medium">@beauty_tt</span>
                          <span className="text-accent">28% contribution • 88% consistency</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-destructive/10 rounded">
                          <span className="font-medium">@crypto_tt</span>
                          <span className="text-destructive">8% contribution • 62% consistency ⚠️</span>
                        </div>
                      </div>
                      <p className="text-xs pt-2">
                        <strong>Flag:</strong> @crypto_tt shows irregular posting (62% consistency) and declining engagement. Consider content strategy review.
                      </p>
                    </>
                  }
                />

                <AIInsightCard
                  icon={AlertCircle}
                  title="⚠️ Critical: Content Frequency Gap"
                  variant="warning"
                  methodology={{
                    metric: "Posting Frequency Benchmark",
                    formula: "Your Posts/Day ÷ Top Performer Posts/Day × 100%",
                    interpretation: "77% gap = significant competitive disadvantage in algorithm visibility."
                  }}
                  impactScore={{ value: "+25-40%", label: "Expected Lift" }}
                  content={
                    <>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span>You:</span>
                          <span className="font-semibold text-destructive">2.3 posts/day</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Top performers:</span>
                          <span className="font-semibold text-accent">8-10 posts/day</span>
                        </div>
                        <div className="flex items-center justify-between text-primary font-medium">
                          <span>Volume gap:</span>
                          <span>77% below benchmark</span>
                        </div>
                      </div>
                      <div className="pt-2 bg-yellow-500/10 rounded p-2 text-xs space-y-1">
                        <p className="font-medium">📈 Recommendation:</p>
                        <p>Test increasing to 5-6 posts/day for 30 days (achievable 2.5× increase).</p>
                        <p className="text-muted-foreground">Expected impact: +25-40% reach, +15% follower growth rate.</p>
                      </div>
                    </>
                  }
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

                  <div className="space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-accent" />
                      SWOT Analysis (Strengths, Weaknesses, Opportunities, Threats)
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-accent" />
                      90-Day Action Plan with A/B test variants
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-accent" />
                      ChatGPT-style follow-up conversations
                    </div>
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

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 text-xs">
                    📄 Export All Data
                  </Button>
                  <Button variant="outline" className="flex-1 text-xs">
                    📊 API Access →
                  </Button>
                  </div>
                </div>
              </div>
            </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default AIInsights;
