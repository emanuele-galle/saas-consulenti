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
import { InlineVideo } from "@/components/landing/inline-video";

const ICON_MAP: Record<string, LucideIcon> = {
  Video, BookOpen, Mic, Globe, Megaphone, PenTool,
  Award, Users, TrendingUp, Target, Briefcase, Heart,
};

interface Skill {
  name: string;
  description?: string;
  icon?: string;
  imageIcon?: string;
  imageUrl?: string;
  linkUrl?: string;
  forWho?: string;
  whatWeDo?: string;
  benefit?: string;
}

interface SkillsData {
  title?: string;
  videoUrl?: string;
  skills: Skill[];
}

interface SkillsSectionProps {
  skillsData: SkillsData;
}

function SkillImage({ skill, className }: { skill: Skill; className?: string }) {
  const IconComponent = skill.icon ? ICON_MAP[skill.icon] : null;

  if (skill.imageUrl) {
    return (
      <div className={`relative w-full overflow-hidden ${className ?? "aspect-[16/10]"}`}>
        <Image
          src={skill.imageUrl}
          alt={skill.name}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          style={{ transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)" }}
          unoptimized
        />
        <div
          className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "linear-gradient(to top, rgba(194,29,23,0.15) 0%, transparent 60%)",
          }}
        />
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center ${className ?? "aspect-[16/10]"}`}
      style={{
        background: "rgba(194,29,23,0.05)",
      }}
    >
      {skill.imageIcon ? (
        <div className="relative h-16 w-16">
          <Image src={skill.imageIcon} alt={skill.name} fill className="object-contain" unoptimized />
        </div>
      ) : IconComponent ? (
        <div
          className="flex h-20 w-20 items-center justify-center rounded-2xl"
          style={{
            background:
              "linear-gradient(135deg, var(--theme-color, #C21D17), #E8312B)",
            boxShadow: "0 8px 24px rgba(194,29,23,0.2)",
          }}
        >
          <IconComponent className="h-10 w-10 text-white" />
        </div>
      ) : (
        <span
          className="text-5xl font-black"
          style={{ color: "var(--theme-color, #C21D17)", opacity: 0.15 }}
        >
          {skill.name.charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  );
}

function SkillTextContent({ skill }: { skill: Skill }) {
  return (
    <>
      <h3 className="text-xl font-bold text-[#1A1A1A]">{skill.name}</h3>
      {skill.description && (
        <p className="mt-3 text-base leading-[1.7] text-[#6B7280]">
          {skill.description}
        </p>
      )}
      {(skill.forWho || skill.whatWeDo || skill.benefit) && (
        <div className="mt-5 space-y-4 border-t border-[#E5E7EB]/60 pt-5">
          {skill.forWho && (
            <div>
              <span
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: "var(--theme-color, #C21D17)" }}
              >
                Destinatari
              </span>
              <p className="mt-1 text-sm leading-relaxed text-[#6B7280]">{skill.forWho}</p>
            </div>
          )}
          {skill.whatWeDo && (
            <div>
              <span
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: "var(--theme-color, #C21D17)" }}
              >
                Ambito di intervento
              </span>
              <p className="mt-1 text-sm leading-relaxed text-[#6B7280]">{skill.whatWeDo}</p>
            </div>
          )}
          {skill.benefit && (
            <div>
              <span
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: "var(--generali-gold, #D4A537)" }}
              >
                Valore generato
              </span>
              <p className="mt-1 text-sm font-medium text-[#1A1A1A]">{skill.benefit}</p>
            </div>
          )}
        </div>
      )}
    </>
  );
}

const hoverHandlers = {
  onMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    el.style.transform = "translateY(-4px)";
    el.style.boxShadow =
      "0 24px 60px rgba(0,0,0,0.1), 0 0 0 1px rgba(194,29,23,0.15)";
  },
  onMouseLeave: (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    el.style.transform = "translateY(0)";
    el.style.boxShadow = "";
  },
};

const accentLine = (
  <div
    className="h-1 w-0 transition-all duration-500 group-hover:w-full"
    style={{
      background: "var(--theme-color, #C21D17)",
      transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
    }}
  />
);

function SkillCard({ skill }: { skill: Skill }) {
  const card = (
    <div
      className="card-bold group h-full overflow-hidden rounded-2xl transition-all duration-500"
      style={{ transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)" }}
      {...hoverHandlers}
    >
      <SkillImage skill={skill} />
      <div className="p-8">
        <SkillTextContent skill={skill} />
      </div>
      {accentLine}
    </div>
  );

  if (skill.linkUrl) {
    return (
      <a href={skill.linkUrl} target="_blank" rel="noopener noreferrer" className="block h-full">
        {card}
      </a>
    );
  }
  return card;
}

function SkillCardHorizontal({ skill, reversed }: { skill: Skill; reversed: boolean }) {
  const card = (
    <div
      className="card-bold group overflow-hidden rounded-2xl transition-all duration-500"
      style={{ transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)" }}
      {...hoverHandlers}
    >
      <div className={`flex flex-col ${reversed ? "md:flex-row-reverse" : "md:flex-row"}`}>
        <SkillImage
          skill={skill}
          className="aspect-[16/10] md:aspect-auto md:w-1/2 md:min-h-[300px]"
        />
        <div className="flex flex-col justify-center p-8 md:w-1/2 md:px-10 lg:px-12">
          <SkillTextContent skill={skill} />
        </div>
      </div>
      {accentLine}
    </div>
  );

  if (skill.linkUrl) {
    return (
      <a href={skill.linkUrl} target="_blank" rel="noopener noreferrer" className="block">
        {card}
      </a>
    );
  }
  return card;
}

export function SkillsSection({ skillsData }: SkillsSectionProps) {
  const { skills } = skillsData;

  if (!skills || skills.length === 0) return null;

  const title = skillsData.title ?? "Competenze professionali";

  return (
    <section id="servizi" className="section-premium py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p
          className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.2em]"
          style={{ color: "var(--generali-gold, #D4A537)" }}
        >
          Servizi
        </p>
        <h2 className="font-display mb-12 text-center text-[clamp(2rem,4vw,3.25rem)] tracking-[-0.01em] text-[#1A1A1A]">
          {title}
        </h2>

        {skills.length % 2 !== 0 ? (
          <StaggerContainer className="flex flex-col gap-10">
            {skills.map((skill, index) => (
              <StaggerItem key={index}>
                <SkillCardHorizontal skill={skill} reversed={index % 2 !== 0} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        ) : (
          <StaggerContainer className="grid gap-10 md:grid-cols-2">
            {skills.map((skill, index) => (
              <StaggerItem key={index}>
                <SkillCard skill={skill} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}

        {skillsData.videoUrl && (
          <InlineVideo url={skillsData.videoUrl} />
        )}
      </div>
    </section>
  );
}
