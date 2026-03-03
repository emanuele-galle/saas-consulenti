"use client";

import {
  Shield,
  Award,
  Heart,
  Users,
  Target,
  TrendingUp,
  Briefcase,
  Eye,
  type LucideIcon,
} from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/landing/animate-on-scroll";
import { InlineVideo } from "@/components/landing/inline-video";

const ICON_MAP: Record<string, LucideIcon> = {
  Shield, Award, Heart, Users, Target, TrendingUp, Briefcase, Eye,
};

interface StrengthsData {
  title?: string;
  subtitle?: string;
  videoUrl?: string;
  items: { title: string; description: string; icon?: string }[];
}

interface StrengthsSectionProps {
  strengthsData: StrengthsData;
}

export function StrengthsSection({ strengthsData }: StrengthsSectionProps) {
  const { items } = strengthsData;
  if (!items || items.length === 0) return null;

  const title = strengthsData.title ?? "Perche Scegliermi";

  return (
    <section
      id="punti-forza"
      className="section-warm py-12 lg:py-16"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Kicker */}
        <p
          className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.15em]"
          style={{ color: "var(--accent-gold, #D4A537)" }}
        >
          Punti di Forza
        </p>

        {/* Title */}
        <h2 className="font-display mb-6 text-center text-[clamp(2rem,4vw,3.5rem)] tracking-[-0.02em] text-white">
          {title}
        </h2>

        {/* Accent line */}
        <div className="accent-line mx-auto mb-6" />

        {strengthsData.subtitle && (
          <p className="mx-auto mb-10 max-w-2xl text-center text-lg leading-relaxed text-[#6B7280]">
            {strengthsData.subtitle}
          </p>
        )}

        {!strengthsData.subtitle && <div className="mb-10" />}

        {/* Cards grid */}
        <StaggerContainer
          className={`grid gap-8 ${
            items.length <= 2
              ? "md:grid-cols-2"
              : items.length === 3
              ? "md:grid-cols-3"
              : "md:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {items.map((item, i) => {
            const IconComponent = item.icon ? ICON_MAP[item.icon] : null;
            return (
              <StaggerItem key={i}>
                <div
                  className="group relative flex h-full overflow-hidden rounded-2xl bg-white"
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
                  {/* Left accent bar */}
                  <div
                    className="w-1.5 shrink-0"
                    style={{
                      background: "var(--theme-color, #C21D17)",
                    }}
                  />

                  <div className="flex flex-1 flex-col p-8">
                    <div className="mb-4 flex items-center gap-4">
                      {/* Icon with gradient background circle */}
                      {IconComponent && (
                        <div
                          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
                          style={{
                            background: "rgba(194,29,23,0.1)",
                          }}
                        >
                          <IconComponent
                            className="h-5 w-5"
                            style={{ color: "var(--theme-color, #C21D17)" }}
                          />
                        </div>
                      )}
                      <h3 className="text-lg font-bold text-[#1A1A1A]">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-base leading-relaxed text-[#6B7280]">
                      {item.description}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        {strengthsData.videoUrl && (
          <InlineVideo url={strengthsData.videoUrl} />
        )}
      </div>
    </section>
  );
}
