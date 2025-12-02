import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Video, Heart, Eye } from "lucide-react";

interface CompetitorDrawerProps {
  open: boolean;
  onClose: () => void;
  competitor: {
    name: string;
    followers: string;
    engagement: string;
    avgViews: string;
    score: number;
  } | null;
}

export const CompetitorDrawer = ({
  open,
  onClose,
  competitor,
}: CompetitorDrawerProps) => {
  if (!competitor) return null;

  const topVideos = [
    { title: "5 Tips for Viral Content", views: "45.2K", engagement: "8.2%" },
    { title: "How to Grow Fast", views: "38.1K", engagement: "7.8%" },
    { title: "Best Posting Times", views: "32.4K", engagement: "7.1%" },
  ];

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-[500px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{competitor.name}</SheetTitle>
          <SheetDescription>Detailed performance analysis</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Eye className="w-4 h-4" />
                <span className="text-xs">Followers</span>
              </div>
              <div className="text-2xl font-bold text-foreground">
                {competitor.followers}
              </div>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Heart className="w-4 h-4" />
                <span className="text-xs">Engagement</span>
              </div>
              <div className="text-2xl font-bold text-foreground">
                {competitor.engagement}
              </div>
            </div>
          </div>

          {/* Hookly Score */}
          <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground mb-1">
                  Hookly Score
                </div>
                <div className="text-3xl font-bold text-primary">
                  {competitor.score}
                </div>
              </div>
              <Badge variant="secondary" className="text-xs">
                Top Performer
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Score is based on engagement × consistency × reach.
            </p>
          </div>

          {/* Top Performing Videos */}
          <div>
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Video className="w-4 h-4" />
              Top 3 Best-Performing Videos
            </h3>
            <div className="space-y-3">
              {topVideos.map((video, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="font-medium text-sm text-foreground mb-1">
                    {video.title}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {video.views} views
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-green-600" />
                      {video.engagement}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <Button className="w-full gap-2">
              <TrendingUp className="w-4 h-4" />
              Add to Watchlist
            </Button>
            <Button variant="outline" className="w-full">
              View Full Profile
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
