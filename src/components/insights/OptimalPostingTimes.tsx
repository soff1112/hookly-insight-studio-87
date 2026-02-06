import { Card } from "@/components/ui/card";
import { Clock, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const OptimalPostingTimes = () => {
  return (
    <Card className="p-6 border-border">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Clock className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Optimal Posting Times</h3>
            <p className="text-sm text-muted-foreground">Based on competitor performance analysis</p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          Competitors with highest ER post during <span className="font-medium text-foreground">18:00-21:00 (UTC+1)</span>.
          Your current schedule peaks at <span className="font-medium text-foreground">14:00 (UTC+1)</span>.
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900">
            <div className="text-center">
              <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400">18:00-21:00</p>
              <p className="text-xs text-emerald-600 dark:text-emerald-500">(UTC+1)</p>
              <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400 mt-1">Best ER Window</p>
            </div>
          </div>
          <div className="p-4 rounded-lg bg-muted border border-border">
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">14:00</p>
              <p className="text-xs text-muted-foreground">(UTC+1)</p>
              <p className="text-sm font-medium text-muted-foreground mt-1">Your Peak</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-600" />
          <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800">
            +18% Potential ER Increase
          </Badge>
        </div>
      </div>
    </Card>
  );
};
