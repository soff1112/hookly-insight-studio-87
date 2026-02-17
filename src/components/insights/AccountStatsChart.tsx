import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Users } from "lucide-react";
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

interface AccountData {
  id: string;
  handle: string;
  isUser: boolean;
  views: number;
  likes: number;
  comments: number;
  shares: number;
}

export const AccountStatsChart = () => {
  const { filters, availableAccounts } = useInsightsFilters();
  const [selectedMetric, setSelectedMetric] = useState<MetricKey>("views");

  const accountData = useMemo(() => {
    const selected = availableAccounts.filter(a => filters.accounts.includes(a.id));
    return selected.map((account): AccountData => ({
      id: account.id,
      handle: account.handle,
      isUser: account.isUser,
      views: Math.floor(Math.random() * 300000) + 20000,
      likes: Math.floor(Math.random() * 50000) + 5000,
      comments: Math.floor(Math.random() * 10000) + 1000,
      shares: Math.floor(Math.random() * 20000) + 2000,
    })).sort((a, b) => b[selectedMetric] - a[selectedMetric]);
  }, [filters, availableAccounts, selectedMetric]);

  const totalData: AccountData = useMemo(() => ({
    id: "total",
    handle: "Total",
    isUser: false,
    views: accountData.reduce((s, a) => s + a.views, 0),
    likes: accountData.reduce((s, a) => s + a.likes, 0),
    comments: accountData.reduce((s, a) => s + a.comments, 0),
    shares: accountData.reduce((s, a) => s + a.shares, 0),
  }), [accountData]);

  const allData = [...accountData, totalData];
  const maxValue = Math.max(...allData.map(a => a[selectedMetric]), 1);
  const selectedMetricConfig = METRICS.find(m => m.key === selectedMetric)!;

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">Account Statistics</CardTitle>
            <p className="text-sm text-muted-foreground">Performance breakdown by account</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-6">
          <div className="flex-1 space-y-3">
            <TooltipProvider>
              {accountData.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  No accounts selected.
                </div>
              ) : (
                allData.map((account) => {
                  const value = account[selectedMetric];
                  const barWidth = (value / maxValue) * 100;
                  const isTotal = account.id === "total";

                  return (
                    <Tooltip key={account.id}>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-4 cursor-default">
                          <span className={`text-sm w-28 text-right truncate ${isTotal ? 'font-semibold text-primary' : account.isUser ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                            {account.handle}
                            {account.isUser && !isTotal && ' (You)'}
                          </span>
                          <div className="flex-1 h-10 bg-muted/50 rounded overflow-hidden border border-border/50">
                            <div
                              className="h-full rounded transition-all duration-300"
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
                          <p className="font-medium">{account.handle}</p>
                          <p>{selectedMetricConfig.label}: {formatValue(value)}</p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  );
                })
              )}
            </TooltipProvider>
          </div>

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
