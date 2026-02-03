"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface CoverData {
  headline?: string;
  subheadline?: string;
  ctaText?: string;
  ctaHref?: string;
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

function getVideoEmbedUrl(url: string): string | null {
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  if (ytMatch) {
    return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&mute=1&loop=1&playlist=${ytMatch[1]}&controls=0&showinfo=0&modestbranding=1&rel=0&disablekb=1`;
  }

  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&muted=1&loop=1&background=1&title=0&byline=0&portrait=0`;
  }

  return null;
}

export function CoverSection({ consultant, coverData }: CoverSectionProps) {
  const fullName = [consultant.title, consultant.firstName, consultant.lastName]
    .filter(Boolean)
    .join(" ");

  const headline = coverData.headline ?? fullName;
  const subheadline = coverData.subheadline ?? consultant.role;
  const ctaText = coverData.ctaText ?? "Scopri di più";
  const ctaHref = coverData.ctaHref ?? "#chi-sono";

  const gradientClass =
    coverData.backgroundGradient ??
    "bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#0a0a0a]";

  const videoEmbedUrl = coverData.backgroundVideo
    ? getVideoEmbedUrl(coverData.backgroundVideo)
    : null;

  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
      {/* Background */}
      {videoEmbedUrl ? (
        <div className="absolute inset-0">
          <iframe
            src={videoEmbedUrl}
            className="absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2"
            allow="autoplay; fullscreen"
            style={{ border: 0, pointerEvents: "none" }}
            title="Background video"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />
        </div>
      ) : coverData.backgroundImage ? (
        <div className="absolute inset-0">
          <Image
            src={coverData.backgroundImage}
            alt=""
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />
        </div>
      ) : (
        <div className={`absolute inset-0 ${gradientClass}`} />
      )}

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        {consultant.profileImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8 flex justify-center"
          >
            <div className="relative h-28 w-28 overflow-hidden rounded-full border-2 border-white/20 shadow-2xl ring-4 ring-white/10 sm:h-36 sm:w-36">
              <Image
                src={consultant.profileImage}
                alt={fullName}
                fill
                className="object-cover"
                priority
              />
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            {headline}
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
          className="mt-6"
        >
          <p className="text-lg font-light uppercase tracking-[0.2em] text-white/60 sm:text-xl md:text-2xl">
            {subheadline}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.8, ease: "easeOut" }}
          className="mt-10"
        >
          <Button
            asChild
            size="lg"
            className="rounded-full px-8 py-6 text-base font-medium tracking-wide"
          >
            <a href={ctaHref}>{ctaText}</a>
          </Button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ChevronDown className="h-6 w-6 text-white/40" />
        </motion.div>
      </motion.div>
    </section>
  );
}
