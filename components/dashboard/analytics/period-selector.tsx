"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type Period = "7d" | "30d" | "90d" | "12m";

const periods: { value: Period; label: string }[] = [
  { value: "7d", label: "7 giorni" },
  { value: "30d", label: "30 giorni" },
  { value: "90d", label: "90 giorni" },
  { value: "12m", label: "12 mesi" },
];

interface PeriodSelectorProps {
  value: Period;
  onChange: (value: Period) => void;
}

export function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
  return (
    <div className="flex gap-1 rounded-lg bg-muted p-1">
      {periods.map((p) => (
        <Button
          key={p.value}
          variant="ghost"
          size="sm"
          className={cn(
            "h-7 text-xs",
            value === p.value && "bg-background shadow-sm"
          )}
          onClick={() => onChange(p.value)}
        >
          {p.label}
        </Button>
      ))}
    </div>
  );
}
