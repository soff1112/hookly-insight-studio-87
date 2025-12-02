import { Sidebar } from "@/components/Sidebar";
import { ProjectAccountSelector } from "@/components/ProjectAccountSelector";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  Video,
  Search,
  Download,
  ArrowRight,
  ExternalLink,
  FileText,
  Loader2,
  Play,
  Plus,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface VideoData {
  id: string;
  mediaUrl: string;
  competitorId: string;
  username: string;
  source: string;
  inWork: boolean;
  platform: "Instagram" | "TikTok" | "YouTube";
  coverUrl: string;
  videoUrl?: string;
  extractedText?: string;
  description?: string;
  transcript?: string;
  virality: number;
  views: number;
  duration: number;
  likes: number;
  comments: number;
  reposts: number;
  daysAgo: number;
  postedAt: string;
  tags: string[];
}

const VideoAnalysis = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [timeFilter, setTimeFilter] = useState<"1d" | "2d" | "3d" | "7d">("7d");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null);
  const [transcribing, setTranscribing] = useState(false);

  const [videos, setVideos] = useState<VideoData[]>([
    {
      id: "1",
      mediaUrl: "https://www.instagram.com/reel/example1",
      competitorId: "comp_1",
      username: "creator_pro",
      source: "@yourbrand",
      inWork: false,
      platform: "Instagram",
      coverUrl: "/placeholder.svg",
      virality: 87,
      views: 245000,
      duration: 28,
      likes: 18500,
      comments: 342,
      reposts: 891,
      daysAgo: 2,
      postedAt: "Oct 27",
      tags: ["viral", "content"],
      description: "Stop scrolling if you want to grow faster...",
      extractedText: "Stop scrolling if you want to grow faster...",
    },
    {
      id: "2",
      mediaUrl: "https://www.tiktok.com/@user/video/example2",
      competitorId: "comp_2",
      username: "viral_maker",
      source: "@competitor_x",
      inWork: false,
      platform: "TikTok",
      coverUrl: "/placeholder.svg",
      virality: 92,
      views: 512000,
      duration: 15,
      likes: 42300,
      comments: 728,
      reposts: 1840,
      daysAgo: 1,
      postedAt: "Oct 28",
      tags: [],
      description: "Learn the secrets to viral content 🚀 #contentcreator #viral",
    },
    {
      id: "3",
      mediaUrl: "https://www.instagram.com/reel/example3",
      competitorId: "comp_3",
      username: "beauty_guru",
      source: "@beauty_ig",
      inWork: true,
      platform: "Instagram",
      coverUrl: "/placeholder.svg",
      virality: 78,
      views: 156000,
      duration: 45,
      likes: 12400,
      comments: 189,
      reposts: 423,
      daysAgo: 3,
      postedAt: "Oct 26",
      tags: ["beauty", "tutorial"],
      description: "My morning skincare routine ✨",
    },
  ]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredVideos.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredVideos.map((v) => v.id));
    }
  };

  const handleTranscribe = () => {
    if (!selectedVideo) return;
    setTranscribing(true);
    setTimeout(() => {
      setVideos((prev) =>
        prev.map((v) =>
          v.id === selectedVideo.id
            ? { ...v, transcript: "This is the full video transcript..." }
            : v
        )
      );
      setTranscribing(false);
      toast({
        title: "Transcript generated",
        description: "Video transcript has been successfully created",
      });
    }, 2000);
  };

  const handleTakeToWork = () => {
    if (!selectedVideo) return;
    setVideos((prev) =>
      prev.map((v) =>
        v.id === selectedVideo.id ? { ...v, inWork: true } : v
      )
    );
    setSelectedVideo(null);
    toast({
      title: "Added to In Work",
      description: "Video added to your workspace",
    });
    navigate("/in-work");
  };

  const handleAddTag = (videoId: string, tag: string) => {
    setVideos((prev) =>
      prev.map((v) =>
        v.id === videoId ? { ...v, tags: [...v.tags, tag] } : v
      )
    );
  };

  const handleMoveToInWork = () => {
    setVideos((prev) =>
      prev.map((v) =>
        selectedIds.includes(v.id) ? { ...v, inWork: true } : v
      )
    );
    setSelectedIds([]);
    toast({
      title: "Moved to In Work",
      description: `${selectedIds.length} video(s) added to your workspace`,
    });
  };

  const handleExport = (format: "csv" | "excel") => {
    toast({
      title: `Exporting as ${format.toUpperCase()}`,
      description: "Your file will download shortly",
    });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const shortenUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return `${urlObj.hostname.replace("www.", "")}...`;
    } catch {
      return url.substring(0, 15) + "...";
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case "Instagram":
        return "bg-pink-500/10 text-pink-500 border-pink-500/20";
      case "TikTok":
        return "bg-cyan-500/10 text-cyan-500 border-cyan-500/20";
      case "YouTube":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getViralityColor = (virality: number) => {
    if (virality >= 90) return "text-green-500";
    if (virality >= 70) return "text-yellow-500";
    return "text-orange-500";
  };

  const filteredVideos = videos.filter(
    (v) =>
      v.username.toLowerCase().includes(searchQuery.toLowerCase()) &&
      v.daysAgo <= parseInt(timeFilter)
  );

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-[1600px] mx-auto space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Video className="h-8 w-8 text-primary" />
              Video Analysis
            </h1>
            <p className="text-lg text-muted-foreground">
              Analyze competitor video performance and extract insights
            </p>
          </div>

          {/* Project/Account Selector */}
          <ProjectAccountSelector />

          {/* Filters */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">Time Period:</span>
              {(["1d", "2d", "3d", "7d"] as const).map((period) => (
                <Button
                  key={period}
                  variant={timeFilter === period ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeFilter(period)}
                  className={
                    timeFilter === period
                      ? "bg-primary text-primary-foreground"
                      : ""
                  }
                >
                  {period.toUpperCase()}
                </Button>
              ))}
            </div>

            <div className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by user..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedIds.length > 0 && (
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg border border-border">
              <span className="text-sm font-medium">
                {selectedIds.length} video(s) selected
              </span>
              <div className="flex items-center gap-2">
                <Button size="sm" onClick={handleMoveToInWork} className="bg-primary">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Move to In Work
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleExport("csv")}>
                      Export as CSV
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExport("excel")}>
                      Export as Excel
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          )}

          {/* Compact Table */}
          <Card className="border-border shadow-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectedIds.length === filteredVideos.length && filteredVideos.length > 0}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="w-[80px]">Video</TableHead>
                  <TableHead className="w-[120px]">Source</TableHead>
                  <TableHead className="w-[140px]">User</TableHead>
                  <TableHead className="w-[80px] text-center">In Work</TableHead>
                  <TableHead className="w-[80px]">Platform</TableHead>
                  <TableHead className="w-[100px]">Virality</TableHead>
                  <TableHead className="w-[80px] text-right">Views</TableHead>
                  <TableHead className="w-[60px] text-right">Time</TableHead>
                  <TableHead className="w-[70px] text-right">Likes</TableHead>
                  <TableHead className="w-[80px] text-right">Comments</TableHead>
                  <TableHead className="w-[70px] text-right">Days Ago</TableHead>
                  <TableHead className="w-[100px]">Tags</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVideos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={13} className="h-32 text-center">
                      <p className="text-muted-foreground">
                        No videos found for the selected time period
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredVideos.map((video) => (
                    <TableRow
                      key={video.id}
                      className={selectedIds.includes(video.id) ? "bg-muted/50" : ""}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.includes(video.id)}
                          onCheckedChange={() => toggleSelect(video.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div
                          className="relative w-16 h-16 rounded cursor-pointer hover:opacity-80 transition-opacity group"
                          onClick={() => setSelectedVideo(video)}
                        >
                          <img
                            src={video.coverUrl}
                            alt="Thumbnail"
                            className="w-full h-full object-cover rounded"
                          />
                          <div className="absolute inset-0 bg-black/40 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Play className="h-6 w-6 text-white" />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">
                          {video.source}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium text-sm">
                        @{video.username}
                      </TableCell>
                      <TableCell className="text-center">
                        <Checkbox checked={video.inWork} disabled />
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getPlatformColor(video.platform)}>
                          {video.platform}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Progress value={video.virality} className="h-2" />
                          <span className={`text-xs font-semibold ${getViralityColor(video.virality)}`}>
                            {video.virality}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-xs">
                        {formatNumber(video.views)}
                      </TableCell>
                      <TableCell className="text-right text-xs text-muted-foreground">
                        {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                      </TableCell>
                      <TableCell className="text-right text-xs">
                        {formatNumber(video.likes)}
                      </TableCell>
                      <TableCell className="text-right text-xs text-muted-foreground">
                        {formatNumber(video.comments)}
                      </TableCell>
                      <TableCell className="text-right text-xs">
                        {video.daysAgo}d
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {video.tags.map((tag, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-5 px-2 text-xs"
                            onClick={() => {
                              const tag = prompt("Enter tag name:");
                              if (tag) handleAddTag(video.id, tag);
                            }}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </div>
      </main>

      {/* Video Modal */}
      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Video Details</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSelectedVideo(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>

          {selectedVideo && (
            <div className="space-y-6">
              {/* Video Player */}
              <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
                <img
                  src={selectedVideo.coverUrl}
                  alt="Video cover"
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-foreground">
                    {formatNumber(selectedVideo.views)}
                  </div>
                  <div className="text-sm text-muted-foreground">Views</div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-foreground">
                    {formatNumber(selectedVideo.likes)}
                  </div>
                  <div className="text-sm text-muted-foreground">Likes</div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-foreground">
                    {formatNumber(selectedVideo.comments)}
                  </div>
                  <div className="text-sm text-muted-foreground">Comments</div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">
                    {selectedVideo.virality}%
                  </div>
                  <div className="text-sm text-muted-foreground">Virality</div>
                </Card>
              </div>

              {/* Description */}
              {selectedVideo.description && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground">Description</h3>
                  <p className="text-muted-foreground">{selectedVideo.description}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  onClick={handleTranscribe}
                  disabled={transcribing}
                  variant="outline"
                  className="flex-1"
                >
                  {transcribing ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <FileText className="h-4 w-4 mr-2" />
                  )}
                  {transcribing ? "Transcribing..." : "Transcribe"}
                </Button>
                <Button
                  onClick={handleTakeToWork}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Take to Work
                </Button>
              </div>

              {/* Transcript */}
              {selectedVideo.transcript && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground">Transcript</h3>
                  <p className="text-sm text-muted-foreground bg-muted p-4 rounded-lg">
                    {selectedVideo.transcript}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VideoAnalysis;
