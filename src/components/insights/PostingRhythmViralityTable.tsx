import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Clock, Lightbulb } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const mockData = [
  { account: "@fitness_guru", postsPerDay: 8.2, viralityScore: 78, topHook: "Question", consistency: 92, isYou: false },
  { account: "@lifestyle_vlog", postsPerDay: 7.5, viralityScore: 72, topHook: "Shock", consistency: 88, isYou: false },
  { account: "@tech_insider", postsPerDay: 6.8, viralityScore: 68, topHook: "Educational", consistency: 85, isYou: false },
  { account: "@yourbrand", postsPerDay: 2.3, viralityScore: 45, topHook: "Storytelling", consistency: 62, isYou: true },
  { account: "@travel_daily", postsPerDay: 5.4, viralityScore: 58, topHook: "Visual", consistency: 78, isYou: false },
  { account: "@food_creator", postsPerDay: 4.2, viralityScore: 52, topHook: "Tutorial", consistency: 71, isYou: false },
];

const hookColors: Record<string, string> = {
  Question: "bg-primary/20 text-primary",
  Shock: "bg-destructive/20 text-destructive",
  Educational: "bg-accent/20 text-accent",
  Storytelling: "bg-mint/20 text-mint-foreground",
  Visual: "bg-secondary text-secondary-foreground",
  Tutorial: "bg-muted text-muted-foreground",
};

export const PostingRhythmViralityTable = () => {
  const sortedData = [...mockData].sort((a, b) => b.viralityScore - a.viralityScore);

  return (
    <Card className="p-6 border-border shadow-card">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-accent/10">
            <Clock className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Posting Rhythm & Virality</h3>
            <p className="text-sm text-muted-foreground">All connected accounts compared</p>
          </div>
        </div>

        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Account</TableHead>
                <TableHead className="font-semibold text-center">Posts/Day</TableHead>
                <TableHead className="font-semibold text-center">Avg Virality</TableHead>
                <TableHead className="font-semibold">Top Hook Type</TableHead>
                <TableHead className="font-semibold">Consistency</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((row) => (
                <TableRow
                  key={row.account}
                  className={row.isYou ? "bg-primary/5 border-l-4 border-l-primary" : ""}
                >
                  <TableCell className="font-medium">
                    {row.account}
                    {row.isYou && (
                      <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-primary text-primary-foreground">
                        You
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-center font-mono">{row.postsPerDay}</TableCell>
                  <TableCell className="text-center">
                    <span
                      className={`font-semibold ${
                        row.viralityScore >= 70
                          ? "text-accent"
                          : row.viralityScore >= 50
                          ? "text-foreground"
                          : "text-destructive"
                      }`}
                    >
                      {row.viralityScore}%
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`text-xs px-2 py-1 rounded-full ${hookColors[row.topHook] || "bg-muted"}`}>
                      {row.topHook}
                    </span>
                  </TableCell>
                  <TableCell className="w-32">
                    <div className="flex items-center gap-2">
                      <Progress value={row.consistency} className="h-2" />
                      <span className="text-xs text-muted-foreground w-8">{row.consistency}%</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-start gap-3 p-4 rounded-lg bg-accent/5 border border-accent/10">
          <Lightbulb className="w-5 h-5 text-accent shrink-0 mt-0.5" />
          <p className="text-sm text-foreground">
            <span className="font-medium">AI Insight:</span> Accounts posting 7–9 times/day outperform you by 77% in reach. 
            Your posting consistency also lags top performers by 30 points.
          </p>
        </div>
      </div>
    </Card>
  );
};
