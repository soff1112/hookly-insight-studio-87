import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  X, 
  ChevronDown, 
  RefreshCw, 
  Link2, 
  BarChart3,
  AlertCircle,
  Calendar as CalendarIcon
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";

// Types
interface BloggerStats {
  id: string;
  name: string;
  displayName: string;
  platform: 'tiktok' | 'youtube' | 'instagram';
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  postsCount: number;
  engagementRate: number;
}

interface FilterChipProps {
  label: string;
  active?: boolean;
  removable?: boolean;
  onRemove?: () => void;
  onClick?: () => void;
}

// Mock data for bloggers
const mockBloggerStats: BloggerStats[] = [
  { id: "1", name: "#ystafashion", displayName: "#ystafashion", platform: "instagram", totalViews: 32734, totalLikes: 2456, totalComments: 234, totalShares: 89, postsCount: 45, engagementRate: 8.2 },
  { id: "2", name: "MIMICHAI", displayName: "MIMICHAI", platform: "instagram", totalViews: 30652, totalLikes: 2180, totalComments: 198, totalShares: 76, postsCount: 38, engagementRate: 7.9 },
  { id: "3", name: "kamilla_fashion", displayName: "kamilla_fashion", platform: "instagram", totalViews: 27048, totalLikes: 1890, totalComments: 167, totalShares: 62, postsCount: 42, engagementRate: 7.6 },
  { id: "4", name: "kamilla_fashion1", displayName: "kamilla_fashion1", platform: "instagram", totalViews: 18736, totalLikes: 1345, totalComments: 112, totalShares: 45, postsCount: 31, engagementRate: 7.2 },
  { id: "5", name: "Maria_FashionLand", displayName: "Maria_FashionLand", platform: "instagram", totalViews: 14562, totalLikes: 1120, totalComments: 98, totalShares: 38, postsCount: 28, engagementRate: 6.8 },
  { id: "6", name: "dasha_fashionista", displayName: "dasha_fashionista", platform: "tiktok", totalViews: 10257, totalLikes: 890, totalComments: 76, totalShares: 32, postsCount: 24, engagementRate: 9.1 },
  { id: "7", name: "helena_stylish", displayName: "helena_stylish", platform: "instagram", totalViews: 8491, totalLikes: 678, totalComments: 54, totalShares: 24, postsCount: 19, engagementRate: 6.5 },
  { id: "8", name: "natali.tamalook", displayName: "natali.tamalook", platform: "instagram", totalViews: 7368, totalLikes: 567, totalComments: 48, totalShares: 21, postsCount: 17, engagementRate: 6.2 },
  { id: "9", name: "stylishyulian", displayName: "stylishyulian", platform: "tiktok", totalViews: 6234, totalLikes: 512, totalComments: 42, totalShares: 18, postsCount: 15, engagementRate: 8.7 },
  { id: "10", name: "laracollection-fm", displayName: "laracollection-fm", platform: "instagram", totalViews: 5127, totalLikes: 423, totalComments: 36, totalShares: 14, postsCount: 13, engagementRate: 5.9 },
  { id: "11", name: "MOVTA Guide", displayName: "MOVTA - твой гид...", platform: "youtube", totalViews: 4582, totalLikes: 378, totalComments: 32, totalShares: 12, postsCount: 11, engagementRate: 5.2 },
  { id: "12", name: "nyyyevka", displayName: "nyyyevka по душе", platform: "instagram", totalViews: 3445, totalLikes: 289, totalComments: 24, totalShares: 9, postsCount: 9, engagementRate: 5.8 },
  { id: "13", name: "Aprina_stylist", displayName: "Aprina | stylist...", platform: "instagram", totalViews: 2847, totalLikes: 234, totalComments: 19, totalShares: 7, postsCount: 8, engagementRate: 5.4 },
  { id: "14", name: "Maria_Fashion2", displayName: "Maria_FashionLand", platform: "tiktok", totalViews: 2634, totalLikes: 218, totalComments: 17, totalShares: 6, postsCount: 7, engagementRate: 8.2 },
  { id: "15", name: "Diana_influencer", displayName: "Диана | инфлюенс...", platform: "instagram", totalViews: 2156, totalLikes: 178, totalComments: 14, totalShares: 5, postsCount: 6, engagementRate: 5.1 },
  { id: "16", name: "Natali_creator", displayName: "Наталия | creator", platform: "instagram", totalViews: 1893, totalLikes: 156, totalComments: 12, totalShares: 4, postsCount: 5, engagementRate: 4.9 },
  { id: "17", name: "Style_by_Helen", displayName: "Style by Helen", platform: "youtube", totalViews: 1670, totalLikes: 138, totalComments: 10, totalShares: 3, postsCount: 4, engagementRate: 4.6 },
  { id: "18", name: "luurood_style", displayName: "лууроод про стиль", platform: "instagram", totalViews: 1234, totalLikes: 102, totalComments: 8, totalShares: 2, postsCount: 3, engagementRate: 4.3 },
  { id: "19", name: "fashion_by_tana", displayName: "fashion_by_tana", platform: "instagram", totalViews: 754, totalLikes: 62, totalComments: 5, totalShares: 1, postsCount: 2, engagementRate: 3.8 },
];

const platforms = ["Instagram", "TikTok", "YouTube"];
const projects = ["LAMA", "Fashion Hub", "Style Pro", "Trend Watch"];

// FilterChip Component
const FilterChip = ({ label, active, removable, onRemove, onClick }: FilterChipProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-sm",
        "border transition-colors",
        active 
          ? "bg-[#374151] border-[#4b5563] text-gray-100" 
          : "bg-[#1f2937] border-[#374151] text-gray-400 hover:border-[#4b5563]"
      )}
    >
      <span>{label}</span>
      {removable && (
        <X 
          className="h-3 w-3 ml-1 hover:text-gray-100 cursor-pointer" 
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
        />
      )}
    </button>
  );
};

// BloggerBar Component
interface BloggerBarProps {
  blogger: BloggerStats | { name: string; totalViews: number };
  maxValue: number;
  isTotal?: boolean;
}

const BloggerBar = ({ blogger, maxValue, isTotal = false }: BloggerBarProps) => {
  const percentage = Math.max((blogger.totalViews / maxValue) * 100, 1);
  
  return (
    <div className="flex items-center gap-3 group hover:bg-[#1f2937]/50 p-2 rounded transition-colors">
      {/* Blogger name */}
      <div className="w-44 flex-shrink-0">
        <span className={cn(
          "text-sm truncate block",
          isTotal ? "font-bold text-gray-100" : "text-gray-300"
        )}>
          {blogger.name}
        </span>
      </div>
      
      {/* Bar */}
      <div className="flex-1 relative h-7">
        <div
          className={cn(
            "h-full rounded transition-all duration-500 relative overflow-hidden",
            isTotal 
              ? "bg-gradient-to-r from-emerald-700 to-emerald-500" 
              : "bg-gradient-to-r from-emerald-600 to-emerald-400"
          )}
          style={{ 
            width: `${percentage}%`,
            boxShadow: isTotal 
              ? '0 2px 6px rgba(16, 185, 129, 0.3)' 
              : '0 2px 4px rgba(16, 185, 129, 0.2)'
          }}
        >
          {/* Subtle shine effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
        </div>
        
        {/* Hover tooltip */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-xs text-white font-medium bg-gray-900/80 px-2 py-1 rounded">
            {blogger.totalViews.toLocaleString()} views
          </span>
        </div>
      </div>
      
      {/* Value */}
      <div className="w-20 text-right flex-shrink-0">
        <span className={cn(
          "text-sm font-mono",
          isTotal ? "font-bold text-gray-100" : "text-gray-300"
        )}>
          {blogger.totalViews.toLocaleString()}
        </span>
      </div>
    </div>
  );
};

// Main Component
export const BloggerStatisticsChart = () => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["Instagram"]);
  const [selectedProjects, setSelectedProjects] = useState<string[]>(["LAMA"]);
  const [showAllBloggers, setShowAllBloggers] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2025, 8, 1),
    to: new Date(2025, 8, 30)
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter and calculate stats
  const filteredBloggers = useMemo(() => {
    let filtered = mockBloggerStats;
    
    if (selectedPlatforms.length > 0 && !showAllBloggers) {
      filtered = filtered.filter(b => 
        selectedPlatforms.map(p => p.toLowerCase()).includes(b.platform)
      );
    }
    
    return filtered.sort((a, b) => b.totalViews - a.totalViews);
  }, [selectedPlatforms, showAllBloggers]);

  const totalStats = useMemo(() => {
    return filteredBloggers.reduce((acc, blogger) => ({
      totalViews: acc.totalViews + blogger.totalViews,
      totalLikes: acc.totalLikes + blogger.totalLikes,
      totalComments: acc.totalComments + blogger.totalComments,
      totalShares: acc.totalShares + blogger.totalShares,
    }), {
      totalViews: 0,
      totalLikes: 0,
      totalComments: 0,
      totalShares: 0,
    });
  }, [filteredBloggers]);

  const maxValue = Math.max(
    ...filteredBloggers.map(b => b.totalViews),
    totalStats.totalViews * 0.5 // Ensure total bar is visible
  );

  // Scale values for x-axis
  const scaleValues = [512, 1024, 2048, 4096, 8192, 16384, 32768, 65536];

  const removePlatform = (platform: string) => {
    setSelectedPlatforms(prev => prev.filter(p => p !== platform));
  };

  const removeProject = (project: string) => {
    setSelectedProjects(prev => prev.filter(p => p !== project));
  };

  const clearAllFilters = () => {
    setSelectedPlatforms([]);
    setSelectedProjects([]);
    setShowAllBloggers(true);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const formatDateRange = () => {
    if (!dateRange?.from) return "Select date range";
    if (!dateRange.to) return format(dateRange.from, "MMM dd, yyyy");
    return `${format(dateRange.from, "MMM dd")} - ${format(dateRange.to, "MMM dd, yyyy")}`;
  };

  return (
    <div className="rounded-lg overflow-hidden" style={{ backgroundColor: '#1a1f2e' }}>
      {/* Filter Bar */}
      <div className="flex items-center gap-2 p-4 border-b flex-wrap" style={{ borderColor: '#374151' }}>
        {/* Platform filter dropdown */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-100 hover:bg-[#374151]">
              СоцСеть <ChevronDown className="h-3 w-3 ml-1" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-40 p-2 bg-[#1f2937] border-[#374151]">
            {platforms.map(platform => (
              <button
                key={platform}
                onClick={() => {
                  if (!selectedPlatforms.includes(platform)) {
                    setSelectedPlatforms(prev => [...prev, platform]);
                  }
                }}
                className="block w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-[#374151] rounded"
              >
                {platform}
              </button>
            ))}
          </PopoverContent>
        </Popover>

        {/* Selected platforms */}
        {selectedPlatforms.map(platform => (
          <FilterChip
            key={platform}
            label={platform}
            active={true}
            removable={true}
            onRemove={() => removePlatform(platform)}
          />
        ))}

        {/* Project filter dropdown */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-100 hover:bg-[#374151]">
              Project <ChevronDown className="h-3 w-3 ml-1" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-40 p-2 bg-[#1f2937] border-[#374151]">
            {projects.map(project => (
              <button
                key={project}
                onClick={() => {
                  if (!selectedProjects.includes(project)) {
                    setSelectedProjects(prev => [...prev, project]);
                  }
                }}
                className="block w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-[#374151] rounded"
              >
                {project}
              </button>
            ))}
          </PopoverContent>
        </Popover>

        {/* Selected projects */}
        {selectedProjects.map(project => (
          <FilterChip
            key={project}
            label={project}
            active={true}
            removable={true}
            onRemove={() => removeProject(project)}
          />
        ))}

        {/* Blogger filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-100 hover:bg-[#374151]">
              Блогер <ChevronDown className="h-3 w-3 ml-1" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2 bg-[#1f2937] border-[#374151] max-h-64 overflow-y-auto">
            {mockBloggerStats.slice(0, 10).map(blogger => (
              <button
                key={blogger.id}
                className="block w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-[#374151] rounded truncate"
              >
                {blogger.displayName}
              </button>
            ))}
          </PopoverContent>
        </Popover>

        {/* All filter */}
        <FilterChip
          label="All"
          active={showAllBloggers}
          removable={showAllBloggers}
          onClick={() => setShowAllBloggers(true)}
          onRemove={() => setShowAllBloggers(false)}
        />

        {/* Right side controls */}
        <div className="ml-auto flex items-center gap-2">
          {/* Date Range Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="w-56 justify-between bg-[#1f2937] border-[#374151] text-gray-300 hover:bg-[#374151]"
              >
                <CalendarIcon className="h-4 w-4 mr-2" />
                <span className="text-sm truncate">{formatDateRange()}</span>
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-4 bg-[#1f2937] border-[#374151]" align="end">
              {/* Presets */}
              <div className="space-y-1 mb-4">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Quick select</h4>
                {[
                  { label: "Last 7 days", days: 7 },
                  { label: "Last 30 days", days: 30 },
                  { label: "Last 3 months", days: 90 }
                ].map(preset => (
                  <button
                    key={preset.label}
                    onClick={() => {
                      const to = new Date();
                      const from = new Date();
                      from.setDate(from.getDate() - preset.days);
                      setDateRange({ from, to });
                    }}
                    className="block w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-[#374151] rounded"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
              
              {/* Calendar */}
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                className="rounded-md border border-[#374151] bg-[#0f1419] pointer-events-auto"
              />
              
              <Button 
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                size="sm"
              >
                Apply time range
              </Button>
            </PopoverContent>
          </Popover>

          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleRefresh}
            className="text-gray-400 hover:text-gray-100 hover:bg-[#374151]"
          >
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            className="text-gray-400 hover:text-gray-100 hover:bg-[#374151] gap-1"
          >
            <Link2 className="h-4 w-4" />
            New link
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-100 mb-6">
          Статистика по блогерам
        </h2>

        {/* Error State */}
        {error && (
          <Alert variant="destructive" className="mb-4 bg-red-900/20 border-red-800">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error loading data</AlertTitle>
            <AlertDescription>
              {error}. <button onClick={() => setError(null)} className="underline">Try again</button>
            </AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-2">
                <Skeleton className="w-44 h-6 bg-[#374151]" />
                <Skeleton className="flex-1 h-7 bg-[#374151]" />
                <Skeleton className="w-20 h-6 bg-[#374151]" />
              </div>
            ))}
          </div>
        ) : filteredBloggers.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <BarChart3 className="h-16 w-16 text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-300 mb-2">
              No blogger data available
            </h3>
            <p className="text-sm text-gray-500 mb-6 max-w-md">
              Try adjusting your filters or date range to see statistics.
              Data may take a few hours to populate after adding new bloggers.
            </p>
            <Button onClick={clearAllFilters} className="bg-blue-600 hover:bg-blue-700">
              Clear all filters
            </Button>
          </div>
        ) : (
          <>
            {/* Blogger Bars */}
            <div className="space-y-1">
              {filteredBloggers.map((blogger) => (
                <BloggerBar
                  key={blogger.id}
                  blogger={blogger}
                  maxValue={totalStats.totalViews}
                  isTotal={false}
                />
              ))}
              
              {/* Separator */}
              <div className="border-t my-3" style={{ borderColor: '#374151' }} />
              
              {/* Total row */}
              <BloggerBar
                blogger={{
                  name: "ИТОГО",
                  totalViews: totalStats.totalViews,
                }}
                maxValue={totalStats.totalViews}
                isTotal={true}
              />
            </div>

            {/* X-axis scale */}
            <div className="flex justify-between mt-6 px-48">
              {scaleValues.map(value => (
                <span key={value} className="text-xs text-gray-500 font-mono">
                  {value >= 1000 ? `${(value / 1000).toFixed(0)}K` : value}
                </span>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Summary Stats Footer */}
      {!isLoading && filteredBloggers.length > 0 && (
        <div className="border-t p-4 flex items-center gap-6" style={{ borderColor: '#374151', backgroundColor: '#151a24' }}>
          <div className="text-sm">
            <span className="text-gray-500">Bloggers: </span>
            <span className="text-gray-300 font-medium">{filteredBloggers.length}</span>
          </div>
          <div className="text-sm">
            <span className="text-gray-500">Total Views: </span>
            <span className="text-gray-300 font-medium">{totalStats.totalViews.toLocaleString()}</span>
          </div>
          <div className="text-sm">
            <span className="text-gray-500">Total Likes: </span>
            <span className="text-gray-300 font-medium">{totalStats.totalLikes.toLocaleString()}</span>
          </div>
          <div className="text-sm">
            <span className="text-gray-500">Total Comments: </span>
            <span className="text-gray-300 font-medium">{totalStats.totalComments.toLocaleString()}</span>
          </div>
          <Badge className="ml-auto bg-emerald-600/20 text-emerald-400 border-emerald-600/30">
            +12.4% vs last period
          </Badge>
        </div>
      )}
    </div>
  );
};
