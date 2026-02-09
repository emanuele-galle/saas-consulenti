"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadFieldProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
  /** Aspect hint for preview: "square" | "wide" */
  aspect?: "square" | "wide";
}

export function ImageUploadField({
  value,
  onChange,
  label,
  placeholder = "Clicca o trascina un'immagine",
  aspect = "wide",
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(
    async (file: File) => {
      setError(null);
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        if (value) {
          formData.append("replaceUrl", value);
        }
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error ?? "Errore upload");
          return;
        }
        onChange(data.url);
      } catch {
        setError("Errore di rete");
      } finally {
        setUploading(false);
      }
    },
    [value, onChange],
  );

  const handleFile = useCallback(
    (file: File | undefined) => {
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) {
        setError("File troppo grande (max 5 MB)");
        return;
      }
      if (
        !["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"].includes(
          file.type,
        )
      ) {
        setError("Formato non supportato (JPEG, PNG, WebP, GIF, SVG)");
        return;
      }
      upload(file);
    },
    [upload],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      handleFile(e.dataTransfer.files[0]);
    },
    [handleFile],
  );

  const handleRemove = useCallback(() => {
    onChange("");
    setError(null);
  }, [onChange]);

  // If there's a value (URL), show preview
  if (value) {
    return (
      <div className="space-y-1">
        {label && (
          <span className="text-xs font-medium text-muted-foreground">{label}</span>
        )}
        <div className="group relative inline-block">
          <img
            src={value}
            alt=""
            className={cn(
              "rounded-md border object-cover",
              aspect === "square" ? "h-16 w-16" : "h-20 w-32",
            )}
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -right-2 -top-2 rounded-full bg-destructive p-0.5 text-destructive-foreground opacity-0 shadow transition-opacity group-hover:opacity-100"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    );
  }

  // Drop zone / click to upload
  return (
    <div className="space-y-1">
      {label && (
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
      )}
      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={cn(
          "flex w-full items-center gap-2 rounded-md border border-dashed px-3 py-2 text-xs text-muted-foreground transition-colors",
          dragOver
            ? "border-primary bg-primary/5"
            : "border-input hover:border-primary/50 hover:bg-muted/50",
          uploading && "pointer-events-none opacity-60",
        )}
      >
        {uploading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Upload className="h-4 w-4 shrink-0" />
        )}
        <span className="truncate">
          {uploading ? "Caricamento..." : placeholder}
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
        className="hidden"
        onChange={(e) => {
          handleFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
