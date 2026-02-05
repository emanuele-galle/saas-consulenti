"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Smartphone, Monitor } from "lucide-react";

interface PagespeedGaugeProps {
  mobile: number | null;
  desktop: number | null;
  loading?: boolean;
  cached?: boolean;
  checkedAt?: Date | null;
}

function ScoreCircle({
  score,
  label,
  icon: Icon,
}: {
  score: number | null;
  label: string;
  icon: typeof Smartphone;
}) {
  if (score === null) {
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-4 border-muted">
          <span className="text-sm text-muted-foreground">N/A</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Icon className="h-3 w-3" />
          {label}
        </div>
      </div>
    );
  }

  const color =
    score >= 90
      ? "text-emerald-600 border-emerald-500"
      : score >= 50
        ? "text-amber-500 border-amber-400"
        : "text-red-500 border-red-400";

  const circumference = 2 * Math.PI * 34;
  const dashOffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-20 w-20">
        <svg className="h-20 w-20 -rotate-90" viewBox="0 0 80 80">
          <circle
            cx="40"
            cy="40"
            r="34"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="6"
          />
          <circle
            cx="40"
            cy="40"
            r="34"
            fill="none"
            className={cn("transition-all duration-1000", color.split(" ")[1])}
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
          />
        </svg>
        <span
          className={cn(
            "absolute inset-0 flex items-center justify-center text-lg font-bold",
            color.split(" ")[0]
          )}
        >
          {score}
        </span>
      </div>
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <Icon className="h-3 w-3" />
        {label}
      </div>
    </div>
  );
}

export function PagespeedGauge({
  mobile,
  desktop,
  loading,
  checkedAt,
}: PagespeedGaugeProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">PageSpeed</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">PageSpeed Score</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center gap-8">
          <ScoreCircle score={mobile} label="Mobile" icon={Smartphone} />
          <ScoreCircle score={desktop} label="Desktop" icon={Monitor} />
        </div>
        {checkedAt && (
          <p className="mt-3 text-center text-[10px] text-muted-foreground">
            Ultimo check: {new Date(checkedAt).toLocaleDateString("it-IT")}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
