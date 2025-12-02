import { Sidebar } from "@/components/Sidebar";
import { ProjectAccountSelector } from "@/components/ProjectAccountSelector";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Users,
  Search,
  Download,
  Trash2,
  Plus,
  ExternalLink,
  ArrowUpDown,
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
import { useProject } from "@/contexts/ProjectContext";

interface Competitor {
  id: string;
  username: string;
  url: string;
  platform: "Instagram" | "TikTok" | "YouTube";
  linkedAccounts: string[];
  subscribers: number;
  engagementRate: number;
  status: "Active" | "Updating" | "Failed";
}

const CompetitorAnalysis = () => {
  const { toast } = useToast();
  const { projects, selectedProjectId, getSelectedProject } = useProject();
  const [competitorUrl, setCompetitorUrl] = useState("");
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedLinkedAccounts, setSelectedLinkedAccounts] = useState<string[]>([]);

  const [competitors, setCompetitors] = useState<Competitor[]>([
    {
      id: "1",
      username: "creator_pro",
      url: "https://instagram.com/creator_pro",
      platform: "Instagram",
      linkedAccounts: ["@yoga_ig", "@yoga_tt"],
      subscribers: 125000,
      engagementRate: 8.4,
      status: "Active",
    },
    {
      id: "2",
      username: "viral_maker",
      url: "https://tiktok.com/@viral_maker",
      platform: "TikTok",
      linkedAccounts: ["@crypto_tt"],
      subscribers: 89500,
      engagementRate: 12.1,
      status: "Active",
    },
    {
      id: "3",
      username: "beauty_guru",
      url: "https://instagram.com/beauty_guru",
      platform: "Instagram",
      linkedAccounts: ["@beauty_ig", "@beauty_tt"],
      subscribers: 450000,
      engagementRate: 6.2,
      status: "Active",
    },
  ]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const selectedProject = getSelectedProject();

  const detectPlatform = (url: string): "Instagram" | "TikTok" | "YouTube" => {
    if (url.includes("instagram.com")) return "Instagram";
    if (url.includes("tiktok.com")) return "TikTok";
    if (url.includes("youtube.com") || url.includes("youtu.be")) return "YouTube";
    return "Instagram";
  };

  const handleAddCompetitor = () => {
    if (!competitorUrl.trim()) {
      toast({
        title: "URL required",
        description: "Please enter a profile URL",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const platform = detectPlatform(competitorUrl);
      const username = competitorUrl.split("/").pop()?.replace("@", "") || "new_competitor";

      const newCompetitor: Competitor = {
        id: Date.now().toString(),
        username,
        url: competitorUrl.trim(),
        platform,
        linkedAccounts: selectedLinkedAccounts,
        subscribers: Math.floor(Math.random() * 200000),
        engagementRate: Math.random() * 15,
        status: "Active",
      };

      setCompetitors([...competitors, newCompetitor]);
      setCompetitorUrl("");
      setSelectedLinkedAccounts([]);
      setLoading(false);
      setShowAddModal(false);

      toast({
        title: "Competitor added",
        description: `${username} has been added to your analysis`,
      });
    }, 1500);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredCompetitors.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredCompetitors.map((c) => c.id));
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
        return "bg-green-500/10 text-green-600";
      case "Updating":
        return "bg-primary/10 text-primary";
      case "Failed":
        return "bg-destructive/10 text-destructive";
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
      c.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform =
      platformFilter === "all" || c.platform === platformFilter;
    return matchesSearch && matchesPlatform;
  });

  const currentProjectAccounts = selectedProject?.accounts || [];

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
              Track and analyze your competitors across platforms
            </p>
          </div>

          {/* Project/Account Selector */}
          <ProjectAccountSelector />

          {/* Table Controls */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
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
                  <SelectValue placeholder="Platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
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

              <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Competitor
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add Competitor</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Project</label>
                      <div className="p-3 bg-muted rounded-lg text-sm">
                        {selectedProject?.name || "All Projects"}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Competitor @handle or URL</label>
                      <Input
                        placeholder="https://instagram.com/username"
                        value={competitorUrl}
                        onChange={(e) => setCompetitorUrl(e.target.value)}
                      />
                    </div>

                    {selectedProject && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Link to accounts in this project:
                        </label>
                        <div className="space-y-2">
                          {currentProjectAccounts.map((account) => (
                            <div
                              key={account.id}
                              className="flex items-center gap-2"
                            >
                              <Checkbox
                                id={account.id}
                                checked={selectedLinkedAccounts.includes(account.handle)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedLinkedAccounts([
                                      ...selectedLinkedAccounts,
                                      account.handle,
                                    ]);
                                  } else {
                                    setSelectedLinkedAccounts(
                                      selectedLinkedAccounts.filter(
                                        (h) => h !== account.handle
                                      )
                                    );
                                  }
                                }}
                              />
                              <label
                                htmlFor={account.id}
                                className="text-sm font-medium"
                              >
                                {account.handle}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <Button
                      onClick={handleAddCompetitor}
                      disabled={loading}
                      className="w-full bg-primary hover:bg-primary/90"
                    >
                      {loading ? "Adding..." : "Add Competitor"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Table */}
          <Card className="border-border shadow-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectedIds.length === filteredCompetitors.length && filteredCompetitors.length > 0}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" size="sm" className="h-8 -ml-3">
                      Competitor
                      <ArrowUpDown className="ml-2 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead>Linked to</TableHead>
                  <TableHead className="text-right">
                    <Button variant="ghost" size="sm" className="h-8">
                      Followers
                      <ArrowUpDown className="ml-2 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">
                    <Button variant="ghost" size="sm" className="h-8">
                      Avg ER
                      <ArrowUpDown className="ml-2 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCompetitors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-32 text-center">
                      <p className="text-muted-foreground">
                        {searchQuery
                          ? "No competitors match your search"
                          : "No competitors added yet. Add one to get started."}
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
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">@{competitor.username}</span>
                          <a
                            href={competitor.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary/80"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPlatformColor(competitor.platform)}>
                          {competitor.platform}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {competitor.linkedAccounts.map((account, idx) => (
                            <Badge
                              key={idx}
                              variant="secondary"
                              className="bg-primary/10 text-primary text-xs"
                            >
                              {account}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatNumber(competitor.subscribers)}
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
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
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
