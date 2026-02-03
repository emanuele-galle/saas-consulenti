"use client";

import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface SummaryData {
  bio?: string;
  highlights?: string[];
  quote?: string;
  imageUrl?: string;
}

interface SummaryFormValues {
  bio: string;
  highlights: Array<{ value: string }>;
  quote: string;
  imageUrl: string;
}

interface SummaryEditorProps {
  data: SummaryData;
  onChange: (data: SummaryData) => void;
}

function toFormValues(data: SummaryData): SummaryFormValues {
  return {
    bio: data.bio ?? "",
    highlights: (data.highlights ?? []).map((h) => ({ value: h })),
    quote: data.quote ?? "",
    imageUrl: data.imageUrl ?? "",
  };
}

function toSummaryData(values: SummaryFormValues): SummaryData {
  return {
    bio: values.bio || undefined,
    highlights: values.highlights
      .map((h) => h.value)
      .filter((v) => v.trim() !== ""),
    quote: values.quote || undefined,
    imageUrl: values.imageUrl || undefined,
  };
}

export function SummaryEditor({ data, onChange }: SummaryEditorProps) {
  const { register, control, watch } = useForm<SummaryFormValues>({
    defaultValues: toFormValues(data),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "highlights",
  });

  useEffect(() => {
    const subscription = watch((values) => {
      onChange(toSummaryData(values as SummaryFormValues));
    });
    return () => subscription.unsubscribe();
  }, [watch, onChange]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="summary-bio">Testo di presentazione</Label>
        <Textarea
          id="summary-bio"
          placeholder="Scrivi una breve descrizione professionale..."
          rows={5}
          {...register("bio")}
        />
        <p className="text-xs text-muted-foreground">
          Usa &quot;Invio&quot; per separare i paragrafi.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="summary-image">Immagine laterale (opzionale)</Label>
        <Input
          id="summary-image"
          placeholder="URL immagine (es. /uploads/foto.jpg)"
          {...register("imageUrl")}
        />
        <p className="text-xs text-muted-foreground">
          Se presente, viene mostrata affiancata al testo.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="summary-quote">Citazione / Motto (opzionale)</Label>
        <Input
          id="summary-quote"
          placeholder="Es. Il futuro si costruisce oggi"
          {...register("quote")}
        />
        <p className="text-xs text-muted-foreground">
          Viene mostrata con uno stile speciale sotto la bio.
        </p>
      </div>

      <div className="space-y-3">
        <Label>Punti di forza</Label>
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-2">
            <Input
              placeholder={`Punto di forza ${index + 1}`}
              {...register(`highlights.${index}.value`)}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => remove(index)}
              className="shrink-0 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ value: "" })}
        >
          <Plus className="h-4 w-4" />
          Aggiungi punto di forza
        </Button>
      </div>
    </div>
  );
}
