"use client";

import Image from "next/image";
import {
  Video,
  BookOpen,
  Mic,
  Globe,
  Megaphone,
  PenTool,
  Award,
  Users,
  TrendingUp,
  Target,
  Briefcase,
  Heart,
  type LucideIcon,
} from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/landing/animate-on-scroll";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { BlurText } from "@/components/ui/blur-text";

const ICON_MAP: Record<string, LucideIcon> = {
  Video,
  BookOpen,
  Mic,
  Globe,
  Megaphone,
  PenTool,
  Award,
  Users,
  TrendingUp,
  Target,
  Briefcase,
  Heart,
};

interface Skill {
  name: string;
  description?: string;
  icon?: string;
  imageIcon?: string;
  imageUrl?: string;
  linkUrl?: string;
}

interface SkillsData {
  title?: string;
  skills: Skill[];
}

interface SkillsSectionProps {
  skillsData: SkillsData;
}

function PremiumCard({ skill }: { skill: Skill }) {
  const content = (
    <SpotlightCard
      className="group relative overflow-hidden rounded-2xl h-full"
      spotlightColor="rgba(255, 255, 255, 0.08)"
    >
      <div className="relative h-72 sm:h-80 w-full overflow-hidden">
        <Image
          src={skill.imageUrl!}
          alt={skill.name}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80" />
        <div className="absolute inset-x-0 bottom-0 p-7">
          <h3 className="text-xl font-bold text-white mb-2 tracking-tight">
            {skill.name}
          </h3>
          {skill.description && (
            <p className="text-sm leading-relaxed text-white/60">
              {skill.description}
            </p>
          )}
        </div>
      </div>
      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--theme-color, #c21d17), var(--generali-gold, #D4A537), transparent)",
        }}
      />
    </SpotlightCard>
  );

  if (skill.linkUrl) {
    return (
      <a href={skill.linkUrl} target="_blank" rel="noopener noreferrer" className="block h-full">
        {content}
      </a>
    );
  }
  return content;
}

function ClassicCard({ skill }: { skill: Skill }) {
  const IconComponent = skill.icon ? ICON_MAP[skill.icon] : null;

  const content = (
    <SpotlightCard
      className="card-premium gradient-border group flex h-full flex-col items-center rounded-2xl p-8 text-center"
      spotlightColor="rgba(194, 29, 23, 0.1)"
    >
      {skill.imageIcon ? (
        <div className="relative mb-6 h-16 w-16">
          <Image
            src={skill.imageIcon}
            alt={skill.name}
            fill
            className="object-contain"
          />
        </div>
      ) : IconComponent ? (
        <div
          className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110"
          style={{
            background:
              "linear-gradient(135deg, rgba(194,29,23,0.12), rgba(212,165,55,0.08))",
          }}
        >
          <IconComponent className="h-7 w-7 text-[var(--theme-color,#C21D17)]" />
        </div>
      ) : null}

      <h3 className="mb-3 text-lg font-semibold tracking-tight text-white">
        {skill.name}
      </h3>
      {skill.description && (
        <p className="text-sm leading-relaxed text-white/50">
          {skill.description}
        </p>
      )}
    </SpotlightCard>
  );

  if (skill.linkUrl) {
    return (
      <a href={skill.linkUrl} target="_blank" rel="noopener noreferrer" className="block h-full">
        {content}
      </a>
    );
  }
  return content;
}

export function SkillsSection({ skillsData }: SkillsSectionProps) {
  const { skills } = skillsData;

  if (!skills || skills.length === 0) {
    return null;
  }

  const title = skillsData.title ?? "Competenze professionali";
  const hasPremiumCards = skills.some((s) => s.imageUrl);

  return (
    <section
      id="competenze"
      className="noise-overlay relative overflow-hidden py-24 sm:py-32"
    >
      <div className="absolute inset-0 bg-[#0b0b0b]" />
      <div className="pointer-events-none absolute inset-0 line-pattern" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p
          className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.3em]"
          style={{ color: "var(--generali-gold, #D4A537)" }}
        >
          Servizi
        </p>
        <h2 className="mb-20 text-center text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
          <BlurText text={title} delay={60} />
        </h2>

        <StaggerContainer
          className={
            hasPremiumCards
              ? "grid gap-6 sm:grid-cols-2"
              : "grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          }
        >
          {skills.map((skill, index) => (
            <StaggerItem key={index}>
              {skill.imageUrl ? (
                <PremiumCard skill={skill} />
              ) : (
                <ClassicCard skill={skill} />
              )}
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
