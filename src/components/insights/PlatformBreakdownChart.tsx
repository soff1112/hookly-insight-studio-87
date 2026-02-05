import { Card } from "@/components/ui/card";
import { Share2, Lightbulb } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const mockData = [
  { platform: "TikTok", views: 892000, likes: 45200, comments: 3200, shares: 8900 },
  { platform: "Instagram", views: 456000, likes: 28100, comments: 2100, shares: 4200 },
  { platform: "YouTube", views: 234000, likes: 12500, comments: 890, shares: 2100 },
  { platform: "Total", views: 1582000, likes: 85800, comments: 6190, shares: 15200 },
];

const METRIC_COLORS = {
  views: "hsl(252, 76%, 66%)",
  likes: "hsl(163, 82%, 36%)",
  comments: "hsl(45, 93%, 47%)",
  shares: "hsl(210, 100%, 50%)",
};

const formatValue = (value: number) => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value.toString();
};

export const PlatformBreakdownChart = () => {
  return (
    <Card className="p-6 border-border shadow-card">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Share2 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Performance by Platform</h3>
            <p className="text-sm text-muted-foreground">Compare platforms side by side</p>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={mockData} layout="vertical" barCategoryGap={16}>
            <XAxis
              type="number"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatValue}
            />
            <YAxis
              type="category"
              dataKey="platform"
              width={80}
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tick={({ x, y, payload }) => (
                <text
                  x={x}
                  y={y}
                  dy={4}
                  textAnchor="end"
                  fill={payload.value === "Total" ? "hsl(var(--primary))" : "hsl(var(--foreground))"}
                  fontWeight={payload.value === "Total" ? 600 : 400}
                  fontSize={12}
                >
                  {payload.value}
                </text>
              )}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              formatter={(value: number, name: string) => [formatValue(value), name.charAt(0).toUpperCase() + name.slice(1)]}
            />
            <Legend
              wrapperStyle={{ paddingTop: "16px" }}
              formatter={(value: string) => value.charAt(0).toUpperCase() + value.slice(1)}
            />
            <Bar dataKey="views" fill={METRIC_COLORS.views} radius={[0, 4, 4, 0]} />
            <Bar dataKey="likes" fill={METRIC_COLORS.likes} radius={[0, 4, 4, 0]} />
            <Bar dataKey="comments" fill={METRIC_COLORS.comments} radius={[0, 4, 4, 0]} />
            <Bar dataKey="shares" fill={METRIC_COLORS.shares} radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>

        <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/5 border border-primary/10">
          <Lightbulb className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <p className="text-sm text-foreground">
            <span className="font-medium">AI Insight:</span> TikTok drives 62% of total reach but only 48% of engagement — 
            optimize CTAs to convert views into interactions.
          </p>
        </div>
      </div>
    </Card>
  );
};
