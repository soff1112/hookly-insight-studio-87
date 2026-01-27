// Analytics Data Types for Hookly Dashboard

export interface PlatformMetrics {
  views: number;
  likes: number;
  comments: number;
  shares: number;
  followers: number;
  engagementRate: number;
  postsCount: number;
}

export interface BloggerData {
  id: string;
  name: string;
  handle: string;
  platform: "tiktok" | "youtube" | "instagram";
  projectId: string;
  avatar?: string;
  metrics: {
    totalViews: number;
    totalLikes: number;
    totalComments: number;
    totalReposts: number;
    postsCount: number;
    engagementRate: number;
    postsPerDay: number;
    contributionShare: number;
    consistencyScore: number;
  };
  timeSeriesData: Array<{
    date: string;
    views: number;
    likes: number;
    comments: number;
  }>;
}

export interface VideoData {
  id: string;
  bloggerId: string;
  bloggerName: string;
  platform: "tiktok" | "youtube" | "instagram";
  title: string;
  thumbnail?: string;
  publishedAt: string;
  metrics: {
    views: number;
    likes: number;
    comments: number;
    reposts: number;
    engagementRate: number;
    firstHourViews: number;
    viewsAfter24h: number;
  };
  hookType: string;
  duration: number;
}

export interface ProjectData {
  id: string;
  name: string;
  niche: string;
  color: string;
  totalViews: number;
  totalEngagement: number;
  avgER: number;
  postsCount: number;
  momentum: number;
  bloggerIds: string[];
}

export interface CompetitorData {
  id: string;
  handle: string;
  platform: "tiktok" | "youtube" | "instagram";
  avatar?: string;
  metrics: {
    followers: number;
    avgViews: number;
    avgLikes: number;
    engagementRate: number;
    postsPerDay: number;
    viralityScore: number;
    followerGrowthRate: number;
  };
  topHookType: string;
  isUser?: boolean;
}

export interface AnalyticsOverview {
  platforms: {
    tiktok: PlatformMetrics;
    youtube: PlatformMetrics;
    instagram: PlatformMetrics;
  };
  bloggers: BloggerData[];
  videos: VideoData[];
  projects: ProjectData[];
  competitors: CompetitorData[];
  totals: {
    views: number;
    likes: number;
    comments: number;
    reposts: number;
    posts: number;
    avgER: number;
  };
}

export type TimeRange = "1D" | "2D" | "3D" | "7D" | "All";
export type SortOrder = "asc" | "desc";
