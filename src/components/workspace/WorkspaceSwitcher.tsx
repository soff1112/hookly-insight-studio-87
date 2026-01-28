import { useState } from "react";
import { ChevronDown, Plus, Check, Users, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { PLATFORM_COLORS } from "@/types/workspace";

export const WorkspaceSwitcher = () => {
  const { 
    workspaces, 
    activeWorkspace, 
    setActiveWorkspaceId,
    getUserRanking 
  } = useWorkspace();
  
  const [open, setOpen] = useState(false);
  const ranking = getUserRanking();

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'tiktok': return '🎵';
      case 'youtube': return '📺';
      case 'instagram': return '📸';
      default: return '📊';
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="h-10 px-3 gap-2 bg-card border-border hover:bg-secondary/50 min-w-[200px] justify-between"
        >
          <div className="flex items-center gap-2">
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: 'hsl(var(--primary))' }}
            />
            <span className="font-medium text-foreground truncate max-w-[140px]">
              {activeWorkspace?.name || 'Select Workspace'}
            </span>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="start" 
        className="w-[280px] bg-card border-border z-50"
      >
        {/* Current workspace info */}
        {activeWorkspace && (
          <>
            <div className="px-3 py-2 border-b border-border">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">Current Workspace</span>
                <Badge variant="outline" className="text-xs">
                  {getPlatformIcon(activeWorkspace.mainAccount.platform)} {activeWorkspace.mainAccount.platform}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-foreground">{activeWorkspace.competitors.length} competitors</span>
              </div>
              {ranking.position > 0 && (
                <div className="flex items-center gap-2 text-sm mt-1">
                  <TrendingUp className="w-3.5 h-3.5 text-primary" />
                  <span className="text-foreground">
                    Rank #{ranking.position} of {ranking.total}
                  </span>
                </div>
              )}
            </div>
          </>
        )}

        {/* Workspace list */}
        {workspaces.map((workspace) => (
          <DropdownMenuItem
            key={workspace.id}
            onClick={() => {
              setActiveWorkspaceId(workspace.id);
              setOpen(false);
            }}
            className="flex items-center justify-between px-3 py-2.5 cursor-pointer hover:bg-secondary/50"
          >
            <div className="flex items-center gap-2">
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ 
                  backgroundColor: workspace.id === activeWorkspace?.id 
                    ? 'hsl(var(--primary))' 
                    : 'hsl(var(--muted-foreground))' 
                }}
              />
              <div>
                <div className="font-medium text-foreground">{workspace.name}</div>
                <div className="text-xs text-muted-foreground">
                  {workspace.niche} • {workspace.competitors.length} competitors
                </div>
              </div>
            </div>
            {workspace.id === activeWorkspace?.id && (
              <Check className="w-4 h-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator className="bg-border" />
        
        {/* Create new workspace */}
        <DropdownMenuItem className="flex items-center gap-2 px-3 py-2.5 cursor-pointer hover:bg-secondary/50 text-primary">
          <Plus className="w-4 h-4" />
          <span>Create New Workspace</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
