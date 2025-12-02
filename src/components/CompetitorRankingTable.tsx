import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  ArrowUp,
  ArrowDown,
  Minus,
  Sparkles,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PeriodFilter } from "./PeriodFilter";
import { InsightCard } from "./InsightCard";
import { CompetitorDrawer } from "./CompetitorDrawer";
import { cn } from "@/lib/utils";

type Period = "24h" | "48h" | "7days";

interface Competitor {
  rank: number;
  rankChange: number;
  name: string;
  isYou?: boolean;
  followers: string;
  followerGrowth: number;
  engagement: string;
  engagementGrowth: number;
  avgViews: string;
  viewsGrowth: number;
  score: number;
  trend: number[];
}

const generateTrendData = (): number[] => {
  return Array.from({ length: 7 }, () => Math.random() * 100);
};

const competitors: Competitor[] = [
  {
    rank: 1,
    rankChange: 0,
    name: "@topcompetitor",
    followers: "145K",
    followerGrowth: 5.2,
    engagement: "6.8%",
    engagementGrowth: 0.8,
    avgViews: "45.2K",
    viewsGrowth: 12.4,
    score: 94,
    trend: generateTrendData(),
  },
  {
    rank: 2,
    rankChange: 1,
    name: "@viralcreator",
    followers: "98K",
    followerGrowth: 3.1,
    engagement: "5.4%",
    engagementGrowth: -0.3,
    avgViews: "32.1K",
    viewsGrowth: 8.2,
    score: 89,
    trend: generateTrendData(),
  },
  {
    rank: 3,
    rankChange: -1,
    name: "You",
    isYou: true,
    followers: "24.5K",
    followerGrowth: 2.8,
    engagement: "4.2%",
    engagementGrowth: 0.8,
    avgViews: "12.3K",
    viewsGrowth: 5.1,
    score: 85,
    trend: generateTrendData(),
  },
  {
    rank: 4,
    rankChange: 0,
    name: "@contentking",
    followers: "67K",
    followerGrowth: 1.9,
    engagement: "4.1%",
    engagementGrowth: -0.5,
    avgViews: "18.7K",
    viewsGrowth: 3.2,
    score: 78,
    trend: generateTrendData(),
  },
  {
    rank: 5,
    rankChange: 2,
    name: "@trendmaster",
    followers: "52K",
    followerGrowth: 4.5,
    engagement: "3.9%",
    engagementGrowth: 1.2,
    avgViews: "15.2K",
    viewsGrowth: 9.8,
    score: 76,
    trend: generateTrendData(),
  },
];

const RankBadge = ({ rank, change }: { rank: number; change: number }) => {
  const Icon =
    change > 0 ? ArrowUp : change < 0 ? ArrowDown : Minus;
  const color =
    change > 0
      ? "text-green-600"
      : change < 0
      ? "text-red-600"
      : "text-muted-foreground";

  return (
    <div className="flex items-center gap-2">
      <span className="text-lg font-bold text-foreground">{rank}</span>
      {change !== 0 && (
        <div
          className={cn(
            "flex items-center gap-0.5 text-xs font-medium animate-fade-in",
            color
          )}
        >
          <Icon className="w-3 h-3" />
          {Math.abs(change)}
        </div>
      )}
    </div>
  );
};

const GrowthIndicator = ({ value }: { value: number }) => {
  const Icon = value >= 0 ? TrendingUp : TrendingDown;
  const color = value >= 0 ? "text-green-600" : "text-red-600";

  return (
    <span className={cn("flex items-center gap-1 text-xs ml-2", color)}>
      <Icon className="w-3 h-3" />
      {value > 0 ? "+" : ""}
      {value.toFixed(1)}%
    </span>
  );
};

const ScoreBadge = ({ score }: { score: number }) => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-primary font-bold";
    if (score >= 70) return "text-purple-600 font-semibold";
    return "text-muted-foreground";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Top Performer";
    if (score >= 70) return "Solid";
    return "Needs boost";
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn("text-lg cursor-help", getScoreColor(score))}>
            {score}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-xs">
            <div className="font-semibold mb-1">{getScoreLabel(score)}</div>
            <div className="text-muted-foreground">
              Score is based on engagement × consistency × reach.
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const TrendSparkline = ({ data, growth }: { data: number[]; growth: number }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data
    .map((value, i) => {
      const x = (i / (data.length - 1)) * 40;
      const y = 20 - ((value - min) / range) * 15;
      return `${x},${y}`;
    })
    .join(" ");

  const color = growth >= 0 ? "#10b981" : "#ef4444";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <svg
            width="40"
            height="20"
            className="cursor-help"
          >
            <polyline
              points={points}
              fill="none"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-xs">
            {growth >= 0 ? "+" : ""}
            {growth.toFixed(1)}% engagement in 7 days
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const CompetitorRankingTable = () => {
  const [activePeriod, setActivePeriod] = useState<Period>("7days");
  const [selectedCompetitor, setSelectedCompetitor] = useState<Competitor | null>(
    null
  );
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleRowClick = (competitor: Competitor) => {
    if (!competitor.isYou) {
      setSelectedCompetitor(competitor);
      setDrawerOpen(true);
    }
  };

  const userRank = competitors.find((c) => c.isYou)?.rank || 0;
  const spotsFromTop = userRank - 1;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Competitor Ranking Table
            </h2>
            <span className="text-sm text-muted-foreground">
              Your performance among tracked competitors
            </span>
          </div>
        </div>
        <PeriodFilter
          activePeriod={activePeriod}
          onChange={setActivePeriod}
        />
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">Rank</TableHead>
              <TableHead>Competitor</TableHead>
              <TableHead className="text-right">Followers</TableHead>
              <TableHead className="text-right">Engagement</TableHead>
              <TableHead className="text-right">Avg Views</TableHead>
              <TableHead className="text-right">Hookly Score</TableHead>
              <TableHead className="text-right">Trend</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {competitors.map((competitor) => (
              <TableRow
                key={competitor.name}
                className={cn(
                  "transition-all duration-200 cursor-pointer",
                  competitor.isYou
                    ? "bg-primary/5 hover:bg-primary/10"
                    : "hover:bg-muted/50"
                )}
                onClick={() => handleRowClick(competitor)}
              >
                <TableCell>
                  <RankBadge
                    rank={competitor.rank}
                    change={competitor.rankChange}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-bold">
                      {competitor.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-foreground">
                      {competitor.name}
                    </span>
                    {competitor.isYou && (
                      <Badge variant="secondary" className="text-xs">
                        You
                      </Badge>
                    )}
                    {competitor.score >= 90 && (
                      <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end">
                    <span className="text-foreground">
                      {competitor.followers}
                    </span>
                    <GrowthIndicator value={competitor.followerGrowth} />
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end">
                    <span className="text-foreground">
                      {competitor.engagement}
                    </span>
                    <GrowthIndicator value={competitor.engagementGrowth} />
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end">
                    <span className="text-foreground">
                      {competitor.avgViews}
                    </span>
                    <GrowthIndicator value={competitor.viewsGrowth} />
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <ScoreBadge score={competitor.score} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end">
                    <TrendSparkline
                      data={competitor.trend}
                      growth={competitor.engagementGrowth}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {userRank > 1 && (
        <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 animate-fade-in">
          <p className="text-sm text-foreground">
            🎯 You're ranked #{userRank} — just{" "}
            <span className="font-bold text-primary">{spotsFromTop} spots</span>{" "}
            away from the top!
          </p>
        </div>
      )}

      <InsightCard />

      <CompetitorDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        competitor={selectedCompetitor}
      />
    </div>
  );
};
