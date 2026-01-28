import { useState } from "react";
import { DashboardCard } from "@/components/DashboardCard";
import { SectionHeader } from "@/components/insights/SectionHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, X, RefreshCw, ExternalLink, Calendar, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type BloggerStat = {
  id: string;
  name: string;
  totalViews: number;
  engagementRate: number;
  postsCount: number;
  weeklyChange: number;
  contributionShare: number;
};

const mockBloggers: BloggerStat[] = [
  { id: "1", name: "@fitness_guru_daily", totalViews: 32734, engagementRate: 8.2, postsCount: 45, weeklyChange: 12.4, contributionShare: 21.6 },
  { id: "2", name: "@yoga_lifestyle", totalViews: 28456, engagementRate: 7.8, postsCount: 38, weeklyChange: 8.2, contributionShare: 18.8 },
  { id: "3", name: "@mindful_living", totalViews: 24123, engagementRate: 6.9, postsCount: 42, weeklyChange: -2.1, contributionShare: 15.9 },
  { id: "4", name: "@wellness_coach", totalViews: 19876, engagementRate: 5.4, postsCount: 31, weeklyChange: 5.6, contributionShare: 13.1 },
  { id: "5", name: "@healthy_habits", totalViews: 15432, engagementRate: 4.8, postsCount: 27, weeklyChange: -8.3, contributionShare: 10.2 },
  { id: "6", name: "@fit_motivation", totalViews: 12890, engagementRate: 4.2, postsCount: 22, weeklyChange: 15.2, contributionShare: 8.5 },
  { id: "7", name: "@body_positive", totalViews: 9876, engagementRate: 3.9, postsCount: 18, weeklyChange: 3.1, contributionShare: 6.5 },
  { id: "8", name: "@nutrition_tips", totalViews: 7654, engagementRate: 3.5, postsCount: 15, weeklyChange: -5.2, contributionShare: 5.1 },
];

type ActiveFilter = {
  type: "platform" | "project" | "blogger";
  value: string;
};

export const BloggerStatisticsChart = () => {
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([
    { type: "platform", value: "Instagram" },
    { type: "project", value: "LAMA" },
  ]);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [hoveredBar, setHoveredBar] = useState<string | null>(null);

  const maxViews = Math.max(...mockBloggers.map(b => b.totalViews));
  const totalViews = mockBloggers.reduce((sum, b) => sum + b.totalViews, 0);
  const avgER = (mockBloggers.reduce((sum, b) => sum + b.engagementRate, 0) / mockBloggers.length).toFixed(1);

  // Anomaly detection
  const anomalies = mockBloggers.filter(b => Math.abs(b.weeklyChange) > 10);

  const removeFilter = (index: number) => {
    setActiveFilters(prev => prev.filter((_, i) => i !== index));
  };

  const getBarWidth = (views: number) => {
    return (views / maxViews) * 100;
  };

  return (
    <DashboardCard>
      <div className="space-y-4">
        <SectionHeader
          level={4}
          title="Blogger Performance Analysis"
          subtitle="Detailed view breakdown by creator with contribution share and trend detection"
          timeRange="Last 7 days"
          dataScope="8 bloggers tracked"
          sampleSize={`${mockBloggers.reduce((sum, b) => sum + b.postsCount, 0)} posts total`}
          tooltip="Contribution Share shows what percentage of total workspace views each blogger contributes. Useful for identifying top performers and underperformers."
        />

        {/* Quick Stats */}
        <div className="flex gap-4 text-sm flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Total Views:</span>
            <Badge variant="secondary" className="text-xs font-mono">
              {totalViews.toLocaleString()}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Avg ER:</span>
            <Badge variant="secondary" className="text-xs">
              {avgER}%
            </Badge>
          </div>
          {anomalies.length > 0 && (
            <div className="flex items-center gap-2">
              <AlertCircle className="w-3 h-3 text-yellow-600" />
              <span className="text-xs text-yellow-600">
                {anomalies.length} anomalies detected
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Filter Dropdowns */}
            <Select>
              <SelectTrigger className="w-[120px] h-8 text-xs">
                <SelectValue placeholder="Platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="tiktok">TikTok</SelectItem>
                <SelectItem value="youtube">YouTube</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-[120px] h-8 text-xs">
                <SelectValue placeholder="Project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lama">LAMA</SelectItem>
                <SelectItem value="yoga">Yoga Studio</SelectItem>
                <SelectItem value="crypto">Crypto Blog</SelectItem>
              </SelectContent>
            </Select>

            {/* Active Filter Badges */}
            {activeFilters.map((filter, index) => (
              <Badge 
                key={index}
                variant="secondary" 
                className="h-8 px-3 flex items-center gap-1 bg-primary/10 text-primary cursor-pointer hover:bg-primary/20"
                onClick={() => removeFilter(index)}
              >
                {filter.value}
                <X className="w-3 h-3" />
              </Badge>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-2 text-xs">
                  <Calendar className="w-3 h-3" />
                  {date ? format(date, "MMM d, yyyy") : "Pick date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 pointer-events-auto" align="end">
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>

            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              <RefreshCw className="w-3 h-3" />
            </Button>

            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              <ExternalLink className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Bar Chart with enhanced analytics */}
        <div className="space-y-2">
          {/* Header Row */}
          <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-medium uppercase tracking-wide pb-2 border-b border-border">
            <div className="w-40">Blogger</div>
            <div className="flex-1">Views Distribution</div>
            <div className="w-16 text-right">Views</div>
            <div className="w-12 text-right">Share</div>
            <div className="w-14 text-right">7d Δ</div>
          </div>

          {mockBloggers.map((blogger) => (
            <TooltipProvider key={blogger.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div 
                    className={`flex items-center gap-3 group cursor-pointer py-1 rounded ${
                      Math.abs(blogger.weeklyChange) > 10 ? 'bg-yellow-500/5' : ''
                    }`}
                    onMouseEnter={() => setHoveredBar(blogger.id)}
                    onMouseLeave={() => setHoveredBar(null)}
                  >
                    <div className="w-40 text-sm text-muted-foreground truncate group-hover:text-foreground transition-colors">
                      {blogger.name}
                    </div>
                    <div className="flex-1 relative h-6">
                      <div 
                        className="absolute inset-y-0 left-0 rounded-r-md transition-all duration-300"
                        style={{ 
                          width: `${getBarWidth(blogger.totalViews)}%`,
                          background: hoveredBar === blogger.id 
                            ? "linear-gradient(90deg, hsl(163 82% 40%), hsl(163 82% 50%))"
                            : "linear-gradient(90deg, hsl(163 82% 36%), hsl(163 82% 46%))",
                          opacity: hoveredBar === blogger.id ? 1 : 0.85
                        }}
                      />
                    </div>
                    <div className="w-16 text-right text-sm font-medium text-foreground font-mono">
                      {blogger.totalViews.toLocaleString()}
                    </div>
                    <div className="w-12 text-right text-xs text-muted-foreground">
                      {blogger.contributionShare}%
                    </div>
                    <div className={`w-14 text-right text-xs flex items-center justify-end gap-1 ${
                      blogger.weeklyChange > 0 ? 'text-accent' : blogger.weeklyChange < 0 ? 'text-destructive' : 'text-muted-foreground'
                    }`}>
                      {blogger.weeklyChange > 0 ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : blogger.weeklyChange < 0 ? (
                        <TrendingDown className="w-3 h-3" />
                      ) : null}
                      {blogger.weeklyChange > 0 ? '+' : ''}{blogger.weeklyChange}%
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="left" className="text-xs space-y-1">
                  <div className="font-semibold">{blogger.name}</div>
                  <div>Views: {blogger.totalViews.toLocaleString()}</div>
                  <div>ER: {blogger.engagementRate}%</div>
                  <div>Posts: {blogger.postsCount}</div>
                  <div>Share: {blogger.contributionShare}%</div>
                  <div className={blogger.weeklyChange >= 0 ? 'text-accent' : 'text-destructive'}>
                    7d Change: {blogger.weeklyChange > 0 ? '+' : ''}{blogger.weeklyChange}%
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}

          {/* Total Row */}
          <div className="flex items-center gap-3 pt-2 border-t border-border">
            <div className="w-40 text-sm font-bold text-foreground">
              TOTAL
            </div>
            <div className="flex-1" />
            <div className="w-16 text-right text-sm font-bold text-foreground font-mono">
              {totalViews.toLocaleString()}
            </div>
            <div className="w-12 text-right text-xs font-medium">
              100%
            </div>
            <div className="w-14" />
          </div>
        </div>

        {/* Data Source Footer */}
        <div className="text-[10px] text-muted-foreground pt-2 border-t border-border/50 flex items-center justify-between">
          <span>Source: Platform native analytics • Updated: 2 min ago</span>
          <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px]">
            Export CSV
          </Button>
        </div>
      </div>
    </DashboardCard>
  );
};
