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
        // Silently reject bots that fill hidden fields
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

  // List submissions (admin sees all, consultant sees own)
  list: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(20),
        landingPageId: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      let where: Record<string, unknown> = {};

      if (input.landingPageId) {
        where.landingPageId = input.landingPageId;
      }

      // Consultants can only see their own submissions
      if (ctx.user.role === "CONSULTANT") {
        const consultant = await ctx.db.consultant.findUnique({
          where: { userId: ctx.user.id },
          include: { landingPage: { select: { id: true } } },
        });
        if (consultant?.landingPage) {
          where.landingPageId = consultant.landingPage.id;
        } else {
          return { submissions: [], total: 0, pages: 0 };
        }
      }

      const [submissions, total] = await Promise.all([
        ctx.db.contactSubmission.findMany({
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
