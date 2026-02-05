import React, { createContext, useContext, useState, ReactNode } from "react";

export type TimeRangePreset = "24h" | "7d" | "30d" | "90d" | "custom";
export type PrimaryMetric = "views" | "likes" | "comments" | "shares" | "engagementRate";
export type Platform = "instagram" | "tiktok" | "youtube";

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
}

interface InsightsFilterContextType {
  filters: InsightsFilters;
  setTimeRange: (range: TimeRangePreset) => void;
  setCustomDateRange: (range: CustomDateRange | null) => void;
  setPlatforms: (platforms: Platform[]) => void;
  setAccounts: (accounts: string[]) => void;
  setPrimaryMetric: (metric: PrimaryMetric) => void;
  availableAccounts: { id: string; handle: string; isUser: boolean; platform: Platform }[];
  timezone: string;
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

export const InsightsFilterProvider = ({ children }: { children: ReactNode }) => {
  const [filters, setFilters] = useState<InsightsFilters>({
    timeRange: "7d",
    customDateRange: null,
    platforms: ["instagram", "tiktok", "youtube"],
    accounts: mockAccounts.map(a => a.id),
    primaryMetric: "views",
  });

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const setTimeRange = (range: TimeRangePreset) => {
    setFilters(prev => ({ ...prev, timeRange: range }));
  };

  const setCustomDateRange = (range: CustomDateRange | null) => {
    setFilters(prev => ({ ...prev, customDateRange: range, timeRange: "custom" }));
  };

  const setPlatforms = (platforms: Platform[]) => {
    setFilters(prev => ({ ...prev, platforms: platforms.length > 0 ? platforms : ["instagram", "tiktok", "youtube"] }));
  };

  const setAccounts = (accounts: string[]) => {
    setFilters(prev => ({ ...prev, accounts }));
  };

  const setPrimaryMetric = (metric: PrimaryMetric) => {
    setFilters(prev => ({ ...prev, primaryMetric: metric }));
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
        availableAccounts: mockAccounts,
        timezone,
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
