import { Sidebar } from "@/components/Sidebar";
import { InsightsFilterProvider } from "@/contexts/InsightsFilterContext";
import { InsightsActionsSection } from "@/components/insights/InsightsActionsSection";
import { Lightbulb, Building2 } from "lucide-react";

const AIInsightsActionsContent = () => {
  return (
    <main className="flex-1 p-8 overflow-auto">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Page Header */}
        <div className="space-y-3">
          <div>
            <div className="flex items-center gap-2">
              <Lightbulb className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold text-foreground">AI Insights</h1>
            </div>
            <p className="text-muted-foreground mt-1">
              Prioritized actions based on diagnostic data
            </p>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Building2 className="w-4 h-4" />
            <span className="text-sm">Workspace:</span>
            <span className="text-sm font-semibold text-foreground">yoga</span>
          </div>
        </div>

        {/* AI Analysis Summary + Recommended Actions */}
        <InsightsActionsSection />
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
