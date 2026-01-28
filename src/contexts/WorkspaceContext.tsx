import { createContext, useContext, useState, ReactNode, useMemo, useCallback } from "react";
import {
  Workspace,
  TrackedAccount,
  TimeRange,
  Platform,
  AccountMetrics,
  TimeSeriesDataPoint,
  HookType
} from "@/types/workspace";

interface WorkspaceContextType {
  workspaces: Workspace[];
  activeWorkspace: Workspace | null;
  activeWorkspaceId: string | null;
  setActiveWorkspaceId: (id: string | null) => void;
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
  selectedPlatforms: Platform[];
  setSelectedPlatforms: (platforms: Platform[]) => void;
  topNCompetitors: number;
  setTopNCompetitors: (n: number) => void;
  selectedCompetitorIds: string[];
  setSelectedCompetitorIds: (ids: string[]) => void;
  getMainAccount: () => TrackedAccount | null;
  getCompetitors: () => TrackedAccount[];
  getTopCompetitors: (n?: number) => TrackedAccount[];
  getAllTrackedAccounts: () => TrackedAccount[];
  getUserRanking: () => { position: number; total: number; metric: string };
  getAverageMetric: (metric: keyof AccountMetrics) => number;
}

// Generate realistic time series data
const generateTimeSeriesData = (days: number, baseViews: number, baseFollowers: number): TimeSeriesDataPoint[] => {
  const data: TimeSeriesDataPoint[] = [];
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    const variance = 0.8 + Math.random() * 0.4; // 80-120% variance
    const views = Math.round(baseViews * variance);
    const likes = Math.round(views * (0.05 + Math.random() * 0.1)); // 5-15% like rate
    const comments = Math.round(likes * (0.05 + Math.random() * 0.1)); // 5-15% of likes
    const shares = Math.round(comments * (0.3 + Math.random() * 0.4)); // 30-70% of comments
    
    data.push({
      date: date.toISOString().split('T')[0],
      followers: Math.round(baseFollowers + (days - i) * (50 + Math.random() * 200)),
      views,
      likes,
      comments,
      shares,
      engagementRate: ((likes + comments) / views) * 100,
      postsCount: Math.floor(Math.random() * 5) + 1
    });
  }
  
  return data;
};

// Generate account metrics
const generateMetrics = (
  followers: number,
  avgViews: number,
  erBase: number,
  postsPerDay: number,
  hookType: HookType
): AccountMetrics => {
  const totalViews = avgViews * 30 * postsPerDay;
  const er = erBase + (Math.random() - 0.5) * 2;
  const totalLikes = Math.round(totalViews * er * 0.008);
  const totalComments = Math.round(totalLikes * 0.15);
  const totalShares = Math.round(totalComments * 0.5);
  
  return {
    followers,
    followersChange: Math.round(followers * (0.02 + Math.random() * 0.08)),
    totalViews,
    totalLikes,
    totalComments,
    totalShares,
    avgViewsPerPost: avgViews,
    avgLikesPerPost: Math.round(avgViews * er * 0.008),
    engagementRate: Number(er.toFixed(2)),
    postsPerDay,
    viralityScore: Math.round((avgViews / (followers * 0.1)) * 100),
    topHookType: hookType,
    avgVideoDuration: Math.round(15 + Math.random() * 45),
    consistencyIndex: Math.round(60 + Math.random() * 35),
    lastUpdated: new Date().toISOString()
  };
};

// Generate 20 competitors with realistic data
const generateCompetitors = (platform: Platform, niche: string): TrackedAccount[] => {
  const handles = [
    'creator_king', 'viral_queen', 'content_master', 'growth_guru', 'trend_setter',
    'niche_expert', 'follower_magnet', 'engagement_pro', 'hook_genius', 'story_teller',
    'views_machine', 'like_magnet', 'share_worthy', 'comment_king', 'algo_whisperer',
    'reel_master', 'short_form_pro', 'viral_hunter', 'content_wizard', 'growth_hacker'
  ];
  
  const hookTypes: HookType[] = [
    'Question Hook', 'Shock Value', 'Tutorial', 'Emotional Story', 
    'Trending Sound', 'Behind-the-Scenes', 'List/Countdown', 'Challenge'
  ];
  
  return handles.map((handle, index) => {
    const followers = Math.round(50000 + Math.random() * 5000000);
    const avgViews = Math.round(followers * (0.08 + Math.random() * 0.3));
    const erBase = 4 + Math.random() * 8;
    const postsPerDay = 1 + Math.random() * 12;
    const hookType = hookTypes[Math.floor(Math.random() * hookTypes.length)];
    
    return {
      id: `comp_${platform}_${index}`,
      platform,
      handle: `@${handle}_${platform.substring(0, 2)}`,
      displayName: handle.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      profileImageUrl: undefined,
      isMainAccount: false,
      addedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      trackingEnabled: true,
      metrics: generateMetrics(followers, avgViews, erBase, postsPerDay, hookType),
      timeSeriesData: generateTimeSeriesData(30, avgViews, followers)
    };
  });
};

// Mock workspaces with full 20 competitors each
const mockWorkspaces: Workspace[] = [
  {
    id: 'ws_crypto',
    name: 'Crypto Niche',
    niche: 'Cryptocurrency',
    mainAccount: {
      id: 'main_crypto',
      platform: 'tiktok',
      handle: '@crypto_insights',
      displayName: 'Crypto Insights',
      isMainAccount: true,
      addedAt: new Date().toISOString(),
      trackingEnabled: true,
      metrics: generateMetrics(234000, 125000, 4.2, 2.3, 'Tutorial'),
      timeSeriesData: generateTimeSeriesData(30, 125000, 234000)
    },
    competitors: generateCompetitors('tiktok', 'Cryptocurrency'),
    projects: ['proj_1', 'proj_2'],
    bloggers: ['blog_1', 'blog_2', 'blog_3'],
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    lastSyncedAt: new Date().toISOString(),
    settings: {
      defaultTimeRange: '7D',
      autoRefreshInsights: true,
      emailReportsEnabled: false,
      topNCompetitors: 5
    }
  },
  {
    id: 'ws_fashion',
    name: 'Fashion Blog',
    niche: 'Fashion & Lifestyle',
    mainAccount: {
      id: 'main_fashion',
      platform: 'instagram',
      handle: '@style_forward',
      displayName: 'Style Forward',
      isMainAccount: true,
      addedAt: new Date().toISOString(),
      trackingEnabled: true,
      metrics: generateMetrics(890000, 250000, 5.8, 3.5, 'Behind-the-Scenes'),
      timeSeriesData: generateTimeSeriesData(30, 250000, 890000)
    },
    competitors: generateCompetitors('instagram', 'Fashion'),
    projects: ['proj_3'],
    bloggers: ['blog_4', 'blog_5'],
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    lastSyncedAt: new Date().toISOString(),
    settings: {
      defaultTimeRange: '7D',
      autoRefreshInsights: true,
      emailReportsEnabled: true,
      topNCompetitors: 10
    }
  },
  {
    id: 'ws_gaming',
    name: 'Gaming Channel',
    niche: 'Gaming & Esports',
    mainAccount: {
      id: 'main_gaming',
      platform: 'youtube',
      handle: '@pro_gamer_hub',
      displayName: 'Pro Gamer Hub',
      isMainAccount: true,
      addedAt: new Date().toISOString(),
      trackingEnabled: true,
      metrics: generateMetrics(1500000, 500000, 6.2, 1.5, 'Tutorial'),
      timeSeriesData: generateTimeSeriesData(30, 500000, 1500000)
    },
    competitors: generateCompetitors('youtube', 'Gaming'),
    projects: ['proj_4', 'proj_5'],
    bloggers: ['blog_6', 'blog_7', 'blog_8', 'blog_9'],
    createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
    lastSyncedAt: new Date().toISOString(),
    settings: {
      defaultTimeRange: '30D',
      autoRefreshInsights: true,
      emailReportsEnabled: true,
      topNCompetitors: 15
    }
  }
];

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const WorkspaceProvider = ({ children }: { children: ReactNode }) => {
  const [workspaces] = useState<Workspace[]>(mockWorkspaces);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string | null>(mockWorkspaces[0]?.id || null);
  const [timeRange, setTimeRange] = useState<TimeRange>('7D');
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(['tiktok', 'youtube', 'instagram']);
  const [topNCompetitors, setTopNCompetitors] = useState<number>(5);
  const [selectedCompetitorIds, setSelectedCompetitorIds] = useState<string[]>([]);

  const activeWorkspace = useMemo(() => {
    return workspaces.find(w => w.id === activeWorkspaceId) || null;
  }, [workspaces, activeWorkspaceId]);

  const getMainAccount = useCallback(() => {
    return activeWorkspace?.mainAccount || null;
  }, [activeWorkspace]);

  const getCompetitors = useCallback(() => {
    if (!activeWorkspace) return [];
    
    let competitors = activeWorkspace.competitors.filter(c => c.trackingEnabled);
    
    if (selectedPlatforms.length > 0 && selectedPlatforms.length < 3) {
      competitors = competitors.filter(c => selectedPlatforms.includes(c.platform));
    }
    
    if (selectedCompetitorIds.length > 0) {
      competitors = competitors.filter(c => selectedCompetitorIds.includes(c.id));
    }
    
    return competitors;
  }, [activeWorkspace, selectedPlatforms, selectedCompetitorIds]);

  const getTopCompetitors = useCallback((n?: number) => {
    const limit = n || topNCompetitors;
    const competitors = getCompetitors();
    
    return competitors
      .sort((a, b) => b.metrics.engagementRate - a.metrics.engagementRate)
      .slice(0, limit);
  }, [getCompetitors, topNCompetitors]);

  const getAllTrackedAccounts = useCallback(() => {
    const main = getMainAccount();
    const competitors = getCompetitors();
    return main ? [main, ...competitors] : competitors;
  }, [getMainAccount, getCompetitors]);

  const getUserRanking = useCallback(() => {
    const allAccounts = getAllTrackedAccounts();
    const mainAccount = getMainAccount();
    
    if (!mainAccount || allAccounts.length === 0) {
      return { position: 0, total: 0, metric: 'Engagement Rate' };
    }
    
    const sortedByER = [...allAccounts].sort((a, b) => b.metrics.engagementRate - a.metrics.engagementRate);
    const position = sortedByER.findIndex(a => a.id === mainAccount.id) + 1;
    
    return {
      position,
      total: allAccounts.length,
      metric: 'Engagement Rate'
    };
  }, [getAllTrackedAccounts, getMainAccount]);

  const getAverageMetric = useCallback((metric: keyof AccountMetrics) => {
    const competitors = getCompetitors();
    if (competitors.length === 0) return 0;
    
    const sum = competitors.reduce((acc, c) => {
      const value = c.metrics[metric];
      return acc + (typeof value === 'number' ? value : 0);
    }, 0);
    
    return sum / competitors.length;
  }, [getCompetitors]);

  return (
    <WorkspaceContext.Provider
      value={{
        workspaces,
        activeWorkspace,
        activeWorkspaceId,
        setActiveWorkspaceId,
        timeRange,
        setTimeRange,
        selectedPlatforms,
        setSelectedPlatforms,
        topNCompetitors,
        setTopNCompetitors,
        selectedCompetitorIds,
        setSelectedCompetitorIds,
        getMainAccount,
        getCompetitors,
        getTopCompetitors,
        getAllTrackedAccounts,
        getUserRanking,
        getAverageMetric
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
};
