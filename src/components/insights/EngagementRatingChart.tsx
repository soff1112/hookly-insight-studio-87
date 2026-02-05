import { Card } from "@/components/ui/card";
import { BarChart3, Lightbulb } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const mockData = [
  { title: "Morning routine that changed...", date: "Feb 2", platform: "tiktok", er: 12.8 },
  { title: "Why I quit my 9-5 job", date: "Jan 31", platform: "instagram", er: 11.2 },
  { title: "3 habits for productivity", date: "Feb 1", platform: "youtube", er: 9.8 },
  { title: "Unpopular opinion about...", date: "Jan 29", platform: "tiktok", er: 8.5 },
  { title: "POV: You finally understand", date: "Jan 30", platform: "instagram", er: 7.9 },
  { title: "The truth about success", date: "Jan 28", platform: "tiktok", er: 7.2 },
  { title: "How I saved $10k in 6 months", date: "Feb 3", platform: "youtube", er: 6.8 },
  { title: "Reply to @user question", date: "Jan 27", platform: "tiktok", er: 5.4 },
];

const platformIcons: Record<string, string> = {
  tiktok: "📱",
  instagram: "📷",
  youtube: "▶️",
};

export const EngagementRatingChart = () => {
  return (
    <Card className="p-6 border-border shadow-card">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-accent/10">
            <BarChart3 className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Engagement Rating by Content</h3>
            <p className="text-sm text-muted-foreground">Content ranked by engagement rate</p>
          </div>
        </div>

        <div className="max-h-[360px] overflow-y-auto pr-2">
          <ResponsiveContainer width="100%" height={mockData.length * 48}>
            <BarChart data={mockData} layout="vertical" barCategoryGap={8}>
              <XAxis
                type="number"
                domain={[0, "dataMax"]}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${v}%`}
              />
              <YAxis
                type="category"
                dataKey="title"
                width={180}
                stroke="hsl(var(--muted-foreground))"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tick={({ x, y, payload }) => (
                  <g transform={`translate(${x},${y})`}>
                    <text
                      x={-8}
                      y={0}
                      dy={4}
                      textAnchor="end"
                      fill="hsl(var(--foreground))"
                      fontSize={11}
                    >
                      {platformIcons[mockData.find((d) => d.title === payload.value)?.platform || ""] || ""}{" "}
                      {payload.value.length > 24 ? `${payload.value.slice(0, 24)}...` : payload.value}
                    </text>
                  </g>
                )}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                formatter={(value: number) => [`${value}%`, "Engagement Rate"]}
                labelFormatter={(label) => {
                  const item = mockData.find((d) => d.title === label);
                  return `${item?.title} • ${item?.date}`;
                }}
              />
              <Bar dataKey="er" radius={[0, 4, 4, 0]}>
                {mockData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === 0 ? "hsl(163, 82%, 36%)" : "hsl(252, 76%, 66%)"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-start gap-3 p-4 rounded-lg bg-accent/5 border border-accent/10">
          <Lightbulb className="w-5 h-5 text-accent shrink-0 mt-0.5" />
          <p className="text-sm text-foreground">
            <span className="font-medium">AI Insight:</span> Top ER content consistently uses short emotional hooks 
            under 3 seconds. Consider testing this pattern on your next posts.
          </p>
        </div>
      </div>
    </Card>
  );
};
