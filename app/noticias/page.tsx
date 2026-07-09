"use client";

import { ArrowRight, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { CtaBand } from "@/components/cta-band";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { MotionSection } from "@/components/motion-section";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { useNews } from "@/lib/data";

export default function NoticiasPage() {
  const news = useNews();
  const [category, setCategory] = useState("Todas");
  const [query, setQuery] = useState("");

  const categories = useMemo(
    () => ["Todas", ...Array.from(new Set(news.map((n) => n.category).filter(Boolean)))],
    [news],
  );

  const filtered = useMemo(
    () =>
      news.filter((item) => {
        const matchCat = category === "Todas" || item.category === category;
        const q = query.toLowerCase();
        const matchQuery =
          !q ||
          item.title.toLowerCase().includes(q) ||
          item.excerpt.toLowerCase().includes(q) ||
          (item.tags ?? []).some((t) => t.toLowerCase().includes(q));
        return matchCat && matchQuery;
      }),
    [news, category, query],
  );

  return (
    <>
      <Header />
      <main className="pt-20">
        <section className="bg-primary py-16 text-white">
          <div className="container-shell">
            <span className="section-label">Notícias e blog</span>
            <h1 className="mt-2 text-4xl font-black md:text-6xl">Fique por dentro das novidades</h1>
            <p className="mt-4 max-w-2xl text-base font-medium leading-7 text-white/85">
              Acompanhe as ações, conquistas e novidades da AGROSLAF e das comunidades que atendemos.
            </p>
          </div>
        </section>

        <MotionSection className="py-16">
          <div className="container-shell">
            <label className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-5 py-3 soft-shadow">
              <Search className="text-secondary" size={20} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="min-w-0 flex-1 outline-none"
                placeholder="Buscar notícias..."
                aria-label="Buscar notícias"
              />
            </label>

            <div className="mt-6 flex flex-wrap gap-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`focus-ring rounded-full px-5 py-2 text-xs font-black uppercase transition ${
                    category === cat ? "bg-secondary text-white" : "border border-slate-300 bg-white text-slate-600 hover:border-secondary"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {filtered.length === 0 ? (
              <p className="mt-10 rounded-lg border border-dashed border-slate-300 p-8 text-center font-semibold text-slate-500">
                Nenhuma notícia encontrada.
              </p>
            ) : (
              <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {filtered.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/noticia/?slug=${item.slug}`}
                    className="group flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white soft-shadow transition hover:-translate-y-1"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <Image src={item.image} alt={item.title} fill className="object-cover transition duration-500 group-hover:scale-105" sizes="(min-width: 1024px) 33vw, 100vw" />
                      <span className="absolute left-3 top-3 rounded-full bg-secondary px-3 py-1 text-xs font-black uppercase text-white">{item.category}</span>
                      {item.featured ? (
                        <span className="absolute right-3 top-3 rounded-full bg-amber-400 px-3 py-1 text-xs font-black uppercase text-amber-950">Destaque</span>
                      ) : null}
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <span className="text-xs font-bold uppercase text-slate-500">{item.date}{item.author ? ` • ${item.author}` : ""}</span>
                      <h2 className="mt-2 text-lg font-black leading-6 text-primary">{item.title}</h2>
                      <p className="mt-3 flex-1 text-sm font-medium leading-6 text-slate-600">{item.excerpt}</p>
                      <span className="mt-5 inline-flex items-center gap-2 text-sm font-black uppercase text-secondary-deep">
                        Ler mais <ArrowRight size={16} />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </MotionSection>

        <CtaBand />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
