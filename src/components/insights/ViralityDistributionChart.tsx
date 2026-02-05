import { Card } from "@/components/ui/card";
import { Flame, Lightbulb } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const mockData = [
  { bucket: "0–20%", you: 28, competitors: 12 },
  { bucket: "20–40%", you: 35, competitors: 22 },
  { bucket: "40–60%", you: 25, competitors: 35 },
  { bucket: "60–80%", you: 9, competitors: 21 },
  { bucket: "80%+", you: 3, competitors: 10 },
];

export const ViralityDistributionChart = () => {
  return (
    <Card className="p-6 border-border shadow-card">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-destructive/10">
            <Flame className="w-5 h-5 text-destructive" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Virality Distribution</h3>
            <p className="text-sm text-muted-foreground">Content distribution across virality ranges</p>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={mockData} barCategoryGap={24}>
            <XAxis
              dataKey="bucket"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              formatter={(value: number, name: string) => [
                `${value}%`,
                name === "you" ? "Your Content" : "Competitors",
              ]}
            />
            <Legend
              wrapperStyle={{ paddingTop: "16px" }}
              formatter={(value: string) => (value === "you" ? "Your Content" : "Competitors")}
            />
            <Bar dataKey="you" fill="hsl(252, 76%, 66%)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="competitors" fill="hsl(163, 82%, 36%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>

        <div className="flex items-start gap-3 p-4 rounded-lg bg-destructive/5 border border-destructive/10">
          <Lightbulb className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
          <p className="text-sm text-foreground">
            <span className="font-medium">AI Insight:</span> Only 12% of your content exceeds 60% virality vs competitors' 31%. 
            Focus on replicating high-performing hook patterns to close this gap.
          </p>
        </div>
      </div>
    </Card>
  );
};
