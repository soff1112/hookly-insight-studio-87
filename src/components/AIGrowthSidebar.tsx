import { Sparkles, Lightbulb, Calendar, Bell, PenTool, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export const AIGrowthSidebar = () => {
  const { toast } = useToast();

  const handleAction = (action: string, isLocked?: boolean) => {
    if (isLocked) {
      toast({
        title: "Upgrade Required",
        description: "This feature requires a Pro subscription",
      });
      return;
    }
    toast({
      title: action,
      description: "Feature coming soon!",
    });
  };

  const actions = [
    { icon: Sparkles, label: "AI Growth Assistant", usage: null },
    { icon: Lightbulb, label: "Generate Viral Hooks", usage: null },
    { icon: PenTool, label: "Content Ideas", usage: "5/10" },
    { icon: Calendar, label: "Post Scheduler", usage: null },
    { icon: Bell, label: "Competitor Alerts", usage: "2/5" },
    { icon: PenTool, label: "AI Copywriter", usage: null, locked: true },
  ];

  return (
    <Card className="p-4 border-border shadow-card space-y-3">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide px-2">
        AI Tools
      </h3>
      {actions.map((action, idx) => (
        <Button
          key={idx}
          variant="outline"
          className={`w-full justify-start gap-3 h-12 ${
            action.locked
              ? "opacity-60 border-dashed"
              : "bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20 hover:border-primary/40 hover:from-primary/10 hover:to-primary/15"
          }`}
          onClick={() => handleAction(action.label, action.locked)}
        >
          <action.icon className={`h-5 w-5 ${action.locked ? "text-muted-foreground" : "text-primary"}`} />
          <span className="flex-1 text-left font-medium">{action.label}</span>
          {action.usage && (
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
              {action.usage}
            </span>
          )}
          {action.locked && <Lock className="h-4 w-4 text-muted-foreground" />}
        </Button>
      ))}
    </Card>
  );
};
