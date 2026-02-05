"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Mail, Globe, Circle } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

interface Activity {
  type: "submission" | "publication";
  id: string;
  date: Date;
  title: string;
  subtitle: string;
  isRead: boolean;
}

interface ActivityFeedProps {
  data: Activity[];
  loading?: boolean;
}

export function ActivityFeed({ data, loading }: ActivityFeedProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Attivita Recenti</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Attivita Recenti</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Nessuna attivita recente
          </p>
        ) : (
          <div className="space-y-1">
            {data.map((activity) => (
              <div
                key={`${activity.type}-${activity.id}`}
                className="flex items-start gap-3 rounded-lg p-3 hover:bg-muted/50 transition-colors"
              >
                <div className="mt-0.5 rounded-lg bg-muted p-2">
                  {activity.type === "submission" ? (
                    <Mail className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Globe className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium">
                      {activity.title}
                    </p>
                    {!activity.isRead && (
                      <Circle className="h-2 w-2 fill-primary text-primary shrink-0" />
                    )}
                  </div>
                  <p className="truncate text-xs text-muted-foreground">
                    {activity.subtitle}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {formatDateTime(activity.date)}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
