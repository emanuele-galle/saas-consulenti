"use client";

import Image from "next/image";
import { Award } from "lucide-react";
import { TextReveal, StaggerContainer, StaggerItem } from "@/components/landing/animate-on-scroll";
import { InlineVideo } from "@/components/landing/inline-video";

interface EducationItem {
  institution: string;
  degree: string;
  year?: string;
  imageUrl?: string;
}

interface EducationData {
  title?: string;
  videoUrl?: string;
  items: EducationItem[];
}

interface EducationSectionProps {
  educationData: EducationData;
}

export function EducationSection({ educationData }: EducationSectionProps) {
  const { items } = educationData;

  if (!items || items.length === 0) {
    return null;
  }

  const title = educationData.title ?? "Le certificazioni";

  return (
    <section className="section-light py-12 lg:py-16">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Kicker */}
        <p
          className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.15em]"
          style={{ color: "var(--accent-gold, #D4A537)" }}
        >
          Certificazioni
        </p>

        {/* Title */}
        <h2 className="font-display mb-6 text-center text-[clamp(2rem,4vw,3.5rem)] tracking-[-0.02em] text-[#1A1A1A]">
          <TextReveal text={title} />
        </h2>

        {/* Accent line */}
        <div className="accent-line mx-auto mb-10" />

        {/* Cards */}
        <StaggerContainer className="mx-auto max-w-3xl space-y-6">
          {items.map((item, index) => (
            <StaggerItem key={index}>
              <div
                className="group relative flex items-start gap-5 overflow-hidden rounded-2xl bg-white p-7"
                style={{
                  boxShadow:
                    "0 1px 2px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06), 0 12px 40px rgba(0,0,0,0.04)",
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = "translateY(-4px)";
                  el.style.boxShadow =
                    "0 2px 4px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.08), 0 20px 60px rgba(0,0,0,0.06)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = "translateY(0)";
                  el.style.boxShadow =
                    "0 1px 2px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06), 0 12px 40px rgba(0,0,0,0.04)";
                }}
              >
                {/* Left border */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-1.5"
                  style={{
                    background: "var(--theme-color, #C21D17)",
                  }}
                />

                {/* Certification image or fallback icon */}
                {item.imageUrl ? (
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-gray-100">
                    <Image
                      src={item.imageUrl}
                      alt={item.degree}
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
                    style={{
                      background: "rgba(194,29,23,0.1)",
                    }}
                  >
                    <Award
                      className="h-5 w-5"
                      style={{ color: "var(--theme-color, #C21D17)" }}
                    />
                  </div>
                )}

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-bold text-[#1A1A1A]">
                    {item.degree}
                  </h3>
                  <p className="mt-0.5 text-sm font-medium text-[#6B7280]">
                    {item.institution}
                  </p>
                  {item.year && (
                    <span
                      className="mt-3 inline-flex items-center rounded-full px-4 py-1 text-xs font-bold text-white"
                      style={{
                        background: "var(--theme-color, #C21D17)",
                      }}
                    >
                      {item.year}
                    </span>
                  )}
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {educationData.videoUrl && (
          <InlineVideo url={educationData.videoUrl} />
        )}
      </div>
    </section>
  );
}
