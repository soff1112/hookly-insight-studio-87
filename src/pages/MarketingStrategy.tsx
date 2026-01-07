import { Sidebar } from "@/components/Sidebar";
import { StrategySessionList } from "@/components/strategy/StrategySessionList";
import { StrategyWorkspace } from "@/components/strategy/StrategyWorkspace";

const MarketingStrategy = () => {
  return (
    <div className="flex min-h-screen bg-background w-full">
      <Sidebar />
      
      <main className="flex-1 flex overflow-hidden">
        <StrategySessionList />
        <StrategyWorkspace />
      </main>
    </div>
  );
};

export default MarketingStrategy;
