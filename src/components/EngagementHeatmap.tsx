import { useState, useMemo } from "react";
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
import { SectionHeader } from "@/components/insights/SectionHeader";
import { InterpretationRow } from "@/components/insights/InterpretationRow";
import { ActionBar } from "@/components/insights/ActionBar";

type HeatmapCell = {
  date: string;
  blogger: string;
  engagementRate: number;
};

// All connected accounts - NO selector needed
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

// Check if text should be dark for contrast
const shouldUseDarkText = (er: number): boolean => {
  return er < 8;
};

export const EngagementHeatmap = () => {
  const [viewMode, setViewMode] = useState<"heatmap" | "line">("heatmap");
  const [platform, setPlatform] = useState<string>("all");

  // Calculate avg ER per blogger and sort descending
  const bloggerAvgER = useMemo(() => {
    return bloggers.map(blogger => {
      const bloggerCells = heatmapData.filter(c => c.blogger === blogger);
      const avgER = bloggerCells.reduce((sum, c) => sum + c.engagementRate, 0) / bloggerCells.length;
      return { blogger, avgER };
    }).sort((a, b) => b.avgER - a.avgER);
  }, []);

  const sortedBloggers = bloggerAvgER.map(b => b.blogger);
  const topPerformer = bloggerAvgER[0];
  const volatileCreator = bloggerAvgER.find((_, i) => i > 0); // Example for insight

  // Calculate if we have enough data for insights
  const hasEnoughData = bloggers.length >= 2 && dates.length >= 3;

  return (
    <DashboardCard>
      <div className="space-y-4">
        <SectionHeader
          level={4}
          title="Engagement Rating Visualization"
          subtitle="Daily ER per creator to spot consistency and outliers"
          timeRange="Last 9 days"
          dataScope={`${bloggers.length} accounts`}
          sampleSize={`${bloggers.length * dates.length} data points`}
          tooltip="Shows engagement rate patterns across all connected accounts. Darker cells indicate higher ER. Sorted by average ER (descending)."
        />

        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            {/* Platform filter only - NO Top N selector */}
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger className="w-[140px] h-9">
                <SelectValue placeholder="Platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="tiktok">TikTok</SelectItem>
                <SelectItem value="youtube">YouTube</SelectItem>
              </SelectContent>
            </Select>

            <span className="text-xs text-muted-foreground ml-2">
              Sorted by Avg ER ↓
            </span>
          </div>

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

        {viewMode === "heatmap" ? (
          <div className="space-y-2 overflow-x-auto">
            {/* Header row with dates */}
            <div className="flex items-center gap-1">
              <div className="w-40 shrink-0 text-[10px] uppercase tracking-wide text-muted-foreground font-medium">
                Creator (by Avg ER)
              </div>
              {dates.map(date => (
                <div 
                  key={date}
                  className="w-16 h-8 flex items-center justify-center text-xs text-muted-foreground shrink-0"
                >
                  {date}
                </div>
              ))}
              <div className="w-14 text-center text-[10px] uppercase tracking-wide text-muted-foreground font-medium shrink-0">
                Avg
              </div>
            </div>

            {/* Data rows - sorted by avg ER */}
            {sortedBloggers.map((blogger, bloggerIndex) => {
              const avgER = bloggerAvgER.find(b => b.blogger === blogger)?.avgER || 0;
              return (
                <div key={blogger} className="flex items-center gap-1">
                  <div className="w-40 text-sm text-muted-foreground truncate shrink-0 flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground/60 w-4">#{bloggerIndex + 1}</span>
                    {blogger}
                  </div>
                  {dates.map(date => {
                    const cell = heatmapData.find(c => c.date === date && c.blogger === blogger);
                    const er = cell?.engagementRate || 0;
                    const useDarkText = shouldUseDarkText(er);
                    return (
                      <div 
                        key={`${blogger}-${date}`}
                        className="w-16 h-10 rounded-md flex items-center justify-center text-xs font-medium shrink-0 cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all"
                        style={{ 
                          backgroundColor: getHeatmapColor(er),
                          color: useDarkText ? 'hsl(var(--foreground))' : 'white'
                        }}
                        title={`${blogger} on ${date}: ${er.toFixed(1)}% ER`}
                      >
                        {er.toFixed(1)}%
                      </div>
                    );
                  })}
                  <div className="w-14 text-center text-xs font-semibold text-foreground shrink-0">
                    {avgER.toFixed(1)}%
                  </div>
                </div>
              );
            })}

            {/* Legend - standardized with consistent styling */}
            <div className="flex items-center gap-4 pt-4 border-t border-border/30 mt-4">
              <span className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">ER Scale:</span>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-4 rounded" style={{ backgroundColor: getHeatmapColor(2) }} />
                  <span className="text-xs text-muted-foreground">2%</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-4 rounded" style={{ backgroundColor: getHeatmapColor(6) }} />
                  <span className="text-xs text-muted-foreground">6%</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-4 rounded" style={{ backgroundColor: getHeatmapColor(10) }} />
                  <span className="text-xs text-muted-foreground">10%</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-4 rounded" style={{ backgroundColor: getHeatmapColor(14) }} />
                  <span className="text-xs text-muted-foreground">14%+</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <RechartsLineChart data={lineChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
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
                tickFormatter={(value) => `${value}%`}
                label={{ value: 'ER %', angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: 'hsl(var(--muted-foreground))' } }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value: number, name: string) => [`${value}%`, name]}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Legend 
                wrapperStyle={{ paddingTop: '16px', fontSize: '11px' }}
                iconType="circle"
                iconSize={8}
              />
              {sortedBloggers.map((blogger, index) => (
                <Line
                  key={blogger}
                  type="monotone"
                  dataKey={blogger}
                  stroke={bloggerColors[index % bloggerColors.length]}
                  strokeWidth={2}
                  dot={{ r: 3, fill: bloggerColors[index % bloggerColors.length] }}
                  activeDot={{ r: 5 }}
                />
              ))}
            </RechartsLineChart>
          </ResponsiveContainer>
        )}

        {/* Interpretation Row */}
        {hasEnoughData ? (
          <InterpretationRow
            interpretation={`${topPerformer.blogger} leads with ${topPerformer.avgER.toFixed(1)}% avg ER across all days. Lower-ranked creators show inconsistency—investigate their content patterns for optimization opportunities.`}
            confidence={`Based on ${bloggers.length * dates.length} data points`}
          />
        ) : (
          <InterpretationRow
            interpretation="Not enough data for insights. Connect more accounts or wait for more data to accumulate."
          />
        )}

        {/* Action Bar */}
        <ActionBar
          primaryLabel="Open creator breakdown"
          onPrimaryAction={() => console.log("Open creator breakdown")}
          secondaryLabel="View underlying posts"
          onSecondaryAction={() => console.log("Show underlying posts")}
        />
      </div>
    </DashboardCard>
  );
};
