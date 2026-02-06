import { Card } from "@/components/ui/card";
import { Activity, Lightbulb, ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const mockData = [
  {
    account: "@topcompetitor",
    postsPerDay: 10,
    virality: 92,
    hookType: "Question Hook",
    rhythmBars: 10,
    isYou: false,
  },
  {
    account: "@viralcreator",
    postsPerDay: 8.5,
    virality: 89,
    hookType: "Shock Value",
    rhythmBars: 9,
    isYou: false,
  },
  {
    account: "@contentking",
    postsPerDay: 7.2,
    virality: 85,
    hookType: "Tutorial",
    rhythmBars: 7,
    isYou: false,
  },
  {
    account: "@trendsetter",
    postsPerDay: 6.8,
    virality: 83,
    hookType: "Trending Sound",
    rhythmBars: 6,
    isYou: false,
  },
  {
    account: "You",
    postsPerDay: 2.3,
    virality: 87,
    hookType: "Emotional Story",
    rhythmBars: 2,
    isYou: true,
  },
];

const RhythmBar = ({ bars, maxBars = 10 }: { bars: number; maxBars?: number }) => {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: maxBars }).map((_, i) => (
        <div
          key={i}
          className={`w-2 h-6 rounded-sm transition-colors ${
            i < bars ? "bg-primary" : "bg-muted"
          }`}
        />
      ))}
    </div>
  );
};

export const PostingRhythmVirality = () => {
  return (
    <Card className="p-6 border-border">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Activity className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Posting Rhythm & Virality</h3>
            <p className="text-sm text-muted-foreground">Compare posting frequency and viral performance</p>
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Account</TableHead>
                <TableHead className="font-semibold">
                  <div className="flex items-center gap-1">
                    Posts/Day
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </TableHead>
                <TableHead className="font-semibold">
                  <div className="flex items-center gap-1">
                    Avg Virality %
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </TableHead>
                <TableHead className="font-semibold">Top Hook Type</TableHead>
                <TableHead className="font-semibold">Rhythm Bar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockData.map((row) => (
                <TableRow
                  key={row.account}
                  className={row.isYou ? "bg-emerald-50 dark:bg-emerald-950/20" : ""}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {row.account}
                      {row.isYou && (
                        <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 text-xs">
                          You
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold">{row.postsPerDay}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={row.virality} className="w-16 h-2" />
                      <span className="font-semibold text-emerald-600">{row.virality}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-normal">
                      {row.hookType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <RhythmBar bars={row.rhythmBars} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/5 border border-primary/10">
          <Lightbulb className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <p className="text-sm text-foreground">
            <span className="font-medium">Strategy Insight:</span> Top performers post 8-10 videos/day. Your current 2.3/day 
            is 77% below the top tier. Testing a higher posting cadence could accelerate growth by matching competitor consistency.
          </p>
        </div>
      </div>
    </Card>
  );
};
