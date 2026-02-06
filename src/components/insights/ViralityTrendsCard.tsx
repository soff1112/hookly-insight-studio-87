import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, Search, Play } from "lucide-react";

const topVideos = [
  { id: 1, virality: 92, thumbnail: "bg-gradient-to-br from-pink-400 to-purple-500" },
  { id: 2, virality: 89, thumbnail: "bg-gradient-to-br from-blue-400 to-cyan-500" },
  { id: 3, virality: 87, thumbnail: "bg-gradient-to-br from-orange-400 to-red-500" },
];

export const ViralityTrendsCard = () => {
  return (
    <Card className="p-6 border-border">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Target className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Virality Trends</h3>
            <p className="text-sm text-muted-foreground">Top videos: 87-92% virality</p>
          </div>
        </div>

        <div className="flex gap-3">
          {topVideos.map((video) => (
            <div
              key={video.id}
              className={`relative flex-1 aspect-[9/16] rounded-lg ${video.thumbnail} flex items-center justify-center cursor-pointer group hover:scale-105 transition-transform`}
            >
              <div className="absolute inset-0 bg-black/20 rounded-lg group-hover:bg-black/30 transition-colors" />
              <Play className="w-8 h-8 text-white opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                {video.virality}%
              </div>
            </div>
          ))}
        </div>

        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Replicate:</span> Educational hooks in fashion niche with emotional storytelling format.
        </p>

        <Button variant="outline" className="w-full gap-2">
          <Search className="w-4 h-4" />
          Analyze Videos
        </Button>
      </div>
    </Card>
  );
};
