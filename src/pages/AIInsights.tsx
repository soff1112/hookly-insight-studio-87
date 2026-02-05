import { Link } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { InsightsHeader } from "@/components/insights/InsightsHeader";
import { PerformanceTrendsChart } from "@/components/insights/PerformanceTrendsChart";
import { EngagementRatingChart } from "@/components/insights/EngagementRatingChart";
import { PlatformBreakdownChart } from "@/components/insights/PlatformBreakdownChart";
import { PostingRhythmViralityTable } from "@/components/insights/PostingRhythmViralityTable";
import { ViralityDistributionChart } from "@/components/insights/ViralityDistributionChart";
import { KeyInsightsGrid } from "@/components/insights/KeyInsightsGrid";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";

const AIInsights = () => {
  return (
    <div className="flex min-h-screen bg-background w-full">
      <Sidebar />
      
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-[1400px] mx-auto space-y-8">
          {/* Header with Global Time Range */}
          <InsightsHeader workspaceName="Marketing Agency" accountsCount={3} />

          {/* Performance Over Time */}
          <PerformanceTrendsChart />

          {/* Two Column Layout: Engagement Rating + Platform Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <EngagementRatingChart />
            <PlatformBreakdownChart />
          </div>

          {/* Posting Rhythm & Virality Table */}
          <PostingRhythmViralityTable />

          {/* Two Column Layout: Virality Distribution + Strategy CTA */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ViralityDistributionChart />
            
            {/* Marketing Strategy CTA */}
            <Card className="p-6 border-primary/20 bg-gradient-to-br from-primary/5 to-purple-500/5">
              <div className="h-full flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">AI Strategy Workspace</h3>
                      <p className="text-sm text-muted-foreground">Generate personalized marketing strategies</p>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-accent" />
                      SWOT Analysis based on your data
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-accent" />
                      90-Day Action Plan with milestones
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-accent" />
                      ChatGPT-style follow-up conversations
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-accent" />
                      Export strategies as PDF
                    </div>
                  </div>
                </div>

                <Button size="lg" className="w-full gap-2 group" asChild>
                  <Link to="/marketing-strategy">
                    <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    Open Marketing Strategy
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </Card>
          </div>

          {/* Key AI Insights Grid */}
          <KeyInsightsGrid />
        </div>
      </main>
    </div>
  );
};

export default AIInsights;
