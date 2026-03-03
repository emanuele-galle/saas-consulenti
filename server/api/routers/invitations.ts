import { z } from "zod";
import { randomBytes } from "crypto";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import {
  createTRPCRouter,
  adminProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { sendEmail } from "@/lib/email";
import { slugify } from "@/lib/utils";

function generateToken(): string {
  return randomBytes(32).toString("hex");
}

function invitationEmailTemplate(email: string, inviteUrl: string): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;background-color:#f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;padding:20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;">
          <tr>
            <td style="background-color:#C21D17;padding:24px 32px;">
              <h1 style="color:#ffffff;margin:0;font-size:20px;">Invito Piattaforma MediaCom</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 16px;color:#333;font-size:15px;">
                Sei stato invitato a registrarti sulla piattaforma Landing Page Consulenti MediaCom.
              </p>
              <p style="margin:0 0 24px;color:#333;font-size:15px;">
                Clicca il pulsante qui sotto per completare la registrazione:
              </p>
              <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
                <tr>
                  <td style="background-color:#C21D17;border-radius:6px;padding:12px 32px;">
                    <a href="${inviteUrl}" style="color:#ffffff;text-decoration:none;font-size:15px;font-weight:bold;">
                      Completa la registrazione
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:24px 0 0;color:#999;font-size:13px;">
                Questo link scade tra 7 giorni. Se non hai richiesto questo invito, ignora questa email.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 32px;background-color:#f5f5f5;text-align:center;">
              <p style="margin:0;color:#999;font-size:12px;">MediaCom - Piattaforma Landing Page Consulenti</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export const invitationsRouter = createTRPCRouter({
  // Create invitation (admin only)
  create: adminProcedure
    .input(
      z.object({
        email: z.string().email(),
        role: z.string().default("CONSULTANT"),
        network: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if email already registered
      const existing = await ctx.db.user.findUnique({
        where: { email: input.email },
      });
      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Questa email e' gia' registrata",
        });
      }

      // Check for existing unexpired invitation
      const existingInvite = await ctx.db.invitationToken.findFirst({
        where: {
          email: input.email,
          usedAt: null,
          expiresAt: { gt: new Date() },
        },
      });
      if (existingInvite) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Esiste gia' un invito attivo per questa email",
        });
      }

      const token = generateToken();
      const invitation = await ctx.db.invitationToken.create({
        data: {
          email: input.email,
          token,
          role: input.role,
          network: input.network || null,
          createdById: ctx.user.id,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
      });

      // Send invitation email
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3010";
      const inviteUrl = `${appUrl}/invite/${token}`;

      sendEmail({
        to: input.email,
        subject: "Invito Piattaforma Landing Page MediaCom",
        html: invitationEmailTemplate(input.email, inviteUrl),
      }).catch((err) => {
        console.error("Failed to send invitation email:", err);
      });

      return invitation;
    }),

  // Validate token (public)
  validate: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ ctx, input }) => {
      const invitation = await ctx.db.invitationToken.findUnique({
        where: { token: input.token },
      });

      if (!invitation) {
        return { valid: false, email: null, reason: "Token non valido" };
      }

      if (invitation.usedAt) {
        return { valid: false, email: null, reason: "Invito gia' utilizzato" };
      }

      if (invitation.expiresAt < new Date()) {
        return { valid: false, email: null, reason: "Invito scaduto" };
      }

      return {
        valid: true,
        email: invitation.email,
        role: invitation.role,
        network: invitation.network,
      };
    }),

  // Register from invitation (public)
  register: publicProcedure
    .input(
      z.object({
        token: z.string(),
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        password: z.string().min(8),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const invitation = await ctx.db.invitationToken.findUnique({
        where: { token: input.token },
      });

      if (!invitation || invitation.usedAt || invitation.expiresAt < new Date()) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Token di invito non valido o scaduto",
        });
      }

      const hashedPassword = await bcrypt.hash(input.password, 12);
      const slug = slugify(`${input.firstName}-${input.lastName}`);

      const existingSlug = await ctx.db.landingPage.findUnique({
        where: { slug },
      });
      const finalSlug = existingSlug
        ? `${slug}-${Date.now().toString(36)}`
        : slug;

      const result = await ctx.db.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            email: invitation.email,
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
            role: invitation.role || "Consulente Finanziario",
            network: invitation.network || null,
            email: invitation.email,
          },
        });

        const landingPage = await tx.landingPage.create({
          data: {
            consultantId: consultant.id,
            slug: finalSlug,
            status: "DRAFT",
          },
        });

        // Mark invitation as used
        await tx.invitationToken.update({
          where: { id: invitation.id },
          data: { usedAt: new Date() },
        });

        return { user, consultant, landingPage };
      });

      return result;
    }),

  // Revoke invitation (admin only)
  revoke: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const invitation = await ctx.db.invitationToken.findUnique({
        where: { id: input.id },
      });

      if (!invitation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invito non trovato",
        });
      }

      if (invitation.usedAt) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Questo invito e' gia' stato utilizzato o revocato",
        });
      }

      return ctx.db.invitationToken.update({
        where: { id: input.id },
        data: { usedAt: new Date() },
      });
    }),

  // Resend invitation (admin only)
  resend: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const invitation = await ctx.db.invitationToken.findUnique({
        where: { id: input.id },
      });

      if (!invitation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invito non trovato",
        });
      }

      // Check if a user was actually created with this email (used invite)
      const userExists = await ctx.db.user.findUnique({
        where: { email: invitation.email },
      });
      if (userExists) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "L'utente si e' gia' registrato con questa email",
        });
      }

      const newToken = generateToken();

      const updated = await ctx.db.invitationToken.update({
        where: { id: input.id },
        data: {
          token: newToken,
          usedAt: null,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3010";
      const inviteUrl = `${appUrl}/invite/${newToken}`;

      sendEmail({
        to: invitation.email,
        subject: "Invito Piattaforma Landing Page MediaCom",
        html: invitationEmailTemplate(invitation.email, inviteUrl),
      }).catch((err) => {
        console.error("Failed to send invitation email:", err);
      });

      return updated;
    }),

  // List invitations (admin only)
  list: adminProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(20),
      })
    )
    .query(async ({ ctx, input }) => {
      const [invitations, total] = await Promise.all([
        ctx.db.invitationToken.findMany({
          orderBy: { createdAt: "desc" },
          skip: (input.page - 1) * input.limit,
          take: input.limit,
        }),
        ctx.db.invitationToken.count(),
      ]);

      return {
        invitations,
        total,
        pages: Math.ceil(total / input.limit),
      };
    }),
});
