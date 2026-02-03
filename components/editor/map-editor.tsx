"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, MapPin, RefreshCw } from "lucide-react";

interface MapData {
  address?: string;
  latitude?: number;
  longitude?: number;
  zoom?: number;
}

interface ConsultantAddress {
  address?: string | null;
  cap?: string | null;
  city?: string | null;
  province?: string | null;
}

interface MapEditorProps {
  data: MapData;
  onChange: (data: MapData) => void;
  consultantAddress?: ConsultantAddress;
}

export function MapEditor({ data, onChange, consultantAddress }: MapEditorProps) {
  const { register, watch, setValue } = useForm<MapData>({
    defaultValues: {
      address: data.address ?? "",
      latitude: data.latitude ?? 0,
      longitude: data.longitude ?? 0,
      zoom: data.zoom ?? 15,
    },
  });

  const [isGeocoding, setIsGeocoding] = useState(false);

  useEffect(() => {
    const subscription = watch((values) => {
      onChange({
        address: values.address || undefined,
        latitude: values.latitude ? Number(values.latitude) : undefined,
        longitude: values.longitude ? Number(values.longitude) : undefined,
        zoom: values.zoom ? Number(values.zoom) : 15,
      });
    });
    return () => subscription.unsubscribe();
  }, [watch, onChange]);

  async function geocodeAddress(addressText: string) {
    if (!addressText.trim()) return;
    setIsGeocoding(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(addressText)}&format=json&limit=1`,
        { headers: { "User-Agent": "SaasGenerali/1.0" } }
      );
      const results = await response.json();
      if (results.length > 0) {
        const { lat, lon, display_name } = results[0];
        setValue("latitude", parseFloat(lat));
        setValue("longitude", parseFloat(lon));
        if (!watch("address")) {
          setValue("address", display_name);
        }
      } else {
        alert("Indirizzo non trovato. Prova con un indirizzo più specifico.");
      }
    } catch {
      alert("Errore durante la geocodifica. Riprova.");
    } finally {
      setIsGeocoding(false);
    }
  }

  function handleSyncFromProfile() {
    if (!consultantAddress) return;
    const parts = [
      consultantAddress.address,
      consultantAddress.cap,
      consultantAddress.city,
      consultantAddress.province,
    ].filter(Boolean);
    if (parts.length === 0) {
      alert("Nessun indirizzo configurato nel profilo del consulente.");
      return;
    }
    const fullAddress = parts.join(", ");
    setValue("address", fullAddress);
    geocodeAddress(fullAddress);
  }

  function handleGeocodeTyped() {
    const currentAddress = watch("address");
    if (!currentAddress) {
      alert("Inserisci un indirizzo prima di geocodificare.");
      return;
    }
    geocodeAddress(currentAddress);
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="map-address">Indirizzo completo</Label>
        <Input
          id="map-address"
          placeholder="Es. Via Roma 1, 20100 Milano MI"
          {...register("address")}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {consultantAddress && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleSyncFromProfile}
            disabled={isGeocoding}
          >
            {isGeocoding ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <RefreshCw className="h-3.5 w-3.5" />
            )}
            Sincronizza da profilo
          </Button>
        )}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleGeocodeTyped}
          disabled={isGeocoding}
        >
          {isGeocoding ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <MapPin className="h-3.5 w-3.5" />
          )}
          Geocodifica indirizzo
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="map-lat">Latitudine</Label>
          <Input
            id="map-lat"
            type="number"
            step="any"
            placeholder="Es. 45.4642"
            {...register("latitude", { valueAsNumber: true })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="map-lng">Longitudine</Label>
          <Input
            id="map-lng"
            type="number"
            step="any"
            placeholder="Es. 9.1900"
            {...register("longitude", { valueAsNumber: true })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="map-zoom">Livello di zoom</Label>
        <Input
          id="map-zoom"
          type="number"
          min={1}
          max={20}
          placeholder="15"
          {...register("zoom", { valueAsNumber: true })}
        />
        <p className="text-xs text-muted-foreground">
          Valore da 1 (mondo intero) a 20 (dettaglio massimo). Consigliato: 15.
        </p>
      </div>

      <p className="text-xs text-muted-foreground">
        Puoi trovare le coordinate su{" "}
        <a
          href="https://www.google.com/maps"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-primary hover:underline"
        >
          Google Maps
        </a>{" "}
        cliccando con il tasto destro sulla posizione desiderata.
      </p>
    </div>
  );
}
