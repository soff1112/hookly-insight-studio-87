import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Layers } from "lucide-react";
import { useInsightsFilters, PrimaryMetric, getTimeRangeLabel } from "@/contexts/InsightsFilterContext";

const formatValue = (value: number) => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value.toLocaleString();
};

interface PlatformData {
  platform: string;
  label: string;
  value: number;
  postCount: number;
  color: string;
  totalViews: number; // For weighted average calculation
}

const METRIC_LABELS: Record<PrimaryMetric, string> = {
  views: "Views",
  likes: "Likes",
  comments: "Comments",
  shares: "Shares",
  engagementRate: "Avg ER %",
  likeRate: "Avg Like Rate %",
  commentRate: "Avg Comment Rate %",
  avgViewsPerPost: "Avg Views/Post",
};

const isRateMetric = (metric: PrimaryMetric) => {
  return ["engagementRate", "likeRate", "commentRate"].includes(metric);
};

export const PlatformBreakdownPanel = () => {
  const { filters, availableAccounts, getDateRange, refreshKey } = useInsightsFilters();

  const platformData = useMemo(() => {
    const data: PlatformData[] = [];
    const { from, to } = getDateRange();
    
    const platforms = [
      { key: "instagram", label: "Instagram", color: "hsl(330, 80%, 60%)" },
      { key: "tiktok", label: "TikTok", color: "hsl(252, 76%, 66%)" },
      { key: "youtube", label: "YouTube", color: "hsl(0, 84%, 60%)" },
    ];

    platforms.forEach((platform) => {
      if (!filters.platforms.includes(platform.key as any)) return;

      const accountsOnPlatform = availableAccounts.filter(
        a => a.platform === platform.key && filters.accounts.includes(a.id)
      );

      if (accountsOnPlatform.length === 0) return;

      // Generate mock aggregated data with proper aggregation logic
      const seed = platform.key.charCodeAt(0) + refreshKey;
      const postCount = (seed % 50) + 20;
      const totalViews = (seed % 2000000) + 500000;
      
      let value: number;
      switch (filters.primaryMetric) {
        case "views":
          value = totalViews;
          break;
        case "likes":
          value = Math.floor(totalViews * 0.05);
          break;
        case "comments":
          value = Math.floor(totalViews * 0.005);
          break;
        case "shares":
          value = Math.floor(totalViews * 0.01);
          break;
        case "engagementRate":
          // Weighted average by views
          value = parseFloat(((seed % 60) / 10 + 2).toFixed(2));
          break;
        case "likeRate":
          value = parseFloat(((seed % 40) / 10 + 1).toFixed(2));
          break;
        case "commentRate":
          value = parseFloat(((seed % 20) / 10 + 0.3).toFixed(2));
          break;
        case "avgViewsPerPost":
          value = Math.floor(totalViews / postCount);
          break;
        default:
          value = totalViews;
      }

      data.push({
        platform: platform.key,
        label: platform.label,
        value,
        postCount,
        color: platform.color,
        totalViews,
      });
    });

    return data;
  }, [filters, availableAccounts, getDateRange, refreshKey]);

  // Calculate totals with proper aggregation
  const { totalValue, totalPosts, totalViews } = useMemo(() => {
    const isRate = isRateMetric(filters.primaryMetric);
    const totalPosts = platformData.reduce((sum, p) => sum + p.postCount, 0);
    const totalViews = platformData.reduce((sum, p) => sum + p.totalViews, 0);
    
    let totalValue: number;
    if (isRate) {
      // Weighted average for rates
      const weightedSum = platformData.reduce((sum, p) => sum + p.value * p.totalViews, 0);
      totalValue = totalViews > 0 ? weightedSum / totalViews : 0;
    } else if (filters.primaryMetric === "avgViewsPerPost") {
      totalValue = totalPosts > 0 ? totalViews / totalPosts : 0;
    } else {
      // Sum for counts
      totalValue = platformData.reduce((sum, p) => sum + p.value, 0);
    }
    
    return { totalValue, totalPosts, totalViews };
  }, [platformData, filters.primaryMetric]);

  const maxValue = useMemo(() => {
    return Math.max(...platformData.map(p => p.value), 1);
  }, [platformData]);

  const metricLabel = METRIC_LABELS[filters.primaryMetric];
  const timeRangeLabel = getTimeRangeLabel(filters.timeRange);
  const isRate = isRateMetric(filters.primaryMetric);

  const formatDisplayValue = (value: number) => {
    if (isRate || filters.primaryMetric === "avgViewsPerPost") {
      return filters.primaryMetric === "avgViewsPerPost" 
        ? formatValue(Math.floor(value))
        : `${value.toFixed(2)}%`;
    }
    return formatValue(value);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Layers className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">Platform Breakdown</CardTitle>
            <CardDescription>
              {metricLabel} by platform • {isRate ? "Weighted avg" : "Sum"} aggregation
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <div className="space-y-4">
            {platformData.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                No data for selected platforms.
              </div>
            ) : (
              <>
                {platformData.map((platform) => {
                  const barWidth = (platform.value / maxValue) * 100;
                  
                  return (
                    <Tooltip key={platform.platform}>
                      <TooltipTrigger asChild>
                        <div className="space-y-2 cursor-default">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{platform.label}</span>
                            <span className="text-sm font-semibold">
                              {formatDisplayValue(platform.value)}
                            </span>
                          </div>
                          <div className="h-8 bg-muted rounded-md overflow-hidden">
                            <div
                              className="h-full rounded-md transition-all duration-300"
                              style={{ 
                                width: `${barWidth}%`,
                                backgroundColor: platform.color,
                              }}
                            />
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <div className="text-sm space-y-1">
                          <p className="font-medium">{platform.label}</p>
                          <p>Total {metricLabel}: {formatDisplayValue(platform.value)}</p>
                          <p>Posts included: {platform.postCount}</p>
                          <p>Total views: {formatValue(platform.totalViews)}</p>
                          <p className="text-muted-foreground text-xs">{timeRangeLabel}</p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}

                <div className="pt-4 border-t border-border">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="space-y-2 cursor-default">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-primary">Total</span>
                          <span className="text-sm font-bold text-primary">
                            {formatDisplayValue(totalValue)}
                          </span>
                        </div>
                        <div className="h-8 bg-primary/10 rounded-md overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-md"
                            style={{ width: "100%" }}
                          />
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <div className="text-sm space-y-1">
                        <p className="font-medium">All Platforms</p>
                        <p>Total {metricLabel}: {formatDisplayValue(totalValue)}</p>
                        <p>Posts included: {totalPosts}</p>
                        <p>Total views: {formatValue(totalViews)}</p>
                        <p className="text-muted-foreground text-xs">{timeRangeLabel}</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </>
            )}
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
};
