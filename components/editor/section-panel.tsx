"use client";

import type { ReactNode } from "react";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { LANDING_SECTIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ProfileEditor } from "@/components/editor/profile-editor";
import { CoverEditor } from "@/components/editor/cover-editor";
import { SummaryEditor } from "@/components/editor/summary-editor";
import { MapEditor } from "@/components/editor/map-editor";
import { SkillsEditor } from "@/components/editor/skills-editor";
import { ExperiencesEditor } from "@/components/editor/experiences-editor";
import { EducationEditor } from "@/components/editor/education-editor";
import { InterestsEditor } from "@/components/editor/interests-editor";
import { BannerEditor } from "@/components/editor/banner-editor";
import { FocusOnEditor } from "@/components/editor/focus-on-editor";
import { TestimonialsEditor } from "@/components/editor/testimonials-editor";
import { VideoEditor } from "@/components/editor/video-editor";
import { PortfolioEditor } from "@/components/editor/portfolio-editor";
import { QuoteEditor } from "@/components/editor/quote-editor";
import { ValuesEditor } from "@/components/editor/values-editor";
import { ProcessEditor } from "@/components/editor/process-editor";
import { MethodEditor } from "@/components/editor/method-editor";
import { StrengthsEditor } from "@/components/editor/strengths-editor";
import { FaqEditor } from "@/components/editor/faq-editor";
import { SectionBackgroundEditor } from "@/components/editor/section-background-editor";
import type { SectionBackground } from "@/components/editor/section-background-editor";

interface ConsultantAddress {
  address?: string | null;
  cap?: string | null;
  city?: string | null;
  province?: string | null;
}

interface SectionPanelProps {
  sections: Record<string, unknown>;
  onSectionChange: (sectionId: string, data: unknown) => void;
  consultantAddress?: ConsultantAddress;
  consultantId?: string;
}

/**
 * Safely casts an unknown JSON value to a Record, falling back to an empty object.
 */
function asRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return {};
}

function getSectionEditor(
  sectionId: string,
  data: unknown,
  onChange: (data: unknown) => void,
  consultantAddress?: ConsultantAddress,
  consultantId?: string,
): ReactNode {
  const record = asRecord(data);

  switch (sectionId) {
    case "cover":
      return (
        <CoverEditor
          data={record as Parameters<typeof CoverEditor>[0]["data"]}
          onChange={onChange}
        />
      );
    case "summary":
      return (
        <SummaryEditor
          data={record as Parameters<typeof SummaryEditor>[0]["data"]}
          onChange={onChange}
        />
      );
    case "map":
      return (
        <MapEditor
          data={record as Parameters<typeof MapEditor>[0]["data"]}
          onChange={onChange}
          consultantAddress={consultantAddress}
        />
      );
    case "skills":
      return (
        <SkillsEditor
          data={{ skills: [], ...record } as Parameters<typeof SkillsEditor>[0]["data"]}
          onChange={onChange}
        />
      );
    case "experiences":
      return (
        <ExperiencesEditor
          data={{ experiences: [], ...record } as Parameters<typeof ExperiencesEditor>[0]["data"]}
          onChange={onChange}
        />
      );
    case "education":
      return (
        <EducationEditor
          data={{ items: [], ...record } as Parameters<typeof EducationEditor>[0]["data"]}
          onChange={onChange}
        />
      );
    case "interests":
      return (
        <InterestsEditor
          data={{ interests: [], ...record } as Parameters<typeof InterestsEditor>[0]["data"]}
          onChange={onChange}
        />
      );
    case "banner":
      return (
        <BannerEditor
          data={record as Parameters<typeof BannerEditor>[0]["data"]}
          onChange={onChange}
        />
      );
    case "focusOn":
      return (
        <FocusOnEditor
          data={{ articles: [], ...record } as Parameters<typeof FocusOnEditor>[0]["data"]}
          onChange={onChange}
        />
      );
    case "testimonials":
      return (
        <TestimonialsEditor
          data={{ testimonials: [], ...record } as Parameters<typeof TestimonialsEditor>[0]["data"]}
          onChange={onChange}
        />
      );
    case "video":
      return (
        <VideoEditor
          data={{ videos: [], ...record } as Parameters<typeof VideoEditor>[0]["data"]}
          onChange={onChange}
        />
      );
    case "portfolio":
      return (
        <PortfolioEditor
          data={{ items: [], ...record } as Parameters<typeof PortfolioEditor>[0]["data"]}
          onChange={onChange}
        />
      );
    case "quote":
      return (
        <QuoteEditor
          data={record as Parameters<typeof QuoteEditor>[0]["data"]}
          onChange={onChange}
        />
      );
    case "values":
      return (
        <ValuesEditor
          data={{ items: [], ...record } as Parameters<typeof ValuesEditor>[0]["data"]}
          onChange={onChange}
        />
      );
    case "process":
      return (
        <ProcessEditor
          data={{ steps: [], ...record } as Parameters<typeof ProcessEditor>[0]["data"]}
          onChange={onChange}
        />
      );
    case "method":
      return (
        <MethodEditor
          data={{ phases: [], tools: [], ...record } as Parameters<typeof MethodEditor>[0]["data"]}
          onChange={onChange}
        />
      );
    case "strengths":
      return (
        <StrengthsEditor
          data={{ items: [], ...record } as Parameters<typeof StrengthsEditor>[0]["data"]}
          onChange={onChange}
        />
      );
    case "faq":
      return (
        <FaqEditor
          data={{ items: [], ...record } as Parameters<typeof FaqEditor>[0]["data"]}
          onChange={onChange}
        />
      );
    case "profile":
      return consultantId ? (
        <ProfileEditor consultantId={consultantId} />
      ) : (
        <p className="text-sm text-muted-foreground">
          ID consulente non disponibile.
        </p>
      );
    default:
      return (
        <p className="text-sm text-muted-foreground">
          Editor non disponibile per questa sezione.
        </p>
      );
  }
}

function isSectionFilled(sectionId: string, data: unknown): boolean {
  if (sectionId === "profile") return true; // Always filled from consultant data
  const record = asRecord(data);
  if (Object.keys(record).length === 0) return false;

  switch (sectionId) {
    case "cover":
      return !!(record.headline || record.backgroundImage || record.backgroundVideo || record.ctaText);
    case "summary":
      return !!(record.bio || record.quote || (Array.isArray(record.highlights) && record.highlights.length > 0));
    case "map":
      return !!((record.lat || record.latitude) && (record.lng || record.longitude));
    case "skills":
      return Array.isArray(record.skills) && record.skills.length > 0;
    case "experiences":
      return Array.isArray(record.experiences) && record.experiences.length > 0;
    case "education":
      return Array.isArray(record.items) && record.items.length > 0;
    case "interests":
      return Array.isArray(record.interests) && record.interests.length > 0;
    case "banner":
      return !!record.imageUrl;
    case "focusOn":
      return Array.isArray(record.articles) && record.articles.length > 0;
    case "testimonials":
      return Array.isArray(record.testimonials) && record.testimonials.length > 0;
    case "video":
      return !!(record.videoUrl || (Array.isArray(record.videos) && record.videos.length > 0));
    case "portfolio":
      return Array.isArray(record.items) && record.items.length > 0;
    case "quote":
      return !!record.text;
    case "values":
      return Array.isArray(record.items) && record.items.length > 0;
    case "process":
      return Array.isArray(record.steps) && record.steps.length > 0;
    case "method":
      return Array.isArray(record.phases) && record.phases.length > 0;
    case "strengths":
      return Array.isArray(record.items) && record.items.length > 0;
    case "faq":
      return Array.isArray(record.items) && record.items.length > 0;
    default:
      return false;
  }
}

const SECTIONS_WITHOUT_BACKGROUND = new Set(["cover", "profile"]);

export function SectionPanel({ sections, onSectionChange, consultantAddress, consultantId }: SectionPanelProps) {
  return (
    <Accordion.Root type="single" collapsible className="space-y-2">
      {LANDING_SECTIONS.map((section) => {
        const filled = isSectionFilled(section.id, sections[section.id]);
        const sectionRecord = asRecord(sections[section.id]);
        const currentBg = sectionRecord.background as SectionBackground | undefined;
        const showBgEditor = !SECTIONS_WITHOUT_BACKGROUND.has(section.id);

        const handleContentChange = (contentData: unknown) => {
          const content = asRecord(contentData);
          if (currentBg && currentBg.type !== "default") {
            content.background = currentBg;
          }
          onSectionChange(section.id, content);
        };

        const handleBackgroundChange = (bg: SectionBackground) => {
          const { background: _, ...content } = sectionRecord;
          onSectionChange(
            section.id,
            bg.type === "default" ? content : { ...content, background: bg },
          );
        };

        return (
        <Accordion.Item
          key={section.id}
          value={section.id}
          className="overflow-hidden rounded-lg border"
        >
          <Accordion.Trigger
            className={cn(
              "flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium",
              "hover:bg-muted/50 transition-colors",
              "data-[state=open]:bg-muted/50",
              "[&[data-state=open]>svg]:rotate-180",
            )}
          >
            <span className="flex items-center">
              <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                {section.number}
              </span>
              {section.label}
              <span
                className={cn(
                  "ml-2 h-2 w-2 rounded-full",
                  filled ? "bg-green-500" : "bg-gray-300",
                )}
              />
            </span>
            <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
          </Accordion.Trigger>
          <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
            <div className="px-4 pb-4 pt-2">
              {getSectionEditor(
                section.id,
                sections[section.id],
                handleContentChange,
                consultantAddress,
                consultantId,
              )}

              {showBgEditor && (
                <details className="mt-4 rounded-lg border p-3">
                  <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
                    Sfondo sezione
                  </summary>
                  <div className="mt-3">
                    <SectionBackgroundEditor
                      data={currentBg ?? { type: "default" }}
                      onChange={handleBackgroundChange}
                    />
                  </div>
                </details>
              )}
            </div>
          </Accordion.Content>
        </Accordion.Item>
        );
      })}
    </Accordion.Root>
  );
}
