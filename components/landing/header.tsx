"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Chi sono", href: "#chi-sono" },
  { label: "Competenze", href: "#competenze" },
  { label: "Contatti", href: "#contatti" },
] as const;

export function LandingHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 10);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-500",
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-md"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <a href="#" className="flex items-center">
          <Image
            src="/images/generali-logo.svg"
            alt="Generali"
            width={120}
            height={40}
            priority
          />
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                scrolled ? "text-muted-foreground" : "text-white/80 hover:text-white"
              )}
            >
              {item.label}
            </a>
          ))}
          <Button
            asChild
            size="sm"
            className={cn(
              "transition-all",
              !scrolled && "shadow-lg"
            )}
            style={
              !scrolled
                ? {
                    background: "var(--theme-color, #c21d17)",
                    boxShadow: "0 0 20px var(--theme-color, #c21d17)40",
                  }
                : undefined
            }
          >
            <a href="#contatti">Chiedi appuntamento</a>
          </Button>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          className={cn(
            "inline-flex items-center justify-center rounded-md p-2 md:hidden transition-colors",
            scrolled ? "text-foreground" : "text-white"
          )}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Chiudi menu" : "Apri menu"}
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="border-t bg-white px-4 pb-4 pt-2 md:hidden">
          <div className="flex flex-col gap-2">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <Button asChild size="sm" className="mt-2">
              <a
                href="#contatti"
                onClick={() => setMobileMenuOpen(false)}
              >
                Chiedi appuntamento
              </a>
            </Button>
          </div>
        </nav>
      )}
    </header>
  );
}
