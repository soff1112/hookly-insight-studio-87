import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { DashboardCard } from "@/components/DashboardCard";
import { SectionHeader } from "@/components/insights/SectionHeader";
import { ChartCaption } from "@/components/insights/ChartCaption";
import { ActionBar } from "@/components/insights/ActionBar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const mockData = [
  { 
    name: "TikTok", 
    user: 8.1, 
    topcompetitor: 12.1, 
    viralcreator: 10.5, 
    contentking: 9.8,
    views: 45000,
    competitorAvg: 10.8
  },
  { 
    name: "YouTube", 
    user: 3.5, 
    topcompetitor: 8.2, 
    viralcreator: 6.9, 
    contentking: 7.4,
    views: 89000,
    competitorAvg: 7.5
  },
  { 
    name: "Instagram", 
    user: 4.2, 
    topcompetitor: 6.8, 
    viralcreator: 7.2, 
    contentking: 5.9,
    views: 12000,
    competitorAvg: 6.6
  },
];

const platformColors: Record<string, string> = {
  TikTok: "hsl(240 10% 10%)",
  YouTube: "hsl(0 84% 60%)",
  Instagram: "hsl(var(--primary))"
};

export const EngagementByPlatformChart = () => {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const sortedData = [...mockData].sort((a, b) => {
    const sumA = a.user + a.topcompetitor + a.viralcreator + a.contentking;
    const sumB = b.user + b.topcompetitor + b.viralcreator + b.contentking;
    return sortOrder === "asc" ? sumA - sumB : sumB - sumA;
  });

  const toggleSort = () => {
    setSortOrder(prev => prev === "asc" ? "desc" : "asc");
  };

  // Calculate gaps
  const platformGaps = mockData.map(p => ({
    name: p.name,
    gap: ((p.competitorAvg - p.user) / p.competitorAvg * 100).toFixed(1),
    isPositive: p.user >= p.competitorAvg
  }));

  return (
    <DashboardCard>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <SectionHeader
            level={2}
            title="Engagement Trends by Platform"
            subtitle="Your ER % vs top 3 competitors across platforms"
            timeRange="Last 7 days"
            dataScope="3 platforms"
            sampleSize="You + 3 competitors"
            tooltip="Engagement Rate = (Likes + Comments) / Views × 100. Higher ER indicates stronger audience resonance."
          />
          <Button 
            variant="outline" 
            size="sm"
            onClick={toggleSort}
            className="text-xs shrink-0"
          >
            Sort {sortOrder === "asc" ? "↑" : "↓"}
          </Button>
        </div>

        {/* Gap Summary - standardized chips */}
        <div className="flex gap-2 flex-wrap">
          {platformGaps.map(p => (
            <Badge 
              key={p.name}
              variant="secondary" 
              className={`text-xs px-2.5 py-0.5 ${
                parseFloat(p.gap) > 20 
                  ? "bg-destructive/10 text-destructive" 
                  : parseFloat(p.gap) > 10 
                  ? "bg-yellow-500/10 text-yellow-600"
                  : "bg-accent/10 text-accent"
              }`}
            >
              {p.name}: {parseFloat(p.gap) > 0 ? `-${p.gap}%` : `+${Math.abs(parseFloat(p.gap))}%`} vs avg
            </Badge>
          ))}
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={sortedData} layout="vertical" margin={{ left: 0, right: 30 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              type="number"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              domain={[0, 14]}
              tickFormatter={(value) => `${value}%`}
            />
            <YAxis 
              type="category"
              dataKey="name" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              width={80}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              formatter={(value: number, name: string) => {
                const labels: Record<string, string> = {
                  user: 'You',
                  topcompetitor: '@topcompetitor',
                  viralcreator: '@viralcreator',
                  contentking: '@contentking'
                };
                return [`${value}%`, labels[name] || name];
              }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '16px', fontSize: '11px' }}
              iconType="circle"
              iconSize={8}
              formatter={(value: string) => {
                const labels: Record<string, string> = {
                  user: 'You',
                  topcompetitor: '@topcompetitor',
                  viralcreator: '@viralcreator',
                  contentking: '@contentking'
                };
                return labels[value] || value;
              }}
            />
            <Bar dataKey="user" fill="hsl(163 82% 36%)" radius={[0, 4, 4, 0]} />
            <Bar dataKey="topcompetitor" fill="hsl(210 100% 50%)" radius={[0, 4, 4, 0]} />
            <Bar dataKey="viralcreator" fill="hsl(45 93% 47%)" radius={[0, 4, 4, 0]} />
            <Bar dataKey="contentking" fill="hsl(30 80% 55%)" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>

        {/* Platform summary cards */}
        <div className="grid grid-cols-3 gap-3 text-xs">
          {sortedData.map((platform) => (
            <div 
              key={platform.name}
              className="bg-muted/30 rounded-lg p-3 space-y-1 cursor-pointer hover:bg-muted/50 transition-colors"
            >
              <div className="font-semibold text-foreground flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: platformColors[platform.name] }}
                />
                {platform.name}
              </div>
              <div className="text-muted-foreground">{platform.views.toLocaleString()} views</div>
              <div className="text-[10px] text-muted-foreground">
                Your ER: <span className="font-medium text-foreground">{platform.user}%</span> • 
                Avg: <span className="font-medium">{platform.competitorAvg}%</span>
              </div>
            </div>
          ))}
        </div>

        <ChartCaption
          caption="TikTok shows your strongest relative performance (75% of competitor avg), while YouTube has the largest gap (47% of avg). Focus optimization efforts on YouTube content strategy."
          dataSource="Platform native analytics APIs"
          methodology="ER = (Likes + Comments) / Views × 100"
          confidence="Based on 183 posts"
          onShowData={() => console.log("Show raw data")}
        />

        <ActionBar
          primaryLabel="See what to change"
          onPrimaryAction={() => console.log("View platform breakdown")}
          secondaryLabel="View underlying data"
          onSecondaryAction={() => console.log("Show data")}
          expectedImpact="+15-20% ER on YouTube"
        />
      </div>
    </DashboardCard>
  );
};
