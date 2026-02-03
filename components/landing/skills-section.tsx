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
    <div className="group relative overflow-hidden rounded-2xl border border-white/10">
      <div className="relative h-64 sm:h-72 w-full overflow-hidden">
        <Image
          src={skill.imageUrl!}
          alt={skill.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6">
          <h3 className="text-xl font-bold text-white mb-1">
            {skill.name}
          </h3>
          {skill.description && (
            <p className="text-sm leading-relaxed text-white/70">
              {skill.description}
            </p>
          )}
        </div>
      </div>
    </div>
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
    <div className="group flex h-full flex-col items-center rounded-2xl border border-white/10 bg-white/[0.04] p-8 text-center transition-all hover:border-white/20 hover:bg-white/[0.07]">
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
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--theme-color,#C21D17)]/10">
          <IconComponent className="h-8 w-8 text-[var(--theme-color,#C21D17)]" />
        </div>
      ) : null}

      <h3 className="mb-3 text-lg font-semibold text-white">
        {skill.name}
      </h3>
      {skill.description && (
        <p className="text-sm leading-relaxed text-white/60">
          {skill.description}
        </p>
      )}
    </div>
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
    <section id="competenze" className="bg-[#0f0f0f] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-4 text-center text-sm font-medium uppercase tracking-[0.2em] text-white/40">
          Servizi
        </p>
        <h2 className="mb-16 text-center text-3xl font-bold text-white sm:text-4xl">
          {title}
        </h2>

        <StaggerContainer
          className={
            hasPremiumCards
              ? "grid gap-8 sm:grid-cols-2"
              : "grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
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
