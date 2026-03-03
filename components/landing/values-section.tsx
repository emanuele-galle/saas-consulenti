"use client";

import {
  Heart,
  Shield,
  Eye,
  Award,
  Users,
  Target,
  Briefcase,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/landing/animate-on-scroll";
import { InlineVideo } from "@/components/landing/inline-video";

const ICON_MAP: Record<string, LucideIcon> = {
  Heart, Shield, Eye, Award, Users, Target, Briefcase, TrendingUp,
};

interface ValuesData {
  title?: string;
  subtitle?: string;
  videoUrl?: string;
  items: { title: string; description: string; icon?: string }[];
}

interface ValuesSectionProps {
  valuesData: ValuesData;
}

export function ValuesSection({ valuesData }: ValuesSectionProps) {
  const { items } = valuesData;
  if (!items || items.length === 0) return null;

  const title = valuesData.title ?? "I Miei Valori";

  return (
    <section id="valori" className="section-light py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p
          className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.2em]"
          style={{ color: "var(--accent-gold, #D4A537)" }}
        >
          Valori
        </p>
        <h2 className="font-display mb-6 text-center text-[clamp(2rem,4vw,3.25rem)] tracking-[-0.01em] text-[#1A1A1A]">
          {title}
        </h2>
        {valuesData.subtitle && (
          <p className="mx-auto mb-12 max-w-2xl text-center text-lg leading-relaxed text-[#6B7280]">
            {valuesData.subtitle}
          </p>
        )}

        <StaggerContainer
          className={`grid gap-8 ${
            items.length <= 2
              ? "md:grid-cols-2"
              : items.length === 3
              ? "md:grid-cols-3"
              : "md:grid-cols-2 lg:grid-cols-4"
          }`}
        >
          {items.map((item, i) => {
            const IconComponent = item.icon ? ICON_MAP[item.icon] : null;
            return (
              <StaggerItem key={i}>
                <div
                  className="card-bold group h-full rounded-2xl p-8 transition-all duration-500"
                  style={{
                    transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget;
                    el.style.transform = "translateY(-4px)";
                    el.style.boxShadow =
                      "0 20px 50px rgba(0,0,0,0.08), 0 0 0 1px var(--theme-color, #C21D17)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget;
                    el.style.transform = "translateY(0)";
                    el.style.boxShadow = "";
                  }}
                >
                  {IconComponent && (
                    <div
                      className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-xl"
                      style={{
                        background:
                          "linear-gradient(135deg, var(--theme-color, #C21D17), #E8312B)",
                        boxShadow: "0 4px 14px rgba(194,29,23,0.25)",
                      }}
                    >
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                  )}
                  <h3 className="mb-3 text-lg font-bold text-[#1A1A1A]">
                    {item.title}
                  </h3>
                  <p className="text-base leading-[1.7] text-[#6B7280]">
                    {item.description}
                  </p>
                  <div
                    className="accent-line mt-5 h-0.5 w-0 transition-all duration-500 group-hover:w-full"
                    style={{
                      background: "var(--theme-color, #C21D17)",
                      transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  />
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        {valuesData.videoUrl && (
          <InlineVideo url={valuesData.videoUrl} />
        )}
      </div>
    </section>
  );
}
