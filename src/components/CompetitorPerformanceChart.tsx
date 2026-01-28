import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { DashboardCard } from "@/components/DashboardCard";
import { TrendingUp } from "lucide-react";

const mockData = [
  { date: "Oct 09", avgLikes: 12.5, avgViews: 245, followers: 22.8 },
  { date: "Oct 10", avgLikes: 14.2, avgViews: 268, followers: 23.2 },
  { date: "Oct 11", avgLikes: 13.8, avgViews: 256, followers: 23.5 },
  { date: "Oct 12", avgLikes: 15.4, avgViews: 289, followers: 23.9 },
  { date: "Oct 13", avgLikes: 16.1, avgViews: 302, followers: 24.0 },
  { date: "Oct 14", avgLikes: 17.8, avgViews: 325, followers: 24.3 },
  { date: "Oct 15", avgLikes: 18.2, avgViews: 334, followers: 24.6 },
];

export const CompetitorPerformanceChart = () => {
  const [hiddenLines, setHiddenLines] = useState<string[]>([]);

  const toggleLine = (dataKey: string) => {
    setHiddenLines(prev => 
      prev.includes(dataKey) 
        ? prev.filter(k => k !== dataKey)
        : [...prev, dataKey]
    );
  };

  return (
    <DashboardCard>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Competitor Performance Overview</h3>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          Aggregated metrics from 5-10 tracked competitors + your account
        </p>

        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={mockData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="date" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              yAxisId="left"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              label={{ value: 'Followers (K)', angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: 'hsl(var(--muted-foreground))' } }}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              label={{ value: 'Engagement', angle: 90, position: 'insideRight', style: { fontSize: 12, fill: 'hsl(var(--muted-foreground))' } }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px'
              }}
              formatter={(value: number, name: string) => {
                const labels: Record<string, string> = {
                  avgLikes: 'Avg Likes',
                  avgViews: 'Avg Views',
                  followers: 'Total Followers'
                };
                return [`${value}${name === 'followers' ? 'K' : ''}`, labels[name] || name];
              }}
            />
            <Legend 
              onClick={(e) => toggleLine(e.dataKey as string)}
              wrapperStyle={{ cursor: 'pointer', paddingTop: '10px' }}
              formatter={(value: string) => {
                const labels: Record<string, string> = {
                  avgLikes: '📊 Avg Likes per Post',
                  avgViews: '👁️ Avg Views per Post',
                  followers: '📈 Total Followers Growth'
                };
                return <span className={hiddenLines.includes(value) ? 'opacity-40' : ''}>{labels[value] || value}</span>;
              }}
            />
            {!hiddenLines.includes('avgLikes') && (
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="avgLikes" 
                stroke="hsl(163 82% 36%)" 
                strokeWidth={2}
                dot={{ fill: 'hsl(163 82% 36%)', r: 4 }}
                activeDot={{ r: 6 }}
              />
            )}
            {!hiddenLines.includes('avgViews') && (
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="avgViews" 
                stroke="hsl(210 100% 50%)" 
                strokeWidth={2}
                dot={{ fill: 'hsl(210 100% 50%)', r: 4 }}
                activeDot={{ r: 6 }}
              />
            )}
            {!hiddenLines.includes('followers') && (
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="followers" 
                stroke="hsl(45 93% 47%)" 
                strokeWidth={2}
                dot={{ fill: 'hsl(45 93% 47%)', r: 4 }}
                activeDot={{ r: 6 }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>

        <div className="bg-primary/5 border-l-4 border-primary rounded-r-lg p-4">
          <p className="text-sm text-foreground">
            <span className="mr-2">💡</span>
            <strong>Insight:</strong> You're 3 spots from top—boost views by 15% via competitor-style hooks. Your growth is +2.8% vs top competitor's +5.2%.
          </p>
        </div>
      </div>
    </DashboardCard>
  );
};
