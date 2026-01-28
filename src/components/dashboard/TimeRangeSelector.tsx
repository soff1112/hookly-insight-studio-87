import { Calendar, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { TimeRange } from "@/types/workspace";
import { cn } from "@/lib/utils";

const TIME_RANGES: { value: TimeRange; label: string; description: string }[] = [
  { value: '1D', label: '1D', description: 'Last 24 hours' },
  { value: '3D', label: '3D', description: 'Last 3 days' },
  { value: '7D', label: '7D', description: 'Last 7 days' },
  { value: '30D', label: '30D', description: 'Last 30 days' },
  { value: 'All', label: 'All', description: 'All time' },
];

interface TimeRangeSelectorProps {
  variant?: 'buttons' | 'dropdown';
  className?: string;
}

export const TimeRangeSelector = ({ 
  variant = 'buttons',
  className 
}: TimeRangeSelectorProps) => {
  const { timeRange, setTimeRange } = useWorkspace();

  if (variant === 'dropdown') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className={cn("h-9 px-3 gap-2 bg-card border-border", className)}
          >
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span>{timeRange}</span>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-card border-border z-50">
          {TIME_RANGES.map((range) => (
            <DropdownMenuItem
              key={range.value}
              onClick={() => setTimeRange(range.value)}
              className={cn(
                "cursor-pointer",
                timeRange === range.value && "bg-primary/10 text-primary"
              )}
            >
              <div className="flex flex-col">
                <span className="font-medium">{range.label}</span>
                <span className="text-xs text-muted-foreground">{range.description}</span>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className={cn("flex items-center gap-1 p-1 rounded-lg bg-secondary/30", className)}>
      {TIME_RANGES.map((range) => (
        <Button
          key={range.value}
          variant={timeRange === range.value ? "default" : "ghost"}
          size="sm"
          onClick={() => setTimeRange(range.value)}
          className={cn(
            "h-7 px-3 text-xs font-medium",
            timeRange === range.value 
              ? "bg-primary text-primary-foreground" 
              : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
          )}
        >
          {range.label}
        </Button>
      ))}
    </div>
  );
};
