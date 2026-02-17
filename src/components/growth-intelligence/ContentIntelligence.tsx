import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ContentInsight {
  metric: string;
  value: string;
  context: string;
}

const insights: ContentInsight[] = [
  { metric: "Viral videos with hook < 3s", value: "78%", context: "vs your 34% of content" },
  { metric: "Question-based hook usage", value: "41%", context: "+34% ER vs statement hooks" },
  { metric: "Top performing format", value: "Duet/Stitch", context: "2.1x avg engagement" },
  { metric: "Avg length of top 20% videos", value: "47s", context: "Your avg: 82s" },
  { metric: "CTA usage frequency", value: "89%", context: "Your usage: 52%" },
  { metric: "Best posting days", value: "Tue, Thu, Sat", context: "Based on competitor peaks" },
];

export const ContentIntelligence = () => {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Competitor Content Intelligence</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {insights.map((i) => (
            <div key={i.metric} className="p-3 rounded-lg border bg-muted/20 space-y-1">
              <p className="text-xs text-muted-foreground font-medium">{i.metric}</p>
              <p className="text-xl font-bold text-foreground">{i.value}</p>
              <Badge variant="outline" className="text-xs text-muted-foreground">
                {i.context}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
