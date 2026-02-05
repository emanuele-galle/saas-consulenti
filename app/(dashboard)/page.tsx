"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/lib/trpc";
import { Users, Globe, Eye, Mail, TrendingUp, Percent } from "lucide-react";
import { StatCardEnhanced } from "@/components/dashboard/analytics/stat-card-enhanced";
import { ViewsChart } from "@/components/dashboard/analytics/views-chart";
import { TopConsultantsTable } from "@/components/dashboard/analytics/top-consultants-table";
import { ActivityFeed } from "@/components/dashboard/analytics/activity-feed";
import { PagespeedGauge } from "@/components/dashboard/analytics/pagespeed-gauge";
import { PeriodSelector, type Period } from "@/components/dashboard/analytics/period-selector";

export default function DashboardPage() {
  const { data: session } = useSession();
  const trpc = useTRPC();
  const isAdmin =
    session?.user?.role === "ADMIN" || session?.user?.role === "SUPERADMIN";
  const [period, setPeriod] = useState<Period>("30d");

  // Admin queries
  const { data: adminStats, isLoading: adminLoading } = useQuery({
    ...trpc.analytics.getAdminStats.queryOptions(),
    enabled: isAdmin,
  });

  const { data: viewsData, isLoading: viewsLoading } = useQuery({
    ...trpc.analytics.getViewsTimeSeries.queryOptions({ period }),
    enabled: true,
  });

  const { data: topConsultants, isLoading: topLoading } = useQuery({
    ...trpc.analytics.getTopConsultants.queryOptions({
      limit: 5,
      period: period === "12m" ? "90d" : period,
    }),
    enabled: isAdmin,
  });

  const { data: recentActivity, isLoading: activityLoading } = useQuery({
    ...trpc.analytics.getRecentActivity.queryOptions({ limit: 10 }),
  });

  // Consultant queries
  const { data: consultantStats, isLoading: consultantLoading } = useQuery({
    ...trpc.analytics.getConsultantStats.queryOptions(),
    enabled: !isAdmin,
  });

  // Get consultant's landing page ID for PageSpeed
  const { data: consultant } = useQuery({
    ...trpc.consultants.getByUserId.queryOptions(),
    enabled: !isAdmin,
  });

  const landingPageId = consultant?.landingPage?.id;

  const { data: pagespeed, isLoading: pagespeedLoading } = useQuery({
    ...trpc.analytics.getPageSpeedScore.queryOptions({
      landingPageId: landingPageId ?? "",
    }),
    enabled: !isAdmin && !!landingPageId,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            {isAdmin
              ? "Panoramica della piattaforma Saas Generali"
              : "Le tue statistiche personali"}
          </p>
        </div>
        <PeriodSelector value={period} onChange={setPeriod} />
      </div>

      {isAdmin ? (
        <>
          {/* Row 1: 4x StatCard enhanced */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCardEnhanced
              title="Consulenti"
              value={adminStats?.totalConsultants ?? 0}
              subtitle="Registrati"
              icon={Users}
              loading={adminLoading}
            />
            <StatCardEnhanced
              title="Pagine Pubblicate"
              value={adminStats?.publishedPages ?? 0}
              subtitle="Landing page attive"
              icon={Globe}
              loading={adminLoading}
            />
            <StatCardEnhanced
              title="Visite Totali"
              value={adminStats?.totalViews ?? 0}
              trend={adminStats?.viewsTrend}
              subtitle="vs mese precedente"
              icon={Eye}
              loading={adminLoading}
            />
            <StatCardEnhanced
              title="Richieste Contatto"
              value={adminStats?.submissionsThisMonth ?? 0}
              trend={adminStats?.submissionsTrend}
              subtitle={`${adminStats?.unreadSubmissions ?? 0} non lette`}
              icon={Mail}
              loading={adminLoading}
            />
          </div>

          {/* Row 2: Views Chart + Top Consultants */}
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ViewsChart
                data={viewsData ?? []}
                loading={viewsLoading}
              />
            </div>
            <TopConsultantsTable
              data={topConsultants ?? []}
              loading={topLoading}
            />
          </div>

          {/* Row 3: Activity Feed */}
          <ActivityFeed
            data={recentActivity ?? []}
            loading={activityLoading}
          />
        </>
      ) : (
        <>
          {/* Consultant: Row 1: 3x StatCard */}
          <div className="grid gap-4 md:grid-cols-3">
            <StatCardEnhanced
              title="Visite"
              value={consultantStats?.views ?? 0}
              subtitle={`${consultantStats?.viewsThisWeek ?? 0} questa settimana`}
              icon={Eye}
              loading={consultantLoading}
            />
            <StatCardEnhanced
              title="Richieste Contatto"
              value={consultantStats?.submissions ?? 0}
              subtitle={`${consultantStats?.submissionsThisWeek ?? 0} questa settimana`}
              icon={Mail}
              loading={consultantLoading}
            />
            <StatCardEnhanced
              title="Conversione"
              value={`${consultantStats?.conversionRate ?? 0}%`}
              subtitle="Visite / Contatti"
              icon={Percent}
              loading={consultantLoading}
            />
          </div>

          {/* Consultant: Row 2: Views Chart full-width */}
          <ViewsChart
            data={viewsData ?? []}
            loading={viewsLoading}
          />

          {/* Consultant: Row 3: PageSpeed + Activity */}
          <div className="grid gap-4 lg:grid-cols-3">
            <PagespeedGauge
              mobile={pagespeed?.mobile ?? null}
              desktop={pagespeed?.desktop ?? null}
              loading={pagespeedLoading}
              checkedAt={pagespeed?.checkedAt}
            />
            <div className="lg:col-span-2">
              <ActivityFeed
                data={recentActivity ?? []}
                loading={activityLoading}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
