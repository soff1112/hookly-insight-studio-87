import { ReactNode } from "react";
import { Card } from "@/components/ui/card";

interface DashboardCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export const DashboardCard = ({ children, className = "", hover = false }: DashboardCardProps) => {
  return (
    <Card
      className={`p-6 border-border transition-all duration-300 ${
        hover ? "hover:shadow-card-hover cursor-pointer" : "shadow-card"
      } ${className}`}
    >
      {children}
    </Card>
  );
};
