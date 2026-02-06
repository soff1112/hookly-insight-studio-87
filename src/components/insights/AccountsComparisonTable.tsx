import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, ArrowUpDown, TrendingUp, ChevronUp, ChevronDown } from "lucide-react";
import { useInsightsFilters } from "@/contexts/InsightsFilterContext";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { subDays, format, eachDayOfInterval } from "date-fns";

interface AccountData {
  id: string;
  handle: string;
  isUser: boolean;
  posts: number;
  views: number;
  avgViewsPerPost: number;
  engagementRate: number;
  likes: number;
  comments: number;
  shares: number;
}

type SortKey = keyof Omit<AccountData, "id" | "handle" | "isUser">;

const formatValue = (value: number) => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value.toLocaleString();
};

export const AccountsComparisonTable = () => {
  const { filters, availableAccounts } = useInsightsFilters();
  const [sortKey, setSortKey] = useState<SortKey>("views");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedAccount, setSelectedAccount] = useState<AccountData | null>(null);

  const getDefaultSortKey = (): SortKey => {
    switch (filters.primaryMetric) {
      case "views": return "views";
      case "likes": return "likes";
      case "comments": return "comments";
      case "shares": return "shares";
      case "engagementRate": return "engagementRate";
      default: return "views";
    }
  };

  const accountData: AccountData[] = useMemo(() => {
    const selectedAccounts = availableAccounts.filter(a => filters.accounts.includes(a.id));
    
    return selectedAccounts.map((account) => {
      const posts = Math.floor(Math.random() * 30) + 10;
      const views = Math.floor(Math.random() * 2000000) + 200000;
      const likes = Math.floor(views * (Math.random() * 0.08 + 0.02));
      const comments = Math.floor(likes * (Math.random() * 0.15 + 0.05));
      const shares = Math.floor(likes * (Math.random() * 0.25 + 0.08));
      
      return {
        id: account.id,
        handle: account.handle,
        isUser: account.isUser,
        posts,
        views,
        avgViewsPerPost: Math.floor(views / posts),
        engagementRate: parseFloat(((likes + comments + shares) / views * 100).toFixed(2)),
        likes,
        comments,
        shares,
      };
    });
  }, [filters.accounts, availableAccounts]);

  const sortedData = useMemo(() => {
    return [...accountData].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      return sortDirection === "desc" ? (bVal as number) - (aVal as number) : (aVal as number) - (bVal as number);
    });
  }, [accountData, sortKey, sortDirection]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(prev => prev === "desc" ? "asc" : "desc");
    } else {
      setSortKey(key);
      setSortDirection("desc");
    }
  };

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortKey !== column) {
      return <ArrowUpDown className="w-3 h-3 ml-1 opacity-50" />;
    }
    return sortDirection === "desc" 
      ? <ChevronDown className="w-3 h-3 ml-1" />
      : <ChevronUp className="w-3 h-3 ml-1" />;
  };

  const miniChartData = useMemo(() => {
    if (!selectedAccount) return [];
    const now = new Date();
    const dates = eachDayOfInterval({ start: subDays(now, 7), end: now });
    
    return dates.map((date) => ({
      date: format(date, "MMM d"),
      value: Math.floor(Math.random() * 50000) + 10000,
    }));
  }, [selectedAccount]);

  const topPosts = useMemo(() => {
    if (!selectedAccount) return [];
    return Array.from({ length: 10 }, (_, i) => ({
      id: i,
      title: `Top performing video #${i + 1} about trending topic`,
      views: Math.floor(Math.random() * 200000) + 50000,
      date: subDays(new Date(), Math.floor(Math.random() * 7)),
    })).sort((a, b) => b.views - a.views);
  }, [selectedAccount]);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Accounts Comparison</CardTitle>
              <CardDescription>
                Compare your performance against competitors • Click a row for details
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account</TableHead>
                  <TableHead 
                    className="cursor-pointer hover:text-foreground"
                    onClick={() => handleSort("posts")}
                  >
                    <span className="flex items-center">Posts<SortIcon column="posts" /></span>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:text-foreground"
                    onClick={() => handleSort("views")}
                  >
                    <span className="flex items-center">Views<SortIcon column="views" /></span>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:text-foreground"
                    onClick={() => handleSort("avgViewsPerPost")}
                  >
                    <span className="flex items-center">Avg/Post<SortIcon column="avgViewsPerPost" /></span>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:text-foreground"
                    onClick={() => handleSort("engagementRate")}
                  >
                    <span className="flex items-center">ER %<SortIcon column="engagementRate" /></span>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:text-foreground"
                    onClick={() => handleSort("likes")}
                  >
                    <span className="flex items-center">Likes<SortIcon column="likes" /></span>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:text-foreground"
                    onClick={() => handleSort("comments")}
                  >
                    <span className="flex items-center">Comments<SortIcon column="comments" /></span>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:text-foreground"
                    onClick={() => handleSort("shares")}
                  >
                    <span className="flex items-center">Shares<SortIcon column="shares" /></span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No accounts selected.
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedData.map((account) => (
                    <TableRow 
                      key={account.id}
                      className={`cursor-pointer hover:bg-muted/50 ${account.isUser ? "bg-primary/5" : ""}`}
                      onClick={() => setSelectedAccount(account)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{account.handle}</span>
                          {account.isUser && (
                            <Badge variant="secondary" className="text-xs">You</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{account.posts}</TableCell>
                      <TableCell>{formatValue(account.views)}</TableCell>
                      <TableCell>{formatValue(account.avgViewsPerPost)}</TableCell>
                      <TableCell>
                        <span className={account.engagementRate > 5 ? "text-green-600" : ""}>
                          {account.engagementRate}%
                        </span>
                      </TableCell>
                      <TableCell>{formatValue(account.likes)}</TableCell>
                      <TableCell>{formatValue(account.comments)}</TableCell>
                      <TableCell>{formatValue(account.shares)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      <Sheet open={!!selectedAccount} onOpenChange={() => setSelectedAccount(null)}>
        <SheetContent className="w-[500px] sm:max-w-[500px]">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              {selectedAccount?.handle}
              {selectedAccount?.isUser && <Badge variant="secondary">You</Badge>}
            </SheetTitle>
            <SheetDescription>
              Account performance breakdown
            </SheetDescription>
          </SheetHeader>

          {selectedAccount && (
            <div className="mt-6 space-y-6">
              <div>
                <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Views Over Time
                </h4>
                <div className="h-[150px] bg-muted/50 rounded-lg p-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={miniChartData}>
                      <XAxis 
                        dataKey="date" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false}
                      />
                      <YAxis 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false}
                        tickFormatter={(v) => formatValue(v)}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                        formatter={(v: number) => [formatValue(v), "Views"]}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-3">Top Posts</h4>
                <ScrollArea className="h-[200px]">
                  <div className="space-y-2">
                    {topPosts.map((post, i) => (
                      <div 
                        key={post.id}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50"
                      >
                        <span className="text-xs text-muted-foreground w-4">#{i + 1}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm truncate">{post.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(post.date, "MMM d")}
                          </p>
                        </div>
                        <span className="text-sm font-medium">{formatValue(post.views)}</span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-3">Platform Split</h4>
                <div className="flex gap-2">
                  <Badge variant="outline">TikTok: 60%</Badge>
                  <Badge variant="outline">Instagram: 30%</Badge>
                  <Badge variant="outline">YouTube: 10%</Badge>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};
