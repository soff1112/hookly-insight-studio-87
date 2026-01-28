import { useMemo } from "react";
import { Clock, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { cn } from "@/lib/utils";

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

interface HeatmapCell {
  day: number;
  hour: number;
  value: number;
  isUserPeak: boolean;
  isCompetitorPeak: boolean;
}

export const OptimalTimesHeatmap = () => {
  const { getMainAccount, getTopCompetitors } = useWorkspace();
  
  const mainAccount = getMainAccount();
  const competitors = getTopCompetitors(5);

  const { heatmapData, userPeak, competitorPeak, potentialGain } = useMemo(() => {
    // Generate heatmap data
    const data: HeatmapCell[] = [];
    let maxUserValue = 0;
    let maxCompValue = 0;
    let userPeakCell = { day: 0, hour: 0, value: 0 };
    let compPeakCell = { day: 0, hour: 0, value: 0 };

    for (let day = 0; day < 7; day++) {
      for (let hour = 0; hour < 24; hour++) {
        // Simulate engagement patterns
        // Higher engagement during evening hours (18-22) and weekends
        const baseValue = 3 + Math.random() * 4;
        const eveningBoost = (hour >= 18 && hour <= 22) ? 3 : 0;
        const weekendBoost = (day >= 5) ? 1.5 : 0;
        const lunchBoost = (hour >= 12 && hour <= 14) ? 1 : 0;
        
        const value = baseValue + eveningBoost + weekendBoost + lunchBoost + Math.random() * 2;
        
        if (value > maxCompValue) {
          maxCompValue = value;
          compPeakCell = { day, hour, value };
        }
        
        // User's posting pattern (different from optimal)
        const userValue = (hour >= 14 && hour <= 16) ? value * 0.8 : value * 0.5;
        if (userValue > maxUserValue) {
          maxUserValue = userValue;
          userPeakCell = { day, hour, value: userValue };
        }
        
        data.push({
          day,
          hour,
          value: Number(value.toFixed(1)),
          isUserPeak: false,
          isCompetitorPeak: false
        });
      }
    }

    // Mark peaks
    const peakIndex = data.findIndex(
      d => d.day === compPeakCell.day && d.hour === compPeakCell.hour
    );
    if (peakIndex >= 0) data[peakIndex].isCompetitorPeak = true;

    const userPeakIndex = data.findIndex(
      d => d.day === userPeakCell.day && d.hour === userPeakCell.hour
    );
    if (userPeakIndex >= 0) data[userPeakIndex].isUserPeak = true;

    const gain = ((maxCompValue - maxUserValue) / maxUserValue * 100).toFixed(0);

    return {
      heatmapData: data,
      userPeak: userPeakCell,
      competitorPeak: compPeakCell,
      potentialGain: gain
    };
  }, [competitors]);

  const getColorIntensity = (value: number) => {
    const max = 12;
    const normalized = Math.min(value / max, 1);
    
    if (normalized > 0.8) return 'bg-accent';
    if (normalized > 0.6) return 'bg-accent/70';
    if (normalized > 0.4) return 'bg-primary/60';
    if (normalized > 0.2) return 'bg-primary/30';
    return 'bg-muted/50';
  };

  const formatHour = (hour: number) => {
    if (hour === 0) return '12am';
    if (hour === 12) return '12pm';
    if (hour < 12) return `${hour}am`;
    return `${hour - 12}pm`;
  };

  return (
    <div className="p-5 rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Clock className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Optimal Posting Times</h3>
            <p className="text-sm text-muted-foreground">
              When competitors get highest engagement
            </p>
          </div>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="w-4 h-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs max-w-xs">
                Heatmap shows average ER% by hour and day of week.
                Darker = higher engagement.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Peak Time Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
          <div className="text-xs text-muted-foreground mb-1">Best Time (Competitors)</div>
          <div className="text-lg font-bold text-accent">
            {formatHour(competitorPeak.hour)} - {formatHour(competitorPeak.hour + 1)}
          </div>
          <div className="text-xs text-muted-foreground">
            {DAYS[competitorPeak.day]} • {competitorPeak.value.toFixed(1)}% ER
          </div>
        </div>
        <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
          <div className="text-xs text-muted-foreground mb-1">Your Current Peak</div>
          <div className="text-lg font-bold text-primary">
            {formatHour(userPeak.hour)} - {formatHour(userPeak.hour + 1)}
          </div>
          <div className="text-xs text-muted-foreground">
            {DAYS[userPeak.day]} • {userPeak.value.toFixed(1)}% ER
          </div>
        </div>
        <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
          <div className="text-xs text-muted-foreground mb-1">Potential Gain</div>
          <div className="text-lg font-bold text-yellow-500">+{potentialGain}%</div>
          <div className="text-xs text-muted-foreground">By shifting schedule</div>
        </div>
      </div>

      {/* Heatmap */}
      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          {/* Hour labels */}
          <div className="flex items-center mb-1">
            <div className="w-10" />
            {HOURS.filter((_, i) => i % 3 === 0).map(hour => (
              <div 
                key={hour} 
                className="flex-1 text-center text-[10px] text-muted-foreground"
              >
                {formatHour(hour)}
              </div>
            ))}
          </div>

          {/* Rows */}
          {DAYS.map((day, dayIndex) => (
            <div key={day} className="flex items-center gap-0.5 mb-0.5">
              <div className="w-10 text-xs text-muted-foreground">{day}</div>
              {HOURS.map(hour => {
                const cell = heatmapData.find(d => d.day === dayIndex && d.hour === hour);
                if (!cell) return null;
                
                return (
                  <TooltipProvider key={hour}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={cn(
                            "flex-1 h-5 rounded-sm cursor-pointer transition-all hover:ring-1 hover:ring-primary",
                            getColorIntensity(cell.value),
                            cell.isCompetitorPeak && "ring-2 ring-accent",
                            cell.isUserPeak && "ring-2 ring-primary"
                          )}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">
                          <strong>{day} {formatHour(hour)}</strong><br/>
                          Avg ER: {cell.value}%
                          {cell.isCompetitorPeak && <><br/>🏆 Competitor Peak</>}
                          {cell.isUserPeak && <><br/>⭐ Your Peak</>}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
            </div>
          ))}

          {/* Legend */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-sm bg-muted/50" />
                <span className="text-xs text-muted-foreground">Low</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-sm bg-primary/30" />
                <span className="text-xs text-muted-foreground">Medium</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-sm bg-accent" />
                <span className="text-xs text-muted-foreground">High</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-xs border-accent text-accent">
                🏆 Competitor Peak
              </Badge>
              <Badge variant="outline" className="text-xs border-primary text-primary">
                ⭐ Your Peak
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* AI Insight */}
      <div className="mt-4 p-4 rounded-lg bg-primary/5 border border-primary/20">
        <p className="text-sm text-foreground">
          <span className="font-semibold">💡 Timing Optimization:</span>{' '}
          Competitors see peak engagement at <strong>{formatHour(competitorPeak.hour)}-{formatHour(competitorPeak.hour + 2)} on {DAYS[competitorPeak.day]}</strong>.
          Shifting your posting schedule could yield <strong className="text-accent">+{potentialGain}% ER improvement</strong>.
        </p>
      </div>
    </div>
  );
};
