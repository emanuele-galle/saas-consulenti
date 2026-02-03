"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Star, Upload, Loader2, X } from "lucide-react";
import { toast } from "sonner";

interface Testimonial {
  name: string;
  role: string;
  text: string;
  rating: number;
  imageUrl?: string;
}

interface TestimonialsData {
  testimonials?: Testimonial[];
}

interface TestimonialsEditorProps {
  data: TestimonialsData;
  onChange: (data: TestimonialsData) => void;
}

export function TestimonialsEditor({ data, onChange }: TestimonialsEditorProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(
    data.testimonials ?? []
  );
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const fileInputRefs = useRef<Map<number, HTMLInputElement>>(new Map());
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    onChangeRef.current({ testimonials });
  }, [testimonials]);

  function addTestimonial() {
    setTestimonials((prev) => [
      ...prev,
      { name: "", role: "", text: "", rating: 5 },
    ]);
  }

  function removeTestimonial(index: number) {
    setTestimonials((prev) => prev.filter((_, i) => i !== index));
  }

  function updateTestimonial(index: number, field: keyof Testimonial, value: string | number) {
    setTestimonials((prev) =>
      prev.map((t, i) => (i === index ? { ...t, [field]: value } : t))
    );
  }

  async function handleImageUpload(index: number, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingIndex(index);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const currentImage = testimonials[index]?.imageUrl;
      if (currentImage) {
        formData.append("replaceUrl", currentImage);
      }

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const result = await res.json();
      if (!res.ok) {
        toast.error(result.error || "Errore nell'upload");
        return;
      }

      updateTestimonial(index, "imageUrl", result.url);
      toast.success("Foto caricata");
    } catch {
      toast.error("Errore nell'upload");
    } finally {
      setUploadingIndex(null);
      const input = fileInputRefs.current.get(index);
      if (input) input.value = "";
    }
  }

  return (
    <div className="space-y-4">
      {testimonials.map((t, index) => (
        <div key={index} className="space-y-3 rounded-lg border p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Testimonianza {index + 1}</span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive"
              onClick={() => removeTestimonial(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Photo */}
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-muted">
              {t.imageUrl ? (
                <>
                  <Image
                    src={t.imageUrl}
                    alt={t.name || "Foto"}
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => updateTestimonial(index, "imageUrl", "")}
                    className="absolute -right-1 -top-1 rounded-full bg-destructive p-0.5 text-white"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </>
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs font-bold text-muted-foreground">
                  {t.name ? t.name.charAt(0).toUpperCase() : "?"}
                </div>
              )}
            </div>
            <div>
              <input
                ref={(el) => {
                  if (el) fileInputRefs.current.set(index, el);
                }}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageUpload(index, e)}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                onClick={() => fileInputRefs.current.get(index)?.click()}
                disabled={uploadingIndex === index}
              >
                {uploadingIndex === index ? (
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                ) : (
                  <Upload className="mr-1 h-3 w-3" />
                )}
                {t.imageUrl ? "Cambia" : "Foto"}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Nome</Label>
              <Input
                value={t.name}
                onChange={(e) => updateTestimonial(index, "name", e.target.value)}
                placeholder="Mario Rossi"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Ruolo</Label>
              <Input
                value={t.role}
                onChange={(e) => updateTestimonial(index, "role", e.target.value)}
                placeholder="Imprenditore"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Testo</Label>
            <Textarea
              value={t.text}
              onChange={(e) => updateTestimonial(index, "text", e.target.value)}
              placeholder="La mia esperienza..."
              rows={2}
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Valutazione</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => updateTestimonial(index, "rating", star)}
                  className="p-0.5"
                >
                  <Star
                    className={`h-5 w-5 ${
                      star <= t.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addTestimonial}
        className="w-full"
      >
        <Plus className="mr-1 h-4 w-4" />
        Aggiungi testimonianza
      </Button>
    </div>
  );
}
