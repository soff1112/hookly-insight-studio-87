import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { DashboardCard } from "@/components/DashboardCard";
import { BarChart3, Info, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Enhanced mock data with comprehensive platform metrics
const mockData = [
  { 
    name: "Instagram", 
    user: 4.2, 
    topcompetitor: 6.8, 
    platformAvg: 5.1,
    userViews: 12000,
    userPosts: 2.1,
    competitorPosts: 4.5,
    trend7d: -0.3,
    trend14d: 0.8,
    trend30d: 1.2,
  },
  { 
    name: "TikTok", 
    user: 8.1, 
    topcompetitor: 12.1, 
    platformAvg: 7.8,
    userViews: 45000,
    userPosts: 1.8,
    competitorPosts: 8.2,
    trend7d: 1.2,
    trend14d: 2.1,
    trend30d: 3.5,
  },
  { 
    name: "YouTube", 
    user: 3.5, 
    topcompetitor: 8.2, 
    platformAvg: 4.8,
    userViews: 89000,
    userPosts: 0.4,
    competitorPosts: 1.2,
    trend7d: -0.8,
    trend14d: -0.2,
    trend30d: 0.5,
  },
];

const platformColors: Record<string, string> = {
  Instagram: "hsl(var(--primary))",
  TikTok: "hsl(240 10% 10%)",
  YouTube: "hsl(0 84% 60%)"
};

type RollingPeriod = "7d" | "14d" | "30d";

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

const TrendIndicator = ({ value }: { value: number }) => {
  if (value > 0) return <TrendingUp className="w-3 h-3 text-accent" />;
  if (value < 0) return <TrendingDown className="w-3 h-3 text-destructive" />;
  return <Minus className="w-3 h-3 text-muted-foreground" />;
};

export const EngagementByPlatformChart = () => {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [rollingPeriod, setRollingPeriod] = useState<RollingPeriod>("7d");

  const sortedData = [...mockData].sort((a, b) => {
    const sumA = a.user + a.topcompetitor + a.platformAvg;
    const sumB = b.user + b.topcompetitor + b.platformAvg;
    return sortOrder === "asc" ? sumA - sumB : sumB - sumA;
  });

  const toggleSort = () => {
    setSortOrder(prev => prev === "asc" ? "desc" : "asc");
  };

  // Calculate insights
  const strongestPlatform = [...mockData].sort((a, b) => (b.user - b.platformAvg) - (a.user - a.platformAvg))[0];
  const weakestPlatform = [...mockData].sort((a, b) => (a.user - a.platformAvg) - (b.user - b.platformAvg))[0];
  const underpostingPlatform = mockData.find(p => p.user > p.platformAvg && p.userPosts < p.competitorPosts);

  const getTrendValue = (platform: typeof mockData[0]) => {
    switch (rollingPeriod) {
      case "7d": return platform.trend7d;
      case "14d": return platform.trend14d;
      case "30d": return platform.trend30d;
    }
  };

  return (
    <DashboardCard>
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Engagement Trends by Platform</h3>
            <MetricTooltip 
              title="Platform-Specific Engagement Analysis"
              formula="ER% = (Likes + Comments + Shares) ÷ Views × 100"
              interpretation="Compare your ER against top competitor and platform average. Gap indicates optimization potential."
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {(["7d", "14d", "30d"] as RollingPeriod[]).map((period) => (
                <Button
                  key={period}
                  variant={rollingPeriod === period ? "default" : "outline"}
                  size="sm"
                  className="text-xs h-7 px-2"
                  onClick={() => setRollingPeriod(period)}
                >
                  {period}
                </Button>
              ))}
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={toggleSort}
              className="text-xs h-7"
            >
              Sort {sortOrder === "asc" ? "↑" : "↓"}
            </Button>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          Engagement Rate % — You vs Top Competitor vs Platform Average • Rolling {rollingPeriod} averages
        </p>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={sortedData} layout="vertical" margin={{ left: 0, right: 30 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--primary) / 0.1)" />
            <XAxis 
              type="number"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              label={{ value: 'Engagement Rate (%)', position: 'insideBottom', offset: -5, style: { fontSize: 12, fill: 'hsl(var(--muted-foreground))' } }}
            />
            <YAxis 
              type="category"
              dataKey="name" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              width={80}
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
                  user: 'You',
                  topcompetitor: 'Top Competitor',
                  platformAvg: 'Platform Average'
                };
                return [`${value}%`, labels[name] || name];
              }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }}
              formatter={(value: string) => {
                const labels: Record<string, string> = {
                  user: '🟢 You',
                  topcompetitor: '🔵 Top Competitor',
                  platformAvg: '⚪ Platform Avg'
                };
                return labels[value] || value;
              }}
            />
            <Bar dataKey="user" fill="hsl(163 82% 36%)" radius={[0, 4, 4, 0]} />
            <Bar dataKey="topcompetitor" fill="hsl(210 100% 50%)" radius={[0, 4, 4, 0]} />
            <Bar dataKey="platformAvg" fill="hsl(var(--muted-foreground))" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>

        {/* Enhanced Platform Cards with Trends */}
        <div className="grid grid-cols-3 gap-3 text-xs">
          {sortedData.map((platform) => {
            const trendValue = getTrendValue(platform);
            const erGap = ((platform.topcompetitor - platform.user) / platform.user * 100).toFixed(0);
            const postGap = ((platform.competitorPosts - platform.userPosts) / platform.userPosts * 100).toFixed(0);
            
            return (
              <div 
                key={platform.name}
                className="bg-muted/30 rounded-lg p-3 space-y-2 cursor-pointer hover:bg-muted/50 transition-colors"
              >
                <div className="font-semibold text-foreground flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: platformColors[platform.name] }}
                    />
                    {platform.name}
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendIndicator value={trendValue} />
                    <span className={trendValue >= 0 ? 'text-accent' : 'text-destructive'}>
                      {trendValue > 0 ? '+' : ''}{trendValue}%
                    </span>
                  </div>
                </div>
                <div className="text-muted-foreground">{platform.userViews.toLocaleString()} views</div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Your ER:</span>
                    <span className="font-medium">{platform.user}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Posts/day:</span>
                    <span className="font-medium">{platform.userPosts}</span>
                  </div>
                  <div className="flex justify-between text-destructive">
                    <span>ER Gap:</span>
                    <span>-{erGap}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* AI Interpretation */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-2">
          <p className="text-sm font-semibold text-foreground">
            💡 Platform Performance Analysis
          </p>
          <div className="space-y-2 text-sm text-foreground">
            <p>
              <strong>Strongest:</strong> {strongestPlatform.name} — your ER ({strongestPlatform.user}%) is{' '}
              {strongestPlatform.user > strongestPlatform.platformAvg ? 'above' : 'below'} platform average ({strongestPlatform.platformAvg}%).
            </p>
            <p>
              <strong>Weakest:</strong> {weakestPlatform.name} — {((weakestPlatform.topcompetitor - weakestPlatform.user) / weakestPlatform.user * 100).toFixed(0)}% below top competitor.
            </p>
            {underpostingPlatform && (
              <p className="text-primary">
                <strong>⚠️ Mismatch detected:</strong> {underpostingPlatform.name} shows high ER ({underpostingPlatform.user}%) but low volume ({underpostingPlatform.userPosts}/day vs competitor's {underpostingPlatform.competitorPosts}/day) = underposting opportunity.
              </p>
            )}
          </div>
          <p className="text-xs text-muted-foreground pt-1">
            <strong>Action:</strong> Increase {underpostingPlatform?.name || 'TikTok'} posting frequency to {(underpostingPlatform?.competitorPosts || 5).toFixed(1)}/day to capture untapped engagement potential.
          </p>
        </div>
      </div>
    </DashboardCard>
  );
};