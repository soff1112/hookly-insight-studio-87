import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  Heart, 
  Users, 
  ArrowUpRight,
  Lightbulb,
  ChevronRight
} from "lucide-react";

interface KPIMetric {
  label: string;
  value: string;
  change: number;
  changeLabel: string;
  vsCompetitor?: string;
  icon: React.ReactNode;
}

const kpiMetrics: KPIMetric[] = [
  {
    label: "Total Views",
    value: "1.24M",
    change: 12.4,
    changeLabel: "vs last 7 days",
    vsCompetitor: "+8.2% above avg",
    icon: <Eye className="w-5 h-5" />
  },
  {
    label: "Avg Engagement Rate",
    value: "4.2%",
    change: -2.1,
    changeLabel: "vs last 7 days",
    vsCompetitor: "-2.6% below avg",
    icon: <Heart className="w-5 h-5" />
  },
  {
    label: "Follower Growth",
    value: "+2,847",
    change: 5.8,
    changeLabel: "vs last 7 days",
    vsCompetitor: "-1.4% below avg",
    icon: <Users className="w-5 h-5" />
  },
  {
    label: "Content Velocity",
    value: "2.3/day",
    change: -77,
    changeLabel: "vs top performer",
    vsCompetitor: "Top: 10/day",
    icon: <TrendingUp className="w-5 h-5" />
  }
];

interface TopInsight {
  priority: "critical" | "high" | "medium";
  title: string;
  impact: string;
  dataSource: string;
}

const topInsights: TopInsight[] = [
  {
    priority: "critical",
    title: "Content frequency gap is your #1 growth blocker",
    impact: "+25-40% reach potential",
    dataSource: "Based on 5 competitors • Last 7 days • 127 videos analyzed"
  },
  {
    priority: "high",
    title: "Peak posting time misalignment detected",
    impact: "+18% engagement potential",
    dataSource: "Based on 847 competitor posts • Optimal: 18:00-21:00 UTC+1"
  }
];

const priorityStyles = {
  critical: "bg-destructive/10 text-destructive border-destructive/20",
  high: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  medium: "bg-primary/10 text-primary border-primary/20"
};

const priorityLabels = {
  critical: "Critical",
  high: "High Priority",
  medium: "Opportunity"
};

export const ExecutiveOverview = () => {
  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Executive Overview</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Aggregated performance snapshot • 5 competitors tracked • Last 7 days
          </p>
        </div>
        <Badge variant="outline" className="text-xs">
          Auto-refreshed 2 min ago
        </Badge>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiMetrics.map((metric, index) => (
          <Card key={index} className="p-4 border-border">
            <div className="flex items-start justify-between">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                {metric.icon}
              </div>
              <div className="flex items-center gap-1 text-xs">
                {metric.change >= 0 ? (
                  <TrendingUp className="w-3 h-3 text-accent" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-destructive" />
                )}
                <span className={metric.change >= 0 ? "text-accent" : "text-destructive"}>
                  {metric.change >= 0 ? "+" : ""}{metric.change}%
                </span>
              </div>
            </div>
            
            <div className="mt-3">
              <div className="text-2xl font-bold text-foreground">{metric.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{metric.label}</div>
            </div>

            <div className="mt-3 pt-3 border-t border-border">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{metric.changeLabel}</span>
                {metric.vsCompetitor && (
                  <Badge 
                    variant="secondary" 
                    className={`text-[10px] px-1.5 py-0 ${
                      metric.vsCompetitor.includes("+") || metric.vsCompetitor.includes("above")
                        ? "bg-accent/10 text-accent"
                        : metric.vsCompetitor.includes("-") || metric.vsCompetitor.includes("below")
                        ? "bg-destructive/10 text-destructive"
                        : "bg-muted"
                    }`}
                  >
                    {metric.vsCompetitor}
                  </Badge>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Top AI Insights */}
      <Card className="p-5 border-border bg-gradient-to-br from-primary/5 to-transparent">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 rounded-lg bg-primary/10">
            <Lightbulb className="w-4 h-4 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground">Top AI Insights</h3>
          <Badge variant="outline" className="text-[10px] ml-auto">
            AI-generated
          </Badge>
        </div>

        <div className="space-y-3">
          {topInsights.map((insight, index) => (
            <div 
              key={index}
              className={`p-4 rounded-lg border ${priorityStyles[insight.priority]} cursor-pointer hover:shadow-sm transition-shadow`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge 
                      variant="secondary" 
                      className={`text-[10px] px-1.5 py-0 ${priorityStyles[insight.priority]}`}
                    >
                      {priorityLabels[insight.priority]}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium text-foreground">{insight.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{insight.dataSource}</p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-semibold text-accent">{insight.impact}</div>
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-xs mt-1">
                    View details <ChevronRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            4 more insights available in Strategy section below
          </p>
          <Button variant="link" size="sm" className="h-auto p-0 text-xs">
            Show all insights <ArrowUpRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </Card>
    </div>
  );
};
