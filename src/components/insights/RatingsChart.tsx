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
import { TrendingUp, MoreVertical } from "lucide-react";
import { useInsightsFilters } from "@/contexts/InsightsFilterContext";
import { format, subDays, subHours, eachDayOfInterval, eachHourOfInterval } from "date-fns";
import { Button } from "@/components/ui/button";

const formatPercent = (value: number) => `${value}%`;
const formatViews = (value: number) => {
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value.toString();
};

export const RatingsChart = () => {
  const { filters } = useInsightsFilters();

  const chartData = useMemo(() => {
    const now = new Date();
    let dates: Date[] = [];
    let dateFormat = "MMM d";

    if (filters.timeRange === "24h") {
      dates = eachHourOfInterval({ start: subHours(now, 24), end: now });
      dateFormat = "HH:mm";
    } else if (filters.timeRange === "7d") {
      dates = eachDayOfInterval({ start: subDays(now, 7), end: now });
    } else if (filters.timeRange === "30d") {
      dates = eachDayOfInterval({ start: subDays(now, 30), end: now });
    } else if (filters.timeRange === "90d") {
      dates = eachDayOfInterval({ start: subDays(now, 90), end: now });
    } else if (filters.timeRange === "custom" && filters.customDateRange) {
      dates = eachDayOfInterval({ start: filters.customDateRange.from, end: filters.customDateRange.to });
    } else {
      dates = eachDayOfInterval({ start: subDays(now, 7), end: now });
    }

    return dates.map((date, index) => {
      // Generate realistic mock data with trends
      const dayFactor = Math.sin(index * 0.5) * 0.3 + 1;
      const peakDay = index === 4 || index === 5; // Peak around Feb 3-4
      
      return {
        date: format(date, dateFormat),
        fullDate: format(date, "PPP"),
        likeRate: parseFloat((4 + Math.random() * 4 + (peakDay ? 2 : 0)).toFixed(1)),
        commentRate: parseFloat((0.8 + Math.random() * 0.8).toFixed(2)),
        shareRate: parseFloat((1.2 + Math.random() * 1.2 - index * 0.08).toFixed(2)),
        avgViewsPerPost: Math.floor((40000 + Math.random() * 80000) * dayFactor * (peakDay ? 1.5 : 1)),
      };
    });
  }, [filters]);

  return (
    <Card className="border-border">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Ratings</CardTitle>
              <CardDescription>
                Engagement rates and average views over time
              </CardDescription>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
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
              yAxisId="left"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatPercent}
              domain={[0, 12]}
              label={{ 
                value: 'Rate %', 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle', fill: 'hsl(var(--muted-foreground))', fontSize: 11 }
              }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatViews}
              label={{ 
                value: 'Views', 
                angle: 90, 
                position: 'insideRight',
                style: { textAnchor: 'middle', fill: 'hsl(var(--muted-foreground))', fontSize: 11 }
              }}
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
              formatter={(value: number, name: string) => {
                if (name === "avgViewsPerPost") {
                  return [formatViews(value), "Avg Views/Post"];
                }
                return [`${value}%`, name.replace("Rate", " Rate (%)")];
              }}
            />
            <Legend
              wrapperStyle={{ paddingTop: "16px" }}
              formatter={(value: string) => {
                const labels: Record<string, string> = {
                  likeRate: "Like Rate (%)",
                  commentRate: "Comment Rate (%)",
                  shareRate: "Share Rate (%)",
                  avgViewsPerPost: "Avg Views/Post",
                };
                return labels[value] || value;
              }}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="likeRate"
              stroke="hsl(252, 76%, 66%)"
              strokeWidth={2}
              dot={{ r: 3, fill: "hsl(252, 76%, 66%)" }}
              activeDot={{ r: 5 }}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="commentRate"
              stroke="hsl(163, 82%, 36%)"
              strokeWidth={2}
              dot={{ r: 3, fill: "hsl(163, 82%, 36%)" }}
              activeDot={{ r: 5 }}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="shareRate"
              stroke="hsl(45, 93%, 47%)"
              strokeWidth={2}
              dot={{ r: 3, fill: "hsl(45, 93%, 47%)" }}
              activeDot={{ r: 5 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="avgViewsPerPost"
              stroke="hsl(210, 100%, 50%)"
              strokeWidth={2}
              dot={{ r: 3, fill: "hsl(210, 100%, 50%)" }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
