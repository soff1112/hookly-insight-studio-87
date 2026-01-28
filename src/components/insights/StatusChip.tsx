import { Badge } from "@/components/ui/badge";
import { AlertTriangle, AlertCircle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type StatusType = "critical" | "high" | "medium" | "opportunity" | "positive" | "negative" | "neutral";

interface StatusChipProps {
  type: StatusType;
  label?: string;
  value?: string;
  showIcon?: boolean;
  className?: string;
}

const statusStyles: Record<StatusType, { bg: string; text: string; icon: React.ReactNode | null }> = {
  critical: {
    bg: "bg-destructive/10",
    text: "text-destructive",
    icon: <AlertCircle className="w-3 h-3" />
  },
  high: {
    bg: "bg-yellow-500/10",
    text: "text-yellow-600",
    icon: <AlertTriangle className="w-3 h-3" />
  },
  medium: {
    bg: "bg-primary/10",
    text: "text-primary",
    icon: <Sparkles className="w-3 h-3" />
  },
  opportunity: {
    bg: "bg-primary/10",
    text: "text-primary",
    icon: <Sparkles className="w-3 h-3" />
  },
  positive: {
    bg: "bg-accent/10",
    text: "text-accent",
    icon: null
  },
  negative: {
    bg: "bg-destructive/10",
    text: "text-destructive",
    icon: null
  },
  neutral: {
    bg: "bg-muted",
    text: "text-muted-foreground",
    icon: null
  }
};

const defaultLabels: Record<StatusType, string> = {
  critical: "Critical",
  high: "High Priority",
  medium: "Opportunity",
  opportunity: "Opportunity",
  positive: "",
  negative: "",
  neutral: ""
};

export const StatusChip = ({
  type,
  label,
  value,
  showIcon = true,
  className
}: StatusChipProps) => {
  const style = statusStyles[type];
  const displayLabel = label || defaultLabels[type];
  
  // For gap chips with values
  if (value !== undefined) {
    const isPositive = value.startsWith("+");
    const isNegative = value.startsWith("-");
    const chipType = isPositive ? "positive" : isNegative ? "negative" : "neutral";
    const chipStyle = statusStyles[chipType];
    
    return (
      <Badge 
        variant="secondary" 
        className={cn(
          "text-xs px-2 py-0.5 h-5 font-medium",
          chipStyle.bg,
          chipStyle.text,
          className
        )}
      >
        {value} {displayLabel && `${displayLabel}`}
      </Badge>
    );
  }

  return (
    <Badge 
      variant="secondary" 
      className={cn(
        "text-[10px] px-2 py-0.5 h-5 font-medium gap-1",
        style.bg,
        style.text,
        className
      )}
    >
      {showIcon && style.icon}
      {displayLabel}
    </Badge>
  );
};
