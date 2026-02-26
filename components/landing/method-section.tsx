"use client";

import { Check } from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/landing/animate-on-scroll";
import { InlineVideo } from "@/components/landing/inline-video";

interface Phase {
  title: string;
  subtitle?: string;
  description: string;
  bullets?: string[];
}

interface Tool {
  name: string;
  description: string;
}

interface MethodData {
  title?: string;
  subtitle?: string;
  videoUrl?: string;
  phases: Phase[];
  tools?: Tool[];
}

interface MethodSectionProps {
  methodData: MethodData;
}

export function MethodSection({ methodData }: MethodSectionProps) {
  const { phases, tools } = methodData;
  if (!phases || phases.length === 0) return null;

  const title = methodData.title ?? "Il Mio Metodo";

  return (
    <section id="metodo" className="section-premium py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p
          className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.2em]"
          style={{ color: "var(--generali-gold, #D4A537)" }}
        >
          Metodo
        </p>
        <h2 className="font-display mb-6 text-center text-[clamp(2rem,4vw,3.25rem)] tracking-[-0.01em] text-[#1A1A1A]">
          {title}
        </h2>
        {methodData.subtitle && (
          <p className="mx-auto mb-12 max-w-2xl text-center text-lg leading-relaxed text-[#6B7280]">
            {methodData.subtitle}
          </p>
        )}

        {/* Phases grid */}
        <StaggerContainer
          className={`grid gap-8 ${
            phases.length <= 2 ? "md:grid-cols-2" : "md:grid-cols-3"
          }`}
        >
          {phases.map((phase, i) => (
            <StaggerItem key={i}>
              <div
                className="group h-full overflow-hidden rounded-2xl bg-white transition-all duration-500"
                style={{
                  boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
                  border: "1px solid rgba(229,231,235,0.8)",
                  transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.transform = "translateY(-4px)";
                  el.style.boxShadow = "0 20px 50px rgba(0,0,0,0.1)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.transform = "translateY(0)";
                  el.style.boxShadow = "0 4px 24px rgba(0,0,0,0.06)";
                }}
              >
                {/* Top accent bar */}
                <div
                  className="h-1.5 w-full"
                  style={{
                    background: "var(--theme-color, #C21D17)",
                  }}
                />

                <div className="p-8">
                  <div
                    className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold text-white"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--theme-color, #C21D17), #E8312B)",
                      boxShadow: "0 4px 12px rgba(194,29,23,0.25)",
                    }}
                  >
                    {i + 1}
                  </div>
                  {phase.subtitle && (
                    <p
                      className="mb-1 text-xs font-semibold uppercase tracking-wider"
                      style={{ color: "var(--generali-gold, #D4A537)" }}
                    >
                      {phase.subtitle}
                    </p>
                  )}
                  <h3 className="mb-3 text-xl font-bold text-[#1A1A1A]">
                    {phase.title}
                  </h3>
                  <p className="mb-5 text-base leading-[1.7] text-[#6B7280]">
                    {phase.description}
                  </p>
                  {phase.bullets && phase.bullets.length > 0 && (
                    <ul className="space-y-3">
                      {phase.bullets.map((bullet, j) => (
                        <li key={j} className="flex items-start gap-3">
                          <span
                            className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                            style={{
                              background:
                                "linear-gradient(135deg, var(--theme-color, #C21D17), #E8312B)",
                            }}
                          >
                            <Check className="h-3 w-3 text-white" strokeWidth={3} />
                          </span>
                          <span className="text-sm leading-relaxed text-[#6B7280]">
                            {bullet}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Tools section */}
        {tools && tools.length > 0 && (
          <div className="mt-24">
            <h3 className="font-display mb-12 text-center text-2xl text-[#1A1A1A]">
              Strumenti
            </h3>
            <StaggerContainer
              className={`grid gap-6 ${
                tools.length <= 2 ? "md:grid-cols-2" : "md:grid-cols-3"
              }`}
            >
              {tools.map((tool, i) => (
                <StaggerItem key={i}>
                  <div
                    className="group rounded-xl p-7 transition-all duration-500"
                    style={{
                      background: "rgba(194,29,23,0.03)",
                      borderLeft: "4px solid var(--theme-color, #C21D17)",
                      transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget;
                      el.style.transform = "translateY(-2px)";
                      el.style.boxShadow = "0 8px 24px rgba(0,0,0,0.06)";
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget;
                      el.style.transform = "translateY(0)";
                      el.style.boxShadow = "none";
                    }}
                  >
                    <h4 className="mb-2 font-bold text-[#1A1A1A]">{tool.name}</h4>
                    <p className="text-sm leading-[1.7] text-[#6B7280]">{tool.description}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        )}

        {methodData.videoUrl && (
          <InlineVideo url={methodData.videoUrl} />
        )}
      </div>
    </section>
  );
}
