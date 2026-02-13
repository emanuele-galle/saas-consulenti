"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/landing/animate-on-scroll";
import { InlineVideo } from "@/components/landing/inline-video";

interface Testimonial {
  name: string;
  role: string;
  text: string;
  rating: number;
  imageUrl?: string;
}

interface TestimonialsSectionProps {
  testimonialsData: {
    testimonials?: Testimonial[];
    videoUrl?: string;
  };
}

/* Large decorative quote mark SVG */
function QuoteDecoration({ className }: { className?: string }) {
  return (
    <svg
      width="80"
      height="60"
      viewBox="0 0 80 60"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M24.98 60c-4.17 0-7.95-1.63-11.33-4.92C10.27 51.8 8.57 48.05 8.57 43.83c0-5.83 1.78-11.36 5.33-16.58C17.46 21.98 22.04 16.78 27.6 12.6l8.17 7.08c-3.55 3.14-6.37 6.06-8.42 8.75-2.06 2.7-3.08 5.8-3.08 9.34h9V60h-8.3zm38.33 0c-4.17 0-7.95-1.63-11.33-4.92-3.4-3.28-5.08-7.03-5.08-11.25 0-5.83 1.78-11.36 5.33-16.58 3.56-5.22 8.15-10.42 13.75-14.58l8.17 7.08c-3.55 3.14-6.37 6.06-8.42 8.75-2.06 2.7-3.08 5.8-3.08 9.34h9V60h-8.3z"
        fill="currentColor"
      />
    </svg>
  );
}

export function TestimonialsSection({ testimonialsData }: TestimonialsSectionProps) {
  const testimonials = testimonialsData.testimonials ?? [];
  if (testimonials.length === 0) return null;

  return (
    <section className="section-dark py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p
            className="mb-4 text-sm font-medium uppercase tracking-[0.2em]"
            style={{ color: "var(--generali-gold, #D4A537)" }}
          >
            Testimonial
          </p>
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Cosa dicono i clienti
          </h2>
          <div
            className="mx-auto mt-6 h-0.5 w-16"
            style={{
              background: "linear-gradient(90deg, var(--theme-color, #C21D17), var(--generali-gold, #D4A537))",
            }}
          />
        </div>

        <StaggerContainer className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <StaggerItem key={i}>
              <div
                className="card-glass relative flex h-full flex-col rounded-2xl p-8"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)",
                  transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)";
                  e.currentTarget.style.boxShadow = "0 16px 48px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)";
                }}
              >
                {/* Decorative quote mark */}
                <QuoteDecoration className="absolute -top-2 right-6 h-16 w-20 text-white/[0.04]" />

                {/* Star rating with gold gradient */}
                <div className="relative z-10 mb-5 flex gap-1.5">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star
                      key={s}
                      className="h-4.5 w-4.5"
                      style={{
                        fill: s < t.rating ? "var(--generali-gold, #D4A537)" : "transparent",
                        color: s < t.rating ? "var(--generali-gold, #D4A537)" : "rgba(255,255,255,0.12)",
                        filter: s < t.rating ? "drop-shadow(0 0 4px rgba(212,165,55,0.3))" : "none",
                      }}
                    />
                  ))}
                </div>

                {/* Quote text */}
                <p className="relative z-10 mb-8 flex-1 text-lg leading-relaxed text-white/80">
                  &ldquo;{t.text}&rdquo;
                </p>

                {/* Author */}
                <div className="relative z-10 flex items-center gap-4 border-t border-white/[0.08] pt-6">
                  {t.imageUrl ? (
                    <div
                      className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full"
                      style={{
                        boxShadow: "0 0 0 2px rgba(255,255,255,0.1), 0 0 0 4px rgba(212,165,55,0.15)",
                      }}
                    >
                      <Image
                        src={t.imageUrl}
                        alt={t.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                      style={{
                        background: "linear-gradient(135deg, var(--theme-color, #C21D17), var(--generali-gold, #D4A537))",
                        boxShadow: "0 0 0 2px rgba(255,255,255,0.1), 0 4px 12px rgba(194,29,23,0.3)",
                      }}
                    >
                      {t.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-white">{t.name}</p>
                    {t.role && (
                      <p className="text-sm text-white/45">{t.role}</p>
                    )}
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {testimonialsData.videoUrl && (
          <InlineVideo url={testimonialsData.videoUrl} />
        )}
      </div>
    </section>
  );
}
