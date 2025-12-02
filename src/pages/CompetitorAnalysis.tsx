import { Sidebar } from "@/components/Sidebar";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Users,
  Search,
  Download,
  Trash2,
  Plus,
  ExternalLink,
  ArrowUpDown,
  Info,
} from "lucide-react";
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

interface Competitor {
  id: string;
  username: string;
  url: string;
  platform: "Instagram" | "TikTok" | "YouTube";
  bio: string;
  subscribers: number;
  following: number;
  totalVideos: number;
  startDate: string;
  engagementRate: number;
  status: "Active" | "Updating" | "Failed";
}

const CompetitorAnalysis = () => {
  const { toast } = useToast();
  const [bulkUrls, setBulkUrls] = useState("");
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [initialVideos, setInitialVideos] = useState<string>("15");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [competitors, setCompetitors] = useState<Competitor[]>([
    {
      id: "1",
      username: "creator_pro",
      url: "https://instagram.com/creator_pro",
      platform: "Instagram",
      bio: "Digital creator | Marketing expert",
      subscribers: 125000,
      following: 842,
      totalVideos: 287,
      startDate: "2024-01-15",
      engagementRate: 8.4,
      status: "Active",
    },
    {
      id: "2",
      username: "viral_maker",
      url: "https://tiktok.com/@viral_maker",
      platform: "TikTok",
      bio: "Viral content strategist",
      subscribers: 89500,
      following: 1205,
      totalVideos: 156,
      startDate: "2024-02-22",
      engagementRate: 12.1,
      status: "Active",
    },
  ]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const detectPlatform = (url: string): "Instagram" | "TikTok" | "YouTube" => {
    if (url.includes("instagram.com")) return "Instagram";
    if (url.includes("tiktok.com")) return "TikTok";
    if (url.includes("youtube.com") || url.includes("youtu.be")) return "YouTube";
    return "Instagram"; // default
  };

  const handleAddCompetitor = async () => {
    if (!bulkUrls.trim()) {
      toast({
        title: "URL required",
        description: "Please enter at least one profile URL",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    // Split by newlines and filter empty lines
    const urls = bulkUrls.split("\n").filter((url) => url.trim());
    
    setTimeout(() => {
      const newCompetitors = urls.map((url) => {
        const platform = detectPlatform(url);
        const username = url.split("/").pop()?.replace("@", "") || "new_competitor";
        
        return {
          id: Date.now().toString() + Math.random(),
          username,
          url: url.trim(),
          platform,
          bio: `Auto-imported ${platform} profile`,
          subscribers: Math.floor(Math.random() * 200000),
          following: Math.floor(Math.random() * 2000),
          totalVideos: Math.floor(Math.random() * 300),
          startDate: new Date().toISOString().split("T")[0],
          engagementRate: Math.random() * 15,
          status: "Active" as const,
        };
      });

      setCompetitors([...competitors, ...newCompetitors]);
      setBulkUrls("");
      setLoading(false);

      toast({
        title: "Competitors added",
        description: `${newCompetitors.length} competitor(s) added to your analysis`,
      });
    }, 1500);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === competitors.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(competitors.map((c) => c.id));
    }
  };

  const handleBulkDelete = () => {
    setCompetitors((prev) => prev.filter((c) => !selectedIds.includes(c.id)));
    setSelectedIds([]);
    toast({
      title: "Competitors deleted",
      description: `${selectedIds.length} competitor(s) removed`,
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

  const getStatusColor = (status: Competitor["status"]) => {
    switch (status) {
      case "Active":
        return "bg-accent text-accent-foreground";
      case "Updating":
        return "bg-primary text-primary-foreground";
      case "Failed":
        return "bg-destructive text-destructive-foreground";
    }
  };

  const getPlatformColor = (platform: Competitor["platform"]) => {
    switch (platform) {
      case "Instagram":
        return "bg-gradient-to-r from-purple-500 to-pink-500 text-white";
      case "TikTok":
        return "bg-black text-white";
      case "YouTube":
        return "bg-red-500 text-white";
    }
  };

  const filteredCompetitors = competitors.filter((c) => {
    const matchesSearch =
      c.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.bio.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform =
      platformFilter === "all" || c.platform === platformFilter;
    return matchesSearch && matchesPlatform;
  });

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Users className="h-8 w-8 text-primary" />
              Competitor Analysis
            </h1>
            <p className="text-lg text-muted-foreground">
              Track and analyze Instagram competitors
            </p>
          </div>

          {/* Bulk Import Bar */}
          <Card className="border-border shadow-card">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex gap-3">
                  <Textarea
                    placeholder="Paste Instagram, TikTok or YouTube URLs here (one per line)..."
                    value={bulkUrls}
                    onChange={(e) => setBulkUrls(e.target.value)}
                    disabled={loading}
                    className="min-h-[80px] resize-none flex-1"
                  />
                  <Button
                    onClick={handleAddCompetitor}
                    disabled={loading}
                    className="bg-primary hover:bg-primary/90 self-start"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Competitor
                  </Button>
                </div>
                <div className="flex items-center justify-end gap-2">
                  <span className="text-xs text-muted-foreground">Initial videos:</span>
                  <Select value={initialVideos} onValueChange={setInitialVideos}>
                    <SelectTrigger className="w-[80px] h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="15">15</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Number of most recent videos to analyze per competitor</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Table Controls */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="relative max-w-sm flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search competitors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={platformFilter} onValueChange={setPlatformFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Platform: All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="Instagram">Instagram</SelectItem>
                  <SelectItem value="TikTok">TikTok</SelectItem>
                  <SelectItem value="YouTube">YouTube</SelectItem>
                </SelectContent>
              </Select>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleExport("csv")}>
                    Export as CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport("excel")}>
                    Export as Excel
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center gap-2">
              {selectedIds.length > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDelete}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete ({selectedIds.length})
                </Button>
              )}
            </div>
          </div>

          {/* Table */}
          <Card className="border-border shadow-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectedIds.length === competitors.length}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead>
                    <Button variant="ghost" size="sm" className="h-8 -ml-3">
                      Username
                      <ArrowUpDown className="ml-2 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Bio</TableHead>
                  <TableHead className="text-right">
                    <Button variant="ghost" size="sm" className="h-8">
                      Subscribers
                      <ArrowUpDown className="ml-2 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">Following</TableHead>
                  <TableHead className="text-right">Videos</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead className="text-right">
                    <Button variant="ghost" size="sm" className="h-8">
                      Engagement
                      <ArrowUpDown className="ml-2 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCompetitors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} className="h-32 text-center">
                      <p className="text-muted-foreground">
                        {searchQuery
                          ? "No competitors match your search"
                          : "No competitors added yet. Add one above to get started."}
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCompetitors.map((competitor) => (
                    <TableRow
                      key={competitor.id}
                      className={selectedIds.includes(competitor.id) ? "bg-muted/50" : ""}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.includes(competitor.id)}
                          onCheckedChange={() => toggleSelect(competitor.id)}
                        />
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {competitor.id}
                      </TableCell>
                      <TableCell>
                        <Badge className={getPlatformColor(competitor.platform)}>
                          {competitor.platform}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold">@{competitor.username}</TableCell>
                      <TableCell>
                        <a
                          href={competitor.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-primary hover:underline"
                        >
                          <span className="max-w-[200px] truncate">
                            {competitor.url.replace("https://", "")}
                          </span>
                          <ExternalLink className="h-3 w-3 flex-shrink-0" />
                        </a>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate text-muted-foreground text-sm">
                        {competitor.bio}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatNumber(competitor.subscribers)}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {formatNumber(competitor.following)}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {competitor.totalVideos}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {competitor.startDate}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {competitor.engagementRate.toFixed(1)}%
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={getStatusColor(competitor.status)}
                        >
                          {competitor.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CompetitorAnalysis;
