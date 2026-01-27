import { useState, useMemo } from "react";
import { DashboardCard } from "@/components/DashboardCard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { 
  Video, 
  ArrowUpDown, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Info,
  Download,
  Clock,
  Eye
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockVideos } from "@/data/mockAnalyticsData";

type SortField = "views" | "engagementRate" | "likes" | "comments";

const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

const formatDuration = (seconds: number): string => {
  if (seconds >= 60) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
  return `0:${seconds.toString().padStart(2, '0')}`;
};

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const getPlatformIcon = (platform: string) => {
  switch (platform) {
    case "tiktok": return "🎵";
    case "youtube": return "📺";
    case "instagram": return "📸";
    default: return "📱";
  }
};

const getHookTypeColor = (hookType: string) => {
  switch (hookType) {
    case "Question Hook": return "bg-blue-500/10 text-blue-600";
    case "Shock Value": return "bg-red-500/10 text-red-600";
    case "Tutorial": return "bg-green-500/10 text-green-600";
    case "Emotional Story": return "bg-purple-500/10 text-purple-600";
    case "Trending Sound": return "bg-yellow-500/10 text-yellow-600";
    default: return "bg-muted text-muted-foreground";
  }
};

const MetricTooltip = ({ title, formula, interpretation }: { title: string; formula: string; interpretation: string }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger>
        <Info className="w-3.5 h-3.5 text-muted-foreground hover:text-primary transition-colors" />
      </TooltipTrigger>
      <TooltipContent className="max-w-[280px] p-3 space-y-2">
        <p className="font-semibold text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground"><strong>Formula:</strong> {formula}</p>
        <p className="text-xs text-muted-foreground"><strong>How to interpret:</strong> {interpretation}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export const VideoStatsTable = () => {
  const [sortField, setSortField] = useState<SortField>("views");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [searchQuery, setSearchQuery] = useState("");
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [hookTypeFilter, setHookTypeFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const filteredAndSortedVideos = useMemo(() => {
    let result = [...mockVideos];

    // Filter by search
    if (searchQuery) {
      result = result.filter(v => 
        v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.bloggerName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by platform
    if (platformFilter !== "all") {
      result = result.filter(v => v.platform === platformFilter);
    }

    // Filter by hook type
    if (hookTypeFilter !== "all") {
      result = result.filter(v => v.hookType === hookTypeFilter);
    }

    // Sort
    result.sort((a, b) => {
      const aVal = a.metrics[sortField];
      const bVal = b.metrics[sortField];
      return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
    });

    return result;
  }, [searchQuery, platformFilter, hookTypeFilter, sortField, sortOrder]);

  const totalPages = Math.ceil(filteredAndSortedVideos.length / itemsPerPage);
  const paginatedVideos = filteredAndSortedVideos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate aggregates
  const totalViews = mockVideos.reduce((sum, v) => sum + v.metrics.views, 0);
  const avgER = (mockVideos.reduce((sum, v) => sum + v.metrics.engagementRate, 0) / mockVideos.length).toFixed(1);
  const topVideo = [...mockVideos].sort((a, b) => b.metrics.views - a.metrics.views)[0];
  const avgFirstHourRatio = (mockVideos.reduce((sum, v) => sum + (v.metrics.firstHourViews / v.metrics.views), 0) / mockVideos.length * 100).toFixed(0);

  return (
    <DashboardCard>
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Video className="w-5 h-5 text-primary" />
            <div>
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                Video Statistics
                <MetricTooltip
                  title="Individual Video Performance"
                  formula="Per-video metrics including views, engagement, decay curves"
                  interpretation="Identify what content resonates and replicate successful patterns."
                />
              </h3>
              <p className="text-sm text-muted-foreground">
                {mockVideos.length} videos • {formatNumber(totalViews)} total views
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-muted/30 rounded-lg p-3">
            <div className="text-xs text-muted-foreground">Total Videos</div>
            <div className="text-xl font-bold text-foreground">{mockVideos.length}</div>
          </div>
          <div className="bg-muted/30 rounded-lg p-3">
            <div className="text-xs text-muted-foreground">Avg Engagement Rate</div>
            <div className="text-xl font-bold text-foreground">{avgER}%</div>
          </div>
          <div className="bg-muted/30 rounded-lg p-3">
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              Avg 1st Hour Ratio
              <MetricTooltip
                title="First Hour Performance"
                formula="Views in 1st hour ÷ Total Views × 100"
                interpretation="Higher ratio = stronger hook. Top videos: 40-60%."
              />
            </div>
            <div className="text-xl font-bold text-foreground">{avgFirstHourRatio}%</div>
          </div>
          <div className="bg-muted/30 rounded-lg p-3">
            <div className="text-xs text-muted-foreground">Top Video Views</div>
            <div className="text-xl font-bold text-accent">{formatNumber(topVideo.metrics.views)}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search videos..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <Select value={platformFilter} onValueChange={(v) => { setPlatformFilter(v); setCurrentPage(1); }}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              <SelectItem value="tiktok">🎵 TikTok</SelectItem>
              <SelectItem value="youtube">📺 YouTube</SelectItem>
              <SelectItem value="instagram">📸 Instagram</SelectItem>
            </SelectContent>
          </Select>
          <Select value={hookTypeFilter} onValueChange={(v) => { setHookTypeFilter(v); setCurrentPage(1); }}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Hook Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Hook Types</SelectItem>
              <SelectItem value="Question Hook">Question Hook</SelectItem>
              <SelectItem value="Shock Value">Shock Value</SelectItem>
              <SelectItem value="Tutorial">Tutorial</SelectItem>
              <SelectItem value="Emotional Story">Emotional Story</SelectItem>
              <SelectItem value="Trending Sound">Trending Sound</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[280px]">Video</TableHead>
                <TableHead className="w-[80px]">Platform</TableHead>
                <TableHead 
                  className="w-[100px] cursor-pointer hover:bg-muted/70"
                  onClick={() => handleSort("views")}
                >
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" /> Views <ArrowUpDown className="w-3 h-3" />
                  </div>
                </TableHead>
                <TableHead 
                  className="w-[80px] cursor-pointer hover:bg-muted/70"
                  onClick={() => handleSort("likes")}
                >
                  <div className="flex items-center gap-1">
                    Likes <ArrowUpDown className="w-3 h-3" />
                  </div>
                </TableHead>
                <TableHead 
                  className="w-[90px] cursor-pointer hover:bg-muted/70"
                  onClick={() => handleSort("comments")}
                >
                  <div className="flex items-center gap-1">
                    Comments <ArrowUpDown className="w-3 h-3" />
                  </div>
                </TableHead>
                <TableHead 
                  className="w-[80px] cursor-pointer hover:bg-muted/70"
                  onClick={() => handleSort("engagementRate")}
                >
                  <div className="flex items-center gap-1">
                    ER % <ArrowUpDown className="w-3 h-3" />
                  </div>
                </TableHead>
                <TableHead className="w-[100px]">Hook Type</TableHead>
                <TableHead className="w-[100px]">1st Hour %</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedVideos.map((video) => {
                const firstHourRatio = (video.metrics.firstHourViews / video.metrics.views * 100);
                return (
                  <TableRow key={video.id} className="hover:bg-muted/30">
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium text-foreground text-sm line-clamp-1">{video.title}</div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{video.bloggerName}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDuration(video.duration)}
                          </span>
                          <span>•</span>
                          <span>{formatDate(video.publishedAt)}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-lg">{getPlatformIcon(video.platform)}</span>
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold text-foreground">{formatNumber(video.metrics.views)}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-foreground">{formatNumber(video.metrics.likes)}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-foreground">{formatNumber(video.metrics.comments)}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span className={`font-semibold ${video.metrics.engagementRate >= 10 ? 'text-accent' : video.metrics.engagementRate >= 6 ? 'text-foreground' : 'text-destructive'}`}>
                          {video.metrics.engagementRate}%
                        </span>
                        {video.metrics.engagementRate >= 10 && <TrendingUp className="w-3 h-3 text-accent" />}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={`text-xs ${getHookTypeColor(video.hookType)}`}>
                        {video.hookType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <span className={`text-sm font-medium ${firstHourRatio >= 40 ? 'text-accent' : firstHourRatio >= 25 ? 'text-foreground' : 'text-destructive'}`}>
                          {firstHourRatio.toFixed(0)}%
                        </span>
                        <Progress 
                          value={firstHourRatio} 
                          className={`h-1 ${firstHourRatio >= 40 ? '[&>div]:bg-accent' : firstHourRatio < 25 ? '[&>div]:bg-destructive' : ''}`}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredAndSortedVideos.length)} of {filteredAndSortedVideos.length}
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* AI Insight */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-2">
          <p className="text-sm font-semibold text-foreground">💡 Video Performance Analysis</p>
          <p className="text-sm text-foreground">
            Top performing hook type: <strong>Shock Value</strong> (avg 12.8% ER). 
            Videos with <strong>&gt;40% first-hour ratio</strong> correlate with 2.3× higher 24h performance.
          </p>
          <p className="text-xs text-primary">
            → Pattern detected: Short-form content (&lt;30s) with Question Hooks shows 35% better performance decay curves.
          </p>
        </div>
      </div>
    </DashboardCard>
  );
};
