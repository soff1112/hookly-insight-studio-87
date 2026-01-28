import * as React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface ModuleCardProps {
  title: string;
  subtitle: string;
  dataScope?: string;
  tooltip?: string;
  children: React.ReactNode;
  className?: string;
}

export const ModuleCard = ({
  title,
  subtitle,
  dataScope,
  tooltip,
  children,
  className
}: ModuleCardProps) => {
  return (
    <Card className={cn("p-6 space-y-4", className)}>
      {/* Module Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
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

        {dataScope && (
          <Badge variant="secondary" className="text-[10px] px-2 py-0.5 bg-muted/50 text-muted-foreground shrink-0">
            {dataScope}
          </Badge>
        )}
      </div>

      {/* Module Content */}
      {children}
    </Card>
  );
};
