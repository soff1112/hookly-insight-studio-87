import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { BarChart3 } from "lucide-react";
import { useInsightsFilters } from "@/contexts/InsightsFilterContext";

interface MetricConfig {
  key: "views" | "likes" | "comments" | "shares";
  label: string;
  color: string;
}

const METRICS: MetricConfig[] = [
  { key: "views", label: "Views", color: "hsl(142, 76%, 36%)" },
  { key: "likes", label: "Likes", color: "hsl(38, 92%, 50%)" },
  { key: "comments", label: "Comments", color: "hsl(217, 91%, 60%)" },
  { key: "shares", label: "Shares", color: "hsl(346, 87%, 60%)" },
];

const formatValue = (value: number) => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value.toLocaleString();
};

interface PlatformData {
  platform: string;
  label: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
}

export const PlatformMultiMetricChart = () => {
  const { filters, availableAccounts } = useInsightsFilters();

  const platformData = useMemo(() => {
    const data: PlatformData[] = [];
    
    const platforms = [
      { key: "instagram", label: "Instagram" },
      { key: "tiktok", label: "TikTok" },
      { key: "youtube", label: "YouTube" },
    ];

    platforms.forEach((platform) => {
      if (!filters.platforms.includes(platform.key as any)) return;

      const accountsOnPlatform = availableAccounts.filter(
        a => a.platform === platform.key && filters.accounts.includes(a.id)
      );

      if (accountsOnPlatform.length === 0) return;

      data.push({
        platform: platform.key,
        label: platform.label,
        views: Math.floor(Math.random() * 20000000) + 5000000,
        likes: Math.floor(Math.random() * 500000) + 100000,
        comments: Math.floor(Math.random() * 50000) + 10000,
        shares: Math.floor(Math.random() * 100000) + 20000,
      });
    });

    return data;
  }, [filters, availableAccounts]);

  const totalData = useMemo(() => {
    return {
      platform: "total",
      label: "Total",
      views: platformData.reduce((sum, p) => sum + p.views, 0),
      likes: platformData.reduce((sum, p) => sum + p.likes, 0),
      comments: platformData.reduce((sum, p) => sum + p.comments, 0),
      shares: platformData.reduce((sum, p) => sum + p.shares, 0),
    };
  }, [platformData]);

  const allData = [...platformData, totalData];

  // Calculate max for each metric independently for proper scaling
  const maxValues = useMemo(() => {
    return {
      views: Math.max(...allData.map(p => p.views), 1),
      likes: Math.max(...allData.map(p => p.likes), 1),
      comments: Math.max(...allData.map(p => p.comments), 1),
      shares: Math.max(...allData.map(p => p.shares), 1),
    };
  }, [allData]);

  const timeRangeLabel = {
    "24h": "Last 24 hours",
    "7d": "Last 7 days",
    "30d": "Last 30 days",
    "90d": "Last 90 days",
    "custom": "Custom range",
  }[filters.timeRange];

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <BarChart3 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">Platform Statistics</CardTitle>
            <p className="text-sm text-muted-foreground">All metrics comparison</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-6">
          {/* Chart Area */}
          <div className="flex-1 space-y-4">
            <TooltipProvider>
              {platformData.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  No data for selected platforms.
                </div>
              ) : (
                <>
                  {allData.map((platform) => {
                    const isTotal = platform.platform === "total";
                    
                    return (
                      <div key={platform.platform} className="space-y-1">
                        <span className={`text-sm ${isTotal ? 'font-semibold text-primary' : 'text-muted-foreground'}`}>
                          {platform.label}
                        </span>
                        <div className="space-y-1">
                          {METRICS.map((metric) => {
                            const value = platform[metric.key];
                            const barWidth = (value / maxValues[metric.key]) * 100;
                            
                            return (
                              <Tooltip key={metric.key}>
                                <TooltipTrigger asChild>
                                  <div className="flex items-center gap-2 cursor-default">
                                    <div className="flex-1 h-5 bg-muted/30 rounded overflow-hidden">
                                      <div
                                        className="h-full rounded transition-all duration-300"
                                        style={{ 
                                          width: `${barWidth}%`,
                                          backgroundColor: metric.color,
                                        }}
                                      />
                                    </div>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent side="top">
                                  <div className="text-sm space-y-1">
                                    <p className="font-medium">{platform.label}</p>
                                    <p>{metric.label}: {formatValue(value)}</p>
                                    <p className="text-muted-foreground text-xs">{timeRangeLabel}</p>
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </TooltipProvider>

            {/* X-Axis scale */}
            <div className="flex justify-between text-xs text-muted-foreground pt-2 border-t border-border/50">
              <span>0</span>
              <span>2M</span>
              <span>5M</span>
              <span>10M</span>
              <span>20M+</span>
            </div>
          </div>

          {/* Legend */}
          <div className="w-28 space-y-2">
            {METRICS.map((metric) => (
              <div
                key={metric.key}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <span
                  className="w-4 h-1 rounded-full flex-shrink-0"
                  style={{ backgroundColor: metric.color }}
                />
                <span className="truncate">{metric.label}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
