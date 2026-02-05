import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Instagram, Youtube, ExternalLink } from "lucide-react";
import { useInsightsFilters, PrimaryMetric } from "@/contexts/InsightsFilterContext";
import { format, subDays } from "date-fns";

interface ContentItem {
  id: string;
  title: string;
  platform: "instagram" | "tiktok" | "youtube";
  publishDate: Date;
  account: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  engagementRate: number;
  likeRate: number;
  commentRate: number;
}

const PlatformIcon = ({ platform }: { platform: string }) => {
  switch (platform) {
    case "instagram":
      return <Instagram className="w-4 h-4 text-primary" />;
    case "youtube":
      return <Youtube className="w-4 h-4 text-destructive" />;
    case "tiktok":
      return <span className="text-xs font-bold text-foreground">TT</span>;
    default:
      return null;
  }
};

const formatValue = (value: number) => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value.toLocaleString();
};

const METRIC_LABELS: Record<PrimaryMetric, string> = {
  views: "Views",
  likes: "Likes",
  comments: "Comments",
  shares: "Shares",
  engagementRate: "ER %",
  likeRate: "Like Rate %",
  commentRate: "Comment Rate %",
  avgViewsPerPost: "Avg Views/Post",
};

export const ContentRankingPanel = () => {
  const { filters, availableAccounts, getDateRange, refreshKey } = useInsightsFilters();
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);

  const mockContent: ContentItem[] = useMemo(() => {
    const items: ContentItem[] = [];
    const selectedAccounts = availableAccounts.filter(a => filters.accounts.includes(a.id));
    const { from, to } = getDateRange();
    const dayRange = Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
    
    selectedAccounts.forEach((account) => {
      if (!filters.platforms.includes(account.platform)) return;
      
      // More posts for longer time ranges
      const postCount = Math.min(Math.floor(dayRange * 2), 30);
      for (let i = 0; i < postCount; i++) {
        const seed = account.id.charCodeAt(0) + i + refreshKey;
        const views = (seed % 500000) + 10000;
        const likes = Math.floor(views * ((seed % 10) / 100 + 0.02));
        const comments = Math.floor(likes * ((seed % 15) / 100 + 0.05));
        const shares = Math.floor(likes * ((seed % 30) / 100 + 0.1));
        
        items.push({
          id: `${account.id}-${i}`,
          title: `${account.isUser ? "Your" : account.handle} video about trending topic #${i + 1} - Hook strategy test`,
          platform: account.platform,
          publishDate: subDays(new Date(), Math.floor(seed % dayRange)),
          account: account.handle,
          views,
          likes,
          comments,
          shares,
          engagementRate: parseFloat(((likes + comments + shares) / views * 100).toFixed(2)),
          likeRate: parseFloat((likes / views * 100).toFixed(2)),
          commentRate: parseFloat((comments / views * 100).toFixed(2)),
        });
      }
    });

    // Sort by engagement rate (Grafana-style ranking by ER)
    return items.sort((a, b) => b.engagementRate - a.engagementRate);
  }, [filters, availableAccounts, getDateRange, refreshKey]);

  const maxER = useMemo(() => {
    if (mockContent.length === 0) return 1;
    return Math.max(...mockContent.map(item => item.engagementRate));
  }, [mockContent]);

  const getMetricValue = (item: ContentItem) => {
    switch (filters.primaryMetric) {
      case "views": return item.views;
      case "likes": return item.likes;
      case "comments": return item.comments;
      case "shares": return item.shares;
      case "engagementRate": return item.engagementRate;
      case "likeRate": return item.likeRate;
      case "commentRate": return item.commentRate;
      case "avgViewsPerPost": return item.views;
      default: return item.views;
    }
  };

  const formatMetricValue = (item: ContentItem) => {
    const value = getMetricValue(item);
    if (["engagementRate", "likeRate", "commentRate"].includes(filters.primaryMetric)) {
      return `${value}%`;
    }
    return formatValue(value);
  };

  const metricLabel = METRIC_LABELS[filters.primaryMetric];

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <BarChart3 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Engagement Rating by Post</CardTitle>
              <CardDescription>
                Posts ranked by Engagement Rate % • Sorted DESC • Top 30
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[400px]">
            <div className="p-6 pt-0 space-y-2">
              {mockContent.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                  No content found for selected filters.
                </div>
              ) : (
                mockContent.slice(0, 30).map((item, index) => {
                  const barWidth = (item.engagementRate / maxER) * 100;
                  
                  return (
                    <div
                      key={item.id}
                      className="relative flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors group"
                      onClick={() => setSelectedContent(item)}
                    >
                      <span className="w-6 text-sm text-muted-foreground font-medium">
                        #{index + 1}
                      </span>
                      <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center">
                        <PlatformIcon platform={item.platform} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate pr-4">
                          {item.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.account} • {format(item.publishDate, "MMM d, yyyy")}
                        </p>
                      </div>
                      <div className="w-32 relative">
                        <div className="h-6 bg-muted rounded-md overflow-hidden">
                          <div
                            className="h-full bg-primary/20 rounded-md transition-all"
                            style={{ width: `${barWidth}%` }}
                          />
                        </div>
                        <span className="absolute inset-0 flex items-center justify-end pr-2 text-xs font-medium">
                          {item.engagementRate}%
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Sheet open={!!selectedContent} onOpenChange={() => setSelectedContent(null)}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <PlatformIcon platform={selectedContent?.platform || "tiktok"} />
              Content Details
            </SheetTitle>
            <SheetDescription>
              Full metrics breakdown
            </SheetDescription>
          </SheetHeader>
          
          {selectedContent && (
            <div className="mt-6 space-y-6">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Title</h4>
                <p className="text-sm">{selectedContent.title}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Account</h4>
                  <p className="text-sm font-medium">{selectedContent.account}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Published</h4>
                  <p className="text-sm">{format(selectedContent.publishDate, "PPP")}</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">Metrics</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-muted">
                    <p className="text-xs text-muted-foreground">Views</p>
                    <p className="text-lg font-semibold">{formatValue(selectedContent.views)}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted">
                    <p className="text-xs text-muted-foreground">Likes</p>
                    <p className="text-lg font-semibold">{formatValue(selectedContent.likes)}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted">
                    <p className="text-xs text-muted-foreground">Comments</p>
                    <p className="text-lg font-semibold">{formatValue(selectedContent.comments)}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted">
                    <p className="text-xs text-muted-foreground">Shares</p>
                    <p className="text-lg font-semibold">{formatValue(selectedContent.shares)}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <p className="text-xs text-muted-foreground">ER %</p>
                    <p className="text-lg font-semibold text-primary">{selectedContent.engagementRate}%</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted">
                    <p className="text-xs text-muted-foreground">Like Rate</p>
                    <p className="text-lg font-semibold">{selectedContent.likeRate}%</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted">
                    <p className="text-xs text-muted-foreground">Comment Rate</p>
                    <p className="text-lg font-semibold">{selectedContent.commentRate}%</p>
                  </div>
                </div>
              </div>

              <Badge variant="outline" className="gap-1 cursor-pointer hover:bg-muted">
                <ExternalLink className="w-3 h-3" />
                View Original
              </Badge>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};
