import { useState } from "react";
import { Link } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { CompetitorPerformanceChart } from "@/components/CompetitorPerformanceChart";
import { EngagementByPlatformChart } from "@/components/EngagementByPlatformChart";
import { PostingRhythmTable } from "@/components/PostingRhythmTable";
import { AIInsightCard } from "@/components/AIInsightCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Sparkles, 
  TrendingUp, 
  AlertCircle, 
  Target,
  BarChart3,
  Clock,
  Zap,
  ArrowRight
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const pieData = [
  { name: "You", value: 4.2 },
  { name: "Competitors", value: 6.8 }
];

const COLORS = ["hsl(163 82% 36%)", "hsl(var(--primary))"];

const AIInsights = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [timePeriod, setTimePeriod] = useState("7D");

  const timePeriods = ["1D", "2D", "3D", "7D", "All"];

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
                Deep competitive intelligence • 5-10 tracked accounts • Personalized strategy generation
              </p>
              <div className="flex items-center gap-2 text-sm">
                <Badge variant="secondary" className="bg-accent/10 text-accent-foreground">
                  0 accounts connected
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

          {/* Two-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Left Column - Analytics (60%) */}
            <div className="lg:col-span-3 space-y-6">
              <CompetitorPerformanceChart />
              <EngagementByPlatformChart />
              <PostingRhythmTable />
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
                  title="🚀 Top Competitor Alert"
                  variant="default"
                  content={
                    <>
                      <p>
                        <strong>@topcompetitor</strong> gained 5.2% followers via short hooks (under 15s). 
                        Your avg duration: <strong>28s</strong>—shorten for +12% views.
                      </p>
                      <div className="pt-2 text-xs text-primary">
                        → Top 3 hook patterns: Question, Shock, Emotional
                      </div>
                    </>
                  }
                  actionLabel="🎬 Regenerate Hooks"
                  onAction={() => console.log("Navigate to In Work")}
                />

                <AIInsightCard
                  icon={BarChart3}
                  title="📊 Engagement Gap Analysis"
                  variant="warning"
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
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <p className="text-center">
                        Your ER: <strong>4.2%</strong> vs Avg: <strong>6.8%</strong>
                      </p>
                      <p className="text-xs">
                        Post more on TikTok (competitors avg 12.1% ER for 33% higher engagement).
                      </p>
                    </>
                  }
                  actionLabel="📱 View Platform Breakdown"
                  onAction={() => console.log("Scroll to chart")}
                />

                <AIInsightCard
                  icon={Target}
                  title="🎯 Virality Trends"
                  variant="success"
                  content={
                    <>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span>Top videos: 87-92% virality</span>
                          <Badge variant="secondary" className="bg-accent/10 text-accent-foreground">
                            +15% avg
                          </Badge>
                        </div>
                        <div className="flex gap-2 overflow-x-auto">
                          {[1, 2, 3].map((i) => (
                            <div 
                              key={i}
                              className="min-w-[80px] h-20 bg-muted rounded-md flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                            >
                              <span className="text-xs text-muted-foreground">Video {i}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <p className="text-xs pt-2">
                        Replicate: <strong>Educational hooks</strong> in fashion niche with emotional storytelling format.
                      </p>
                    </>
                  }
                  actionLabel="🔍 Analyze Videos"
                  onAction={() => console.log("Navigate to Video Analysis")}
                />

                <AIInsightCard
                  icon={Clock}
                  title="⏰ Optimal Posting Times"
                  variant="default"
                  content={
                    <>
                      <p>
                        Competitors with highest ER post during <strong>6-9 PM</strong>. 
                        Your current schedule peaks at <strong>2 PM</strong>.
                      </p>
                      <div className="grid grid-cols-3 gap-2 pt-2 text-xs">
                        <div className="bg-muted rounded p-2 text-center">
                          <div className="font-semibold">6-9 PM</div>
                          <div className="text-muted-foreground">Best ER</div>
                        </div>
                        <div className="bg-muted rounded p-2 text-center">
                          <div className="font-semibold">2 PM</div>
                          <div className="text-muted-foreground">Your Peak</div>
                        </div>
                        <div className="bg-primary/10 rounded p-2 text-center">
                          <div className="font-semibold text-primary">+18%</div>
                          <div className="text-muted-foreground">Potential</div>
                        </div>
                      </div>
                    </>
                  }
                />

                <AIInsightCard
                  icon={AlertCircle}
                  title="⚠️ Quick Win: Content Frequency"
                  variant="warning"
                  content={
                    <>
                      <p>
                        You post <strong>2.3/day</strong> vs top performers' <strong>8-10/day</strong> (77% gap). 
                        Test increasing to 5/day for 30 days.
                      </p>
                      <div className="pt-2 bg-yellow-500/10 rounded p-2 text-xs">
                        📈 Expected impact: +25-40% reach in first month
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
                    📄 Export Data
                  </Button>
                  <Button variant="outline" className="flex-1 text-xs">
                    📊 Deep Analysis →
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AIInsights;
