"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { BlurText } from "@/components/ui/blur-text";

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
  };
}

/* Large decorative SVG quote mark */
function QuoteMark({ className }: { className?: string }) {
  return (
    <svg
      width="48"
      height="36"
      viewBox="0 0 48 36"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M14.99 36c-2.5 0-4.77-.98-6.8-2.95C6.16 31.08 5.14 28.83 5.14 26.3c0-3.5 1.07-6.82 3.2-9.95 2.14-3.13 4.89-6.25 8.25-9.35l4.9 4.25c-2.13 1.88-3.82 3.63-5.05 5.25-1.24 1.62-1.85 3.48-1.85 5.6h5.4V36h-5zm23 0c-2.5 0-4.77-.98-6.8-2.95-2.04-1.97-3.05-4.22-3.05-6.75 0-3.5 1.07-6.82 3.2-9.95 2.14-3.13 4.89-6.25 8.25-9.35l4.9 4.25c-2.13 1.88-3.82 3.63-5.05 5.25-1.24 1.62-1.85 3.48-1.85 5.6h5.4V36h-5z"
        fill="currentColor"
      />
    </svg>
  );
}

export function TestimonialsSection({
  testimonialsData,
}: TestimonialsSectionProps) {
  const testimonials = testimonialsData.testimonials ?? [];
  if (testimonials.length === 0) return null;

  return (
    <section className="noise-overlay relative overflow-hidden py-24 sm:py-32">
      {/* Rich layered background */}
      <div className="absolute inset-0 bg-[#0c0c0c]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, var(--theme-color, #c21d17), transparent)",
        }}
      />
      <div className="pointer-events-none absolute inset-0 dot-pattern" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p
          className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.3em]"
          style={{ color: "var(--generali-gold, #D4A537)" }}
        >
          Testimonianze
        </p>
        <h2 className="mb-20 text-center text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
          <BlurText text="Cosa dicono i clienti" delay={60} />
        </h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <SpotlightCard
              key={i}
              className="card-premium gradient-border rounded-2xl p-8"
              spotlightColor="rgba(194, 29, 23, 0.12)"
            >
              {/* Decorative quote */}
              <QuoteMark className="mb-6 h-8 w-10 text-[var(--theme-color,#C21D17)] opacity-20" />

              {/* Stars */}
              <div className="mb-5 flex gap-1">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star
                    key={s}
                    className={`h-3.5 w-3.5 ${
                      s < t.rating
                        ? "fill-[var(--generali-gold,#D4A537)] text-[var(--generali-gold,#D4A537)]"
                        : "text-white/15"
                    }`}
                  />
                ))}
              </div>

              {/* Quote text */}
              <p className="mb-8 text-[15px] leading-[1.7] text-white/70">
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Author */}
              <div className="mt-auto flex items-center gap-4 border-t border-white/[0.06] pt-6">
                {t.imageUrl ? (
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full ring-2 ring-white/[0.08]">
                    <Image
                      src={t.imageUrl}
                      alt={t.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--theme-color, #C21D17), var(--generali-gold, #D4A537))",
                    }}
                  >
                    {t.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  {t.role && (
                    <p className="text-xs text-white/40">{t.role}</p>
                  )}
                </div>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
}
