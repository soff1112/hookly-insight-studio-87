import { Card } from "@/components/ui/card";
import { TrendingUp, Lightbulb } from "lucide-react";
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

const mockData = [
  { date: "Oct 09", avgLikes: 45, avgViews: 120, followers: 21.2 },
  { date: "Oct 10", avgLikes: 52, avgViews: 145, followers: 21.5 },
  { date: "Oct 11", avgLikes: 48, avgViews: 168, followers: 21.8 },
  { date: "Oct 12", avgLikes: 61, avgViews: 195, followers: 22.1 },
  { date: "Oct 13", avgLikes: 55, avgViews: 220, followers: 22.4 },
  { date: "Oct 14", avgLikes: 72, avgViews: 285, followers: 22.8 },
  { date: "Oct 15", avgLikes: 68, avgViews: 310, followers: 23.2 },
];

export const CompetitorPerformanceOverview = () => {
  return (
    <Card className="p-6 border-border">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Competitor Performance Overview</h3>
              <p className="text-sm text-muted-foreground">
                Aggregated metrics from 5-10 tracked competitors + your account
              </p>
            </div>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
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
              yAxisId="left"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}K`}
              label={{ value: 'Followers (K)', angle: -90, position: 'insideLeft', style: { fontSize: 11, fill: 'hsl(var(--muted-foreground))' } }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              label={{ value: 'Views/Likes', angle: 90, position: 'insideRight', style: { fontSize: 11, fill: 'hsl(var(--muted-foreground))' } }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              formatter={(value: number, name: string) => {
                const labels: Record<string, string> = {
                  avgLikes: "Avg Likes/Post",
                  avgViews: "Avg Views/Post",
                  followers: "Total Followers (K)",
                };
                return [name === "followers" ? `${value}K` : value.toLocaleString(), labels[name] || name];
              }}
            />
            <Legend
              wrapperStyle={{ paddingTop: "16px" }}
              formatter={(value: string) => {
                const labels: Record<string, string> = {
                  avgLikes: "Avg Likes per Post",
                  avgViews: "Avg Views per Post",
                  followers: "Total Followers Growth",
                };
                return <span className="text-sm">{labels[value] || value}</span>;
              }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="avgLikes"
              stroke="hsl(163, 82%, 36%)"
              strokeWidth={2}
              dot={{ fill: "hsl(163, 82%, 36%)", r: 3 }}
              activeDot={{ r: 5 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="avgViews"
              stroke="hsl(210, 100%, 50%)"
              strokeWidth={2}
              dot={{ fill: "hsl(210, 100%, 50%)", r: 3 }}
              activeDot={{ r: 5 }}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="followers"
              stroke="hsl(45, 93%, 47%)"
              strokeWidth={2}
              dot={{ fill: "hsl(45, 93%, 47%)", r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>

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
