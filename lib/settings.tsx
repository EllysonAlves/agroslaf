"use client";

// =============================================================================
// CONFIGURACOES DO SITE (editaveis pelo painel /admin)
// -----------------------------------------------------------------------------
// Carrega GET /api/settings e mescla com os valores padrao (fallback) abaixo.
// Componentes consomem via useSiteSettings(). O admin salva via api.updateSettings.
// =============================================================================

import { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  about as defaultAbout,
  images as defaultImages,
  metrics as defaultMetrics,
  siteInfo as defaultSiteInfo,
  stories as defaultStories,
  timeline as defaultTimeline,
} from "@/lib/site-data";

export type SiteInfo = {
  name: string;
  fullName: string;
  tagline: string;
  phone: string;
  phoneRaw: string;
  email: string;
  address: string;
  foundedYear: string;
};

export type Hero = {
  title: string;
  subtitle: string;
  image: string;
  images: string[];
  logo: string;
  ctaPrimaryLabel: string;
  ctaPrimaryHref: string;
  ctaSecondaryLabel: string;
  ctaSecondaryHref: string;
};

export type About = {
  intro: string;
  paragraphs: string[];
  founders: { total: number; homens: number; mulheres: number };
  valores: { title: string; text: string }[];
};

export type Metric = { value: string; label: string; iconName: string };
export type TimelineItem = { year: string; title: string; text: string };
export type Story = { name: string; role: string; image: string; quote: string };
export type TransparencyDoc = { title: string; category: string; date: string; url: string };
export type SocialLink = { label: string; href: string };

export type Footer = {
  description: string;
  copyright: string;
  note: string;
  socials: SocialLink[];
};

export type Cta = { title: string; subtitle: string; buttonLabel: string };

export type Sections = {
  historia: boolean;
  metrics: boolean;
  projetos: boolean;
  galeria: boolean;
  depoimentos: boolean;
  noticias: boolean;
  transparencia: boolean;
  cta: boolean;
};

export const sectionLabels: { key: keyof Sections; label: string }[] = [
  { key: "historia", label: "Nossa História" },
  { key: "metrics", label: "Impacto em números" },
  { key: "projetos", label: "Projetos em destaque" },
  { key: "galeria", label: "Galeria" },
  { key: "depoimentos", label: "Depoimentos" },
  { key: "noticias", label: "Notícias (home)" },
  { key: "transparencia", label: "Transparência (home)" },
  { key: "cta", label: "Chamada final (CTA)" },
];

export type Theme = { primary: string; secondary: string };
export type SavedTheme = { name: string; primary: string; secondary: string };

export type SiteSettings = {
  siteInfo: SiteInfo;
  images: { hero: string; logo: string };
  hero: Hero;
  about: About;
  timeline: TimelineItem[];
  metrics: Metric[];
  stories: Story[];
  transparencyDocs: TransparencyDoc[];
  footer: Footer;
  cta: Cta;
  sections: Sections;
  theme: Theme;
  themes: SavedTheme[];
};

export const defaultSettings: SiteSettings = {
  siteInfo: { ...defaultSiteInfo },
  images: { ...defaultImages },
  hero: {
    title: "30 anos transformando vidas no campo.",
    subtitle:
      "A força da união de agricultores e agricultoras que acreditaram em um futuro melhor para Lagoa Funda.",
    image: defaultImages.hero,
    images: [],
    logo: defaultImages.logo,
    ctaPrimaryLabel: "Conheça nossa história",
    ctaPrimaryHref: "/sobre",
    ctaSecondaryLabel: "Seja um associado",
    ctaSecondaryHref: "/contato",
  },
  about: {
    intro: defaultAbout.intro,
    paragraphs: [...defaultAbout.paragraphs],
    founders: { ...defaultAbout.founders },
    valores: defaultAbout.valores.map((v) => ({ ...v })),
  },
  timeline: defaultTimeline.map((t) => ({ ...t })),
  metrics: defaultMetrics.map((m) => ({ value: m.value, label: m.label, iconName: m.iconName })),
  stories: defaultStories.map((s) => ({ ...s })),
  transparencyDocs: [
    { title: "Estatuto Social da AGROSLAF", category: "Estatuto", date: "2024", url: "#" },
    { title: "Ata da Assembleia Geral Ordinaria", category: "Atas", date: "2025", url: "#" },
    { title: "Ata de Eleicao da Diretoria", category: "Atas", date: "2024", url: "#" },
    { title: "Prestacao de Contas - Exercicio 2024", category: "Prestacao de Contas", date: "2024", url: "#" },
    { title: "Prestacao de Contas - Exercicio 2023", category: "Prestacao de Contas", date: "2023", url: "#" },
    { title: "Relatorio Anual de Atividades 2024", category: "Relatorios", date: "2024", url: "#" },
    { title: "Relatorio de Impacto Social", category: "Relatorios", date: "2024", url: "#" },
  ],
  footer: {
    description: "Há 30 anos transformando o campo com desenvolvimento, inovação e compromisso social.",
    copyright: "© 2026 AGROSLAF - Todos os direitos reservados.",
    note: "Feito com compromisso para o campo.",
    socials: [
      { label: "Facebook", href: "#" },
      { label: "Instagram", href: "#" },
      { label: "YouTube", href: "#" },
    ],
  },
  cta: {
    title: "Juntos continuamos construindo o futuro do campo.",
    subtitle: "Faça parte dessa história de transformação e desenvolvimento rural.",
    buttonLabel: "Faça parte dessa história",
  },
  sections: {
    historia: true,
    metrics: true,
    projetos: true,
    galeria: true,
    depoimentos: true,
    noticias: true,
    transparencia: true,
    cta: true,
  },
  theme: { primary: "#003b5c", secondary: "#4bae4f" },
  themes: [
    { name: "Padrão (Agroslaf)", primary: "#003b5c", secondary: "#4bae4f" },
    { name: "Copa / Brasil", primary: "#0a6b2f", secondary: "#f4c20d" },
    { name: "Natal", primary: "#7a1f1f", secondary: "#2f9e44" },
    { name: "São João", primary: "#9a3412", secondary: "#f59e0b" },
  ],
};

/* ---- Aplicação do tema (cores) em runtime ---- */

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "").trim();
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(full || "000000", 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function toHex([r, g, b]: number[]): string {
  const c = (v: number) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0");
  return `#${c(r)}${c(g)}${c(b)}`;
}

// mistura a cor em direção a `target` (0 = preto, 255 = branco) por `amt` (0..1)
function shade(hex: string, target: number, amt: number): string {
  const [r, g, b] = hexToRgb(hex);
  return toHex([r + (target - r) * amt, g + (target - g) * amt, b + (target - b) * amt]);
}

export function applyTheme(primary: string, secondary: string) {
  if (typeof document === "undefined") return;
  const root = document.documentElement.style;
  root.setProperty("--color-primary", primary);
  root.setProperty("--color-primary-dark", shade(primary, 0, 0.18));
  root.setProperty("--color-secondary", secondary);
  root.setProperty("--color-secondary-dark", shade(secondary, 0, 0.12));
  root.setProperty("--color-secondary-deep", shade(secondary, 0, 0.28));
  root.setProperty("--color-secondary-light", shade(secondary, 255, 0.45));
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

// Mescla por secao: usa o valor salvo quando existir, senao mantem o padrao.
export function mergeSettings(
  base: SiteSettings,
  incoming: Partial<SiteSettings> | null | undefined,
): SiteSettings {
  if (!incoming) return base;
  const result: Record<string, unknown> = { ...base };
  for (const key of Object.keys(base) as (keyof SiteSettings)[]) {
    const inc = (incoming as Record<string, unknown>)[key];
    if (inc === undefined || inc === null) continue;
    const baseVal = (base as Record<string, unknown>)[key];
    result[key] = isPlainObject(inc) && isPlainObject(baseVal) ? { ...baseVal, ...inc } : inc;
  }
  return result as SiteSettings;
}

const SettingsContext = createContext<{ settings: SiteSettings; loaded: boolean }>({
  settings: defaultSettings,
  loaded: false,
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    api
      .getSettings()
      .then((data) => {
        if (active && data && Object.keys(data).length) {
          setSettings(mergeSettings(defaultSettings, data));
        }
      })
      .catch(() => {
        /* mantem padrao */
      })
      .finally(() => {
        if (active) setLoaded(true);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    applyTheme(settings.theme.primary, settings.theme.secondary);
  }, [settings.theme.primary, settings.theme.secondary]);

  return <SettingsContext.Provider value={{ settings, loaded }}>{children}</SettingsContext.Provider>;
}

export function useSiteSettings(): SiteSettings {
  return useContext(SettingsContext).settings;
}

export function useSettingsLoaded(): boolean {
  return useContext(SettingsContext).loaded;
}
