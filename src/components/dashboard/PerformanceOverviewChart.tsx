import { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Eye, Users, TrendingUp, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { TrackedAccount, PLATFORM_COLORS } from "@/types/workspace";

const CHART_COLORS = [
  "hsl(252 76% 66%)", // primary purple - user
  "hsl(163 82% 36%)", // green
  "hsl(217 91% 60%)", // blue
  "hsl(0 84% 60%)",   // red
  "hsl(45 93% 47%)",  // yellow
  "hsl(280 80% 60%)", // violet
  "hsl(174 100% 40%)", // cyan
  "hsl(326 78% 51%)", // pink
  "hsl(142 71% 45%)", // emerald
  "hsl(38 92% 50%)",  // orange
];

const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
  return num.toString();
};

export const PerformanceOverviewChart = () => {
  const { 
    getMainAccount, 
    getTopCompetitors, 
    timeRange,
    topNCompetitors 
  } = useWorkspace();
  
  const [showAllCompetitors, setShowAllCompetitors] = useState(false);
  const [hiddenLines, setHiddenLines] = useState<Set<string>>(new Set());

  const mainAccount = getMainAccount();
  const competitors = getTopCompetitors(showAllCompetitors ? 20 : topNCompetitors);
  
  const allAccounts = useMemo(() => {
    if (!mainAccount) return competitors;
    return [mainAccount, ...competitors];
  }, [mainAccount, competitors]);

  const chartData = useMemo(() => {
    if (allAccounts.length === 0) return [];
    
    // Get the date range based on timeRange
    const daysMap: Record<string, number> = {
      '1D': 1,
      '3D': 3,
      '7D': 7,
      '30D': 30,
      'All': 30
    };
    const days = daysMap[timeRange] || 7;
    
    // Build combined data from all accounts
    const dataMap = new Map<string, Record<string, number>>();
    
    allAccounts.forEach((account) => {
      const recentData = account.timeSeriesData.slice(-days);
      recentData.forEach((point) => {
        const dateKey = point.date;
        if (!dataMap.has(dateKey)) {
          dataMap.set(dateKey, { date: new Date(dateKey).getTime() });
        }
        const entry = dataMap.get(dateKey)!;
        entry[`${account.id}_views`] = point.views;
        entry[`${account.id}_followers`] = point.followers;
      });
    });
    
    return Array.from(dataMap.values())
      .sort((a, b) => a.date - b.date)
      .map(entry => ({
        ...entry,
        dateLabel: new Date(entry.date).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        })
      }));
  }, [allAccounts, timeRange]);

  const toggleLine = (accountId: string) => {
    setHiddenLines(prev => {
      const next = new Set(prev);
      if (next.has(accountId)) {
        next.delete(accountId);
      } else {
        next.add(accountId);
      }
      return next;
    });
  };

  const getAccountColor = (account: TrackedAccount, index: number): string => {
    if (account.isMainAccount) return CHART_COLORS[0];
    return CHART_COLORS[(index % (CHART_COLORS.length - 1)) + 1];
  };

  return (
    <div className="p-5 rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Performance Overview</h3>
            <p className="text-sm text-muted-foreground">
              Views & followers comparison • {allAccounts.length} accounts
            </p>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAllCompetitors(!showAllCompetitors)}
          className="text-xs"
        >
          {showAllCompetitors ? (
            <>Show Top {topNCompetitors} <ChevronUp className="ml-1 w-3.5 h-3.5" /></>
          ) : (
            <>Show All 20 <ChevronDown className="ml-1 w-3.5 h-3.5" /></>
          )}
        </Button>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-2 mb-4 max-h-20 overflow-y-auto">
        {allAccounts.map((account, index) => (
          <Badge
            key={account.id}
            variant={hiddenLines.has(account.id) ? "outline" : "secondary"}
            className="cursor-pointer text-xs py-1 hover:bg-secondary/80"
            style={{
              borderColor: hiddenLines.has(account.id) 
                ? undefined 
                : getAccountColor(account, index),
              opacity: hiddenLines.has(account.id) ? 0.5 : 1
            }}
            onClick={() => toggleLine(account.id)}
          >
            <div 
              className="w-2 h-2 rounded-full mr-1.5" 
              style={{ backgroundColor: getAccountColor(account, index) }}
            />
            {account.isMainAccount ? '⭐ You' : account.handle.substring(0, 15)}
          </Badge>
        ))}
      </div>

      {/* Chart */}
      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="hsl(var(--border))" 
              opacity={0.5}
            />
            <XAxis 
              dataKey="dateLabel" 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <YAxis 
              yAxisId="views"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              tickFormatter={formatNumber}
              label={{ 
                value: 'Views', 
                angle: -90, 
                position: 'insideLeft',
                fill: 'hsl(var(--muted-foreground))',
                fontSize: 11
              }}
            />
            <YAxis 
              yAxisId="followers"
              orientation="right"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              tickFormatter={formatNumber}
              label={{ 
                value: 'Followers', 
                angle: 90, 
                position: 'insideRight',
                fill: 'hsl(var(--muted-foreground))',
                fontSize: 11
              }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px'
              }}
              formatter={(value: number, name: string) => {
                const isViews = name.includes('views');
                return [formatNumber(value), isViews ? 'Views' : 'Followers'];
              }}
            />
            
            {/* Views lines */}
            {allAccounts.map((account, index) => (
              !hiddenLines.has(account.id) && (
                <Line
                  key={`${account.id}_views`}
                  yAxisId="views"
                  type="monotone"
                  dataKey={`${account.id}_views`}
                  name={`${account.handle} views`}
                  stroke={getAccountColor(account, index)}
                  strokeWidth={account.isMainAccount ? 3 : 1.5}
                  dot={false}
                  opacity={account.isMainAccount ? 1 : 0.7}
                />
              )
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-4 border-t border-border">
        {mainAccount && (
          <>
            <div className="p-3 rounded-lg bg-primary/5">
              <div className="flex items-center gap-2 mb-1">
                <Eye className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs text-muted-foreground">Your Avg Views</span>
              </div>
              <div className="text-lg font-bold text-foreground">
                {formatNumber(mainAccount.metrics.avgViewsPerPost)}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-accent/5">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-3.5 h-3.5 text-accent" />
                <span className="text-xs text-muted-foreground">Your Followers</span>
              </div>
              <div className="text-lg font-bold text-foreground">
                {formatNumber(mainAccount.metrics.followers)}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-secondary/30">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Top Competitor Views</span>
              </div>
              <div className="text-lg font-bold text-foreground">
                {competitors[0] ? formatNumber(competitors[0].metrics.avgViewsPerPost) : '-'}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-secondary/30">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Top Competitor Followers</span>
              </div>
              <div className="text-lg font-bold text-foreground">
                {competitors[0] ? formatNumber(competitors[0].metrics.followers) : '-'}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
