import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
  adminProcedure,
} from "@/server/api/trpc";
import { sendEmail } from "@/lib/email";
import { contactNotificationTemplate } from "@/lib/email-templates/contact-notification";

export const submissionsRouter = createTRPCRouter({
  // Submit contact form (public)
  create: publicProcedure
    .input(
      z.object({
        landingPageId: z.string(),
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        email: z.string().email(),
        phone: z.string().optional(),
        message: z.string().optional(),
        isExistingClient: z.boolean().default(false),
        honeypot: z.string().optional(),
        formLoadedAt: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Anti-spam: honeypot check
      if (input.honeypot) {
        return { id: "ok" };
      }

      // Anti-spam: timing check (minimum 3 seconds)
      if (input.formLoadedAt) {
        const elapsed = Date.now() - input.formLoadedAt;
        if (elapsed < 3000) {
          return { id: "ok" };
        }
      }

      // Anti-spam: rate limit (max 3 per landing page per 60s)
      const oneMinuteAgo = new Date(Date.now() - 60_000);
      const recentCount = await ctx.db.contactSubmission.count({
        where: {
          landingPageId: input.landingPageId,
          createdAt: { gte: oneMinuteAgo },
        },
      });
      if (recentCount >= 3) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "Troppe richieste. Riprova fra un minuto.",
        });
      }

      const { honeypot: _h, formLoadedAt: _f, ...submissionData } = input;

      const submission = await ctx.db.contactSubmission.create({
        data: submissionData,
      });

      // Send email notification (fire-and-forget)
      ctx.db.landingPage
        .findUnique({
          where: { id: input.landingPageId },
          include: {
            consultant: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        })
        .then((landingPage) => {
          if (!landingPage?.consultant) return;
          const c = landingPage.consultant;
          sendEmail({
            to: c.email,
            subject: `Nuova richiesta di contatto da ${input.firstName} ${input.lastName}`,
            html: contactNotificationTemplate({
              consultantName: `${c.firstName} ${c.lastName}`,
              firstName: input.firstName,
              lastName: input.lastName,
              email: input.email,
              phone: input.phone,
              message: input.message,
              isExistingClient: input.isExistingClient,
            }),
          }).catch((err) => {
            console.error("Failed to send contact notification email:", err);
          });
        })
        .catch((err) => {
          console.error("Failed to fetch consultant for email:", err);
        });

      return submission;
    }),

  // List submissions with filters
  list: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(20),
        landingPageId: z.string().optional(),
        search: z.string().optional(),
        consultantId: z.string().optional(),
        dateFrom: z.string().optional(),
        dateTo: z.string().optional(),
        isRead: z.boolean().optional(),
        sortBy: z
          .enum(["createdAt", "firstName", "lastName", "email"])
          .default("createdAt"),
        sortOrder: z.enum(["asc", "desc"]).default("desc"),
      })
    )
    .query(async ({ ctx, input }) => {
      const conditions: Record<string, unknown>[] = [];

      if (input.landingPageId) {
        conditions.push({ landingPageId: input.landingPageId });
      }

      if (input.consultantId) {
        const lp = await ctx.db.landingPage.findUnique({
          where: { consultantId: input.consultantId },
          select: { id: true },
        });
        if (lp) {
          conditions.push({ landingPageId: lp.id });
        } else {
          return { submissions: [], total: 0, pages: 0 };
        }
      }

      if (input.search) {
        conditions.push({
          OR: [
            {
              firstName: {
                contains: input.search,
                mode: "insensitive",
              },
            },
            {
              lastName: {
                contains: input.search,
                mode: "insensitive",
              },
            },
            {
              email: {
                contains: input.search,
                mode: "insensitive",
              },
            },
            {
              message: {
                contains: input.search,
                mode: "insensitive",
              },
            },
          ],
        });
      }

      if (input.dateFrom) {
        conditions.push({
          createdAt: { gte: new Date(input.dateFrom) },
        });
      }

      if (input.dateTo) {
        const to = new Date(input.dateTo);
        to.setHours(23, 59, 59, 999);
        conditions.push({ createdAt: { lte: to } });
      }

      if (input.isRead !== undefined) {
        conditions.push({ isRead: input.isRead });
      }

      // Consultants can only see their own submissions
      if (ctx.user.role === "CONSULTANT") {
        const consultant = await ctx.db.consultant.findUnique({
          where: { userId: ctx.user.id },
          include: { landingPage: { select: { id: true } } },
        });
        if (consultant?.landingPage) {
          conditions.push({
            landingPageId: consultant.landingPage.id,
          });
        } else {
          return { submissions: [], total: 0, pages: 0 };
        }
      }

      const where =
        conditions.length > 0 ? { AND: conditions } : {};

      const [submissions, total] = await Promise.all([
        ctx.db.contactSubmission.findMany({
          where,
          include: {
            landingPage: {
              include: {
                consultant: {
                  select: { firstName: true, lastName: true, id: true },
                },
              },
            },
          },
          orderBy: { [input.sortBy]: input.sortOrder },
          skip: (input.page - 1) * input.limit,
          take: input.limit,
        }),
        ctx.db.contactSubmission.count({ where }),
      ]);

      return {
        submissions,
        total,
        pages: Math.ceil(total / input.limit),
      };
    }),

  // Get single submission with auto-mark as read
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const submission = await ctx.db.contactSubmission.findUnique({
        where: { id: input.id },
        include: {
          landingPage: {
            include: {
              consultant: {
                select: {
                  firstName: true,
                  lastName: true,
                  id: true,
                  email: true,
                },
              },
            },
          },
        },
      });

      if (!submission) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      // Check permissions
      if (ctx.user.role === "CONSULTANT") {
        const consultant = await ctx.db.consultant.findUnique({
          where: { userId: ctx.user.id },
          select: { id: true },
        });
        if (
          consultant?.id !== submission.landingPage.consultant.id
        ) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
      }

      // Auto-mark as read
      if (!submission.isRead) {
        await ctx.db.contactSubmission.update({
          where: { id: input.id },
          data: { isRead: true, readAt: new Date() },
        });
        submission.isRead = true;
        submission.readAt = new Date();
      }

      return submission;
    }),

  // Mark submissions as read
  markAsRead: protectedProcedure
    .input(z.object({ ids: z.array(z.string()).min(1) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.contactSubmission.updateMany({
        where: { id: { in: input.ids } },
        data: { isRead: true, readAt: new Date() },
      });
      return { success: true };
    }),

  // Mark submissions as unread
  markAsUnread: protectedProcedure
    .input(z.object({ ids: z.array(z.string()).min(1) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.contactSubmission.updateMany({
        where: { id: { in: input.ids } },
        data: { isRead: false, readAt: null },
      });
      return { success: true };
    }),

  // Export data (no pagination, for CSV export)
  exportData: protectedProcedure
    .input(
      z.object({
        landingPageId: z.string().optional(),
        consultantId: z.string().optional(),
        dateFrom: z.string().optional(),
        dateTo: z.string().optional(),
        isRead: z.boolean().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const conditions: Record<string, unknown>[] = [];

      if (input.landingPageId) {
        conditions.push({ landingPageId: input.landingPageId });
      }

      if (input.consultantId) {
        const lp = await ctx.db.landingPage.findUnique({
          where: { consultantId: input.consultantId },
          select: { id: true },
        });
        if (lp) {
          conditions.push({ landingPageId: lp.id });
        } else {
          return [];
        }
      }

      if (input.dateFrom) {
        conditions.push({
          createdAt: { gte: new Date(input.dateFrom) },
        });
      }

      if (input.dateTo) {
        const to = new Date(input.dateTo);
        to.setHours(23, 59, 59, 999);
        conditions.push({ createdAt: { lte: to } });
      }

      if (input.isRead !== undefined) {
        conditions.push({ isRead: input.isRead });
      }

      // Consultants can only export their own
      if (ctx.user.role === "CONSULTANT") {
        const consultant = await ctx.db.consultant.findUnique({
          where: { userId: ctx.user.id },
          include: { landingPage: { select: { id: true } } },
        });
        if (consultant?.landingPage) {
          conditions.push({
            landingPageId: consultant.landingPage.id,
          });
        } else {
          return [];
        }
      }

      const where =
        conditions.length > 0 ? { AND: conditions } : {};

      return ctx.db.contactSubmission.findMany({
        where,
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
      });
    }),

  // Delete submission (admin only)
  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.contactSubmission.delete({
        where: { id: input.id },
      });
      return { success: true };
    }),
});
