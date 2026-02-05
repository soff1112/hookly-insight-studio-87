import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Target, AlertTriangle, Clock, Sparkles } from "lucide-react";
import { useInsightsFilters } from "@/contexts/InsightsFilterContext";

interface ActionItem {
  id: string;
  title: string;
  reason: string;
  impact: "low" | "medium" | "high";
  completed: boolean;
}

export const InsightsActionsSection = () => {
  const { filters } = useInsightsFilters();
  
  const [actions, setActions] = useState<ActionItem[]>([
    {
      id: "1",
      title: "Increase posting frequency to 2x per day",
      reason: "Your top competitors post 8-10 times daily while you average 2.3 posts. Increasing frequency could boost reach by 40%.",
      impact: "high",
      completed: false,
    },
    {
      id: "2",
      title: "Optimize hook length to under 3 seconds",
      reason: "Analysis shows 78% of viral content uses hooks under 3 seconds. Your average hook length is 5.2 seconds.",
      impact: "high",
      completed: false,
    },
    {
      id: "3",
      title: "Test question-based hooks on TikTok",
      reason: "Question hooks drive 34% higher engagement rate on TikTok based on competitor analysis.",
      impact: "medium",
      completed: false,
    },
  ]);

  const toggleAction = (id: string) => {
    setActions(prev => prev.map(a => 
      a.id === id ? { ...a, completed: !a.completed } : a
    ));
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high": return "bg-red-100 text-red-700 border-red-200";
      case "medium": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "low": return "bg-green-100 text-green-700 border-green-200";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const metricLabel = {
    views: "views",
    likes: "likes",
    comments: "comments",
    shares: "shares",
    engagementRate: "engagement rate",
  }[filters.primaryMetric];

  const timeLabel = {
    "24h": "24 hours",
    "7d": "7 days",
    "30d": "30 days",
    "90d": "90 days",
    "custom": "selected period",
  }[filters.timeRange];

  return (
    <div className="space-y-6">
      {/* Insight Summary */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Lightbulb className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">AI Analysis Summary</CardTitle>
              <CardDescription>
                Key findings from the last {timeLabel}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-foreground leading-relaxed">
              Based on your selected filters, your {metricLabel} performance trails the top competitor by approximately 42%. 
              The primary gap appears in posting frequency and hook optimization. Your engagement rate of 4.2% is below 
              the competitor average of 6.8%, suggesting content resonance can be improved through format adjustments.
            </p>
            
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="gap-1">
                <AlertTriangle className="w-3 h-3" />
                42% performance gap
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Clock className="w-3 h-3" />
                Hook optimization needed
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Target className="w-3 h-3" />
                Posting frequency low
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommended Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Recommended Actions</CardTitle>
              <CardDescription>
                Data-driven steps to improve performance
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {actions.map((action) => (
              <div 
                key={action.id}
                className={`p-4 rounded-lg border transition-all ${
                  action.completed ? "bg-muted/50 opacity-60" : "bg-card hover:bg-muted/30"
                }`}
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={action.completed}
                    onCheckedChange={() => toggleAction(action.id)}
                    className="mt-0.5"
                  />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className={`text-sm font-medium ${action.completed ? "line-through" : ""}`}>
                        {action.title}
                      </h4>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getImpactColor(action.impact)}`}
                      >
                        {action.impact} impact
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {action.reason}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
