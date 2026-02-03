"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, Loader2, X } from "lucide-react";
import { toast } from "sonner";

interface CoverData {
  headline?: string;
  subheadline?: string;
  ctaText?: string;
  backgroundImage?: string;
  backgroundVideo?: string;
}

interface CoverEditorProps {
  data: CoverData;
  onChange: (data: CoverData) => void;
}

export function CoverEditor({ data, onChange }: CoverEditorProps) {
  const { register, watch, setValue } = useForm<CoverData>({
    defaultValues: data,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const backgroundImage = watch("backgroundImage");
  const backgroundVideo = watch("backgroundVideo");

  useEffect(() => {
    const subscription = watch((values) => {
      onChange(values as CoverData);
    });
    return () => subscription.unsubscribe();
  }, [watch, onChange]);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      if (backgroundImage) {
        formData.append("replaceUrl", backgroundImage);
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

      setValue("backgroundImage", result.url);
      toast.success("Immagine di sfondo caricata");
    } catch {
      toast.error("Errore nell'upload");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function handleRemoveImage() {
    setValue("backgroundImage", "");
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="cover-headline">Titolo principale</Label>
        <Input
          id="cover-headline"
          placeholder='Es. "Benvenuto, sono Dott. Mario Rossi"'
          {...register("headline")}
        />
        <p className="text-xs text-muted-foreground">
          Se vuoto, viene generato automaticamente dal nome del consulente.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="cover-subheadline">Sottotitolo</Label>
        <Input
          id="cover-subheadline"
          placeholder="Es. Il tuo consulente finanziario di fiducia"
          {...register("subheadline")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="cover-cta">Testo pulsante CTA</Label>
        <Input
          id="cover-cta"
          placeholder="Es. Chiedi un appuntamento"
          {...register("ctaText")}
        />
      </div>

      <div className="space-y-2">
        <Label>Immagine di sfondo</Label>
        {backgroundImage ? (
          <div className="relative overflow-hidden rounded-lg border">
            <div className="relative h-32 w-full">
              <Image
                src={backgroundImage}
                alt="Sfondo cover"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute right-2 top-2 flex gap-1">
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="h-7 w-7"
                onClick={handleRemoveImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border-2 border-dashed p-4 text-center">
            <p className="text-xs text-muted-foreground">
              Se vuoto, viene usato un gradiente scuro di default.
            </p>
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
          {uploading ? "Caricamento..." : backgroundImage ? "Cambia immagine" : "Carica immagine"}
        </Button>
      </div>

      <div className="space-y-2">
        <Label htmlFor="cover-video">Video di sfondo (opzionale)</Label>
        <Input
          id="cover-video"
          placeholder="URL YouTube o Vimeo (es. https://vimeo.com/123456)"
          {...register("backgroundVideo")}
        />
        <p className="text-xs text-muted-foreground">
          Se presente, il video viene riprodotto in background (autoplay, muted, loop).
          Ha priorita rispetto all&apos;immagine.
        </p>
        {backgroundVideo && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setValue("backgroundVideo", "")}
            className="text-destructive"
          >
            <X className="mr-1 h-3 w-3" />
            Rimuovi video
          </Button>
        )}
      </div>
    </div>
  );
}
