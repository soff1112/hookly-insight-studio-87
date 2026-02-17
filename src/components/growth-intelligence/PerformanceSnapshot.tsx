import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, AlertCircle } from "lucide-react";

interface MetricGap {
  label: string;
  yours: string;
  competitor: string;
  gap: string;
  gapPercent: number;
}

const metrics: MetricGap[] = [
  { label: "Avg Views/Post", yours: "12.4K", competitor: "21.3K", gap: "-8.9K", gapPercent: -42 },
  { label: "Engagement Rate", yours: "4.2%", competitor: "6.8%", gap: "-2.6%", gapPercent: -38 },
  { label: "Posting Frequency", yours: "2.3/day", competitor: "7.1/day", gap: "-4.8/day", gapPercent: -68 },
  { label: "Avg Hook Length", yours: "5.2s", competitor: "2.8s", gap: "+2.4s", gapPercent: 86 },
];

const getStatusConfig = (score: number) => {
  if (score >= 70) return { label: "Strong", color: "bg-accent/10 text-accent border-accent/20", icon: CheckCircle };
  if (score >= 40) return { label: "Moderate", color: "bg-yellow-100 text-yellow-700 border-yellow-200", icon: AlertCircle };
  return { label: "Critical", color: "bg-destructive/10 text-destructive border-destructive/20", icon: AlertTriangle };
};

export const PerformanceSnapshot = () => {
  const overallScore = 32;
  const status = getStatusConfig(overallScore);
  const StatusIcon = status.icon;

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Performance Snapshot</CardTitle>
          <Badge variant="outline" className={`gap-1.5 ${status.color}`}>
            <StatusIcon className="w-3.5 h-3.5" />
            {status.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Executive Summary */}
        <p className="text-sm text-muted-foreground leading-relaxed">
          Your account trails the top competitor by 42% in reach. The primary gaps are posting frequency (-68%) and hook optimization (+86% longer). 
          Estimated reach growth opportunity: <span className="font-semibold text-accent">+55%</span> if top 3 gaps are addressed.
        </p>

        {/* Metric Gaps Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {metrics.map((m) => (
            <div key={m.label} className="p-3 rounded-lg border bg-muted/30 space-y-1.5">
              <p className="text-xs text-muted-foreground font-medium">{m.label}</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-bold text-foreground">{m.yours}</span>
                <span className="text-xs text-muted-foreground">vs {m.competitor}</span>
              </div>
              <div className="flex items-center gap-1">
                {m.gapPercent < 0 ? (
                  <TrendingDown className="w-3 h-3 text-destructive" />
                ) : (
                  <TrendingUp className="w-3 h-3 text-destructive" />
                )}
                <span className={`text-xs font-semibold ${m.label === "Avg Hook Length" ? "text-destructive" : m.gapPercent < 0 ? "text-destructive" : "text-accent"}`}>
                  {m.gap} ({Math.abs(m.gapPercent)}%)
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Growth Opportunity */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/5 border border-accent/20">
          <TrendingUp className="w-5 h-5 text-accent" />
          <div>
            <p className="text-sm font-semibold text-foreground">Estimated Reach Growth Opportunity</p>
            <p className="text-xs text-muted-foreground">Addressing top 3 gaps could increase reach by ~55%</p>
          </div>
          <span className="ml-auto text-2xl font-bold text-accent">+55%</span>
        </div>
      </CardContent>
    </Card>
  );
};
