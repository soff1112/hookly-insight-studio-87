import { useMemo, useState } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown, Star, Clock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { HookType, HOOK_TYPE_BENCHMARKS } from "@/types/workspace";
import { cn } from "@/lib/utils";

type SortField = 'postsPerDay' | 'viralityScore' | 'consistencyIndex' | 'engagementRate';
type SortDirection = 'asc' | 'desc';

const HOOK_TYPE_COLORS: Record<HookType, string> = {
  'Question Hook': 'bg-primary/10 text-primary',
  'Shock Value': 'bg-destructive/10 text-destructive',
  'Tutorial': 'bg-blue-500/10 text-blue-500',
  'Emotional Story': 'bg-pink-500/10 text-pink-500',
  'Trending Sound': 'bg-cyan-500/10 text-cyan-500',
  'Behind-the-Scenes': 'bg-orange-500/10 text-orange-500',
  'List/Countdown': 'bg-violet-500/10 text-violet-500',
  'Challenge': 'bg-green-500/10 text-green-500'
};

const ConsistencyBar = ({ values }: { values: number[] }) => {
  return (
    <div className="flex gap-0.5 items-end h-4">
      {values.map((value, index) => (
        <div
          key={index}
          className={cn(
            "w-2 rounded-sm transition-all",
            value > 80 ? "bg-accent" : value > 50 ? "bg-primary" : value > 20 ? "bg-yellow-500" : "bg-muted"
          )}
          style={{ height: `${Math.max(value, 10)}%` }}
          title={`Day ${index + 1}: ${value}%`}
        />
      ))}
    </div>
  );
};

export const PostingRhythmTable = () => {
  const { getMainAccount, getTopCompetitors } = useWorkspace();
  const [sortField, setSortField] = useState<SortField>('viralityScore');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const mainAccount = getMainAccount();
  const competitors = getTopCompetitors(20);

  const tableData = useMemo(() => {
    const allAccounts = mainAccount ? [mainAccount, ...competitors] : competitors;
    
    return allAccounts.map((account, index) => {
      // Generate consistency bars (10 days of activity)
      const consistencyBars = Array.from({ length: 10 }, () => 
        Math.round(Math.random() * 60 + 40)
      );
      
      return {
        id: account.id,
        rank: index + 1,
        handle: account.handle,
        displayName: account.displayName,
        isMainAccount: account.isMainAccount,
        platform: account.platform,
        postsPerDay: account.metrics.postsPerDay,
        viralityScore: account.metrics.viralityScore,
        topHookType: account.metrics.topHookType,
        consistencyIndex: account.metrics.consistencyIndex,
        consistencyBars,
        engagementRate: account.metrics.engagementRate,
        avgDuration: account.metrics.avgVideoDuration
      };
    }).sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      const modifier = sortDirection === 'desc' ? -1 : 1;
      return (aVal - bVal) * modifier;
    });
  }, [mainAccount, competitors, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="w-3.5 h-3.5 ml-1" />;
    return sortDirection === 'desc' 
      ? <ArrowDown className="w-3.5 h-3.5 ml-1" />
      : <ArrowUp className="w-3.5 h-3.5 ml-1" />;
  };

  const getViralityColor = (score: number) => {
    if (score >= 150) return 'text-accent font-bold';
    if (score >= 100) return 'text-primary font-semibold';
    if (score >= 70) return 'text-yellow-500';
    return 'text-destructive';
  };

  return (
    <div className="p-5 rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Clock className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Posting Rhythm & Virality</h3>
            <p className="text-sm text-muted-foreground">
              Content frequency and performance analysis
            </p>
          </div>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Badge variant="outline" className="text-xs">
                <Zap className="w-3 h-3 mr-1" />
                Virality Formula
              </Badge>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs p-3">
              <p className="text-xs">
                <strong>Virality Score = (Actual Views / Expected Views) × 100</strong><br/>
                Expected Views = Followers × 0.10 (10% baseline reach)
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Score &gt;100% = outperforming expectations<br/>
                Score &gt;150% = viral content
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent bg-muted/30">
              <TableHead className="w-12 text-center">#</TableHead>
              <TableHead>Account</TableHead>
              <TableHead 
                className="cursor-pointer hover:text-foreground"
                onClick={() => handleSort('postsPerDay')}
              >
                <div className="flex items-center">
                  Posts/Day
                  <SortIcon field="postsPerDay" />
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:text-foreground"
                onClick={() => handleSort('viralityScore')}
              >
                <div className="flex items-center">
                  Virality %
                  <SortIcon field="viralityScore" />
                </div>
              </TableHead>
              <TableHead>Top Hook</TableHead>
              <TableHead 
                className="cursor-pointer hover:text-foreground"
                onClick={() => handleSort('consistencyIndex')}
              >
                <div className="flex items-center">
                  Consistency
                  <SortIcon field="consistencyIndex" />
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:text-foreground text-right"
                onClick={() => handleSort('engagementRate')}
              >
                <div className="flex items-center justify-end">
                  ER %
                  <SortIcon field="engagementRate" />
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.slice(0, 15).map((row, index) => (
              <TableRow 
                key={row.id}
                className={cn(
                  "transition-colors",
                  row.isMainAccount && "bg-primary/5 hover:bg-primary/10"
                )}
              >
                <TableCell className="text-center font-medium text-muted-foreground">
                  {index + 1}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {row.isMainAccount && (
                      <Star className="w-4 h-4 text-primary fill-primary" />
                    )}
                    <div>
                      <div className="font-medium text-foreground">
                        {row.isMainAccount ? 'You' : row.displayName}
                      </div>
                      <div className="text-xs text-muted-foreground">{row.handle}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className={cn(
                    "font-semibold",
                    row.postsPerDay >= 5 ? "text-accent" : 
                    row.postsPerDay >= 2 ? "text-foreground" : "text-yellow-500"
                  )}>
                    {row.postsPerDay.toFixed(1)}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={getViralityColor(row.viralityScore)}>
                    {row.viralityScore}%
                  </span>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="secondary" 
                    className={cn("text-xs", HOOK_TYPE_COLORS[row.topHookType])}
                  >
                    {row.topHookType}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <ConsistencyBar values={row.consistencyBars} />
                    <span className="text-xs text-muted-foreground">
                      {row.consistencyIndex}%
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <span className={cn(
                    "font-semibold",
                    row.engagementRate >= 8 ? "text-accent" :
                    row.engagementRate >= 5 ? "text-primary" : "text-foreground"
                  )}>
                    {row.engagementRate.toFixed(1)}%
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* AI Insight */}
      <div className="mt-4 p-4 rounded-lg bg-primary/5 border border-primary/20">
        <p className="text-sm text-foreground">
          <span className="font-semibold">💡 Cadence Gap:</span>{' '}
          {mainAccount && (
            <>
              Top performers post <strong>{tableData[0]?.postsPerDay.toFixed(1)}/day</strong>{' '}
              vs your <strong className="text-primary">{mainAccount.metrics.postsPerDay.toFixed(1)}/day</strong>.{' '}
              {mainAccount.metrics.postsPerDay < tableData[0]?.postsPerDay * 0.5 && (
                <>Testing 5+ posts/day for 30 days could increase reach by 25-40%.</>
              )}
            </>
          )}
        </p>
      </div>
    </div>
  );
};
