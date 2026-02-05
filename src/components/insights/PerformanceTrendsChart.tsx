import { useState } from "react";
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
import { Card } from "@/components/ui/card";
import { TrendingUp, Lightbulb } from "lucide-react";

const mockData = [
  { date: "Jan 28", views: 125000, likes: 8500, comments: 420, shares: 890, avgViewsPerPost: 12500 },
  { date: "Jan 29", views: 142000, likes: 9200, comments: 510, shares: 920, avgViewsPerPost: 14200 },
  { date: "Jan 30", views: 138000, likes: 8800, comments: 480, shares: 850, avgViewsPerPost: 13800 },
  { date: "Jan 31", views: 155000, likes: 10100, comments: 620, shares: 1050, avgViewsPerPost: 15500 },
  { date: "Feb 1", views: 168000, likes: 11200, comments: 710, shares: 1180, avgViewsPerPost: 16800 },
  { date: "Feb 2", views: 145000, likes: 9400, comments: 520, shares: 890, avgViewsPerPost: 14500 },
  { date: "Feb 3", views: 132000, likes: 8600, comments: 450, shares: 780, avgViewsPerPost: 13200 },
];

const METRIC_CONFIG = {
  views: { label: "Views", color: "hsl(252, 76%, 66%)" },
  likes: { label: "Likes", color: "hsl(163, 82%, 36%)" },
  comments: { label: "Comments", color: "hsl(45, 93%, 47%)" },
  shares: { label: "Shares", color: "hsl(210, 100%, 50%)" },
  avgViewsPerPost: { label: "Avg Views/Post", color: "hsl(329, 78%, 60%)" },
};

export const PerformanceTrendsChart = () => {
  const [hiddenMetrics, setHiddenMetrics] = useState<string[]>(["comments", "shares", "avgViewsPerPost"]);

  const toggleMetric = (metric: string) => {
    setHiddenMetrics((prev) =>
      prev.includes(metric) ? prev.filter((m) => m !== metric) : [...prev, metric]
    );
  };

  const formatValue = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toString();
  };

  return (
    <Card className="p-6 border-border shadow-card">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Performance Trends</h3>
            <p className="text-sm text-muted-foreground">How performance evolves over time</p>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={mockData}>
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
              formatter={(value: number, name: string) => [
                formatValue(value),
                METRIC_CONFIG[name as keyof typeof METRIC_CONFIG]?.label || name,
              ]}
            />
            <Legend
              onClick={(e) => toggleMetric(e.dataKey as string)}
              wrapperStyle={{ cursor: "pointer", paddingTop: "16px" }}
              formatter={(value: string) => {
                const config = METRIC_CONFIG[value as keyof typeof METRIC_CONFIG];
                return (
                  <span className={hiddenMetrics.includes(value) ? "opacity-40" : ""}>
                    {config?.label || value}
                  </span>
                );
              }}
            />
            {Object.entries(METRIC_CONFIG).map(([key, config]) =>
              !hiddenMetrics.includes(key) ? (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={config.color}
                  strokeWidth={2}
                  dot={{ fill: config.color, r: 3 }}
                  activeDot={{ r: 5 }}
                />
              ) : null
            )}
          </LineChart>
        </ResponsiveContainer>

        <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/5 border border-primary/10">
          <Lightbulb className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <p className="text-sm text-foreground">
            <span className="font-medium">AI Insight:</span> Views declined after Feb 3 despite stable posting frequency. 
            Likely hook fatigue — consider testing new opening formats.
          </p>
        </div>
      </div>
    </Card>
  );
};
