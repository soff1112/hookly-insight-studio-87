import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface InsightBlockProps {
  icon: LucideIcon;
  title: string;
  insight: string;
  explanation: string;
  action: string;
  impact: string;
  priority: "high" | "medium" | "low";
  visual?: ReactNode;
  ctaLabel?: string;
  onCta?: () => void;
  bullets?: string[];
  accentColor?: "purple" | "amber" | "teal" | "blue" | "rose";
}

const accentStyles = {
  purple: {
    bg: "bg-[hsl(252,76%,66%,0.05)]",
    border: "border-[hsl(252,76%,66%,0.15)]",
    iconBg: "bg-[hsl(252,76%,66%,0.1)]",
    iconColor: "text-primary",
  },
  amber: {
    bg: "bg-[hsl(38,92%,60%,0.05)]",
    border: "border-[hsl(38,92%,60%,0.15)]",
    iconBg: "bg-[hsl(38,92%,60%,0.1)]",
    iconColor: "text-[hsl(38,92%,45%)]",
  },
  teal: {
    bg: "bg-[hsl(163,82%,36%,0.05)]",
    border: "border-[hsl(163,82%,36%,0.15)]",
    iconBg: "bg-[hsl(163,82%,36%,0.1)]",
    iconColor: "text-accent",
  },
  blue: {
    bg: "bg-[hsl(217,91%,60%,0.05)]",
    border: "border-[hsl(217,91%,60%,0.15)]",
    iconBg: "bg-[hsl(217,91%,60%,0.1)]",
    iconColor: "text-[hsl(217,91%,50%)]",
  },
  rose: {
    bg: "bg-[hsl(340,75%,55%,0.05)]",
    border: "border-[hsl(340,75%,55%,0.15)]",
    iconBg: "bg-[hsl(340,75%,55%,0.1)]",
    iconColor: "text-[hsl(340,75%,50%)]",
  },
};

const priorityStyles = {
  high: "bg-[hsl(0,84%,60%,0.1)] text-[hsl(0,84%,45%)] border-[hsl(0,84%,60%,0.2)]",
  medium: "bg-[hsl(45,93%,55%,0.1)] text-[hsl(45,93%,35%)] border-[hsl(45,93%,55%,0.2)]",
  low: "bg-muted text-muted-foreground border-border",
};

export const InsightBlock = ({
  icon: Icon,
  title,
  insight,
  explanation,
  action,
  impact,
  priority,
  visual,
  ctaLabel,
  onCta,
  bullets,
  accentColor = "purple",
}: InsightBlockProps) => {
  const styles = accentStyles[accentColor];

  return (
    <Card className={`p-6 border ${styles.border} ${styles.bg} transition-all duration-200 hover:shadow-[var(--shadow-card-hover)]`}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${styles.iconBg}`}>
              <Icon className={`w-5 h-5 ${styles.iconColor}`} />
            </div>
            <h3 className="text-base font-semibold text-foreground">{title}</h3>
          </div>
          <Badge variant="outline" className={`text-xs font-medium ${priorityStyles[priority]}`}>
            {priority === "high" ? "High" : priority === "medium" ? "Medium" : "Low"} Impact
          </Badge>
        </div>

        {/* Insight */}
        <p className="text-sm font-medium text-foreground">{insight}</p>

        {/* Explanation */}
        <p className="text-sm text-muted-foreground leading-relaxed">{explanation}</p>

        {/* Bullets */}
        {bullets && bullets.length > 0 && (
          <ul className="space-y-1.5 pl-1">
            {bullets.map((b, i) => (
              <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/50 shrink-0" />
                {b}
              </li>
            ))}
          </ul>
        )}

        {/* Visual */}
        {visual && <div>{visual}</div>}

        {/* Action */}
        <div className="pt-1 border-t border-border/50">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Recommended Action</p>
              <p className="text-sm text-foreground">{action}</p>
            </div>
          </div>
        </div>

        {/* Impact */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">Expected Impact:</span>
          <span className="text-xs font-semibold text-foreground">{impact}</span>
        </div>

        {/* CTA */}
        {ctaLabel && onCta && (
          <Button
            variant="outline"
            size="sm"
            onClick={onCta}
            className="w-full gap-2 border-primary/30 hover:bg-primary/10 text-primary"
          >
            {ctaLabel}
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </Card>
  );
};
