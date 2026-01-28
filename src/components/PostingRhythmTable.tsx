import { useState } from "react";
import { DashboardCard } from "@/components/DashboardCard";
import { SectionHeader } from "@/components/insights/SectionHeader";
import { InsightBlock } from "@/components/insights/InsightBlock";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowUpDown, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Progress } from "@/components/ui/progress";

type Competitor = {
  id: string;
  username: string;
  postsPerDay: number;
  avgVirality: number;
  topHookType: string;
  weeklyTrend: number;
  isUser?: boolean;
};

const mockCompetitors: Competitor[] = [
  { id: "1", username: "You", postsPerDay: 2.3, avgVirality: 87, topHookType: "Emotional Story", weeklyTrend: 5.2, isUser: true },
  { id: "2", username: "@topcompetitor", postsPerDay: 10, avgVirality: 92, topHookType: "Question Hook", weeklyTrend: 8.1 },
  { id: "3", username: "@viralcreator", postsPerDay: 8.5, avgVirality: 89, topHookType: "Shock Value", weeklyTrend: 3.4 },
  { id: "4", username: "@contentking", postsPerDay: 7.2, avgVirality: 85, topHookType: "Tutorial", weeklyTrend: -2.1 },
  { id: "5", username: "@trendsetter", postsPerDay: 6.8, avgVirality: 83, topHookType: "Trending Sound", weeklyTrend: 1.8 },
];

type SortField = "postsPerDay" | "avgVirality";

export const PostingRhythmTable = () => {
  const [sortField, setSortField] = useState<SortField>("postsPerDay");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selected, setSelected] = useState<string[]>([]);

  const sortedCompetitors = [...mockCompetitors].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
  });

  // Calculate user's rank and gap
  const userRank = sortedCompetitors.findIndex(c => c.isUser) + 1;
  const topPerformer = sortedCompetitors[0];
  const user = sortedCompetitors.find(c => c.isUser);
  const postingGap = user && topPerformer ? ((topPerformer.postsPerDay - user.postsPerDay) / topPerformer.postsPerDay * 100).toFixed(0) : 0;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const toggleSelect = (id: string) => {
    setSelected(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 2) return <TrendingUp className="w-3 h-3 text-accent" />;
    if (trend < -2) return <TrendingDown className="w-3 h-3 text-destructive" />;
    return <Minus className="w-3 h-3 text-muted-foreground" />;
  };

  return (
    <DashboardCard>
      <div className="space-y-4">
        <SectionHeader
          level={3}
          title="Posting Rhythm & Virality"
          subtitle="Compare posting frequency and content performance across competitors"
          timeRange="Last 7 days"
          dataScope="5 accounts"
          sampleSize="183 videos analyzed"
          tooltip="Virality % measures actual reach vs. expected reach based on follower count. >100% means content outperformed typical reach."
        />

        {/* Quick Stats Row */}
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Your Rank:</span>
            <Badge variant={userRank <= 2 ? "default" : "secondary"} className="text-xs">
              #{userRank} of {sortedCompetitors.length}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Posting Gap:</span>
            <Badge variant="secondary" className="text-xs bg-yellow-500/10 text-yellow-600">
              -{postingGap}% vs top
            </Badge>
          </div>
          {selected.length > 0 && (
            <Button variant="outline" size="sm" className="ml-auto h-7 text-xs">
              Export {selected.length} selected
            </Button>
          )}
        </div>

        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-12">
                  <Checkbox 
                    checked={selected.length === mockCompetitors.length}
                    onCheckedChange={(checked) => {
                      setSelected(checked ? mockCompetitors.map(c => c.id) : []);
                    }}
                  />
                </TableHead>
                <TableHead className="w-[180px]">Account</TableHead>
                <TableHead 
                  className="w-[120px] cursor-pointer hover:bg-muted/70"
                  onClick={() => handleSort("postsPerDay")}
                >
                  <div className="flex items-center gap-2">
                    Posts/Day
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </TableHead>
                <TableHead 
                  className="w-[160px] cursor-pointer hover:bg-muted/70"
                  onClick={() => handleSort("avgVirality")}
                >
                  <div className="flex items-center gap-2">
                    Avg Virality %
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </TableHead>
                <TableHead className="w-[100px]">7d Trend</TableHead>
                <TableHead className="w-[150px]">Top Hook Type</TableHead>
                <TableHead className="w-[120px]">Rhythm</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedCompetitors.map((competitor, index) => (
                <TableRow 
                  key={competitor.id}
                  className={competitor.isUser ? "bg-accent/5 border-l-4 border-l-accent" : ""}
                >
                  <TableCell>
                    <Checkbox 
                      checked={selected.includes(competitor.id)}
                      onCheckedChange={() => toggleSelect(competitor.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground w-4">#{index + 1}</span>
                      {competitor.username}
                      {competitor.isUser && (
                        <Badge variant="secondary" className="text-xs bg-accent/10 text-accent-foreground">
                          You
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-foreground">{competitor.postsPerDay}</span>
                    <span className="text-xs text-muted-foreground ml-1">/day</span>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">{competitor.avgVirality}%</span>
                        <Badge 
                          variant="secondary" 
                          className={`text-[10px] px-1 py-0 ${
                            competitor.avgVirality >= 90 
                              ? "bg-accent/10 text-accent" 
                              : competitor.avgVirality >= 85 
                              ? "bg-yellow-500/10 text-yellow-600"
                              : "bg-muted"
                          }`}
                        >
                          {competitor.avgVirality >= 90 ? "High" : competitor.avgVirality >= 85 ? "Avg" : "Low"}
                        </Badge>
                      </div>
                      <Progress value={competitor.avgVirality} className="h-1.5" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {getTrendIcon(competitor.weeklyTrend)}
                      <span className={`text-xs ${
                        competitor.weeklyTrend > 2 ? "text-accent" : 
                        competitor.weeklyTrend < -2 ? "text-destructive" : 
                        "text-muted-foreground"
                      }`}>
                        {competitor.weeklyTrend > 0 ? "+" : ""}{competitor.weeklyTrend}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {competitor.topHookType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div 
                          key={i}
                          className={`h-5 w-1.5 rounded-sm ${
                            i < Math.floor(competitor.postsPerDay) 
                              ? 'bg-primary' 
                              : 'bg-muted'
                          }`}
                        />
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <InsightBlock
          type="recommendation"
          title="Increase posting frequency to close the gap"
          content="Top performers post 8-10 videos/day. Your current 2.3/day is 77% below the top tier. Testing a higher posting cadence could accelerate growth by matching competitor consistency."
          impact="+25-40% reach"
          dataReference="Based on top 3 performers' posting patterns"
          sampleSize="7-day posting history"
          timeWindow="Last 7 days"
          actionLabel="Create content plan"
          onAction={() => console.log("Create plan")}
          onShowData={() => console.log("Show posting data")}
        />
      </div>
    </DashboardCard>
  );
};
