"use client";

import { useState } from "react";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/landing/animate-on-scroll";
import { InlineVideo } from "@/components/landing/inline-video";

interface PortfolioItem {
  title: string;
  category: string;
  imageUrl?: string;
  description?: string;
  linkUrl?: string;
}

interface FocusArticle {
  title: string;
  excerpt?: string;
  imageUrl?: string;
  linkUrl: string;
}

interface PortfolioData {
  title?: string;
  videoUrl?: string;
  items: PortfolioItem[];
}

interface FocusOnData {
  title?: string;
  articles: FocusArticle[];
}

interface PortfolioSectionProps {
  portfolioData?: PortfolioData;
  focusOnData?: FocusOnData;
}

export function PortfolioSection({ portfolioData, focusOnData }: PortfolioSectionProps) {
  const [activeCategory, setActiveCategory] = useState("Tutti");

  // Merge portfolio items + focus-on articles into unified array
  const portfolioItems: PortfolioItem[] = portfolioData?.items ?? [];
  const focusItems: PortfolioItem[] = (focusOnData?.articles ?? []).map((a) => ({
    title: a.title,
    category: "In evidenza",
    imageUrl: a.imageUrl,
    description: a.excerpt,
    linkUrl: a.linkUrl,
  }));

  const allItems = [...portfolioItems, ...focusItems];
  if (allItems.length === 0) return null;

  const title = portfolioData?.title ?? "Portfolio";
  const categories = ["Tutti", ...Array.from(new Set(allItems.map((i) => i.category)))];
  const filtered = activeCategory === "Tutti"
    ? allItems
    : allItems.filter((i) => i.category === activeCategory);

  return (
    <section id="portfolio" className="section-warm py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p
            className="mb-4 text-sm font-medium uppercase tracking-[0.2em]"
            style={{ color: "var(--generali-gold, #D4A537)" }}
          >
            Portfolio
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
        </div>

        {/* Category filter tabs */}
        {categories.length > 2 && (
          <div className="mb-12 flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className="relative rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
                style={{
                  background: activeCategory === cat ? "var(--theme-color, #C21D17)" : "white",
                  color: activeCategory === cat ? "white" : "#6B7280",
                  boxShadow: activeCategory === cat
                    ? "0 4px 16px rgba(194,29,23,0.3), 0 1px 4px rgba(0,0,0,0.06)"
                    : "0 2px 8px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
                  transform: activeCategory === cat ? "translateY(-1px)" : "translateY(0)",
                }}
                onMouseEnter={(e) => {
                  if (activeCategory !== cat) {
                    e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)";
                    e.currentTarget.style.color = "#1A1A1A";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeCategory !== cat) {
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)";
                    e.currentTarget.style.color = "#6B7280";
                    e.currentTarget.style.transform = "translateY(0)";
                  }
                }}
              >
                {cat}
                {/* Active underline indicator */}
                {activeCategory === cat && (
                  <span
                    className="absolute -bottom-0.5 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full"
                    style={{ background: "var(--generali-gold, #D4A537)" }}
                  />
                )}
              </button>
            ))}
          </div>
        )}

        <StaggerContainer className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item, index) => (
            <StaggerItem key={index}>
              <div
                className="card-bold group overflow-hidden rounded-2xl bg-white"
                style={{
                  boxShadow: "0 4px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)",
                  transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 16px 48px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.06)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)";
                }}
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  {item.imageUrl ? (
                    <>
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-110"
                        unoptimized
                      />
                      {/* Gradient overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                      {/* Category badge on hover */}
                      <div className="absolute left-4 top-4 opacity-0 transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:opacity-100 group-hover:translate-y-0 translate-y-2">
                        <span
                          className="rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-white"
                          style={{
                            background: "var(--theme-color, #C21D17)",
                            boxShadow: "0 2px 8px rgba(194,29,23,0.3)",
                          }}
                        >
                          {item.category}
                        </span>
                      </div>
                      {/* Link icon on hover */}
                      {item.linkUrl && (
                        <div className="absolute bottom-4 right-4 opacity-0 transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:opacity-100 group-hover:translate-y-0 translate-y-2">
                          <span
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-white"
                            style={{
                              boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                            }}
                          >
                            <ExternalLink className="h-4 w-4 text-foreground" />
                          </span>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex h-full items-center justify-center bg-[#F0EDEA]">
                      <span
                        className="text-6xl font-black"
                        style={{ color: "color-mix(in srgb, var(--theme-color, #C21D17) 10%, transparent)" }}
                      >
                        {item.title.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <span
                    className="mb-2 inline-block text-xs font-semibold uppercase tracking-[0.15em]"
                    style={{ color: "var(--theme-color, #C21D17)" }}
                  >
                    {item.category}
                  </span>
                  <h3 className="text-base font-bold text-foreground">
                    {item.linkUrl ? (
                      <a
                        href={item.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-colors duration-300"
                        style={{ color: "inherit" }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = "var(--theme-color, #C21D17)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = "inherit";
                        }}
                      >
                        {item.title}
                      </a>
                    ) : (
                      item.title
                    )}
                  </h3>
                  {item.description && (
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {portfolioData?.videoUrl && (
          <InlineVideo url={portfolioData.videoUrl} />
        )}
      </div>
    </section>
  );
}
