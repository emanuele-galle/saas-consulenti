import type { Consultant, LandingPage, Prisma } from "@prisma/client";
import Script from "next/script";
import { LandingHeader } from "@/components/landing/header";
import { LandingFooter } from "@/components/landing/footer";
import { CoverSection } from "@/components/landing/cover-section";
import { ProfileSection } from "@/components/landing/profile-section";
import { ValuesSection } from "@/components/landing/values-section";
import { MapSection } from "@/components/landing/map-section";
import { SummarySection } from "@/components/landing/summary-section";
import { SkillsSection } from "@/components/landing/skills-section";
import { ProcessSection } from "@/components/landing/process-section";
import { MethodSection } from "@/components/landing/method-section";
import { StrengthsSection } from "@/components/landing/strengths-section";
import { ExperiencesSection } from "@/components/landing/experiences-section";
import { EducationSection } from "@/components/landing/education-section";
import { InterestsSection } from "@/components/landing/interests-section";
import { BannerSection } from "@/components/landing/banner-section";
import { FocusOnSection } from "@/components/landing/focus-on-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { VideoSection } from "@/components/landing/video-section";
import { PortfolioSection } from "@/components/landing/portfolio-section";
import { FaqSection } from "@/components/landing/faq-section";
import { QuoteSection } from "@/components/landing/quote-section";
import { ContactForm } from "@/components/landing/contact-form";
import { AnimateOnScroll, ScrollProgress, ScrollToTop } from "@/components/landing/animate-on-scroll";
import { SectionBackgroundWrapper } from "@/components/landing/section-background";
import type { SectionBackground } from "@/components/editor/section-background-editor";

interface LandingLayoutProps {
  consultant: Consultant;
  landingPage: LandingPage;
}

function isJsonObject(
  value: Prisma.JsonValue | null
): value is Prisma.JsonObject {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function extractBackground(data: unknown): SectionBackground | undefined {
  if (data && typeof data === "object" && !Array.isArray(data)) {
    const bg = (data as Record<string, unknown>).background;
    if (bg && typeof bg === "object" && !Array.isArray(bg)) {
      return bg as SectionBackground;
    }
  }
  return undefined;
}

export function LandingLayout({ consultant, landingPage }: LandingLayoutProps) {
  const consultantFullName = [
    consultant.title,
    consultant.firstName,
    consultant.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  const themeColor = consultant.themeColor || "#C21D17";

  const address = [consultant.address, consultant.cap, consultant.city, consultant.province]
    .filter(Boolean)
    .join(", ");

  const hasValues = isJsonObject(landingPage.valuesData);
  const hasMap = isJsonObject(landingPage.mapData);
  const hasSummary = isJsonObject(landingPage.summaryData);
  const hasSkills = isJsonObject(landingPage.skillsData);
  const hasProcess = isJsonObject(landingPage.processData);
  const hasMethod = isJsonObject(landingPage.methodData);
  const hasStrengths = isJsonObject(landingPage.strengthsData);
  const hasExperiences = isJsonObject(landingPage.experiencesData);
  const hasEducation = isJsonObject(landingPage.educationData);
  const hasInterests = isJsonObject(landingPage.interestsData);
  const hasBanner = isJsonObject(landingPage.bannerData);
  const hasFocusOn = isJsonObject(landingPage.focusOnData);
  const hasTestimonials = isJsonObject(landingPage.testimonialsData);
  const hasVideo = isJsonObject(landingPage.videoData);
  const hasPortfolio = isJsonObject(landingPage.portfolioData);
  const hasFaq = isJsonObject(landingPage.faqData);
  const hasQuote = isJsonObject(landingPage.quoteData);

  // JSON-LD Person structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: consultantFullName,
    jobTitle: consultant.role,
    worksFor: {
      "@type": "Organization",
      name: "Generali Italia",
      url: "https://www.generali.it",
    },
    email: consultant.email,
    ...(consultant.phone && { telephone: consultant.phone }),
    ...(consultant.profileImage && { image: consultant.profileImage }),
    ...(address && {
      address: {
        "@type": "PostalAddress",
        streetAddress: consultant.address,
        postalCode: consultant.cap,
        addressLocality: consultant.city,
        addressRegion: consultant.province,
        addressCountry: "IT",
      },
    }),
    sameAs: [
      consultant.linkedinUrl,
      consultant.facebookUrl,
      consultant.twitterUrl,
      consultant.instagramUrl,
      consultant.youtubeUrl,
      consultant.websiteUrl,
    ].filter(Boolean),
  };

  const ga4Id = landingPage.ga4MeasurementId;

  return (
    <div style={{ "--theme-color": themeColor } as React.CSSProperties}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {ga4Id && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga4Id}');`}
          </Script>
        </>
      )}
      <ScrollToTop />
      <ScrollProgress />
      <LandingHeader consultant={consultant} />

      <main>
        {/* 1. Cover */}
        <CoverSection
          consultant={consultant}
          coverData={
            isJsonObject(landingPage.coverData)
              ? (landingPage.coverData as Parameters<typeof CoverSection>[0]["coverData"])
              : {}
          }
        />

        {/* 2. Profile */}
        <AnimateOnScroll variant="fade-up">
          <ProfileSection consultant={consultant} />
        </AnimateOnScroll>

        {/* 3. Values */}
        {hasValues && (
          <SectionBackgroundWrapper background={extractBackground(landingPage.valuesData)}>
            <AnimateOnScroll variant="fade-up">
              <ValuesSection
                valuesData={landingPage.valuesData as unknown as Parameters<typeof ValuesSection>[0]["valuesData"]}
              />
            </AnimateOnScroll>
          </SectionBackgroundWrapper>
        )}

        {/* 4. Map */}
        {hasMap && (
          <SectionBackgroundWrapper background={extractBackground(landingPage.mapData)}>
            <MapSection
              mapData={landingPage.mapData as unknown as Parameters<typeof MapSection>[0]["mapData"]}
            />
          </SectionBackgroundWrapper>
        )}

        {/* 5. Summary */}
        {hasSummary && (
          <SectionBackgroundWrapper background={extractBackground(landingPage.summaryData)}>
            <SummarySection
              summaryData={landingPage.summaryData as unknown as Parameters<typeof SummarySection>[0]["summaryData"]}
              consultant={consultant}
            />
          </SectionBackgroundWrapper>
        )}

        {/* 6. Skills */}
        {hasSkills && (
          <SectionBackgroundWrapper background={extractBackground(landingPage.skillsData)}>
            <AnimateOnScroll variant="fade-up">
              <SkillsSection
                skillsData={landingPage.skillsData as unknown as Parameters<typeof SkillsSection>[0]["skillsData"]}
              />
            </AnimateOnScroll>
          </SectionBackgroundWrapper>
        )}

        {/* 7. Process */}
        {hasProcess && (
          <SectionBackgroundWrapper background={extractBackground(landingPage.processData)}>
            <AnimateOnScroll variant="fade-up">
              <ProcessSection
                processData={landingPage.processData as unknown as Parameters<typeof ProcessSection>[0]["processData"]}
              />
            </AnimateOnScroll>
          </SectionBackgroundWrapper>
        )}

        {/* 8. Method */}
        {hasMethod && (
          <SectionBackgroundWrapper background={extractBackground(landingPage.methodData)}>
            <AnimateOnScroll variant="fade-up">
              <MethodSection
                methodData={landingPage.methodData as unknown as Parameters<typeof MethodSection>[0]["methodData"]}
              />
            </AnimateOnScroll>
          </SectionBackgroundWrapper>
        )}

        {/* 9. Strengths */}
        {hasStrengths && (
          <SectionBackgroundWrapper background={extractBackground(landingPage.strengthsData)}>
            <AnimateOnScroll variant="fade-up">
              <StrengthsSection
                strengthsData={landingPage.strengthsData as unknown as Parameters<typeof StrengthsSection>[0]["strengthsData"]}
              />
            </AnimateOnScroll>
          </SectionBackgroundWrapper>
        )}

        {/* 10. Experiences */}
        {hasExperiences && (
          <SectionBackgroundWrapper background={extractBackground(landingPage.experiencesData)}>
            <AnimateOnScroll variant="fade-up">
              <ExperiencesSection
                experiencesData={landingPage.experiencesData as unknown as Parameters<typeof ExperiencesSection>[0]["experiencesData"]}
              />
            </AnimateOnScroll>
          </SectionBackgroundWrapper>
        )}

        {/* 11. Education */}
        {hasEducation && (
          <SectionBackgroundWrapper background={extractBackground(landingPage.educationData)}>
            <AnimateOnScroll variant="fade-up">
              <EducationSection
                educationData={landingPage.educationData as unknown as Parameters<typeof EducationSection>[0]["educationData"]}
              />
            </AnimateOnScroll>
          </SectionBackgroundWrapper>
        )}

        {/* 12. Interests - disabled by design */}

        {/* 13. Banner */}
        {hasBanner && (
          <SectionBackgroundWrapper background={extractBackground(landingPage.bannerData)}>
            <AnimateOnScroll variant="fade-up">
              <BannerSection
                bannerData={landingPage.bannerData as unknown as Parameters<typeof BannerSection>[0]["bannerData"]}
              />
            </AnimateOnScroll>
          </SectionBackgroundWrapper>
        )}

        {/* 14. Focus On */}
        {hasFocusOn && (
          <SectionBackgroundWrapper background={extractBackground(landingPage.focusOnData)}>
            <AnimateOnScroll variant="fade-up">
              <FocusOnSection
                focusOnData={landingPage.focusOnData as unknown as Parameters<typeof FocusOnSection>[0]["focusOnData"]}
              />
            </AnimateOnScroll>
          </SectionBackgroundWrapper>
        )}

        {/* 15. Testimonials */}
        {hasTestimonials && (
          <SectionBackgroundWrapper background={extractBackground(landingPage.testimonialsData)}>
            <AnimateOnScroll variant="fade-up">
              <TestimonialsSection
                testimonialsData={landingPage.testimonialsData as unknown as Parameters<typeof TestimonialsSection>[0]["testimonialsData"]}
              />
            </AnimateOnScroll>
          </SectionBackgroundWrapper>
        )}

        {/* 16. Video */}
        {hasVideo && (
          <SectionBackgroundWrapper background={extractBackground(landingPage.videoData)}>
            <AnimateOnScroll variant="fade-up">
              <VideoSection
                videoData={landingPage.videoData as unknown as Parameters<typeof VideoSection>[0]["videoData"]}
              />
            </AnimateOnScroll>
          </SectionBackgroundWrapper>
        )}

        {/* 17. Portfolio */}
        {hasPortfolio && (
          <SectionBackgroundWrapper background={extractBackground(landingPage.portfolioData)}>
            <AnimateOnScroll variant="fade-up">
              <PortfolioSection
                portfolioData={landingPage.portfolioData as unknown as Parameters<typeof PortfolioSection>[0]["portfolioData"]}
              />
            </AnimateOnScroll>
          </SectionBackgroundWrapper>
        )}

        {/* 18. FAQ */}
        {hasFaq && (
          <SectionBackgroundWrapper background={extractBackground(landingPage.faqData)}>
            <AnimateOnScroll variant="fade-up">
              <FaqSection
                faqData={landingPage.faqData as unknown as Parameters<typeof FaqSection>[0]["faqData"]}
              />
            </AnimateOnScroll>
          </SectionBackgroundWrapper>
        )}

        {/* 19. Quote */}
        {hasQuote && (
          <SectionBackgroundWrapper background={extractBackground(landingPage.quoteData)}>
            <QuoteSection
              quoteData={landingPage.quoteData as unknown as Parameters<typeof QuoteSection>[0]["quoteData"]}
            />
          </SectionBackgroundWrapper>
        )}

        {/* Contact (always present) */}
        <AnimateOnScroll variant="fade-up">
          <ContactForm
            landingPageId={landingPage.id}
            consultantName={consultantFullName}
            consultantEmail={consultant.email}
            consultantPhone={consultant.phone ?? undefined}
            consultantImage={consultant.profileImage}
            consultantRole={consultant.role}
            consultantAddress={address || undefined}
            mapData={
              hasMap
                ? (landingPage.mapData as unknown as Parameters<typeof ContactForm>[0]["mapData"])
                : undefined
            }
          />
        </AnimateOnScroll>
      </main>

      {/* Footer (always present) */}
      <LandingFooter
        consultantName={consultantFullName}
        consultantRole={consultant.role}
        linkedinUrl={consultant.linkedinUrl}
        facebookUrl={consultant.facebookUrl}
        twitterUrl={consultant.twitterUrl}
        instagramUrl={consultant.instagramUrl}
        youtubeUrl={consultant.youtubeUrl}
        websiteUrl={consultant.websiteUrl}
      />
    </div>
  );
}
