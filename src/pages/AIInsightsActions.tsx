import { Sidebar } from "@/components/Sidebar";
import { InsightsFilterProvider } from "@/contexts/InsightsFilterContext";
import { InsightBlock } from "@/components/insights/InsightBlock";
import { 
  Lightbulb, Building2, TrendingDown, Video, Globe, Clock, Zap, Users 
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

const ComparisonBar = ({ label, value, maxValue }: { label: string; value: number; maxValue: number }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}%</span>
    </div>
    <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
      <div
        className="h-full rounded-full bg-primary transition-all"
        style={{ width: `${(value / maxValue) * 100}%` }}
      />
    </div>
  </div>
);

const TimeBlock = ({ time, label, active }: { time: string; label: string; active?: boolean }) => (
  <div className={`flex-1 p-3 rounded-xl text-center border ${active ? "border-primary/30 bg-primary/5" : "border-border bg-muted/30"}`}>
    <p className={`text-lg font-bold ${active ? "text-primary" : "text-foreground"}`}>{time}</p>
    <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
  </div>
);

const AIInsightsActionsContent = () => {
  return (
    <main className="flex-1 p-8 overflow-auto">
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">AI Insights</h1>
          </div>
          <p className="text-muted-foreground">
            What should you do next? Actionable recommendations based on your data.
          </p>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Building2 className="w-4 h-4" />
            <span className="text-sm">Workspace:</span>
            <span className="text-sm font-semibold text-foreground">yoga</span>
          </div>
        </div>

        {/* Insight Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 1 — Performance Gap */}
          <InsightBlock
            icon={TrendingDown}
            title="Performance Gap"
            insight="You are underperforming top competitors by 42%."
            explanation="Your average engagement rate is 4.2% while competitors average 6.8%. The gap is driven by lower hook retention and inconsistent posting."
            action="Focus on improving hook quality and posting consistency."
            impact="+15–30% potential reach growth"
            priority="high"
            accentColor="purple"
            visual={
              <div className="space-y-2.5">
                <ComparisonBar label="You" value={4.2} maxValue={10} />
                <ComparisonBar label="Competitors Avg" value={6.8} maxValue={10} />
              </div>
            }
          />

          {/* 2 — Content Strategy */}
          <InsightBlock
            icon={Video}
            title="What Top Competitors Do Better"
            insight="Top competitors gain higher engagement using short hooks and emotional storytelling."
            explanation="78% of their viral videos use hooks under 3 seconds. Your average hook length is 5.2 seconds."
            action="Test short hooks (under 3 seconds) in next 10 videos."
            impact="+12–20% engagement increase"
            priority="high"
            accentColor="rose"
            bullets={[
              "Question hooks (e.g. 'Did you know...')",
              "Shock hooks (unexpected statements)",
              "Emotional hooks (personal stories)",
            ]}
            ctaLabel="Generate Hook Ideas"
            onCta={() => {}}
          />

          {/* 3 — Platform Opportunity */}
          <InsightBlock
            icon={Globe}
            title="Platform Growth Opportunity"
            insight="Your strongest opportunity is TikTok."
            explanation="Competitors generate 33% higher engagement rate on TikTok compared to your account. TikTok rewards consistency and trend-based content."
            action="Increase content output on TikTok and adapt format to platform trends."
            impact="+18% engagement potential"
            priority="medium"
            accentColor="teal"
            visual={
              <div className="flex items-center gap-4">
                <div className="flex-1 space-y-2.5">
                  <ComparisonBar label="You (TikTok ER)" value={3.1} maxValue={8} />
                  <ComparisonBar label="Competitors (TikTok ER)" value={5.4} maxValue={8} />
                </div>
              </div>
            }
          />

          {/* 4 — Posting Time */}
          <InsightBlock
            icon={Clock}
            title="Best Time to Post"
            insight="Competitors perform best between 18:00–21:00."
            explanation="Your current peak posting time is 14:00. Shifting to competitor peak hours could significantly boost visibility."
            action="Test posting during 18:00–21:00 for 2 weeks."
            impact="+10–18% reach potential"
            priority="medium"
            accentColor="blue"
            visual={
              <div className="flex gap-3">
                <TimeBlock time="14:00" label="Your current" />
                <TimeBlock time="18:00–21:00" label="Optimal window" active />
              </div>
            }
          />

          {/* 5 — Quick Win */}
          <InsightBlock
            icon={Zap}
            title="Quick Win: Posting Frequency"
            insight="You post 2.3 videos/day. Top competitors post 8–10."
            explanation="Higher frequency strongly correlates with reach growth. Competitors with 5+ daily posts see 3x more impressions."
            action="Increase posting to 5 videos/day for a 30-day test."
            impact="+25–40% reach in first month"
            priority="high"
            accentColor="amber"
          />

          {/* 6 — Agency: Creator Performance */}
          <InsightBlock
            icon={Users}
            title="Creator Performance Optimization"
            insight="3 creators are underperforming below average engagement rate."
            explanation="Their engagement rate is 40% below the project average. Content format and posting times differ significantly from top performers."
            action="Replace low-performing creators OR test new content format."
            impact="+22% overall campaign performance"
            priority="high"
            accentColor="purple"
          />
        </div>
      </div>
    </main>
  );
};

const AIInsightsActions = () => {
  return (
    <div className="flex min-h-screen bg-background w-full">
      <Sidebar />
      <InsightsFilterProvider>
        <AIInsightsActionsContent />
      </InsightsFilterProvider>
    </div>
  );
};

export default AIInsightsActions;
