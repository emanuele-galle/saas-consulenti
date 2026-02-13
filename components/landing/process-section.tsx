"use client";

import { StaggerContainer, StaggerItem } from "@/components/landing/animate-on-scroll";
import { InlineVideo } from "@/components/landing/inline-video";

interface ProcessData {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  videoUrl?: string;
  steps: { title: string; description: string }[];
}

interface ProcessSectionProps {
  processData: ProcessData;
}

export function ProcessSection({ processData }: ProcessSectionProps) {
  const { steps } = processData;
  if (!steps || steps.length === 0) return null;

  const title = processData.title ?? "Come Lavoriamo Insieme";

  return (
    <section id="processo" className="section-dark py-12 lg:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <p
          className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.2em]"
          style={{ color: "var(--generali-gold, #D4A537)" }}
        >
          Processo
        </p>
        <h2 className="font-display mb-6 text-center text-[clamp(2rem,4vw,3.25rem)] tracking-[-0.01em] text-white">
          {title}
        </h2>
        {processData.subtitle && (
          <p className="mx-auto mb-12 max-w-2xl text-center text-lg leading-relaxed text-white/60">
            {processData.subtitle}
          </p>
        )}

        <StaggerContainer className="relative">
          {/* Vertical gradient line */}
          <div
            className="absolute left-6 top-0 h-full w-px md:left-8"
            style={{
              background:
                "linear-gradient(to bottom, var(--theme-color, #C21D17), var(--generali-gold, #D4A537))",
            }}
          />

          <div className="space-y-10">
            {steps.map((step, i) => (
              <StaggerItem key={i}>
                <div className="relative flex gap-8 md:gap-10">
                  {/* Number circle with glow */}
                  <div
                    className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white md:h-16 md:w-16 md:text-xl"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--theme-color, #C21D17), #E8312B)",
                      boxShadow:
                        "0 0 20px rgba(194,29,23,0.4), 0 4px 12px rgba(194,29,23,0.3)",
                    }}
                  >
                    {i + 1}
                  </div>

                  {/* Content card */}
                  <div
                    className="flex-1 rounded-xl px-6 py-5 md:px-8 md:py-6"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    <h3 className="text-xl font-bold text-white">
                      {step.title}
                    </h3>
                    {step.description && (
                      <p className="mt-3 text-base leading-[1.7] text-white/60">
                        {step.description}
                      </p>
                    )}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>

        {processData.ctaText && (
          <div className="mt-20 text-center">
            <a
              href={processData.ctaLink ?? "#contatti"}
              className="inline-block rounded-full px-10 py-4 text-lg font-bold text-white transition-all duration-500"
              style={{
                background:
                  "linear-gradient(135deg, var(--theme-color, #C21D17), #E8312B)",
                boxShadow: "0 8px 30px rgba(194,29,23,0.3)",
                transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.transform = "translateY(-2px)";
                el.style.boxShadow = "0 12px 40px rgba(194,29,23,0.45)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.transform = "translateY(0)";
                el.style.boxShadow = "0 8px 30px rgba(194,29,23,0.3)";
              }}
            >
              {processData.ctaText}
            </a>
          </div>
        )}

        {processData.videoUrl && (
          <InlineVideo url={processData.videoUrl} />
        )}
      </div>
    </section>
  );
}
