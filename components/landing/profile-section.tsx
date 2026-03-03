"use client";

import Image from "next/image";
import type { Consultant } from "@prisma/client";
import { motion } from "framer-motion";
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
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Social links configuration                                         */
/* ------------------------------------------------------------------ */

const SOCIAL_LINKS = [
  { key: "linkedinUrl" as const, icon: Linkedin, label: "LinkedIn" },
  { key: "facebookUrl" as const, icon: Facebook, label: "Facebook" },
  { key: "twitterUrl" as const, icon: Twitter, label: "Twitter" },
  { key: "instagramUrl" as const, icon: Instagram, label: "Instagram" },
  { key: "youtubeUrl" as const, icon: Youtube, label: "YouTube" },
  { key: "websiteUrl" as const, icon: Globe, label: "Sito web" },
];

/* ------------------------------------------------------------------ */
/*  Certification badges configuration                                 */
/* ------------------------------------------------------------------ */

const CERTIFICATIONS = [
  {
    key: "efpa" as const,
    label: "EFPA",
    icon: Award,
    description: "European Financial Planning Association",
  },
  {
    key: "efpaEsg" as const,
    label: "EFPA ESG",
    icon: ShieldCheck,
    description: "EFPA ESG Advisor",
  },
  {
    key: "sustainableAdvisor" as const,
    label: "Sustainable Advisor",
    icon: Leaf,
    description: "Consulente per la Finanza Sostenibile",
  },
];

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface ProfileSectionProps {
  consultant: Consultant;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function ProfileSection({ consultant }: ProfileSectionProps) {
  const fullName = [consultant.title, consultant.firstName, consultant.lastName]
    .filter(Boolean)
    .join(" ");

  const address = [
    consultant.address,
    consultant.cap,
    consultant.city,
    consultant.province,
  ]
    .filter(Boolean)
    .join(", ");

  const activeSocials = SOCIAL_LINKS.filter(
    (s) => consultant[s.key]
  );

  const activeCertifications = CERTIFICATIONS.filter(
    (c) => consultant[c.key]
  );

  const hasContactInfo =
    consultant.email || consultant.phone || consultant.mobile || address;

  return (
    <section id="profilo" className="section-premium py-12 md:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section label */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.15em]"
          style={{ color: "var(--generali-gold, #D4A537)" }}
        >
          Profilo
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="mb-10 text-center font-display text-[clamp(2rem,4vw,3.5rem)] leading-tight tracking-[-0.02em] text-[#1A1A1A]"
        >
          Il Tuo Consulente
        </motion.h2>

        {/* Main card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="card-bold mx-auto max-w-5xl overflow-hidden rounded-2xl"
        >
          <div className="flex flex-col lg:flex-row">
            {/* Left: Photo + Name + Role */}
            <div className="flex flex-col items-center px-6 py-8 lg:w-5/12 lg:px-10 lg:py-12">
              {/* Profile image */}
              {consultant.profileImage ? (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
                  className="relative mb-8"
                >
                  <div
                    className="relative h-40 w-40 overflow-hidden rounded-full shadow-xl sm:h-48 sm:w-48"
                    style={{ border: "4px solid var(--theme-color, #C21D17)" }}
                  >
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
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
                  className="relative mb-8"
                >
                  <div
                    className="flex h-40 w-40 items-center justify-center rounded-full border-4 border-white shadow-xl sm:h-48 sm:w-48"
                    style={{ background: "var(--theme-color, #C21D17)" }}
                  >
                    <span className="text-5xl font-bold text-white sm:text-6xl">
                      {consultant.firstName.charAt(0)}
                      {consultant.lastName.charAt(0)}
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Name */}
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.4, ease: "easeOut" }}
                className="text-center font-display text-2xl leading-tight text-[#1A1A1A] sm:text-3xl"
              >
                {fullName}
              </motion.h3>

              {/* Role */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.45, ease: "easeOut" }}
                className="mt-2 text-center text-base font-medium text-[#6B7280]"
              >
                {consultant.role}
              </motion.p>

              {/* Network badge */}
              {consultant.network && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.5, ease: "easeOut" }}
                  className="mt-4 inline-block rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white"
                  style={{ background: "var(--theme-color, #C21D17)" }}
                >
                  {consultant.network}
                </motion.span>
              )}

              {/* Certification badges */}
              {activeCertifications.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.55, ease: "easeOut" }}
                  className="mt-6 flex flex-wrap items-center justify-center gap-3"
                >
                  {activeCertifications.map((cert) => {
                    const Icon = cert.icon;
                    return (
                      <div
                        key={cert.key}
                        className="group relative flex items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 shadow-sm transition-all duration-300 hover:border-[var(--theme-color,#C21D17)] hover:shadow-md"
                        title={cert.description}
                      >
                        <Icon
                          className="h-4 w-4 shrink-0"
                          style={{ color: "var(--theme-color, #C21D17)" }}
                        />
                        <span className="text-xs font-semibold text-[#1A1A1A]">
                          {cert.label}
                        </span>
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </div>

            {/* Right: Contact info */}
            {hasContactInfo && (
              <div className="border-t border-[#E5E7EB] lg:border-l lg:border-t-0 lg:w-7/12">
                <div className="px-6 py-8 lg:px-10 lg:py-12">
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.35, ease: "easeOut" }}
                    className="mb-8 text-xs font-semibold uppercase tracking-[0.15em]"
                    style={{ color: "var(--generali-gold, #D4A537)" }}
                  >
                    Contatti
                  </motion.p>

                  <div className="space-y-6">
                    {/* Email */}
                    {consultant.email && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.4,
                          delay: 0.4,
                          ease: "easeOut",
                        }}
                        className="flex items-center gap-4"
                      >
                        <div
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                          style={{
                            background:
                              "color-mix(in srgb, var(--theme-color, #C21D17) 10%, transparent)",
                          }}
                        >
                          <Mail
                            className="h-5 w-5"
                            style={{ color: "var(--theme-color, #C21D17)" }}
                          />
                        </div>
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wider text-[#9CA3AF]">
                            Email
                          </p>
                          <a
                            href={`mailto:${consultant.email}`}
                            className="text-sm font-medium text-[#1A1A1A] transition-colors duration-200 hover:underline break-words sm:text-base"
                            style={
                              {
                                "--hover-color":
                                  "var(--theme-color, #C21D17)",
                              } as React.CSSProperties
                            }
                          >
                            {consultant.email}
                          </a>
                        </div>
                      </motion.div>
                    )}

                    {/* Phone */}
                    {consultant.phone && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.4,
                          delay: 0.45,
                          ease: "easeOut",
                        }}
                        className="flex items-center gap-4"
                      >
                        <div
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                          style={{
                            background:
                              "color-mix(in srgb, var(--theme-color, #C21D17) 10%, transparent)",
                          }}
                        >
                          <Phone
                            className="h-5 w-5"
                            style={{ color: "var(--theme-color, #C21D17)" }}
                          />
                        </div>
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wider text-[#9CA3AF]">
                            Telefono
                          </p>
                          <a
                            href={`tel:${consultant.phone}`}
                            className="text-base font-medium text-[#1A1A1A] transition-colors duration-200 hover:underline"
                          >
                            {consultant.phone}
                          </a>
                        </div>
                      </motion.div>
                    )}

                    {/* Mobile */}
                    {consultant.mobile && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.4,
                          delay: 0.5,
                          ease: "easeOut",
                        }}
                        className="flex items-center gap-4"
                      >
                        <div
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                          style={{
                            background:
                              "color-mix(in srgb, var(--theme-color, #C21D17) 10%, transparent)",
                          }}
                        >
                          <Smartphone
                            className="h-5 w-5"
                            style={{ color: "var(--theme-color, #C21D17)" }}
                          />
                        </div>
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wider text-[#9CA3AF]">
                            Cellulare
                          </p>
                          <a
                            href={`tel:${consultant.mobile}`}
                            className="text-base font-medium text-[#1A1A1A] transition-colors duration-200 hover:underline"
                          >
                            {consultant.mobile}
                          </a>
                        </div>
                      </motion.div>
                    )}

                    {/* Address */}
                    {address && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.4,
                          delay: 0.55,
                          ease: "easeOut",
                        }}
                        className="flex items-center gap-4"
                      >
                        <div
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                          style={{
                            background:
                              "color-mix(in srgb, var(--theme-color, #C21D17) 10%, transparent)",
                          }}
                        >
                          <MapPin
                            className="h-5 w-5"
                            style={{ color: "var(--theme-color, #C21D17)" }}
                          />
                        </div>
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wider text-[#9CA3AF]">
                            Indirizzo
                          </p>
                          <p className="text-base font-medium text-[#1A1A1A]">
                            {address}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Social links */}
                  {activeSocials.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.4,
                        delay: 0.6,
                        ease: "easeOut",
                      }}
                      className="mt-8 flex items-center gap-3"
                    >
                      {activeSocials.map((s) => {
                        const Icon = s.icon;
                        const url = consultant[s.key];
                        return (
                          <a
                            key={s.key}
                            href={url!}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E5E7EB] text-[#6B7280] transition-all duration-300 hover:border-transparent hover:text-white hover:shadow-lg"
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background =
                                "var(--theme-color, #C21D17)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "transparent";
                            }}
                            aria-label={s.label}
                          >
                            <Icon className="h-4 w-4" />
                          </a>
                        );
                      })}
                    </motion.div>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
