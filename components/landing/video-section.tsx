"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, ChevronLeft, ChevronRight } from "lucide-react";
import { CustomVideoPlayer } from "@/components/landing/video-player";
import { BlurText } from "@/components/ui/blur-text";

interface VideoItem {
  id: string;
  url: string;
  title?: string;
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

/* ── Helpers ──────────────────────────────────────────────── */

function getYouTubeId(url: string): string | null {
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/,
  );
  return m ? m[1] : null;
}

function getThumbnailUrl(url: string): string | null {
  const ytId = getYouTubeId(url);
  if (ytId) return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
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

/* ── Normalize data (backward compat) ────────────────────── */

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

/* ── Section Header ──────────────────────────────────────── */

function VideoSectionHeader({ videoData }: { videoData: VideoData }) {
  return (
    <>
      {videoData.title && (
        <p
          className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.3em]"
          style={{ color: "var(--generali-gold, #D4A537)" }}
        >
          Video
        </p>
      )}
      {videoData.title && (
        <h2 className="mb-4 text-center text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
          <BlurText text={videoData.title} delay={60} />
        </h2>
      )}
      {videoData.description && (
        <p className="mx-auto mb-14 max-w-2xl text-center text-white/50">
          {videoData.description}
        </p>
      )}
    </>
  );
}

/* ── Video Grid Card (16:9 thumbnail + title) ────────────── */

function VideoGridCard({
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
  const thumbnail = getThumbnailUrl(video.url);

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      onClick={onClick}
      className="group w-full text-left"
    >
      <div className="relative overflow-hidden rounded-2xl border border-white/10 transition-all group-hover:border-white/20 group-hover:shadow-lg group-hover:shadow-black/40">
        <div
          className="relative w-full overflow-hidden"
          style={{ aspectRatio: "16/9" }}
        >
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={video.title || "Video"}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, var(--theme-color, #c21d17) 0%, #1a1a1a 60%, #0a0a0a 100%)",
              }}
            />
          )}

          <div className="absolute inset-0 bg-black/30 transition-colors group-hover:bg-black/20" />

          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={`flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-all group-hover:scale-110 group-hover:bg-white/30 ${
                featured ? "h-16 w-16" : "h-12 w-12"
              }`}
            >
              <Play
                className={`fill-white text-white ml-0.5 ${
                  featured ? "h-7 w-7" : "h-5 w-5"
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      {video.title && (
        <p
          className={`mt-3 font-medium text-white/80 transition-colors group-hover:text-white ${
            featured ? "text-base" : "text-sm"
          }`}
        >
          {video.title}
        </p>
      )}
    </motion.button>
  );
}

/* ── Modal Player (16:9, with CustomVideoPlayer) ─────────── */

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
      if (e.key === "ArrowUp" && hasMultiple) {
        e.preventDefault();
        goPrev();
      }
      if (e.key === "ArrowDown" && hasMultiple) {
        e.preventDefault();
        goNext();
      }
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
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
        aria-label="Chiudi"
      >
        <X className="h-5 w-5" />
      </button>

      {hasMultiple && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            className="absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-4"
            aria-label="Video precedente"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            className="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-4"
            aria-label="Video successivo"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Video player — 16:9 aspect */}
      <div
        className="relative mx-auto w-full max-w-4xl px-4"
        style={{ maxHeight: "85vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <CustomVideoPlayer
          key={`${current.id}-${currentIndex}`}
          videoUrl={current.url}
          aspectRatio="16:9"
          autoPlay
        />
      </div>

      <div className="absolute bottom-6 left-0 right-0 text-center">
        {current.title && (
          <p className="mb-1 text-sm font-medium text-white">
            {current.title}
          </p>
        )}
        {hasMultiple && (
          <p className="text-xs text-white/50">
            {currentIndex + 1} / {videos.length}
          </p>
        )}
      </div>
    </motion.div>
  );
}

/* ── Main Section ─────────────────────────────────────────── */

export function VideoSection({ videoData }: VideoSectionProps) {
  const videos = normalizeVideos(videoData);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (videos.length === 0) return null;

  const sectionClass = "noise-overlay relative overflow-hidden py-24 sm:py-32";

  // Single video: inline 16:9 player
  if (videos.length === 1) {
    return (
      <section className={sectionClass}>
        <div className="absolute inset-0 bg-[#0a0a0a]" />
        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <VideoSectionHeader videoData={videoData} />
          <div className="shadow-2xl shadow-black/50 ring-1 ring-white/[0.08] rounded-2xl overflow-hidden">
            <CustomVideoPlayer videoUrl={videos[0].url} aspectRatio="16:9" />
          </div>
        </div>
      </section>
    );
  }

  // 2 videos: side by side grid
  if (videos.length === 2) {
    return (
      <section className={sectionClass}>
        <div className="absolute inset-0 bg-[#0a0a0a]" />
        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <VideoSectionHeader videoData={videoData} />
          <div className="grid gap-6 sm:grid-cols-2">
            {videos.map((video, i) => (
              <VideoGridCard
                key={video.id}
                video={video}
                index={i}
                onClick={() => setActiveIndex(i)}
              />
            ))}
          </div>
        </div>

        <AnimatePresence>
          {activeIndex !== null && (
            <VideoModal
              videos={videos}
              initialIndex={activeIndex}
              onClose={() => setActiveIndex(null)}
            />
          )}
        </AnimatePresence>
      </section>
    );
  }

  // 3+ videos: featured first + grid for the rest
  const [featured, ...rest] = videos;

  return (
    <section className={sectionClass}>
      <div className="absolute inset-0 bg-[#0a0a0a]" />
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <VideoSectionHeader videoData={videoData} />

        <div className="mb-6">
          <VideoGridCard
            video={featured}
            index={0}
            onClick={() => setActiveIndex(0)}
            featured
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {rest.map((video, i) => (
            <VideoGridCard
              key={video.id}
              video={video}
              index={i + 1}
              onClick={() => setActiveIndex(i + 1)}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activeIndex !== null && (
          <VideoModal
            videos={videos}
            initialIndex={activeIndex}
            onClose={() => setActiveIndex(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
