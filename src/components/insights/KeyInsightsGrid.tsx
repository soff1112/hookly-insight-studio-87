import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  AlertTriangle, 
  Clock, 
  Zap,
  ArrowRight
} from "lucide-react";

const insights = [
  {
    icon: TrendingUp,
    title: "Engagement Gap Analysis",
    description: "Your ER is 4.2% vs competitor avg of 6.8%. Closing this gap could increase reach by 40%.",
    action: "Analyze Videos",
    variant: "primary" as const,
  },
  {
    icon: AlertTriangle,
    title: "Top Competitor Alert",
    description: "@topcompetitor gained 5.2% followers via short hooks under 15s. Your avg: 28s.",
    action: "Regenerate Hooks",
    variant: "warning" as const,
  },
  {
    icon: Clock,
    title: "Optimal Posting Time",
    description: "Peak engagement at 6-9 PM. You currently post at 2 PM—shift timing for +18% ER.",
    action: "View Breakdown",
    variant: "accent" as const,
  },
  {
    icon: Zap,
    title: "Hook Pattern Recommendation",
    description: "Question hooks drive 2.3x more comments. Try: 'Did you know...' or 'Why does...'",
    action: "Generate Hooks",
    variant: "primary" as const,
  },
];

const variantStyles = {
  primary: {
    bg: "bg-primary/5",
    border: "border-primary/20",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    button: "bg-primary hover:bg-primary/90 text-primary-foreground",
  },
  warning: {
    bg: "bg-amber-50 dark:bg-amber-500/10",
    border: "border-amber-200 dark:border-amber-500/20",
    iconBg: "bg-amber-100 dark:bg-amber-500/20",
    iconColor: "text-amber-600 dark:text-amber-500",
    button: "bg-amber-500 hover:bg-amber-600 text-white",
  },
  accent: {
    bg: "bg-accent/5",
    border: "border-accent/20",
    iconBg: "bg-accent/10",
    iconColor: "text-accent",
    button: "bg-accent hover:bg-accent/90 text-accent-foreground",
  },
};

export const KeyInsightsGrid = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Zap className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Key Insights</h3>
          <p className="text-sm text-muted-foreground">Actionable recommendations for your strategy</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight) => {
          const styles = variantStyles[insight.variant];
          const Icon = insight.icon;

          return (
            <Card
              key={insight.title}
              className={`p-5 border ${styles.border} ${styles.bg} hover:shadow-card-hover transition-all duration-200`}
            >
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${styles.iconBg}`}>
                    <Icon className={`w-5 h-5 ${styles.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-foreground">{insight.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
                  </div>
                </div>

                <Button size="sm" className={`w-full gap-2 ${styles.button}`}>
                  {insight.action}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
