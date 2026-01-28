import { useState } from "react";
import { DashboardCard } from "@/components/DashboardCard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Video, Search, Eye, BarChart2, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

type VideoStat = {
  id: string;
  thumbnail: string;
  title: string;
  date: string;
  platform: "instagram" | "tiktok" | "youtube";
  blogger: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  engagementRate: number;
};

const mockVideos: VideoStat[] = [
  {
    id: "1",
    thumbnail: "/placeholder.svg",
    title: "Morning yoga routine for beginners - 10 min flow",
    date: "2025-01-25",
    platform: "instagram",
    blogger: "@yoga_lifestyle",
    views: 125000,
    likes: 8500,
    comments: 432,
    shares: 890,
    engagementRate: 7.8
  },
  {
    id: "2",
    thumbnail: "/placeholder.svg",
    title: "Why you NEED to try this stretch #fitness",
    date: "2025-01-24",
    platform: "tiktok",
    blogger: "@fitness_guru_daily",
    views: 450000,
    likes: 45000,
    comments: 2100,
    shares: 5600,
    engagementRate: 11.7
  },
  {
    id: "3",
    thumbnail: "/placeholder.svg",
    title: "Full body workout - no equipment needed",
    date: "2025-01-23",
    platform: "youtube",
    blogger: "@wellness_coach",
    views: 89000,
    likes: 3200,
    comments: 156,
    shares: 234,
    engagementRate: 4.0
  },
  {
    id: "4",
    thumbnail: "/placeholder.svg",
    title: "5 foods that changed my life",
    date: "2025-01-22",
    platform: "instagram",
    blogger: "@healthy_habits",
    views: 67000,
    likes: 4100,
    comments: 289,
    shares: 567,
    engagementRate: 7.4
  },
  {
    id: "5",
    thumbnail: "/placeholder.svg",
    title: "Meditation hack that actually works",
    date: "2025-01-21",
    platform: "tiktok",
    blogger: "@mindful_living",
    views: 234000,
    likes: 19800,
    comments: 876,
    shares: 2340,
    engagementRate: 9.8
  },
  {
    id: "6",
    thumbnail: "/placeholder.svg",
    title: "My honest fitness journey - 1 year transformation",
    date: "2025-01-20",
    platform: "youtube",
    blogger: "@fit_motivation",
    views: 156000,
    likes: 12400,
    comments: 890,
    shares: 1200,
    engagementRate: 9.3
  },
  {
    id: "7",
    thumbnail: "/placeholder.svg",
    title: "Protein myths debunked by science",
    date: "2025-01-19",
    platform: "instagram",
    blogger: "@nutrition_tips",
    views: 45000,
    likes: 2100,
    comments: 167,
    shares: 234,
    engagementRate: 5.6
  },
  {
    id: "8",
    thumbnail: "/placeholder.svg",
    title: "Self love affirmations for daily practice",
    date: "2025-01-18",
    platform: "tiktok",
    blogger: "@body_positive",
    views: 178000,
    likes: 15600,
    comments: 1230,
    shares: 3400,
    engagementRate: 11.4
  },
];

const platformIcons: Record<string, { icon: string; color: string }> = {
  instagram: { icon: "📸", color: "bg-pink-500/10 text-pink-500" },
  tiktok: { icon: "🎵", color: "bg-foreground/10 text-foreground" },
  youtube: { icon: "▶️", color: "bg-red-500/10 text-red-500" }
};

const getERColor = (er: number): string => {
  if (er >= 6) return "bg-accent/10 text-accent";
  if (er >= 4) return "bg-yellow-500/10 text-yellow-600";
  return "bg-destructive/10 text-destructive";
};

export const VideoStatisticsTable = () => {
  const [search, setSearch] = useState("");
  const [platform, setPlatform] = useState<string>("all");
  const [minER, setMinER] = useState([0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof VideoStat>("views");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const itemsPerPage = 5;

  const filteredVideos = mockVideos
    .filter(v => {
      if (platform !== "all" && v.platform !== platform) return false;
      if (v.engagementRate < minER[0]) return false;
      if (search && !v.title.toLowerCase().includes(search.toLowerCase()) && 
          !v.blogger.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });

  const totalPages = Math.ceil(filteredVideos.length / itemsPerPage);
  const paginatedVideos = filteredVideos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field: keyof VideoStat) => {
    if (sortField === field) {
      setSortOrder(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  return (
    <DashboardCard>
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Video className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Video Statistics</h3>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          Detailed statistics for each video across all bloggers
        </p>

        {/* Filters */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search videos or bloggers..." 
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Select value={platform} onValueChange={setPlatform}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="tiktok">TikTok</SelectItem>
              <SelectItem value="youtube">YouTube</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2 min-w-[200px]">
            <span className="text-sm text-muted-foreground whitespace-nowrap">Min ER:</span>
            <Slider
              value={minER}
              onValueChange={setMinER}
              max={15}
              step={0.5}
              className="w-[100px]"
            />
            <span className="text-sm font-medium w-12">{minER[0]}%</span>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[60px]">Thumb</TableHead>
                <TableHead className="min-w-[200px]">Title</TableHead>
                <TableHead className="w-[100px]">Date</TableHead>
                <TableHead className="w-[80px]">Platform</TableHead>
                <TableHead 
                  className="w-[100px] cursor-pointer hover:bg-muted/70"
                  onClick={() => handleSort("views")}
                >
                  <div className="flex items-center gap-1">
                    Views
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </TableHead>
                <TableHead 
                  className="w-[80px] cursor-pointer hover:bg-muted/70"
                  onClick={() => handleSort("likes")}
                >
                  <div className="flex items-center gap-1">
                    Likes
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </TableHead>
                <TableHead className="w-[80px]">Comments</TableHead>
                <TableHead className="w-[80px]">Shares</TableHead>
                <TableHead 
                  className="w-[80px] cursor-pointer hover:bg-muted/70"
                  onClick={() => handleSort("engagementRate")}
                >
                  <div className="flex items-center gap-1">
                    ER %
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedVideos.map((video) => (
                <TableRow key={video.id} className="hover:bg-muted/30">
                  <TableCell>
                    <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center overflow-hidden">
                      <img 
                        src={video.thumbnail} 
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium text-foreground line-clamp-1">{video.title}</div>
                      <div className="text-xs text-muted-foreground">{video.blogger}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(video.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={platformIcons[video.platform].color}>
                      {platformIcons[video.platform].icon}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{video.views.toLocaleString()}</TableCell>
                  <TableCell>{video.likes.toLocaleString()}</TableCell>
                  <TableCell>{video.comments.toLocaleString()}</TableCell>
                  <TableCell>{video.shares.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={getERColor(video.engagementRate)}>
                      {video.engagementRate}%
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <BarChart2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredVideos.length)} of {filteredVideos.length} videos
          </p>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium px-2">
              Page {currentPage} of {totalPages}
            </span>
            <Button 
              variant="outline" 
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </DashboardCard>
  );
};
