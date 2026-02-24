"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Send, Loader2, Mail, Phone, MapPin } from "lucide-react";

const contactSchema = z.object({
  firstName: z.string().min(1, "Il nome è obbligatorio"),
  lastName: z.string().min(1, "Il cognome è obbligatorio"),
  email: z.string().email("Inserisci un indirizzo email valido"),
  phone: z.string().optional(),
  message: z.string().optional(),
  isExistingClient: z.boolean(),
});

type ContactFormValues = z.infer<typeof contactSchema>;

interface MapData {
  latitude: number;
  longitude: number;
  zoom?: number;
  address?: string;
}

interface ContactFormProps {
  landingPageId: string;
  consultantName: string;
  consultantEmail?: string;
  consultantPhone?: string;
  consultantImage?: string | null;
  consultantRole?: string;
  consultantAddress?: string;
  mapData?: MapData;
}

export function ContactForm({
  landingPageId,
  consultantName,
  consultantEmail,
  consultantPhone,
  consultantImage,
  consultantRole,
  consultantAddress,
  mapData,
}: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formLoadedAt = useRef(Date.now());

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      message: "",
      isExistingClient: false,
    },
  });

  const isExistingClient = watch("isExistingClient");

  async function onSubmit(data: ContactFormValues) {
    setIsSubmitting(true);
    try {
      const honeypotEl = document.getElementById("contact_website") as HTMLInputElement | null;
      const honeypot = honeypotEl?.value || "";

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          landingPageId,
          honeypot,
          formLoadedAt: formLoadedAt.current,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message ?? "Errore durante l'invio del messaggio");
      }

      toast.success("Messaggio inviato con successo!", {
        description: `${consultantName} ti ricontatterà al più presto.`,
      });
      reset();
      formLoadedAt.current = Date.now();
    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : "Si è verificato un errore. Riprova più tardi.";
      toast.error("Errore nell'invio", { description: message });
    } finally {
      setIsSubmitting(false);
    }
  }

  // Map embed
  const hasMap = mapData &&
    mapData.latitude != null &&
    mapData.longitude != null &&
    !isNaN(mapData.latitude) &&
    !isNaN(mapData.longitude) &&
    (mapData.latitude !== 0 || mapData.longitude !== 0);

  const mapEmbedUrl = hasMap
    ? `https://maps.google.com/maps?q=${mapData!.latitude},${mapData!.longitude}&z=${mapData!.zoom ?? 15}&output=embed`
    : null;

  const inputClasses = "bg-gray-50 border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:border-[var(--theme-color)] focus-visible:ring-[var(--theme-color)]";

  return (
    <section
      id="contatti"
      className="relative py-16 md:py-20 lg:py-24 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #0c0c0c 0%, color-mix(in srgb, var(--theme-color) 3%, #080808) 50%, #050505 100%)",
      }}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, var(--theme-color), #D4A537, var(--theme-color), transparent)`,
          opacity: 0.4,
        }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-start">
          {/* Left Column: Consultant profile + Info + Map */}
          <div>
            <p
              className="mb-3 text-xs font-semibold uppercase tracking-[0.15em]"
              style={{ color: "#D4A537" }}
            >
              Contatti
            </p>
            <h2 className="mb-4 font-display text-[clamp(1.5rem,3vw,2.25rem)] tracking-[-0.02em] text-white">
              Iniziamo a parlare
            </h2>
            <p className="mb-10 max-w-md text-base text-white/50 leading-relaxed">
              Compila il modulo per richiedere una consulenza personalizzata. Ti risponderò entro 24 ore.
            </p>

            {/* Contact info */}
            <div className="mb-10 space-y-5">
              {consultantEmail && (
                <a href={`mailto:${consultantEmail}`} className="group flex items-center gap-4 text-white transition-colors hover:text-white">
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors"
                    style={{ backgroundColor: "var(--theme-color)" }}
                  >
                    <Mail className="h-4 w-4 text-white" />
                  </span>
                  <span className="text-base">{consultantEmail}</span>
                </a>
              )}
              {consultantPhone && (
                <a href={`tel:${consultantPhone}`} className="group flex items-center gap-4 text-white transition-colors hover:text-white">
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors"
                    style={{ backgroundColor: "var(--theme-color)" }}
                  >
                    <Phone className="h-4 w-4 text-white" />
                  </span>
                  <span className="text-base">{consultantPhone}</span>
                </a>
              )}
              {consultantAddress && (
                <div className="flex items-start gap-4 text-white">
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: "var(--theme-color)" }}
                  >
                    <MapPin className="h-4 w-4 text-white" />
                  </span>
                  <span className="pt-2 text-base">{consultantAddress}</span>
                </div>
              )}
            </div>

            {/* Map */}
            {mapEmbedUrl && (
              <div
                className="overflow-hidden rounded-2xl ring-1 ring-white/10"
              >
                <iframe
                  src={mapEmbedUrl}
                  width="100%"
                  height="260"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Posizione"
                />
              </div>
            )}
          </div>

          {/* Right Column: Form */}
          <div>
            <div
              className="relative rounded-2xl border border-white/[0.15] bg-white p-6 sm:p-8"
              style={{
                boxShadow: "0 4px 40px color-mix(in srgb, var(--theme-color) 6%, transparent)",
              }}
            >
              {/* Gold accent line at top of card */}
              <div
                className="absolute top-0 left-6 right-6 h-px sm:left-8 sm:right-8"
                style={{
                  background: "linear-gradient(90deg, transparent, #D4A537, transparent)",
                  opacity: 0.5,
                }}
              />

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Honeypot */}
                <div style={{ position: "absolute", left: "-9999px", opacity: 0 }} aria-hidden="true" tabIndex={-1}>
                  <input type="text" id="contact_website" name="website" tabIndex={-1} autoComplete="off" />
                </div>

                {/* Name Fields */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium uppercase tracking-wide text-gray-700">
                      Nome *
                    </Label>
                    <Input
                      id="firstName"
                      placeholder="Mario"
                      className={inputClasses}
                      {...register("firstName")}
                      aria-invalid={!!errors.firstName}
                    />
                    {errors.firstName && (
                      <p className="text-xs text-red-400">{errors.firstName.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium uppercase tracking-wide text-gray-700">
                      Cognome *
                    </Label>
                    <Input
                      id="lastName"
                      placeholder="Rossi"
                      className={inputClasses}
                      {...register("lastName")}
                      aria-invalid={!!errors.lastName}
                    />
                    {errors.lastName && (
                      <p className="text-xs text-red-400">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium uppercase tracking-wide text-gray-700">
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="mario.rossi@email.com"
                    className={inputClasses}
                    {...register("email")}
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-400">{errors.email.message}</p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium uppercase tracking-wide text-gray-700">
                    Telefono
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+39 333 1234567"
                    className={inputClasses}
                    {...register("phone")}
                  />
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-sm font-medium uppercase tracking-wide text-gray-700">
                    Messaggio
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Scrivi il tuo messaggio..."
                    rows={4}
                    className={inputClasses}
                    {...register("message")}
                  />
                </div>

                {/* Existing Client */}
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="isExistingClient"
                    checked={isExistingClient}
                    onCheckedChange={(checked) => setValue("isExistingClient", checked === true)}
                    className="border-gray-300 data-[state=checked]:bg-[var(--theme-color)] data-[state=checked]:border-[var(--theme-color)]"
                    aria-label="Sono già cliente"
                  />
                  <Label htmlFor="isExistingClient" className="cursor-pointer text-sm font-normal text-gray-700">
                    Sono già cliente
                  </Label>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  className="w-full rounded-full py-3 text-base font-bold text-white transition-all duration-300 hover:shadow-[0_0_30px_rgba(194,29,23,0.3)]"
                  style={{
                    backgroundColor: "var(--theme-color)",
                  }}
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Invio in corso...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Invia richiesta
                    </>
                  )}
                </Button>

                {/* Privacy note */}
                <p className="text-center text-xs text-gray-400 leading-relaxed">
                  Inviando il modulo acconsenti al trattamento dei dati personali per essere ricontattato.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
