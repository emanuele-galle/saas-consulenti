"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/lib/trpc";
import { ViewsChart } from "@/components/dashboard/analytics/views-chart";
import { TopConsultantsTable } from "@/components/dashboard/analytics/top-consultants-table";
import { StatCardEnhanced } from "@/components/dashboard/analytics/stat-card-enhanced";
import { PeriodSelector, type Period } from "@/components/dashboard/analytics/period-selector";
import { Eye, Mail, TrendingUp, Users } from "lucide-react";

export default function AnalyticsPage() {
  const trpc = useTRPC();
  const [period, setPeriod] = useState<Period>("30d");

  const { data: adminStats, isLoading: statsLoading } = useQuery(
    trpc.analytics.getAdminStats.queryOptions()
  );

  const { data: viewsData, isLoading: viewsLoading } = useQuery(
    trpc.analytics.getViewsTimeSeries.queryOptions({ period })
  );

  const { data: topByViews, isLoading: topViewsLoading } = useQuery(
    trpc.analytics.getTopConsultants.queryOptions({
      limit: 10,
      period: period === "12m" ? "90d" : period,
      sortBy: "views",
    })
  );

  const { data: topBySubmissions, isLoading: topSubsLoading } = useQuery(
    trpc.analytics.getTopConsultants.queryOptions({
      limit: 10,
      period: period === "12m" ? "90d" : period,
      sortBy: "submissions",
    })
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Analisi dettagliata delle performance della piattaforma
          </p>
        </div>
        <PeriodSelector value={period} onChange={setPeriod} />
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCardEnhanced
          title="Visite Totali"
          value={adminStats?.totalViews ?? 0}
          trend={adminStats?.viewsTrend}
          subtitle="vs mese precedente"
          icon={Eye}
          loading={statsLoading}
        />
        <StatCardEnhanced
          title="Richieste Mese"
          value={adminStats?.submissionsThisMonth ?? 0}
          trend={adminStats?.submissionsTrend}
          subtitle="vs mese precedente"
          icon={Mail}
          loading={statsLoading}
        />
        <StatCardEnhanced
          title="Non Lette"
          value={adminStats?.unreadSubmissions ?? 0}
          subtitle="richieste da leggere"
          icon={TrendingUp}
          loading={statsLoading}
        />
        <StatCardEnhanced
          title="Consulenti Attivi"
          value={adminStats?.publishedPages ?? 0}
          subtitle="pagine pubblicate"
          icon={Users}
          loading={statsLoading}
        />
      </div>

      {/* Views Chart */}
      <ViewsChart
        data={viewsData ?? []}
        loading={viewsLoading}
        title="Andamento Visite"
      />

      {/* Top Consultants side by side */}
      <div className="grid gap-4 lg:grid-cols-2">
        <TopConsultantsTable
          data={topByViews ?? []}
          loading={topViewsLoading}
        />
        <TopConsultantsTable
          data={topBySubmissions ?? []}
          loading={topSubsLoading}
        />
      </div>
    </div>
  );
}
