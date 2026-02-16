"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { getVideoEmbedUrl } from "@/lib/video-utils";

interface CoverData {
  headline?: string;
  subheadline?: string;
  mainText?: string;
  ctaText?: string;
  ctaHref?: string;
  ctaSecondaryText?: string;
  ctaSecondaryLink?: string;
  backgroundImage?: string;
  backgroundGradient?: string;
  backgroundVideo?: string;
}

interface CoverSectionProps {
  consultant: {
    firstName: string;
    lastName: string;
    title?: string | null;
    role: string;
    profileImage?: string | null;
  };
  coverData: CoverData;
}

export function CoverSection({ consultant, coverData }: CoverSectionProps) {
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (typeof event.data === "string") {
        try {
          const data = JSON.parse(event.data);
          if (data.event === "ready" || data.event === "play" || data.method) {
            setVideoReady(true);
          }
        } catch { /* not JSON */ }
      }
      if (typeof event.data === "object" && event.data?.event === "onReady") {
        setVideoReady(true);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  const fullName = [consultant.title, consultant.firstName, consultant.lastName]
    .filter(Boolean)
    .join(" ");

  const headline = coverData.headline ?? fullName;
  const subheadline = coverData.subheadline ?? consultant.role;
  const ctaText = coverData.ctaText ?? "Scopri di più";
  const ctaHref = coverData.ctaHref ?? "#chi-sono";

  const videoEmbedUrl = coverData.backgroundVideo
    ? getVideoEmbedUrl(coverData.backgroundVideo)
    : null;

  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-[#0A0A0A]">
      {/* Background */}
      {videoEmbedUrl ? (
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[#0A0A0A]" />
          <iframe
            src={videoEmbedUrl}
            className={`absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2 transition-opacity duration-1000 ${videoReady ? "opacity-100" : "opacity-0"}`}
            allow="autoplay; fullscreen"
            style={{ border: 0, pointerEvents: "none" }}
            title="Background video"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        </div>
      ) : coverData.backgroundImage ? (
        <div className="absolute inset-0">
          <Image
            src={coverData.backgroundImage}
            alt=""
            fill
            className="object-cover"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#111] to-[#0A0A0A]" />
      )}

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl lg:max-w-none">
          <div className="text-center lg:text-left">
            {/* Accent line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
              className="mx-auto mb-6 h-[2px] w-12 origin-center lg:mx-0 lg:origin-left"
              style={{ background: "var(--generali-gold, #D4A537)" }}
            />

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="mb-4 text-sm font-medium tracking-wide text-white/60 sm:text-base"
            >
              {subheadline}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
              className="font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.95] tracking-[-0.02em] text-white"
            >
              {headline}
            </motion.h1>

            {coverData.mainText && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.55, ease: [0.4, 0, 0.2, 1] }}
                className="mt-5 max-w-2xl text-base leading-relaxed text-white/60 sm:text-lg"
              >
                {coverData.mainText}
              </motion.p>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7, ease: [0.4, 0, 0.2, 1] }}
              className="mt-8 flex flex-col items-center gap-4 sm:flex-row lg:justify-start"
            >
              <a
                href={ctaHref}
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-8 py-4 text-base font-semibold text-white transition-all duration-300 hover:shadow-[0_0_30px_rgba(194,29,23,0.3)]"
                style={{ backgroundColor: "var(--theme-color, #C21D17)" }}
              >
                <span className="relative z-10">{ctaText}</span>
                <svg className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              {coverData.ctaSecondaryText && coverData.ctaSecondaryLink && (
                <a
                  href={coverData.ctaSecondaryLink}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-8 py-4 text-base font-medium text-white/70 transition-all duration-300 hover:border-white/40 hover:text-white"
                >
                  {coverData.ctaSecondaryText}
                </a>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <a href="#chi-sono" className="flex flex-col items-center gap-2 text-white/30 hover:text-white/50 transition-colors" aria-label="Scorri">
          <span className="text-[10px] uppercase tracking-[0.2em]">Scorri</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </motion.div>
        </a>
      </motion.div>
    </section>
  );
}
