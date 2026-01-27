import { useState, useMemo } from "react";
import { DashboardCard } from "@/components/DashboardCard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  ArrowUpDown, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Info,
  Download
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
import { mockBloggers } from "@/data/mockAnalyticsData";

type SortField = "totalViews" | "engagementRate" | "postsPerDay" | "contributionShare" | "consistencyScore";

const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
  return num.toString();
};

const getPlatformIcon = (platform: string) => {
  switch (platform) {
    case "tiktok": return "🎵";
    case "youtube": return "📺";
    case "instagram": return "📸";
    default: return "📱";
  }
};

const getProjectColor = (projectId: string) => {
  switch (projectId) {
    case "yoga": return "bg-purple-500/10 text-purple-600";
    case "crypto": return "bg-yellow-500/10 text-yellow-600";
    case "beauty": return "bg-pink-500/10 text-pink-600";
    case "fitness": return "bg-green-500/10 text-green-600";
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

export const BloggerStatsTable = () => {
  const [sortField, setSortField] = useState<SortField>("totalViews");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [searchQuery, setSearchQuery] = useState("");
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [projectFilter, setProjectFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const filteredAndSortedBloggers = useMemo(() => {
    let result = [...mockBloggers];

    // Filter by search
    if (searchQuery) {
      result = result.filter(b => 
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.handle.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by platform
    if (platformFilter !== "all") {
      result = result.filter(b => b.platform === platformFilter);
    }

    // Filter by project
    if (projectFilter !== "all") {
      result = result.filter(b => b.projectId === projectFilter);
    }

    // Sort
    result.sort((a, b) => {
      const aVal = a.metrics[sortField];
      const bVal = b.metrics[sortField];
      return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
    });

    return result;
  }, [searchQuery, platformFilter, projectFilter, sortField, sortOrder]);

  const totalPages = Math.ceil(filteredAndSortedBloggers.length / itemsPerPage);
  const paginatedBloggers = filteredAndSortedBloggers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate aggregates
  const totalViews = mockBloggers.reduce((sum, b) => sum + b.metrics.totalViews, 0);
  const avgER = (mockBloggers.reduce((sum, b) => sum + b.metrics.engagementRate, 0) / mockBloggers.length).toFixed(1);
  const topPerformer = [...mockBloggers].sort((a, b) => b.metrics.contributionShare - a.metrics.contributionShare)[0];
  const lowPerformers = mockBloggers.filter(b => b.metrics.consistencyScore < 70).length;

  return (
    <DashboardCard>
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-primary" />
            <div>
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                Blogger Statistics
                <MetricTooltip
                  title="Creator Performance Analytics"
                  formula="Individual metrics aggregated from all posts per creator"
                  interpretation="Identify top performers for resource allocation and flag underperformers."
                />
              </h3>
              <p className="text-sm text-muted-foreground">
                {mockBloggers.length} creators tracked • {formatNumber(totalViews)} total views
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
            <div className="text-xs text-muted-foreground">Total Creators</div>
            <div className="text-xl font-bold text-foreground">{mockBloggers.length}</div>
          </div>
          <div className="bg-muted/30 rounded-lg p-3">
            <div className="text-xs text-muted-foreground">Avg Engagement Rate</div>
            <div className="text-xl font-bold text-foreground">{avgER}%</div>
          </div>
          <div className="bg-muted/30 rounded-lg p-3">
            <div className="text-xs text-muted-foreground">Top Contributor</div>
            <div className="text-sm font-bold text-foreground truncate">{topPerformer.name}</div>
            <div className="text-xs text-accent">{topPerformer.metrics.contributionShare}% of views</div>
          </div>
          <div className="bg-muted/30 rounded-lg p-3">
            <div className="text-xs text-muted-foreground">Low Consistency</div>
            <div className="text-xl font-bold text-destructive">{lowPerformers}</div>
            <div className="text-xs text-muted-foreground">creators &lt;70%</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search creators..."
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
          <Select value={projectFilter} onValueChange={(v) => { setProjectFilter(v); setCurrentPage(1); }}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              <SelectItem value="yoga">Yoga Studio</SelectItem>
              <SelectItem value="crypto">Crypto Blog</SelectItem>
              <SelectItem value="beauty">Beauty Brand</SelectItem>
              <SelectItem value="fitness">Fitness Coach</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[200px]">Creator</TableHead>
                <TableHead className="w-[80px]">Platform</TableHead>
                <TableHead 
                  className="w-[100px] cursor-pointer hover:bg-muted/70"
                  onClick={() => handleSort("totalViews")}
                >
                  <div className="flex items-center gap-1">
                    Views <ArrowUpDown className="w-3 h-3" />
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
                <TableHead 
                  className="w-[100px] cursor-pointer hover:bg-muted/70"
                  onClick={() => handleSort("postsPerDay")}
                >
                  <div className="flex items-center gap-1">
                    Posts/Day <ArrowUpDown className="w-3 h-3" />
                  </div>
                </TableHead>
                <TableHead 
                  className="w-[120px] cursor-pointer hover:bg-muted/70"
                  onClick={() => handleSort("contributionShare")}
                >
                  <div className="flex items-center gap-1">
                    Contribution <ArrowUpDown className="w-3 h-3" />
                  </div>
                </TableHead>
                <TableHead 
                  className="w-[120px] cursor-pointer hover:bg-muted/70"
                  onClick={() => handleSort("consistencyScore")}
                >
                  <div className="flex items-center gap-1">
                    Consistency <ArrowUpDown className="w-3 h-3" />
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedBloggers.map((blogger) => (
                <TableRow key={blogger.id} className="hover:bg-muted/30">
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium text-foreground">{blogger.name}</div>
                      <div className="text-xs text-muted-foreground">{blogger.handle}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-lg">{getPlatformIcon(blogger.platform)}</span>
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold text-foreground">{formatNumber(blogger.metrics.totalViews)}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span className={`font-semibold ${blogger.metrics.engagementRate >= 8 ? 'text-accent' : blogger.metrics.engagementRate >= 5 ? 'text-foreground' : 'text-destructive'}`}>
                        {blogger.metrics.engagementRate}%
                      </span>
                      {blogger.metrics.engagementRate >= 8 ? (
                        <TrendingUp className="w-3 h-3 text-accent" />
                      ) : blogger.metrics.engagementRate < 5 ? (
                        <TrendingDown className="w-3 h-3 text-destructive" />
                      ) : null}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-foreground">{blogger.metrics.postsPerDay}</span>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <span className="text-sm font-medium text-foreground">{blogger.metrics.contributionShare}%</span>
                      <Progress value={blogger.metrics.contributionShare * 3} className="h-1" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${blogger.metrics.consistencyScore >= 85 ? 'text-accent' : blogger.metrics.consistencyScore >= 70 ? 'text-foreground' : 'text-destructive'}`}>
                          {blogger.metrics.consistencyScore}%
                        </span>
                        {blogger.metrics.consistencyScore < 70 && (
                          <Badge variant="destructive" className="text-[10px] px-1">⚠️</Badge>
                        )}
                      </div>
                      <Progress 
                        value={blogger.metrics.consistencyScore} 
                        className={`h-1 ${blogger.metrics.consistencyScore < 70 ? '[&>div]:bg-destructive' : ''}`}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredAndSortedBloggers.length)} of {filteredAndSortedBloggers.length}
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
          <p className="text-sm font-semibold text-foreground">💡 Creator Performance Analysis</p>
          <p className="text-sm text-foreground">
            <strong>{topPerformer.name}</strong> drives {topPerformer.metrics.contributionShare}% of total views with {topPerformer.metrics.consistencyScore}% consistency. 
            {lowPerformers > 0 && (
              <> <strong className="text-destructive">{lowPerformers} creators</strong> show consistency below 70% — consider content strategy review or reallocation.</>
            )}
          </p>
          <p className="text-xs text-primary">
            → Salary/reward allocation: Top 20% of contributors generate 68% of views.
          </p>
        </div>
      </div>
    </DashboardCard>
  );
};
