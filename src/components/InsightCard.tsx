import { Lightbulb, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const insights = [
  "Your top competitors post around 10 videos per day. To stay competitive, try maintaining a similar posting rhythm for consistent audience growth.",
  "Competitors with the highest engagement rate post during 6-9 PM. Consider scheduling your content during peak hours.",
  "The average video length of top performers is 45-60 seconds. Optimize your content duration for better retention.",
  "Your competitors use 8-12 hashtags per post on average. Strategic hashtag usage could boost your discoverability.",
];

export const InsightCard = () => {
  const [currentInsight, setCurrentInsight] = useState(0);

  const regenerateInsight = () => {
    setCurrentInsight((prev) => (prev + 1) % insights.length);
  };

  return (
    <div className="mt-6 p-4 rounded-lg border-2 border-primary/20 bg-primary/5 animate-fade-in">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-full bg-primary/10">
          <Lightbulb className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground mb-1">💡 Insight</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {insights[currentInsight]}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={regenerateInsight}
          className="gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Regenerate Tip
        </Button>
      </div>
    </div>
  );
};
