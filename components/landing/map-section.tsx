import { MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const zoom = mapData.zoom ?? 15;
  const embedUrl = `https://maps.google.com/maps?q=${mapData.latitude},${mapData.longitude}&z=${zoom}&output=embed`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${mapData.latitude},${mapData.longitude}`;

  return (
    <section className="bg-[#0f0f0f] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-4 text-center text-sm font-medium uppercase tracking-[0.2em] text-white/40">
          Dove trovarmi
        </p>
        <h2 className="mb-12 text-center text-3xl font-bold text-white sm:text-4xl">
          La mia sede
        </h2>

        <div className="overflow-hidden rounded-2xl border border-white/10">
          {/* Map Embed */}
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

          {/* Address Bar */}
          {mapData.address && (
            <div className="flex flex-col items-start justify-between gap-4 bg-[#1a1a1a] p-5 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--theme-color,#C21D17)]/10">
                  <MapPin className="h-5 w-5 shrink-0 text-[var(--theme-color,#C21D17)]" />
                </div>
                <p className="text-sm font-medium text-white">{mapData.address}</p>
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
