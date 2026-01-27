import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LucideIcon, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AIInsightCardProps {
  icon: LucideIcon;
  title: string;
  content: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  variant?: "default" | "success" | "warning";
  methodology?: {
    metric: string;
    formula: string;
    interpretation: string;
  };
  impactScore?: {
    value: string;
    label: string;
  };
}

export const AIInsightCard = ({ 
  icon: Icon, 
  title, 
  content, 
  actionLabel, 
  onAction,
  variant = "default",
  methodology,
  impactScore 
}: AIInsightCardProps) => {
  const variantStyles = {
    default: "border-primary/20 bg-primary/5",
    success: "border-accent/20 bg-accent/5",
    warning: "border-yellow-500/20 bg-yellow-500/5"
  };

  return (
    <Card className={`p-5 border-2 ${variantStyles[variant]} hover:shadow-card-hover transition-all duration-300`}>
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-foreground">{title}</h4>
                {methodology && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-3.5 h-3.5 text-muted-foreground hover:text-primary transition-colors" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[280px] p-3 space-y-2">
                        <p className="font-semibold text-foreground">{methodology.metric}</p>
                        <p className="text-xs text-muted-foreground"><strong>Formula:</strong> {methodology.formula}</p>
                        <p className="text-xs text-muted-foreground"><strong>Interpretation:</strong> {methodology.interpretation}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
              {impactScore && (
                <Badge variant="secondary" className="text-xs bg-primary/10 text-primary whitespace-nowrap">
                  {impactScore.label}: {impactScore.value}
                </Badge>
              )}
            </div>
            <div className="text-sm text-muted-foreground space-y-2">
              {content}
            </div>
          </div>
        </div>
        
        {actionLabel && onAction && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onAction}
            className="w-full border-primary/30 hover:bg-primary/10"
          >
            {actionLabel}
          </Button>
        )}
      </div>
    </Card>
  );
};
