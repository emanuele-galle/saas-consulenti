"use client";

import { GraduationCap, Briefcase } from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/landing/animate-on-scroll";
import { InlineVideo } from "@/components/landing/inline-video";

interface Experience {
  company: string;
  role: string;
  period: string;
  description?: string;
}

interface EducationItem {
  institution: string;
  degree: string;
  year?: string;
}

interface ExperiencesData {
  title?: string;
  videoUrl?: string;
  experiences: Experience[];
}

interface EducationData {
  title?: string;
  videoUrl?: string;
  items: EducationItem[];
}

interface ExperiencesSectionProps {
  experiencesData?: ExperiencesData;
  educationData?: EducationData;
}

interface TimelineEntry {
  type: "experience" | "education";
  title: string;
  subtitle: string;
  period: string;
  description?: string;
}

function parseStartYear(period: string): number {
  const match = period.match(/\d{4}/);
  return match ? parseInt(match[0], 10) : 0;
}

export function ExperiencesSection({ experiencesData, educationData }: ExperiencesSectionProps) {
  // Build unified timeline
  const entries: TimelineEntry[] = [];

  if (experiencesData?.experiences) {
    const sorted = [...experiencesData.experiences].sort((a, b) => {
      return parseStartYear(b.period) - parseStartYear(a.period);
    });
    sorted.forEach((exp) => {
      entries.push({
        type: "experience",
        title: exp.role,
        subtitle: exp.company,
        period: exp.period,
        description: exp.description,
      });
    });
  }

  if (educationData?.items) {
    educationData.items.forEach((edu) => {
      entries.push({
        type: "education",
        title: edu.degree,
        subtitle: edu.institution,
        period: edu.year ?? "",
      });
    });
  }

  if (entries.length === 0) return null;

  return (
    <section className="section-premium py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Kicker */}
        <p
          className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.15em]"
          style={{ color: "var(--generali-gold, #D4A537)" }}
        >
          Percorso
        </p>

        {/* Title */}
        <h2 className="font-display mb-6 text-center text-[clamp(2rem,4vw,3.5rem)] tracking-[-0.02em] text-[#1A1A1A]">
          {experiencesData?.title ?? "Esperienze e formazione"}
        </h2>

        {/* Accent line */}
        <div className="accent-line mx-auto mb-10" />

        {/* Timeline */}
        <div className="mx-auto max-w-3xl">
          <StaggerContainer className="relative pl-10 md:pl-12">
            {/* Vertical gradient line */}
            <div
              className="absolute left-[9px] top-2 bottom-2 w-[3px] rounded-full md:left-[11px]"
              style={{
                background:
                  "linear-gradient(to bottom, var(--theme-color, #C21D17) 0%, var(--generali-gold, #D4A537) 100%)",
                opacity: 0.7,
              }}
            />

            {entries.map((entry, index) => {
              const isExperience = entry.type === "experience";
              const IconComponent = isExperience ? Briefcase : GraduationCap;

              return (
                <StaggerItem key={index} className="relative mb-10 last:mb-0">
                  {/* Timeline dot with icon */}
                  <div
                    className="absolute -left-[calc(2.5rem-3px)] top-3 flex h-7 w-7 items-center justify-center rounded-full border-[3px] border-white md:-left-[calc(3rem-3px)]"
                    style={{
                      background: isExperience
                        ? "var(--theme-color, #C21D17)"
                        : "var(--generali-gold, #D4A537)",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    }}
                  >
                    <IconComponent className="h-3.5 w-3.5 text-white" />
                  </div>

                  {/* Card */}
                  <div
                    className="group rounded-2xl bg-white p-6 md:p-7"
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
                    <div className="mb-3 flex flex-wrap items-center gap-3">
                      {/* Period badge */}
                      {entry.period && (
                        <span
                          className="rounded-full px-4 py-1 text-xs font-bold text-white"
                          style={{
                            background: isExperience
                              ? "linear-gradient(135deg, var(--theme-color, #C21D17), #e0342e)"
                              : "linear-gradient(135deg, var(--generali-gold, #D4A537), #e8c96a)",
                          }}
                        >
                          {entry.period}
                        </span>
                      )}

                      {/* Category icon with gradient bg */}
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-lg"
                        style={{
                          background: isExperience
                            ? "linear-gradient(135deg, rgba(194,29,23,0.1), rgba(194,29,23,0.05))"
                            : "linear-gradient(135deg, rgba(212,165,55,0.15), rgba(212,165,55,0.05))",
                        }}
                      >
                        <IconComponent
                          className="h-4 w-4"
                          style={{
                            color: isExperience
                              ? "var(--theme-color, #C21D17)"
                              : "var(--generali-gold, #D4A537)",
                          }}
                        />
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-[#1A1A1A]">{entry.title}</h3>
                    <p className="text-sm font-medium text-[#6B7280]">{entry.subtitle}</p>
                    {entry.description && (
                      <p className="mt-3 text-sm leading-relaxed text-[#6B7280]">
                        {entry.description}
                      </p>
                    )}
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>

        {(experiencesData?.videoUrl || educationData?.videoUrl) && (
          <InlineVideo url={(experiencesData?.videoUrl || educationData?.videoUrl)!} />
        )}
      </div>
    </section>
  );
}
