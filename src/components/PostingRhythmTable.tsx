import { useState } from "react";
import { DashboardCard } from "@/components/DashboardCard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowUpDown } from "lucide-react";
import { Progress } from "@/components/ui/progress";

type Competitor = {
  id: string;
  username: string;
  postsPerDay: number;
  avgVirality: number;
  topHookType: string;
  isUser?: boolean;
};

const mockCompetitors: Competitor[] = [
  { id: "1", username: "You", postsPerDay: 2.3, avgVirality: 87, topHookType: "Emotional Story", isUser: true },
  { id: "2", username: "@topcompetitor", postsPerDay: 10, avgVirality: 92, topHookType: "Question Hook" },
  { id: "3", username: "@viralcreator", postsPerDay: 8.5, avgVirality: 89, topHookType: "Shock Value" },
  { id: "4", username: "@contentking", postsPerDay: 7.2, avgVirality: 85, topHookType: "Tutorial" },
  { id: "5", username: "@trendsetter", postsPerDay: 6.8, avgVirality: 83, topHookType: "Trending Sound" },
];

type SortField = "postsPerDay" | "avgVirality";

export const PostingRhythmTable = () => {
  const [sortField, setSortField] = useState<SortField>("postsPerDay");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selected, setSelected] = useState<string[]>([]);

  const sortedCompetitors = [...mockCompetitors].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const toggleSelect = (id: string) => {
    setSelected(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <DashboardCard>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Posting Rhythm & Virality</h3>
          </div>
          {selected.length > 0 && (
            <Button variant="outline" size="sm">
              Export {selected.length} selected
            </Button>
          )}
        </div>

        <p className="text-sm text-muted-foreground">
          Compare posting frequency and virality scores across competitors
        </p>

        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-12">
                  <Checkbox 
                    checked={selected.length === mockCompetitors.length}
                    onCheckedChange={(checked) => {
                      setSelected(checked ? mockCompetitors.map(c => c.id) : []);
                    }}
                  />
                </TableHead>
                <TableHead className="w-[180px]">Account</TableHead>
                <TableHead 
                  className="w-[140px] cursor-pointer hover:bg-muted/70"
                  onClick={() => handleSort("postsPerDay")}
                >
                  <div className="flex items-center gap-2">
                    Posts/Day
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </TableHead>
                <TableHead 
                  className="w-[140px] cursor-pointer hover:bg-muted/70"
                  onClick={() => handleSort("avgVirality")}
                >
                  <div className="flex items-center gap-2">
                    Avg Virality %
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </TableHead>
                <TableHead className="w-[200px]">Top Hook Type</TableHead>
                <TableHead className="w-[150px]">Rhythm Bar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedCompetitors.map((competitor) => (
                <TableRow 
                  key={competitor.id}
                  className={competitor.isUser ? "bg-accent/5 border-l-4 border-l-accent" : ""}
                >
                  <TableCell>
                    <Checkbox 
                      checked={selected.includes(competitor.id)}
                      onCheckedChange={() => toggleSelect(competitor.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {competitor.username}
                      {competitor.isUser && (
                        <Badge variant="secondary" className="text-xs bg-accent/10 text-accent-foreground">
                          You
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-foreground">{competitor.postsPerDay}</span>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <span className="text-sm font-semibold text-foreground">{competitor.avgVirality}%</span>
                      <Progress value={competitor.avgVirality} className="h-1.5" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {competitor.topHookType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div 
                          key={i}
                          className={`h-6 w-2 rounded-sm ${
                            i < Math.floor(competitor.postsPerDay) 
                              ? 'bg-primary' 
                              : 'bg-muted'
                          }`}
                        />
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="bg-blue-500/5 border-l-4 border-blue-500 rounded-r-lg p-4">
          <p className="text-sm text-foreground">
            <span className="mr-2">💡</span>
            <strong>Strategy Insight:</strong> Top performers post 8-10 videos/day. Your current 2.3/day is 77% below the top tier. Testing a higher posting cadence could accelerate growth by matching competitor consistency.
          </p>
        </div>
      </div>
    </DashboardCard>
  );
};
