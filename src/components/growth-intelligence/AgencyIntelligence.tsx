import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Users, BarChart3, Lightbulb } from "lucide-react";

interface Creator {
  name: string;
  handle: string;
  avgViews: string;
  er: number;
  frequency: string;
  growthTrend: number;
  score: number;
  risk: "low" | "medium" | "high";
  tag: "overperformer" | "underperformer" | "average";
}

const creators: Creator[] = [
  { name: "Creator A", handle: "@creator_a", avgViews: "45.2K", er: 8.4, frequency: "3.2/day", growthTrend: 12, score: 87, risk: "low", tag: "overperformer" },
  { name: "Creator B", handle: "@creator_b", avgViews: "28.1K", er: 5.1, frequency: "2.1/day", growthTrend: -3, score: 62, risk: "medium", tag: "average" },
  { name: "Creator C", handle: "@creator_c", avgViews: "8.7K", er: 2.9, frequency: "0.8/day", growthTrend: -18, score: 31, risk: "high", tag: "underperformer" },
  { name: "Creator D", handle: "@creator_d", avgViews: "52.8K", er: 9.2, frequency: "4.5/day", growthTrend: 22, score: 94, risk: "low", tag: "overperformer" },
];

interface ProjectSummary {
  name: string;
  growth: number;
  er: number;
  dominantPlatform: string;
}

const projects: ProjectSummary[] = [
  { name: "Yoga Studio", growth: 18, er: 5.4, dominantPlatform: "Instagram" },
  { name: "Crypto Blog", growth: -5, er: 3.1, dominantPlatform: "TikTok" },
  { name: "Beauty Brand", growth: 32, er: 7.2, dominantPlatform: "TikTok" },
  { name: "Fitness Coach", growth: 8, er: 4.8, dominantPlatform: "YouTube" },
];

const riskColors: Record<string, string> = {
  low: "bg-accent/10 text-accent border-accent/20",
  medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
  high: "bg-destructive/10 text-destructive border-destructive/20",
};

const tagColors: Record<string, string> = {
  overperformer: "bg-accent/10 text-accent border-accent/20",
  average: "bg-muted text-muted-foreground",
  underperformer: "bg-destructive/10 text-destructive border-destructive/20",
};

export const AgencyIntelligence = () => {
  return (
    <div className="space-y-6">
      {/* Creator Performance Ranking */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">Creator Performance Ranking</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-muted-foreground">
                  <th className="text-left py-2 font-medium">Creator</th>
                  <th className="text-right py-2 font-medium">Avg Views</th>
                  <th className="text-right py-2 font-medium">ER</th>
                  <th className="text-right py-2 font-medium">Frequency</th>
                  <th className="text-right py-2 font-medium">Growth</th>
                  <th className="text-center py-2 font-medium">Score</th>
                  <th className="text-center py-2 font-medium">Risk</th>
                  <th className="text-center py-2 font-medium">Tag</th>
                </tr>
              </thead>
              <tbody>
                {creators.sort((a, b) => b.score - a.score).map((c) => (
                  <tr key={c.handle} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="py-3">
                      <div>
                        <p className="font-medium text-foreground">{c.name}</p>
                        <p className="text-xs text-muted-foreground">{c.handle}</p>
                      </div>
                    </td>
                    <td className="py-3 text-right text-foreground">{c.avgViews}</td>
                    <td className="py-3 text-right text-foreground">{c.er}%</td>
                    <td className="py-3 text-right text-foreground">{c.frequency}</td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {c.growthTrend > 0 ? (
                          <TrendingUp className="w-3 h-3 text-accent" />
                        ) : (
                          <TrendingDown className="w-3 h-3 text-destructive" />
                        )}
                        <span className={`font-semibold ${c.growthTrend > 0 ? "text-accent" : "text-destructive"}`}>
                          {c.growthTrend > 0 ? "+" : ""}{c.growthTrend}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 text-center">
                      <div className="inline-flex items-center gap-1.5">
                        <div className="w-10 h-2 rounded-full bg-muted overflow-hidden">
                          <div className="h-full rounded-full bg-primary" style={{ width: `${c.score}%` }} />
                        </div>
                        <span className="text-xs font-bold">{c.score}</span>
                      </div>
                    </td>
                    <td className="py-3 text-center">
                      <Badge variant="outline" className={`text-xs ${riskColors[c.risk]}`}>{c.risk}</Badge>
                    </td>
                    <td className="py-3 text-center">
                      <Badge variant="outline" className={`text-xs ${tagColors[c.tag]}`}>{c.tag}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Multi-Project Summary */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">Multi-Project Summary</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {projects.map((p) => {
              const fastest = projects.reduce((a, b) => a.growth > b.growth ? a : b);
              const weakest = projects.reduce((a, b) => a.growth < b.growth ? a : b);
              const isFastest = p.name === fastest.name;
              const isWeakest = p.name === weakest.name;
              return (
                <div
                  key={p.name}
                  className={`p-3 rounded-lg border space-y-2 ${
                    isFastest ? "border-accent/30 bg-accent/5" : isWeakest ? "border-destructive/30 bg-destructive/5" : "bg-muted/20"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-foreground">{p.name}</h4>
                    {isFastest && <Badge variant="outline" className="text-xs bg-accent/10 text-accent border-accent/20">Fastest</Badge>}
                    {isWeakest && <Badge variant="outline" className="text-xs bg-destructive/10 text-destructive border-destructive/20">Weakest</Badge>}
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    <div>
                      <p className="text-muted-foreground">Growth</p>
                      <p className={`font-semibold ${p.growth > 0 ? "text-accent" : "text-destructive"}`}>
                        {p.growth > 0 ? "+" : ""}{p.growth}%
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">ER</p>
                      <p className="font-semibold text-foreground">{p.er}%</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-muted-foreground">Dominant Platform</p>
                      <p className="font-semibold text-foreground">{p.dominantPlatform}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Strategic Creator Insights */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">Strategic Creator Insights</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { q: "Scale immediately", a: "Creator D (@creator_d) — Score 94, +22% growth trend, highest ER at 9.2%. Allocate more budget here.", color: "border-accent/30 bg-accent/5" },
              { q: "Needs format change", a: "Creator B (@creator_b) — Declining ER despite moderate frequency. Test short-form Reels and question hooks.", color: "border-yellow-300 bg-yellow-50" },
              { q: "Consider replacing", a: "Creator C (@creator_c) — Score 31, -18% growth, 2.9% ER. Consistently underperforms niche average by 54%.", color: "border-destructive/30 bg-destructive/5" },
              { q: "Best platform fit", a: "Creator A → Instagram (visual content strength). Creator D → TikTok (high frequency + hook mastery).", color: "border-primary/20 bg-primary/5" },
            ].map((item) => (
              <div key={item.q} className={`p-4 rounded-lg border ${item.color}`}>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">{item.q}</p>
                <p className="text-sm text-foreground">{item.a}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
