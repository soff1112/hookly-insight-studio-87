import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PieChart as PieChartIcon, BarChart2 } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const data = [
  { name: "You", value: 4.2, color: "hsl(163, 82%, 36%)" },
  { name: "Competitors Avg", value: 6.8, color: "hsl(252, 76%, 66%)" },
];

export const EngagementGapAnalysis = () => {
  return (
    <Card className="p-6 border-border">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <PieChartIcon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Engagement Gap Analysis</h3>
            <p className="text-sm text-muted-foreground">Your ER vs competitor average</p>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                formatter={(value: number) => [`${value}%`, "ER"]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="text-center space-y-2">
          <p className="text-2xl font-bold text-foreground">
            Your ER: <span className="text-emerald-600">4.2%</span> vs Avg: <span className="text-primary">6.8%</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Post more on TikTok (competitors avg 12.1% ER for 33% higher engagement).
          </p>
        </div>

        <Button variant="outline" className="w-full gap-2">
          <BarChart2 className="w-4 h-4" />
          View Platform Breakdown
        </Button>
      </div>
    </Card>
  );
};
