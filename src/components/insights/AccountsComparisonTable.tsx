import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, ArrowUpDown, ChevronUp, ChevronDown } from "lucide-react";
import { useInsightsFilters } from "@/contexts/InsightsFilterContext";
import { AIRecommendationBlock } from "./AIRecommendationBlock";

interface AccountData {
  id: string;
  handle: string;
  isUser: boolean;
  postingFrequency: number;
  avgPostingTime: string;
  engagementRate: number;
}

type SortKey = "postingFrequency" | "avgPostingTime" | "engagementRate";

export const AccountsComparisonTable = () => {
  const { filters, availableAccounts } = useInsightsFilters();
  const [sortKey, setSortKey] = useState<SortKey>("engagementRate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const accountData: AccountData[] = useMemo(() => {
    const selectedAccounts = availableAccounts.filter(a => filters.accounts.includes(a.id));

    return selectedAccounts.map((account) => {
      const postingFrequency = parseFloat((Math.random() * 8 + 1).toFixed(1));
      const hour = Math.floor(Math.random() * 24);
      const avgPostingTime = `${hour.toString().padStart(2, "0")}:00`;
      const engagementRate = parseFloat((Math.random() * 8 + 1.5).toFixed(1));

      return {
        id: account.id,
        handle: account.handle,
        isUser: account.isUser,
        postingFrequency,
        avgPostingTime,
        engagementRate,
      };
    });
  }, [filters.accounts, availableAccounts]);

  const sortedData = useMemo(() => {
    return [...accountData].sort((a, b) => {
      if (sortKey === "avgPostingTime") {
        const aH = parseInt(a.avgPostingTime);
        const bH = parseInt(b.avgPostingTime);
        return sortDirection === "desc" ? bH - aH : aH - bH;
      }
      const aVal = a[sortKey] as number;
      const bVal = b[sortKey] as number;
      return sortDirection === "desc" ? bVal - aVal : aVal - bVal;
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
    if (sortKey !== column) return <ArrowUpDown className="w-3 h-3 ml-1 opacity-50" />;
    return sortDirection === "desc"
      ? <ChevronDown className="w-3 h-3 ml-1" />
      : <ChevronUp className="w-3 h-3 ml-1" />;
  };

  // Generate AI recommendations based on data
  const recommendations = useMemo(() => {
    const userAccount = accountData.find(a => a.isUser);
    const competitors = accountData.filter(a => !a.isUser);
    if (!userAccount || competitors.length === 0) return [];

    const tips: string[] = [];
    const avgCompFreq = competitors.reduce((s, c) => s + c.postingFrequency, 0) / competitors.length;
    const avgCompER = competitors.reduce((s, c) => s + c.engagementRate, 0) / competitors.length;

    if (userAccount.postingFrequency < avgCompFreq * 0.7) {
      tips.push(
        `You post ${userAccount.postingFrequency} times/day while top competitors average ${avgCompFreq.toFixed(1)} posts/day. Increasing frequency to at least ${Math.ceil(avgCompFreq * 0.7)}–${Math.ceil(avgCompFreq * 0.85)} posts/day could improve reach by approximately 25–40%.`
      );
    }

    const userHour = parseInt(userAccount.avgPostingTime);
    const competitorHours = competitors.map(c => parseInt(c.avgPostingTime));
    const avgCompHour = Math.round(competitorHours.reduce((s, h) => s + h, 0) / competitorHours.length);
    if (Math.abs(userHour - avgCompHour) > 3) {
      tips.push(
        `Your average posting time is ${userAccount.avgPostingTime}, while competitors achieve highest ER posting around ${avgCompHour.toString().padStart(2, "0")}:00–${(avgCompHour + 2).toString().padStart(2, "0")}:00. Testing evening publishing may improve engagement.`
      );
    }

    if (userAccount.engagementRate < avgCompER * 0.85) {
      tips.push(
        `Your ER is ${userAccount.engagementRate}% vs competitor average ${avgCompER.toFixed(1)}%. The main gap is likely in hook strength and posting consistency.`
      );
    }

    return tips.length > 0 ? tips : ["Your metrics are competitive. Maintain current strategy and monitor for changes."];
  }, [accountData]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">Accounts Strategic Comparison</CardTitle>
            <CardDescription>
              Compare strategic metrics against competitors
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Account</TableHead>
              <TableHead
                className="cursor-pointer hover:text-foreground"
                onClick={() => handleSort("postingFrequency")}
              >
                <span className="flex items-center">Posting Frequency<SortIcon column="postingFrequency" /></span>
              </TableHead>
              <TableHead
                className="cursor-pointer hover:text-foreground"
                onClick={() => handleSort("avgPostingTime")}
              >
                <span className="flex items-center">Avg Posting Time<SortIcon column="avgPostingTime" /></span>
              </TableHead>
              <TableHead
                className="cursor-pointer hover:text-foreground"
                onClick={() => handleSort("engagementRate")}
              >
                <span className="flex items-center">ER %<SortIcon column="engagementRate" /></span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  No accounts selected.
                </TableCell>
              </TableRow>
            ) : (
              sortedData.map((account) => (
                <TableRow
                  key={account.id}
                  className={account.isUser ? "bg-primary/5" : ""}
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{account.handle}</span>
                      {account.isUser && (
                        <Badge variant="secondary" className="text-xs">You</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{account.postingFrequency} posts/day</TableCell>
                  <TableCell>{account.avgPostingTime} (UTC)</TableCell>
                  <TableCell>
                    <span className={account.engagementRate > 5 ? "text-green-600" : ""}>
                      {account.engagementRate}%
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <AIRecommendationBlock recommendations={recommendations} />
      </CardContent>
    </Card>
  );
};
