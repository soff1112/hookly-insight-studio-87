import { BloggerData, VideoData, CompetitorData, ProjectData, AnalyticsOverview } from "@/types/analytics";

// Generate 100+ bloggers across different projects
export const mockBloggers: BloggerData[] = [
  // Yoga Studio Project
  { id: "b1", name: "Sarah Yoga", handle: "@sarah_yoga", platform: "instagram", projectId: "yoga", avatar: undefined, metrics: { totalViews: 245000, totalLikes: 18500, totalComments: 2340, totalReposts: 890, postsCount: 42, engagementRate: 8.9, postsPerDay: 2.1, contributionShare: 15.2, consistencyScore: 94 }, timeSeriesData: [] },
  { id: "b2", name: "Zen Master", handle: "@zenmaster_tt", platform: "tiktok", projectId: "yoga", avatar: undefined, metrics: { totalViews: 892000, totalLikes: 67000, totalComments: 4500, totalReposts: 3200, postsCount: 68, engagementRate: 8.4, postsPerDay: 3.4, contributionShare: 21.3, consistencyScore: 88 }, timeSeriesData: [] },
  { id: "b3", name: "Morning Flow", handle: "@morningflow", platform: "youtube", projectId: "yoga", avatar: undefined, metrics: { totalViews: 156000, totalLikes: 8900, totalComments: 1200, totalReposts: 450, postsCount: 24, engagementRate: 6.8, postsPerDay: 0.8, contributionShare: 9.4, consistencyScore: 76 }, timeSeriesData: [] },
  
  // Crypto Blog Project
  { id: "b4", name: "CryptoMax", handle: "@cryptomax", platform: "tiktok", projectId: "crypto", avatar: undefined, metrics: { totalViews: 1250000, totalLikes: 45000, totalComments: 8900, totalReposts: 12000, postsCount: 89, engagementRate: 5.3, postsPerDay: 4.5, contributionShare: 28.5, consistencyScore: 82 }, timeSeriesData: [] },
  { id: "b5", name: "Blockchain Basics", handle: "@blockchain_101", platform: "youtube", projectId: "crypto", avatar: undefined, metrics: { totalViews: 567000, totalLikes: 23000, totalComments: 5600, totalReposts: 4500, postsCount: 45, engagementRate: 5.8, postsPerDay: 1.5, contributionShare: 18.2, consistencyScore: 91 }, timeSeriesData: [] },
  { id: "b6", name: "DeFi Daily", handle: "@defidaily", platform: "instagram", projectId: "crypto", avatar: undefined, metrics: { totalViews: 234000, totalLikes: 11200, totalComments: 2100, totalReposts: 1800, postsCount: 56, engagementRate: 6.5, postsPerDay: 2.8, contributionShare: 12.8, consistencyScore: 68 }, timeSeriesData: [] },
  
  // Beauty Brand Project
  { id: "b7", name: "Glam Queen", handle: "@glamqueen", platform: "instagram", projectId: "beauty", avatar: undefined, metrics: { totalViews: 1890000, totalLikes: 156000, totalComments: 23000, totalReposts: 18000, postsCount: 112, engagementRate: 10.4, postsPerDay: 5.6, contributionShare: 32.4, consistencyScore: 96 }, timeSeriesData: [] },
  { id: "b8", name: "Makeup Magic", handle: "@makeupmagic", platform: "tiktok", projectId: "beauty", avatar: undefined, metrics: { totalViews: 2340000, totalLikes: 198000, totalComments: 34000, totalReposts: 28000, postsCount: 145, engagementRate: 11.1, postsPerDay: 7.3, contributionShare: 38.2, consistencyScore: 92 }, timeSeriesData: [] },
  { id: "b9", name: "Skincare Guru", handle: "@skincareguru", platform: "youtube", projectId: "beauty", avatar: undefined, metrics: { totalViews: 678000, totalLikes: 45000, totalComments: 8900, totalReposts: 5600, postsCount: 38, engagementRate: 8.8, postsPerDay: 1.3, contributionShare: 14.6, consistencyScore: 85 }, timeSeriesData: [] },
  
  // Fitness Coach Project
  { id: "b10", name: "Fit Life", handle: "@fitlife", platform: "instagram", projectId: "fitness", avatar: undefined, metrics: { totalViews: 567000, totalLikes: 42000, totalComments: 6700, totalReposts: 4500, postsCount: 78, engagementRate: 9.4, postsPerDay: 3.9, contributionShare: 22.1, consistencyScore: 89 }, timeSeriesData: [] },
  { id: "b11", name: "HIIT Hero", handle: "@hiithero", platform: "tiktok", projectId: "fitness", avatar: undefined, metrics: { totalViews: 1230000, totalLikes: 89000, totalComments: 12000, totalReposts: 9800, postsCount: 92, engagementRate: 9.0, postsPerDay: 4.6, contributionShare: 28.4, consistencyScore: 94 }, timeSeriesData: [] },
  { id: "b12", name: "Strength Coach", handle: "@strengthcoach", platform: "youtube", projectId: "fitness", avatar: undefined, metrics: { totalViews: 456000, totalLikes: 32000, totalComments: 4500, totalReposts: 2800, postsCount: 34, engagementRate: 8.6, postsPerDay: 1.1, contributionShare: 16.8, consistencyScore: 78 }, timeSeriesData: [] },
  
  // Additional bloggers to reach 100+
  ...Array.from({ length: 88 }, (_, i) => ({
    id: `b${i + 13}`,
    name: `Creator ${i + 13}`,
    handle: `@creator_${i + 13}`,
    platform: (["tiktok", "instagram", "youtube"] as const)[i % 3],
    projectId: (["yoga", "crypto", "beauty", "fitness"] as const)[i % 4],
    avatar: undefined,
    metrics: {
      totalViews: Math.floor(Math.random() * 500000) + 50000,
      totalLikes: Math.floor(Math.random() * 40000) + 5000,
      totalComments: Math.floor(Math.random() * 5000) + 500,
      totalReposts: Math.floor(Math.random() * 3000) + 200,
      postsCount: Math.floor(Math.random() * 80) + 20,
      engagementRate: Math.round((Math.random() * 8 + 3) * 10) / 10,
      postsPerDay: Math.round((Math.random() * 5 + 0.5) * 10) / 10,
      contributionShare: Math.round((Math.random() * 15 + 2) * 10) / 10,
      consistencyScore: Math.floor(Math.random() * 40) + 55,
    },
    timeSeriesData: [],
  })),
];

// Generate 1000+ videos
export const mockVideos: VideoData[] = [
  { id: "v1", bloggerId: "b1", bloggerName: "Sarah Yoga", platform: "instagram", title: "5-Minute Morning Stretch Routine", thumbnail: undefined, publishedAt: "2025-01-26T08:00:00Z", metrics: { views: 45200, likes: 3400, comments: 245, reposts: 89, engagementRate: 8.3, firstHourViews: 18500, viewsAfter24h: 38000 }, hookType: "Tutorial", duration: 62 },
  { id: "v2", bloggerId: "b2", bloggerName: "Zen Master", platform: "tiktok", title: "This stretch changed my life 😱", thumbnail: undefined, publishedAt: "2025-01-26T12:00:00Z", metrics: { views: 128000, likes: 12400, comments: 890, reposts: 450, engagementRate: 10.7, firstHourViews: 65000, viewsAfter24h: 110000 }, hookType: "Shock Value", duration: 28 },
  { id: "v3", bloggerId: "b4", bloggerName: "CryptoMax", platform: "tiktok", title: "Why Bitcoin will hit $200k (explained)", thumbnail: undefined, publishedAt: "2025-01-25T15:00:00Z", metrics: { views: 89000, likes: 4500, comments: 1200, reposts: 2100, engagementRate: 8.8, firstHourViews: 32000, viewsAfter24h: 72000 }, hookType: "Question Hook", duration: 45 },
  { id: "v4", bloggerId: "b7", bloggerName: "Glam Queen", platform: "instagram", title: "Glass skin routine you NEED to try", thumbnail: undefined, publishedAt: "2025-01-25T18:00:00Z", metrics: { views: 234000, likes: 28000, comments: 3400, reposts: 2800, engagementRate: 14.6, firstHourViews: 98000, viewsAfter24h: 195000 }, hookType: "Emotional Story", duration: 55 },
  { id: "v5", bloggerId: "b8", bloggerName: "Makeup Magic", platform: "tiktok", title: "POV: You finally found the perfect foundation", thumbnail: undefined, publishedAt: "2025-01-24T14:00:00Z", metrics: { views: 567000, likes: 68000, comments: 8900, reposts: 12000, engagementRate: 15.7, firstHourViews: 245000, viewsAfter24h: 480000 }, hookType: "Trending Sound", duration: 18 },
  { id: "v6", bloggerId: "b10", bloggerName: "Fit Life", platform: "instagram", title: "10 min ab workout - no equipment", thumbnail: undefined, publishedAt: "2025-01-24T07:00:00Z", metrics: { views: 78000, likes: 8200, comments: 1100, reposts: 890, engagementRate: 13.1, firstHourViews: 28000, viewsAfter24h: 65000 }, hookType: "Tutorial", duration: 68 },
  { id: "v7", bloggerId: "b11", bloggerName: "HIIT Hero", platform: "tiktok", title: "Why you're not seeing results (truth bomb)", thumbnail: undefined, publishedAt: "2025-01-23T16:00:00Z", metrics: { views: 345000, likes: 34000, comments: 4500, reposts: 3200, engagementRate: 12.1, firstHourViews: 156000, viewsAfter24h: 298000 }, hookType: "Question Hook", duration: 32 },
  { id: "v8", bloggerId: "b5", bloggerName: "Blockchain Basics", platform: "youtube", title: "Ethereum 2.0 Complete Guide", thumbnail: undefined, publishedAt: "2025-01-22T10:00:00Z", metrics: { views: 89000, likes: 4200, comments: 890, reposts: 560, engagementRate: 6.3, firstHourViews: 12000, viewsAfter24h: 45000 }, hookType: "Tutorial", duration: 720 },
  
  // Generate more videos
  ...Array.from({ length: 992 }, (_, i) => {
    const blogger = mockBloggers[i % mockBloggers.length];
    const hookTypes = ["Question Hook", "Shock Value", "Tutorial", "Emotional Story", "Trending Sound"];
    const views = Math.floor(Math.random() * 200000) + 10000;
    const likes = Math.floor(views * (Math.random() * 0.12 + 0.03));
    const comments = Math.floor(likes * (Math.random() * 0.15 + 0.05));
    const reposts = Math.floor(comments * (Math.random() * 0.8 + 0.2));
    const firstHourRatio = Math.random() * 0.4 + 0.2;
    
    return {
      id: `v${i + 9}`,
      bloggerId: blogger.id,
      bloggerName: blogger.name,
      platform: blogger.platform,
      title: `Video ${i + 9} - ${hookTypes[i % 5]} content`,
      thumbnail: undefined,
      publishedAt: new Date(Date.now() - (i * 3600000)).toISOString(),
      metrics: {
        views,
        likes,
        comments,
        reposts,
        engagementRate: Math.round(((likes + comments) / views) * 1000) / 10,
        firstHourViews: Math.floor(views * firstHourRatio),
        viewsAfter24h: Math.floor(views * 0.85),
      },
      hookType: hookTypes[i % 5],
      duration: Math.floor(Math.random() * 120) + 15,
    };
  }),
];

export const mockProjects: ProjectData[] = [
  { id: "yoga", name: "Yoga Studio", niche: "Health & Wellness", color: "hsl(280 80% 60%)", totalViews: 1293000, totalEngagement: 108000, avgER: 8.0, postsCount: 134, momentum: 12.5, bloggerIds: ["b1", "b2", "b3"] },
  { id: "crypto", name: "Crypto Blog", niche: "Finance & Crypto", color: "hsl(45 93% 47%)", totalViews: 2051000, totalEngagement: 113000, avgER: 5.9, postsCount: 190, momentum: -2.1, bloggerIds: ["b4", "b5", "b6"] },
  { id: "beauty", name: "Beauty Brand", niche: "Beauty & Fashion", color: "hsl(329 78% 60%)", totalViews: 4908000, totalEngagement: 516000, avgER: 10.1, postsCount: 295, momentum: 18.2, bloggerIds: ["b7", "b8", "b9"] },
  { id: "fitness", name: "Fitness Coach", niche: "Health & Fitness", color: "hsl(163 82% 36%)", totalViews: 2253000, totalEngagement: 203000, avgER: 9.0, postsCount: 204, momentum: 8.4, bloggerIds: ["b10", "b11", "b12"] },
];

export const mockCompetitors: CompetitorData[] = [
  { id: "c1", handle: "@yourbrand", platform: "tiktok", avatar: undefined, metrics: { followers: 245000, avgViews: 28700, avgLikes: 1540, engagementRate: 4.2, postsPerDay: 2.3, viralityScore: 67, followerGrowthRate: 2.8 }, topHookType: "Emotional Story", isUser: true },
  { id: "c2", handle: "@topcompetitor", platform: "tiktok", avatar: undefined, metrics: { followers: 1250000, avgViews: 156000, avgLikes: 18400, engagementRate: 12.1, postsPerDay: 10, viralityScore: 92, followerGrowthRate: 5.2 }, topHookType: "Question Hook" },
  { id: "c3", handle: "@viralcreator", platform: "tiktok", avatar: undefined, metrics: { followers: 890000, avgViews: 112000, avgLikes: 12800, engagementRate: 11.4, postsPerDay: 8.5, viralityScore: 89, followerGrowthRate: 4.8 }, topHookType: "Shock Value" },
  { id: "c4", handle: "@contentking", platform: "instagram", avatar: undefined, metrics: { followers: 567000, avgViews: 67000, avgLikes: 7200, engagementRate: 8.6, postsPerDay: 7.2, viralityScore: 85, followerGrowthRate: 3.9 }, topHookType: "Tutorial" },
  { id: "c5", handle: "@trendsetter", platform: "instagram", avatar: undefined, metrics: { followers: 445000, avgViews: 52000, avgLikes: 5800, engagementRate: 7.8, postsPerDay: 6.8, viralityScore: 83, followerGrowthRate: 3.4 }, topHookType: "Trending Sound" },
  { id: "c6", handle: "@nichepro", platform: "youtube", avatar: undefined, metrics: { followers: 234000, avgViews: 89000, avgLikes: 4500, engagementRate: 5.1, postsPerDay: 1.2, viralityScore: 78, followerGrowthRate: 2.1 }, topHookType: "Tutorial" },
  { id: "c7", handle: "@risingstar", platform: "tiktok", avatar: undefined, metrics: { followers: 178000, avgViews: 45000, avgLikes: 4200, engagementRate: 9.3, postsPerDay: 5.5, viralityScore: 81, followerGrowthRate: 6.2 }, topHookType: "Question Hook" },
  { id: "c8", handle: "@dailycontent", platform: "instagram", avatar: undefined, metrics: { followers: 312000, avgViews: 38000, avgLikes: 3200, engagementRate: 6.8, postsPerDay: 4.2, viralityScore: 74, followerGrowthRate: 2.5 }, topHookType: "Emotional Story" },
  { id: "c9", handle: "@microinfluencer", platform: "tiktok", avatar: undefined, metrics: { followers: 89000, avgViews: 28000, avgLikes: 3800, engagementRate: 13.6, postsPerDay: 3.8, viralityScore: 86, followerGrowthRate: 4.2 }, topHookType: "Shock Value" },
];

export const mockAnalyticsOverview: AnalyticsOverview = {
  platforms: {
    tiktok: { views: 5890000, likes: 445000, comments: 89000, shares: 67000, followers: 2340000, engagementRate: 10.2, postsCount: 456 },
    youtube: { views: 2340000, likes: 156000, comments: 34000, shares: 23000, followers: 890000, engagementRate: 9.1, postsCount: 189 },
    instagram: { views: 3450000, likes: 289000, comments: 45000, shares: 34000, followers: 1560000, engagementRate: 10.7, postsCount: 312 },
  },
  bloggers: mockBloggers,
  videos: mockVideos,
  projects: mockProjects,
  competitors: mockCompetitors,
  totals: {
    views: 11680000,
    likes: 890000,
    comments: 168000,
    reposts: 124000,
    posts: 957,
    avgER: 10.0,
  },
};
