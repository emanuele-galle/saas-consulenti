"use client";

import Image from "next/image";
import { useTRPC } from "@/lib/trpc";
import { useQuery } from "@tanstack/react-query";
import {
  Mail,
  Phone,
  Smartphone,
  MapPin,
  Linkedin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Globe,
  Award,
  ShieldCheck,
  Leaf,
  ExternalLink,
  Loader2,
  User,
} from "lucide-react";

interface ProfileEditorProps {
  consultantId: string;
}

const SOCIAL_LINKS = [
  { key: "linkedinUrl", icon: Linkedin, label: "LinkedIn" },
  { key: "facebookUrl", icon: Facebook, label: "Facebook" },
  { key: "twitterUrl", icon: Twitter, label: "Twitter / X" },
  { key: "instagramUrl", icon: Instagram, label: "Instagram" },
  { key: "youtubeUrl", icon: Youtube, label: "YouTube" },
  { key: "websiteUrl", icon: Globe, label: "Sito web" },
] as const;

export function ProfileEditor({ consultantId }: ProfileEditorProps) {
  const trpc = useTRPC();
  const { data: consultant, isLoading } = useQuery(
    trpc.consultants.getById.queryOptions({ id: consultantId })
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        <span className="ml-2 text-sm text-muted-foreground">Caricamento profilo...</span>
      </div>
    );
  }

  if (!consultant) {
    return (
      <p className="text-sm text-muted-foreground">Profilo consulente non trovato.</p>
    );
  }

  const fullName = [consultant.title, consultant.firstName, consultant.lastName]
    .filter(Boolean)
    .join(" ");

  const address = [consultant.address, consultant.cap, consultant.city, consultant.province]
    .filter(Boolean)
    .join(", ");

  const certifications = [
    consultant.efpa && { label: "EFPA", icon: Award },
    consultant.efpaEsg && { label: "EFPA ESG", icon: ShieldCheck },
    consultant.sustainableAdvisor && { label: "Sustainable Advisor", icon: Leaf },
  ].filter(Boolean) as { label: string; icon: typeof Award }[];

  const socialUrls = SOCIAL_LINKS.filter(
    (s) => consultant[s.key as keyof typeof consultant]
  );

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">
        Questa sezione mostra i dati dal profilo del consulente. Per modificarli, usa il pulsante sotto.
      </p>

      {/* Profile Summary Card */}
      <div className="rounded-lg border bg-muted/30 p-4">
        <div className="flex items-start gap-4">
          {/* Photo */}
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-muted">
            {consultant.profileImage ? (
              <Image
                src={consultant.profileImage}
                alt={fullName}
                fill
                className="object-cover"
                style={
                  consultant.profileImagePosition
                    ? { objectPosition: consultant.profileImagePosition.split(" ").map((v) => `${v}%`).join(" ") }
                    : undefined
                }
                unoptimized
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <User className="h-6 w-6 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="min-w-0 flex-1">
            <h4 className="font-semibold text-sm">{fullName}</h4>
            <p className="text-xs text-muted-foreground">{consultant.role}</p>
            {consultant.network && (
              <span className="mt-1 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                {consultant.network}
              </span>
            )}
          </div>
        </div>

        {/* Certifications */}
        {certifications.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {certifications.map((cert) => {
              const Icon = cert.icon;
              return (
                <span
                  key={cert.label}
                  className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700 border border-amber-200"
                >
                  <Icon className="h-3 w-3" />
                  {cert.label}
                </span>
              );
            })}
          </div>
        )}

        {/* Contact Info */}
        <div className="mt-3 space-y-1.5">
          {consultant.email && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Mail className="h-3 w-3 shrink-0" />
              <span className="truncate">{consultant.email}</span>
            </div>
          )}
          {consultant.phone && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Phone className="h-3 w-3 shrink-0" />
              <span>{consultant.phone}</span>
            </div>
          )}
          {consultant.mobile && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Smartphone className="h-3 w-3 shrink-0" />
              <span>{consultant.mobile}</span>
            </div>
          )}
          {address && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">{address}</span>
            </div>
          )}
        </div>

        {/* Social Links */}
        {socialUrls.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {socialUrls.map((s) => {
              const Icon = s.icon;
              return (
                <span
                  key={s.key}
                  className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground"
                >
                  <Icon className="h-3 w-3" />
                  {s.label}
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Button */}
      <a
        href={`/consultants/${consultantId}/edit`}
        className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
      >
        <ExternalLink className="h-3.5 w-3.5" />
        Modifica profilo consulente
      </a>
    </div>
  );
}
