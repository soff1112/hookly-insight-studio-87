import { Badge } from "@/components/ui/badge";

interface DataScopeChipProps {
  timeRange?: string;
  accounts?: number;
  posts?: number;
  videos?: number;
  competitors?: number;
  className?: string;
}

export const DataScopeChip = ({
  timeRange,
  accounts,
  posts,
  videos,
  competitors,
  className
}: DataScopeChipProps) => {
  const parts: string[] = [];
  
  if (timeRange) parts.push(timeRange);
  if (accounts) parts.push(`${accounts} accounts`);
  if (competitors) parts.push(`${competitors} competitors`);
  if (posts) parts.push(`${posts} posts`);
  if (videos) parts.push(`${videos} videos`);

  if (parts.length === 0) return null;

  return (
    <Badge 
      variant="secondary" 
      className={`text-[10px] px-2 py-0.5 bg-muted/50 text-muted-foreground font-normal ${className || ''}`}
    >
      {parts.join(" • ")}
    </Badge>
  );
};
