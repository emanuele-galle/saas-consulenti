import { z } from "zod";
import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, adminProcedure, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { sendEmail } from "@/lib/email";

function resetPasswordEmailTemplate(resetUrl: string): string {
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
              <h1 style="color:#ffffff;margin:0;font-size:20px;">Reset Password</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 16px;color:#333;font-size:15px;">
                Hai richiesto il reset della password per il tuo account.
              </p>
              <p style="margin:0 0 24px;color:#333;font-size:15px;">
                Clicca il pulsante qui sotto per impostare una nuova password:
              </p>
              <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
                <tr>
                  <td style="background-color:#C21D17;border-radius:6px;padding:12px 32px;">
                    <a href="${resetUrl}" style="color:#ffffff;text-decoration:none;font-size:15px;font-weight:bold;">
                      Reimposta password
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:24px 0 0;color:#999;font-size:13px;">
                Questo link scade tra 1 ora. Se non hai richiesto il reset, ignora questa email.
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

export const usersRouter = createTRPCRouter({
  // Update user role (admin only)
  updateRole: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        role: z.enum(["ADMIN", "CONSULTANT"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.userId === ctx.user.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Non puoi modificare il tuo stesso ruolo",
        });
      }

      const user = await ctx.db.user.findUnique({
        where: { id: input.userId },
      });

      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Utente non trovato" });
      }

      if (user.role === "SUPERADMIN") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Non puoi modificare il ruolo di un Super Admin",
        });
      }

      return ctx.db.user.update({
        where: { id: input.userId },
        data: { role: input.role },
      });
    }),

  changePassword: protectedProcedure
    .input(
      z.object({
        currentPassword: z.string().min(1, "Password attuale obbligatoria"),
        newPassword: z.string().min(8, "Minimo 8 caratteri"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.user.id },
      });

      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const isValid = await bcrypt.compare(input.currentPassword, user.password);
      if (!isValid) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Password attuale non corretta",
        });
      }

      const hashedPassword = await bcrypt.hash(input.newPassword, 12);
      await ctx.db.user.update({
        where: { id: ctx.user.id },
        data: { password: hashedPassword },
      });

      return { success: true };
    }),

  // Request password reset (public)
  requestReset: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { email: input.email },
      });

      // Always return success to prevent email enumeration
      if (!user) {
        return { success: true };
      }

      const token = randomBytes(32).toString("hex");
      const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await ctx.db.user.update({
        where: { id: user.id },
        data: {
          resetToken: token,
          resetTokenExpiry: expiry,
        },
      });

      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3010";
      const resetUrl = `${appUrl}/reset-password/${token}`;

      sendEmail({
        to: input.email,
        subject: "Reset Password - Piattaforma MediaCom",
        html: resetPasswordEmailTemplate(resetUrl),
      }).catch((err) => {
        console.error("Failed to send reset email:", err);
      });

      return { success: true };
    }),

  // Reset password with token (public)
  resetPassword: publicProcedure
    .input(
      z.object({
        token: z.string(),
        newPassword: z.string().min(8),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findFirst({
        where: {
          resetToken: input.token,
          resetTokenExpiry: { gt: new Date() },
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Token non valido o scaduto",
        });
      }

      const hashedPassword = await bcrypt.hash(input.newPassword, 12);
      await ctx.db.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          resetToken: null,
          resetTokenExpiry: null,
        },
      });

      return { success: true };
    }),
});
