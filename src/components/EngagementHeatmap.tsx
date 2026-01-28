import { useState } from "react";
import { DashboardCard } from "@/components/DashboardCard";
import { Button } from "@/components/ui/button";
import { Grid3X3, LineChart } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

type HeatmapCell = {
  date: string;
  blogger: string;
  engagementRate: number;
};

const bloggers = [
  "@fitness_guru_daily",
  "@yoga_lifestyle",
  "@mindful_living",
  "@wellness_coach",
  "@healthy_habits",
  "@fit_motivation",
];

const dates = ["Jan 20", "Jan 21", "Jan 22", "Jan 23", "Jan 24", "Jan 25", "Jan 26", "Jan 27", "Jan 28"];

// Generate mock heatmap data
const generateHeatmapData = (): HeatmapCell[] => {
  const data: HeatmapCell[] = [];
  bloggers.forEach(blogger => {
    dates.forEach(date => {
      data.push({
        date,
        blogger,
        engagementRate: Math.random() * 12 + 2 // 2-14% ER
      });
    });
  });
  return data;
};

const heatmapData = generateHeatmapData();

// Generate line chart data
const lineChartData = dates.map(date => {
  const entry: Record<string, string | number> = { date };
  bloggers.forEach(blogger => {
    const cell = heatmapData.find(c => c.date === date && c.blogger === blogger);
    entry[blogger] = cell ? parseFloat(cell.engagementRate.toFixed(1)) : 0;
  });
  return entry;
});

const bloggerColors = [
  "hsl(252 76% 66%)",  // primary purple
  "hsl(163 82% 36%)",  // accent green
  "hsl(210 100% 50%)", // blue
  "hsl(45 93% 47%)",   // yellow
  "hsl(0 84% 60%)",    // red
  "hsl(280 80% 60%)",  // violet
];

const getHeatmapColor = (er: number): string => {
  const intensity = Math.min(er / 12, 1);
  const lightness = 90 - (intensity * 50);
  return `hsl(163 82% ${lightness}%)`;
};

export const EngagementHeatmap = () => {
  const [viewMode, setViewMode] = useState<"heatmap" | "line">("heatmap");
  const [platform, setPlatform] = useState<string>("all");
  const [topN, setTopN] = useState<string>("6");

  const displayedBloggers = bloggers.slice(0, parseInt(topN));

  return (
    <DashboardCard>
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Grid3X3 className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Engagement Rating Visualization</h3>
          </div>

          <div className="flex items-center gap-2">
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger className="w-[130px] h-9">
                <SelectValue placeholder="Platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="tiktok">TikTok</SelectItem>
                <SelectItem value="youtube">YouTube</SelectItem>
              </SelectContent>
            </Select>

            <Select value={topN} onValueChange={setTopN}>
              <SelectTrigger className="w-[120px] h-9">
                <SelectValue placeholder="Top N" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">Top 3</SelectItem>
                <SelectItem value="5">Top 5</SelectItem>
                <SelectItem value="6">Top 6</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex border border-border rounded-md overflow-hidden">
              <Button
                variant={viewMode === "heatmap" ? "default" : "ghost"}
                size="sm"
                className="rounded-none h-9"
                onClick={() => setViewMode("heatmap")}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "line" ? "default" : "ghost"}
                size="sm"
                className="rounded-none h-9"
                onClick={() => setViewMode("line")}
              >
                <LineChart className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          Engagement rates by blogger over time
        </p>

        {viewMode === "heatmap" ? (
          <div className="space-y-2 overflow-x-auto">
            {/* Header row with dates */}
            <div className="flex items-center gap-1">
              <div className="w-36 shrink-0" />
              {dates.map(date => (
                <div 
                  key={date}
                  className="w-16 h-8 flex items-center justify-center text-xs text-muted-foreground shrink-0"
                >
                  {date}
                </div>
              ))}
            </div>

            {/* Data rows */}
            {displayedBloggers.map(blogger => (
              <div key={blogger} className="flex items-center gap-1">
                <div className="w-36 text-sm text-muted-foreground truncate shrink-0">
                  {blogger}
                </div>
                {dates.map(date => {
                  const cell = heatmapData.find(c => c.date === date && c.blogger === blogger);
                  const er = cell?.engagementRate || 0;
                  return (
                    <div 
                      key={`${blogger}-${date}`}
                      className="w-16 h-10 rounded-md flex items-center justify-center text-xs font-medium shrink-0 cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all"
                      style={{ backgroundColor: getHeatmapColor(er) }}
                      title={`${blogger} on ${date}: ${er.toFixed(1)}% ER`}
                    >
                      {er.toFixed(1)}%
                    </div>
                  );
                })}
              </div>
            ))}

            {/* Legend */}
            <div className="flex items-center gap-4 pt-4">
              <span className="text-xs text-muted-foreground">ER Scale:</span>
              <div className="flex items-center gap-1">
                <div className="w-8 h-4 rounded" style={{ backgroundColor: getHeatmapColor(2) }} />
                <span className="text-xs text-muted-foreground">2%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-8 h-4 rounded" style={{ backgroundColor: getHeatmapColor(6) }} />
                <span className="text-xs text-muted-foreground">6%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-8 h-4 rounded" style={{ backgroundColor: getHeatmapColor(10) }} />
                <span className="text-xs text-muted-foreground">10%+</span>
              </div>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <RechartsLineChart data={lineChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--primary) / 0.1)" />
              <XAxis 
                dataKey="date" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                label={{ value: 'ER %', angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: 'hsl(var(--muted-foreground))' } }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
                formatter={(value: number) => [`${value}%`, '']}
              />
              <Legend 
                wrapperStyle={{ paddingTop: '10px', fontSize: '11px' }}
              />
              {displayedBloggers.map((blogger, index) => (
                <Line
                  key={blogger}
                  type="monotone"
                  dataKey={blogger}
                  stroke={bloggerColors[index]}
                  strokeWidth={2}
                  dot={{ r: 3, fill: bloggerColors[index] }}
                  activeDot={{ r: 5 }}
                />
              ))}
            </RechartsLineChart>
          </ResponsiveContainer>
        )}
      </div>
    </DashboardCard>
  );
};
