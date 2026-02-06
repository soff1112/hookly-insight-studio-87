import { useMemo, useCallback, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { useInsightsFilters } from "@/contexts/InsightsFilterContext";
import { GrafanaPanel } from "./GrafanaPanel";
import { LineChart, Line } from "recharts";
import { format, eachDayOfInterval, subDays } from "date-fns";

interface AccountStats {
  id: string;
  handle: string;
  isUser: boolean;
  value: number;
  posts: number;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  engagementRate: number;
}

const ACCOUNT_COLORS = [
  "hsl(252, 76%, 66%)",
  "hsl(163, 82%, 36%)",
  "hsl(45, 93%, 47%)",
  "hsl(210, 100%, 50%)",
  "hsl(329, 78%, 60%)",
  "hsl(0, 84%, 60%)",
];

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

export const AccountStatisticsPanel = () => {
  const { filters, availableAccounts, lastRefresh, getTimeRangeLabel } = useInsightsFilters();
  const [selectedAccount, setSelectedAccount] = useState<AccountStats | null>(null);

  const accountData: AccountStats[] = useMemo(() => {
    const selectedAccounts = availableAccounts.filter(a => filters.accounts.includes(a.id));
    
    let data = selectedAccounts.map((account) => {
      const posts = Math.floor(Math.random() * 30) + 10;
      const views = Math.floor(Math.random() * 2000000) + 200000;
      const likes = Math.floor(views * (Math.random() * 0.08 + 0.02));
      const comments = Math.floor(likes * (Math.random() * 0.15 + 0.05));
      const shares = Math.floor(likes * (Math.random() * 0.25 + 0.08));
      const er = parseFloat(((likes + comments + shares) / views * 100).toFixed(2));
      
      let value: number;
      switch (filters.primaryMetric) {
        case "views": value = views; break;
        case "likes": value = likes; break;
        case "comments": value = comments; break;
        case "shares": value = shares; break;
        case "engagementRate": value = er; break;
        default: value = views;
      }
      
      return {
        id: account.id,
        handle: account.handle,
        isUser: account.isUser,
        value,
        posts,
        views,
        likes,
        comments,
        shares,
        engagementRate: er,
      };
    });

    // Sort by value descending
    data = data.sort((a, b) => b.value - a.value);

    // Add total row
    const totalValue = filters.primaryMetric === "engagementRate"
      ? parseFloat((data.reduce((sum, a) => sum + a.value, 0) / data.length).toFixed(2))
      : data.reduce((sum, a) => sum + a.value, 0);

    data.push({
      id: "total",
      handle: "Total",
      isUser: false,
      value: totalValue,
      posts: data.reduce((sum, a) => sum + a.posts, 0),
      views: data.reduce((sum, a) => sum + a.views, 0),
      likes: data.reduce((sum, a) => sum + a.likes, 0),
      comments: data.reduce((sum, a) => sum + a.comments, 0),
      shares: data.reduce((sum, a) => sum + a.shares, 0),
      engagementRate: parseFloat((data.reduce((sum, a) => sum + a.engagementRate, 0) / data.length).toFixed(2)),
    });

    return data;
  }, [filters, availableAccounts, lastRefresh]);

  const handleExportCSV = useCallback(() => {
    const metricLabel = METRIC_LABELS[filters.primaryMetric];
    const headers = ["Account", metricLabel, "Posts", "Views", "Likes", "Comments", "Shares", "ER %"];
    const rows = accountData.map(a => [
      a.handle,
      a.value.toString(),
      a.posts.toString(),
      a.views.toString(),
      a.likes.toString(),
      a.comments.toString(),
      a.shares.toString(),
      a.engagementRate.toString(),
    ]);
    return [headers, ...rows];
  }, [accountData, filters.primaryMetric]);

  const metricLabel = METRIC_LABELS[filters.primaryMetric];
  const isPercentMetric = filters.primaryMetric === "engagementRate";
  const maxValue = Math.max(...accountData.filter(a => a.id !== "total").map(a => a.value), 1);

  const miniChartData = useMemo(() => {
    if (!selectedAccount) return [];
    const now = new Date();
    const dates = eachDayOfInterval({ start: subDays(now, 7), end: now });
    
    return dates.map((date) => ({
      date: format(date, "MMM d"),
      value: Math.floor(Math.random() * 50000) + 10000,
    }));
  }, [selectedAccount]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.[0]) return null;
    const data = payload[0].payload as AccountStats;
    
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg text-sm">
        <p className="font-medium mb-1">{data.handle} {data.isUser && "(You)"}</p>
        <div className="space-y-1 text-muted-foreground">
          <p>{metricLabel}: {isPercentMetric ? `${data.value}%` : formatValue(data.value)}</p>
          <p>Posts: {data.posts}</p>
          <p className="text-xs">{getTimeRangeLabel()}</p>
        </div>
      </div>
    );
  };

  if (accountData.length <= 1) {
    return (
      <GrafanaPanel
        title="Account Statistics"
        subtitle={`${metricLabel} by account`}
        icon={Users}
        panelId="account-statistics"
      >
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
          No accounts selected
        </div>
      </GrafanaPanel>
    );
  }

  return (
    <>
      <GrafanaPanel
        title="Account Statistics"
        subtitle={`${metricLabel} by account`}
        icon={Users}
        panelId="account-statistics"
        onExportCSV={handleExportCSV}
      >
        <ScrollArea className="h-[300px]">
          <div style={{ height: Math.max(300, accountData.length * 45) }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={accountData}
                layout="vertical"
                margin={{ left: 100, right: 60, top: 10, bottom: 10 }}
                onClick={(data) => {
                  if (data?.activePayload?.[0]?.payload?.id !== "total") {
                    setSelectedAccount(data.activePayload[0].payload);
                  }
                }}
              >
                <XAxis
                  type="number"
                  tickFormatter={(v) => isPercentMetric ? `${v}%` : formatValue(v)}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                />
                <YAxis
                  type="category"
                  dataKey="handle"
                  width={90}
                  tick={{ fontSize: 11 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted)/0.3)" }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} cursor="pointer">
                  {accountData.map((entry, index) => (
                    <Cell 
                      key={index} 
                      fill={entry.id === "total" 
                        ? "hsl(var(--primary))" 
                        : entry.isUser 
                          ? "hsl(252, 76%, 66%)"
                          : ACCOUNT_COLORS[index % ACCOUNT_COLORS.length]
                      } 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ScrollArea>
      </GrafanaPanel>

      <Sheet open={!!selectedAccount} onOpenChange={() => setSelectedAccount(null)}>
        <SheetContent className="w-[500px] sm:max-w-[500px]">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              {selectedAccount?.handle}
              {selectedAccount?.isUser && <Badge variant="secondary">You</Badge>}
            </SheetTitle>
          </SheetHeader>
          {selectedAccount && (
            <div className="mt-6 space-y-6">
              <div>
                <p className="text-sm font-medium mb-3">Performance Over Time</p>
                <div className="h-[120px] bg-muted/50 rounded-lg p-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={miniChartData}>
                      <XAxis dataKey="date" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis fontSize={10} tickLine={false} axisLine={false} tickFormatter={formatValue} />
                      <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-muted">
                  <p className="text-xs text-muted-foreground">Posts</p>
                  <p className="text-lg font-semibold">{selectedAccount.posts}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted">
                  <p className="text-xs text-muted-foreground">Views</p>
                  <p className="text-lg font-semibold">{formatValue(selectedAccount.views)}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted">
                  <p className="text-xs text-muted-foreground">Likes</p>
                  <p className="text-lg font-semibold">{formatValue(selectedAccount.likes)}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted">
                  <p className="text-xs text-muted-foreground">Comments</p>
                  <p className="text-lg font-semibold">{formatValue(selectedAccount.comments)}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted">
                  <p className="text-xs text-muted-foreground">Shares</p>
                  <p className="text-lg font-semibold">{formatValue(selectedAccount.shares)}</p>
                </div>
                <div className="p-3 rounded-lg bg-primary/10">
                  <p className="text-xs text-muted-foreground">ER %</p>
                  <p className="text-lg font-semibold text-primary">{selectedAccount.engagementRate}%</p>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};
