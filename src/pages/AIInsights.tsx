import { Sidebar } from "@/components/Sidebar";
import { InsightsFilterProvider } from "@/contexts/InsightsFilterContext";
import { InsightsControlBar } from "@/components/insights/InsightsControlBar";
import { RatingsChart } from "@/components/insights/RatingsChart";
import { MetricChangesChart } from "@/components/insights/MetricChangesChart";
import { PlatformStatsChart } from "@/components/insights/PlatformStatsChart";
import { PlatformMultiMetricChart } from "@/components/insights/PlatformMultiMetricChart";
import { AccountStatsChart } from "@/components/insights/AccountStatsChart";
import { AccountsComparisonTable } from "@/components/insights/AccountsComparisonTable";
import { AIRecommendationBlock } from "@/components/insights/AIRecommendationBlock";
import { Brain, Building2 } from "lucide-react";

const ChartWithRecommendation = ({ children, recommendations }: { children: React.ReactNode; recommendations: string[] }) => (
  <div className="[&>div:first-child]:rounded-b-none [&>div:first-child]:border-b-0 [&>div:first-child]:shadow-none">
    {children}
    <div className="rounded-b-lg border border-t-0 border-border bg-card px-6 pb-5 pt-1">
      <AIRecommendationBlock recommendations={recommendations} />
    </div>
  </div>
);

const AIInsightsContent = () => {
  return (
    <main className="flex-1 p-8 overflow-auto">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Page Header */}
        <div className="space-y-3">
          <div>
            <div className="flex items-center gap-2">
              <Brain className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold text-foreground">AI Insights</h1>
            </div>
            <p className="text-muted-foreground mt-1">
              Deep competitive intelligence
            </p>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Building2 className="w-4 h-4" />
            <span className="text-sm">Workspace:</span>
            <span className="text-sm font-semibold text-foreground">yoga</span>
          </div>
        </div>

        {/* Global Control Bar */}
        <InsightsControlBar />

        {/* Ratings + AI Recommendation */}
        <ChartWithRecommendation
          recommendations={[
            "Engagement rate declined 12% over the last 7 days despite stable posting. Possible hook fatigue — test shorter openings under 3 seconds.",
            "Share rate shows a downward trend. Experiment with controversy-driven or question-based hooks to increase shareability."
          ]}
        >
          <RatingsChart />
        </ChartWithRecommendation>

        {/* Metric Changes + AI Recommendation */}
        <ChartWithRecommendation
          recommendations={[
            "High volatility detected in daily views. Posting consistency may be affecting algorithm reach — aim for fixed daily publishing slots.",
            "Likes and comments are growing slower than views, indicating reduced content resonance. Review top-performing formats from competitors."
          ]}
        >
          <MetricChangesChart />
        </ChartWithRecommendation>

        {/* Platform Statistics + AI Recommendation */}
        <div>
          <div className="[&>div]:rounded-b-none [&>div]:border-b-0 [&>div]:shadow-none">
            <PlatformStatsChart
              title="Platform Statistics"
              description="Performance breakdown by platform"
            />
          </div>
          <div className="[&>div]:rounded-none [&>div]:border-t-0 [&>div]:border-b-0 [&>div]:shadow-none">
            <PlatformMultiMetricChart />
          </div>
          <div className="[&>div]:rounded-none [&>div]:border-t-0 [&>div]:border-b-0 [&>div]:shadow-none">
            <AccountStatsChart />
          </div>
          <div className="rounded-b-lg border border-t-0 border-border bg-card px-6 pb-5 pt-1">
            <AIRecommendationBlock
              recommendations={[
                "TikTok generates 52% higher ER than Instagram. Consider reallocating posting frequency toward TikTok for maximum engagement.",
                "YouTube has the lowest volume but highest average view duration. Use it for long-form authority content while TikTok drives reach."
              ]}
            />
          </div>
        </div>

        {/* Accounts Strategic Comparison (includes its own AI Recommendation) */}
        <AccountsComparisonTable />
      </div>
    </main>
  );
};

const AIInsights = () => {
  return (
    <div className="flex min-h-screen bg-background w-full">
      <Sidebar />
      <InsightsFilterProvider>
        <AIInsightsContent />
      </InsightsFilterProvider>
    </div>
  );
};

export default AIInsights;
