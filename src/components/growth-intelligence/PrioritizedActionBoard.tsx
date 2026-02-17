import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Flame, Zap, TrendingUp } from "lucide-react";

interface ActionItem {
  id: string;
  title: string;
  reason: string;
  expectedImpact: string;
  effort: "low" | "medium" | "high";
  priority: number;
  completed: boolean;
}

interface ActionCategory {
  label: string;
  icon: React.ElementType;
  iconColor: string;
  bgColor: string;
  actions: ActionItem[];
}

const effortColors: Record<string, string> = {
  low: "bg-accent/10 text-accent border-accent/20",
  medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
  high: "bg-destructive/10 text-destructive border-destructive/20",
};

export const PrioritizedActionBoard = () => {
  const [categories, setCategories] = useState<ActionCategory[]>([
    {
      label: "Immediate Impact",
      icon: Flame,
      iconColor: "text-destructive",
      bgColor: "bg-destructive/10",
      actions: [
        { id: "i1", title: "Increase posting frequency to 5x/day", reason: "68% frequency gap vs competitors. Each additional post correlates with +12% daily reach.", expectedImpact: "+40% reach", effort: "medium", priority: 95, completed: false },
        { id: "i2", title: "Shorten hooks to under 3 seconds", reason: "78% of viral competitor content uses sub-3s hooks. Your avg is 5.2s.", expectedImpact: "+25% retention", effort: "low", priority: 92, completed: false },
      ],
    },
    {
      label: "Optimization Experiments",
      icon: Zap,
      iconColor: "text-yellow-600",
      bgColor: "bg-yellow-100",
      actions: [
        { id: "o1", title: "Test question-based hooks on TikTok", reason: "Competitor analysis shows 34% higher ER for question hooks vs statements.", expectedImpact: "+18% ER", effort: "low", priority: 78, completed: false },
        { id: "o2", title: "Add CTA to all videos", reason: "Your CTA usage is 52% vs competitor avg of 89%. Videos with CTAs get 28% more shares.", expectedImpact: "+15% shares", effort: "low", priority: 74, completed: false },
      ],
    },
    {
      label: "Strategic Improvements",
      icon: TrendingUp,
      iconColor: "text-primary",
      bgColor: "bg-primary/10",
      actions: [
        { id: "s1", title: "Launch YouTube Shorts strategy", reason: "YouTube has highest growth score (85) but largest perf gap (-61%). Underexploited channel.", expectedImpact: "+35% total reach", effort: "high", priority: 65, completed: false },
        { id: "s2", title: "Adopt Duet/Stitch format on TikTok", reason: "Top performing competitor format with 2.1x avg engagement multiplier.", expectedImpact: "+22% engagement", effort: "medium", priority: 60, completed: false },
      ],
    },
  ]);

  const toggleAction = (catIdx: number, actionId: string) => {
    setCategories(prev =>
      prev.map((cat, i) =>
        i === catIdx
          ? { ...cat, actions: cat.actions.map(a => a.id === actionId ? { ...a, completed: !a.completed } : a) }
          : cat
      )
    );
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Prioritized Growth Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {categories.map((cat, catIdx) => {
          const Icon = cat.icon;
          return (
            <div key={cat.label} className="space-y-3">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-md ${cat.bgColor}`}>
                  <Icon className={`w-4 h-4 ${cat.iconColor}`} />
                </div>
                <h3 className="text-sm font-semibold text-foreground">{cat.label}</h3>
              </div>
              <div className="space-y-2">
                {cat.actions.map((action) => (
                  <div
                    key={action.id}
                    className={`p-3 rounded-lg border transition-all ${
                      action.completed ? "bg-muted/50 opacity-60" : "bg-card hover:bg-muted/30"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={action.completed}
                        onCheckedChange={() => toggleAction(catIdx, action.id)}
                        className="mt-0.5"
                      />
                      <div className="flex-1 space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className={`text-sm font-medium ${action.completed ? "line-through" : ""}`}>
                            {action.title}
                          </h4>
                          <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                            {action.expectedImpact}
                          </Badge>
                          <Badge variant="outline" className={`text-xs ${effortColors[action.effort]}`}>
                            {action.effort} effort
                          </Badge>
                          <span className="text-xs text-muted-foreground ml-auto">Score: {action.priority}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{action.reason}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
