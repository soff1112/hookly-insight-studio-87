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

const formatValue = (value: number) => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value.toLocaleString();
};

const formatTooltipValue = (value: number) => {
  return value.toLocaleString();
};

export const MetricChangesChart = () => {
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
      const dayFactor = Math.sin(index * 0.5) * 0.15 + 1;
      const peakDay = index === 4; // Peak around Feb 3
      
      const views = Math.floor((350000 + Math.random() * 100000) * dayFactor * (peakDay ? 1.4 : 1));
      const likes = Math.floor(views * 0.035 + Math.random() * 5000);
      const comments = Math.floor(views * 0.003 + Math.random() * 800);
      const shares = Math.floor(views * 0.002 + Math.random() * 500);
      
      return {
        date: format(date, dateFormat),
        fullDate: format(date, "PPP"),
        views,
        likes,
        comments,
        shares,
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
              <CardTitle className="text-lg">Metric Changes by Date</CardTitle>
              <CardDescription>
                Views, Likes, Comments, and Shares over time
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
                formatTooltipValue(value),
                name.charAt(0).toUpperCase() + name.slice(1),
              ]}
            />
            <Legend
              wrapperStyle={{ paddingTop: "16px" }}
              formatter={(value: string) => value.charAt(0).toUpperCase() + value.slice(1)}
            />
            <Line
              type="monotone"
              dataKey="views"
              stroke="hsl(252, 76%, 66%)"
              strokeWidth={2}
              dot={{ r: 3, fill: "hsl(252, 76%, 66%)" }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="likes"
              stroke="hsl(163, 82%, 36%)"
              strokeWidth={2}
              dot={{ r: 3, fill: "hsl(163, 82%, 36%)" }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="comments"
              stroke="hsl(45, 93%, 47%)"
              strokeWidth={2}
              dot={{ r: 3, fill: "hsl(45, 93%, 47%)" }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="shares"
              stroke="hsl(329, 78%, 60%)"
              strokeWidth={2}
              dot={{ r: 3, fill: "hsl(329, 78%, 60%)" }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
