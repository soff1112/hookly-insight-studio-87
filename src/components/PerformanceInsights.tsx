import { Brain, TrendingUp, Target, Sparkles, Users, FileText, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardCard } from "@/components/DashboardCard";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

type Period = "24h" | "48h" | "7d" | "14d" | "30d";

const benchmarkData = [
  { name: "You", score: 67 },
  { name: "@topcomp", score: 89 },
  { name: "@rival2", score: 78 },
  { name: "@rival3", score: 72 },
];

const CustomPeriodFilter = ({ activePeriod, onPeriodChange }: { activePeriod: Period; onPeriodChange: (period: Period) => void }) => {
  const periods: { value: Period; label: string }[] = [
    { value: "24h", label: "24h" },
    { value: "48h", label: "48h" },
    { value: "7d", label: "7d" },
    { value: "14d", label: "14d" },
    { value: "30d", label: "30d" },
  ];

  return (
    <div className="flex gap-2">
      {periods.map((period) => (
        <Button
          key={period.value}
          variant={activePeriod === period.value ? "default" : "outline"}
          size="sm"
          onClick={() => onPeriodChange(period.value)}
          className="transition-all duration-300"
        >
          {period.label}
        </Button>
      ))}
    </div>
  );
};

export const PerformanceInsights = () => {
  const [activePeriod, setActivePeriod] = useState<Period>("7d");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">AI Insights</h1>
              <p className="text-sm text-muted-foreground">Deep Competitive & Personal Growth Intelligence</p>
            </div>
          </div>
          <p className="text-muted-foreground max-w-3xl">
            We analyzed your performance and 20 competitors to uncover patterns that drive your growth.
          </p>
        </div>
        
        <CustomPeriodFilter activePeriod={activePeriod} onPeriodChange={setActivePeriod} />
      </div>

      {/* Hookly Intelligence Score */}
      <DashboardCard>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Target className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Hookly Intelligence Score™</h3>
          </div>
          
          <div className="flex items-center justify-between flex-wrap gap-6">
            <div className="flex-1 min-w-[250px]">
              <div className="flex items-end gap-2 mb-2">
                <span className="text-5xl font-bold text-primary">87</span>
                <span className="text-muted-foreground text-lg mb-1">/100</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Based on growth speed, engagement quality, hook diversity, and emotional structure.
              </p>
              <div className="flex items-center gap-2 text-sm">
                <Badge variant="secondary" className="bg-green-500/10 text-green-600 hover:bg-green-500/20">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Top 18%
                </Badge>
                <span className="text-muted-foreground">of creators in your niche</span>
              </div>
            </div>
            
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="none" className="text-muted/20" />
                <circle 
                  cx="64" 
                  cy="64" 
                  r="56" 
                  stroke="currentColor" 
                  strokeWidth="8" 
                  fill="none" 
                  strokeDasharray={`${87 * 3.51} 351`} 
                  className="text-primary transition-all duration-1000" 
                  strokeLinecap="round" 
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-foreground">87%</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground mb-3">
              Your content intelligence is rising. Keep refining your hook structure and posting rhythm.
            </p>
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              View Breakdown
            </Button>
          </div>
        </div>
      </DashboardCard>

      {/* Benchmark AI */}
      <DashboardCard>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Benchmark AI</h3>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Comparative analytics vs 20 competitors
          </p>

          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={benchmarkData}>
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="score" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 space-y-2">
            <p className="text-sm text-foreground">
              <strong>Summary Insight:</strong> You outperform 45% of your competitors in engagement but post 3× less often. Increasing output could move you up the ranking.
            </p>
          </div>

          <Button variant="outline" size="sm" className="w-full">
            View Detailed Benchmark
          </Button>
        </div>
      </DashboardCard>

      {/* Predictive Virality Engine */}
      <DashboardCard>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Predictive Virality Engine</h3>
          </div>
          
          <div className="bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-lg p-6 space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Next Best Format</p>
              <p className="text-lg font-semibold text-foreground">
                Emotional storytelling under 15 seconds
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Virality Probability</span>
                <span className="font-semibold text-green-600">+19%</span>
              </div>
              <Progress value={19} className="h-2" />
            </div>

            <p className="text-xs text-muted-foreground">
              Based on your last 10 Reels and current trending patterns
            </p>
          </div>
        </div>
      </DashboardCard>

      {/* Content Frequency Benchmark */}
      <DashboardCard>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Content Frequency Benchmark</h3>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Compares your posting rhythm vs. niche average and top 20 creators
          </p>

          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">You</span>
                <span className="font-semibold text-foreground">1.0 posts/day</span>
              </div>
              <Progress value={10} className="h-3" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Niche Average</span>
                <span className="font-semibold text-foreground">5.2 posts/day</span>
              </div>
              <Progress value={52} className="h-3 [&>div]:bg-muted-foreground" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Top Creators</span>
                <span className="font-semibold text-foreground">8-10 posts/day</span>
              </div>
              <Progress value={90} className="h-3 [&>div]:bg-primary" />
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 space-y-2">
            <p className="text-sm text-foreground">
              Top creators in your niche post 8–10 videos per day. You currently post 1/day. Try testing a higher posting cadence for faster growth.
            </p>
            <div className="mt-3">
              <Badge variant="secondary" className="text-xs">Consistency Score: 67%</Badge>
            </div>
          </div>
        </div>
      </DashboardCard>

      {/* Audience Persona AI Summary */}
      <DashboardCard>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Audience Persona AI Summary</h3>
          </div>
          
          <p className="text-sm text-muted-foreground">
            AI-generated summary of your audience profile
          </p>

          <div className="flex items-start gap-4 bg-muted/30 rounded-lg p-5">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="bg-primary/10 text-primary text-2xl">👥</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-3">
              <p className="text-sm text-foreground leading-relaxed">
                Your audience consists mostly of <strong>aspiring female entrepreneurs (22–34)</strong> interested in digital lifestyle, emotional storytelling, and authentic branding.
              </p>
              
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-primary/10 text-primary">Growth-Oriented</Badge>
                <Badge variant="secondary" className="bg-primary/10 text-primary">Curious</Badge>
                <Badge variant="secondary" className="bg-primary/10 text-primary">Authentic</Badge>
              </div>
            </div>
          </div>
        </div>
      </DashboardCard>

      {/* Learning Mode - Strategy Generator */}
      <DashboardCard>
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Brain className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Learning Mode</h3>
          </div>
          
          <div className="bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-lg p-6 space-y-4">
            <p className="text-foreground leading-relaxed">
              AI analyzed your content tone, rhythm, and audience response. Let's build a growth strategy tailored to your brand.
            </p>
            
            <p className="text-sm text-muted-foreground">
              Your content intelligence is rising. Keep refining your hook structure and posting rhythm based on competitive insights.
            </p>
          </div>

          <Button size="lg" className="w-full bg-primary hover:bg-primary/90 gap-2 group">
            <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            Develop Marketing Strategy
          </Button>
        </div>
      </DashboardCard>

      {/* Main Insights Report Preview */}
      <DashboardCard>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Marketing Intelligence Summary</h3>
          </div>
          
          <p className="text-sm text-muted-foreground">Based on 20 Accounts</p>
          
          <div className="space-y-4">
            <div className="bg-muted/30 rounded-lg p-5 space-y-3">
              <p className="text-sm text-foreground">
                <strong>Sofiia Danileyko</strong>, we analyzed your account along with 20 competitors.
              </p>
              
              <p className="text-sm text-muted-foreground leading-relaxed">
                The average posting rate is 5 posts/day — you currently post 1/day. We recommend increasing your post frequency and adding more storytelling formats.
              </p>
              
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your content already outperforms @viralcreator in audience retention — keep focusing on emotional contrast.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-5">
              <p className="text-sm font-semibold text-foreground mb-2">
                Main Insight
              </p>
              <p className="text-sm text-foreground">
                In the last 5 days, your engagement improved significantly. You're now outperforming 3 of your top competitors.
              </p>
            </div>
          </div>
        </div>
      </DashboardCard>

      {/* Final CTA */}
      <div className="pt-8 pb-4">
        <div className="text-center space-y-4">
          <Button 
            size="lg" 
            className="w-full max-w-2xl mx-auto bg-primary hover:bg-primary/90 text-lg h-16 gap-3 group shadow-lg hover:shadow-xl transition-all"
          >
            <Sparkles className="w-6 h-6 group-hover:scale-110 transition-transform" />
            Generate Marketing Analysis
          </Button>
          
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            AI will analyze your account and 20 competitors to create a personalized marketing research report.
          </p>
        </div>
      </div>
    </div>
  );
};
