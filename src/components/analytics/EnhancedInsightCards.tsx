import { ReactNode } from "react";
import { DashboardCard } from "@/components/DashboardCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LucideIcon, RefreshCw, TrendingUp, TrendingDown } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

interface EnhancedInsightCardProps {
  icon: LucideIcon;
  title: string;
  variant?: "default" | "success" | "warning" | "danger";
  impactBadge?: { label: string; value: string };
  children: ReactNode;
  actions?: Array<{ label: string; onClick: () => void }>;
  onRegenerate?: () => void;
}

const variantStyles = {
  default: "border-l-primary",
  success: "border-l-accent",
  warning: "border-l-yellow-500",
  danger: "border-l-destructive",
};

export const EnhancedInsightCard = ({
  icon: Icon,
  title,
  variant = "default",
  impactBadge,
  children,
  actions,
  onRegenerate,
}: EnhancedInsightCardProps) => {
  return (
    <div className={`p-5 rounded-lg border-2 border-border bg-card border-l-4 ${variantStyles[variant]} hover:shadow-card-hover transition-all`}>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <h4 className="font-semibold text-foreground">{title}</h4>
          </div>
          <div className="flex items-center gap-2">
            {impactBadge && (
              <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
                {impactBadge.label}: {impactBadge.value}
              </Badge>
            )}
            {onRegenerate && (
              <Button variant="ghost" size="sm" onClick={onRegenerate} className="h-7 w-7 p-0">
                <RefreshCw className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
        </div>

        <div className="text-sm text-muted-foreground space-y-3">
          {children}
        </div>

        {actions && actions.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {actions.map((action, i) => (
              <Button
                key={i}
                variant="outline"
                size="sm"
                onClick={action.onClick}
                className="text-xs border-primary/30 hover:bg-primary/10"
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Specialized Insight Cards

interface CompetitorAlertProps {
  competitorHandle: string;
  followerGain: string;
  strategy: string;
  theirDuration: string;
  yourDuration: string;
  topHookPatterns: string[];
  potentialViewsIncrease: string;
  onRegenerateHooks: () => void;
}

export const CompetitorAlertCard = ({
  competitorHandle,
  followerGain,
  strategy,
  theirDuration,
  yourDuration,
  topHookPatterns,
  potentialViewsIncrease,
  onRegenerateHooks,
}: CompetitorAlertProps) => (
  <EnhancedInsightCard
    icon={TrendingUp}
    title="🚀 Top Competitor Alert"
    variant="default"
    impactBadge={{ label: "Potential", value: potentialViewsIncrease }}
    onRegenerate={() => console.log("Regenerate")}
    actions={[{ label: "🎬 Regenerate Hooks", onClick: onRegenerateHooks }]}
  >
    <p>
      <strong>{competitorHandle}</strong> gained <strong className="text-accent">{followerGain} followers</strong> this week via {strategy}.
    </p>
    <div className="grid grid-cols-2 gap-2 text-xs">
      <div className="bg-muted/50 rounded p-2">
        <div className="text-muted-foreground">Their avg duration</div>
        <div className="font-semibold text-foreground">{theirDuration}</div>
      </div>
      <div className="bg-muted/50 rounded p-2">
        <div className="text-muted-foreground">Your avg duration</div>
        <div className="font-semibold text-destructive">{yourDuration}</div>
      </div>
    </div>
    <p className="text-xs">
      <strong>Why it matters:</strong> Shorter hooks (under 15s) have 2.3× higher completion rates, driving algorithm distribution.
    </p>
    <div className="text-xs text-primary">
      → Top 3 hook patterns: {topHookPatterns.join(", ")}
    </div>
  </EnhancedInsightCard>
);

interface EngagementGapProps {
  userER: number;
  competitorAvgER: number;
  topPerformerER: number;
  gapPercent: string;
  platformRecommendation: string;
  onViewBreakdown: () => void;
}

const COLORS = ["hsl(163 82% 36%)", "hsl(var(--muted-foreground))", "hsl(var(--primary))"];

export const EngagementGapCard = ({
  userER,
  competitorAvgER,
  topPerformerER,
  gapPercent,
  platformRecommendation,
  onViewBreakdown,
}: EngagementGapProps) => {
  const pieData = [
    { name: "You", value: userER },
    { name: "Competitor Avg", value: competitorAvgER },
    { name: "Top Performer", value: topPerformerER },
  ];

  return (
    <EnhancedInsightCard
      icon={TrendingDown}
      title="📊 Engagement Gap Analysis"
      variant="warning"
      impactBadge={{ label: "Gap", value: gapPercent }}
      actions={[{ label: "📱 View Platform Breakdown", onClick: onViewBreakdown }]}
    >
      <ResponsiveContainer width="100%" height={100}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            innerRadius={25}
            outerRadius={45}
            paddingAngle={5}
            dataKey="value"
          >
            {pieData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              fontSize: '12px'
            }}
            formatter={(value: number) => [`${value}%`, 'ER']}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-3 gap-2 text-xs text-center">
        <div>
          <div className="font-semibold text-foreground">{userER}%</div>
          <div className="text-muted-foreground">You</div>
        </div>
        <div>
          <div className="font-semibold text-foreground">{competitorAvgER}%</div>
          <div className="text-muted-foreground">Competitor Avg</div>
        </div>
        <div>
          <div className="font-semibold text-primary">{topPerformerER}%</div>
          <div className="text-muted-foreground">Top Performer</div>
        </div>
      </div>
      <p className="text-xs">
        <strong>Diagnosis:</strong> {platformRecommendation}
      </p>
    </EnhancedInsightCard>
  );
};

interface ViralityTrendsProps {
  viralityRange: string;
  topVideos: Array<{ title: string; virality: number }>;
  hookPatternToReplicate: string;
  onAnalyzeVideos: () => void;
}

export const ViralityTrendsCard = ({
  viralityRange,
  topVideos,
  hookPatternToReplicate,
  onAnalyzeVideos,
}: ViralityTrendsProps) => (
  <EnhancedInsightCard
    icon={TrendingUp}
    title="🎯 Virality Trends"
    variant="success"
    impactBadge={{ label: "Rank", value: "Top 15%" }}
    actions={[{ label: "🔍 Analyze Videos", onClick: onAnalyzeVideos }]}
  >
    <div className="flex items-center justify-between text-xs">
      <span>Your top 3 videos: {viralityRange} virality score</span>
      <Badge variant="secondary" className="bg-accent/10 text-accent-foreground">
        +15% vs avg
      </Badge>
    </div>
    <div className="space-y-1 text-xs">
      {topVideos.slice(0, 3).map((video, i) => (
        <div key={i} className="flex items-center justify-between bg-muted/50 rounded p-2">
          <span className="truncate max-w-[180px]">{video.title}</span>
          <span className="font-semibold text-accent">{video.virality}%</span>
        </div>
      ))}
    </div>
    <p className="text-xs">
      <strong>Success pattern:</strong> {hookPatternToReplicate}
    </p>
  </EnhancedInsightCard>
);

interface ContentFrequencyProps {
  userPostsPerDay: number;
  topPerformerRange: string;
  gapPercent: string;
  expectedLift: string;
}

export const ContentFrequencyCard = ({
  userPostsPerDay,
  topPerformerRange,
  gapPercent,
  expectedLift,
}: ContentFrequencyProps) => (
  <EnhancedInsightCard
    icon={TrendingDown}
    title="⚠️ Critical: Content Frequency Gap"
    variant="danger"
    impactBadge={{ label: "Expected Lift", value: expectedLift }}
  >
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span>You:</span>
        <span className="font-semibold text-destructive">{userPostsPerDay} posts/day</span>
      </div>
      <div className="flex items-center justify-between">
        <span>Top performers:</span>
        <span className="font-semibold text-accent">{topPerformerRange} posts/day</span>
      </div>
      <div className="flex items-center justify-between text-primary font-medium">
        <span>Volume gap:</span>
        <span>{gapPercent} below benchmark</span>
      </div>
    </div>
    <div className="bg-yellow-500/10 rounded p-2 text-xs space-y-1">
      <p className="font-medium">📈 Recommendation:</p>
      <p>Test increasing to 5-6 posts/day for 30 days (achievable 2.5× increase).</p>
      <p className="text-muted-foreground">Expected impact: +25-40% reach, +15% follower growth rate.</p>
    </div>
  </EnhancedInsightCard>
);
