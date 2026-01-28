import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SectionHeaderProps {
  level: 1 | 2 | 3 | 4;
  title: string;
  subtitle: string;
  dataScope?: string;
  timeRange?: string;
  sampleSize?: string;
  isCollapsible?: boolean;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  tooltip?: string;
}

const levelLabels = {
  1: "Overview",
  2: "Benchmarking",
  3: "Strategy",
  4: "Deep Dive"
};

const levelColors = {
  1: "bg-primary/10 text-primary",
  2: "bg-blue-500/10 text-blue-500",
  3: "bg-accent/10 text-accent",
  4: "bg-yellow-500/10 text-yellow-600"
};

export const SectionHeader = ({
  level,
  title,
  subtitle,
  dataScope,
  timeRange,
  sampleSize,
  isCollapsible,
  isCollapsed,
  onToggleCollapse,
  tooltip
}: SectionHeaderProps) => {
  return (
    <div className="flex items-start justify-between gap-4 mb-4">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="secondary" className={`text-[10px] px-1.5 py-0 ${levelColors[level]}`}>
            L{level} • {levelLabels[level]}
          </Badge>
          {timeRange && (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
              {timeRange}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {isCollapsible && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={onToggleCollapse}
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>
          )}
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          {tooltip && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-xs">{tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        
        <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
      </div>

      {(dataScope || sampleSize) && (
        <div className="text-right text-xs text-muted-foreground shrink-0">
          {dataScope && <div>{dataScope}</div>}
          {sampleSize && <div className="mt-0.5">{sampleSize}</div>}
        </div>
      )}
    </div>
  );
};
