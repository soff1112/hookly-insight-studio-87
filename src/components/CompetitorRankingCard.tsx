import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface CompetitorRank {
  rank: number;
  handle: string;
  views: string;
  change: "up" | "down" | "same";
  isYou?: boolean;
}

const mockRankings: CompetitorRank[] = [
  { rank: 1, handle: "@mrbeast", views: "12.5M", change: "same" },
  { rank: 2, handle: "@khaby.lame", views: "9.8M", change: "up" },
  { rank: 3, handle: "@yourbrand", views: "350K", change: "down", isYou: true },
  { rank: 4, handle: "@charli", views: "2.1M", change: "up" },
  { rank: 5, handle: "@addison", views: "1.8M", change: "same" },
];

export const CompetitorRankingCard = () => {
  return (
    <Card className="p-6 border-border shadow-card overflow-hidden">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-1 h-8 bg-primary rounded-full" />
        <div>
          <h2 className="text-lg font-semibold text-foreground">Competitor Ranking</h2>
          <p className="text-sm text-muted-foreground">Last 14 days</p>
        </div>
      </div>

      <div className="space-y-2">
        {mockRankings.map((competitor) => (
          <div
            key={competitor.rank}
            className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 hover:scale-[1.02] ${
              competitor.isYou
                ? "bg-primary/10 border border-primary/20"
                : "bg-muted/50 hover:bg-muted"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                  competitor.rank === 1
                    ? "bg-yellow-500/20 text-yellow-600"
                    : competitor.rank === 2
                    ? "bg-gray-300/30 text-gray-600"
                    : competitor.rank === 3
                    ? "bg-orange-500/20 text-orange-600"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                #{competitor.rank}
              </div>
              <div>
                <span
                  className={`font-medium ${
                    competitor.isYou ? "text-primary" : "text-foreground"
                  }`}
                >
                  {competitor.handle}
                </span>
                {competitor.isYou && (
                  <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                    You
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-semibold text-foreground">{competitor.views} views</span>
              {competitor.change === "up" && (
                <TrendingUp className="h-4 w-4 text-green-500" />
              )}
              {competitor.change === "down" && (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              {competitor.change === "same" && (
                <Minus className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
