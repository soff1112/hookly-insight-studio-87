import { Button } from "@/components/ui/button";

type Period = "24h" | "48h" | "7days";

interface PeriodFilterProps {
  activePeriod: Period;
  onChange: (period: Period) => void;
}

export const PeriodFilter = ({ activePeriod, onChange }: PeriodFilterProps) => {
  const periods: { value: Period; label: string }[] = [
    { value: "24h", label: "24h" },
    { value: "48h", label: "48h" },
    { value: "7days", label: "7 days" },
  ];

  return (
    <div className="flex gap-2">
      {periods.map((period) => (
        <Button
          key={period.value}
          variant={activePeriod === period.value ? "default" : "outline"}
          size="sm"
          onClick={() => onChange(period.value)}
          className={`transition-all duration-300 ${
            activePeriod === period.value
              ? "border-b-2 border-primary rounded-b-none"
              : ""
          }`}
        >
          {period.label}
        </Button>
      ))}
    </div>
  );
};
