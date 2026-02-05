import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/server/db";
import { trackView } from "@/lib/track-view";
import { LandingLayout } from "@/components/landing/landing-layout";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const landingPage = await db.landingPage.findUnique({
    where: { slug },
    include: {
      consultant: {
        select: {
          firstName: true,
          lastName: true,
          title: true,
          role: true,
          profileImage: true,
        },
      },
    },
  });

  if (!landingPage || (landingPage.status !== "PUBLISHED" && landingPage.status !== "DRAFT")) {
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
    twitter: {
      card: "summary",
      title,
      description,
    },
    ...(landingPage.gscVerificationTag
      ? { verification: { google: landingPage.gscVerificationTag } }
      : {}),
  };
}

export default async function LandingPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { preview } = await searchParams;
  const isPreview = preview === "true";

  const landingPage = await db.landingPage.findUnique({
    where: { slug },
    include: { consultant: true },
  });

  if (!landingPage) {
    notFound();
  }

  // Allow DRAFT pages only in preview mode
  if (landingPage.status !== "PUBLISHED" && !isPreview) {
    notFound();
  }

  // Increment view count only for non-preview visits
  if (!isPreview) {
    trackView(db, landingPage.id);
  }

  return (
    <LandingLayout
      consultant={landingPage.consultant}
      landingPage={landingPage}
    />
  );
}
