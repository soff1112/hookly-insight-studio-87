import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { DashboardCard } from "@/components/DashboardCard";
import { TrendingUp, Info, Users, Eye, Heart, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Enhanced mock data with comprehensive metrics
const mockData = [
  { date: "Oct 09", avgLikes: 12.5, avgViews: 245, followers: 22.8, avgComments: 3.2, avgShares: 1.8 },
  { date: "Oct 10", avgLikes: 14.2, avgViews: 268, followers: 23.2, avgComments: 3.8, avgShares: 2.1 },
  { date: "Oct 11", avgLikes: 13.8, avgViews: 256, followers: 23.5, avgComments: 3.5, avgShares: 1.9 },
  { date: "Oct 12", avgLikes: 15.4, avgViews: 289, followers: 23.9, avgComments: 4.1, avgShares: 2.4 },
  { date: "Oct 13", avgLikes: 16.1, avgViews: 302, followers: 24.0, avgComments: 4.3, avgShares: 2.6 },
  { date: "Oct 14", avgLikes: 17.8, avgViews: 325, followers: 24.3, avgComments: 4.8, avgShares: 2.9 },
  { date: "Oct 15", avgLikes: 18.2, avgViews: 334, followers: 24.6, avgComments: 5.1, avgShares: 3.2 },
];

// Aggregated competitor metrics
const aggregatedMetrics = {
  you: {
    avgViewsPerPost: 287,
    avgLikesPerPost: 15.4,
    avgCommentsPerPost: 4.1,
    engagementRate: 4.2,
    followerGrowthRate: 2.8,
    rank: 4,
    totalCompetitors: 9,
  },
  topCompetitor: {
    avgViewsPerPost: 412,
    avgLikesPerPost: 28.6,
    avgCommentsPerPost: 8.2,
    engagementRate: 6.8,
    followerGrowthRate: 5.2,
  },
  competitorAvg: {
    avgViewsPerPost: 345,
    avgLikesPerPost: 21.2,
    avgCommentsPerPost: 5.8,
    engagementRate: 5.5,
    followerGrowthRate: 3.9,
  }
};

// Calculate percentage differences
const calcDiff = (you: number, them: number) => {
  const diff = ((you - them) / them) * 100;
  return diff.toFixed(1);
};

const MetricTooltip = ({ title, formula, interpretation }: { title: string; formula: string; interpretation: string }) => (
  <TooltipProvider>
    <UITooltip>
      <TooltipTrigger>
        <Info className="w-3.5 h-3.5 text-muted-foreground hover:text-primary transition-colors" />
      </TooltipTrigger>
      <TooltipContent className="max-w-[280px] p-3 space-y-2">
        <p className="font-semibold text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground"><strong>Formula:</strong> {formula}</p>
        <p className="text-xs text-muted-foreground"><strong>How to interpret:</strong> {interpretation}</p>
      </TooltipContent>
    </UITooltip>
  </TooltipProvider>
);

export const CompetitorPerformanceChart = () => {
  const [hiddenLines, setHiddenLines] = useState<string[]>([]);

  const toggleLine = (dataKey: string) => {
    setHiddenLines(prev => 
      prev.includes(dataKey) 
        ? prev.filter(k => k !== dataKey)
        : [...prev, dataKey]
    );
  };

  const viewsDiff = calcDiff(aggregatedMetrics.you.avgViewsPerPost, aggregatedMetrics.topCompetitor.avgViewsPerPost);
  const erDiff = calcDiff(aggregatedMetrics.you.engagementRate, aggregatedMetrics.topCompetitor.engagementRate);
  const growthDiff = calcDiff(aggregatedMetrics.you.followerGrowthRate, aggregatedMetrics.topCompetitor.followerGrowthRate);

  return (
    <DashboardCard>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Competitor Performance Overview</h3>
            <MetricTooltip 
              title="Aggregated Performance Metrics"
              formula="Data aggregated from your account + 8 tracked competitors across Instagram, TikTok, YouTube"
              interpretation="Higher values indicate stronger content performance. Compare your metrics against top performers to identify growth opportunities."
            />
          </div>
          <Badge variant="outline" className="text-xs">
            You: #{aggregatedMetrics.you.rank} of {aggregatedMetrics.you.totalCompetitors}
          </Badge>
        </div>

        <p className="text-sm text-muted-foreground">
          Aggregated metrics from {aggregatedMetrics.you.totalCompetitors - 1} tracked competitors + your account • Last 7 days
        </p>

        {/* Key Metrics Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-muted/30 rounded-lg p-3 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Eye className="w-3 h-3" />
              Avg Views/Post
              <MetricTooltip 
                title="Average Views per Post"
                formula="Total Views ÷ Number of Posts"
                interpretation="Measures content reach. Higher = better discoverability."
              />
            </div>
            <div className="text-lg font-semibold text-foreground">{aggregatedMetrics.you.avgViewsPerPost}</div>
            <div className={`text-xs ${Number(viewsDiff) >= 0 ? 'text-accent' : 'text-destructive'}`}>
              {viewsDiff}% vs top
            </div>
          </div>
          
          <div className="bg-muted/30 rounded-lg p-3 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Heart className="w-3 h-3" />
              Avg Likes/Post
              <MetricTooltip 
                title="Average Likes per Post"
                formula="Total Likes ÷ Number of Posts"
                interpretation="Measures audience approval. Correlates with algorithm favorability."
              />
            </div>
            <div className="text-lg font-semibold text-foreground">{aggregatedMetrics.you.avgLikesPerPost}</div>
            <div className="text-xs text-destructive">
              {calcDiff(aggregatedMetrics.you.avgLikesPerPost, aggregatedMetrics.topCompetitor.avgLikesPerPost)}% vs top
            </div>
          </div>
          
          <div className="bg-muted/30 rounded-lg p-3 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MessageCircle className="w-3 h-3" />
              Engagement Rate
              <MetricTooltip 
                title="Engagement Rate (ER)"
                formula="(Likes + Comments + Shares) ÷ Views × 100%"
                interpretation="Core metric for content quality. Industry benchmark: 3-6% good, 6%+ excellent."
              />
            </div>
            <div className="text-lg font-semibold text-foreground">{aggregatedMetrics.you.engagementRate}%</div>
            <div className="text-xs text-destructive">
              {erDiff}% vs top ({aggregatedMetrics.topCompetitor.engagementRate}%)
            </div>
          </div>
          
          <div className="bg-muted/30 rounded-lg p-3 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Users className="w-3 h-3" />
              Growth Rate
              <MetricTooltip 
                title="Follower Growth Rate"
                formula="(Followers_end − Followers_start) ÷ Followers_start × 100%"
                interpretation="Measures account momentum. Positive = growing audience, compare weekly for trends."
              />
            </div>
            <div className="text-lg font-semibold text-foreground">+{aggregatedMetrics.you.followerGrowthRate}%</div>
            <div className="text-xs text-destructive">
              {growthDiff}% vs top (+{aggregatedMetrics.topCompetitor.followerGrowthRate}%)
            </div>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={mockData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--primary) / 0.1)" />
            <XAxis 
              dataKey="date" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              yAxisId="left"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              label={{ value: 'Followers (K)', angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: 'hsl(var(--muted-foreground))' } }}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              label={{ value: 'Engagement', angle: 90, position: 'insideRight', style: { fontSize: 12, fill: 'hsl(var(--muted-foreground))' } }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px'
              }}
              formatter={(value: number, name: string) => {
                const labels: Record<string, string> = {
                  avgLikes: 'Avg Likes/Post',
                  avgViews: 'Avg Views/Post',
                  followers: 'Total Followers (K)',
                  avgComments: 'Avg Comments/Post',
                  avgShares: 'Avg Shares/Post'
                };
                return [`${value}${name === 'followers' ? 'K' : ''}`, labels[name] || name];
              }}
            />
            <Legend 
              onClick={(e) => toggleLine(e.dataKey as string)}
              wrapperStyle={{ cursor: 'pointer', paddingTop: '10px' }}
              formatter={(value: string) => {
                const labels: Record<string, string> = {
                  avgLikes: '❤️ Avg Likes/Post',
                  avgViews: '👁️ Avg Views/Post',
                  followers: '📈 Follower Growth',
                  avgComments: '💬 Avg Comments/Post',
                  avgShares: '🔄 Avg Shares/Post'
                };
                return <span className={hiddenLines.includes(value) ? 'opacity-40' : ''}>{labels[value] || value}</span>;
              }}
            />
            {!hiddenLines.includes('avgLikes') && (
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="avgLikes" 
                stroke="hsl(163 82% 36%)" 
                strokeWidth={2}
                dot={{ fill: 'hsl(163 82% 36%)', r: 4 }}
                activeDot={{ r: 6 }}
              />
            )}
            {!hiddenLines.includes('avgViews') && (
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="avgViews" 
                stroke="hsl(210 100% 50%)" 
                strokeWidth={2}
                dot={{ fill: 'hsl(210 100% 50%)', r: 4 }}
                activeDot={{ r: 6 }}
              />
            )}
            {!hiddenLines.includes('followers') && (
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="followers" 
                stroke="hsl(45 93% 47%)" 
                strokeWidth={2}
                dot={{ fill: 'hsl(45 93% 47%)', r: 4 }}
                activeDot={{ r: 6 }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>

        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-2">
          <p className="text-sm font-semibold text-foreground">
            💡 Strategy Insight: Opportunity Size Analysis
          </p>
          <p className="text-sm text-foreground">
            You're <strong>#{aggregatedMetrics.you.rank} of {aggregatedMetrics.you.totalCompetitors}</strong> — just 3 positions from top tier. 
            Closing the <strong>{Math.abs(Number(viewsDiff))}% views gap</strong> requires matching competitor hook patterns (Question + Shock styles). 
            Your growth rate (+{aggregatedMetrics.you.followerGrowthRate}%) is <strong>{Math.abs(Number(growthDiff))}% below</strong> top performer (+{aggregatedMetrics.topCompetitor.followerGrowthRate}%).
          </p>
          <p className="text-xs text-muted-foreground">
            <strong>Why the gap exists:</strong> Top competitor uses 15s hooks with emotional triggers, posts 3× more frequently, and optimizes for 6-9 PM posting windows.
          </p>
          <p className="text-xs text-primary font-medium">
            → Quick Win: Adopt competitor-style hooks to unlock potential +18% views in 14 days.
          </p>
        </div>
      </div>
    </DashboardCard>
  );
};
