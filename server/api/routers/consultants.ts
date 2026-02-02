import { z } from "zod";
import {
  createTRPCRouter,
  adminProcedure,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import { slugify } from "@/lib/utils";

export const consultantsRouter = createTRPCRouter({
  // List all consultants (admin only)
  list: adminProcedure
    .input(
      z.object({
        search: z.string().optional(),
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(20),
      })
    )
    .query(async ({ ctx, input }) => {
      const where = input.search
        ? {
            OR: [
              { firstName: { contains: input.search, mode: "insensitive" as const } },
              { lastName: { contains: input.search, mode: "insensitive" as const } },
              { email: { contains: input.search, mode: "insensitive" as const } },
              { city: { contains: input.search, mode: "insensitive" as const } },
            ],
          }
        : {};

      const [consultants, total] = await Promise.all([
        ctx.db.consultant.findMany({
          where,
          include: {
            user: { select: { email: true, role: true } },
            landingPage: {
              select: {
                id: true,
                slug: true,
                status: true,
                views: true,
                customDomain: { select: { id: true } },
              },
            },
          },
          orderBy: { createdAt: "desc" },
          skip: (input.page - 1) * input.limit,
          take: input.limit,
        }),
        ctx.db.consultant.count({ where }),
      ]);

      return {
        consultants,
        total,
        pages: Math.ceil(total / input.limit),
      };
    }),

  // Get single consultant by ID
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const consultant = await ctx.db.consultant.findUnique({
        where: { id: input.id },
        include: {
          user: { select: { id: true, email: true, role: true } },
          landingPage: {
            include: {
              customDomain: true,
              _count: { select: { contactSubmissions: true } },
            },
          },
        },
      });

      if (!consultant) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Consulente non trovato" });
      }

      // Consultants can only see their own profile
      if (
        ctx.user.role === "CONSULTANT" &&
        consultant.userId !== ctx.user.id
      ) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      return consultant;
    }),

  // Get consultant by user ID (for consultants viewing own profile)
  getByUserId: protectedProcedure.query(async ({ ctx }) => {
    const consultant = await ctx.db.consultant.findUnique({
      where: { userId: ctx.user.id },
      include: {
        landingPage: {
          include: {
            customDomain: true,
            _count: { select: { contactSubmissions: true } },
          },
        },
      },
    });
    return consultant;
  }),

  // Create consultant (admin only)
  create: adminProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(8),
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        title: z.string().optional(),
        role: z.string().min(1),
        network: z.string().optional(),
        bio: z.string().optional(),
        consultantEmail: z.string().email(),
        phone: z.string().optional(),
        mobile: z.string().optional(),
        address: z.string().optional(),
        cap: z.string().optional(),
        city: z.string().optional(),
        province: z.string().optional(),
        efpa: z.boolean().default(false),
        efpaEsg: z.boolean().default(false),
        sustainableAdvisor: z.boolean().default(false),
        linkedinUrl: z.string().url().optional().or(z.literal("")),
        facebookUrl: z.string().url().optional().or(z.literal("")),
        twitterUrl: z.string().url().optional().or(z.literal("")),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if user email already exists
      const existing = await ctx.db.user.findUnique({
        where: { email: input.email },
      });
      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Email già registrata",
        });
      }

      const hashedPassword = await bcrypt.hash(input.password, 12);
      const slug = slugify(`${input.firstName}-${input.lastName}`);

      // Check slug uniqueness
      const existingSlug = await ctx.db.landingPage.findUnique({
        where: { slug },
      });
      const finalSlug = existingSlug
        ? `${slug}-${Date.now().toString(36)}`
        : slug;

      // Create user + consultant + landing page in transaction
      const result = await ctx.db.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            email: input.email,
            password: hashedPassword,
            name: `${input.firstName} ${input.lastName}`,
            role: "CONSULTANT",
          },
        });

        const consultant = await tx.consultant.create({
          data: {
            userId: user.id,
            firstName: input.firstName,
            lastName: input.lastName,
            title: input.title || null,
            role: input.role,
            network: input.network || null,
            bio: input.bio || null,
            email: input.consultantEmail,
            phone: input.phone || null,
            mobile: input.mobile || null,
            address: input.address || null,
            cap: input.cap || null,
            city: input.city || null,
            province: input.province || null,
            efpa: input.efpa,
            efpaEsg: input.efpaEsg,
            sustainableAdvisor: input.sustainableAdvisor,
            linkedinUrl: input.linkedinUrl || null,
            facebookUrl: input.facebookUrl || null,
            twitterUrl: input.twitterUrl || null,
          },
        });

        const landingPage = await tx.landingPage.create({
          data: {
            consultantId: consultant.id,
            slug: finalSlug,
            status: "DRAFT",
          },
        });

        return { user, consultant, landingPage };
      });

      return result;
    }),

  // Update consultant (admin or own profile)
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        firstName: z.string().min(1).optional(),
        lastName: z.string().min(1).optional(),
        title: z.string().optional(),
        role: z.string().optional(),
        network: z.string().optional(),
        bio: z.string().optional(),
        profileImage: z.string().optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        mobile: z.string().optional(),
        address: z.string().optional(),
        cap: z.string().optional(),
        city: z.string().optional(),
        province: z.string().optional(),
        efpa: z.boolean().optional(),
        efpaEsg: z.boolean().optional(),
        sustainableAdvisor: z.boolean().optional(),
        linkedinUrl: z.string().optional(),
        facebookUrl: z.string().optional(),
        twitterUrl: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const consultant = await ctx.db.consultant.findUnique({
        where: { id: input.id },
      });

      if (!consultant) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      // Consultants can only update their own profile
      if (
        ctx.user.role === "CONSULTANT" &&
        consultant.userId !== ctx.user.id
      ) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const { id, ...data } = input;
      return ctx.db.consultant.update({
        where: { id },
        data,
      });
    }),

  // Delete consultant (admin only)
  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const consultant = await ctx.db.consultant.findUnique({
        where: { id: input.id },
        select: { userId: true },
      });

      if (!consultant) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      // Delete user (cascades to consultant, landing page, etc.)
      await ctx.db.user.delete({
        where: { id: consultant.userId },
      });

      return { success: true };
    }),

  // Get consultant by slug (public - for landing pages)
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const landingPage = await ctx.db.landingPage.findUnique({
        where: { slug: input.slug },
        include: {
          consultant: true,
        },
      });

      if (!landingPage || landingPage.status !== "PUBLISHED") {
        return null;
      }

      // Increment view count
      await ctx.db.landingPage.update({
        where: { id: landingPage.id },
        data: {
          views: { increment: 1 },
          lastViewedAt: new Date(),
        },
      });

      return landingPage;
    }),
});
