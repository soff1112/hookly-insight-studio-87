import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  CalendarIcon, 
  ChevronDown, 
  Instagram, 
  Youtube, 
  RefreshCw,
  Globe,
  Clock
} from "lucide-react";
import { format } from "date-fns";
import { 
  useInsightsFilters, 
  TimeRangePreset, 
  Platform, 
  PrimaryMetric,
  RefreshInterval,
  getTimeRangeLabel
} from "@/contexts/InsightsFilterContext";
import { cn } from "@/lib/utils";

const TIME_RANGE_OPTIONS: { value: TimeRangePreset; label: string }[] = [
  { value: "6h", label: "Last 6 hours" },
  { value: "12h", label: "Last 12 hours" },
  { value: "24h", label: "Last 24 hours" },
  { value: "2d", label: "Last 2 days" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
  { value: "6m", label: "Last 6 months" },
  { value: "1y", label: "Last 1 year" },
  { value: "yesterday", label: "Yesterday" },
];

const PLATFORM_OPTIONS: { value: Platform; label: string; icon: React.ReactNode }[] = [
  { value: "instagram", label: "Instagram", icon: <Instagram className="w-4 h-4" /> },
  { value: "tiktok", label: "TikTok", icon: <span className="text-xs font-bold">TT</span> },
  { value: "youtube", label: "YouTube", icon: <Youtube className="w-4 h-4" /> },
];

const METRIC_OPTIONS: { value: PrimaryMetric; label: string }[] = [
  { value: "views", label: "Views" },
  { value: "likes", label: "Likes" },
  { value: "comments", label: "Comments" },
  { value: "shares", label: "Shares/Reposts" },
  { value: "engagementRate", label: "Engagement Rate %" },
  { value: "likeRate", label: "Like Rate %" },
  { value: "commentRate", label: "Comment Rate %" },
  { value: "avgViewsPerPost", label: "Avg Views/Post" },
];

const REFRESH_OPTIONS: { value: RefreshInterval; label: string }[] = [
  { value: "off", label: "Off" },
  { value: "30s", label: "30s" },
  { value: "1m", label: "1m" },
  { value: "5m", label: "5m" },
  { value: "15m", label: "15m" },
];

const TIMEZONE_OPTIONS = [
  { value: "UTC", label: "UTC" },
  { value: "America/New_York", label: "EST (UTC-5)" },
  { value: "America/Los_Angeles", label: "PST (UTC-8)" },
  { value: "Europe/London", label: "GMT (UTC+0)" },
  { value: "Europe/Paris", label: "CET (UTC+1)" },
  { value: "Asia/Tokyo", label: "JST (UTC+9)" },
  { value: "Asia/Singapore", label: "SGT (UTC+8)" },
];

export const InsightsControlBar = () => {
  const {
    filters,
    setTimeRange,
    setCustomDateRange,
    setPlatforms,
    setAccounts,
    setPrimaryMetric,
    setTimezone,
    setRefreshInterval,
    triggerRefresh,
    availableAccounts,
  } = useInsightsFilters();

  const [isTimeRangeOpen, setIsTimeRangeOpen] = useState(false);
  const [isPlatformOpen, setIsPlatformOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isMetricOpen, setIsMetricOpen] = useState(false);
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: filters.customDateRange?.from,
    to: filters.customDateRange?.to,
  });

  const handleTimeRangeSelect = (range: TimeRangePreset) => {
    setTimeRange(range);
    setIsTimeRangeOpen(false);
  };

  const handleCustomDateConfirm = () => {
    if (dateRange.from && dateRange.to) {
      setCustomDateRange({ from: dateRange.from, to: dateRange.to });
      setIsTimeRangeOpen(false);
    }
  };

  const handlePlatformToggle = (platform: Platform) => {
    const newPlatforms = filters.platforms.includes(platform)
      ? filters.platforms.filter(p => p !== platform)
      : [...filters.platforms, platform];
    setPlatforms(newPlatforms);
  };

  const handleAccountToggle = (accountId: string) => {
    const newAccounts = filters.accounts.includes(accountId)
      ? filters.accounts.filter(a => a !== accountId)
      : [...filters.accounts, accountId];
    setAccounts(newAccounts);
  };

  const getTimeRangeDisplayLabel = () => {
    if (filters.timeRange === "custom" && filters.customDateRange) {
      return `${format(filters.customDateRange.from, "MMM d, yyyy")} - ${format(filters.customDateRange.to, "MMM d, yyyy")}`;
    }
    return getTimeRangeLabel(filters.timeRange);
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

  const getTimezoneAbbr = () => {
    const tz = filters.timezone;
    const tzOption = TIMEZONE_OPTIONS.find(o => o.value === tz);
    if (tzOption) {
      const match = tzOption.label.match(/\(([^)]+)\)/);
      return match ? match[1] : tz;
    }
    return tz.split("/").pop() || tz;
  };

  return (
    <div className="sticky top-0 z-10 flex flex-wrap items-center gap-3 p-4 rounded-xl bg-card border border-border shadow-sm">
      {/* Time Range */}
      <Popover open={isTimeRangeOpen} onOpenChange={setIsTimeRangeOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2 h-9">
            <CalendarIcon className="w-4 h-4" />
            {getTimeRangeDisplayLabel()}
            <ChevronDown className="w-3 h-3 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex">
            {/* Quick ranges */}
            <div className="p-2 border-r border-border min-w-[160px]">
              <p className="text-xs font-medium text-muted-foreground px-2 py-1 mb-1">Quick ranges</p>
              {TIME_RANGE_OPTIONS.map((option) => (
                <Button
                  key={option.value}
                  variant={filters.timeRange === option.value ? "secondary" : "ghost"}
                  size="sm"
                  className="w-full justify-start h-8"
                  onClick={() => handleTimeRangeSelect(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
            
            {/* Absolute range */}
            <div className="p-3">
              <p className="text-xs font-medium text-muted-foreground mb-2">Absolute range</p>
              <Calendar
                mode="range"
                selected={{ from: dateRange.from, to: dateRange.to }}
                onSelect={(range) => setDateRange({ from: range?.from, to: range?.to })}
                numberOfMonths={2}
                className="pointer-events-auto"
              />
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                <div className="text-xs text-muted-foreground">
                  {dateRange.from && dateRange.to && (
                    <>
                      {format(dateRange.from, "MMM d, yyyy")} — {format(dateRange.to, "MMM d, yyyy")}
                    </>
                  )}
                </div>
                <Button
                  size="sm"
                  disabled={!dateRange.from || !dateRange.to}
                  onClick={handleCustomDateConfirm}
                >
                  Apply
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Timezone */}
      <Select value={filters.timezone} onValueChange={setTimezone}>
        <SelectTrigger className="w-auto h-9 gap-1">
          <Globe className="w-3 h-3 opacity-70" />
          <SelectValue>{getTimezoneAbbr()}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {TIMEZONE_OPTIONS.map((tz) => (
            <SelectItem key={tz.value} value={tz.value}>
              {tz.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

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
          <div className="space-y-1">
            {PLATFORM_OPTIONS.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 p-2 rounded-md hover:bg-muted cursor-pointer"
              >
                <Checkbox
                  checked={filters.platforms.includes(option.value)}
                  onCheckedChange={() => handlePlatformToggle(option.value)}
                />
                {option.icon}
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
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
            {availableAccounts.map((account) => (
              <label
                key={account.id}
                className="flex items-center gap-2 p-2 rounded-md hover:bg-muted cursor-pointer"
              >
                <Checkbox
                  checked={filters.accounts.includes(account.id)}
                  onCheckedChange={() => handleAccountToggle(account.id)}
                />
                <span className="text-sm flex-1">{account.handle}</span>
                {account.isUser && (
                  <Badge variant="secondary" className="text-xs">You</Badge>
                )}
              </label>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      <div className="w-px h-6 bg-border" />

      {/* Primary Metric */}
      <Popover open={isMetricOpen} onOpenChange={setIsMetricOpen}>
        <PopoverTrigger asChild>
          <Button variant="default" size="sm" className="gap-2 h-9">
            Metric: {getMetricLabel()}
            <ChevronDown className="w-3 h-3 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-52 p-2" align="start">
          <div className="space-y-1">
            {METRIC_OPTIONS.map((option) => (
              <Button
                key={option.value}
                variant={filters.primaryMetric === option.value ? "secondary" : "ghost"}
                size="sm"
                className="w-full justify-start h-8"
                onClick={() => {
                  setPrimaryMetric(option.value);
                  setIsMetricOpen(false);
                }}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      <div className="flex-1" />

      {/* Refresh Controls */}
      <div className="flex items-center gap-2">
        <Select value={filters.refreshInterval} onValueChange={(v) => setRefreshInterval(v as RefreshInterval)}>
          <SelectTrigger className="w-auto h-9 gap-1">
            <Clock className="w-3 h-3 opacity-70" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {REFRESH_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.value === "off" ? "Auto-refresh: Off" : `Every ${opt.label}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button 
          variant="outline" 
          size="icon" 
          className="h-9 w-9"
          onClick={triggerRefresh}
        >
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
