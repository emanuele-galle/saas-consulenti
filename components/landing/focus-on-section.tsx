"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { TextReveal, StaggerContainer, StaggerItem } from "@/components/landing/animate-on-scroll";
import { InlineVideo } from "@/components/landing/inline-video";

interface FocusArticle {
  title: string;
  excerpt?: string;
  imageUrl?: string;
  linkUrl: string;
}

interface FocusOnData {
  title?: string;
  videoUrl?: string;
  articles: FocusArticle[];
}

interface FocusOnSectionProps {
  focusOnData: FocusOnData;
}

export function FocusOnSection({ focusOnData }: FocusOnSectionProps) {
  const { articles } = focusOnData;

  if (!articles || articles.length === 0) {
    return null;
  }

  const title = focusOnData.title ?? "Focus On";

  return (
    <section className="section-warm py-12 lg:py-16">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p
            className="mb-4 text-sm font-medium uppercase tracking-[0.2em]"
            style={{ color: "var(--generali-gold, #D4A537)" }}
          >
            In evidenza
          </p>
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            <TextReveal text={title} />
          </h2>
          <div
            className="accent-line mx-auto mt-6 h-0.5 w-16"
            style={{
              background: "var(--theme-color, #C21D17)",
            }}
          />
        </div>

        <StaggerContainer className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, index) => (
            <StaggerItem key={index}>
              <a
                href={article.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group block h-full"
              >
                <div
                  className="card-bold h-full overflow-hidden rounded-2xl bg-white"
                  style={{
                    boxShadow: "0 4px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)",
                    transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.06)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)";
                  }}
                >
                  {article.imageUrl && (
                    <div className="relative aspect-video w-full overflow-hidden">
                      <Image
                        src={article.imageUrl}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-110"
                        unoptimized
                      />
                      {/* Gradient overlay for text readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="line-clamp-2 text-lg font-semibold leading-snug text-foreground transition-colors duration-300">
                      {article.title}
                    </h3>
                    {article.excerpt && (
                      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                        {article.excerpt}
                      </p>
                    )}
                    <span
                      className="mt-5 inline-flex items-center gap-2 text-sm font-semibold transition-all duration-300"
                      style={{ color: "var(--theme-color, #C21D17)" }}
                    >
                      Leggi di pi&ugrave;
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-x-2" />
                    </span>
                  </div>
                </div>
              </a>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {focusOnData.videoUrl && (
          <InlineVideo url={focusOnData.videoUrl} />
        )}
      </div>
    </section>
  );
}
