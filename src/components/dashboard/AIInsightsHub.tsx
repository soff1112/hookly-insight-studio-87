import { ReactNode, useState } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Clock, 
  Zap, 
  Target,
  BarChart3,
  RefreshCw,
  ChevronRight,
  Lightbulb
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { cn } from "@/lib/utils";

interface InsightCardProps {
  type: 'competitor_alert' | 'engagement_gap' | 'virality_trends' | 
        'posting_times' | 'content_frequency' | 'hook_performance';
  priority?: 'high' | 'medium' | 'low';
}

const PRIORITY_STYLES = {
  high: 'border-l-destructive',
  medium: 'border-l-yellow-500',
  low: 'border-l-accent'
};

const INSIGHT_ICONS = {
  competitor_alert: TrendingUp,
  engagement_gap: BarChart3,
  virality_trends: Target,
  posting_times: Clock,
  content_frequency: Zap,
  hook_performance: Lightbulb
};

export const AIInsightCard = ({ type, priority = 'medium' }: InsightCardProps) => {
  const { getMainAccount, getTopCompetitors, getAverageMetric } = useWorkspace();
  const [isRegenerating, setIsRegenerating] = useState(false);

  const mainAccount = getMainAccount();
  const topCompetitors = getTopCompetitors(5);
  const avgCompetitorER = getAverageMetric('engagementRate');

  const Icon = INSIGHT_ICONS[type];

  const handleRegenerate = () => {
    setIsRegenerating(true);
    setTimeout(() => setIsRegenerating(false), 1500);
  };

  const renderContent = () => {
    switch (type) {
      case 'competitor_alert':
        const topComp = topCompetitors[0];
        return (
          <>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">🚀 Top Competitor Alert</h4>
                  <p className="text-xs text-muted-foreground">Updated 2h ago</p>
                </div>
              </div>
              <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
                +12% potential
              </Badge>
            </div>
            
            <div className="space-y-3 text-sm">
              <p className="text-foreground">
                <strong>{topComp?.handle || '@top_creator'}</strong> gained{' '}
                <span className="text-accent font-semibold">+5.2K followers</span> this week 
                using short hooks under 15s.
              </p>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 rounded bg-muted/30">
                  <div className="text-xs text-muted-foreground">Their avg duration</div>
                  <div className="font-semibold text-foreground">
                    {topComp?.metrics.avgVideoDuration || 28}s
                  </div>
                </div>
                <div className="p-2 rounded bg-muted/30">
                  <div className="text-xs text-muted-foreground">Your avg duration</div>
                  <div className="font-semibold text-destructive">
                    {mainAccount?.metrics.avgVideoDuration || 45}s
                  </div>
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground">
                <strong>Top 3 hook patterns:</strong> Question (40%), Shock (30%), Emotional (20%)
              </div>
            </div>
            
            <div className="flex gap-2 mt-4">
              <Button size="sm" className="text-xs">
                Generate Short Hooks
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          </>
        );

      case 'engagement_gap':
        const userER = mainAccount?.metrics.engagementRate || 4.2;
        const pieData = [
          { name: 'You', value: userER, fill: 'hsl(var(--primary))' },
          { name: 'Gap', value: Math.max(avgCompetitorER - userER, 0), fill: 'hsl(var(--muted))' },
        ];
        const gapPercent = ((avgCompetitorER - userER) / avgCompetitorER * 100).toFixed(0);
        
        return (
          <>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-yellow-500/10">
                  <Icon className="w-4 h-4 text-yellow-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">📊 Engagement Gap</h4>
                  <p className="text-xs text-muted-foreground">vs competitor average</p>
                </div>
              </div>
              <Badge variant="secondary" className="text-xs bg-yellow-500/10 text-yellow-500">
                -{gapPercent}% gap
              </Badge>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-24 h-24">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={25}
                      outerRadius={40}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Your ER</span>
                  <span className="font-semibold text-primary">{userER.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Competitor Avg</span>
                  <span className="font-semibold text-foreground">{avgCompetitorER.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Top Performer</span>
                  <span className="font-semibold text-accent">
                    {topCompetitors[0]?.metrics.engagementRate.toFixed(1) || '8.5'}%
                  </span>
                </div>
              </div>
            </div>
            
            <p className="text-xs text-muted-foreground mt-3">
              <strong>Diagnosis:</strong> Your Instagram ER lags behind. 
              Posting more frequently with Question Hooks could close this gap.
            </p>

            <div className="flex gap-2 mt-4">
              <Button size="sm" variant="outline" className="text-xs">
                View Platform Breakdown
              </Button>
            </div>
          </>
        );

      case 'content_frequency':
        const userPosts = mainAccount?.metrics.postsPerDay || 2.3;
        const topPosts = topCompetitors[0]?.metrics.postsPerDay || 8.5;
        const freqGap = ((topPosts - userPosts) / topPosts * 100).toFixed(0);
        
        return (
          <>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-destructive/10">
                  <AlertTriangle className="w-4 h-4 text-destructive" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">⚡ Content Frequency Gap</h4>
                  <p className="text-xs text-muted-foreground">Critical improvement area</p>
                </div>
              </div>
              <Badge variant="secondary" className="text-xs bg-destructive/10 text-destructive">
                {freqGap}% below
              </Badge>
            </div>

            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">You</span>
                  <span className="font-semibold text-destructive">{userPosts.toFixed(1)} posts/day</span>
                </div>
                <Progress value={(userPosts / topPosts) * 100} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Top performers</span>
                  <span className="font-semibold text-accent">{topPosts.toFixed(1)} posts/day</span>
                </div>
                <Progress value={100} className="h-2 bg-accent/20" />
              </div>
            </div>

            <div className="mt-4 p-3 rounded-lg bg-yellow-500/10">
              <p className="text-xs text-foreground">
                <strong>📈 Recommendation:</strong> Test increasing to 5-6 posts/day for 30 days.<br/>
                <span className="text-muted-foreground">Expected impact: +25-40% reach, +15% follower growth.</span>
              </p>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className={cn(
      "p-5 rounded-xl border-2 border-border bg-card border-l-4 hover:shadow-card-hover transition-all",
      PRIORITY_STYLES[priority]
    )}>
      <div className="relative">
        {renderContent()}
        
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-0 right-0 h-7 w-7 p-0"
          onClick={handleRegenerate}
          disabled={isRegenerating}
        >
          <RefreshCw className={cn(
            "w-3.5 h-3.5",
            isRegenerating && "animate-spin"
          )} />
        </Button>
      </div>
    </div>
  );
};

export const AIInsightsHub = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Lightbulb className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">AI Insights</h3>
            <p className="text-sm text-muted-foreground">
              Personalized recommendations based on your data
            </p>
          </div>
        </div>
        <Badge variant="outline" className="text-xs">
          3 new insights
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        <AIInsightCard type="competitor_alert" priority="high" />
        <AIInsightCard type="engagement_gap" priority="medium" />
        <AIInsightCard type="content_frequency" priority="high" />
      </div>
    </div>
  );
};
