import { useState } from "react";
import { Check, ChevronDown, Search, X, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useWorkspace } from "@/contexts/WorkspaceContext";

export const CompetitorSelector = () => {
  const { 
    activeWorkspace,
    selectedCompetitorIds, 
    setSelectedCompetitorIds,
    topNCompetitors,
    setTopNCompetitors
  } = useWorkspace();
  
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  if (!activeWorkspace) return null;

  const competitors = activeWorkspace.competitors;
  const filteredCompetitors = competitors.filter(c => 
    c.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectAll = () => {
    setSelectedCompetitorIds(competitors.map(c => c.id));
  };

  const handleClearAll = () => {
    setSelectedCompetitorIds([]);
  };

  const handleToggle = (id: string) => {
    if (selectedCompetitorIds.includes(id)) {
      setSelectedCompetitorIds(selectedCompetitorIds.filter(cid => cid !== id));
    } else {
      setSelectedCompetitorIds([...selectedCompetitorIds, id]);
    }
  };

  const handlePreset = (n: number) => {
    const topN = [...competitors]
      .sort((a, b) => b.metrics.engagementRate - a.metrics.engagementRate)
      .slice(0, n)
      .map(c => c.id);
    setSelectedCompetitorIds(topN);
    setTopNCompetitors(n);
  };

  const selectedCount = selectedCompetitorIds.length || topNCompetitors;
  const displayText = selectedCompetitorIds.length > 0 
    ? `${selectedCompetitorIds.length} selected`
    : `Top ${topNCompetitors}`;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className="h-9 px-3 gap-2 bg-card border-border hover:bg-secondary/50"
        >
          <Users className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm">{displayText}</span>
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      
      <PopoverContent 
        className="w-[320px] p-0 bg-card border-border z-50" 
        align="start"
      >
        {/* Search */}
        <div className="p-3 border-b border-border">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search competitors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-8 bg-secondary/30 border-border"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                <X className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
              </button>
            )}
          </div>
        </div>

        {/* Presets */}
        <div className="p-3 border-b border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">Quick Select</span>
            <span className="text-xs text-muted-foreground">
              {selectedCount} of {competitors.length}
            </span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {[5, 10, 15, 20].map((n) => (
              <Badge
                key={n}
                variant={topNCompetitors === n && selectedCompetitorIds.length === 0 ? "default" : "secondary"}
                className="cursor-pointer hover:bg-primary/80"
                onClick={() => handlePreset(n)}
              >
                Top {n}
              </Badge>
            ))}
            <Badge
              variant="outline"
              className="cursor-pointer hover:bg-secondary/50"
              onClick={handleSelectAll}
            >
              All
            </Badge>
            <Badge
              variant="outline"
              className="cursor-pointer hover:bg-secondary/50"
              onClick={handleClearAll}
            >
              Clear
            </Badge>
          </div>
        </div>

        {/* Competitor list */}
        <ScrollArea className="h-[240px]">
          <div className="p-2">
            {filteredCompetitors.map((competitor) => {
              const isSelected = selectedCompetitorIds.includes(competitor.id);
              
              return (
                <div
                  key={competitor.id}
                  onClick={() => handleToggle(competitor.id)}
                  className="flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-secondary/50"
                >
                  <Checkbox 
                    checked={isSelected}
                    className="border-muted-foreground"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground truncate">
                        {competitor.displayName}
                      </span>
                      <Badge variant="outline" className="text-[10px] px-1.5">
                        {competitor.platform}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {competitor.handle}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-semibold text-foreground">
                      {competitor.metrics.engagementRate.toFixed(1)}%
                    </div>
                    <div className="text-xs text-muted-foreground">ER</div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
