import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
  // Build data scope string
  const scopeParts: string[] = [];
  if (timeRange) scopeParts.push(timeRange);
  if (dataScope) scopeParts.push(dataScope);
  if (sampleSize) scopeParts.push(sampleSize);
  const scopeString = scopeParts.join(" • ");

  return (
    <div className="flex items-start justify-between gap-4 mb-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {isCollapsible && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0 shrink-0" 
              onClick={onToggleCollapse}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          )}
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          {tooltip && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-4 h-4 text-muted-foreground cursor-help shrink-0" />
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

      {scopeString && (
        <Badge 
          variant="secondary" 
          className="text-[10px] px-2 py-0.5 bg-muted/50 text-muted-foreground shrink-0 font-normal"
        >
          {scopeString}
        </Badge>
      )}
    </div>
  );
};