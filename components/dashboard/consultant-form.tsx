"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CONSULTANT_ROLES, CONSULTANT_NETWORKS, CONSULTANT_TITLES } from "@/lib/constants";
import { Camera, Loader2 } from "lucide-react";

const consultantFormSchema = z.object({
  email: z.string().email("Email non valida"),
  password: z.string().min(8, "Minimo 8 caratteri").optional(),
  firstName: z.string().min(1, "Nome obbligatorio"),
  lastName: z.string().min(1, "Cognome obbligatorio"),
  title: z.string().optional(),
  role: z.string().min(1, "Ruolo obbligatorio"),
  network: z.string().optional(),
  bio: z.string().optional(),
  themeColor: z.string().optional(),
  consultantEmail: z.string().email("Email non valida"),
  phone: z.string().optional(),
  mobile: z.string().optional(),
  address: z.string().optional(),
  cap: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  efpa: z.boolean(),
  efpaEsg: z.boolean(),
  sustainableAdvisor: z.boolean(),
  linkedinUrl: z.string().optional(),
  facebookUrl: z.string().optional(),
  twitterUrl: z.string().optional(),
  instagramUrl: z.string().optional(),
  tiktokUrl: z.string().optional(),
  youtubeUrl: z.string().optional(),
  websiteUrl: z.string().optional(),
});

export type ConsultantFormData = z.infer<typeof consultantFormSchema>;

interface ConsultantFormProps {
  defaultValues?: Partial<ConsultantFormData>;
  profileImageUrl?: string | null;
  onSubmit: (data: ConsultantFormData) => void;
  onProfileImageChange?: (url: string) => void;
  isLoading?: boolean;
  isEdit?: boolean;
}

export function ConsultantForm({
  defaultValues,
  profileImageUrl,
  onSubmit,
  onProfileImageChange,
  isLoading,
  isEdit = false,
}: ConsultantFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    profileImageUrl ?? null
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ConsultantFormData>({
    resolver: zodResolver(consultantFormSchema),
    defaultValues: {
      efpa: false,
      efpaEsg: false,
      sustainableAdvisor: false,
      ...defaultValues,
    },
  });

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      if (previewUrl) {
        formData.append("replaceUrl", previewUrl);
      }

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Errore nell'upload");
        return;
      }

      setPreviewUrl(data.url);
      onProfileImageChange?.(data.url);
      toast.success("Foto caricata");
    } catch {
      toast.error("Errore nell'upload della foto");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Foto Profilo */}
      <Card>
        <CardHeader>
          <CardTitle>Foto profilo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full bg-muted">
              {previewUrl ? (
                <Image
                  src={previewUrl}
                  alt="Foto profilo"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Camera className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
            </div>
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
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
                  <Camera className="mr-2 h-4 w-4" />
                )}
                {uploading ? "Caricamento..." : previewUrl ? "Cambia foto" : "Carica foto"}
              </Button>
              <p className="mt-1 text-xs text-muted-foreground">
                JPG, PNG o WebP. Max 5MB.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dati Personali */}
      <Card>
        <CardHeader>
          <CardTitle>Dati personali</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Network</Label>
              <Select
                value={watch("network") || ""}
                onValueChange={(val) => setValue("network", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona network" />
                </SelectTrigger>
                <SelectContent>
                  {CONSULTANT_NETWORKS.map((n) => (
                    <SelectItem key={n} value={n}>
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Ruolo *</Label>
              <Select
                value={watch("role") || ""}
                onValueChange={(val) => setValue("role", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona ruolo" />
                </SelectTrigger>
                <SelectContent>
                  {CONSULTANT_ROLES.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-sm text-destructive">{errors.role.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Titolo</Label>
              <Select
                value={watch("title") || ""}
                onValueChange={(val) => setValue("title", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona titolo" />
                </SelectTrigger>
                <SelectContent>
                  {CONSULTANT_TITLES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Nome *</Label>
              <Input {...register("firstName")} placeholder="Giuseppe" />
              {errors.firstName && (
                <p className="text-sm text-destructive">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Cognome *</Label>
              <Input {...register("lastName")} placeholder="Guglielmo" />
              {errors.lastName && (
                <p className="text-sm text-destructive">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <Separator />

          {/* Indirizzo */}
          <div className="space-y-2">
            <Label>Indirizzo</Label>
            <Input {...register("address")} placeholder="Corso Italia 6" />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>CAP</Label>
              <Input {...register("cap")} placeholder="20122" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Citta</Label>
                <Input {...register("city")} placeholder="Milano" />
              </div>
              <div className="space-y-2">
                <Label>Provincia</Label>
                <Input {...register("province")} placeholder="MI" />
              </div>
            </div>
          </div>

          <Separator />

          {/* Contatti */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Email consulente *</Label>
              <Input
                {...register("consultantEmail")}
                type="email"
                placeholder="giuseppe.guglielmo@generali.it"
              />
              {errors.consultantEmail && (
                <p className="text-sm text-destructive">
                  {errors.consultantEmail.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Telefono fisso</Label>
              <Input {...register("phone")} placeholder="02/72436111" />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Cellulare</Label>
              <Input {...register("mobile")} placeholder="3482290990" />
            </div>
            <div></div>
          </div>

          <Separator />

          {/* Certificazioni */}
          <div className="space-y-3">
            <Label>Certificazioni</Label>
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={watch("efpa")}
                  onCheckedChange={(val) => setValue("efpa", val === true)}
                />
                <span className="text-sm">EFPA</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={watch("efpaEsg")}
                  onCheckedChange={(val) => setValue("efpaEsg", val === true)}
                />
                <span className="text-sm">EFPA ESG</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={watch("sustainableAdvisor")}
                  onCheckedChange={(val) =>
                    setValue("sustainableAdvisor", val === true)
                  }
                />
                <span className="text-sm">Sustainable Advisor</span>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account */}
      <Card>
        <CardHeader>
          <CardTitle>Account di accesso</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Email di login *</Label>
              <Input
                {...register("email")}
                type="email"
                placeholder="giuseppe.guglielmo@generali.it"
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>
                Password {isEdit ? "(lascia vuoto per non cambiare)" : "*"}
              </Label>
              <Input
                {...register("password")}
                type="password"
                placeholder={isEdit ? "••••••••" : "Minimo 8 caratteri"}
              />
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tema Colore */}
      <Card>
        <CardHeader>
          <CardTitle>Tema colore landing page</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Label>Seleziona colore principale</Label>
            <div className="flex flex-wrap gap-3">
              {[
                { label: "Generali Red", value: "#C21D17" },
                { label: "Navy Blue", value: "#1B3A5C" },
                { label: "Forest Green", value: "#2D6A4F" },
                { label: "Royal Purple", value: "#6B21A8" },
                { label: "Gold", value: "#B8860B" },
              ].map((color) => (
                <button
                  key={color.value}
                  type="button"
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                    (watch("themeColor") || "#C21D17") === color.value
                      ? "border-gray-900 ring-2 ring-gray-400 ring-offset-2"
                      : "border-transparent"
                  }`}
                  style={{ backgroundColor: color.value }}
                  onClick={() => setValue("themeColor", color.value)}
                  title={color.label}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Il colore selezionato viene applicato alla landing page del consulente.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Bio e Social */}
      <Card>
        <CardHeader>
          <CardTitle>Biografia e Social</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Biografia</Label>
            <Textarea
              {...register("bio")}
              placeholder="Descrizione professionale del consulente..."
              rows={4}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>LinkedIn</Label>
              <Input
                {...register("linkedinUrl")}
                placeholder="https://linkedin.com/in/..."
              />
            </div>
            <div className="space-y-2">
              <Label>Facebook</Label>
              <Input
                {...register("facebookUrl")}
                placeholder="https://facebook.com/..."
              />
            </div>
            <div className="space-y-2">
              <Label>Twitter / X</Label>
              <Input
                {...register("twitterUrl")}
                placeholder="https://x.com/..."
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Instagram</Label>
              <Input
                {...register("instagramUrl")}
                placeholder="https://instagram.com/..."
              />
            </div>
            <div className="space-y-2">
              <Label>TikTok</Label>
              <Input
                {...register("tiktokUrl")}
                placeholder="https://tiktok.com/@..."
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>YouTube</Label>
              <Input
                {...register("youtubeUrl")}
                placeholder="https://youtube.com/@..."
              />
            </div>
            <div className="space-y-2">
              <Label>Sito web</Label>
              <Input
                {...register("websiteUrl")}
                placeholder="https://www.miosito.it"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => history.back()}>
          Annulla
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading
            ? "Salvataggio..."
            : isEdit
              ? "Salva modifiche"
              : "Crea consulente"}
        </Button>
      </div>
    </form>
  );
}
