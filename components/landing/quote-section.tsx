"use client";

import { motion } from "framer-motion";

/* Large decorative SVG quote mark */
function QuoteMark({ className }: { className?: string }) {
  return (
    <svg
      width="64"
      height="48"
      viewBox="0 0 48 36"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M14.99 36c-2.5 0-4.77-.98-6.8-2.95C6.16 31.08 5.14 28.83 5.14 26.3c0-3.5 1.07-6.82 3.2-9.95 2.14-3.13 4.89-6.25 8.25-9.35l4.9 4.25c-2.13 1.88-3.82 3.63-5.05 5.25-1.24 1.62-1.85 3.48-1.85 5.6h5.4V36h-5zm23 0c-2.5 0-4.77-.98-6.8-2.95-2.04-1.97-3.05-4.22-3.05-6.75 0-3.5 1.07-6.82 3.2-9.95 2.14-3.13 4.89-6.25 8.25-9.35l4.9 4.25c-2.13 1.88-3.82 3.63-5.05 5.25-1.24 1.62-1.85 3.48-1.85 5.6h5.4V36h-5z"
        fill="currentColor"
      />
    </svg>
  );
}

interface QuoteData {
  text?: string;
  author?: string;
  style?: "centered" | "left-accent";
}

interface QuoteSectionProps {
  quoteData: QuoteData;
}

export function QuoteSection({ quoteData }: QuoteSectionProps) {
  const { text, author, style = "centered" } = quoteData;

  if (!text) return null;

  if (style === "left-accent") {
    return (
      <section className="py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div
            className="border-l-4 py-4 pl-8"
            style={{ borderColor: "var(--theme-color, #C21D17)" }}
          >
            <QuoteMark className="mb-4 h-8 w-10 text-[var(--theme-color,#C21D17)] opacity-30" />
            <blockquote className="text-xl font-medium leading-relaxed text-foreground sm:text-2xl">
              {text}
            </blockquote>
            {author && (
              <p className="mt-4 text-base text-muted-foreground">
                &mdash; {author}
              </p>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="noise-overlay relative overflow-hidden py-24 sm:py-32">
      {/* Layered gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #0c0c0c 0%, color-mix(in srgb, var(--theme-color, #c21d17) 4%, #080808) 50%, #0a0a0a 100%)",
        }}
      />
      {/* Top/bottom accent lines */}
      <div
        className="absolute left-0 top-0 h-px w-full"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--theme-color, #c21d17), var(--generali-gold, #D4A537), transparent)",
          opacity: 0.12,
        }}
      />
      <div
        className="absolute bottom-0 left-0 h-px w-full"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--generali-gold, #D4A537), var(--theme-color, #c21d17), transparent)",
          opacity: 0.12,
        }}
      />

      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <QuoteMark className="mx-auto mb-8 h-12 w-16 text-[var(--theme-color,#C21D17)] opacity-20" />
          <blockquote className="text-2xl font-light leading-relaxed tracking-tight text-white sm:text-3xl lg:text-[2.5rem] lg:leading-[1.3]">
            &ldquo;{text}&rdquo;
          </blockquote>
          {author && (
            <div className="mt-10 flex items-center justify-center gap-4">
              <div
                className="h-px w-8"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, var(--generali-gold, #D4A537))",
                }}
              />
              <p className="text-sm font-medium tracking-wide text-white/40">
                {author}
              </p>
              <div
                className="h-px w-8"
                style={{
                  background:
                    "linear-gradient(90deg, var(--generali-gold, #D4A537), transparent)",
                }}
              />
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
