import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/server/db";
import { sendEmail } from "@/lib/email";
import { contactNotificationTemplate } from "@/lib/email-templates/contact-notification";

const contactSchema = z.object({
  landingPageId: z.string().min(1, "ID landing page obbligatorio"),
  firstName: z.string().min(1, "Il nome è obbligatorio"),
  lastName: z.string().min(1, "Il cognome è obbligatorio"),
  email: z.string().email("Email non valida"),
  phone: z.string().optional(),
  message: z.string().optional(),
  isExistingClient: z.boolean().default(false),
  honeypot: z.string().optional(),
  formLoadedAt: z.number().optional(),
});

export async function POST(request: Request): Promise<NextResponse> {
  const body = await request.json().catch(() => null);

  if (!body) {
    return NextResponse.json(
      { message: "Corpo della richiesta non valido" },
      { status: 400 }
    );
  }

  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Dati non validi";
    return NextResponse.json(
      { message: firstError },
      { status: 400 }
    );
  }

  const { landingPageId, firstName, lastName, email, phone, message, isExistingClient, honeypot, formLoadedAt } =
    parsed.data;

  // Anti-spam: honeypot check
  if (honeypot) {
    return NextResponse.json(
      { message: "Messaggio inviato con successo", id: "ok" },
      { status: 201 }
    );
  }

  // Anti-spam: timing check (minimum 3 seconds)
  if (formLoadedAt) {
    const elapsed = Date.now() - formLoadedAt;
    if (elapsed < 3000) {
      return NextResponse.json(
        { message: "Messaggio inviato con successo", id: "ok" },
        { status: 201 }
      );
    }
  }

  // Anti-spam: rate limit (max 3 per landing page per 60s)
  const oneMinuteAgo = new Date(Date.now() - 60_000);
  const recentCount = await db.contactSubmission.count({
    where: {
      landingPageId,
      createdAt: { gte: oneMinuteAgo },
    },
  });
  if (recentCount >= 3) {
    return NextResponse.json(
      { message: "Troppe richieste. Riprova fra un minuto." },
      { status: 429 }
    );
  }

  // Verify the landing page exists and is published
  const landingPage = await db.landingPage.findUnique({
    where: { id: landingPageId },
    include: {
      consultant: {
        select: { firstName: true, lastName: true, email: true },
      },
    },
  });

  if (!landingPage || landingPage.status !== "PUBLISHED") {
    return NextResponse.json(
      { message: "Pagina non trovata" },
      { status: 404 }
    );
  }

  const submission = await db.contactSubmission.create({
    data: {
      landingPageId,
      firstName,
      lastName,
      email,
      phone: phone ?? null,
      message: message ?? null,
      isExistingClient,
    },
  });

  // Send email notification (fire-and-forget)
  if (landingPage.consultant) {
    const c = landingPage.consultant;
    sendEmail({
      to: c.email,
      subject: `Nuova richiesta di contatto da ${firstName} ${lastName}`,
      html: contactNotificationTemplate({
        consultantName: `${c.firstName} ${c.lastName}`,
        firstName,
        lastName,
        email,
        phone,
        message,
        isExistingClient,
      }),
    }).catch((err) => {
      console.error("Failed to send contact notification email:", err);
    });
  }

  return NextResponse.json(
    { message: "Messaggio inviato con successo", id: submission.id },
    { status: 201 }
  );
}
