import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { InsightsFilterProvider } from "@/contexts/InsightsFilterContext";
import { Lightbulb, Building2, Users, BarChart3 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { PerformanceSnapshot } from "@/components/growth-intelligence/PerformanceSnapshot";
import { GrowthDriverBreakdown } from "@/components/growth-intelligence/GrowthDriverBreakdown";
import { ContentIntelligence } from "@/components/growth-intelligence/ContentIntelligence";
import { PlatformIntelligence } from "@/components/growth-intelligence/PlatformIntelligence";
import { PrioritizedActionBoard } from "@/components/growth-intelligence/PrioritizedActionBoard";
import { AgencyIntelligence } from "@/components/growth-intelligence/AgencyIntelligence";

const AIInsightsActionsContent = () => {
  const [agencyMode, setAgencyMode] = useState(false);

  return (
    <main className="flex-1 p-8 overflow-auto">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="space-y-3">
            <div>
              <div className="flex items-center gap-2">
                <Lightbulb className="w-8 h-8 text-primary" />
                <h1 className="text-3xl font-bold text-foreground">AI Insights</h1>
              </div>
              <p className="text-muted-foreground mt-1">
                Strategic intelligence & prioritized growth actions
              </p>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Building2 className="w-4 h-4" />
              <span className="text-sm">Workspace:</span>
              <span className="text-sm font-semibold text-foreground">yoga</span>
            </div>
          </div>

          {/* Mode Toggle */}
          <div className="flex items-center gap-3 p-3 rounded-xl border bg-card">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Brand</span>
            </div>
            <Switch checked={agencyMode} onCheckedChange={setAgencyMode} />
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Agency</span>
            </div>
            {agencyMode && (
              <Badge className="bg-primary/10 text-primary border-primary/20 text-xs" variant="outline">
                Agency Mode
              </Badge>
            )}
          </div>
        </div>

        {/* Brand Mode */}
        {!agencyMode && (
          <div className="space-y-6">
            <PerformanceSnapshot />
            <GrowthDriverBreakdown />
            <ContentIntelligence />
            <PlatformIntelligence />
            <PrioritizedActionBoard />
          </div>
        )}

        {/* Agency Mode */}
        {agencyMode && <AgencyIntelligence />}
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
