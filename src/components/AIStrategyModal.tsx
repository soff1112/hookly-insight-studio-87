import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Download, TrendingUp, AlertTriangle, Target, Lightbulb } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AIStrategyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AIStrategyModal = ({ open, onOpenChange }: AIStrategyModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <Sparkles className="w-6 h-6 text-primary" />
            AI-Generated Marketing Strategy
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[calc(90vh-120px)] pr-4">
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-lg p-5">
              <p className="text-sm text-muted-foreground mb-2">Generated on {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
              <p className="text-foreground">
                Based on analysis of <strong>your account</strong> + <strong>5 tracked competitors</strong> across Instagram, TikTok, and YouTube. 
                Personalized for your style: <Badge variant="secondary" className="ml-2 bg-primary/10 text-primary">Energetic & Educational</Badge>
              </p>
            </div>

            {/* Strengths */}
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-accent" />
                <h3 className="text-lg font-semibold text-foreground">💪 Strengths</h3>
              </div>
              <div className="bg-accent/5 border border-accent/20 rounded-lg p-4 space-y-2">
                <p className="text-sm text-foreground">
                  ✅ <strong>High Comment Engagement:</strong> Your videos average 122 comments per post—18% above competitor median. This indicates strong community connection. Leverage this for collaboration opportunities and user-generated content campaigns.
                </p>
                <p className="text-sm text-foreground">
                  ✅ <strong>Emotional Hooks:</strong> Your "Emotional Story" hook type resonates well, achieving 87% virality. This is your signature strength.
                </p>
              </div>
            </section>

            {/* Weaknesses */}
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <h3 className="text-lg font-semibold text-foreground">⚠️ Weaknesses</h3>
              </div>
              <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4 space-y-2">
                <p className="text-sm text-foreground">
                  ⚠️ <strong>Low Repost Rate:</strong> Your reposts average 99 per video—35% below top competitors. Add clear CTAs ("Share this with someone who needs to hear it") to boost viral spread.
                </p>
                <p className="text-sm text-foreground">
                  ⚠️ <strong>Posting Frequency Gap:</strong> You post 2.3 videos/day vs. top competitors' 8-10/day. This limits your reach potential by 77%.
                </p>
              </div>
            </section>

            {/* Opportunities */}
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">🎯 Opportunities</h3>
              </div>
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-3">
                <div>
                  <p className="text-sm text-foreground mb-2">
                    🚀 <strong>Trending: 15-Second Short-Form Videos</strong> — Competitor @topcompetitor gained 5.2% followers using sub-15s hooks. Your avg duration is 28s.
                  </p>
                  <Button variant="outline" size="sm" className="w-full border-primary/30 hover:bg-primary/10">
                    🎬 Regenerate 5 Short-Form Script Variants
                  </Button>
                </div>
                <div>
                  <p className="text-sm text-foreground mb-2">
                    📱 <strong>TikTok Growth Potential</strong> — Your TikTok ER is 8.1% vs. competitor avg of 12.1%. Platform-specific hooks could close this 33% gap.
                  </p>
                  <Button variant="outline" size="sm" className="w-full border-primary/30 hover:bg-primary/10">
                    ✨ Generate TikTok-Optimized Hooks
                  </Button>
                </div>
                <div>
                  <p className="text-sm text-foreground mb-2">
                    🔥 <strong>Question Hook Trend</strong> — @topcompetitor's "Question Hook" achieves 92% virality. Test 3 A/B variants in your niche.
                  </p>
                  <Button variant="outline" size="sm" className="w-full border-primary/30 hover:bg-primary/10">
                    💡 Create Question Hook Variants
                  </Button>
                </div>
              </div>
            </section>

            {/* Threats */}
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-destructive" />
                <h3 className="text-lg font-semibold text-foreground">⚡ Threats</h3>
              </div>
              <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4 space-y-2">
                <p className="text-sm text-foreground">
                  🔴 <strong>Competitor Volume Advantage:</strong> @topcompetitor posts 10x more than you—risking audience fatigue toward their content but also expanding their reach faster. Counter with quality-over-quantity and strategic timing.
                </p>
                <p className="text-sm text-foreground">
                  🔴 <strong>Platform Algorithm Shifts:</strong> Instagram prioritizes Reels under 15s. Your current format may lose visibility if not adapted.
                </p>
              </div>
            </section>

            {/* Action Plan */}
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">📋 90-Day Action Plan</h3>
              </div>
              <div className="bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-lg p-5 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-start gap-3">
                    <Badge className="bg-primary/10 text-primary">Week 1-2</Badge>
                    <p className="text-sm text-foreground flex-1">
                      A/B test 3 short-form (≤15s) variants of your top emotional story. Track virality vs. current 28s format.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge className="bg-primary/10 text-primary">Week 3-4</Badge>
                    <p className="text-sm text-foreground flex-1">
                      Increase posting to 5/day (split test: 3 shorts + 2 long-form). Monitor engagement rate changes.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge className="bg-primary/10 text-primary">Week 5-8</Badge>
                    <p className="text-sm text-foreground flex-1">
                      Launch "Question Hook" campaign on TikTok. Generate 10 variants via AI, post 1/day, measure 12.1% ER target.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge className="bg-primary/10 text-primary">Week 9-12</Badge>
                    <p className="text-sm text-foreground flex-1">
                      Collaboration push: Use high comment engagement to partner with 2-3 micro-influencers in your niche for cross-promotion.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </ScrollArea>

        <div className="flex gap-3 pt-4 border-t border-border">
          <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button className="flex-1 gap-2">
            <Download className="w-4 h-4" />
            Export as PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
