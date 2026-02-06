import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, ChevronDown, Instagram, Youtube } from "lucide-react";
import { format } from "date-fns";
import { useInsightsFilters, TimeRangePreset, Platform, PrimaryMetric } from "@/contexts/InsightsFilterContext";
import { cn } from "@/lib/utils";
const TIME_RANGE_OPTIONS: {
  value: TimeRangePreset;
  label: string;
}[] = [{
  value: "24h",
  label: "Last 24 hours"
}, {
  value: "7d",
  label: "Last 7 days"
}, {
  value: "30d",
  label: "Last 30 days"
}, {
  value: "90d",
  label: "Last 90 days"
}, {
  value: "custom",
  label: "Custom range"
}];
const PLATFORM_OPTIONS: {
  value: Platform;
  label: string;
  icon: React.ReactNode;
}[] = [{
  value: "instagram",
  label: "Instagram",
  icon: <Instagram className="w-4 h-4" />
}, {
  value: "tiktok",
  label: "TikTok",
  icon: <span className="text-xs font-bold">TT</span>
}, {
  value: "youtube",
  label: "YouTube",
  icon: <Youtube className="w-4 h-4" />
}];
const METRIC_OPTIONS: {
  value: PrimaryMetric;
  label: string;
}[] = [{
  value: "views",
  label: "Views"
}, {
  value: "likes",
  label: "Likes"
}, {
  value: "comments",
  label: "Comments"
}, {
  value: "shares",
  label: "Shares/Reposts"
}, {
  value: "engagementRate",
  label: "Engagement Rate %"
}];
export const InsightsControlBar = () => {
  const {
    filters,
    setTimeRange,
    setCustomDateRange,
    setPlatforms,
    setAccounts,
    setPrimaryMetric,
    availableAccounts,
    timezone
  } = useInsightsFilters();
  const [isTimeRangeOpen, setIsTimeRangeOpen] = useState(false);
  const [isPlatformOpen, setIsPlatformOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isMetricOpen, setIsMetricOpen] = useState(false);
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined
  });
  const handleTimeRangeSelect = (range: TimeRangePreset) => {
    if (range !== "custom") {
      setTimeRange(range);
      setIsTimeRangeOpen(false);
    }
  };
  const handleCustomDateConfirm = () => {
    if (dateRange.from && dateRange.to) {
      setCustomDateRange({
        from: dateRange.from,
        to: dateRange.to
      });
      setIsTimeRangeOpen(false);
    }
  };
  const handlePlatformToggle = (platform: Platform) => {
    const newPlatforms = filters.platforms.includes(platform) ? filters.platforms.filter(p => p !== platform) : [...filters.platforms, platform];
    setPlatforms(newPlatforms);
  };
  const handleAccountToggle = (accountId: string) => {
    const newAccounts = filters.accounts.includes(accountId) ? filters.accounts.filter(a => a !== accountId) : [...filters.accounts, accountId];
    setAccounts(newAccounts);
  };
  const getTimeRangeLabel = () => {
    if (filters.timeRange === "custom" && filters.customDateRange) {
      return `${format(filters.customDateRange.from, "MMM d")} - ${format(filters.customDateRange.to, "MMM d")}`;
    }
    return TIME_RANGE_OPTIONS.find(o => o.value === filters.timeRange)?.label || "Last 7 days";
  };
  const getPlatformLabel = () => {
    if (filters.platforms.length === 3) return "All Platforms";
    if (filters.platforms.length === 0) return "Select platforms";
    return filters.platforms.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(", ");
  };
  const getAccountLabel = () => {
    if (filters.accounts.length === availableAccounts.length) return "All Accounts";
    if (filters.accounts.length === 0) return "Select accounts";
    return `${filters.accounts.length} selected`;
  };
  const getMetricLabel = () => {
    return METRIC_OPTIONS.find(o => o.value === filters.primaryMetric)?.label || "Views";
  };

  // Get timezone abbreviation
  const getTimezoneAbbr = () => {
    const offset = new Date().getTimezoneOffset();
    const hours = Math.abs(Math.floor(offset / 60));
    const sign = offset <= 0 ? "+" : "-";
    return `UTC${sign}${hours}`;
  };
  return <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl bg-card border border-border">
      {/* Time Range */}
      <Popover open={isTimeRangeOpen} onOpenChange={setIsTimeRangeOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2 h-9">
            <CalendarIcon className="w-4 h-4" />
            {getTimeRangeLabel()}
            <ChevronDown className="w-3 h-3 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-2 space-y-1">
            {TIME_RANGE_OPTIONS.filter(o => o.value !== "custom").map(option => <Button key={option.value} variant={filters.timeRange === option.value ? "secondary" : "ghost"} size="sm" className="w-full justify-start" onClick={() => handleTimeRangeSelect(option.value)}>
                {option.label}
              </Button>)}
            <div className="border-t border-border my-2" />
            <p className="text-xs text-muted-foreground px-2 py-1">Custom Range</p>
            <Calendar mode="range" selected={{
            from: dateRange.from,
            to: dateRange.to
          }} onSelect={range => setDateRange({
            from: range?.from,
            to: range?.to
          })} numberOfMonths={1} className="pointer-events-auto" />
            <Button size="sm" className="w-full mt-2" disabled={!dateRange.from || !dateRange.to} onClick={handleCustomDateConfirm}>
              Apply Range
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <Badge variant="outline" className="text-xs text-muted-foreground">
        {getTimezoneAbbr()}
      </Badge>

      <div className="w-px h-6 bg-border" />

      {/* Platform Filter */}
      <Popover open={isPlatformOpen} onOpenChange={setIsPlatformOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2 h-9">
            {getPlatformLabel()}
            <ChevronDown className="w-3 h-3 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-2" align="start">
          <div className="space-y-2">
            {PLATFORM_OPTIONS.map(option => <label key={option.value} className="flex items-center gap-2 p-2 rounded-md hover:bg-muted cursor-pointer">
                <Checkbox checked={filters.platforms.includes(option.value)} onCheckedChange={() => handlePlatformToggle(option.value)} />
                {option.icon}
                <span className="text-sm">{option.label}</span>
              </label>)}
          </div>
        </PopoverContent>
      </Popover>

      {/* Account Filter */}
      <Popover open={isAccountOpen} onOpenChange={setIsAccountOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2 h-9">
            {getAccountLabel()}
            <ChevronDown className="w-3 h-3 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-2" align="start">
          <div className="max-h-64 overflow-auto space-y-1">
            {availableAccounts.map(account => <label key={account.id} className="flex items-center gap-2 p-2 rounded-md hover:bg-muted cursor-pointer">
                <Checkbox checked={filters.accounts.includes(account.id)} onCheckedChange={() => handleAccountToggle(account.id)} />
                <span className="text-sm flex-1">{account.handle}</span>
                {account.isUser && <Badge variant="secondary" className="text-xs">You</Badge>}
              </label>)}
          </div>
        </PopoverContent>
      </Popover>

      <div className="w-px h-6 bg-border" />

      {/* Primary Metric */}
      <Popover open={isMetricOpen} onOpenChange={setIsMetricOpen}>
        <PopoverTrigger asChild>
          
        </PopoverTrigger>
        <PopoverContent className="w-48 p-2" align="start">
          <div className="space-y-1">
            {METRIC_OPTIONS.map(option => <Button key={option.value} variant={filters.primaryMetric === option.value ? "secondary" : "ghost"} size="sm" className="w-full justify-start" onClick={() => {
            setPrimaryMetric(option.value);
            setIsMetricOpen(false);
          }}>
                {option.label}
              </Button>)}
          </div>
        </PopoverContent>
      </Popover>
    </div>;
};