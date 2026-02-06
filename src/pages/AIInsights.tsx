import { Sidebar } from "@/components/Sidebar";
import { Badge } from "@/components/ui/badge";
import { InsightsFilterProvider } from "@/contexts/InsightsFilterContext";
import { InsightsControlBar } from "@/components/insights/InsightsControlBar";
import { RatingsChart } from "@/components/insights/RatingsChart";
import { MetricChangesChart } from "@/components/insights/MetricChangesChart";
import { ContentRankingPanel } from "@/components/insights/ContentRankingPanel";
import { PlatformBreakdownPanel } from "@/components/insights/PlatformBreakdownPanel";
import { AccountsComparisonTable } from "@/components/insights/AccountsComparisonTable";
import { InsightsActionsSection } from "@/components/insights/InsightsActionsSection";

const AIInsightsContent = () => {
  return (
    <main className="flex-1 p-8 overflow-auto">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Page Header */}
        <div className="space-y-3">
          <div>
            <h1 className="text-3xl font-bold text-foreground">AI Insights</h1>
            <p className="text-muted-foreground mt-1">
              Competitive intelligence → Insights → Actions
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-muted-foreground">
              6 accounts connected
            </Badge>
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              Plan: Pro
            </Badge>
          </div>
        </div>

        {/* Global Control Bar */}
        <InsightsControlBar />

        {/* Charts: Ratings + Metric Changes */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <RatingsChart />
          <MetricChangesChart />
        </div>

        {/* Two Column Layout: Content Ranking + Platform Breakdown */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <ContentRankingPanel />
          <PlatformBreakdownPanel />
        </div>

        {/* Panel D: Accounts Comparison Table */}
        <AccountsComparisonTable />

        {/* Insights & Actions Section */}
        <InsightsActionsSection />
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
