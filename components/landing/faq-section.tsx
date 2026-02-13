"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/landing/animate-on-scroll";
import { InlineVideo } from "@/components/landing/inline-video";

interface FaqData {
  title?: string;
  subtitle?: string;
  videoUrl?: string;
  items: { question: string; answer: string }[];
}

interface FaqSectionProps {
  faqData: FaqData;
}

export function FaqSection({ faqData }: FaqSectionProps) {
  const { items } = faqData;
  if (!items || items.length === 0) return null;

  const title = faqData.title ?? "Domande Frequenti";

  return (
    <section id="faq" className="section-light py-12 lg:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p
            className="mb-4 text-sm font-medium uppercase tracking-[0.2em]"
            style={{ color: "var(--generali-gold, #D4A537)" }}
          >
            FAQ
          </p>
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            {title}
          </h2>
          <div
            className="mx-auto mt-6 h-0.5 w-16"
            style={{
              background: "linear-gradient(90deg, var(--theme-color, #C21D17), var(--generali-gold, #D4A537))",
            }}
          />
          {faqData.subtitle && (
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {faqData.subtitle}
            </p>
          )}
        </div>

        <StaggerContainer>
          <Accordion.Root type="single" collapsible className="space-y-4">
            {items.map((item, i) => (
              <StaggerItem key={i}>
                <Accordion.Item
                  value={`faq-${i}`}
                  className="card-bold overflow-hidden rounded-2xl bg-white"
                  style={{
                    boxShadow: "0 2px 12px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.03)",
                    border: "1px solid rgba(0,0,0,0.06)",
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  <Accordion.Trigger
                    className="flex w-full items-center justify-between gap-4 px-7 py-6 text-left text-lg font-semibold text-foreground transition-colors duration-300 hover:bg-[#FAFAF9] [&[data-state=open]>svg]:rotate-180"
                  >
                    <span className="flex-1">{item.question}</span>
                    <ChevronDown
                      className="h-5 w-5 shrink-0 text-muted-foreground/60 transition-transform duration-400 ease-[cubic-bezier(0.4,0,0.2,1)]"
                    />
                  </Accordion.Trigger>
                  <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                    <div className="px-7 pb-7">
                      {/* Premium divider */}
                      <div
                        className="mb-5 h-px w-full"
                        style={{
                          background: "linear-gradient(90deg, var(--theme-color, #C21D17), var(--generali-gold, #D4A537), transparent)",
                          opacity: 0.2,
                        }}
                      />
                      <p className="text-base leading-relaxed text-muted-foreground">
                        {item.answer}
                      </p>
                    </div>
                  </Accordion.Content>
                </Accordion.Item>
              </StaggerItem>
            ))}
          </Accordion.Root>
        </StaggerContainer>

        {faqData.videoUrl && (
          <InlineVideo url={faqData.videoUrl} />
        )}
      </div>
    </section>
  );
}
