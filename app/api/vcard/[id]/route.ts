import { NextResponse } from "next/server";
import { db } from "@/server/db";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(
  _request: Request,
  context: RouteContext
): Promise<NextResponse> {
  const { id } = await context.params;

  const consultant = await db.consultant.findUnique({
    where: { id },
    select: {
      firstName: true,
      lastName: true,
      title: true,
      role: true,
      network: true,
      email: true,
      phone: true,
      mobile: true,
      address: true,
      cap: true,
      city: true,
      province: true,
      linkedinUrl: true,
      profileImage: true,
    },
  });

  if (!consultant) {
    return NextResponse.json(
      { message: "Consulente non trovato" },
      { status: 404 }
    );
  }

  const vcf = buildVCard(consultant);

  const fileName = `${consultant.firstName}_${consultant.lastName}.vcf`;

  return new NextResponse(vcf, {
    status: 200,
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": `attachment; filename="${fileName}"`,
    },
  });
}

function buildVCard(consultant: {
  firstName: string;
  lastName: string;
  title?: string | null;
  role: string;
  network?: string | null;
  email: string;
  phone?: string | null;
  mobile?: string | null;
  address?: string | null;
  cap?: string | null;
  city?: string | null;
  province?: string | null;
  linkedinUrl?: string | null;
  profileImage?: string | null;
}): string {
  const lines: string[] = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${escapeVCard(consultant.lastName)};${escapeVCard(consultant.firstName)};;;${escapeVCard(consultant.title ?? "")}`,
    `FN:${escapeVCard(buildFullName(consultant))}`,
    `ORG:${escapeVCard("MediaCom srls")}`,
    `TITLE:${escapeVCard(consultant.role)}`,
  ];

  if (consultant.network) {
    lines.push(`NOTE:${escapeVCard(consultant.network)}`);
  }

  lines.push(`EMAIL;TYPE=WORK:${consultant.email}`);

  if (consultant.phone) {
    lines.push(`TEL;TYPE=WORK:${consultant.phone}`);
  }

  if (consultant.mobile) {
    lines.push(`TEL;TYPE=CELL:${consultant.mobile}`);
  }

  if (consultant.address || consultant.city) {
    const adr = [
      "", // PO Box
      "", // Extended address
      escapeVCard(consultant.address ?? ""),
      escapeVCard(consultant.city ?? ""),
      escapeVCard(consultant.province ?? ""),
      escapeVCard(consultant.cap ?? ""),
      "Italy",
    ].join(";");
    lines.push(`ADR;TYPE=WORK:${adr}`);
  }

  if (consultant.linkedinUrl) {
    lines.push(`URL:${consultant.linkedinUrl}`);
  }

  if (consultant.profileImage) {
    lines.push(`PHOTO;VALUE=URI:${consultant.profileImage}`);
  }

  lines.push("END:VCARD");

  return lines.join("\r\n");
}

function escapeVCard(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

function buildFullName(consultant: {
  title?: string | null;
  firstName: string;
  lastName: string;
}): string {
  return [consultant.title, consultant.firstName, consultant.lastName]
    .filter(Boolean)
    .join(" ");
}
