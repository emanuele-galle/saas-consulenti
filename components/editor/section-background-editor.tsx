"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, Loader2, X } from "lucide-react";
import { toast } from "sonner";

export interface SectionBackground {
  type: "default" | "color" | "image" | "video";
  color?: string;
  imageUrl?: string;
  videoUrl?: string;
  overlayOpacity?: number;
}

interface SectionBackgroundEditorProps {
  data: SectionBackground;
  onChange: (data: SectionBackground) => void;
}

export function SectionBackgroundEditor({ data, onChange }: SectionBackgroundEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  function update(patch: Partial<SectionBackground>) {
    onChange({ ...data, ...patch });
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      if (data.imageUrl) {
        formData.append("replaceUrl", data.imageUrl);
      }

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      if (!res.ok) {
        toast.error(result.error || "Errore nell'upload");
        return;
      }

      update({ imageUrl: result.url });
      toast.success("Immagine di sfondo caricata");
    } catch {
      toast.error("Errore nell'upload");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label>Tipo di sfondo</Label>
        <select
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={data.type}
          onChange={(e) => {
            const type = e.target.value as SectionBackground["type"];
            onChange({ type });
          }}
        >
          <option value="default">Default (tema sezione)</option>
          <option value="color">Colore personalizzato</option>
          <option value="image">Immagine</option>
          <option value="video">Video (YouTube / Vimeo)</option>
        </select>
      </div>

      {data.type === "color" && (
        <div className="space-y-1.5">
          <Label>Colore di sfondo</Label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={data.color || "#ffffff"}
              onChange={(e) => update({ color: e.target.value })}
              className="h-9 w-9 cursor-pointer rounded border border-input p-0.5"
            />
            <Input
              value={data.color || "#ffffff"}
              onChange={(e) => update({ color: e.target.value })}
              placeholder="#ffffff"
              className="flex-1"
            />
          </div>
        </div>
      )}

      {data.type === "image" && (
        <div className="space-y-2">
          <Label>Immagine di sfondo</Label>
          {data.imageUrl ? (
            <div className="relative overflow-hidden rounded-lg border">
              <div className="relative h-24 w-full">
                <Image
                  src={data.imageUrl}
                  alt="Sfondo sezione"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="absolute right-2 top-2 h-7 w-7"
                onClick={() => update({ imageUrl: undefined })}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="rounded-lg border-2 border-dashed p-3 text-center">
              <p className="text-xs text-muted-foreground">Nessuna immagine selezionata</p>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-2 h-4 w-4" />
            )}
            {uploading ? "Caricamento..." : data.imageUrl ? "Cambia immagine" : "Carica immagine"}
          </Button>

          <div className="space-y-1.5">
            <Label>Opacita overlay scuro ({data.overlayOpacity ?? 40}%)</Label>
            <input
              type="range"
              min={0}
              max={100}
              value={data.overlayOpacity ?? 40}
              onChange={(e) => update({ overlayOpacity: Number(e.target.value) })}
              className="w-full"
            />
          </div>
        </div>
      )}

      {data.type === "video" && (
        <div className="space-y-2">
          <div className="space-y-1.5">
            <Label>URL Video</Label>
            <Input
              value={data.videoUrl || ""}
              onChange={(e) => update({ videoUrl: e.target.value })}
              placeholder="https://youtube.com/watch?v=... o https://vimeo.com/..."
            />
            <p className="text-xs text-muted-foreground">
              Autoplay, muted, loop in background.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label>Opacita overlay scuro ({data.overlayOpacity ?? 50}%)</Label>
            <input
              type="range"
              min={0}
              max={100}
              value={data.overlayOpacity ?? 50}
              onChange={(e) => update({ overlayOpacity: Number(e.target.value) })}
              className="w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
}
