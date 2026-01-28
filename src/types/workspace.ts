// Workspace-Based Analytics System Types

export type Platform = 'tiktok' | 'youtube' | 'instagram';
export type HookType = 'Question Hook' | 'Shock Value' | 'Tutorial' | 'Emotional Story' | 'Trending Sound' | 'Behind-the-Scenes' | 'List/Countdown' | 'Challenge';
export type PerformanceStatus = 'excellent' | 'good' | 'underperforming';
export type BudgetROI = 'high' | 'medium' | 'low';

export interface WorkspaceSettings {
  defaultTimeRange: TimeRange;
  autoRefreshInsights: boolean;
  emailReportsEnabled: boolean;
  topNCompetitors: number;
}

export interface Workspace {
  id: string;
  name: string;
  niche: string;
  mainAccount: TrackedAccount;
  competitors: TrackedAccount[]; // Up to 20 competitors
  projects: string[]; // Associated project IDs
  bloggers: string[]; // Associated blogger IDs
  createdAt: string;
  lastSyncedAt: string;
  settings: WorkspaceSettings;
}

export interface TrackedAccount {
  id: string;
  platform: Platform;
  handle: string;
  displayName: string;
  profileImageUrl?: string;
  isMainAccount: boolean;
  addedAt: string;
  trackingEnabled: boolean;
  metrics: AccountMetrics;
  timeSeriesData: TimeSeriesDataPoint[];
}

export interface AccountMetrics {
  followers: number;
  followersChange: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  avgViewsPerPost: number;
  avgLikesPerPost: number;
  engagementRate: number; // (likes + comments) / views * 100
  postsPerDay: number;
  viralityScore: number; // actual_views / expected_views * 100
  topHookType: HookType;
  avgVideoDuration: number; // in seconds
  consistencyIndex: number; // 0-100
  lastUpdated: string;
}

export interface TimeSeriesDataPoint {
  date: string; // ISO format
  followers: number;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  engagementRate: number;
  postsCount: number;
}

export interface VideoAnalytics {
  id: string;
  workspaceId: string;
  accountId: string;
  bloggerId?: string;
  projectId?: string;
  platform: Platform;
  title: string;
  caption: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  publishedAt: string;
  duration: number; // seconds
  metrics: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
    engagementRate: number;
    firstHourViews: number;
    viewsAfter24h: number;
  };
  analysis: {
    hookType: HookType;
    hookDuration: number; // seconds
    viralityScore: number;
    peakViewTime: string; // hour of day
    trending: boolean;
    status: 'viral' | 'performing' | 'average' | 'cold';
  };
}

export interface BloggerAnalytics {
  id: string;
  name: string;
  handle: string;
  workspaceId: string;
  platform: Platform;
  avatar?: string;
  metrics: AccountMetrics;
  performance: {
    status: PerformanceStatus;
    contributionPercentage: number;
    postsInPeriod: number;
    expectedPostsPerDay: number;
    trend: number; // percentage change
  };
}

export interface ProjectAnalytics {
  id: string;
  name: string;
  niche: string;
  color: string;
  workspaceId: string;
  bloggerIds: string[];
  metrics: {
    totalViews: number;
    totalEngagement: number;
    avgEngagementRate: number;
    postsCount: number;
    momentum: number; // percentage change
    budgetROI: BudgetROI;
  };
}

export interface AIInsight {
  id: string;
  workspaceId: string;
  type: 'competitor_alert' | 'engagement_gap' | 'virality_trends' | 
        'posting_times' | 'content_frequency' | 'content_type' | 'hook_performance';
  title: string;
  description: string;
  recommendations: string[];
  impact: string; // e.g., "+12% views", "+2.1pp ER"
  dataVisualization?: {
    type: 'pie' | 'bar' | 'line' | 'heatmap';
    data: unknown;
  };
  actionButton: {
    label: string;
    action: string;
  };
  generatedAt: string;
  expiresAt: string; // Insights refresh daily
  priority: 'high' | 'medium' | 'low';
}

export interface EngagementHeatmapData {
  hour: number; // 0-23
  day: number; // 0-6 (Mon-Sun)
  value: number; // ER percentage
}

export interface PostingRhythmData {
  accountId: string;
  accountName: string;
  handle: string;
  isMainAccount: boolean;
  postsPerDay: number;
  viralityScore: number;
  topHookType: HookType;
  consistencyBars: number[]; // 10 values, each 0-100
  rank: number;
}

export interface RankingData {
  position: number;
  totalAccounts: number;
  metric: string;
  trend: 'up' | 'down' | 'stable';
  changeFromLast: number;
}

export type TimeRange = '1D' | '3D' | '7D' | '30D' | 'All';
export type SortOrder = 'asc' | 'desc';

// Platform-specific colors
export const PLATFORM_COLORS: Record<Platform, string> = {
  tiktok: 'hsl(174 100% 47%)', // cyan
  youtube: 'hsl(0 100% 50%)', // red
  instagram: 'hsl(326 78% 51%)' // purple-pink
};

// Performance status colors
export const STATUS_COLORS: Record<PerformanceStatus, string> = {
  excellent: 'hsl(163 82% 36%)', // green
  good: 'hsl(217 91% 60%)', // blue
  underperforming: 'hsl(0 84% 60%)' // red
};

// Virality score thresholds
export const VIRALITY_THRESHOLDS = {
  viral: 150, // 150%+
  performing: 100, // 100-150%
  average: 70, // 70-100%
  cold: 0 // <70%
};

// Hook type performance benchmarks
export const HOOK_TYPE_BENCHMARKS: Record<HookType, number> = {
  'Question Hook': 8.2,
  'Shock Value': 7.8,
  'Emotional Story': 7.5,
  'Behind-the-Scenes': 7.2,
  'Trending Sound': 6.8,
  'Tutorial': 6.5,
  'List/Countdown': 6.2,
  'Challenge': 6.0
};
