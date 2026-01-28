import { useState } from "react";
import { DashboardCard } from "@/components/DashboardCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, X, RefreshCw, ExternalLink, Calendar } from "lucide-react";
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

type BloggerStat = {
  id: string;
  name: string;
  totalViews: number;
  engagementRate: number;
  postsCount: number;
};

const mockBloggers: BloggerStat[] = [
  { id: "1", name: "@fitness_guru_daily", totalViews: 32734, engagementRate: 8.2, postsCount: 45 },
  { id: "2", name: "@yoga_lifestyle", totalViews: 28456, engagementRate: 7.8, postsCount: 38 },
  { id: "3", name: "@mindful_living", totalViews: 24123, engagementRate: 6.9, postsCount: 42 },
  { id: "4", name: "@wellness_coach", totalViews: 19876, engagementRate: 5.4, postsCount: 31 },
  { id: "5", name: "@healthy_habits", totalViews: 15432, engagementRate: 4.8, postsCount: 27 },
  { id: "6", name: "@fit_motivation", totalViews: 12890, engagementRate: 4.2, postsCount: 22 },
  { id: "7", name: "@body_positive", totalViews: 9876, engagementRate: 3.9, postsCount: 18 },
  { id: "8", name: "@nutrition_tips", totalViews: 7654, engagementRate: 3.5, postsCount: 15 },
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

  const removeFilter = (index: number) => {
    setActiveFilters(prev => prev.filter((_, i) => i !== index));
  };

  const getBarWidth = (views: number) => {
    return (views / maxViews) * 100;
  };

  const scaleMarks = [512, 1024, 2048, 4096, 8192, 16384, 32768];

  return (
    <DashboardCard>
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Blogger Statistics</h3>
          </div>

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

            <Select>
              <SelectTrigger className="w-[120px] h-8 text-xs">
                <SelectValue placeholder="Blogger" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {mockBloggers.slice(0, 5).map(b => (
                  <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                ))}
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

            <div className="h-6 w-px bg-border mx-1" />

            {/* Date Picker */}
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

        {/* Bar Chart */}
        <div className="space-y-2">
          {mockBloggers.map((blogger) => (
            <div 
              key={blogger.id}
              className="flex items-center gap-3 group cursor-pointer"
              onMouseEnter={() => setHoveredBar(blogger.id)}
              onMouseLeave={() => setHoveredBar(null)}
            >
              <div className="w-40 text-sm text-muted-foreground truncate group-hover:text-foreground transition-colors">
                {blogger.name}
              </div>
              <div className="flex-1 relative h-8">
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
                {hoveredBar === blogger.id && (
                  <div className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-card border border-border rounded-lg px-3 py-2 shadow-lg text-xs space-y-1">
                    <div className="font-semibold text-foreground">{blogger.name}</div>
                    <div className="text-muted-foreground">Views: {blogger.totalViews.toLocaleString()}</div>
                    <div className="text-muted-foreground">ER: {blogger.engagementRate}%</div>
                    <div className="text-muted-foreground">Posts: {blogger.postsCount}</div>
                  </div>
                )}
              </div>
              <div className="w-16 text-right text-sm font-medium text-foreground">
                {blogger.totalViews.toLocaleString()}
              </div>
            </div>
          ))}

          {/* Total Row */}
          <div className="flex items-center gap-3 pt-2 border-t border-border">
            <div className="w-40 text-sm font-bold text-foreground">
              TOTAL
            </div>
            <div className="flex-1" />
            <div className="w-16 text-right text-sm font-bold text-foreground">
              {totalViews.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Scale */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 pl-[172px]">
          {scaleMarks.map((mark) => (
            <span key={mark}>{mark.toLocaleString()}</span>
          ))}
        </div>
      </div>
    </DashboardCard>
  );
};
