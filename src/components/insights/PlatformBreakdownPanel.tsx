import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Layers } from "lucide-react";
import { useInsightsFilters } from "@/contexts/InsightsFilterContext";

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
}

export const PlatformBreakdownPanel = () => {
  const { filters, availableAccounts } = useInsightsFilters();

  const platformData = useMemo(() => {
    const data: PlatformData[] = [];
    
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

      // Generate mock aggregated data
      let value: number;
      const postCount = Math.floor(Math.random() * 50) + 20;
      
      switch (filters.primaryMetric) {
        case "views":
          value = Math.floor(Math.random() * 2000000) + 500000;
          break;
        case "likes":
          value = Math.floor(Math.random() * 100000) + 25000;
          break;
        case "comments":
          value = Math.floor(Math.random() * 10000) + 2000;
          break;
        case "shares":
          value = Math.floor(Math.random() * 20000) + 5000;
          break;
        case "engagementRate":
          value = parseFloat((Math.random() * 6 + 2).toFixed(2));
          break;
        default:
          value = Math.floor(Math.random() * 2000000) + 500000;
      }

      data.push({
        platform: platform.key,
        label: platform.label,
        value,
        postCount,
        color: platform.color,
      });
    });

    return data;
  }, [filters, availableAccounts]);

  const totalValue = useMemo(() => {
    return platformData.reduce((sum, p) => sum + p.value, 0);
  }, [platformData]);

  const totalPosts = useMemo(() => {
    return platformData.reduce((sum, p) => sum + p.postCount, 0);
  }, [platformData]);

  const maxValue = useMemo(() => {
    return Math.max(...platformData.map(p => p.value), 1);
  }, [platformData]);

  const metricLabel = {
    views: "Views",
    likes: "Likes",
    comments: "Comments",
    shares: "Shares",
    engagementRate: "Avg ER %",
  }[filters.primaryMetric];

  const timeRangeLabel = {
    "24h": "Last 24 hours",
    "7d": "Last 7 days",
    "30d": "Last 30 days",
    "90d": "Last 90 days",
    "custom": "Custom range",
  }[filters.timeRange];

  const formatDisplayValue = (value: number) => {
    if (filters.primaryMetric === "engagementRate") {
      return `${value.toFixed(2)}%`;
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
              {metricLabel} comparison by platform
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
                            {filters.primaryMetric === "engagementRate"
                              ? `${(totalValue / platformData.length).toFixed(2)}%`
                              : formatValue(totalValue)}
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
                        <p>Total {metricLabel}: {filters.primaryMetric === "engagementRate"
                          ? `${(totalValue / platformData.length).toFixed(2)}%`
                          : formatValue(totalValue)}</p>
                        <p>Posts included: {totalPosts}</p>
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
