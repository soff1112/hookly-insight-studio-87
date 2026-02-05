import { ChevronDown, Folder, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useProject } from "@/contexts/ProjectContext";

export const ProjectAccountSelector = () => {
  const {
    projects,
    selectedProjectId,
    selectedAccountId,
    setSelectedProjectId,
    setSelectedAccountId,
    getSelectedProject,
    getSelectedAccount,
    getFilteredAccounts,
  } = useProject();

  const selectedProject = getSelectedProject();
  const selectedAccount = getSelectedAccount();
  const filteredAccounts = getFilteredAccounts();

  const handleProjectSelect = (projectId: string | null) => {
    setSelectedProjectId(projectId);
    setSelectedAccountId(null);
  };

  const handleAccountSelect = (accountId: string | null) => {
    setSelectedAccountId(accountId);
  };

  return (
    <div className="flex items-center gap-2 p-4 bg-card rounded-xl border border-border shadow-card">
      {/* Project Selector */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="min-w-[180px] justify-between gap-2 bg-primary/5 border-primary/20 hover:bg-primary/10 hover:border-primary/30"
          >
            <div className="flex items-center gap-2">
              <Folder className="h-4 w-4 text-primary" />
              <span className="font-medium">
                {selectedProject ? selectedProject.name : "All Projects"}
              </span>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[200px] bg-popover">
          <DropdownMenuItem
            onClick={() => handleProjectSelect(null)}
            className={!selectedProjectId ? "bg-primary/10 text-primary" : ""}
          >
            <Folder className="h-4 w-4 mr-2" />
            All Projects
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {projects.map((project) => (
            <DropdownMenuItem
              key={project.id}
              onClick={() => handleProjectSelect(project.id)}
              className={selectedProjectId === project.id ? "bg-primary/10 text-primary" : ""}
            >
              <div
                className="h-3 w-3 rounded-full mr-2"
                style={{ backgroundColor: project.color }}
              />
              {project.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <span className="text-muted-foreground">→</span>

      {/* Account Selector */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="min-w-[180px] justify-between gap-2 bg-primary/5 border-primary/20 hover:bg-primary/10 hover:border-primary/30"
          >
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              <span className="font-medium">
                {selectedAccount ? selectedAccount.handle : "All Accounts"}
              </span>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[200px] bg-popover">
          <DropdownMenuItem
            onClick={() => handleAccountSelect(null)}
            className={!selectedAccountId ? "bg-primary/10 text-primary" : ""}
          >
            <User className="h-4 w-4 mr-2" />
            All Accounts
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {filteredAccounts.map((account) => (
            <DropdownMenuItem
              key={account.id}
              onClick={() => handleAccountSelect(account.id)}
              className={selectedAccountId === account.id ? "bg-primary/10 text-primary" : ""}
            >
              <span className="font-mono text-sm">{account.handle}</span>
              <span className="ml-auto text-xs text-muted-foreground">{account.platform}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
