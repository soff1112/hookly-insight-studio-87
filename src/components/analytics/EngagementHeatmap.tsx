import { DashboardCard } from "@/components/DashboardCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Info, BarChart3 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Generate engagement data for heatmap
const generateHeatmapData = () => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  return days.map(day => ({
    day,
    hours: hours.map(hour => ({
      hour,
      engagementRate: Math.random() * 12 + 2, // 2-14% ER
      posts: Math.floor(Math.random() * 15) + 1,
    })),
  }));
};

const heatmapData = generateHeatmapData();

const getHeatColor = (er: number): string => {
  if (er >= 10) return "bg-accent";
  if (er >= 8) return "bg-accent/80";
  if (er >= 6) return "bg-primary/60";
  if (er >= 4) return "bg-primary/40";
  return "bg-muted";
};

const getERLabel = (er: number): string => {
  if (er >= 10) return "Excellent";
  if (er >= 8) return "Very Good";
  if (er >= 6) return "Good";
  if (er >= 4) return "Average";
  return "Low";
};

const MetricTooltip = ({ title, formula, interpretation }: { title: string; formula: string; interpretation: string }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger>
        <Info className="w-3.5 h-3.5 text-muted-foreground hover:text-primary transition-colors" />
      </TooltipTrigger>
      <TooltipContent className="max-w-[280px] p-3 space-y-2">
        <p className="font-semibold text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground"><strong>Formula:</strong> {formula}</p>
        <p className="text-xs text-muted-foreground"><strong>How to interpret:</strong> {interpretation}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export const EngagementHeatmap = () => {
  // Find best time slots
  const allSlots = heatmapData.flatMap(d => d.hours.map(h => ({ day: d.day, hour: h.hour, er: h.engagementRate })));
  const sortedSlots = [...allSlots].sort((a, b) => b.er - a.er);
  const topSlots = sortedSlots.slice(0, 5);
  const worstSlots = sortedSlots.slice(-5);

  const formatHour = (hour: number) => {
    if (hour === 0) return "12am";
    if (hour === 12) return "12pm";
    if (hour > 12) return `${hour - 12}pm`;
    return `${hour}am`;
  };

  return (
    <DashboardCard>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-5 h-5 text-primary" />
            <div>
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                Engagement Rating Heatmap
                <MetricTooltip
                  title="Time-Based Engagement Analysis"
                  formula="Avg ER per hour slot across all days"
                  interpretation="Darker = higher engagement. Use to optimize posting schedule."
                />
              </h3>
              <p className="text-sm text-muted-foreground">Engagement rates by day and hour</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">Last 30 days</Badge>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs">
          <span className="text-muted-foreground">ER %:</span>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-muted" />
            <span>Low (2-4%)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-primary/40" />
            <span>Avg (4-6%)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-primary/60" />
            <span>Good (6-8%)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-accent/80" />
            <span>V.Good (8-10%)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-accent" />
            <span>Excellent (10%+)</span>
          </div>
        </div>

        {/* Heatmap */}
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Hour labels */}
            <div className="flex mb-1">
              <div className="w-12" />
              {Array.from({ length: 24 }, (_, i) => (
                <div key={i} className="flex-1 text-center text-[10px] text-muted-foreground">
                  {i % 3 === 0 ? formatHour(i) : ""}
                </div>
              ))}
            </div>

            {/* Rows */}
            {heatmapData.map((dayData) => (
              <div key={dayData.day} className="flex items-center gap-1 mb-1">
                <div className="w-12 text-xs text-muted-foreground font-medium">{dayData.day}</div>
                {dayData.hours.map((hourData) => (
                  <TooltipProvider key={hourData.hour}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div 
                          className={`flex-1 h-6 rounded-sm cursor-pointer transition-all hover:ring-2 hover:ring-primary ${getHeatColor(hourData.engagementRate)}`}
                        />
                      </TooltipTrigger>
                      <TooltipContent className="text-xs">
                        <p className="font-semibold">{dayData.day} {formatHour(hourData.hour)}</p>
                        <p>ER: {hourData.engagementRate.toFixed(1)}% ({getERLabel(hourData.engagementRate)})</p>
                        <p>Posts analyzed: {hourData.posts}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Best & Worst Times */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-accent/10 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
              🔥 Best Posting Times
            </h4>
            <div className="space-y-2">
              {topSlots.map((slot, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-foreground">{slot.day} {formatHour(slot.hour)}</span>
                  <Badge variant="secondary" className="bg-accent/20 text-accent-foreground">
                    {slot.er.toFixed(1)}% ER
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-destructive/10 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
              ⚠️ Avoid These Times
            </h4>
            <div className="space-y-2">
              {worstSlots.map((slot, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-foreground">{slot.day} {formatHour(slot.hour)}</span>
                  <Badge variant="secondary" className="bg-destructive/20 text-destructive">
                    {slot.er.toFixed(1)}% ER
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Insight */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-2">
          <p className="text-sm font-semibold text-foreground">💡 Optimal Posting Schedule</p>
          <p className="text-sm text-foreground">
            Peak engagement windows: <strong>6-9 PM weekdays</strong> and <strong>10 AM-12 PM weekends</strong>. 
            Your current posting peaks at <strong>2 PM</strong> — missing prime engagement by 4+ hours.
          </p>
          <p className="text-xs text-primary">
            → Shifting 50% of posts to optimal windows could increase avg ER by +25-35%.
          </p>
        </div>
      </div>
    </DashboardCard>
  );
};
