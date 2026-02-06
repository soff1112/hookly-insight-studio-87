import { Sidebar } from "@/components/Sidebar";
import { Badge } from "@/components/ui/badge";
import { InsightsFilterProvider } from "@/contexts/InsightsFilterContext";
import { InsightsControlBar } from "@/components/insights/InsightsControlBar";
import { RatingsChart } from "@/components/insights/RatingsChart";
import { MetricChangesChart } from "@/components/insights/MetricChangesChart";
import { ContentRankingPanel } from "@/components/insights/ContentRankingPanel";
import { PlatformStatsChart } from "@/components/insights/PlatformStatsChart";
import { PlatformMultiMetricChart } from "@/components/insights/PlatformMultiMetricChart";
import { AccountsComparisonTable } from "@/components/insights/AccountsComparisonTable";
import { InsightsActionsSection } from "@/components/insights/InsightsActionsSection";
import { Brain, Building2 } from "lucide-react";

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

        {/* Charts: Ratings + Metric Changes - full width, stacked */}
        <div className="space-y-6">
          <RatingsChart />
          <MetricChangesChart />
        </div>

        {/* Platform Statistics - Two Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <PlatformStatsChart 
            title="Platform Statistics" 
            description="Performance breakdown by platform"
          />
          <PlatformMultiMetricChart />
        </div>

        {/* Content Ranking */}
        <ContentRankingPanel />

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
