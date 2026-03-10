import type { Metadata } from "next";
import { DM_Sans, DM_Serif_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const dmSerif = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://saas-consulenti.muscarivps.cloud'),
  title: {
    default: "Saas Consulenti - Gestione Landing Page Consulenti",
    template: "%s | Saas Consulenti",
  },
  description:
    "Piattaforma di gestione landing page personali per i consulenti del Gruppo.",
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/images/mediacom-logo.svg",
  },
  openGraph: {
    type: "website",
    locale: "it_IT",
    siteName: "Saas Consulenti",
    title: "Saas Consulenti - Gestione Landing Page Consulenti",
    description:
      "Piattaforma di gestione landing page personali per i consulenti del Gruppo.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className={`${dmSans.variable} ${dmSerif.variable}`}>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
