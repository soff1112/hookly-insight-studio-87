import { useMemo, useCallback, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { BarChart3 } from "lucide-react";
import { useInsightsFilters } from "@/contexts/InsightsFilterContext";
import { GrafanaPanel } from "./GrafanaPanel";
import { format, subDays } from "date-fns";

interface VideoData {
  id: string;
  title: string;
  platform: string;
  publishDate: Date;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  engagementRate: number;
}

const formatValue = (value: number) => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value.toLocaleString();
};

export const EngagementRatingPanel = () => {
  const { filters, availableAccounts, lastRefresh } = useInsightsFilters();
  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null);

  const videoData: VideoData[] = useMemo(() => {
    const items: VideoData[] = [];
    const selectedAccounts = availableAccounts.filter(a => filters.accounts.includes(a.id));
    
    selectedAccounts.forEach((account) => {
      if (!filters.platforms.includes(account.platform)) return;
      
      const postCount = Math.floor(Math.random() * 8) + 3;
      for (let i = 0; i < postCount; i++) {
        const views = Math.floor(Math.random() * 500000) + 10000;
        const likes = Math.floor(views * (Math.random() * 0.1 + 0.02));
        const comments = Math.floor(likes * (Math.random() * 0.15 + 0.05));
        const shares = Math.floor(likes * (Math.random() * 0.3 + 0.1));
        
        items.push({
          id: `${account.id}-${i}`,
          title: `${account.handle} - Video ${i + 1}: ${["Hook strategy", "Trending topic", "Tutorial", "Behind the scenes", "Product review"][Math.floor(Math.random() * 5)]}`,
          platform: account.platform,
          publishDate: subDays(new Date(), Math.floor(Math.random() * 14)),
          views,
          likes,
          comments,
          shares,
          engagementRate: parseFloat(((likes + comments + shares) / views * 100).toFixed(2)),
        });
      }
    });

    return items.sort((a, b) => b.engagementRate - a.engagementRate);
  }, [filters, availableAccounts, lastRefresh]);

  const handleExportCSV = useCallback(() => {
    const headers = ["Video Title", "Platform", "Publish Date", "Views", "Likes", "Comments", "Shares", "ER %"];
    const rows = videoData.map(v => [
      `"${v.title}"`,
      v.platform,
      format(v.publishDate, "yyyy-MM-dd"),
      v.views.toString(),
      v.likes.toString(),
      v.comments.toString(),
      v.shares.toString(),
      v.engagementRate.toString(),
    ]);
    return [headers, ...rows];
  }, [videoData]);

  const maxER = Math.max(...videoData.map(v => v.engagementRate), 1);

  const getBarColor = (er: number) => {
    if (er >= 8) return "hsl(163, 82%, 36%)";
    if (er >= 5) return "hsl(252, 76%, 66%)";
    if (er >= 3) return "hsl(45, 93%, 47%)";
    return "hsl(0, 84%, 60%)";
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.[0]) return null;
    const data = payload[0].payload as VideoData;
    
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg text-sm">
        <p className="font-medium mb-2 max-w-[250px] truncate">{data.title}</p>
        <div className="space-y-1 text-muted-foreground">
          <p>Platform: {data.platform}</p>
          <p>Published: {format(data.publishDate, "MMM d, yyyy")}</p>
          <div className="border-t border-border pt-1 mt-1">
            <p>Views: {formatValue(data.views)}</p>
            <p>Likes: {formatValue(data.likes)}</p>
            <p>Comments: {formatValue(data.comments)}</p>
            <p>Shares: {formatValue(data.shares)}</p>
          </div>
          <p className="font-medium text-foreground pt-1">ER: {data.engagementRate}%</p>
        </div>
      </div>
    );
  };

  if (videoData.length === 0) {
    return (
      <GrafanaPanel
        title="Engagement Rating"
        subtitle="Content ranked by engagement rate"
        icon={BarChart3}
        panelId="engagement-rating"
      >
        <div className="h-[400px] flex items-center justify-center text-muted-foreground">
          No data for selected filters
        </div>
      </GrafanaPanel>
    );
  }

  return (
    <>
      <GrafanaPanel
        title="Engagement Rating"
        subtitle="Content ranked by engagement rate (ER %)"
        icon={BarChart3}
        panelId="engagement-rating"
        onExportCSV={handleExportCSV}
      >
        <ScrollArea className="h-[400px]">
          <div className="pr-4" style={{ height: Math.max(400, videoData.length * 40) }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={videoData}
                layout="vertical"
                margin={{ left: 180, right: 40, top: 10, bottom: 10 }}
                onClick={(data) => data?.activePayload && setSelectedVideo(data.activePayload[0].payload)}
              >
                <XAxis
                  type="number"
                  domain={[0, maxER * 1.1]}
                  tickFormatter={(v) => `${v}%`}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                />
                <YAxis
                  type="category"
                  dataKey="title"
                  width={170}
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => v.length > 25 ? `${v.slice(0, 25)}...` : v}
                  stroke="hsl(var(--muted-foreground))"
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted)/0.3)" }} />
                <Bar dataKey="engagementRate" radius={[0, 4, 4, 0]} cursor="pointer">
                  {videoData.map((entry, index) => (
                    <Cell key={index} fill={getBarColor(entry.engagementRate)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ScrollArea>
      </GrafanaPanel>

      <Sheet open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Video Details</SheetTitle>
          </SheetHeader>
          {selectedVideo && (
            <div className="mt-6 space-y-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Title</p>
                <p className="text-sm">{selectedVideo.title}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Platform</p>
                  <Badge variant="outline">{selectedVideo.platform}</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Published</p>
                  <p className="text-sm">{format(selectedVideo.publishDate, "PPP")}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-muted">
                  <p className="text-xs text-muted-foreground">Views</p>
                  <p className="text-lg font-semibold">{formatValue(selectedVideo.views)}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted">
                  <p className="text-xs text-muted-foreground">Likes</p>
                  <p className="text-lg font-semibold">{formatValue(selectedVideo.likes)}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted">
                  <p className="text-xs text-muted-foreground">Comments</p>
                  <p className="text-lg font-semibold">{formatValue(selectedVideo.comments)}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted">
                  <p className="text-xs text-muted-foreground">Shares</p>
                  <p className="text-lg font-semibold">{formatValue(selectedVideo.shares)}</p>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-primary/10">
                <p className="text-xs text-muted-foreground">Engagement Rate</p>
                <p className="text-2xl font-bold text-primary">{selectedVideo.engagementRate}%</p>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};
