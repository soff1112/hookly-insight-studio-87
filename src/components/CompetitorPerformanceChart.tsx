import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { DashboardCard } from "@/components/DashboardCard";
import { SectionHeader } from "@/components/insights/SectionHeader";
import { ChartCaption } from "@/components/insights/ChartCaption";
import { InsightBlock } from "@/components/insights/InsightBlock";
import { TrendingUp } from "lucide-react";

const mockData = [
  { date: "Oct 09", avgLikes: 12.5, avgViews: 245, followers: 22.8, yourLikes: 8.2, yourViews: 180 },
  { date: "Oct 10", avgLikes: 14.2, avgViews: 268, followers: 23.2, yourLikes: 9.1, yourViews: 195 },
  { date: "Oct 11", avgLikes: 13.8, avgViews: 256, followers: 23.5, yourLikes: 8.8, yourViews: 188 },
  { date: "Oct 12", avgLikes: 15.4, avgViews: 289, followers: 23.9, yourLikes: 10.2, yourViews: 210 },
  { date: "Oct 13", avgLikes: 16.1, avgViews: 302, followers: 24.0, yourLikes: 11.5, yourViews: 225 },
  { date: "Oct 14", avgLikes: 17.8, avgViews: 325, followers: 24.3, yourLikes: 12.1, yourViews: 238 },
  { date: "Oct 15", avgLikes: 18.2, avgViews: 334, followers: 24.6, yourLikes: 12.8, yourViews: 248 },
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
        <SectionHeader
          level={2}
          title="Competitor Performance Overview"
          subtitle="Aggregated metrics from tracked competitors vs. your account"
          timeRange="Last 7 days"
          dataScope="5 competitors"
          sampleSize="127 posts analyzed"
          tooltip="Compares your performance against the aggregated average of your tracked competitors. Metrics are normalized for fair comparison."
        />

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
              label={{ value: 'Followers (K)', angle: -90, position: 'insideLeft', style: { fontSize: 11, fill: 'hsl(var(--muted-foreground))' } }}
              domain={[20, 28]}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              label={{ value: 'Engagement (avg)', angle: 90, position: 'insideRight', style: { fontSize: 11, fill: 'hsl(var(--muted-foreground))' } }}
              domain={[0, 400]}
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
                  avgLikes: 'Competitor Avg Likes',
                  avgViews: 'Competitor Avg Views',
                  followers: 'Competitor Followers',
                  yourLikes: 'Your Avg Likes',
                  yourViews: 'Your Avg Views'
                };
                return [`${value}${name === 'followers' ? 'K' : ''}`, labels[name] || name];
              }}
            />
            <Legend 
              onClick={(e) => toggleLine(e.dataKey as string)}
              wrapperStyle={{ cursor: 'pointer', paddingTop: '10px' }}
              formatter={(value: string) => {
                const labels: Record<string, string> = {
                  avgLikes: '📊 Competitor Avg Likes',
                  avgViews: '👁️ Competitor Avg Views',
                  followers: '📈 Competitor Followers',
                  yourLikes: '🟢 Your Avg Likes',
                  yourViews: '🟢 Your Avg Views'
                };
                return <span className={hiddenLines.includes(value) ? 'opacity-40' : ''}>{labels[value] || value}</span>;
              }}
            />
            {!hiddenLines.includes('avgViews') && (
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="avgViews" 
                stroke="hsl(210 100% 50%)" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: 'hsl(210 100% 50%)', r: 3 }}
                activeDot={{ r: 5 }}
              />
            )}
            {!hiddenLines.includes('yourViews') && (
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="yourViews" 
                stroke="hsl(163 82% 36%)" 
                strokeWidth={2}
                dot={{ fill: 'hsl(163 82% 36%)', r: 4 }}
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
                strokeDasharray="5 5"
                dot={{ fill: 'hsl(45 93% 47%)', r: 3 }}
                activeDot={{ r: 5 }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>

        <ChartCaption
          caption="Your views are trending upward (+37.8% over period) but remain 25.8% below competitor average. The gap is narrowing, indicating positive momentum."
          dataSource="Aggregated from TikTok, Instagram, YouTube APIs"
          methodology="7-day rolling average, normalized by follower count"
          onShowData={() => console.log("Show raw data")}
        />

        <InsightBlock
          type="insight"
          content="You're 3 spots from top rank—boost views by 15% via competitor-style hooks. Your growth is +2.8% vs top competitor's +5.2%, a 2.4 percentage point gap."
          impact="+12-15% views"
          dataReference="Competitor ranking by avg views"
          sampleSize="127 videos from 5 accounts"
          timeWindow="Last 7 days"
          actionLabel="View competitor hooks"
          onAction={() => console.log("View hooks")}
          onShowData={() => console.log("Show data")}
        />
      </div>
    </DashboardCard>
  );
};
