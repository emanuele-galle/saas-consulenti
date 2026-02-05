import { Linkedin, Facebook, Twitter, Instagram, Youtube, Globe, Mail, Phone, MapPin, ArrowUp } from "lucide-react";

interface FooterProps {
  consultantName?: string;
  consultantRole?: string;
  consultantEmail?: string;
  consultantPhone?: string;
  consultantAddress?: string;
  linkedinUrl?: string | null;
  facebookUrl?: string | null;
  twitterUrl?: string | null;
  instagramUrl?: string | null;
  youtubeUrl?: string | null;
  websiteUrl?: string | null;
}

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Note legali", href: "/legal" },
  { label: "Cookie Policy", href: "/cookies" },
] as const;

const QUICK_LINKS = [
  { label: "Chi sono", href: "#profilo" },
  { label: "Competenze", href: "#competenze" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Contatti", href: "#contatti" },
] as const;

function SocialLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-gray-400 transition-colors hover:border-[var(--theme-color,#C21D17)] hover:text-[var(--theme-color,#C21D17)]"
      aria-label={label}
    >
      {children}
    </a>
  );
}

export function LandingFooter({
  consultantName,
  consultantRole,
  consultantEmail,
  consultantPhone,
  consultantAddress,
  linkedinUrl,
  facebookUrl,
  twitterUrl,
  instagramUrl,
  youtubeUrl,
  websiteUrl,
}: FooterProps) {
  const hasSocialLinks = linkedinUrl || facebookUrl || twitterUrl || instagramUrl || youtubeUrl || websiteUrl;
  const hasContactInfo = consultantEmail || consultantPhone || consultantAddress;

  return (
    <footer className="bg-[#0a0a0a] text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Branding */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--theme-color,#C21D17)]">
                <span className="text-lg font-bold text-white">G</span>
              </div>
              <span className="text-lg font-semibold text-white">
                Generali
              </span>
            </div>
            {consultantName && (
              <p className="text-base font-bold text-white">{consultantName}</p>
            )}
            {consultantRole && (
              <p className="mt-1 text-sm text-gray-400">{consultantRole}</p>
            )}
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/60">
              Link rapidi
            </h4>
            <nav className="flex flex-col gap-3">
              {QUICK_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Column 3: Contact Info */}
          {hasContactInfo && (
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/60">
                Contatti
              </h4>
              <div className="flex flex-col gap-3">
                {consultantEmail && (
                  <a href={`mailto:${consultantEmail}`} className="flex items-center gap-3 text-sm text-gray-400 transition-colors hover:text-white">
                    <Mail className="h-4 w-4 shrink-0 text-[var(--theme-color,#C21D17)]" />
                    {consultantEmail}
                  </a>
                )}
                {consultantPhone && (
                  <a href={`tel:${consultantPhone}`} className="flex items-center gap-3 text-sm text-gray-400 transition-colors hover:text-white">
                    <Phone className="h-4 w-4 shrink-0 text-[var(--theme-color,#C21D17)]" />
                    {consultantPhone}
                  </a>
                )}
                {consultantAddress && (
                  <div className="flex items-start gap-3 text-sm text-gray-400">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--theme-color,#C21D17)]" />
                    {consultantAddress}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Column 4: Social */}
          {hasSocialLinks && (
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/60">
                Seguimi
              </h4>
              <div className="flex flex-wrap gap-3">
                {linkedinUrl && (
                  <SocialLink href={linkedinUrl} label="LinkedIn">
                    <Linkedin className="h-4 w-4" />
                  </SocialLink>
                )}
                {facebookUrl && (
                  <SocialLink href={facebookUrl} label="Facebook">
                    <Facebook className="h-4 w-4" />
                  </SocialLink>
                )}
                {twitterUrl && (
                  <SocialLink href={twitterUrl} label="Twitter">
                    <Twitter className="h-4 w-4" />
                  </SocialLink>
                )}
                {instagramUrl && (
                  <SocialLink href={instagramUrl} label="Instagram">
                    <Instagram className="h-4 w-4" />
                  </SocialLink>
                )}
                {youtubeUrl && (
                  <SocialLink href={youtubeUrl} label="YouTube">
                    <Youtube className="h-4 w-4" />
                  </SocialLink>
                )}
                {websiteUrl && (
                  <SocialLink href={websiteUrl} label="Sito web">
                    <Globe className="h-4 w-4" />
                  </SocialLink>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Separator */}
        <div className="my-10 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />

        {/* Bottom */}
        <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
          <nav className="flex flex-wrap items-center gap-4 md:gap-6">
            {LEGAL_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-gray-500 transition-colors hover:text-gray-300"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <p className="text-sm text-gray-600">
              &copy; {new Date().getFullYear()} Generali Italia S.p.A.
            </p>
            <a
              href="#"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-gray-500 transition-colors hover:border-[var(--theme-color,#C21D17)] hover:text-[var(--theme-color,#C21D17)]"
              aria-label="Torna in cima"
            >
              <ArrowUp className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
