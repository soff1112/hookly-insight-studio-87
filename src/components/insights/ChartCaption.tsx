import { Button } from "@/components/ui/button";
import { Database, ExternalLink } from "lucide-react";

interface ChartCaptionProps {
  caption: string;
  dataSource?: string;
  methodology?: string;
  onShowData?: () => void;
}

export const ChartCaption = ({
  caption,
  dataSource,
  methodology,
  onShowData
}: ChartCaptionProps) => {
  return (
    <div className="mt-4 pt-3 border-t border-border/50">
      <p className="text-xs text-muted-foreground leading-relaxed">
        <span className="font-medium text-foreground">Interpretation: </span>
        {caption}
      </p>
      
      {(dataSource || methodology || onShowData) && (
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/30">
          <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
            {dataSource && (
              <span>
                <span className="font-medium">Source:</span> {dataSource}
              </span>
            )}
            {methodology && (
              <span>
                <span className="font-medium">Method:</span> {methodology}
              </span>
            )}
          </div>
          
          {onShowData && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-[10px] gap-1"
              onClick={onShowData}
            >
              <Database className="w-3 h-3" />
              Show underlying data
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
