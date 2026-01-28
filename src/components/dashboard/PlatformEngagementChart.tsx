import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { BarChart3, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { Platform, PLATFORM_COLORS } from "@/types/workspace";
import { cn } from "@/lib/utils";

const PLATFORM_ICONS: Record<Platform, string> = {
  tiktok: '🎵',
  youtube: '📺',
  instagram: '📸'
};

const PLATFORM_LABELS: Record<Platform, string> = {
  tiktok: 'TikTok',
  youtube: 'YouTube',
  instagram: 'Instagram'
};

export const PlatformEngagementChart = () => {
  const { getMainAccount, getTopCompetitors } = useWorkspace();
  
  const mainAccount = getMainAccount();
  const topCompetitors = getTopCompetitors(4);

  const platformData = useMemo(() => {
    const platforms: Platform[] = ['tiktok', 'youtube', 'instagram'];
    
    return platforms.map(platform => {
      // Get competitors for this platform
      const platformCompetitors = topCompetitors.filter(c => c.platform === platform);
      const avgCompetitorER = platformCompetitors.length > 0
        ? platformCompetitors.reduce((sum, c) => sum + c.metrics.engagementRate, 0) / platformCompetitors.length
        : 0;
      
      // User's ER for this platform (simplified - using main account)
      const userER = mainAccount?.platform === platform 
        ? mainAccount.metrics.engagementRate 
        : (Math.random() * 4 + 3); // Mock for other platforms
      
      return {
        platform,
        label: PLATFORM_LABELS[platform],
        icon: PLATFORM_ICONS[platform],
        userER: Number(userER.toFixed(1)),
        competitorAvgER: Number(avgCompetitorER.toFixed(1)),
        topCompetitorER: platformCompetitors[0]?.metrics.engagementRate || 0,
        topCompetitorHandle: platformCompetitors[0]?.handle || 'N/A',
        color: PLATFORM_COLORS[platform],
        competitorCount: platformCompetitors.length
      };
    });
  }, [mainAccount, topCompetitors]);

  const getGapIndicator = (userER: number, competitorER: number) => {
    const diff = userER - competitorER;
    if (diff > 0.5) return { icon: TrendingUp, color: 'text-accent', label: 'Above avg' };
    if (diff < -0.5) return { icon: TrendingDown, color: 'text-destructive', label: 'Below avg' };
    return { icon: Minus, color: 'text-muted-foreground', label: 'On par' };
  };

  const chartData = useMemo(() => {
    return platformData.flatMap(p => [
      { 
        name: `${p.label} - You`, 
        value: p.userER, 
        fill: 'hsl(var(--primary))',
        platform: p.platform
      },
      { 
        name: `${p.label} - Competitors`, 
        value: p.competitorAvgER, 
        fill: 'hsl(var(--muted-foreground))',
        platform: p.platform
      }
    ]);
  }, [platformData]);

  return (
    <div className="p-5 rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <BarChart3 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Engagement by Platform</h3>
            <p className="text-sm text-muted-foreground">
              Your ER vs competitor average per platform
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
            <div className="w-2 h-2 rounded-full bg-primary mr-1.5" />
            You
          </Badge>
          <Badge variant="secondary" className="text-xs">
            <div className="w-2 h-2 rounded-full bg-muted-foreground mr-1.5" />
            Avg Competitor
          </Badge>
        </div>
      </div>

      {/* Platform cards with bars */}
      <div className="space-y-4">
        {platformData.map((platform) => {
          const gap = getGapIndicator(platform.userER, platform.competitorAvgER);
          const GapIcon = gap.icon;
          const maxER = Math.max(platform.userER, platform.competitorAvgER, platform.topCompetitorER) * 1.2;
          
          return (
            <div 
              key={platform.platform}
              className="p-4 rounded-lg bg-secondary/20 hover:bg-secondary/30 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{platform.icon}</span>
                  <span className="font-medium text-foreground">{platform.label}</span>
                  <Badge variant="outline" className="text-xs">
                    {platform.competitorCount} tracked
                  </Badge>
                </div>
                <div className={cn("flex items-center gap-1 text-xs", gap.color)}>
                  <GapIcon className="w-3.5 h-3.5" />
                  <span>{gap.label}</span>
                </div>
              </div>

              {/* Bars */}
              <div className="space-y-2">
                {/* Your ER */}
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-20">You</span>
                  <div className="flex-1 h-6 bg-muted/30 rounded overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded transition-all duration-500"
                      style={{ width: `${(platform.userER / maxER) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-foreground w-14 text-right">
                    {platform.userER}%
                  </span>
                </div>

                {/* Competitor Avg ER */}
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-20">Avg</span>
                  <div className="flex-1 h-6 bg-muted/30 rounded overflow-hidden">
                    <div 
                      className="h-full bg-muted-foreground/50 rounded transition-all duration-500"
                      style={{ width: `${(platform.competitorAvgER / maxER) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-muted-foreground w-14 text-right">
                    {platform.competitorAvgER}%
                  </span>
                </div>

                {/* Top Competitor */}
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-20 truncate" title={platform.topCompetitorHandle}>
                    Top
                  </span>
                  <div className="flex-1 h-6 bg-muted/30 rounded overflow-hidden">
                    <div 
                      className="h-full bg-accent/60 rounded transition-all duration-500"
                      style={{ width: `${(platform.topCompetitorER / maxER) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-accent w-14 text-right">
                    {platform.topCompetitorER.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Insight */}
      <div className="mt-4 p-4 rounded-lg bg-primary/5 border border-primary/20">
        <p className="text-sm text-foreground">
          <span className="font-semibold">💡 Platform Focus:</span>{' '}
          {platformData.reduce((best, curr) => 
            (curr.competitorAvgER - curr.userER) > (best.competitorAvgER - best.userER) ? curr : best
          ).label} shows the largest gap vs competitors. 
          Prioritize content optimization there for maximum impact.
        </p>
      </div>
    </div>
  );
};
