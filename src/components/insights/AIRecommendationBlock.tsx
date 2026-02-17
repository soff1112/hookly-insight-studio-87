import { Bot } from "lucide-react";

interface AIRecommendationBlockProps {
  recommendations: string[];
}

export const AIRecommendationBlock = ({ recommendations }: AIRecommendationBlockProps) => {
  if (recommendations.length === 0) return null;

  return (
    <div className="mt-4 p-4 rounded-lg bg-primary/5 border border-primary/10">
      <div className="flex items-start gap-3">
        <div className="p-1.5 rounded-md bg-primary/10 mt-0.5">
          <Bot className="w-4 h-4 text-primary" />
        </div>
        <div className="flex-1 space-y-2">
          <h4 className="text-sm font-semibold text-foreground">AI Recommendation</h4>
          {recommendations.map((text, i) => (
            <p key={i} className="text-sm text-muted-foreground leading-relaxed">
              {text}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};
