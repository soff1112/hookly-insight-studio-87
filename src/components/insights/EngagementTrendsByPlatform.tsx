import { Card } from "@/components/ui/card";
import { BarChart3, Lightbulb } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const mockData = [
  {
    platform: "TikTok",
    you: 3.5,
    topcompetitor: 8.2,
    viralcreator: 6.9,
    contentking: 7.4,
  },
  {
    platform: "YouTube",
    you: 2.8,
    topcompetitor: 5.6,
    viralcreator: 4.9,
    contentking: 5.2,
  },
  {
    platform: "Instagram",
    you: 4.2,
    topcompetitor: 7.1,
    viralcreator: 6.2,
    contentking: 6.8,
  },
];

const platformViews = [
  { platform: "TikTok", views: 45000, color: "hsl(var(--destructive))" },
  { platform: "YouTube", views: 89000, color: "hsl(var(--destructive))" },
  { platform: "Instagram", views: 12000, color: "hsl(252, 76%, 66%)" },
];

export const EngagementTrendsByPlatform = () => {
  const formatValue = (value: number) => `${value}%`;

  return (
    <Card className="p-6 border-border">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <BarChart3 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Engagement Trends by Platform</h3>
            <p className="text-sm text-muted-foreground">ER comparison across platforms</p>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={mockData} layout="vertical" barCategoryGap={20}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
            <XAxis
              type="number"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatValue}
              domain={[0, 10]}
            />
            <YAxis
              type="category"
              dataKey="platform"
              width={80}
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              formatter={(value: number) => [`${value}%`, "ER"]}
            />
            <Legend wrapperStyle={{ paddingTop: "12px" }} />
            <Bar dataKey="you" name="You" fill="hsl(163, 82%, 36%)" radius={[0, 4, 4, 0]} barSize={12} />
            <Bar dataKey="topcompetitor" name="@topcompetitor" fill="hsl(210, 100%, 50%)" radius={[0, 4, 4, 0]} barSize={12} />
            <Bar dataKey="viralcreator" name="@viralcreator" fill="hsl(45, 93%, 47%)" radius={[0, 4, 4, 0]} barSize={12} />
            <Bar dataKey="contentking" name="@contentking" fill="hsl(25, 95%, 53%)" radius={[0, 4, 4, 0]} barSize={12} />
          </BarChart>
        </ResponsiveContainer>

        <div className="flex flex-wrap gap-4 pt-2">
          {platformViews.map((item) => (
            <div key={item.platform} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-muted-foreground">
                {item.platform}: <span className="font-medium text-foreground">{item.views.toLocaleString()} views</span>
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/5 border border-primary/10">
          <Lightbulb className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <p className="text-sm text-foreground">
            <span className="font-medium">Insight:</span> You're 3 spots from top—boost views by 15% via competitor-style hooks. 
            Your growth is +2.8% vs top competitor's +5.2%.
          </p>
        </div>
      </div>
    </Card>
  );
};
