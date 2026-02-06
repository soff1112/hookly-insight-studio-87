import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { subHours, subDays, subMonths, subYears, parseISO, format } from "date-fns";

export type TimeRangePreset = 
  | "6h" | "12h" | "24h" | "2d" | "7d" | "30d" | "90d" | "6mo" | "1y" | "custom";

export type PrimaryMetric = "views" | "likes" | "comments" | "shares" | "engagementRate";
export type Platform = "instagram" | "tiktok" | "youtube";
export type RefreshInterval = "off" | "5m" | "15m" | "1h" | "2h" | "6h" | "24h";

interface CustomDateRange {
  from: Date;
  to: Date;
}

interface InsightsFilters {
  timeRange: TimeRangePreset;
  customDateRange: CustomDateRange | null;
  platforms: Platform[];
  accounts: string[];
  primaryMetric: PrimaryMetric;
  timezone: string;
  refreshInterval: RefreshInterval;
}

interface RecentRange {
  from: string;
  to: string;
  label: string;
}

interface InsightsFilterContextType {
  filters: InsightsFilters;
  setTimeRange: (range: TimeRangePreset) => void;
  setCustomDateRange: (range: CustomDateRange | null) => void;
  setPlatforms: (platforms: Platform[]) => void;
  setAccounts: (accounts: string[]) => void;
  setPrimaryMetric: (metric: PrimaryMetric) => void;
  setTimezone: (tz: string) => void;
  setRefreshInterval: (interval: RefreshInterval) => void;
  availableAccounts: { id: string; handle: string; isUser: boolean; platform: Platform }[];
  refreshData: () => void;
  lastRefresh: Date;
  recentRanges: RecentRange[];
  addRecentRange: (from: Date, to: Date) => void;
  getDateRange: () => { from: Date; to: Date };
  getTimeRangeLabel: () => string;
}

const InsightsFilterContext = createContext<InsightsFilterContextType | undefined>(undefined);

// Mock available accounts
const mockAccounts = [
  { id: "1", handle: "@yourbrand", isUser: true, platform: "tiktok" as Platform },
  { id: "2", handle: "@competitor1", isUser: false, platform: "tiktok" as Platform },
  { id: "3", handle: "@competitor2", isUser: false, platform: "instagram" as Platform },
  { id: "4", handle: "@competitor3", isUser: false, platform: "youtube" as Platform },
  { id: "5", handle: "@competitor4", isUser: false, platform: "tiktok" as Platform },
  { id: "6", handle: "@competitor5", isUser: false, platform: "instagram" as Platform },
];

const TIME_RANGE_LABELS: Record<TimeRangePreset, string> = {
  "6h": "Last 6 hours",
  "12h": "Last 12 hours",
  "24h": "Last 24 hours",
  "2d": "Last 2 days",
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  "90d": "Last 90 days",
  "6mo": "Last 6 months",
  "1y": "Last 1 year",
  "custom": "Custom range",
};

export const InsightsFilterProvider = ({ children }: { children: ReactNode }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Parse URL params on mount
  const getInitialFilters = (): InsightsFilters => {
    const range = (searchParams.get("range") as TimeRangePreset) || "7d";
    const platformsParam = searchParams.get("platforms");
    const accountsParam = searchParams.get("accounts");
    const metric = (searchParams.get("metric") as PrimaryMetric) || "views";
    const tz = searchParams.get("tz") || Intl.DateTimeFormat().resolvedOptions().timeZone;
    const refreshParam = (searchParams.get("refresh") as RefreshInterval) || "2h";
    const fromParam = searchParams.get("from");
    const toParam = searchParams.get("to");

    let customDateRange: CustomDateRange | null = null;
    if (range === "custom" && fromParam && toParam) {
      try {
        customDateRange = { from: parseISO(fromParam), to: parseISO(toParam) };
      } catch {}
    }

    return {
      timeRange: range,
      customDateRange,
      platforms: platformsParam 
        ? (platformsParam.split(",") as Platform[])
        : ["instagram", "tiktok", "youtube"],
      accounts: accountsParam 
        ? accountsParam.split(",")
        : mockAccounts.map(a => a.id),
      primaryMetric: metric,
      timezone: tz,
      refreshInterval: refreshParam,
    };
  };

  const [filters, setFilters] = useState<InsightsFilters>(getInitialFilters);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [recentRanges, setRecentRanges] = useState<RecentRange[]>(() => {
    try {
      const stored = localStorage.getItem("insights-recent-ranges");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Sync filters to URL
  const syncToUrl = useCallback((newFilters: InsightsFilters) => {
    const params = new URLSearchParams();
    params.set("range", newFilters.timeRange);
    params.set("platforms", newFilters.platforms.join(","));
    params.set("accounts", newFilters.accounts.join(","));
    params.set("metric", newFilters.primaryMetric);
    params.set("tz", newFilters.timezone);
    if (newFilters.refreshInterval !== "off") {
      params.set("refresh", newFilters.refreshInterval);
    }
    if (newFilters.timeRange === "custom" && newFilters.customDateRange) {
      params.set("from", newFilters.customDateRange.from.toISOString());
      params.set("to", newFilters.customDateRange.to.toISOString());
    }
    setSearchParams(params, { replace: true });
  }, [setSearchParams]);

  // Setup refresh interval
  useEffect(() => {
    if (refreshTimerRef.current) {
      clearInterval(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }

    if (filters.refreshInterval === "off") return;

    const intervalMs: Record<RefreshInterval, number> = {
      "off": 0,
      "5m": 5 * 60 * 1000,
      "15m": 15 * 60 * 1000,
      "1h": 60 * 60 * 1000,
      "2h": 2 * 60 * 60 * 1000,
      "6h": 6 * 60 * 60 * 1000,
      "24h": 24 * 60 * 60 * 1000,
    };

    refreshTimerRef.current = setInterval(() => {
      setLastRefresh(new Date());
    }, intervalMs[filters.refreshInterval]);

    return () => {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
      }
    };
  }, [filters.refreshInterval]);

  const setTimeRange = useCallback((range: TimeRangePreset) => {
    setFilters(prev => {
      const updated = { ...prev, timeRange: range };
      if (range !== "custom") {
        updated.customDateRange = null;
      }
      syncToUrl(updated);
      return updated;
    });
    setLastRefresh(new Date());
  }, [syncToUrl]);

  const setCustomDateRange = useCallback((range: CustomDateRange | null) => {
    setFilters(prev => {
      const updated = { ...prev, customDateRange: range, timeRange: "custom" as TimeRangePreset };
      syncToUrl(updated);
      return updated;
    });
    setLastRefresh(new Date());
  }, [syncToUrl]);

  const setPlatforms = useCallback((platforms: Platform[]) => {
    setFilters(prev => {
      const defaultPlatforms: Platform[] = ["instagram", "tiktok", "youtube"];
      const updated: InsightsFilters = { ...prev, platforms: platforms.length > 0 ? platforms : defaultPlatforms };
      syncToUrl(updated);
      return updated;
    });
    setLastRefresh(new Date());
  }, [syncToUrl]);

  const setAccounts = useCallback((accounts: string[]) => {
    setFilters(prev => {
      const updated = { ...prev, accounts };
      syncToUrl(updated);
      return updated;
    });
    setLastRefresh(new Date());
  }, [syncToUrl]);

  const setPrimaryMetric = useCallback((metric: PrimaryMetric) => {
    setFilters(prev => {
      const updated = { ...prev, primaryMetric: metric };
      syncToUrl(updated);
      return updated;
    });
  }, [syncToUrl]);

  const setTimezone = useCallback((tz: string) => {
    setFilters(prev => {
      const updated = { ...prev, timezone: tz };
      syncToUrl(updated);
      return updated;
    });
    setLastRefresh(new Date());
  }, [syncToUrl]);

  const setRefreshInterval = useCallback((interval: RefreshInterval) => {
    setFilters(prev => {
      const updated = { ...prev, refreshInterval: interval };
      syncToUrl(updated);
      return updated;
    });
  }, [syncToUrl]);

  const refreshData = useCallback(() => {
    setLastRefresh(new Date());
  }, []);

  const addRecentRange = useCallback((from: Date, to: Date) => {
    const label = `${format(from, "MMM d, yyyy")} - ${format(to, "MMM d, yyyy")}`;
    const newRange: RecentRange = {
      from: from.toISOString(),
      to: to.toISOString(),
      label,
    };

    setRecentRanges(prev => {
      const filtered = prev.filter(r => r.label !== label);
      const updated = [newRange, ...filtered].slice(0, 5);
      localStorage.setItem("insights-recent-ranges", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const getDateRange = useCallback((): { from: Date; to: Date } => {
    const now = new Date();
    
    if (filters.timeRange === "custom" && filters.customDateRange) {
      return filters.customDateRange;
    }

    const ranges: Record<Exclude<TimeRangePreset, "custom">, Date> = {
      "6h": subHours(now, 6),
      "12h": subHours(now, 12),
      "24h": subHours(now, 24),
      "2d": subDays(now, 2),
      "7d": subDays(now, 7),
      "30d": subDays(now, 30),
      "90d": subDays(now, 90),
      "6mo": subMonths(now, 6),
      "1y": subYears(now, 1),
    };

    return {
      from: ranges[filters.timeRange as Exclude<TimeRangePreset, "custom">] || subDays(now, 7),
      to: now,
    };
  }, [filters.timeRange, filters.customDateRange]);

  const getTimeRangeLabel = useCallback((): string => {
    if (filters.timeRange === "custom" && filters.customDateRange) {
      return `${format(filters.customDateRange.from, "MMM d")} - ${format(filters.customDateRange.to, "MMM d")}`;
    }
    return TIME_RANGE_LABELS[filters.timeRange] || "Last 7 days";
  }, [filters.timeRange, filters.customDateRange]);

  return (
    <InsightsFilterContext.Provider
      value={{
        filters,
        setTimeRange,
        setCustomDateRange,
        setPlatforms,
        setAccounts,
        setPrimaryMetric,
        setTimezone,
        setRefreshInterval,
        availableAccounts: mockAccounts,
        refreshData,
        lastRefresh,
        recentRanges,
        addRecentRange,
        getDateRange,
        getTimeRangeLabel,
      }}
    >
      {children}
    </InsightsFilterContext.Provider>
  );
};

export const useInsightsFilters = () => {
  const context = useContext(InsightsFilterContext);
  if (!context) {
    throw new Error("useInsightsFilters must be used within InsightsFilterProvider");
  }
  return context;
};
