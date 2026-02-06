import { Card } from "@/components/ui/card";
import { Zap, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const QuickWinCard = () => {
  return (
    <Card className="p-6 border-border bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/40">
            <Zap className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Quick Win: Content Frequency</h3>
          </div>
        </div>

        <p className="text-sm text-foreground">
          You post <span className="font-bold">2.3/day</span> vs top performers' <span className="font-bold">8-10/day</span> 
          <Badge variant="destructive" className="ml-2 text-xs">77% gap</Badge>
        </p>

        <p className="text-sm text-muted-foreground">
          Test increasing to 5/day for 30 days.
        </p>

        <div className="flex items-center gap-2 p-3 rounded-lg bg-white/60 dark:bg-black/20 border border-amber-200 dark:border-amber-800">
          <TrendingUp className="w-5 h-5 text-emerald-600" />
          <div>
            <p className="text-sm font-medium text-foreground">Expected impact</p>
            <p className="text-lg font-bold text-emerald-600">+25-40% reach</p>
            <p className="text-xs text-muted-foreground">in first month</p>
          </div>
        </div>
      </div>
    </Card>
  );
};
