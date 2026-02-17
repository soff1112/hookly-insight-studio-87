import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, AlertTriangle } from "lucide-react";

interface PlatformData {
  platform: string;
  perfGap: number;
  erGap: number;
  bestFormat: string;
  growthScore: number;
  highlight?: "underperform" | "opportunity";
}

const platforms: PlatformData[] = [
  { platform: "TikTok", perfGap: -52, erGap: -3.1, bestFormat: "Duet/Stitch", growthScore: 78, highlight: "opportunity" },
  { platform: "Instagram", perfGap: -38, erGap: -1.8, bestFormat: "Reels (< 30s)", growthScore: 62 },
  { platform: "YouTube", perfGap: -61, erGap: -4.2, bestFormat: "Shorts", growthScore: 85, highlight: "underperform" },
];

export const PlatformIntelligence = () => {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Platform Intelligence</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {platforms.map((p) => (
            <div
              key={p.platform}
              className={`p-4 rounded-lg border space-y-3 ${
                p.highlight === "underperform"
                  ? "border-destructive/30 bg-destructive/5"
                  : p.highlight === "opportunity"
                  ? "border-accent/30 bg-accent/5"
                  : "bg-muted/20"
              }`}
            >
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-foreground">{p.platform}</h4>
                {p.highlight === "underperform" && (
                  <Badge variant="outline" className="text-xs bg-destructive/10 text-destructive border-destructive/20 gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Underperforms
                  </Badge>
                )}
                {p.highlight === "opportunity" && (
                  <Badge variant="outline" className="text-xs bg-accent/10 text-accent border-accent/20 gap-1">
                    <TrendingUp className="w-3 h-3" />
                    Top Opportunity
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Perf. Gap</p>
                  <p className="font-semibold text-destructive">{p.perfGap}%</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">ER Gap</p>
                  <p className="font-semibold text-destructive">{p.erGap}%</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Best Format</p>
                  <p className="font-semibold text-foreground">{p.bestFormat}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Growth Score</p>
                  <div className="flex items-center gap-1.5">
                    <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${p.growthScore}%` }} />
                    </div>
                    <span className="text-xs font-bold text-foreground">{p.growthScore}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
