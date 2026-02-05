"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye, Mail, Percent } from "lucide-react";

interface TopConsultant {
  id: string;
  name: string;
  profileImage: string | null;
  role: string;
  slug: string;
  views: number;
  submissions: number;
  conversionRate: number;
}

interface TopConsultantsTableProps {
  data: TopConsultant[];
  loading?: boolean;
}

export function TopConsultantsTable({
  data,
  loading,
}: TopConsultantsTableProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Top Consulenti</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Top Consulenti</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Nessun dato disponibile
          </p>
        ) : (
          <div className="space-y-3">
            {data.map((c, index) => (
              <div
                key={c.id}
                className="flex items-center gap-3 rounded-lg border p-3"
              >
                <span className="w-5 text-center text-xs font-bold text-muted-foreground">
                  {index + 1}
                </span>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={c.profileImage ?? undefined} />
                  <AvatarFallback className="text-xs">
                    {c.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{c.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {c.role}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {c.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {c.submissions}
                  </span>
                  <span className="flex items-center gap-1">
                    <Percent className="h-3 w-3" />
                    {c.conversionRate}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
