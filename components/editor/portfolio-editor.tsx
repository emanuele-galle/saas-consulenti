"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Upload, Loader2, X } from "lucide-react";
import { toast } from "sonner";

const PORTFOLIO_CATEGORIES = [
  "Video",
  "Eventi",
  "Libri",
  "Web",
  "Comunicazione",
  "Altro",
] as const;

interface PortfolioItem {
  title: string;
  category: string;
  imageUrl?: string;
  description?: string;
  linkUrl?: string;
}

interface PortfolioData {
  items: PortfolioItem[];
}

interface PortfolioEditorProps {
  data: PortfolioData;
  onChange: (data: PortfolioData) => void;
}

export function PortfolioEditor({ data, onChange }: PortfolioEditorProps) {
  const [items, setItems] = useState<PortfolioItem[]>(data.items ?? []);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const fileInputRefs = useRef<Map<number, HTMLInputElement>>(new Map());
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    onChangeRef.current({ items });
  }, [items]);

  function addItem() {
    setItems((prev) => [
      ...prev,
      { title: "", category: "Altro", description: "", linkUrl: "" },
    ]);
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function updateItem(index: number, field: keyof PortfolioItem, value: string) {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  }

  async function handleImageUpload(index: number, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingIndex(index);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const currentImage = items[index]?.imageUrl;
      if (currentImage) {
        formData.append("replaceUrl", currentImage);
      }

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const result = await res.json();
      if (!res.ok) {
        toast.error(result.error || "Errore nell'upload");
        return;
      }

      updateItem(index, "imageUrl", result.url);
      toast.success("Immagine caricata");
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
      <Label>Progetti / Lavori</Label>

      {items.map((item, index) => (
        <div key={index} className="space-y-3 rounded-lg border bg-muted/30 p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Progetto {index + 1}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeItem(index)}
              className="h-7 w-7 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>

          <Input
            placeholder="Titolo progetto"
            value={item.title}
            onChange={(e) => updateItem(index, "title", e.target.value)}
          />

          <Select
            value={item.category}
            onValueChange={(val) => updateItem(index, "category", val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              {PORTFOLIO_CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Textarea
            placeholder="Descrizione breve (opzionale)"
            value={item.description || ""}
            onChange={(e) => updateItem(index, "description", e.target.value)}
            rows={2}
          />

          <Input
            placeholder="Link dettaglio (opzionale)"
            value={item.linkUrl || ""}
            onChange={(e) => updateItem(index, "linkUrl", e.target.value)}
          />

          {/* Image upload */}
          <div>
            {item.imageUrl ? (
              <div className="relative overflow-hidden rounded-lg border">
                <div className="relative h-24 w-full">
                  <Image
                    src={item.imageUrl}
                    alt={item.title || "Portfolio"}
                    fill
                    className="object-cover"
                  />
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  className="absolute right-2 top-2 h-7 w-7"
                  onClick={() => updateItem(index, "imageUrl", "")}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : null}
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
              className="mt-2"
              onClick={() => fileInputRefs.current.get(index)?.click()}
              disabled={uploadingIndex === index}
            >
              {uploadingIndex === index ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Upload className="mr-2 h-4 w-4" />
              )}
              {uploadingIndex === index
                ? "Caricamento..."
                : item.imageUrl
                  ? "Cambia immagine"
                  : "Carica immagine"}
            </Button>
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addItem}
        className="w-full"
      >
        <Plus className="mr-1 h-4 w-4" />
        Aggiungi progetto
      </Button>
    </div>
  );
}
