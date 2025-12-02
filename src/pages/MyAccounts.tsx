import { Sidebar } from "@/components/Sidebar";
import { ProjectAccountSelector } from "@/components/ProjectAccountSelector";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Users, Plus, Instagram, Music2, Youtube } from "lucide-react";
import { useProject } from "@/contexts/ProjectContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const getPlatformIcon = (platform: string) => {
  switch (platform) {
    case "Instagram":
      return Instagram;
    case "TikTok":
      return Music2;
    case "YouTube":
      return Youtube;
    default:
      return Users;
  }
};

const MyAccounts = () => {
  const { projects, setSelectedProjectId, setSelectedAccountId } = useProject();
  const navigate = useNavigate();
  const [openProjects, setOpenProjects] = useState<string[]>(projects.map((p) => p.id));

  const toggleProject = (projectId: string) => {
    setOpenProjects((prev) =>
      prev.includes(projectId)
        ? prev.filter((id) => id !== projectId)
        : [...prev, projectId]
    );
  };

  const handleViewCompetitors = (projectId: string, accountId: string) => {
    setSelectedProjectId(projectId);
    setSelectedAccountId(accountId);
    navigate("/competitor-analysis");
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Users className="h-8 w-8 text-primary" />
              My Accounts
            </h1>
            <p className="text-lg text-muted-foreground">
              Manage your social media accounts organized by project
            </p>
          </div>

          {/* Project Selector */}
          <ProjectAccountSelector />

          {/* Add Project Button */}
          <Button className="bg-primary hover:bg-primary/90 gap-2">
            <Plus className="h-4 w-4" />
            Add New Project
          </Button>

          {/* Projects List */}
          <div className="space-y-4">
            {projects.map((project) => (
              <Card key={project.id} className="border-border shadow-card overflow-hidden">
                <Collapsible
                  open={openProjects.includes(project.id)}
                  onOpenChange={() => toggleProject(project.id)}
                >
                  <CollapsibleTrigger className="w-full">
                    <div className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: project.color }}
                        />
                        <span className="text-lg font-semibold text-foreground">
                          Project: {project.name}
                        </span>
                        <Badge variant="secondary" className="bg-primary/10 text-primary">
                          {project.accounts.length} accounts
                        </Badge>
                      </div>
                      <ChevronDown
                        className={`h-5 w-5 text-muted-foreground transition-transform ${
                          openProjects.includes(project.id) ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <div className="border-t border-border">
                      {project.accounts.map((account) => {
                        const PlatformIcon = getPlatformIcon(account.platform);
                        return (
                          <div
                            key={account.id}
                            className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors border-b border-border last:border-b-0"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                                <PlatformIcon className="h-5 w-5 text-muted-foreground" />
                              </div>
                              <div>
                                <div className="font-medium text-foreground">
                                  {account.handle}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {account.platform}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-4">
                              <Badge
                                variant="secondary"
                                className={
                                  account.status === "Active"
                                    ? "bg-green-500/10 text-green-600"
                                    : "bg-yellow-500/10 text-yellow-600"
                                }
                              >
                                {account.status}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                Competitors: {account.competitorCount}
                              </span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewCompetitors(project.id, account.id)}
                                className="border-primary/20 text-primary hover:bg-primary/10"
                              >
                                View
                              </Button>
                            </div>
                          </div>
                        );
                      })}

                      {/* Add Account Button */}
                      <div className="p-4 bg-muted/30">
                        <Button variant="ghost" className="w-full gap-2 text-muted-foreground hover:text-foreground">
                          <Plus className="h-4 w-4" />
                          Add Account to {project.name}
                        </Button>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyAccounts;
