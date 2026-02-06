import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  CalendarIcon, 
  ChevronDown, 
  Instagram, 
  Youtube, 
  RefreshCw,
  Clock,
  Globe,
} from "lucide-react";
import { format } from "date-fns";
import { 
  useInsightsFilters, 
  TimeRangePreset, 
  Platform, 
  PrimaryMetric,
  RefreshInterval,
} from "@/contexts/InsightsFilterContext";
import { cn } from "@/lib/utils";

const TIME_RANGE_QUICK: { value: TimeRangePreset; label: string }[] = [
  { value: "6h", label: "Last 6 hours" },
  { value: "12h", label: "Last 12 hours" },
  { value: "24h", label: "Last 24 hours" },
  { value: "2d", label: "Last 2 days" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
  { value: "6mo", label: "Last 6 months" },
  { value: "1y", label: "Last 1 year" },
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
  { value: "shares", label: "Shares" },
  { value: "engagementRate", label: "ER %" },
];

const REFRESH_OPTIONS: { value: RefreshInterval; label: string }[] = [
  { value: "off", label: "Off" },
  { value: "5m", label: "5m" },
  { value: "15m", label: "15m" },
  { value: "1h", label: "1h" },
  { value: "2h", label: "2h" },
  { value: "6h", label: "6h" },
  { value: "24h", label: "24h" },
];

const TIMEZONE_OPTIONS = [
  { value: "UTC", label: "UTC" },
  { value: "America/New_York", label: "New York (EST)" },
  { value: "America/Los_Angeles", label: "Los Angeles (PST)" },
  { value: "Europe/London", label: "London (GMT)" },
  { value: "Europe/Berlin", label: "Berlin (CET)" },
  { value: "Asia/Tokyo", label: "Tokyo (JST)" },
  { value: "Asia/Shanghai", label: "Shanghai (CST)" },
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
    availableAccounts,
    refreshData,
    lastRefresh,
    recentRanges,
    addRecentRange,
    getTimeRangeLabel,
  } = useInsightsFilters();

  const [isTimeRangeOpen, setIsTimeRangeOpen] = useState(false);
  const [isPlatformOpen, setIsPlatformOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isMetricOpen, setIsMetricOpen] = useState(false);
  const [isRefreshOpen, setIsRefreshOpen] = useState(false);
  const [isTimezoneOpen, setIsTimezoneOpen] = useState(false);
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [activeTab, setActiveTab] = useState<"quick" | "absolute">("quick");

  const handleTimeRangeSelect = (range: TimeRangePreset) => {
    setTimeRange(range);
    setIsTimeRangeOpen(false);
  };

  const handleCustomDateConfirm = () => {
    if (dateRange.from && dateRange.to) {
      addRecentRange(dateRange.from, dateRange.to);
      setCustomDateRange({ from: dateRange.from, to: dateRange.to });
      setIsTimeRangeOpen(false);
    }
  };

  const handleRecentRangeSelect = (from: string, to: string) => {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    setCustomDateRange({ from: fromDate, to: toDate });
    setIsTimeRangeOpen(false);
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

  const getTimezoneLabel = () => {
    const tz = TIMEZONE_OPTIONS.find(t => t.value === filters.timezone);
    if (tz) return tz.label;
    // Get offset for current timezone
    const offset = new Date().getTimezoneOffset();
    const hours = Math.abs(Math.floor(offset / 60));
    const sign = offset <= 0 ? "+" : "-";
    return `UTC${sign}${hours}`;
  };

  return (
    <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl bg-card border border-border">
      {/* Time Range Picker (Grafana-style) */}
      <Popover open={isTimeRangeOpen} onOpenChange={setIsTimeRangeOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2 h-9 min-w-[160px]">
            <CalendarIcon className="w-4 h-4" />
            {getTimeRangeLabel()}
            <ChevronDown className="w-3 h-3 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[420px] p-0" align="start">
          <div className="flex border-b border-border">
            <button
              className={cn(
                "flex-1 px-4 py-2 text-sm font-medium transition-colors",
                activeTab === "quick" 
                  ? "bg-background border-b-2 border-primary text-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setActiveTab("quick")}
            >
              Quick ranges
            </button>
            <button
              className={cn(
                "flex-1 px-4 py-2 text-sm font-medium transition-colors",
                activeTab === "absolute" 
                  ? "bg-background border-b-2 border-primary text-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setActiveTab("absolute")}
            >
              Absolute time range
            </button>
          </div>

          {activeTab === "quick" ? (
            <div className="p-2">
              <ScrollArea className="h-[280px]">
                <div className="space-y-1">
                  {TIME_RANGE_QUICK.map((option) => (
                    <Button
                      key={option.value}
                      variant={filters.timeRange === option.value ? "secondary" : "ghost"}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => handleTimeRangeSelect(option.value)}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          ) : (
            <div className="p-3 space-y-3">
              <div className="text-sm font-medium">Select date range</div>
              <Calendar
                mode="range"
                selected={{ from: dateRange.from, to: dateRange.to }}
                onSelect={(range) => setDateRange({ from: range?.from, to: range?.to })}
                numberOfMonths={2}
                className="pointer-events-auto"
              />
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <div className="text-xs text-muted-foreground">
                  {dateRange.from && dateRange.to 
                    ? `${format(dateRange.from, "MMM d, yyyy")} → ${format(dateRange.to, "MMM d, yyyy")}`
                    : "Select start and end dates"}
                </div>
                <Button
                  size="sm"
                  disabled={!dateRange.from || !dateRange.to}
                  onClick={handleCustomDateConfirm}
                >
                  Apply time range
                </Button>
              </div>

              {recentRanges.length > 0 && (
                <>
                  <Separator />
                  <div className="text-xs font-medium text-muted-foreground">Recently used</div>
                  <div className="space-y-1">
                    {recentRanges.map((range, i) => (
                      <Button
                        key={i}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-xs"
                        onClick={() => handleRecentRangeSelect(range.from, range.to)}
                      >
                        {range.label}
                      </Button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </PopoverContent>
      </Popover>

      {/* Timezone */}
      <Popover open={isTimezoneOpen} onOpenChange={setIsTimezoneOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-1 h-9 text-muted-foreground">
            <Globe className="w-3 h-3" />
            <span className="text-xs">{getTimezoneLabel()}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-2" align="start">
          <div className="space-y-1">
            {TIMEZONE_OPTIONS.map((tz) => (
              <Button
                key={tz.value}
                variant={filters.timezone === tz.value ? "secondary" : "ghost"}
                size="sm"
                className="w-full justify-start"
                onClick={() => {
                  setTimezone(tz.value);
                  setIsTimezoneOpen(false);
                }}
              >
                {tz.label}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

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
          <ScrollArea className="max-h-64">
            <div className="space-y-1">
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
          </ScrollArea>
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
        <PopoverContent className="w-48 p-2" align="start">
          <div className="space-y-1">
            {METRIC_OPTIONS.map((option) => (
              <Button
                key={option.value}
                variant={filters.primaryMetric === option.value ? "secondary" : "ghost"}
                size="sm"
                className="w-full justify-start"
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
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          onClick={refreshData}
          title="Refresh data"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>

        <Popover open={isRefreshOpen} onOpenChange={setIsRefreshOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-1 h-9">
              <Clock className="w-3 h-3" />
              <span className="text-xs">{filters.refreshInterval}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-32 p-2" align="end">
            <div className="space-y-1">
              {REFRESH_OPTIONS.map((option) => (
                <Button
                  key={option.value}
                  variant={filters.refreshInterval === option.value ? "secondary" : "ghost"}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => {
                    setRefreshInterval(option.value);
                    setIsRefreshOpen(false);
                  }}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <span className="text-xs text-muted-foreground hidden md:inline">
          Last: {format(lastRefresh, "HH:mm:ss")}
        </span>
      </div>
    </div>
  );
};
