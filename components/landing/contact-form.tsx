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
import { Send, Loader2, Mail, Phone } from "lucide-react";

const contactSchema = z.object({
  firstName: z.string().min(1, "Il nome è obbligatorio"),
  lastName: z.string().min(1, "Il cognome è obbligatorio"),
  email: z.string().email("Inserisci un indirizzo email valido"),
  phone: z.string().optional(),
  message: z.string().optional(),
  isExistingClient: z.boolean(),
});

type ContactFormValues = z.infer<typeof contactSchema>;

interface ContactFormProps {
  landingPageId: string;
  consultantName: string;
  consultantEmail?: string;
  consultantPhone?: string;
  consultantImage?: string | null;
  consultantRole?: string;
}

export function ContactForm({
  landingPageId,
  consultantName,
  consultantEmail,
  consultantPhone,
  consultantImage,
  consultantRole,
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
        throw new Error(
          errorData?.message ?? "Errore durante l'invio del messaggio"
        );
      }

      toast.success("Messaggio inviato con successo!", {
        description: `${consultantName} ti ricontatterà al più presto.`,
      });
      reset();
      formLoadedAt.current = Date.now();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Si è verificato un errore. Riprova più tardi.";
      toast.error("Errore nell'invio", { description: message });
    } finally {
      setIsSubmitting(false);
    }
  }

  const hasContactInfo = consultantEmail || consultantPhone || consultantImage;

  return (
    <section id="contatti" className="bg-[#111111] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-4 text-center text-sm font-medium uppercase tracking-[0.2em] text-white/40">
          Contatti
        </p>
        <h2 className="mb-16 text-center text-3xl font-bold text-white sm:text-4xl">
          Richiedi un appuntamento
        </h2>

        <div className={`mx-auto ${hasContactInfo ? "max-w-5xl" : "max-w-2xl"}`}>
          <div className={`flex flex-col gap-10 ${hasContactInfo ? "lg:flex-row lg:gap-16" : ""}`}>
            {/* Left Column - Consultant Info */}
            {hasContactInfo && (
              <div className="flex flex-col items-center text-center lg:w-2/5 lg:items-start lg:text-left lg:pt-4">
                {consultantImage && (
                  <div className="relative mb-6 h-20 w-20 overflow-hidden rounded-full ring-2 ring-[var(--theme-color,#C21D17)] ring-offset-2 ring-offset-[#111111]">
                    <Image
                      src={consultantImage}
                      alt={consultantName}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <h3 className="text-xl font-bold text-white">
                  {consultantName}
                </h3>
                {consultantRole && (
                  <p className="mt-1 text-sm font-medium text-[var(--theme-color,#C21D17)]">
                    {consultantRole}
                  </p>
                )}

                <div className="my-6 h-px w-16 bg-white/10" />

                <div className="space-y-4">
                  {consultantEmail && (
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 shrink-0 text-[var(--theme-color,#C21D17)]" />
                      <a href={`mailto:${consultantEmail}`} className="text-sm text-white/70 hover:text-white transition-colors">
                        {consultantEmail}
                      </a>
                    </div>
                  )}
                  {consultantPhone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 shrink-0 text-[var(--theme-color,#C21D17)]" />
                      <a href={`tel:${consultantPhone}`} className="text-sm text-white/70 hover:text-white transition-colors">
                        {consultantPhone}
                      </a>
                    </div>
                  )}
                </div>

                <p className="mt-8 text-lg font-medium text-white/50">
                  Parliamo del tuo futuro
                </p>
              </div>
            )}

            {/* Right Column - Form */}
            <div className={hasContactInfo ? "lg:w-3/5" : "w-full"}>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-5"
                >
                  {/* Honeypot */}
                  <div
                    style={{ position: "absolute", left: "-9999px", opacity: 0 }}
                    aria-hidden="true"
                  >
                    <input
                      type="text"
                      id="contact_website"
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  {/* Name Fields */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-white/70">Nome *</Label>
                      <Input
                        id="firstName"
                        placeholder="Mario"
                        className="border-white/10 bg-white/[0.06] text-white placeholder:text-white/30 focus-visible:ring-[var(--theme-color,#C21D17)]"
                        {...register("firstName")}
                        aria-invalid={!!errors.firstName}
                      />
                      {errors.firstName && (
                        <p className="text-xs text-red-400">
                          {errors.firstName.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-white/70">Cognome *</Label>
                      <Input
                        id="lastName"
                        placeholder="Rossi"
                        className="border-white/10 bg-white/[0.06] text-white placeholder:text-white/30 focus-visible:ring-[var(--theme-color,#C21D17)]"
                        {...register("lastName")}
                        aria-invalid={!!errors.lastName}
                      />
                      {errors.lastName && (
                        <p className="text-xs text-red-400">
                          {errors.lastName.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white/70">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="mario.rossi@email.com"
                      className="border-white/10 bg-white/[0.06] text-white placeholder:text-white/30 focus-visible:ring-[var(--theme-color,#C21D17)]"
                      {...register("email")}
                      aria-invalid={!!errors.email}
                    />
                    {errors.email && (
                      <p className="text-xs text-red-400">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-white/70">Telefono</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+39 333 1234567"
                      className="border-white/10 bg-white/[0.06] text-white placeholder:text-white/30 focus-visible:ring-[var(--theme-color,#C21D17)]"
                      {...register("phone")}
                    />
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-white/70">Messaggio</Label>
                    <Textarea
                      id="message"
                      placeholder="Scrivi il tuo messaggio..."
                      rows={4}
                      className="border-white/10 bg-white/[0.06] text-white placeholder:text-white/30 focus-visible:ring-[var(--theme-color,#C21D17)]"
                      {...register("message")}
                    />
                  </div>

                  {/* Existing Client */}
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="isExistingClient"
                      checked={isExistingClient}
                      onCheckedChange={(checked) =>
                        setValue("isExistingClient", checked === true)
                      }
                      className="border-white/20 data-[state=checked]:bg-[var(--theme-color,#C21D17)] data-[state=checked]:border-[var(--theme-color,#C21D17)]"
                    />
                    <Label
                      htmlFor="isExistingClient"
                      className="cursor-pointer text-sm font-normal text-white/70"
                    >
                      Sono già cliente
                    </Label>
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    className="w-full bg-[var(--theme-color,#C21D17)] text-white hover:bg-[var(--theme-color,#C21D17)]/90"
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
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
