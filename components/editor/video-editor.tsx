"use client";

import { useEffect, useCallback } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, GripVertical, ArrowUp, ArrowDown } from "lucide-react";

interface VideoItem {
  id: string;
  url: string;
  title?: string;
  aspectRatio?: "16:9" | "9:16";
}

interface VideoData {
  title?: string;
  description?: string;
  videoUrl?: string;
  videos?: VideoItem[];
}

interface VideoEditorProps {
  data: VideoData;
  onChange: (data: VideoData) => void;
}

function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function VideoEditor({ data, onChange }: VideoEditorProps) {
  // Normalize: migrate legacy single videoUrl into videos array
  const initialVideos: VideoItem[] =
    data.videos && data.videos.length > 0
      ? data.videos
      : data.videoUrl
        ? [{ id: "legacy", url: data.videoUrl, title: data.title }]
        : [];

  const { register, watch, control } = useForm<{
    title: string;
    description: string;
    videos: VideoItem[];
  }>({
    defaultValues: {
      title: data.title ?? "",
      description: data.description ?? "",
      videos: initialVideos,
    },
  });

  const { fields, append, remove, swap } = useFieldArray({
    control,
    name: "videos",
  });

  // Sync form changes to parent
  useEffect(() => {
    const subscription = watch((values) => {
      const videos = (values.videos ?? []).filter(
        (v): v is VideoItem => !!v && !!v.url,
      );
      onChange({
        title: values.title || undefined,
        description: values.description || undefined,
        videos,
        // Keep legacy videoUrl for backward compat (first video)
        videoUrl: videos[0]?.url,
      });
    });
    return () => subscription.unsubscribe();
  }, [watch, onChange]);

  const addVideo = useCallback(() => {
    append({ id: generateId(), url: "", title: "" });
  }, [append]);

  const moveUp = useCallback(
    (index: number) => {
      if (index > 0) swap(index, index - 1);
    },
    [swap],
  );

  const moveDown = useCallback(
    (index: number) => {
      if (index < fields.length - 1) swap(index, index + 1);
    },
    [swap, fields.length],
  );

  return (
    <div className="space-y-6">
      {/* Section title and description */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="video-section-title">Titolo sezione</Label>
          <Input
            id="video-section-title"
            placeholder="I miei video"
            {...register("title")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="video-section-desc">Descrizione sezione</Label>
          <Textarea
            id="video-section-desc"
            placeholder="Una breve descrizione della sezione video..."
            rows={2}
            {...register("description")}
          />
        </div>
      </div>

      {/* Videos list */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold">
            Video ({fields.length})
          </Label>
          <Button type="button" variant="outline" size="sm" onClick={addVideo}>
            <Plus className="mr-1 h-3.5 w-3.5" />
            Aggiungi video
          </Button>
        </div>

        {fields.length === 0 && (
          <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
            Nessun video aggiunto. Clicca &quot;Aggiungi video&quot; per
            inserire il primo video.
          </p>
        )}

        {fields.map((field, index) => (
          <div
            key={field.id}
            className="relative rounded-lg border bg-muted/30 p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <GripVertical className="h-4 w-4" />
                <span>Video {index + 1}</span>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  disabled={index === 0}
                  onClick={() => moveUp(index)}
                  title="Sposta su"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  disabled={index === fields.length - 1}
                  onClick={() => moveDown(index)}
                  title="Sposta giù"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive hover:text-destructive"
                  onClick={() => remove(index)}
                  title="Rimuovi"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor={`video-url-${index}`}>
                  URL Video (YouTube o Vimeo)
                </Label>
                <Input
                  id={`video-url-${index}`}
                  placeholder="https://www.youtube.com/shorts/... o https://vimeo.com/..."
                  {...register(`videos.${index}.url`)}
                />
                <p className="text-[11px] text-muted-foreground">
                  Supporta YouTube (anche Shorts), Vimeo. Il video verrà
                  incorporato senza link esterni.
                </p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor={`video-title-${index}`}>
                  Titolo (opzionale)
                </Label>
                <Input
                  id={`video-title-${index}`}
                  placeholder="Titolo del video"
                  {...register(`videos.${index}.title`)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor={`video-format-${index}`}>Formato</Label>
                <select
                  id={`video-format-${index}`}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  {...register(`videos.${index}.aspectRatio`)}
                >
                  <option value="16:9">Orizzontale (16:9)</option>
                  <option value="9:16">Verticale - Reel (9:16)</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
