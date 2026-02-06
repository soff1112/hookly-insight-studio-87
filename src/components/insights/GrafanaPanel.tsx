import { ReactNode, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  MoreVertical, 
  Maximize2, 
  Download, 
  Link2, 
  ArrowLeft,
  LucideIcon,
} from "lucide-react";
import { useInsightsFilters } from "@/contexts/InsightsFilterContext";
import { toast } from "@/hooks/use-toast";

interface GrafanaPanelProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  panelId: string;
  children: ReactNode;
  onExportCSV?: () => string[][];
  className?: string;
  fullHeight?: boolean;
}

export const GrafanaPanel = ({
  title,
  subtitle,
  icon: Icon,
  panelId,
  children,
  onExportCSV,
  className = "",
  fullHeight = false,
}: GrafanaPanelProps) => {
  const [isViewMode, setIsViewMode] = useState(false);
  const { filters, getTimeRangeLabel } = useInsightsFilters();

  const handleCopyLink = () => {
    const url = new URL(window.location.href);
    url.searchParams.set("panel", panelId);
    navigator.clipboard.writeText(url.toString());
    toast({
      title: "Link copied",
      description: "Panel link has been copied to clipboard",
    });
  };

  const handleExportCSV = () => {
    if (!onExportCSV) return;
    
    const data = onExportCSV();
    if (data.length === 0) {
      toast({
        title: "No data to export",
        description: "There is no data available for the current filters",
        variant: "destructive",
      });
      return;
    }

    const csvContent = data.map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `${panelId}-${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export complete",
      description: `${panelId}.csv has been downloaded`,
    });
  };

  const panelContent = (
    <Card className={`${className} ${fullHeight ? "h-full" : ""}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="p-2 rounded-lg bg-primary/10">
                <Icon className="w-5 h-5 text-primary" />
              </div>
            )}
            <div>
              <CardTitle className="text-lg">{title}</CardTitle>
              {subtitle && (
                <CardDescription>{subtitle}</CardDescription>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsViewMode(true)}>
                  <Maximize2 className="mr-2 h-4 w-4" />
                  View panel
                </DropdownMenuItem>
                {onExportCSV && (
                  <DropdownMenuItem onClick={handleExportCSV}>
                    <Download className="mr-2 h-4 w-4" />
                    Export CSV
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleCopyLink}>
                  <Link2 className="mr-2 h-4 w-4" />
                  Copy link to panel
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className={fullHeight ? "flex-1" : ""}>
        {children}
      </CardContent>
    </Card>
  );

  return (
    <>
      {panelContent}
      
      <Dialog open={isViewMode} onOpenChange={setIsViewMode}>
        <DialogContent className="max-w-[95vw] w-full max-h-[95vh] h-full flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsViewMode(false)}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to dashboard
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {getTimeRangeLabel()} • {filters.platforms.join(", ")}
                </span>
                {onExportCSV && (
                  <Button variant="outline" size="sm" onClick={handleExportCSV}>
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                )}
              </div>
            </div>
            <DialogTitle className="flex items-center gap-2 mt-4">
              {Icon && <Icon className="h-5 w-5 text-primary" />}
              {title}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-auto mt-4">
            {children}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
