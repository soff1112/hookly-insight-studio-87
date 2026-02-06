import { useMemo, useCallback } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Layers } from "lucide-react";
import { useInsightsFilters } from "@/contexts/InsightsFilterContext";
import { GrafanaPanel } from "./GrafanaPanel";

const PLATFORM_COLORS: Record<string, string> = {
  instagram: "hsl(330, 80%, 60%)",
  tiktok: "hsl(252, 76%, 66%)",
  youtube: "hsl(0, 84%, 60%)",
  total: "hsl(var(--primary))",
};

const formatValue = (value: number) => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value.toLocaleString();
};

const METRIC_LABELS = {
  views: "Views",
  likes: "Likes",
  comments: "Comments",
  shares: "Shares",
  engagementRate: "Avg ER %",
};

export const PlatformStatisticsPanel = () => {
  const { filters, availableAccounts, lastRefresh, getTimeRangeLabel } = useInsightsFilters();

  const platformData = useMemo(() => {
    const data: { platform: string; label: string; value: number; postCount: number }[] = [];
    
    const platforms = [
      { key: "instagram", label: "Instagram" },
      { key: "tiktok", label: "TikTok" },
      { key: "youtube", label: "YouTube" },
    ];

    let totalValue = 0;
    let totalPosts = 0;

    platforms.forEach((platform) => {
      if (!filters.platforms.includes(platform.key as any)) return;

      const accountsOnPlatform = availableAccounts.filter(
        a => a.platform === platform.key && filters.accounts.includes(a.id)
      );

      if (accountsOnPlatform.length === 0) return;

      const postCount = Math.floor(Math.random() * 50) + 20;
      let value: number;
      
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

      totalValue += value;
      totalPosts += postCount;
      
      data.push({
        platform: platform.key,
        label: platform.label,
        value,
        postCount,
      });
    });

    // Add total row
    if (data.length > 0) {
      data.push({
        platform: "total",
        label: "Total",
        value: filters.primaryMetric === "engagementRate" 
          ? parseFloat((totalValue / data.length).toFixed(2))
          : totalValue,
        postCount: totalPosts,
      });
    }

    return data;
  }, [filters, availableAccounts, lastRefresh]);

  const handleExportCSV = useCallback(() => {
    const metricLabel = METRIC_LABELS[filters.primaryMetric];
    const headers = ["Platform", metricLabel, "Posts"];
    const rows = platformData.map(p => [
      p.label,
      p.value.toString(),
      p.postCount.toString(),
    ]);
    return [headers, ...rows];
  }, [platformData, filters.primaryMetric]);

  const maxValue = Math.max(...platformData.filter(p => p.platform !== "total").map(p => p.value), 1);
  const metricLabel = METRIC_LABELS[filters.primaryMetric];
  const isPercentMetric = filters.primaryMetric === "engagementRate";

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.[0]) return null;
    const data = payload[0].payload;
    
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg text-sm">
        <p className="font-medium mb-1">{data.label}</p>
        <div className="space-y-1 text-muted-foreground">
          <p>{metricLabel}: {isPercentMetric ? `${data.value}%` : formatValue(data.value)}</p>
          <p>Posts: {data.postCount}</p>
          <p className="text-xs">{getTimeRangeLabel()}</p>
        </div>
      </div>
    );
  };

  if (platformData.length === 0) {
    return (
      <GrafanaPanel
        title="Platform Statistics"
        subtitle={`${metricLabel} by platform`}
        icon={Layers}
        panelId="platform-statistics"
      >
        <div className="h-[250px] flex items-center justify-center text-muted-foreground">
          No data for selected filters
        </div>
      </GrafanaPanel>
    );
  }

  return (
    <GrafanaPanel
      title="Platform Statistics"
      subtitle={`${metricLabel} by platform`}
      icon={Layers}
      panelId="platform-statistics"
      onExportCSV={handleExportCSV}
    >
      <ResponsiveContainer width="100%" height={250}>
        <BarChart
          data={platformData}
          layout="vertical"
          margin={{ left: 80, right: 60, top: 10, bottom: 10 }}
        >
          <XAxis
            type="number"
            tickFormatter={(v) => isPercentMetric ? `${v}%` : formatValue(v)}
            stroke="hsl(var(--muted-foreground))"
            fontSize={11}
          />
          <YAxis
            type="category"
            dataKey="label"
            width={70}
            tick={{ fontSize: 12 }}
            stroke="hsl(var(--muted-foreground))"
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted)/0.3)" }} />
          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
            {platformData.map((entry, index) => (
              <Cell key={index} fill={PLATFORM_COLORS[entry.platform] || PLATFORM_COLORS.total} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </GrafanaPanel>
  );
};
