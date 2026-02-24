"use client";

import { useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImageUploadField } from "@/components/ui/image-upload-field";
import { Plus, Trash2 } from "lucide-react";

interface Skill {
  name: string;
  description?: string;
  icon?: string;
  imageIcon?: string;
  imageUrl?: string;
  linkUrl?: string;
  forWho?: string;
  whatWeDo?: string;
  benefit?: string;
}

interface SkillsData {
  skills: Skill[];
  videoUrl?: string;
}

interface SkillsFormValues {
  videoUrl: string;
  skills: Array<{ name: string; description: string; icon: string; imageIcon: string; imageUrl: string; linkUrl: string; forWho: string; whatWeDo: string; benefit: string }>;
}

interface SkillsEditorProps {
  data: SkillsData;
  onChange: (data: SkillsData) => void;
}

function toFormValues(data: SkillsData): SkillsFormValues {
  return {
    videoUrl: data.videoUrl ?? "",
    skills: (data.skills ?? []).map((s) => ({
      name: s.name,
      description: s.description ?? "",
      icon: s.icon ?? "",
      imageIcon: s.imageIcon ?? "",
      imageUrl: s.imageUrl ?? "",
      linkUrl: s.linkUrl ?? "",
      forWho: s.forWho ?? "",
      whatWeDo: s.whatWeDo ?? "",
      benefit: s.benefit ?? "",
    })),
  };
}

function toSkillsData(values: SkillsFormValues): SkillsData {
  return {
    videoUrl: values.videoUrl || undefined,
    skills: values.skills
      .filter((s) => s.name.trim() !== "")
      .map((s) => ({
        name: s.name,
        description: s.description || undefined,
        icon: s.icon || undefined,
        imageIcon: s.imageIcon || undefined,
        imageUrl: s.imageUrl || undefined,
        linkUrl: s.linkUrl || undefined,
        forWho: s.forWho || undefined,
        whatWeDo: s.whatWeDo || undefined,
        benefit: s.benefit || undefined,
      })),
  };
}

export function SkillsEditor({ data, onChange }: SkillsEditorProps) {
  const { register, control, watch } = useForm<SkillsFormValues>({
    defaultValues: toFormValues(data),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "skills",
  });

  useEffect(() => {
    const subscription = watch((values) => {
      onChange(toSkillsData(values as SkillsFormValues));
    });
    return () => subscription.unsubscribe();
  }, [watch, onChange]);

  return (
    <div className="space-y-4">
      <Label>Competenze professionali</Label>

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="space-y-2 rounded-lg border bg-muted/30 p-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Competenza {index + 1}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => remove(index)}
              className="h-7 w-7 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
          <Input
            placeholder="Nome competenza"
            {...register(`skills.${index}.name`)}
          />
          <Input
            placeholder="Descrizione (opzionale)"
            {...register(`skills.${index}.description`)}
          />
          <Input
            placeholder="Icona Lucide (opzionale, es. Video, BookOpen, Mic)"
            {...register(`skills.${index}.icon`)}
          />
          <Controller
            control={control}
            name={`skills.${index}.imageIcon`}
            render={({ field }) => (
              <ImageUploadField
                value={field.value}
                onChange={field.onChange}
                label="Icona immagine (opzionale)"
                placeholder="Carica icona"
                aspect="square"
              />
            )}
          />
          <Controller
            control={control}
            name={`skills.${index}.imageUrl`}
            render={({ field }) => (
              <ImageUploadField
                value={field.value}
                onChange={field.onChange}
                label="Foto servizio (opzionale)"
                placeholder="Carica immagine servizio"
                aspect="wide"
              />
            )}
          />
          <Input
            placeholder="Link dettaglio (opzionale, es. https://...)"
            {...register(`skills.${index}.linkUrl`)}
          />
          <Input
            placeholder="Per chi (opzionale, es. Famiglie, imprenditori)"
            {...register(`skills.${index}.forWho`)}
          />
          <Input
            placeholder="Cosa faccio (opzionale)"
            {...register(`skills.${index}.whatWeDo`)}
          />
          <Input
            placeholder="Beneficio (opzionale)"
            {...register(`skills.${index}.benefit`)}
          />
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => append({ name: "", description: "", icon: "", imageIcon: "", imageUrl: "", linkUrl: "", forWho: "", whatWeDo: "", benefit: "" })}
      >
        <Plus className="h-4 w-4" />
        Aggiungi competenza
      </Button>

      <div className="space-y-2 border-t pt-4">
        <Label htmlFor="skills-video">Video correlato (opzionale)</Label>
        <Input
          id="skills-video"
          placeholder="URL YouTube o Vimeo (es. https://youtube.com/watch?v=...)"
          {...register("videoUrl")}
        />
        <p className="text-xs text-muted-foreground">
          Se presente, il video viene mostrato nella sezione.
        </p>
      </div>
    </div>
  );
}
