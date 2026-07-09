"use client";

import { Download, FileText, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { CtaBand } from "@/components/cta-band";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { MotionSection } from "@/components/motion-section";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { useSiteSettings } from "@/lib/settings";

export default function TransparenciaPage() {
  const { transparencyDocs } = useSiteSettings();
  const [category, setCategory] = useState("Todos");
  const [query, setQuery] = useState("");

  const categories = useMemo(
    () => ["Todos", ...Array.from(new Set(transparencyDocs.map((d) => d.category)))],
    [transparencyDocs],
  );

  const filtered = useMemo(
    () =>
      transparencyDocs.filter((doc) => {
        const matchCategory = category === "Todos" || doc.category === category;
        const matchQuery = doc.title.toLowerCase().includes(query.toLowerCase());
        return matchCategory && matchQuery;
      }),
    [transparencyDocs, category, query],
  );

  return (
    <>
      <Header />
      <main className="pt-20">
        <section className="bg-primary py-16 text-white">
          <div className="container-shell">
            <span className="section-label">Transparência</span>
            <h1 className="mt-2 text-4xl font-black md:text-6xl">Compromisso com a transparência</h1>
            <p className="mt-4 max-w-2xl text-base font-medium leading-7 text-white/85">
              Acesse os documentos institucionais da AGROSLAF. Prestamos contas com clareza e responsabilidade.
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
                placeholder="Buscar documentos..."
                aria-label="Buscar documentos"
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

            <div className="mt-8 grid gap-4">
              {filtered.length === 0 ? (
                <p className="rounded-lg border border-dashed border-slate-300 p-8 text-center font-semibold text-slate-500">
                  Nenhum documento encontrado.
                </p>
              ) : (
                filtered.map((doc) => (
                  <article key={doc.title} className="flex flex-col items-start justify-between gap-4 rounded-lg border border-slate-200 bg-white p-5 soft-shadow sm:flex-row sm:items-center">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary/12 text-secondary">
                        <FileText size={24} />
                      </div>
                      <div>
                        <strong className="block font-black text-primary">{doc.title}</strong>
                        <span className="text-xs font-bold uppercase text-slate-500">{doc.category} • {doc.date}</span>
                      </div>
                    </div>
                    <a
                      href={doc.url || "#"}
                      target={doc.url && doc.url !== "#" ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="focus-ring inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-black uppercase text-white transition hover:bg-primary-dark"
                    >
                      <Download size={16} /> Baixar
                    </a>
                  </article>
                ))
              )}
            </div>
          </div>
        </MotionSection>

        <CtaBand />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
