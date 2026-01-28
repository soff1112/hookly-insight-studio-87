import { useMemo } from "react";
import { Trophy, TrendingUp, TrendingDown, Minus, Star } from "lucide-react";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { cn } from "@/lib/utils";

interface RankingCardProps {
  className?: string;
}

export const RankingCard = ({ className }: RankingCardProps) => {
  const { getUserRanking, getMainAccount, getAverageMetric } = useWorkspace();
  
  const ranking = getUserRanking();
  const mainAccount = getMainAccount();
  const avgCompetitorER = getAverageMetric('engagementRate');
  
  const erDiff = useMemo(() => {
    if (!mainAccount) return 0;
    return mainAccount.metrics.engagementRate - avgCompetitorER;
  }, [mainAccount, avgCompetitorER]);

  const percentile = useMemo(() => {
    if (ranking.total === 0) return 0;
    return Math.round(((ranking.total - ranking.position + 1) / ranking.total) * 100);
  }, [ranking]);

  const getTrendIcon = () => {
    if (erDiff > 0.5) return <TrendingUp className="w-4 h-4 text-accent" />;
    if (erDiff < -0.5) return <TrendingDown className="w-4 h-4 text-destructive" />;
    return <Minus className="w-4 h-4 text-muted-foreground" />;
  };

  const getRankBadgeColor = () => {
    if (ranking.position === 1) return "bg-yellow-500/20 text-yellow-500 border-yellow-500/30";
    if (ranking.position <= 3) return "bg-accent/20 text-accent border-accent/30";
    if (ranking.position <= 5) return "bg-primary/20 text-primary border-primary/30";
    return "bg-muted text-muted-foreground border-border";
  };

  if (!mainAccount) {
    return (
      <div className={cn("p-4 rounded-lg border border-border bg-card", className)}>
        <p className="text-sm text-muted-foreground">Connect an account to see ranking</p>
      </div>
    );
  }

  return (
    <div className={cn(
      "p-5 rounded-xl border border-border bg-card hover:shadow-card-hover transition-all",
      className
    )}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-primary/10">
            <Trophy className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Your Ranking</h3>
            <p className="text-xs text-muted-foreground">Among tracked competitors</p>
          </div>
        </div>
        <div className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-bold",
          getRankBadgeColor()
        )}>
          {ranking.position === 1 && <Star className="w-3.5 h-3.5" />}
          #{ranking.position}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center p-3 rounded-lg bg-secondary/30">
          <div className="text-2xl font-bold text-foreground">
            #{ranking.position}
          </div>
          <div className="text-xs text-muted-foreground">Position</div>
        </div>
        <div className="text-center p-3 rounded-lg bg-secondary/30">
          <div className="text-2xl font-bold text-foreground">
            {ranking.total}
          </div>
          <div className="text-xs text-muted-foreground">Accounts</div>
        </div>
        <div className="text-center p-3 rounded-lg bg-secondary/30">
          <div className="text-2xl font-bold text-primary">
            {percentile}%
          </div>
          <div className="text-xs text-muted-foreground">Percentile</div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Your ER</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground">
              {mainAccount.metrics.engagementRate.toFixed(1)}%
            </span>
            {getTrendIcon()}
          </div>
        </div>
        
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Competitors Avg</span>
          </div>
          <span className="text-sm font-semibold text-foreground">
            {avgCompetitorER.toFixed(1)}%
          </span>
        </div>

        <div className={cn(
          "flex items-center justify-between p-3 rounded-lg",
          erDiff >= 0 ? "bg-accent/10" : "bg-destructive/10"
        )}>
          <span className="text-sm font-medium">Gap</span>
          <span className={cn(
            "text-sm font-bold",
            erDiff >= 0 ? "text-accent" : "text-destructive"
          )}>
            {erDiff >= 0 ? '+' : ''}{erDiff.toFixed(2)} pp
          </span>
        </div>
      </div>
    </div>
  );
};
