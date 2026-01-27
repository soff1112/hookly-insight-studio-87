import { useState } from "react";
import { DashboardCard } from "@/components/DashboardCard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowUpDown, Info, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Competitor = {
  id: string;
  username: string;
  postsPerDay: number;
  avgVirality: number;
  topHookType: string;
  consistencyIndex: number;
  viewVelocity: number;
  completionRate: number;
  commentDensity: number;
  isUser?: boolean;
};

// Enhanced mock data with virality score components
const mockCompetitors: Competitor[] = [
  { 
    id: "1", 
    username: "You", 
    postsPerDay: 2.3, 
    avgVirality: 67, 
    topHookType: "Emotional Story", 
    consistencyIndex: 72,
    viewVelocity: 0.8,
    completionRate: 68,
    commentDensity: 2.1,
    isUser: true 
  },
  { 
    id: "2", 
    username: "@topcompetitor", 
    postsPerDay: 10, 
    avgVirality: 92, 
    topHookType: "Question Hook",
    consistencyIndex: 94,
    viewVelocity: 2.4,
    completionRate: 82,
    commentDensity: 4.8,
  },
  { 
    id: "3", 
    username: "@viralcreator", 
    postsPerDay: 8.5, 
    avgVirality: 89, 
    topHookType: "Shock Value",
    consistencyIndex: 88,
    viewVelocity: 2.1,
    completionRate: 79,
    commentDensity: 4.2,
  },
  { 
    id: "4", 
    username: "@contentking", 
    postsPerDay: 7.2, 
    avgVirality: 85, 
    topHookType: "Tutorial",
    consistencyIndex: 82,
    viewVelocity: 1.8,
    completionRate: 75,
    commentDensity: 3.6,
  },
  { 
    id: "5", 
    username: "@trendsetter", 
    postsPerDay: 6.8, 
    avgVirality: 83, 
    topHookType: "Trending Sound",
    consistencyIndex: 79,
    viewVelocity: 1.6,
    completionRate: 71,
    commentDensity: 3.2,
  },
];

type SortField = "postsPerDay" | "avgVirality" | "consistencyIndex";

const MetricTooltip = ({ title, formula, interpretation }: { title: string; formula: string; interpretation: string }) => (
  <TooltipProvider>
    <UITooltip>
      <TooltipTrigger>
        <Info className="w-3.5 h-3.5 text-muted-foreground hover:text-primary transition-colors" />
      </TooltipTrigger>
      <TooltipContent className="max-w-[300px] p-3 space-y-2">
        <p className="font-semibold text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground"><strong>Formula:</strong> {formula}</p>
        <p className="text-xs text-muted-foreground"><strong>How to interpret:</strong> {interpretation}</p>
      </TooltipContent>
    </UITooltip>
  </TooltipProvider>
);

const TrendIndicator = ({ value, benchmark }: { value: number; benchmark: number }) => {
  const diff = value - benchmark;
  if (diff > 5) return <TrendingUp className="w-3 h-3 text-accent" />;
  if (diff < -5) return <TrendingDown className="w-3 h-3 text-destructive" />;
  return <Minus className="w-3 h-3 text-muted-foreground" />;
};

export const PostingRhythmTable = () => {
  const [sortField, setSortField] = useState<SortField>("postsPerDay");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selected, setSelected] = useState<string[]>([]);

  const sortedCompetitors = [...mockCompetitors].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
  });

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

  // Calculate benchmarks
  const avgPostsPerDay = mockCompetitors.filter(c => !c.isUser).reduce((sum, c) => sum + c.postsPerDay, 0) / (mockCompetitors.length - 1);
  const topPostsPerDay = Math.max(...mockCompetitors.filter(c => !c.isUser).map(c => c.postsPerDay));
  const userCompetitor = mockCompetitors.find(c => c.isUser)!;
  const postingGapPercent = ((topPostsPerDay - userCompetitor.postsPerDay) / topPostsPerDay * 100).toFixed(0);
  const viralityGapPercent = ((92 - userCompetitor.avgVirality) / 92 * 100).toFixed(0);

  return (
    <DashboardCard>
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Posting Rhythm & Virality Analysis</h3>
            <MetricTooltip 
              title="Virality Score Methodology"
              formula="Composite: 30% ER Percentile + 25% View Velocity + 25% Completion Rate + 20% Comment Density"
              interpretation="0-50: Low viral potential, 50-75: Moderate, 75-90: High, 90+: Exceptional viral mechanics."
            />
          </div>
          {selected.length > 0 && (
            <Button variant="outline" size="sm">
              Export {selected.length} selected
            </Button>
          )}
        </div>

        <p className="text-sm text-muted-foreground">
          Compare posting frequency, consistency, and composite virality scores across competitors
        </p>

        {/* Virality Score Breakdown Legend */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-3 bg-muted/30 rounded-lg text-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-muted-foreground">
              ER Percentile
              <MetricTooltip 
                title="Engagement Rate Percentile"
                formula="Your ER rank vs all tracked accounts (0-100)"
                interpretation="Higher = better relative engagement performance."
              />
            </div>
            <div className="font-medium">{userCompetitor.avgVirality}th percentile</div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-muted-foreground">
              View Velocity
              <MetricTooltip 
                title="View Velocity"
                formula="Views in first 1h ÷ Total Views"
                interpretation="Higher = content gains traction faster, indicating algorithm favorability."
              />
            </div>
            <div className="font-medium">{userCompetitor.viewVelocity}x</div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-muted-foreground">
              Completion Rate
              <MetricTooltip 
                title="Completion Rate Proxy"
                formula="Estimated % of viewers who watch to the end"
                interpretation="Higher = better retention, critical for algorithm distribution."
              />
            </div>
            <div className="font-medium">{userCompetitor.completionRate}%</div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-muted-foreground">
              Comment Density
              <MetricTooltip 
                title="Comment Density"
                formula="Comments ÷ Views × 100"
                interpretation="Higher = more engaged audience, signals strong content resonance."
              />
            </div>
            <div className="font-medium">{userCompetitor.commentDensity}%</div>
          </div>
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
                    <MetricTooltip 
                      title="Posting Frequency"
                      formula="Total Posts ÷ Days in Period"
                      interpretation="Top performers typically post 8-10/day. Compare to find your optimal cadence."
                    />
                  </div>
                </TableHead>
                <TableHead 
                  className="w-[120px] cursor-pointer hover:bg-muted/70"
                  onClick={() => handleSort("consistencyIndex")}
                >
                  <div className="flex items-center gap-2">
                    Consistency
                    <ArrowUpDown className="w-3 h-3" />
                    <MetricTooltip 
                      title="Consistency Index"
                      formula="100 - (Std Dev of daily posts ÷ Mean daily posts × 100)"
                      interpretation="Higher = more predictable posting schedule. Algorithms favor consistency."
                    />
                  </div>
                </TableHead>
                <TableHead 
                  className="w-[140px] cursor-pointer hover:bg-muted/70"
                  onClick={() => handleSort("avgVirality")}
                >
                  <div className="flex items-center gap-2">
                    Virality Score
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </TableHead>
                <TableHead className="w-[160px]">Top Hook Type</TableHead>
                <TableHead className="w-[120px]">Rhythm Bar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedCompetitors.map((competitor) => (
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
                      {competitor.username}
                      {competitor.isUser && (
                        <Badge variant="secondary" className="text-xs bg-accent/10 text-accent-foreground">
                          You
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">{competitor.postsPerDay}</span>
                      <TrendIndicator value={competitor.postsPerDay} benchmark={avgPostsPerDay} />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">{competitor.consistencyIndex}%</span>
                        {competitor.consistencyIndex >= 90 && (
                          <Badge variant="secondary" className="text-[10px] bg-accent/10 text-accent-foreground">
                            High
                          </Badge>
                        )}
                      </div>
                      <Progress value={competitor.consistencyIndex} className="h-1" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">{competitor.avgVirality}</span>
                        <span className="text-xs text-muted-foreground">/100</span>
                      </div>
                      <Progress 
                        value={competitor.avgVirality} 
                        className={`h-1.5 ${competitor.avgVirality >= 85 ? '[&>div]:bg-accent' : ''}`}
                      />
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
                          className={`h-6 w-2 rounded-sm ${
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

        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-2">
          <p className="text-sm font-semibold text-foreground">
            💡 Posting Cadence Analysis
          </p>
          <div className="space-y-2 text-sm text-foreground">
            <p>
              <strong>Gap Quantified:</strong> Top performers post {topPostsPerDay}/day. You post {userCompetitor.postsPerDay}/day — a <strong>{postingGapPercent}% volume deficit</strong>.
            </p>
            <p>
              <strong>Virality Gap:</strong> Your score ({userCompetitor.avgVirality}) is <strong>{viralityGapPercent}% below</strong> top performer (92). 
              Key weakness: View Velocity ({userCompetitor.viewVelocity}x vs 2.4x) — hooks aren't generating fast initial traction.
            </p>
          </div>
          <div className="pt-2 border-t border-primary/10 space-y-1">
            <p className="text-xs text-primary font-medium">
              → Recommendation: Increase to 5-6 posts/day (achievable 2.5× increase) for 30 days.
            </p>
            <p className="text-xs text-muted-foreground">
              <strong>Expected impact:</strong> +25-40% reach, +15% virality score if combined with Question Hook format adoption.
            </p>
          </div>
        </div>
      </div>
    </DashboardCard>
  );
};