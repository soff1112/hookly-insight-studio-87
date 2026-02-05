import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Instagram, Youtube, ExternalLink } from "lucide-react";
import { useInsightsFilters } from "@/contexts/InsightsFilterContext";
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

export const ContentRankingPanel = () => {
  const { filters, availableAccounts } = useInsightsFilters();
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);

  const mockContent: ContentItem[] = useMemo(() => {
    const items: ContentItem[] = [];
    const selectedAccounts = availableAccounts.filter(a => filters.accounts.includes(a.id));
    
    selectedAccounts.forEach((account) => {
      if (!filters.platforms.includes(account.platform)) return;
      
      const postCount = Math.floor(Math.random() * 10) + 5;
      for (let i = 0; i < postCount; i++) {
        const views = Math.floor(Math.random() * 500000) + 10000;
        const likes = Math.floor(views * (Math.random() * 0.1 + 0.02));
        const comments = Math.floor(likes * (Math.random() * 0.15 + 0.05));
        const shares = Math.floor(likes * (Math.random() * 0.3 + 0.1));
        
        items.push({
          id: `${account.id}-${i}`,
          title: `${account.isUser ? "Your" : account.handle} video about trending topic #${i + 1} - Hook strategy test`,
          platform: account.platform,
          publishDate: subDays(new Date(), Math.floor(Math.random() * 7)),
          account: account.handle,
          views,
          likes,
          comments,
          shares,
          engagementRate: parseFloat(((likes + comments + shares) / views * 100).toFixed(2)),
        });
      }
    });

    // Sort by primary metric
    return items.sort((a, b) => {
      const getValue = (item: ContentItem) => {
        switch (filters.primaryMetric) {
          case "views": return item.views;
          case "likes": return item.likes;
          case "comments": return item.comments;
          case "shares": return item.shares;
          case "engagementRate": return item.engagementRate;
          default: return item.views;
        }
      };
      return getValue(b) - getValue(a);
    });
  }, [filters, availableAccounts]);

  const maxValue = useMemo(() => {
    if (mockContent.length === 0) return 1;
    const getValue = (item: ContentItem) => {
      switch (filters.primaryMetric) {
        case "views": return item.views;
        case "likes": return item.likes;
        case "comments": return item.comments;
        case "shares": return item.shares;
        case "engagementRate": return item.engagementRate;
        default: return item.views;
      }
    };
    return Math.max(...mockContent.map(getValue));
  }, [mockContent, filters.primaryMetric]);

  const getMetricValue = (item: ContentItem) => {
    switch (filters.primaryMetric) {
      case "views": return item.views;
      case "likes": return item.likes;
      case "comments": return item.comments;
      case "shares": return item.shares;
      case "engagementRate": return item.engagementRate;
      default: return item.views;
    }
  };

  const formatMetricValue = (item: ContentItem) => {
    const value = getMetricValue(item);
    if (filters.primaryMetric === "engagementRate") {
      return `${value}%`;
    }
    return formatValue(value);
  };

  const metricLabel = {
    views: "Views",
    likes: "Likes",
    comments: "Comments",
    shares: "Shares",
    engagementRate: "ER %",
  }[filters.primaryMetric];

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <BarChart3 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Content Ranking</CardTitle>
              <CardDescription>
                Posts ranked by {metricLabel} • Click for details
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
                mockContent.map((item, index) => {
                  const value = getMetricValue(item);
                  const barWidth = (value / maxValue) * 100;
                  
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
                          {formatMetricValue(item)}
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
              Full metrics and information
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
                <div className="p-3 rounded-lg bg-primary/10">
                  <p className="text-xs text-muted-foreground">Engagement Rate</p>
                  <p className="text-lg font-semibold text-primary">{selectedContent.engagementRate}%</p>
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
