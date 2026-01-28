import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Database } from "lucide-react";

interface ActionBarProps {
  primaryLabel: string;
  onPrimaryAction: () => void;
  secondaryLabel?: string;
  onSecondaryAction?: () => void;
  expectedImpact?: string;
}

export const ActionBar = ({
  primaryLabel,
  onPrimaryAction,
  secondaryLabel = "View underlying data",
  onSecondaryAction,
  expectedImpact
}: ActionBarProps) => {
  return (
    <div className="pt-3 mt-3 border-t border-border/30 flex items-center justify-between gap-4 flex-wrap">
      <div className="flex items-center gap-3">
        <Button
          variant="default"
          size="sm"
          className="h-8 px-4 text-xs gap-1.5"
          onClick={onPrimaryAction}
        >
          {primaryLabel}
          <ChevronRight className="w-3 h-3" />
        </Button>

        {onSecondaryAction && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-3 text-xs gap-1.5 text-muted-foreground hover:text-foreground"
            onClick={onSecondaryAction}
          >
            <Database className="w-3 h-3" />
            {secondaryLabel}
          </Button>
        )}
      </div>

      {expectedImpact && (
        <Badge variant="secondary" className="text-xs bg-accent/10 text-accent px-2.5 py-0.5">
          Expected: {expectedImpact}
        </Badge>
      )}
    </div>
  );
};
