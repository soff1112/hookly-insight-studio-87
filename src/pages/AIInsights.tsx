import { Sidebar } from "@/components/Sidebar";
import { Badge } from "@/components/ui/badge";
import { InsightsFilterProvider } from "@/contexts/InsightsFilterContext";
import { InsightsControlBar } from "@/components/insights/InsightsControlBar";
import { CompetitorPerformanceOverview } from "@/components/insights/CompetitorPerformanceOverview";
import { EngagementTrendsByPlatform } from "@/components/insights/EngagementTrendsByPlatform";
import { PostingRhythmVirality } from "@/components/insights/PostingRhythmVirality";
import { TopCompetitorAlert } from "@/components/insights/TopCompetitorAlert";
import { EngagementGapAnalysis } from "@/components/insights/EngagementGapAnalysis";
import { ViralityTrendsCard } from "@/components/insights/ViralityTrendsCard";
import { OptimalPostingTimes } from "@/components/insights/OptimalPostingTimes";
import { QuickWinCard } from "@/components/insights/QuickWinCard";
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

        {/* Block 1: Competitor Performance Overview */}
        <CompetitorPerformanceOverview />

        {/* Block 2: Engagement Trends by Platform */}
        <EngagementTrendsByPlatform />

        {/* Block 3: Posting Rhythm & Virality */}
        <PostingRhythmVirality />

        {/* Two Column Layout for Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Block 4: Top Competitor Alert */}
          <TopCompetitorAlert />

          {/* Block 5: Engagement Gap Analysis */}
          <EngagementGapAnalysis />
        </div>

        {/* Three Column Layout for Smaller Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Block 6: Virality Trends */}
          <ViralityTrendsCard />

          {/* Block 7: Optimal Posting Times */}
          <OptimalPostingTimes />

          {/* Block 8: Quick Win */}
          <QuickWinCard />
        </div>

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
