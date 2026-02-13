"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { AnimateOnScroll } from "@/components/landing/animate-on-scroll";

interface MapData {
  latitude?: number;
  longitude?: number;
  zoom?: number;
  address?: string;
}

interface MapSectionProps {
  mapData: MapData;
}

export function MapSection({ mapData }: MapSectionProps) {
  const { latitude, longitude, zoom = 15, address } = mapData;

  // Don't render if no valid coordinates
  if (
    latitude == null ||
    longitude == null ||
    isNaN(latitude) ||
    isNaN(longitude) ||
    (latitude === 0 && longitude === 0)
  ) {
    return null;
  }

  const mapEmbedUrl = `https://maps.google.com/maps?q=${latitude},${longitude}&z=${zoom}&output=embed`;

  return (
    <section id="mappa" className="section-premium py-12 md:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <AnimateOnScroll variant="fade-up">
          <div className="mb-12 text-center">
            <p
              className="mb-3 text-xs font-semibold uppercase tracking-[0.15em]"
              style={{ color: "var(--generali-gold, #D4A537)" }}
            >
              Posizione
            </p>
            <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] font-extrabold leading-tight tracking-[-0.02em] text-foreground">
              Dove Trovarmi
            </h2>
            <div className="accent-line mx-auto mt-4" />
          </div>
        </AnimateOnScroll>

        {/* Map Container */}
        <AnimateOnScroll variant="scale">
          <div className="relative overflow-hidden rounded-2xl shadow-[0_8px_60px_rgba(0,0,0,0.1)]">
            <iframe
              src={mapEmbedUrl}
              width="100%"
              className="h-[400px] md:h-[500px]"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mappa posizione"
            />

            {/* Address Overlay Card */}
            {address && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
                className="absolute bottom-4 left-4 z-10 max-w-xs sm:bottom-6 sm:left-6"
              >
                <div
                  className="flex items-start gap-3 rounded-xl border border-white/20 bg-white/95 px-4 py-3 shadow-lg backdrop-blur-sm"
                  style={{
                    boxShadow:
                      "0 4px 24px rgba(0, 0, 0, 0.12), 0 1px 4px rgba(0, 0, 0, 0.06)",
                  }}
                >
                  <span
                    className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(194,29,23,0.1), rgba(212,165,55,0.08))",
                    }}
                  >
                    <MapPin
                      className="h-4 w-4"
                      style={{ color: "var(--theme-color, #C21D17)" }}
                    />
                  </span>
                  <p className="text-sm font-medium leading-snug text-[#1A1A1A]">
                    {address}
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
