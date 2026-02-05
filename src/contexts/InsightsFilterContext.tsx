import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { subHours, subDays, subMonths, subYears, startOfYesterday, endOfYesterday } from "date-fns";

export type TimeRangePreset = 
  | "6h" | "12h" | "24h" | "2d" | "7d" | "30d" | "90d" | "6m" | "1y" | "yesterday" | "custom";

export type PrimaryMetric = 
  | "views" | "likes" | "comments" | "shares" | "engagementRate" 
  | "likeRate" | "commentRate" | "avgViewsPerPost";

export type Platform = "instagram" | "tiktok" | "youtube";

export type RefreshInterval = "off" | "30s" | "1m" | "5m" | "15m";

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

interface InsightsFilterContextType {
  filters: InsightsFilters;
  setTimeRange: (range: TimeRangePreset) => void;
  setCustomDateRange: (range: CustomDateRange | null) => void;
  setPlatforms: (platforms: Platform[]) => void;
  setAccounts: (accounts: string[]) => void;
  setPrimaryMetric: (metric: PrimaryMetric) => void;
  setTimezone: (tz: string) => void;
  setRefreshInterval: (interval: RefreshInterval) => void;
  triggerRefresh: () => void;
  refreshKey: number;
  availableAccounts: { id: string; handle: string; isUser: boolean; platform: Platform }[];
  getDateRange: () => { from: Date; to: Date };
  getBucketType: () => "hourly" | "daily" | "weekly";
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
  "6m": "Last 6 months",
  "1y": "Last 1 year",
  "yesterday": "Yesterday",
  "custom": "Custom range",
};

export const getTimeRangeLabel = (range: TimeRangePreset): string => TIME_RANGE_LABELS[range];

export const InsightsFilterProvider = ({ children }: { children: ReactNode }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [refreshKey, setRefreshKey] = useState(0);

  // Initialize from URL params or defaults
  const [filters, setFilters] = useState<InsightsFilters>(() => {
    const urlTimeRange = searchParams.get("range") as TimeRangePreset | null;
    const urlFrom = searchParams.get("from");
    const urlTo = searchParams.get("to");
    const urlPlatforms = searchParams.get("platforms");
    const urlAccounts = searchParams.get("accounts");
    const urlMetric = searchParams.get("metric") as PrimaryMetric | null;
    const urlTimezone = searchParams.get("tz");

    return {
      timeRange: urlTimeRange || "7d",
      customDateRange: urlFrom && urlTo 
        ? { from: new Date(urlFrom), to: new Date(urlTo) }
        : null,
      platforms: urlPlatforms 
        ? urlPlatforms.split(",") as Platform[]
        : ["instagram", "tiktok", "youtube"],
      accounts: urlAccounts 
        ? urlAccounts.split(",")
        : mockAccounts.map(a => a.id),
      primaryMetric: urlMetric || "views",
      timezone: urlTimezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
      refreshInterval: "off",
    };
  });

  // Sync filters to URL
  useEffect(() => {
    const params = new URLSearchParams();
    params.set("range", filters.timeRange);
    if (filters.customDateRange) {
      params.set("from", filters.customDateRange.from.toISOString());
      params.set("to", filters.customDateRange.to.toISOString());
    }
    params.set("platforms", filters.platforms.join(","));
    params.set("accounts", filters.accounts.join(","));
    params.set("metric", filters.primaryMetric);
    params.set("tz", filters.timezone);
    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  // Auto-refresh handler
  useEffect(() => {
    if (filters.refreshInterval === "off") return;

    const intervalMs = {
      "30s": 30000,
      "1m": 60000,
      "5m": 300000,
      "15m": 900000,
    }[filters.refreshInterval];

    const timer = setInterval(() => {
      setRefreshKey(prev => prev + 1);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [filters.refreshInterval]);

  const getDateRange = useCallback((): { from: Date; to: Date } => {
    const now = new Date();
    
    switch (filters.timeRange) {
      case "6h":
        return { from: subHours(now, 6), to: now };
      case "12h":
        return { from: subHours(now, 12), to: now };
      case "24h":
        return { from: subHours(now, 24), to: now };
      case "2d":
        return { from: subDays(now, 2), to: now };
      case "7d":
        return { from: subDays(now, 7), to: now };
      case "30d":
        return { from: subDays(now, 30), to: now };
      case "90d":
        return { from: subDays(now, 90), to: now };
      case "6m":
        return { from: subMonths(now, 6), to: now };
      case "1y":
        return { from: subYears(now, 1), to: now };
      case "yesterday":
        return { from: startOfYesterday(), to: endOfYesterday() };
      case "custom":
        return filters.customDateRange 
          ? { from: filters.customDateRange.from, to: filters.customDateRange.to }
          : { from: subDays(now, 7), to: now };
      default:
        return { from: subDays(now, 7), to: now };
    }
  }, [filters.timeRange, filters.customDateRange]);

  const getBucketType = useCallback((): "hourly" | "daily" | "weekly" => {
    switch (filters.timeRange) {
      case "6h":
      case "12h":
      case "24h":
        return "hourly";
      case "6m":
      case "1y":
        return "weekly";
      default:
        return "daily";
    }
  }, [filters.timeRange]);

  const setTimeRange = (range: TimeRangePreset) => {
    setFilters(prev => ({ 
      ...prev, 
      timeRange: range,
      customDateRange: range !== "custom" ? null : prev.customDateRange 
    }));
  };

  const setCustomDateRange = (range: CustomDateRange | null) => {
    setFilters(prev => ({ ...prev, customDateRange: range, timeRange: "custom" }));
  };

  const setPlatforms = (platforms: Platform[]) => {
    setFilters(prev => ({ 
      ...prev, 
      platforms: platforms.length > 0 ? platforms : ["instagram", "tiktok", "youtube"] 
    }));
  };

  const setAccounts = (accounts: string[]) => {
    setFilters(prev => ({ ...prev, accounts }));
  };

  const setPrimaryMetric = (metric: PrimaryMetric) => {
    setFilters(prev => ({ ...prev, primaryMetric: metric }));
  };

  const setTimezone = (tz: string) => {
    setFilters(prev => ({ ...prev, timezone: tz }));
  };

  const setRefreshInterval = (interval: RefreshInterval) => {
    setFilters(prev => ({ ...prev, refreshInterval: interval }));
  };

  const triggerRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

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
        triggerRefresh,
        refreshKey,
        availableAccounts: mockAccounts,
        getDateRange,
        getBucketType,
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
