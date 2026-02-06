import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Rocket, Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const TopCompetitorAlert = () => {
  return (
    <Card className="p-6 border-border bg-primary/5">
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Rocket className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground">Top Competitor Alert</h3>
            <p className="text-sm text-muted-foreground mt-1">
              <span className="font-medium text-foreground">@topcompetitor</span> gained 5.2% followers via short hooks (under 15s). 
              Your avg duration: 28s—shorter for +12% views.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Top 3 hook patterns:</span>
          <Badge variant="secondary">Question</Badge>
          <Badge variant="secondary">Shock</Badge>
          <Badge variant="secondary">Emotional</Badge>
        </div>

        <Button className="gap-2">
          <Video className="w-4 h-4" />
          Regenerate Hooks
        </Button>
      </div>
    </Card>
  );
};
