import { useMemo, useCallback, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Video } from "lucide-react";
import { useInsightsFilters } from "@/contexts/InsightsFilterContext";
import { GrafanaPanel } from "./GrafanaPanel";
import { format, subDays } from "date-fns";

interface VideoStats {
  id: string;
  title: string;
  platform: string;
  account: string;
  publishDate: Date;
  value: number;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  engagementRate: number;
}

const VIDEO_COLORS = [
  "hsl(252, 76%, 66%)",
  "hsl(163, 82%, 36%)",
  "hsl(45, 93%, 47%)",
  "hsl(210, 100%, 50%)",
  "hsl(329, 78%, 60%)",
];

const formatValue = (value: number) => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value.toLocaleString();
};

const METRIC_LABELS = {
  views: "Views",
  likes: "Likes",
  comments: "Comments",
  shares: "Shares",
  engagementRate: "ER %",
};

export const VideoStatisticsPanel = () => {
  const { filters, availableAccounts, lastRefresh, getTimeRangeLabel } = useInsightsFilters();
  const [selectedVideo, setSelectedVideo] = useState<VideoStats | null>(null);

  const videoData: VideoStats[] = useMemo(() => {
    const items: VideoStats[] = [];
    const selectedAccounts = availableAccounts.filter(a => filters.accounts.includes(a.id));
    
    selectedAccounts.forEach((account) => {
      if (!filters.platforms.includes(account.platform)) return;
      
      const postCount = Math.floor(Math.random() * 6) + 2;
      for (let i = 0; i < postCount; i++) {
        const views = Math.floor(Math.random() * 500000) + 10000;
        const likes = Math.floor(views * (Math.random() * 0.1 + 0.02));
        const comments = Math.floor(likes * (Math.random() * 0.15 + 0.05));
        const shares = Math.floor(likes * (Math.random() * 0.3 + 0.1));
        const er = parseFloat(((likes + comments + shares) / views * 100).toFixed(2));
        
        let value: number;
        switch (filters.primaryMetric) {
          case "views": value = views; break;
          case "likes": value = likes; break;
          case "comments": value = comments; break;
          case "shares": value = shares; break;
          case "engagementRate": value = er; break;
          default: value = views;
        }
        
        items.push({
          id: `${account.id}-${i}`,
          title: `Video ${i + 1}: ${["Hook strategy test", "Trending topic", "Tutorial deep dive", "Behind the scenes", "Product showcase"][Math.floor(Math.random() * 5)]}`,
          platform: account.platform,
          account: account.handle,
          publishDate: subDays(new Date(), Math.floor(Math.random() * 14)),
          value,
          views,
          likes,
          comments,
          shares,
          engagementRate: er,
        });
      }
    });

    return items.sort((a, b) => b.value - a.value);
  }, [filters, availableAccounts, lastRefresh]);

  const handleExportCSV = useCallback(() => {
    const metricLabel = METRIC_LABELS[filters.primaryMetric];
    const headers = ["Video Title", "Account", "Platform", "Publish Date", metricLabel, "Views", "Likes", "Comments", "Shares", "ER %"];
    const rows = videoData.map(v => [
      `"${v.title}"`,
      v.account,
      v.platform,
      format(v.publishDate, "yyyy-MM-dd"),
      v.value.toString(),
      v.views.toString(),
      v.likes.toString(),
      v.comments.toString(),
      v.shares.toString(),
      v.engagementRate.toString(),
    ]);
    return [headers, ...rows];
  }, [videoData, filters.primaryMetric]);

  const metricLabel = METRIC_LABELS[filters.primaryMetric];
  const isPercentMetric = filters.primaryMetric === "engagementRate";
  const maxValue = Math.max(...videoData.map(v => v.value), 1);

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.[0]) return null;
    const data = payload[0].payload as VideoStats;
    
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg text-sm">
        <p className="font-medium mb-1 max-w-[200px] truncate">{data.title}</p>
        <div className="space-y-1 text-muted-foreground">
          <p>Account: {data.account}</p>
          <p>Platform: {data.platform}</p>
          <p>Published: {format(data.publishDate, "MMM d, yyyy")}</p>
          <div className="border-t border-border pt-1 mt-1">
            <p>Views: {formatValue(data.views)}</p>
            <p>Likes: {formatValue(data.likes)}</p>
            <p>Comments: {formatValue(data.comments)}</p>
            <p>Shares: {formatValue(data.shares)}</p>
            <p>ER: {data.engagementRate}%</p>
          </div>
        </div>
      </div>
    );
  };

  if (videoData.length === 0) {
    return (
      <GrafanaPanel
        title="Video Statistics"
        subtitle={`Videos sorted by ${metricLabel}`}
        icon={Video}
        panelId="video-statistics"
      >
        <div className="h-[350px] flex items-center justify-center text-muted-foreground">
          No data for selected filters
        </div>
      </GrafanaPanel>
    );
  }

  return (
    <>
      <GrafanaPanel
        title="Video Statistics"
        subtitle={`Videos sorted by ${metricLabel}`}
        icon={Video}
        panelId="video-statistics"
        onExportCSV={handleExportCSV}
      >
        <ScrollArea className="h-[350px]">
          <div style={{ height: Math.max(350, videoData.length * 35) }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={videoData}
                layout="vertical"
                margin={{ left: 150, right: 60, top: 10, bottom: 10 }}
                onClick={(data) => data?.activePayload && setSelectedVideo(data.activePayload[0].payload)}
              >
                <XAxis
                  type="number"
                  tickFormatter={(v) => isPercentMetric ? `${v}%` : formatValue(v)}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                />
                <YAxis
                  type="category"
                  dataKey="title"
                  width={140}
                  tick={{ fontSize: 10 }}
                  tickFormatter={(v) => v.length > 20 ? `${v.slice(0, 20)}...` : v}
                  stroke="hsl(var(--muted-foreground))"
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted)/0.3)" }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} cursor="pointer">
                  {videoData.map((_, index) => (
                    <Cell key={index} fill={VIDEO_COLORS[index % VIDEO_COLORS.length]} />
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
                  <p className="text-sm font-medium text-muted-foreground mb-1">Account</p>
                  <p className="text-sm">{selectedVideo.account}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Platform</p>
                  <Badge variant="outline">{selectedVideo.platform}</Badge>
                </div>
                <div className="col-span-2">
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
