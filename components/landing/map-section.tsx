"use client";

import { MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlurText } from "@/components/ui/blur-text";

interface MapData {
  latitude: number;
  longitude: number;
  zoom?: number;
  address?: string;
}

interface MapSectionProps {
  mapData: MapData;
}

export function MapSection({ mapData }: MapSectionProps) {
  const hasValidCoords =
    mapData.latitude != null &&
    mapData.longitude != null &&
    !isNaN(mapData.latitude) &&
    !isNaN(mapData.longitude) &&
    (mapData.latitude !== 0 || mapData.longitude !== 0);

  if (!hasValidCoords) return null;

  const zoom = mapData.zoom ?? 15;
  const embedUrl = `https://maps.google.com/maps?q=${mapData.latitude},${mapData.longitude}&z=${zoom}&output=embed`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${mapData.latitude},${mapData.longitude}`;

  return (
    <section className="noise-overlay relative overflow-hidden py-24 sm:py-32">
      <div className="absolute inset-0 bg-[#0b0b0b]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p
          className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.3em]"
          style={{ color: "var(--generali-gold, #D4A537)" }}
        >
          Dove trovarmi
        </p>
        <h2 className="mb-14 text-center text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
          <BlurText text="La mia sede" delay={80} />
        </h2>

        <div className="overflow-hidden rounded-2xl border border-white/[0.08] shadow-2xl shadow-black/40">
          <div className="relative h-[500px] w-full">
            <iframe
              src={embedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Posizione consulente"
            />
          </div>

          {mapData.address && (
            <div className="glass-heavy flex flex-col items-start justify-between gap-4 p-5 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(194,29,23,0.15), rgba(212,165,55,0.1))",
                  }}
                >
                  <MapPin className="h-5 w-5 shrink-0 text-[var(--theme-color,#C21D17)]" />
                </div>
                <p className="text-sm font-medium text-white/90">
                  {mapData.address}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08] hover:text-white"
                asChild
              >
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Navigation className="h-4 w-4" />
                  Indicazioni stradali
                </a>
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
