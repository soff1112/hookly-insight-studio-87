import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

type TimeRange = "7d" | "30d" | "90d" | "custom";

interface InsightsHeaderProps {
  workspaceName?: string;
  accountsCount?: number;
}

export const InsightsHeader = ({ 
  workspaceName = "My Workspace", 
  accountsCount = 3 
}: InsightsHeaderProps) => {
  const [timeRange, setTimeRange] = useState<TimeRange>("7d");
  const [customDate, setCustomDate] = useState<Date | undefined>();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const timeRanges: { value: TimeRange; label: string }[] = [
    { value: "7d", label: "Last 7 days" },
    { value: "30d", label: "Last 30 days" },
    { value: "90d", label: "Last 90 days" },
    { value: "custom", label: "Custom" },
  ];

  const handleTimeRangeChange = (range: TimeRange) => {
    setTimeRange(range);
    if (range === "custom") {
      setIsCalendarOpen(true);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">AI Insights</h1>
        <p className="text-muted-foreground">
          Advanced competitive analytics across your connected accounts
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="text-muted-foreground">
            {workspaceName}
          </Badge>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            {accountsCount} accounts connected
          </Badge>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {timeRanges.map((range) => (
          range.value === "custom" ? (
            <Popover key={range.value} open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant={timeRange === "custom" ? "default" : "outline"}
                  size="sm"
                  className="gap-2"
                  onClick={() => handleTimeRangeChange("custom")}
                >
                  <CalendarIcon className="w-4 h-4" />
                  {timeRange === "custom" && customDate
                    ? format(customDate, "MMM d, yyyy")
                    : "Custom"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={customDate}
                  onSelect={(date) => {
                    setCustomDate(date);
                    setIsCalendarOpen(false);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          ) : (
            <Button
              key={range.value}
              variant={timeRange === range.value ? "default" : "outline"}
              size="sm"
              onClick={() => handleTimeRangeChange(range.value)}
            >
              {range.label}
            </Button>
          )
        ))}
      </div>
    </div>
  );
};
