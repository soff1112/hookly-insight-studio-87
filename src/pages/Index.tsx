import { Sidebar } from "@/components/Sidebar";
import { DashboardCard } from "@/components/DashboardCard";
import { MiniLessonCard } from "@/components/MiniLessonCard";
import { CompetitorRankingTable } from "@/components/CompetitorRankingTable";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Search, Sparkles, Video, TrendingUp, EyeOff, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard Panel</h1>
          </div>

          {/* Mini Lessons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MiniLessonCard
              title="Everything you need to know about analyzing competitors in 5 minutes"
              duration="5:00"
              icon={TrendingUp}
            />
            <MiniLessonCard
              title="Everything you need to know about video regeneration in 5 minutes"
              duration="5:00"
              icon={Video}
            />
          </div>

          {/* Main CTA Section */}
          <div className="text-center space-y-6 py-8">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              What can I{" "}
              <span className="text-accent">help you with</span>{" "}
              today?
            </h1>
            
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button variant="outline" size="lg" className="gap-2">
                <Search className="w-5 h-5" />
                Analyze Competitor
              </Button>
              <Button size="lg" className="gap-2 bg-primary hover:bg-primary/90">
                <Sparkles className="w-5 h-5" />
                Find Viral Ideas
              </Button>
              <Button variant="outline" size="lg" className="gap-2">
                <Video className="w-5 h-5" />
                Regenerate My Video
              </Button>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Competitor Ranking */}
            <div className="lg:col-span-2 space-y-6">
              <DashboardCard>
                <CompetitorRankingTable />
                
                {/* Deep Analysis Button */}
                <div className="mt-6 pt-6 border-t border-border">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        size="lg"
                        className="w-full bg-primary hover:bg-primary/90 gap-2 group"
                        onClick={() => navigate("/ai-insights")}
                      >
                        Deep Analysis
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Open full AI-powered performance insights and recommendations</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </DashboardCard>
            </div>

            {/* Right Column - Accounts & Subscription */}
            <div className="space-y-6">
              <DashboardCard>
                <div className="flex items-center gap-3 mb-4">
                  <EyeOff className="w-5 h-5 text-muted-foreground" />
                  <h2 className="text-lg font-semibold text-foreground">My Accounts</h2>
                </div>
                <div className="text-center py-8">
                  <p className="text-muted-foreground">0 connected accounts</p>
                </div>
              </DashboardCard>

              <DashboardCard className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-lg font-semibold text-foreground">Pro Plan</h2>
                      <span className="text-xs text-muted-foreground">Your current plan</span>
                    </div>
                    <div className="text-sm text-muted-foreground mb-3">10 competitor slots</div>
                    <Button variant="outline" size="sm" className="w-full">
                      Change Plan
                    </Button>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-border">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-foreground">Video Regenerations</span>
                        <span className="text-muted-foreground">12/100</span>
                      </div>
                      <Progress value={12} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-foreground">AI Analysis</span>
                        <span className="text-muted-foreground">28/150</span>
                      </div>
                      <Progress value={19} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-foreground">Competitor Slots</span>
                        <span className="text-muted-foreground">7/10</span>
                      </div>
                      <Progress value={70} className="h-2" />
                    </div>
                  </div>
                </div>
              </DashboardCard>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
