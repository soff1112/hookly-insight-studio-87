import { Badge } from "@/components/ui/badge";

interface InterpretationRowProps {
  interpretation: string;
  confidence?: string;
}

export const InterpretationRow = ({
  interpretation,
  confidence
}: InterpretationRowProps) => {
  return (
    <div className="pt-4 mt-4 border-t border-border/50">
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          <span className="font-semibold text-foreground text-xs uppercase tracking-wide">Interpretation: </span>
          {interpretation}
        </p>
        {confidence && (
          <Badge variant="secondary" className="text-[10px] px-2 py-0.5 bg-muted/50 text-muted-foreground shrink-0">
            {confidence}
          </Badge>
        )}
      </div>
    </div>
  );
};
