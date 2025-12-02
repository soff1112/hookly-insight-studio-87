import { createContext, useContext, useState, ReactNode } from "react";

export interface Account {
  id: string;
  handle: string;
  platform: "Instagram" | "TikTok" | "YouTube";
  status: "Active" | "Paused";
  competitorCount: number;
}

export interface Project {
  id: string;
  name: string;
  color: string;
  accounts: Account[];
}

interface ProjectContextType {
  projects: Project[];
  selectedProjectId: string | null;
  selectedAccountId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  setSelectedAccountId: (id: string | null) => void;
  getSelectedProject: () => Project | null;
  getSelectedAccount: () => Account | null;
  getFilteredAccounts: () => Account[];
}

const mockProjects: Project[] = [
  {
    id: "1",
    name: "Yoga Studio",
    color: "#8B5CF6",
    accounts: [
      { id: "1a", handle: "@yoga_ig", platform: "Instagram", status: "Active", competitorCount: 8 },
      { id: "1b", handle: "@yoga_tt", platform: "TikTok", status: "Paused", competitorCount: 5 },
    ],
  },
  {
    id: "2",
    name: "Crypto Blog",
    color: "#F59E0B",
    accounts: [
      { id: "2a", handle: "@crypto_tt", platform: "TikTok", status: "Active", competitorCount: 12 },
    ],
  },
  {
    id: "3",
    name: "Beauty Brand",
    color: "#EC4899",
    accounts: [
      { id: "3a", handle: "@beauty_ig", platform: "Instagram", status: "Active", competitorCount: 15 },
      { id: "3b", handle: "@beauty_tt", platform: "TikTok", status: "Active", competitorCount: 10 },
      { id: "3c", handle: "@beauty_yt", platform: "YouTube", status: "Paused", competitorCount: 6 },
    ],
  },
  {
    id: "4",
    name: "Fitness Coach",
    color: "#10B981",
    accounts: [
      { id: "4a", handle: "@fitness_ig", platform: "Instagram", status: "Active", competitorCount: 9 },
    ],
  },
];

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const [projects] = useState<Project[]>(mockProjects);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);

  const getSelectedProject = () => {
    if (!selectedProjectId) return null;
    return projects.find((p) => p.id === selectedProjectId) || null;
  };

  const getSelectedAccount = () => {
    if (!selectedAccountId) return null;
    for (const project of projects) {
      const account = project.accounts.find((a) => a.id === selectedAccountId);
      if (account) return account;
    }
    return null;
  };

  const getFilteredAccounts = () => {
    if (!selectedProjectId) {
      return projects.flatMap((p) => p.accounts);
    }
    const project = projects.find((p) => p.id === selectedProjectId);
    return project?.accounts || [];
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        selectedProjectId,
        selectedAccountId,
        setSelectedProjectId,
        setSelectedAccountId,
        getSelectedProject,
        getSelectedAccount,
        getFilteredAccounts,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
};
