import { Linkedin, Facebook, Twitter, Instagram, Youtube, Globe, ArrowUp } from "lucide-react";

interface FooterProps {
  consultantName?: string;
  consultantRole?: string;
  linkedinUrl?: string | null;
  facebookUrl?: string | null;
  twitterUrl?: string | null;
  instagramUrl?: string | null;
  youtubeUrl?: string | null;
  websiteUrl?: string | null;
}

const QUICK_LINKS = [
  { label: "Chi Sono", href: "#chi-sono" },
  { label: "Servizi", href: "#servizi" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Contatti", href: "#contatti" },
] as const;

const SOCIAL_MAP = [
  { key: "linkedinUrl", icon: Linkedin, label: "LinkedIn" },
  { key: "facebookUrl", icon: Facebook, label: "Facebook" },
  { key: "twitterUrl", icon: Twitter, label: "Twitter" },
  { key: "instagramUrl", icon: Instagram, label: "Instagram" },
  { key: "youtubeUrl", icon: Youtube, label: "YouTube" },
  { key: "websiteUrl", icon: Globe, label: "Sito web" },
] as const;

export function LandingFooter({
  consultantName,
  consultantRole,
  linkedinUrl,
  facebookUrl,
  twitterUrl,
  instagramUrl,
  youtubeUrl,
  websiteUrl,
}: FooterProps) {
  const socialUrls: Record<string, string | null | undefined> = {
    linkedinUrl, facebookUrl, twitterUrl, instagramUrl, youtubeUrl, websiteUrl,
  };

  const activeSocials = SOCIAL_MAP.filter((s) => socialUrls[s.key]);

  return (
    <footer className="bg-[#050505] text-white">
      {/* Top accent line */}
      <div
        className="h-px"
        style={{
          background: "linear-gradient(90deg, transparent, var(--theme-color, #C21D17), var(--generali-gold, #D4A537), var(--theme-color, #C21D17), transparent)",
          opacity: 0.3,
        }}
      />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-12 md:grid-cols-3">
          {/* Col 1: Logo + Name */}
          <div>
            {consultantName && (
              <p className="mb-5 font-display text-xl font-bold text-white/80">{consultantName}</p>
            )}
            {consultantRole && (
              <p className="mt-1 text-sm text-white/40">{consultantRole}</p>
            )}
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-white/30">
              Link rapidi
            </h4>
            <nav className="flex flex-col gap-3">
              {QUICK_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-white/50 transition-colors duration-300 hover:text-white"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Col 3: Social */}
          <div>
            {activeSocials.length > 0 && (
              <>
                <h4 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-white/30">
                  Seguimi
                </h4>
                <div className="flex gap-3">
                  {activeSocials.map((s) => {
                    const Icon = s.icon;
                    return (
                      <a
                        key={s.key}
                        href={socialUrls[s.key]!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/40 transition-all duration-300 hover:border-[var(--theme-color,#C21D17)] hover:text-white hover:shadow-[0_0_15px_rgba(194,29,23,0.15)]"
                        aria-label={s.label}
                      >
                        <Icon className="h-4 w-4" />
                      </a>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-14 flex flex-col items-center gap-4 border-t border-white/[0.06] pt-8 md:flex-row md:justify-between">
          <p className="text-sm text-white/25">
            &copy; {new Date().getFullYear()} Generali Italia S.p.A.
          </p>

          <div className="flex items-center gap-5">
            <p className="text-xs text-white/15">
              Realizzato da{" "}
              <a href="https://www.pieromuscari.it" target="_blank" rel="noopener noreferrer" className="hover:text-white/40 transition-colors duration-300">
                Piero Muscari Storytailor
              </a>{" "}
              in collaborazione con{" "}
              <a href="https://www.fodisrl.it" target="_blank" rel="noopener noreferrer" className="hover:text-white/40 transition-colors duration-300">
                Fodi S.r.l.
              </a>
            </p>
            <a
              href="#"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 text-white/30 transition-all duration-300 hover:border-[var(--theme-color,#C21D17)] hover:text-white hover:-translate-y-0.5"
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
