import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { useInsightsFilters, PrimaryMetric } from "@/contexts/InsightsFilterContext";
import { format, eachDayOfInterval, eachHourOfInterval, eachWeekOfInterval, differenceInHours } from "date-fns";

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

const formatTooltipValue = (value: number) => {
  return value.toLocaleString();
};

const isRateMetric = (metric: PrimaryMetric) => {
  return ["engagementRate", "likeRate", "commentRate"].includes(metric);
};

const METRIC_LABELS: Record<PrimaryMetric, string> = {
  views: "Views",
  likes: "Likes",
  comments: "Comments",
  shares: "Shares/Reposts",
  engagementRate: "Engagement Rate %",
  likeRate: "Like Rate %",
  commentRate: "Comment Rate %",
  avgViewsPerPost: "Avg Views/Post",
};

export const MetricOverTimeChart = () => {
  const { filters, availableAccounts, getDateRange, getBucketType, refreshKey } = useInsightsFilters();

  const chartData = useMemo(() => {
    const { from, to } = getDateRange();
    const bucketType = getBucketType();
    let dates: Date[] = [];
    let dateFormat = "MMM d";

    if (bucketType === "hourly") {
      dates = eachHourOfInterval({ start: from, end: to });
      dateFormat = "HH:mm";
    } else if (bucketType === "weekly") {
      dates = eachWeekOfInterval({ start: from, end: to });
      dateFormat = "MMM d";
    } else {
      dates = eachDayOfInterval({ start: from, end: to });
      dateFormat = "MMM d";
    }

    const selectedAccounts = availableAccounts.filter(a => filters.accounts.includes(a.id));

    return dates.map((date) => {
      const dataPoint: Record<string, any> = {
        date: format(date, dateFormat),
        fullDate: format(date, "PPP p"),
        timestamp: date.getTime(),
      };

      selectedAccounts.forEach((account) => {
        // Generate deterministic mock data based on account and date
        const seed = account.id.charCodeAt(0) + date.getTime() + refreshKey;
        const baseValue = account.isUser ? 50000 : (seed % 100) * 1000 + 20000;
        const variance = ((seed % 40) + 80) / 100;
        
        let value: number;
        switch (filters.primaryMetric) {
          case "views":
            value = Math.floor(baseValue * variance);
            break;
          case "likes":
            value = Math.floor(baseValue * 0.05 * variance);
            break;
          case "comments":
            value = Math.floor(baseValue * 0.005 * variance);
            break;
          case "shares":
            value = Math.floor(baseValue * 0.01 * variance);
            break;
          case "engagementRate":
            value = parseFloat(((seed % 60) / 10 + 2).toFixed(2));
            break;
          case "likeRate":
            value = parseFloat(((seed % 40) / 10 + 1).toFixed(2));
            break;
          case "commentRate":
            value = parseFloat(((seed % 20) / 10 + 0.5).toFixed(2));
            break;
          case "avgViewsPerPost":
            value = Math.floor((baseValue * variance) / ((seed % 5) + 2));
            break;
          default:
            value = Math.floor(baseValue * variance);
        }
        
        dataPoint[account.handle] = value;
      });

      return dataPoint;
    });
  }, [filters, availableAccounts, getDateRange, getBucketType, refreshKey]);

  const selectedAccounts = availableAccounts.filter(a => filters.accounts.includes(a.id));
  const metricLabel = METRIC_LABELS[filters.primaryMetric];
  const isRate = isRateMetric(filters.primaryMetric);

  if (selectedAccounts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            {metricLabel} Over Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No accounts selected. Please select at least one account.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">{metricLabel} Over Time</CardTitle>
            <CardDescription>
              Track performance trends across selected accounts • {isRate ? "Weighted average" : "Sum"} per time bucket
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="date"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatValue}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              labelFormatter={(label, payload) => {
                const fullDate = payload?.[0]?.payload?.fullDate;
                return fullDate || label;
              }}
              formatter={(value: number, name: string) => [
                isRate ? `${value}%` : formatTooltipValue(value),
                name,
              ]}
            />
            <Legend
              wrapperStyle={{ paddingTop: "16px" }}
              formatter={(value: string) => {
                const account = availableAccounts.find(a => a.handle === value);
                return account?.isUser ? `${value} (You)` : value;
              }}
            />
            {selectedAccounts.map((account, index) => (
              <Line
                key={account.id}
                type="monotone"
                dataKey={account.handle}
                stroke={ACCOUNT_COLORS[index % ACCOUNT_COLORS.length]}
                strokeWidth={account.isUser ? 3 : 2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
