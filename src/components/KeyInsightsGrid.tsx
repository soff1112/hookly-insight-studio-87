import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const pieData = [
  { name: "You", value: 4.2 },
  { name: "Competitors", value: 6.8 }
];

const COLORS = ["hsl(163 82% 36%)", "hsl(252 76% 66%)"];

interface InsightCardProps {
  icon: string;
  title: string;
  bgClass: string;
  children: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  onRegenerate?: () => void;
}

const InsightCard = ({ icon, title, bgClass, children, actionLabel, onAction, onRegenerate }: InsightCardProps) => (
  <Card className={`p-5 border-2 ${bgClass} hover:shadow-card-hover transition-all duration-300 relative`}>
    {onRegenerate && (
      <Button 
        variant="ghost" 
        size="sm" 
        className="absolute top-3 right-3 h-7 w-7 p-0 opacity-60 hover:opacity-100"
        onClick={onRegenerate}
      >
        <RefreshCw className="w-3.5 h-3.5" />
      </Button>
    )}
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <span className="text-2xl">{icon}</span>
        <h4 className="font-semibold text-foreground pt-1">{title}</h4>
      </div>
      <div className="text-sm text-muted-foreground space-y-3">
        {children}
      </div>
      {actionLabel && onAction && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onAction}
          className="w-full border-primary/30 hover:bg-primary/10"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  </Card>
);

export const KeyInsightsGrid = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
        ⚡ Key Insights
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Top Competitor Alert */}
        <InsightCard
          icon="🚀"
          title="Top Competitor Alert"
          bgClass="border-primary/20 bg-primary/5"
          actionLabel="🎬 Regenerate Hooks"
          onAction={() => console.log("Regenerate hooks")}
          onRegenerate={() => console.log("Regenerate insight")}
        >
          <p>
            <strong>@topcompetitor</strong> gained 5.2% followers via short hooks (under 15s). 
            Your avg duration: <strong>28s</strong>—shorten for +12% views.
          </p>
          <div className="text-xs text-primary">
            → Top 3 hook patterns: Question, Shock, Emotional
          </div>
        </InsightCard>

        {/* Card 2: Engagement Gap Analysis */}
        <InsightCard
          icon="📊"
          title="Engagement Gap Analysis"
          bgClass="border-yellow-500/20 bg-yellow-500/5"
          actionLabel="📱 View Platform Breakdown"
          onAction={() => console.log("View breakdown")}
          onRegenerate={() => console.log("Regenerate insight")}
        >
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={100} height={100}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={25}
                  outerRadius={40}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-1">
              <p>Your ER: <strong>4.2%</strong> vs Avg: <strong>6.8%</strong></p>
              <p className="text-xs">
                Post more on TikTok (competitors avg 12.1% ER for 33% higher engagement).
              </p>
            </div>
          </div>
        </InsightCard>

        {/* Card 3: Virality Trends */}
        <InsightCard
          icon="🎯"
          title="Virality Trends"
          bgClass="border-accent/20 bg-accent/5"
          actionLabel="🔍 Analyze Videos"
          onAction={() => console.log("Analyze videos")}
          onRegenerate={() => console.log("Regenerate insight")}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>Top videos: 87-92% virality</span>
              <Badge variant="secondary" className="bg-accent/10 text-accent-foreground">
                +15% avg
              </Badge>
            </div>
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div 
                  key={i}
                  className="flex-1 h-16 bg-muted rounded-md flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                >
                  <span className="text-xs text-muted-foreground">Video {i}</span>
                </div>
              ))}
            </div>
            <p className="text-xs">
              Replicate: <strong>Educational hooks</strong> in fashion niche with emotional storytelling format.
            </p>
          </div>
        </InsightCard>

        {/* Card 4: Optimal Posting Times */}
        <InsightCard
          icon="⏰"
          title="Optimal Posting Times"
          bgClass="border-primary/20 bg-primary/5"
          onRegenerate={() => console.log("Regenerate insight")}
        >
          <p>
            Competitors with highest ER post during <strong>18:00-21:00</strong> (UTC+1). 
            Your current schedule peaks at <strong>14:00</strong> (UTC+1).
          </p>
          <div className="grid grid-cols-3 gap-2 pt-1">
            <div className="bg-muted rounded p-2 text-center">
              <div className="font-semibold text-foreground">18:00-21:00</div>
              <div className="text-xs text-muted-foreground">Best ER</div>
            </div>
            <div className="bg-muted rounded p-2 text-center">
              <div className="font-semibold text-foreground">14:00</div>
              <div className="text-xs text-muted-foreground">Your Peak</div>
            </div>
            <div className="bg-primary/10 rounded p-2 text-center">
              <div className="font-semibold text-primary">+18%</div>
              <div className="text-xs text-muted-foreground">Potential</div>
            </div>
          </div>
        </InsightCard>

        {/* Card 5: Quick Win - Full width */}
        <InsightCard
          icon="⚡"
          title="Quick Win: Content Frequency"
          bgClass="border-yellow-500/20 bg-yellow-500/5 md:col-span-2"
          onRegenerate={() => console.log("Regenerate insight")}
        >
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <p>
                You post <strong>2.3/day</strong> vs top performers' <strong>8-10/day</strong> (77% gap). 
                Test increasing to 5/day for 30 days.
              </p>
            </div>
            <div className="bg-accent/10 rounded-lg p-3 text-center shrink-0">
              <div className="text-lg font-bold text-accent">🚀 +25-40%</div>
              <div className="text-xs text-muted-foreground">Expected reach increase</div>
            </div>
          </div>
        </InsightCard>
      </div>
    </div>
  );
};
