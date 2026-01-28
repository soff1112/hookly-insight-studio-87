import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Database } from "lucide-react";

interface ChartCaptionProps {
  caption: string;
  dataSource?: string;
  methodology?: string;
  confidence?: string;
  onShowData?: () => void;
}

export const ChartCaption = ({
  caption,
  dataSource,
  methodology,
  confidence,
  onShowData
}: ChartCaptionProps) => {
  return (
    <div className="mt-4 pt-4 border-t border-border/50">
      {/* Interpretation Row */}
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          <span className="font-semibold text-foreground text-xs uppercase tracking-wide">Interpretation: </span>
          {caption}
        </p>
        {confidence && (
          <Badge 
            variant="secondary" 
            className="text-[10px] px-2 py-0.5 bg-muted/50 text-muted-foreground shrink-0"
          >
            {confidence}
          </Badge>
        )}
      </div>
      
      {/* Source & Action Row */}
      {(dataSource || methodology || onShowData) && (
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/30">
          <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
            {dataSource && (
              <span>
                <span className="font-medium uppercase tracking-wide">Source:</span> {dataSource}
              </span>
            )}
            {methodology && (
              <span>
                <span className="font-medium uppercase tracking-wide">Method:</span> {methodology}
              </span>
            )}
          </div>
          
          {onShowData && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2.5 text-[11px] gap-1.5 text-muted-foreground hover:text-foreground"
              onClick={onShowData}
            >
              <Database className="w-3 h-3" />
              View underlying data
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
