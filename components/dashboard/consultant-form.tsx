"use client";

import { useState, useRef, useCallback } from "react";
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
import { Camera, Crosshair, Loader2, RotateCcw } from "lucide-react";

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

function parsePosition(pos: string | null | undefined): { x: number; y: number } {
  if (!pos) return { x: 50, y: 50 };
  const parts = pos.split(" ");
  const x = parseInt(parts[0] ?? "50", 10);
  const y = parseInt(parts[1] ?? "50", 10);
  return { x: Number.isNaN(x) ? 50 : x, y: Number.isNaN(y) ? 50 : y };
}

interface ConsultantFormProps {
  defaultValues?: Partial<ConsultantFormData>;
  profileImageUrl?: string | null;
  profileImagePosition?: string | null;
  onSubmit: (data: ConsultantFormData) => void;
  onProfileImageChange?: (url: string) => void;
  onProfileImagePositionChange?: (position: string) => void;
  isLoading?: boolean;
  isEdit?: boolean;
}

export function ConsultantForm({
  defaultValues,
  profileImageUrl,
  profileImagePosition,
  onSubmit,
  onProfileImageChange,
  onProfileImagePositionChange,
  isLoading,
  isEdit = false,
}: ConsultantFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    profileImageUrl ?? null
  );
  const [focalPoint, setFocalPoint] = useState(() => parsePosition(profileImagePosition));

  const updateFocalPoint = useCallback(
    (x: number, y: number) => {
      const clamped = { x: Math.round(Math.max(0, Math.min(100, x))), y: Math.round(Math.max(0, Math.min(100, y))) };
      setFocalPoint(clamped);
      onProfileImagePositionChange?.(`${clamped.x} ${clamped.y}`);
    },
    [onProfileImagePositionChange]
  );

  const handlePickerEvent = useCallback(
    (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
      const rect = pickerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      const x = ((clientX - rect.left) / rect.width) * 100;
      const y = ((clientY - rect.top) / rect.height) * 100;
      updateFocalPoint(x, y);
    },
    [updateFocalPoint]
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
        <CardContent className="space-y-4">
          <div className="flex items-center gap-6">
            <div
              className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full bg-muted"
            >
              {previewUrl ? (
                <Image
                  src={previewUrl}
                  alt="Foto profilo"
                  fill
                  className="object-cover"
                  style={{ objectPosition: `${focalPoint.x}% ${focalPoint.y}%` }}
                  unoptimized
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

          {/* Focal Point Picker */}
          {previewUrl && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Crosshair className="h-4 w-4 text-muted-foreground" />
                <Label>Centramento foto</Label>
              </div>
              <p className="text-xs text-muted-foreground">
                Clicca o trascina sull&apos;immagine per scegliere il punto focale. L&apos;anteprima circolare mostra il risultato.
              </p>
              <div className="flex flex-col items-start gap-6 sm:flex-row">
                {/* Source image with crosshair */}
                <div
                  ref={pickerRef}
                  className="relative w-full max-w-xs cursor-crosshair select-none overflow-hidden rounded-lg border bg-muted"
                  style={{ aspectRatio: "1" }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    isDragging.current = true;
                    handlePickerEvent(e);
                  }}
                  onMouseMove={(e) => {
                    if (isDragging.current) handlePickerEvent(e);
                  }}
                  onMouseUp={() => { isDragging.current = false; }}
                  onMouseLeave={() => { isDragging.current = false; }}
                  onTouchStart={(e) => {
                    isDragging.current = true;
                    handlePickerEvent(e);
                  }}
                  onTouchMove={(e) => {
                    if (isDragging.current) handlePickerEvent(e);
                  }}
                  onTouchEnd={() => { isDragging.current = false; }}
                >
                  <Image
                    src={previewUrl}
                    alt="Seleziona punto focale"
                    fill
                    className="object-contain"
                    unoptimized
                    draggable={false}
                  />
                  {/* Crosshair indicator */}
                  <div
                    className="pointer-events-none absolute h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.3)]"
                    style={{
                      left: `${focalPoint.x}%`,
                      top: `${focalPoint.y}%`,
                      background: "rgba(220, 38, 38, 0.5)",
                    }}
                  />
                  {/* Crosshair lines */}
                  <div
                    className="pointer-events-none absolute h-px w-full bg-white/50"
                    style={{ top: `${focalPoint.y}%` }}
                  />
                  <div
                    className="pointer-events-none absolute h-full w-px bg-white/50"
                    style={{ left: `${focalPoint.x}%` }}
                  />
                </div>

                {/* Circular preview */}
                <div className="flex flex-col items-center gap-2">
                  <p className="text-xs font-medium text-muted-foreground">Anteprima</p>
                  <div className="relative h-32 w-32 overflow-hidden rounded-full border-2 border-muted bg-muted">
                    <Image
                      src={previewUrl}
                      alt="Anteprima circolare"
                      fill
                      className="object-cover"
                      style={{ objectPosition: `${focalPoint.x}% ${focalPoint.y}%` }}
                      unoptimized
                    />
                  </div>
                </div>
              </div>

              {/* Reset button */}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => updateFocalPoint(50, 50)}
                className="text-xs"
              >
                <RotateCcw className="mr-1 h-3 w-3" />
                Centra (50/50)
              </Button>
            </div>
          )}
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
