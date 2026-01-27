import { DashboardCard } from "@/components/DashboardCard";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PlatformStats {
  name: string;
  icon: string;
  color: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  followers: number;
  engagementRate: number;
  postsCount: number;
  trend: number;
}

const platformData: PlatformStats[] = [
  {
    name: "TikTok",
    icon: "🎵",
    color: "hsl(240 10% 10%)",
    views: 5890000,
    likes: 445000,
    comments: 89000,
    shares: 67000,
    followers: 2340000,
    engagementRate: 10.2,
    postsCount: 456,
    trend: 15.3,
  },
  {
    name: "YouTube",
    icon: "📺",
    color: "hsl(0 84% 60%)",
    views: 2340000,
    likes: 156000,
    comments: 34000,
    shares: 23000,
    followers: 890000,
    engagementRate: 9.1,
    postsCount: 189,
    trend: 8.2,
  },
  {
    name: "Instagram",
    icon: "📸",
    color: "hsl(var(--primary))",
    views: 3450000,
    likes: 289000,
    comments: 45000,
    shares: 34000,
    followers: 1560000,
    engagementRate: 10.7,
    postsCount: 312,
    trend: 12.1,
  },
];

const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
  return num.toString();
};

const MetricTooltip = ({ title, formula, interpretation }: { title: string; formula: string; interpretation: string }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger>
        <Info className="w-3.5 h-3.5 text-muted-foreground hover:text-primary transition-colors" />
      </TooltipTrigger>
      <TooltipContent className="max-w-[280px] p-3 space-y-2">
        <p className="font-semibold text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground"><strong>Formula:</strong> {formula}</p>
        <p className="text-xs text-muted-foreground"><strong>How to interpret:</strong> {interpretation}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export const PlatformStatsDashboard = () => {
  const totalViews = platformData.reduce((sum, p) => sum + p.views, 0);
  const totalFollowers = platformData.reduce((sum, p) => sum + p.followers, 0);
  const avgER = (platformData.reduce((sum, p) => sum + p.engagementRate, 0) / platformData.length).toFixed(1);

  return (
    <DashboardCard>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <span className="text-xl">📊</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                Platform Statistics Dashboard
                <MetricTooltip
                  title="Cross-Platform Analytics"
                  formula="Aggregated metrics from TikTok + YouTube + Instagram"
                  interpretation="Compare platform performance to optimize content distribution strategy."
                />
              </h3>
              <p className="text-sm text-muted-foreground">Real-time aggregated metrics across all platforms</p>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            Live Data
          </Badge>
        </div>

        {/* Total Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg">
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Total Views</div>
            <div className="text-2xl font-bold text-foreground">{formatNumber(totalViews)}</div>
            <div className="text-xs text-accent">+12.4% vs last period</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Total Followers</div>
            <div className="text-2xl font-bold text-foreground">{formatNumber(totalFollowers)}</div>
            <div className="text-xs text-accent">+3.2% growth</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Avg Engagement Rate</div>
            <div className="text-2xl font-bold text-foreground">{avgER}%</div>
            <div className="text-xs text-muted-foreground">Industry avg: 6.5%</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Total Posts</div>
            <div className="text-2xl font-bold text-foreground">{platformData.reduce((sum, p) => sum + p.postsCount, 0)}</div>
            <div className="text-xs text-muted-foreground">Last 7 days</div>
          </div>
        </div>

        {/* Platform Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {platformData.map((platform) => (
            <div
              key={platform.name}
              className="p-4 rounded-lg border border-border bg-card hover:shadow-card-hover transition-all"
              style={{ borderLeftColor: platform.color, borderLeftWidth: 4 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{platform.icon}</span>
                  <span className="font-semibold text-foreground">{platform.name}</span>
                </div>
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${platform.trend > 10 ? 'bg-accent/10 text-accent-foreground' : 'bg-muted'}`}
                >
                  +{platform.trend}%
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <div className="text-muted-foreground text-xs">Views</div>
                    <div className="font-semibold text-foreground">{formatNumber(platform.views)}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs">Followers</div>
                    <div className="font-semibold text-foreground">{formatNumber(platform.followers)}</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="bg-muted/50 rounded p-2 text-center">
                    <div className="font-semibold text-foreground">{formatNumber(platform.likes)}</div>
                    <div className="text-muted-foreground">Likes</div>
                  </div>
                  <div className="bg-muted/50 rounded p-2 text-center">
                    <div className="font-semibold text-foreground">{formatNumber(platform.comments)}</div>
                    <div className="text-muted-foreground">Comments</div>
                  </div>
                  <div className="bg-muted/50 rounded p-2 text-center">
                    <div className="font-semibold text-foreground">{formatNumber(platform.shares)}</div>
                    <div className="text-muted-foreground">Shares</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <span className="text-xs text-muted-foreground">Engagement Rate</span>
                  <span className="text-sm font-bold text-primary">{platform.engagementRate}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* AI Insight */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-2">
          <p className="text-sm font-semibold text-foreground">💡 Platform Distribution Insight</p>
          <p className="text-sm text-foreground">
            <strong>Instagram</strong> shows highest ER (10.7%) but <strong>TikTok</strong> drives 50% of total views. 
            Your YouTube presence is underutilized — only 20% of views despite strong 9.1% ER.
          </p>
          <p className="text-xs text-primary">
            → Recommendation: Repurpose top TikTok content to YouTube Shorts for +35% reach potential.
          </p>
        </div>
      </div>
    </DashboardCard>
  );
};
