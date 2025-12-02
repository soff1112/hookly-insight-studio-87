import { DashboardCard } from "./DashboardCard";
import { LucideIcon } from "lucide-react";

interface MiniLessonCardProps {
  title: string;
  duration: string;
  icon: LucideIcon;
}

export const MiniLessonCard = ({ title, duration, icon: Icon }: MiniLessonCardProps) => {
  return (
    <DashboardCard hover className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <div className="flex-1">
        <h3 className="text-sm font-medium text-foreground mb-1">{title}</h3>
        <p className="text-xs text-muted-foreground">{duration}</p>
      </div>
    </DashboardCard>
  );
};
