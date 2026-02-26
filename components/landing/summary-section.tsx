"use client";

import Image from "next/image";
import { Check } from "lucide-react";
import { AnimateOnScroll } from "@/components/landing/animate-on-scroll";
import { InlineVideo } from "@/components/landing/inline-video";

interface SummaryData {
  bio?: string;
  highlights?: string[];
  quote?: string;
  imageUrl?: string;
  videoUrl?: string;
}

interface SummarySectionProps {
  summaryData: SummaryData;
  consultant?: {
    firstName: string;
    lastName: string;
    title?: string | null;
    profileImage?: string | null;
  };
}

export function SummarySection({ summaryData, consultant }: SummarySectionProps) {
  const { bio, highlights, quote, imageUrl } = summaryData;

  if (!bio && (!highlights || highlights.length === 0) && !quote) {
    return null;
  }

  const profilePhoto = imageUrl || consultant?.profileImage;
  const fullName = consultant
    ? [consultant.title, consultant.firstName, consultant.lastName].filter(Boolean).join(" ")
    : null;

  return (
    <section id="chi-sono" className="section-premium py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={`flex flex-col gap-14 ${
            profilePhoto ? "lg:flex-row lg:items-start lg:gap-20" : "mx-auto max-w-3xl"
          }`}
        >
          {/* Left: Photo */}
          {profilePhoto && (
            <AnimateOnScroll variant="fade-left" className="shrink-0 lg:w-5/12">
              <div>
                <div
                  className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl"
                  style={{
                    boxShadow:
                      "0 20px 60px rgba(0,0,0,0.12), 0 8px 24px rgba(0,0,0,0.08)",
                    border: "1px solid rgba(255,255,255,0.6)",
                  }}
                >
                  <Image
                    src={profilePhoto}
                    alt={fullName || "Chi sono"}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              </div>
            </AnimateOnScroll>
          )}

          {/* Right: Content */}
          <AnimateOnScroll variant="fade-right" className={profilePhoto ? "lg:w-7/12" : "w-full"}>
            <div>
              <p
                className="mb-3 text-xs font-semibold uppercase tracking-[0.2em]"
                style={{ color: "var(--generali-gold, #D4A537)" }}
              >
                Chi Sono
              </p>

              {fullName && (
                <h2 className="font-display mb-8 text-[clamp(2rem,4vw,3.25rem)] leading-tight tracking-[-0.01em] text-[#1A1A1A]">
                  {fullName}
                </h2>
              )}

              {bio && (
                <div className="mb-10 space-y-5">
                  {bio
                    .split("\n")
                    .filter(Boolean)
                    .map((paragraph, index) => (
                      <p
                        key={index}
                        className="text-lg leading-[1.8] text-[#4B5563]"
                      >
                        {paragraph}
                      </p>
                    ))}
                </div>
              )}

              {quote && (
                <blockquote
                  className="my-10 rounded-r-xl py-5 pl-7 pr-4"
                  style={{
                    borderLeft: "4px solid var(--theme-color, #C21D17)",
                    background:
                      "rgba(194,29,23,0.04)",
                  }}
                >
                  <p className="text-xl font-medium italic leading-relaxed text-[#1A1A1A]">
                    &ldquo;{quote}&rdquo;
                  </p>
                </blockquote>
              )}

              {highlights && highlights.length > 0 && (
                <ul className="mt-8 space-y-4">
                  {highlights.map((item, index) => (
                    <li key={index} className="flex items-start gap-4">
                      <span
                        className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                        style={{
                          background:
                            "linear-gradient(135deg, var(--generali-gold, #D4A537), #E8C060)",
                          boxShadow: "0 2px 8px rgba(212,165,55,0.3)",
                        }}
                      >
                        <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
                      </span>
                      <span className="text-base font-semibold leading-relaxed text-[#1A1A1A]">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </AnimateOnScroll>
        </div>

        {summaryData.videoUrl && (
          <InlineVideo url={summaryData.videoUrl} />
        )}
      </div>
    </section>
  );
}
