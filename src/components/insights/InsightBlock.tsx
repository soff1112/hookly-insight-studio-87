import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Lightbulb, 
  ChevronRight, 
  Database,
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

interface InsightBlockProps {
  type: "insight" | "recommendation" | "alert" | "success";
  title?: string;
  content: string;
  impact?: string;
  dataReference?: string;
  sampleSize?: string;
  timeWindow?: string;
  actionLabel?: string;
  onAction?: () => void;
  onShowData?: () => void;
}

const typeStyles = {
  insight: {
    bg: "bg-primary/5",
    border: "border-l-4 border-primary",
    icon: <Lightbulb className="w-4 h-4 text-primary" />,
    label: "AI Insight"
  },
  recommendation: {
    bg: "bg-accent/5",
    border: "border-l-4 border-accent",
    icon: <TrendingUp className="w-4 h-4 text-accent" />,
    label: "Recommendation"
  },
  alert: {
    bg: "bg-yellow-500/5",
    border: "border-l-4 border-yellow-500",
    icon: <AlertTriangle className="w-4 h-4 text-yellow-600" />,
    label: "Alert"
  },
  success: {
    bg: "bg-accent/5",
    border: "border-l-4 border-accent",
    icon: <CheckCircle className="w-4 h-4 text-accent" />,
    label: "Positive Signal"
  }
};

export const InsightBlock = ({
  type,
  title,
  content,
  impact,
  dataReference,
  sampleSize,
  timeWindow,
  actionLabel,
  onAction,
  onShowData
}: InsightBlockProps) => {
  const style = typeStyles[type];

  return (
    <div className={`${style.bg} ${style.border} rounded-r-lg p-4`}>
      <div className="flex items-start gap-3">
        <div className="shrink-0 mt-0.5">{style.icon}</div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-background/50">
              {style.label}
            </Badge>
            {timeWindow && (
              <span className="text-[10px] text-muted-foreground">{timeWindow}</span>
            )}
          </div>

          {title && (
            <p className="text-sm font-medium text-foreground mb-1">{title}</p>
          )}
          
          <p className="text-sm text-muted-foreground leading-relaxed">{content}</p>

          {/* Data References */}
          {(dataReference || sampleSize) && (
            <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground">
              {dataReference && <span>📊 {dataReference}</span>}
              {sampleSize && <span>📈 {sampleSize}</span>}
            </div>
          )}

          {/* Actions Row */}
          {(impact || actionLabel || onShowData) && (
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/30">
              {impact && (
                <Badge variant="secondary" className="bg-accent/10 text-accent text-xs">
                  Expected: {impact}
                </Badge>
              )}
              
              <div className="flex items-center gap-2 ml-auto">
                {onShowData && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs gap-1"
                    onClick={onShowData}
                  >
                    <Database className="w-3 h-3" />
                    View data
                  </Button>
                )}
                {actionLabel && onAction && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-3 text-xs gap-1"
                    onClick={onAction}
                  >
                    {actionLabel}
                    <ChevronRight className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
