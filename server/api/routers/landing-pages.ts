import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const landingPagesRouter = createTRPCRouter({
  // Get landing page by ID
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const landingPage = await ctx.db.landingPage.findUnique({
        where: { id: input.id },
        include: {
          consultant: true,
          customDomain: true,
        },
      });

      if (!landingPage) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      // Check permissions: consultants can only view their own
      if (
        ctx.user.role === "CONSULTANT" &&
        landingPage.consultant.userId !== ctx.user.id
      ) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      return landingPage;
    }),

  // Get landing page by consultant ID
  getByConsultantId: protectedProcedure
    .input(z.object({ consultantId: z.string() }))
    .query(async ({ ctx, input }) => {
      const landingPage = await ctx.db.landingPage.findUnique({
        where: { consultantId: input.consultantId },
        include: {
          consultant: true,
          customDomain: true,
        },
      });

      if (!landingPage) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return landingPage;
    }),

  // Update a specific section
  updateSection: protectedProcedure
    .input(
      z.object({
        landingPageId: z.string(),
        section: z.enum([
          "coverData",
          "summaryData",
          "mapData",
          "skillsData",
          "experiencesData",
          "educationData",
          "interestsData",
          "bannerData",
          "focusOnData",
          "testimonialsData",
          "videoData",
          "portfolioData",
          "quoteData",
        ]),
        data: z.any(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const landingPage = await ctx.db.landingPage.findUnique({
        where: { id: input.landingPageId },
        include: { consultant: true },
      });

      if (!landingPage) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      // Check permissions
      if (
        ctx.user.role === "CONSULTANT" &&
        landingPage.consultant.userId !== ctx.user.id
      ) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      return ctx.db.landingPage.update({
        where: { id: input.landingPageId },
        data: {
          [input.section]: input.data,
        },
      });
    }),

  // Update SEO & Analytics data
  updateSeo: protectedProcedure
    .input(
      z.object({
        landingPageId: z.string(),
        metaTitle: z.string().optional(),
        metaDescription: z.string().optional(),
        ga4MeasurementId: z.string().optional(),
        gscVerificationTag: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { landingPageId, ...data } = input;
      return ctx.db.landingPage.update({
        where: { id: landingPageId },
        data,
      });
    }),

  // Publish / unpublish
  updateStatus: protectedProcedure
    .input(
      z.object({
        landingPageId: z.string(),
        status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const landingPage = await ctx.db.landingPage.findUnique({
        where: { id: input.landingPageId },
        include: { consultant: true },
      });

      if (!landingPage) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      if (
        ctx.user.role === "CONSULTANT" &&
        landingPage.consultant.userId !== ctx.user.id
      ) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      return ctx.db.landingPage.update({
        where: { id: input.landingPageId },
        data: { status: input.status },
      });
    }),
});
