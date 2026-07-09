import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { LoadingGate } from "@/components/loading-gate";
import { DataProvider } from "@/lib/data";
import { SettingsProvider } from "@/lib/settings";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://agroslaf.org.br"),
  title: {
    default: "AGROSLAF | 30 anos transformando vidas no campo",
    template: "%s | AGROSLAF",
  },
  description:
    "Associação dos Agricultores e Agricultoras do Sitio Lagoa Funda: agricultura familiar, impacto social, sustentabilidade e transparência.",
  openGraph: {
    title: "AGROSLAF | 30 anos transformando vidas no campo",
    description:
      "Conheça a história, os projetos e o impacto social da AGROSLAF em Lagoa Funda.",
    url: "https://agroslaf.org.br",
    siteName: "AGROSLAF",
    images: [{ url: "/images/hero.jpg", width: 1200, height: 630 }],
    locale: "pt_BR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "NGO",
    name: "AGROSLAF",
    foundingDate: "1995-01",
    address: "Sitio Lagoa Funda, Joao Alfredo, PE",
    areaServed: "Lagoa Funda",
    url: "https://agroslaf.org.br",
  };

  return (
    <html lang="pt-BR">
      <body className={inter.variable}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
        <SettingsProvider>
          <DataProvider>
            <LoadingGate>{children}</LoadingGate>
          </DataProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
