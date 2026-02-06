import { Sidebar } from "@/components/Sidebar";
import { Badge } from "@/components/ui/badge";
import { InsightsFilterProvider } from "@/contexts/InsightsFilterContext";
import { InsightsControlBar } from "@/components/insights/InsightsControlBar";
import { RatingsPanel } from "@/components/insights/RatingsPanel";
import { MetricChangesPanel } from "@/components/insights/MetricChangesPanel";
import { EngagementRatingPanel } from "@/components/insights/EngagementRatingPanel";
import { PlatformStatisticsPanel } from "@/components/insights/PlatformStatisticsPanel";
import { AccountStatisticsPanel } from "@/components/insights/AccountStatisticsPanel";
import { VideoStatisticsPanel } from "@/components/insights/VideoStatisticsPanel";

const AIInsightsContent = () => {
  return (
    <main className="flex-1 p-8 overflow-auto">
      <div className="max-w-[1800px] mx-auto space-y-6">
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

        {/* Time Series Panels - Full Width */}
        <div className="grid grid-cols-1 gap-6">
          <RatingsPanel />
          <MetricChangesPanel />
        </div>

        {/* Horizontal Bar Panels - Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <EngagementRatingPanel />
          <div className="space-y-6">
            <PlatformStatisticsPanel />
            <AccountStatisticsPanel />
          </div>
        </div>

        {/* Video Statistics - Full Width */}
        <VideoStatisticsPanel />
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
