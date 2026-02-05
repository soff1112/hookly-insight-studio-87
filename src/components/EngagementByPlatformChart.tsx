import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { DashboardCard } from "@/components/DashboardCard";
import { BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockData = [
  { 
    name: "Instagram", 
    user: 4.2, 
    topcompetitor: 6.8, 
    viralcreator: 7.2, 
    contentking: 5.9,
    views: 12000 
  },
  { 
    name: "TikTok", 
    user: 8.1, 
    topcompetitor: 12.1, 
    viralcreator: 10.5, 
    contentking: 9.8,
    views: 45000 
  },
  { 
    name: "YouTube", 
    user: 3.5, 
    topcompetitor: 8.2, 
    viralcreator: 6.9, 
    contentking: 7.4,
    views: 89000 
  },
];

const platformColors: Record<string, string> = {
  Instagram: "hsl(var(--primary))",
  TikTok: "hsl(240 10% 10%)",
  YouTube: "hsl(0 84% 60%)"
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

  return (
    <DashboardCard>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Engagement Trends by Platform</h3>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={toggleSort}
            className="text-xs"
          >
            Sort {sortOrder === "asc" ? "↑" : "↓"}
          </Button>
        </div>

        <p className="text-sm text-muted-foreground">
          Engagement Rate % - Top 3 Competitors vs. You
        </p>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={sortedData} layout="vertical" margin={{ left: 0, right: 30 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--primary) / 0.1)" />
            <XAxis 
              type="number"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              label={{ value: 'Engagement Rate (%)', position: 'insideBottom', offset: -5, style: { fontSize: 12, fill: 'hsl(var(--muted-foreground))' } }}
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
                fontSize: '12px'
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
              wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }}
              formatter={(value: string) => {
                const labels: Record<string, string> = {
                  user: '🟢 You',
                  topcompetitor: '🔵 @topcompetitor',
                  viralcreator: '🟡 @viralcreator',
                  contentking: '🟠 @contentking'
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
            </div>
          ))}
        </div>
      </div>
    </DashboardCard>
  );
};
