import { useMemo, useCallback } from "react";
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
import { TrendingUp } from "lucide-react";
import { useInsightsFilters } from "@/contexts/InsightsFilterContext";
import { GrafanaPanel } from "./GrafanaPanel";
import { useInteractiveLegend } from "@/hooks/useInteractiveLegend";
import { format, eachDayOfInterval, eachHourOfInterval } from "date-fns";

const SERIES_COLORS = {
  views: "hsl(252, 76%, 66%)",
  likes: "hsl(163, 82%, 36%)",
  comments: "hsl(45, 93%, 47%)",
  shares: "hsl(329, 78%, 60%)",
};

const SERIES_LABELS = {
  views: "Views",
  likes: "Likes",
  comments: "Comments",
  shares: "Shares",
};

const formatValue = (value: number) => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value.toLocaleString();
};

export const MetricChangesPanel = () => {
  const { filters, getDateRange, lastRefresh } = useInsightsFilters();
  const seriesKeys = Object.keys(SERIES_COLORS);
  const { handleLegendClick, isSeriesVisible, getSeriesOpacity } = useInteractiveLegend(seriesKeys);

  const chartData = useMemo(() => {
    const { from, to } = getDateRange();
    const isShortRange = ["6h", "12h", "24h"].includes(filters.timeRange);
    
    const dates = isShortRange
      ? eachHourOfInterval({ start: from, end: to })
      : eachDayOfInterval({ start: from, end: to });

    const dateFormat = isShortRange ? "HH:mm" : "MMM d";

    return dates.map((date) => {
      const views = Math.floor(Math.random() * 500000) + 100000;
      const likes = Math.floor(views * (Math.random() * 0.08 + 0.02));
      const comments = Math.floor(likes * (Math.random() * 0.15 + 0.05));
      const shares = Math.floor(likes * (Math.random() * 0.25 + 0.08));

      return {
        date: format(date, dateFormat),
        fullDate: format(date, "PPP p"),
        views,
        likes,
        comments,
        shares,
      };
    });
  }, [filters.timeRange, getDateRange, lastRefresh]);

  const handleExportCSV = useCallback(() => {
    const headers = ["Date", "Views", "Likes", "Comments", "Shares"];
    const rows = chartData.map(d => [
      d.fullDate,
      d.views.toString(),
      d.likes.toString(),
      d.comments.toString(),
      d.shares.toString(),
    ]);
    return [headers, ...rows];
  }, [chartData]);

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap justify-center gap-4 pt-4">
        {payload?.map((entry: any) => (
          <button
            key={entry.dataKey}
            className="flex items-center gap-2 text-sm cursor-pointer hover:opacity-80 transition-opacity"
            style={{ opacity: isSeriesVisible(entry.dataKey) ? 1 : 0.3 }}
            onClick={(e) => handleLegendClick(entry.dataKey, e)}
            title="Click to toggle, Shift+click to isolate"
          >
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span>{SERIES_LABELS[entry.dataKey as keyof typeof SERIES_LABELS]}</span>
          </button>
        ))}
      </div>
    );
  };

  return (
    <GrafanaPanel
      title="Metric Changes by Date"
      subtitle="Views, Likes, Comments, and Shares over time"
      icon={TrendingUp}
      panelId="metric-changes"
      onExportCSV={handleExportCSV}
    >
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
            labelFormatter={(_, payload) => payload?.[0]?.payload?.fullDate}
            formatter={(value: number, name: string) => [
              formatValue(value),
              SERIES_LABELS[name as keyof typeof SERIES_LABELS],
            ]}
          />
          <Legend content={<CustomLegend />} />
          {Object.entries(SERIES_COLORS).map(([key, color]) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={color}
              strokeWidth={2}
              dot={{ r: 2 }}
              activeDot={{ r: 4 }}
              strokeOpacity={getSeriesOpacity(key)}
              hide={!isSeriesVisible(key)}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </GrafanaPanel>
  );
};
