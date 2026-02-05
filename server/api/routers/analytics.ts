import { z } from "zod";
import {
  createTRPCRouter,
  adminProcedure,
  protectedProcedure,
} from "@/server/api/trpc";

export const analyticsRouter = createTRPCRouter({
  getAdminStats: adminProcedure.query(async ({ ctx }) => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [
      totalConsultants,
      publishedPages,
      viewsResult,
      submissionsTotal,
      submissionsThisMonth,
      submissionsLastMonth,
      viewsThisMonth,
      viewsLastMonth,
      unreadSubmissions,
    ] = await Promise.all([
      ctx.db.consultant.count(),
      ctx.db.landingPage.count({ where: { status: "PUBLISHED" } }),
      ctx.db.landingPage.aggregate({ _sum: { views: true } }),
      ctx.db.contactSubmission.count(),
      ctx.db.contactSubmission.count({
        where: { createdAt: { gte: startOfMonth } },
      }),
      ctx.db.contactSubmission.count({
        where: {
          createdAt: { gte: startOfLastMonth, lt: startOfMonth },
        },
      }),
      ctx.db.pageView.aggregate({
        _sum: { views: true },
        where: { date: { gte: startOfMonth } },
      }),
      ctx.db.pageView.aggregate({
        _sum: { views: true },
        where: { date: { gte: startOfLastMonth, lt: startOfMonth } },
      }),
      ctx.db.contactSubmission.count({
        where: { isRead: false },
      }),
    ]);

    const viewsThisMonthTotal = viewsThisMonth._sum.views ?? 0;
    const viewsLastMonthTotal = viewsLastMonth._sum.views ?? 0;
    const viewsTrend =
      viewsLastMonthTotal > 0
        ? Math.round(
            ((viewsThisMonthTotal - viewsLastMonthTotal) /
              viewsLastMonthTotal) *
              100
          )
        : viewsThisMonthTotal > 0
          ? 100
          : 0;

    const submissionsTrend =
      submissionsLastMonth > 0
        ? Math.round(
            ((submissionsThisMonth - submissionsLastMonth) /
              submissionsLastMonth) *
              100
          )
        : submissionsThisMonth > 0
          ? 100
          : 0;

    return {
      totalConsultants,
      publishedPages,
      totalViews: viewsResult._sum.views ?? 0,
      submissionsTotal,
      submissionsThisMonth,
      unreadSubmissions,
      viewsTrend,
      submissionsTrend,
    };
  }),

  getConsultantStats: protectedProcedure.query(async ({ ctx }) => {
    const consultant = await ctx.db.consultant.findUnique({
      where: { userId: ctx.user.id },
      select: {
        id: true,
        landingPage: {
          select: {
            id: true,
            views: true,
            _count: { select: { contactSubmissions: true } },
          },
        },
      },
    });

    if (!consultant?.landingPage) {
      return {
        views: 0,
        submissions: 0,
        viewsThisWeek: 0,
        submissionsThisWeek: 0,
        conversionRate: 0,
      };
    }

    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const [viewsThisWeek, submissionsThisWeek] = await Promise.all([
      ctx.db.pageView.aggregate({
        _sum: { views: true },
        where: {
          landingPageId: consultant.landingPage.id,
          date: { gte: startOfWeek },
        },
      }),
      ctx.db.contactSubmission.count({
        where: {
          landingPageId: consultant.landingPage.id,
          createdAt: { gte: startOfWeek },
        },
      }),
    ]);

    const totalViews = consultant.landingPage.views;
    const totalSubmissions =
      consultant.landingPage._count.contactSubmissions;
    const conversionRate =
      totalViews > 0
        ? Math.round((totalSubmissions / totalViews) * 10000) / 100
        : 0;

    return {
      views: totalViews,
      submissions: totalSubmissions,
      viewsThisWeek: viewsThisWeek._sum.views ?? 0,
      submissionsThisWeek,
      conversionRate,
    };
  }),

  getViewsTimeSeries: protectedProcedure
    .input(
      z.object({
        period: z.enum(["7d", "30d", "90d", "12m"]),
        landingPageId: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const now = new Date();
      let startDate: Date;
      let groupBy: "day" | "week" | "month";

      switch (input.period) {
        case "7d":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          groupBy = "day";
          break;
        case "30d":
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          groupBy = "day";
          break;
        case "90d":
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          groupBy = "week";
          break;
        case "12m":
          startDate = new Date(
            now.getFullYear() - 1,
            now.getMonth(),
            1
          );
          groupBy = "month";
          break;
      }
      startDate.setHours(0, 0, 0, 0);

      // Build where clause
      const where: Record<string, unknown> = {
        date: { gte: startDate },
      };

      // If consultant, restrict to their landing page
      if (ctx.user.role === "CONSULTANT") {
        const consultant = await ctx.db.consultant.findUnique({
          where: { userId: ctx.user.id },
          select: { landingPage: { select: { id: true } } },
        });
        if (!consultant?.landingPage) return [];
        where.landingPageId = consultant.landingPage.id;
      } else if (input.landingPageId) {
        where.landingPageId = input.landingPageId;
      }

      const pageViews = await ctx.db.pageView.findMany({
        where,
        orderBy: { date: "asc" },
      });

      // Group data
      if (groupBy === "day") {
        return pageViews.map((pv) => ({
          date: pv.date.toISOString().split("T")[0],
          views: pv.views,
        }));
      }

      const grouped = new Map<string, number>();

      for (const pv of pageViews) {
        let key: string;
        if (groupBy === "week") {
          const d = new Date(pv.date);
          const day = d.getDay();
          const diff = d.getDate() - day;
          const weekStart = new Date(d.setDate(diff));
          key = weekStart.toISOString().split("T")[0]!;
        } else {
          key = `${pv.date.getFullYear()}-${String(pv.date.getMonth() + 1).padStart(2, "0")}`;
        }
        grouped.set(key, (grouped.get(key) ?? 0) + pv.views);
      }

      return Array.from(grouped.entries()).map(([date, views]) => ({
        date,
        views,
      }));
    }),

  getTopConsultants: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(20).default(10),
        period: z.enum(["7d", "30d", "90d", "all"]).default("30d"),
        sortBy: z.enum(["views", "submissions"]).default("views"),
      })
    )
    .query(async ({ ctx, input }) => {
      const now = new Date();
      let startDate: Date | null = null;

      if (input.period !== "all") {
        const days =
          input.period === "7d" ? 7 : input.period === "30d" ? 30 : 90;
        startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
        startDate.setHours(0, 0, 0, 0);
      }

      const consultants = await ctx.db.consultant.findMany({
        where: {
          landingPage: { status: "PUBLISHED" },
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          profileImage: true,
          role: true,
          landingPage: {
            select: {
              id: true,
              slug: true,
              views: true,
              pageViews: startDate
                ? {
                    where: { date: { gte: startDate } },
                    select: { views: true },
                  }
                : { select: { views: true } },
              _count: {
                select: {
                  contactSubmissions: startDate
                    ? { where: { createdAt: { gte: startDate } } }
                    : true,
                },
              },
            },
          },
        },
      });

      const mapped = consultants
        .filter((c) => c.landingPage)
        .map((c) => {
          const lp = c.landingPage!;
          const periodViews = startDate
            ? lp.pageViews.reduce((sum, pv) => sum + pv.views, 0)
            : lp.views;
          const periodSubmissions = lp._count.contactSubmissions;
          return {
            id: c.id,
            name: `${c.firstName} ${c.lastName}`,
            profileImage: c.profileImage,
            role: c.role,
            slug: lp.slug,
            views: periodViews,
            submissions: periodSubmissions,
            conversionRate:
              periodViews > 0
                ? Math.round((periodSubmissions / periodViews) * 10000) /
                  100
                : 0,
          };
        });

      mapped.sort((a, b) =>
        input.sortBy === "views"
          ? b.views - a.views
          : b.submissions - a.submissions
      );

      return mapped.slice(0, input.limit);
    }),

  getRecentActivity: protectedProcedure
    .input(z.object({ limit: z.number().min(1).max(50).default(10) }))
    .query(async ({ ctx, input }) => {
      const isAdmin =
        ctx.user.role === "ADMIN" || ctx.user.role === "SUPERADMIN";

      let landingPageWhere: Record<string, unknown> = {};
      if (!isAdmin) {
        const consultant = await ctx.db.consultant.findUnique({
          where: { userId: ctx.user.id },
          select: { landingPage: { select: { id: true } } },
        });
        if (!consultant?.landingPage) return [];
        landingPageWhere = {
          landingPageId: consultant.landingPage.id,
        };
      }

      const [recentSubmissions, recentPublications] = await Promise.all([
        ctx.db.contactSubmission.findMany({
          where: landingPageWhere,
          include: {
            landingPage: {
              include: {
                consultant: {
                  select: { firstName: true, lastName: true },
                },
              },
            },
          },
          orderBy: { createdAt: "desc" },
          take: input.limit,
        }),
        isAdmin
          ? ctx.db.landingPage.findMany({
              where: { status: "PUBLISHED" },
              include: {
                consultant: {
                  select: { firstName: true, lastName: true },
                },
              },
              orderBy: { updatedAt: "desc" },
              take: 5,
            })
          : Promise.resolve([]),
      ]);

      const activities = [
        ...recentSubmissions.map((s) => ({
          type: "submission" as const,
          id: s.id,
          date: s.createdAt,
          title: `Nuovo contatto da ${s.firstName} ${s.lastName}`,
          subtitle: isAdmin
            ? `Per ${s.landingPage.consultant.firstName} ${s.landingPage.consultant.lastName}`
            : s.email,
          isRead: s.isRead,
        })),
        ...recentPublications.map((lp) => ({
          type: "publication" as const,
          id: lp.id,
          date: lp.updatedAt,
          title: `Pagina pubblicata`,
          subtitle: `${lp.consultant.firstName} ${lp.consultant.lastName}`,
          isRead: true,
        })),
      ];

      activities.sort(
        (a, b) => b.date.getTime() - a.date.getTime()
      );

      return activities.slice(0, input.limit);
    }),

  getPageSpeedScore: protectedProcedure
    .input(z.object({ landingPageId: z.string() }))
    .query(async ({ ctx, input }) => {
      const landingPage = await ctx.db.landingPage.findUnique({
        where: { id: input.landingPageId },
        select: {
          pagespeedMobile: true,
          pagespeedDesktop: true,
          pagespeedCheckedAt: true,
          slug: true,
          customDomain: { select: { domain: true } },
        },
      });

      if (!landingPage) return null;

      // Return cached if less than 24h old
      if (landingPage.pagespeedCheckedAt) {
        const hoursSinceCheck =
          (Date.now() - landingPage.pagespeedCheckedAt.getTime()) /
          (1000 * 60 * 60);
        if (hoursSinceCheck < 24) {
          return {
            mobile: landingPage.pagespeedMobile,
            desktop: landingPage.pagespeedDesktop,
            checkedAt: landingPage.pagespeedCheckedAt,
            cached: true,
          };
        }
      }

      // Fetch fresh scores
      const { fetchPageSpeedScores } = await import("@/lib/pagespeed");
      const url = landingPage.customDomain?.domain
        ? `https://${landingPage.customDomain.domain}`
        : `${process.env.NEXTAUTH_URL}/${landingPage.slug}`;

      const scores = await fetchPageSpeedScores(url);
      if (!scores) return null;

      // Cache in DB
      await ctx.db.landingPage.update({
        where: { id: input.landingPageId },
        data: {
          pagespeedMobile: scores.mobile,
          pagespeedDesktop: scores.desktop,
          pagespeedCheckedAt: new Date(),
        },
      });

      return {
        mobile: scores.mobile,
        desktop: scores.desktop,
        checkedAt: new Date(),
        cached: false,
      };
    }),
});
