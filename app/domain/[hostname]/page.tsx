import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/server/db";
import { trackView } from "@/lib/track-view";
import { LandingLayout } from "@/components/landing/landing-layout";

interface PageProps {
  params: Promise<{ hostname: string }>;
}

async function getLandingPageByDomain(hostname: string) {
  const customDomain = await db.customDomain.findUnique({
    where: { domain: hostname, status: "ACTIVE" },
    include: {
      landingPage: {
        include: { consultant: true },
      },
    },
  });
  return customDomain?.landingPage ?? null;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { hostname } = await params;
  const landingPage = await getLandingPageByDomain(decodeURIComponent(hostname));

  if (!landingPage || landingPage.status !== "PUBLISHED") {
    return { title: "Pagina non trovata" };
  }

  const { consultant } = landingPage;
  const fullName = [consultant.title, consultant.firstName, consultant.lastName]
    .filter(Boolean)
    .join(" ");

  const title =
    landingPage.metaTitle ?? `${fullName} - ${consultant.role} | Generali`;
  const description =
    landingPage.metaDescription ??
    `Pagina personale di ${fullName}, ${consultant.role} presso Generali Italia.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
      ...(consultant.profileImage
        ? {
            images: [
              {
                url: consultant.profileImage,
                width: 400,
                height: 400,
                alt: fullName,
              },
            ],
          }
        : {}),
    },
    ...(landingPage.gscVerificationTag
      ? { verification: { google: landingPage.gscVerificationTag } }
      : {}),
  };
}

export default async function DomainLandingPage({ params }: PageProps) {
  const { hostname } = await params;
  const landingPage = await getLandingPageByDomain(decodeURIComponent(hostname));

  if (!landingPage || landingPage.status !== "PUBLISHED") {
    notFound();
  }

  // Increment view count
  trackView(db, landingPage.id);

  return (
    <LandingLayout
      consultant={landingPage.consultant}
      landingPage={landingPage}
    />
  );
}
