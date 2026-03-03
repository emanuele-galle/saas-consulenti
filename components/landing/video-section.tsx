"use client";

import { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, ChevronLeft, ChevronRight } from "lucide-react";

const CustomVideoPlayer = dynamic(
  () => import("@/components/landing/video-player").then((m) => m.CustomVideoPlayer),
  { loading: () => <div className="aspect-video w-full animate-pulse rounded-2xl bg-[#F0EDEA]" /> },
);

interface VideoItem {
  id: string;
  url: string;
  title?: string;
  aspectRatio?: "16:9" | "9:16";
}

interface VideoData {
  videoUrl?: string;
  title?: string;
  description?: string;
  videos?: VideoItem[];
}

interface VideoSectionProps {
  videoData: VideoData;
}

function getYouTubeId(url: string): string | null {
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/,
  );
  return m ? m[1] : null;
}

function getThumbnailUrl(url: string, hd = true): string | null {
  const ytId = getYouTubeId(url);
  if (ytId) return `https://img.youtube.com/vi/${ytId}/${hd ? "maxresdefault" : "hqdefault"}.jpg`;
  return null;
}

function getVideoSource(url: string): "youtube" | "vimeo" | null {
  if (getYouTubeId(url)) return "youtube";
  if (url.match(/vimeo\.com\/(\d+)/)) return "vimeo";
  return null;
}

function isValidVideoUrl(url: string): boolean {
  return !!getVideoSource(url);
}

function normalizeVideos(data: VideoData): VideoItem[] {
  const items: VideoItem[] = [];
  if (data.videos && data.videos.length > 0) {
    items.push(...data.videos.filter((v) => v.url && isValidVideoUrl(v.url)));
  }
  if (items.length === 0 && data.videoUrl && isValidVideoUrl(data.videoUrl)) {
    items.push({ id: "legacy", url: data.videoUrl, title: data.title });
  }
  return items;
}

/* -- Section Header -- */

function SectionHeader({ title, description }: { title?: string; description?: string }) {
  return (
    <div className="mb-10 text-center">
      <p
        className="mb-4 text-sm font-medium uppercase tracking-[0.2em]"
        style={{ color: "var(--accent-gold, #D4A537)" }}
      >
        Video
      </p>
      {title && (
        <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
          {title}
        </h2>
      )}
      <div
        className="mx-auto mt-6 h-0.5 w-16"
        style={{
          background: "var(--theme-color, #C21D17)",
        }}
      />
      {description && (
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}

/* -- Thumbnail Card -- */

function VideoCard({
  video,
  index,
  onClick,
  featured = false,
}: {
  video: VideoItem;
  index: number;
  onClick: () => void;
  featured?: boolean;
}) {
  const [hdFailed, setHdFailed] = useState(false);
  const thumbnail = getThumbnailUrl(video.url, !hdFailed);

  return (
    <motion.button
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.4, 0, 0.2, 1] }}
      onClick={onClick}
      className="group w-full text-left"
    >
      <div
        className="relative overflow-hidden rounded-2xl"
        style={{
          boxShadow: "0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)",
          transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-4px)";
          e.currentTarget.style.boxShadow = "0 16px 48px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.08)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)";
        }}
      >
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: video.aspectRatio === "9:16" ? "9/16" : "16/9" }}>
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={video.title || "Video"}
              fill
              sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 28vw"
              className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-110"
              onError={() => { if (!hdFailed) setHdFailed(true); }}
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(135deg, rgba(194,29,23,0.15) 0%, #0A0A0A 100%)",
              }}
            />
          )}

          {/* Dark overlay with smooth fade */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent transition-opacity duration-500 group-hover:from-black/40 group-hover:via-black/10" />

          {/* Premium play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={`flex items-center justify-center rounded-full transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-110 ${
                featured ? "h-20 w-20" : "h-14 w-14"
              }`}
              style={{
                background: "var(--theme-color, #C21D17)",
                boxShadow: "0 8px 32px rgba(194,29,23,0.4), 0 0 0 4px rgba(255,255,255,0.15)",
              }}
            >
              <Play
                className={`fill-white text-white ml-0.5 ${
                  featured ? "h-8 w-8" : "h-5 w-5"
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      {video.title && (
        <p
          className={`mt-4 font-semibold text-foreground transition-colors duration-300 ${
            featured ? "text-lg" : "text-sm"
          }`}
          style={{
            transition: "color 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--theme-color, #C21D17)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "";
          }}
        >
          {video.title}
        </p>
      )}
    </motion.button>
  );
}

/* -- Modal Player -- */

function VideoModal({
  videos,
  initialIndex,
  onClose,
}: {
  videos: VideoItem[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const current = videos[currentIndex];
  const hasMultiple = videos.length > 1;

  const goNext = useCallback(() => {
    setCurrentIndex((i) => (i + 1) % videos.length);
  }, [videos.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => (i - 1 + videos.length) % videos.length);
  }, [videos.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowUp" && hasMultiple) { e.preventDefault(); goPrev(); }
      if (e.key === "ArrowDown" && hasMultiple) { e.preventDefault(); goNext(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, goNext, goPrev, hasMultiple]);

  if (!current) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: "rgba(0,0,0,0.92)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full text-white transition-all duration-300"
        style={{
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.15)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.08)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
        }}
        aria-label="Chiudi"
      >
        <X className="h-5 w-5" />
      </button>

      {hasMultiple && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            className="absolute left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-white transition-all duration-300 sm:left-4"
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.08)";
            }}
            aria-label="Video precedente"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            className="absolute right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-white transition-all duration-300 sm:right-4"
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.08)";
            }}
            aria-label="Video successivo"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      <div
        className={`relative mx-auto w-full px-4 ${current.aspectRatio === "9:16" ? "max-w-sm" : "max-w-4xl"}`}
        style={{ maxHeight: "85vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="overflow-hidden rounded-2xl" style={{ boxShadow: "0 24px 64px rgba(0,0,0,0.5)" }}>
          <CustomVideoPlayer
            key={`${current.id}-${currentIndex}`}
            videoUrl={current.url}
            aspectRatio={current.aspectRatio || "16:9"}
            autoPlay
          />
        </div>
      </div>

      <div className="absolute bottom-6 left-0 right-0 text-center">
        {current.title && (
          <p className="mb-1 text-sm font-medium text-white/90">{current.title}</p>
        )}
        {hasMultiple && (
          <p className="text-xs text-white/40">
            {currentIndex + 1} / {videos.length}
          </p>
        )}
      </div>
    </motion.div>
  );
}

/* -- Main Section -- */

export function VideoSection({ videoData }: VideoSectionProps) {
  const videos = normalizeVideos(videoData);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (videos.length === 0) return null;

  // Single video: inline player
  if (videos.length === 1) {
    return (
      <section className="section-premium py-12 lg:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title={videoData.title} description={videoData.description} />
          <div
            className="overflow-hidden rounded-2xl"
            style={{ boxShadow: "0 16px 48px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.06)" }}
          >
            <CustomVideoPlayer videoUrl={videos[0].url} aspectRatio={videos[0].aspectRatio || "16:9"} />
          </div>
        </div>
      </section>
    );
  }

  // 2 videos: side by side
  if (videos.length === 2) {
    return (
      <section className="section-premium py-12 lg:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title={videoData.title} description={videoData.description} />
          <div className="grid gap-8 sm:grid-cols-2">
            {videos.map((video, i) => (
              <VideoCard key={video.id} video={video} index={i} onClick={() => setActiveIndex(i)} />
            ))}
          </div>
        </div>
        <AnimatePresence>
          {activeIndex !== null && (
            <VideoModal videos={videos} initialIndex={activeIndex} onClose={() => setActiveIndex(null)} />
          )}
        </AnimatePresence>
      </section>
    );
  }

  // 3+ videos: featured + grid
  const [featured, ...rest] = videos;

  return (
    <section className="section-premium py-12 lg:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionHeader title={videoData.title} description={videoData.description} />

        <div className="mb-8">
          <VideoCard video={featured} index={0} onClick={() => setActiveIndex(0)} featured />
        </div>

        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
          {rest.map((video, i) => (
            <VideoCard key={video.id} video={video} index={i + 1} onClick={() => setActiveIndex(i + 1)} />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activeIndex !== null && (
          <VideoModal videos={videos} initialIndex={activeIndex} onClose={() => setActiveIndex(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
