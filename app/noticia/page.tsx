"use client";

import { ArrowLeft, ArrowRight, User, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CtaBand } from "@/components/cta-band";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { MotionSection } from "@/components/motion-section";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { useData } from "@/lib/data";
import { news as fallbackNews } from "@/lib/site-data";

function isImageUrl(s: string): boolean {
  return /^(https?:\/\/|\/)\S+\.(jpe?g|png|webp|gif|avif|svg)(\?\S*)?$/i.test(s.trim());
}

export default function NewsDetailPage() {
  const { news, loaded } = useData();
  const [slug, setSlug] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);

  useEffect(() => {
    setSlug(new URLSearchParams(window.location.search).get("slug") || "");
  }, []);

  const item =
    slug != null
      ? news.find((n) => n.slug === slug) ?? fallbackNews.find((n) => n.slug === slug) ?? null
      : null;

  if (!item) {
    const loadingNow = slug === null || !loaded;
    return (
      <>
        <Header />
        <main className="flex min-h-[60vh] items-center justify-center pt-20 text-center">
          <div>
            <p className="text-lg font-bold text-slate-500">
              {loadingNow ? "Carregando notícia..." : "Notícia não encontrada."}
            </p>
            <Link href="/noticias" className="mt-4 inline-flex text-sm font-black uppercase text-secondary-deep">
              Ver todas as notícias
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const blocks = (item.content || item.excerpt || "")
    .split("\n")
    .map((p) => p.trim())
    .filter(Boolean);

  const related = news.filter((n) => n.slug !== item.slug);
  const relevantes = related.filter((n) => n.category === item.category);
  const sugestoes = (relevantes.length ? relevantes : related).slice(0, 3);

  return (
    <>
      <Header />
      <main className="pt-20">
        <section className="relative min-h-[420px] overflow-hidden bg-primary text-white">
          {item.image ? (
            <>
              <Image src={item.image} alt="" aria-hidden fill priority className="scale-110 object-cover opacity-50 blur-2xl" sizes="100vw" />
              <Image src={item.image} alt={item.title} fill priority className="object-contain" sizes="100vw" />
            </>
          ) : null}
          <div className="hero-overlay absolute inset-0" />
          <div className="container-shell relative flex min-h-[420px] flex-col justify-end py-12">
            <Link href="/noticias" className="focus-ring mb-6 inline-flex items-center gap-2 text-sm font-bold uppercase text-white/85 hover:text-white">
              <ArrowLeft size={16} /> Voltar para notícias
            </Link>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-secondary px-4 py-1 text-xs font-black uppercase">{item.category}</span>
              <span className="text-sm font-bold text-white/85">{item.date}</span>
              {item.author ? (
                <span className="inline-flex items-center gap-1 text-sm font-bold text-white/85">
                  <User size={14} /> {item.author}
                </span>
              ) : null}
            </div>
            <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight md:text-5xl">{item.title}</h1>
          </div>
        </section>

        <MotionSection className="py-16">
          <div className="container-shell max-w-3xl">
            {item.excerpt ? (
              <p className="mb-6 text-lg font-bold leading-8 text-primary">{item.excerpt}</p>
            ) : null}
            {blocks.map((block, i) => {
              const md = block.match(/^!\[[^\]]*\]\((.+)\)$/);
              const url = md ? md[1] : isImageUrl(block) ? block : null;
              if (url) {
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setLightbox(url)}
                    className="my-6 block w-full overflow-hidden rounded-lg soft-shadow"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="" className="h-auto w-full" />
                  </button>
                );
              }
              return (
                <p key={i} className="mb-4 text-base font-medium leading-8 text-slate-600">{block}</p>
              );
            })}

            {(item.tags ?? []).length ? (
              <div className="mt-8 flex flex-wrap gap-2">
                {(item.tags ?? []).map((tag) => (
                  <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">#{tag}</span>
                ))}
              </div>
            ) : null}
          </div>
        </MotionSection>

        {(item.gallery ?? []).length ? (
          <MotionSection className="bg-[#f5f7f8] py-16">
            <div className="container-shell">
              <span className="section-label">Galeria</span>
              <h2 className="mt-2 text-3xl font-black text-primary">Imagens da notícia</h2>
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {(item.gallery ?? []).map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setLightbox(img)}
                    className="group relative aspect-[4/3] overflow-hidden rounded-lg soft-shadow"
                  >
                    <Image src={img} alt={`${item.title} - imagem ${i + 1}`} fill className="object-cover transition duration-500 group-hover:scale-105" sizes="(min-width: 1024px) 33vw, 50vw" />
                  </button>
                ))}
              </div>
            </div>
          </MotionSection>
        ) : null}

        {sugestoes.length ? (
          <MotionSection className="py-16">
            <div className="container-shell">
              <span className="section-label">Continue lendo</span>
              <h2 className="mt-2 text-3xl font-black text-primary">Outras notícias</h2>
              <div className="mt-8 grid gap-8 md:grid-cols-3">
                {sugestoes.map((n) => (
                  <Link key={n.slug} href={`/noticia/?slug=${n.slug}`} className="group flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white soft-shadow transition hover:-translate-y-1">
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <Image src={n.image} alt={n.title} fill className="object-cover transition duration-500 group-hover:scale-105" sizes="(min-width: 1024px) 33vw, 100vw" />
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <span className="text-xs font-bold uppercase text-slate-500">{n.date}</span>
                      <h3 className="mt-1 text-base font-black leading-6 text-primary">{n.title}</h3>
                      <span className="mt-4 inline-flex items-center gap-2 text-sm font-black uppercase text-secondary-deep">
                        Ler mais <ArrowRight size={16} />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </MotionSection>
        ) : null}

        <CtaBand />
      </main>

      {lightbox ? (
        <div
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/85 p-4"
          role="dialog"
          aria-modal="true"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={lightbox} alt="" className="max-h-[90vh] max-w-full rounded-lg object-contain" onClick={(e) => e.stopPropagation()} />
          <button
            type="button"
            onClick={() => setLightbox(null)}
            aria-label="Fechar"
            className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-primary shadow"
          >
            <X size={22} />
          </button>
        </div>
      ) : null}

      <Footer />
      <WhatsAppButton />
    </>
  );
}
