import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { BarChart3 } from "lucide-react";
import { useInsightsFilters } from "@/contexts/InsightsFilterContext";

type MetricKey = "views" | "likes" | "comments" | "shares";

interface MetricConfig {
  key: MetricKey;
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

interface PlatformStatsChartProps {
  title?: string;
  description?: string;
}

export const PlatformStatsChart = ({ 
  title = "Platform Statistics", 
  description = "Performance breakdown by platform" 
}: PlatformStatsChartProps) => {
  const { filters, availableAccounts } = useInsightsFilters();
  const [selectedMetric, setSelectedMetric] = useState<MetricKey>("views");

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

      // Generate mock data for each metric
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

  const maxValue = useMemo(() => {
    return Math.max(...allData.map(p => p[selectedMetric]), 1);
  }, [allData, selectedMetric]);

  const selectedMetricConfig = METRICS.find(m => m.key === selectedMetric)!;

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
            <CardTitle className="text-lg">{title}</CardTitle>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-6">
          {/* Chart Area */}
          <div className="flex-1 space-y-3">
            <TooltipProvider>
              {platformData.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  No data for selected platforms.
                </div>
              ) : (
                <>
                  {allData.map((platform) => {
                    const value = platform[selectedMetric];
                    const barWidth = (value / maxValue) * 100;
                    const isTotal = platform.platform === "total";
                    
                    return (
                      <Tooltip key={platform.platform}>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-4 cursor-default">
                            <span className={`text-sm w-20 text-right ${isTotal ? 'font-semibold text-primary' : 'text-muted-foreground'}`}>
                              {platform.label}
                            </span>
                            <div className="flex-1 h-10 bg-muted/50 rounded overflow-hidden border border-border/50">
                              <div
                                className="h-full rounded transition-all duration-300 flex items-center"
                                style={{ 
                                  width: `${barWidth}%`,
                                  backgroundColor: isTotal 
                                    ? `color-mix(in srgb, ${selectedMetricConfig.color} 70%, transparent)`
                                    : selectedMetricConfig.color,
                                  borderWidth: '2px',
                                  borderStyle: 'solid',
                                  borderColor: selectedMetricConfig.color,
                                }}
                              />
                            </div>
                            <span className={`text-sm w-24 ${isTotal ? 'font-bold text-primary' : 'font-medium'}`}>
                              {formatValue(value)}
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <div className="text-sm space-y-1">
                            <p className="font-medium">{platform.label}</p>
                            <p>{selectedMetricConfig.label}: {formatValue(value)}</p>
                            <p className="text-muted-foreground text-xs">{timeRangeLabel}</p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </>
              )}
            </TooltipProvider>
          </div>

          {/* Legend / Filter */}
          <div className="w-32 space-y-2">
            {METRICS.map((metric) => {
              const isSelected = selectedMetric === metric.key;
              return (
                <button
                  key={metric.key}
                  onClick={() => setSelectedMetric(metric.key)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-all ${
                    isSelected 
                      ? 'bg-primary/10 font-medium' 
                      : 'hover:bg-muted/50 text-muted-foreground'
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-sm flex-shrink-0"
                    style={{ backgroundColor: metric.color }}
                  />
                  <span className="truncate">{metric.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
