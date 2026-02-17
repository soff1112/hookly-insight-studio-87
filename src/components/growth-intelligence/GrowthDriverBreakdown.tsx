import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface GrowthDriver {
  factor: string;
  yours: string;
  competitorAvg: string;
  gapPercent: number;
  impact: "high" | "medium" | "low";
  growthImpact: number;
}

const drivers: GrowthDriver[] = [
  { factor: "Posting Frequency", yours: "2.3/day", competitorAvg: "7.1/day", gapPercent: -68, impact: "high", growthImpact: 25 },
  { factor: "Hook Strength", yours: "5.2s avg", competitorAvg: "2.8s avg", gapPercent: -46, impact: "high", growthImpact: 18 },
  { factor: "Engagement Rate", yours: "4.2%", competitorAvg: "6.8%", gapPercent: -38, impact: "medium", growthImpact: 12 },
  { factor: "Format Efficiency", yours: "62%", competitorAvg: "78%", gapPercent: -21, impact: "low", growthImpact: 5 },
];

const impactColors: Record<string, string> = {
  high: "bg-destructive/10 text-destructive border-destructive/20",
  medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
  low: "bg-accent/10 text-accent border-accent/20",
};

export const GrowthDriverBreakdown = () => {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Growth Driver Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-muted-foreground">
                <th className="text-left py-2 font-medium">Factor</th>
                <th className="text-right py-2 font-medium">Yours</th>
                <th className="text-right py-2 font-medium">Competitor Avg</th>
                <th className="text-right py-2 font-medium">Gap</th>
                <th className="text-center py-2 font-medium">Impact</th>
                <th className="text-right py-2 font-medium">Growth Impact</th>
              </tr>
            </thead>
            <tbody>
              {drivers.map((d) => (
                <tr key={d.factor} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="py-3 font-medium text-foreground">{d.factor}</td>
                  <td className="py-3 text-right text-foreground">{d.yours}</td>
                  <td className="py-3 text-right text-muted-foreground">{d.competitorAvg}</td>
                  <td className="py-3 text-right">
                    <span className="text-destructive font-semibold">{d.gapPercent}%</span>
                  </td>
                  <td className="py-3 text-center">
                    <Badge variant="outline" className={`text-xs ${impactColors[d.impact]}`}>
                      {d.impact}
                    </Badge>
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${(d.growthImpact / 30) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-foreground">+{d.growthImpact}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
