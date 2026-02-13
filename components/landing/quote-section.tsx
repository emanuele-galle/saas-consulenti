"use client";

import { motion } from "framer-motion";

/* Refined decorative SVG quote mark */
function QuoteMark({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      width="64"
      height="48"
      viewBox="0 0 64 48"
      fill="none"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <path
        d="M20 48c-3.33 0-6.36-1.31-9.07-3.93C8.24 41.44 6.86 38.44 6.86 35.07c0-4.67 1.42-9.09 4.27-13.27 2.85-4.17 6.52-8.33 11-12.47L28.66 15c-2.84 2.51-5.09 4.84-6.73 7-1.65 2.16-2.47 4.64-2.47 7.47h7.2V48H20zm30.67 0c-3.33 0-6.36-1.31-9.07-3.93-2.69-2.63-4.07-5.63-4.07-9 0-4.67 1.42-9.09 4.27-13.27 2.85-4.17 6.52-8.33 11-12.47L59.33 15c-2.84 2.51-5.09 4.84-6.73 7-1.65 2.16-2.47 4.64-2.47 7.47h7.2V48h-6.66z"
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
      <section className="section-light py-12 lg:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
            className="relative py-6 pl-10"
            style={{
              borderLeft: "4px solid transparent",
              borderImage: "linear-gradient(to bottom, var(--theme-color, #C21D17), var(--generali-gold, #D4A537)) 1",
            }}
          >
            {/* Decorative quote mark */}
            <QuoteMark
              className="mb-6 h-10 w-12"
              style={{
                color: "var(--theme-color, #C21D17)",
                opacity: 0.2,
              }}
            />
            <blockquote className="font-display text-2xl font-medium leading-relaxed text-foreground sm:text-3xl lg:text-[2rem] lg:leading-[1.4]">
              {text}
            </blockquote>
            {author && (
              <div className="mt-6 flex items-center gap-3">
                <div
                  className="h-px w-10"
                  style={{
                    background: "linear-gradient(90deg, var(--generali-gold, #D4A537), transparent)",
                  }}
                />
                <p className="text-base font-medium text-muted-foreground">
                  {author}
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="noise-overlay relative overflow-hidden py-12 lg:py-16">
      {/* Sophisticated layered gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #0a0a0a 0%, color-mix(in srgb, var(--theme-color, #C21D17) 3%, #060606) 40%, color-mix(in srgb, var(--generali-gold, #D4A537) 2%, #080808) 70%, #0a0a0a 100%)",
        }}
      />

      {/* Top accent line */}
      <div
        className="absolute left-0 top-0 h-px w-full"
        style={{
          background:
            "linear-gradient(90deg, transparent 10%, var(--theme-color, #C21D17), var(--generali-gold, #D4A537), transparent 90%)",
          opacity: 0.15,
        }}
      />
      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-0 h-px w-full"
        style={{
          background:
            "linear-gradient(90deg, transparent 10%, var(--generali-gold, #D4A537), var(--theme-color, #C21D17), transparent 90%)",
          opacity: 0.15,
        }}
      />

      {/* Subtle radial glow */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: "600px",
          height: "400px",
          background: "radial-gradient(ellipse at center, color-mix(in srgb, var(--generali-gold, #D4A537) 4%, transparent) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        >
          <QuoteMark
            className="mx-auto mb-10 h-14 w-16"
            style={{
              color: "var(--generali-gold, #D4A537)",
              opacity: 0.18,
            }}
          />
          <blockquote className="font-display text-2xl font-light leading-relaxed tracking-tight text-white sm:text-3xl lg:text-[2.75rem] lg:leading-[1.3]">
            &ldquo;{text}&rdquo;
          </blockquote>
          {author && (
            <div className="mt-12 flex items-center justify-center gap-5">
              <div
                className="h-px w-12"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, var(--generali-gold, #D4A537))",
                }}
              />
              <p
                className="text-sm font-semibold uppercase tracking-[0.15em]"
                style={{ color: "var(--generali-gold, #D4A537)", opacity: 0.6 }}
              >
                {author}
              </p>
              <div
                className="h-px w-12"
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
