"use client";

import { ArrowLeft, CheckCircle2, Handshake } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CtaBand } from "@/components/cta-band";
import { Counter } from "@/components/counter";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { MotionSection } from "@/components/motion-section";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { useData } from "@/lib/data";
import { getIcon } from "@/lib/icons";
import { projects as fallbackProjects } from "@/lib/site-data";

export default function ProjectDetailPage() {
  const { projects, loaded } = useData();
  const [slug, setSlug] = useState<string | null>(null);

  useEffect(() => {
    setSlug(new URLSearchParams(window.location.search).get("slug") || "");
  }, []);

  const project =
    slug != null
      ? projects.find((p) => p.slug === slug) ?? fallbackProjects.find((p) => p.slug === slug) ?? null
      : null;

  if (!project) {
    const loadingNow = slug === null || !loaded;
    return (
      <>
        <Header />
        <main className="flex min-h-[60vh] items-center justify-center pt-20 text-center">
          <div>
            <p className="text-lg font-bold text-slate-500">
              {loadingNow ? "Carregando projeto..." : "Projeto não encontrado."}
            </p>
            <Link href="/projetos" className="mt-4 inline-flex text-sm font-black uppercase text-secondary-deep">
              Ver todos os projetos
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const Icon = getIcon(project.iconName);

  return (
    <>
      <Header />
      <main className="pt-20">
        <section className="relative min-h-[480px] overflow-hidden bg-primary text-white">
          {/* fundo desfocado preenche as laterais sem cortar a foto */}
          <Image src={project.image} alt="" aria-hidden fill priority className="scale-110 object-cover opacity-50 blur-2xl" sizes="100vw" />
          {/* foto real, inteira (sem corte) */}
          <Image src={project.image} alt={project.title} fill priority className="object-contain" sizes="100vw" />
          <div className="hero-overlay absolute inset-0" />
          <div className="container-shell relative flex min-h-[480px] flex-col justify-end py-12">
            <Link href="/projetos" className="focus-ring mb-6 inline-flex items-center gap-2 text-sm font-bold uppercase text-white/85 hover:text-white">
              <ArrowLeft size={16} /> Voltar para projetos
            </Link>
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-white shadow-lg">
                <Icon size={30} />
              </div>
              <span className="rounded-full bg-white/15 px-4 py-1 text-xs font-black uppercase">{project.category}</span>
            </div>
            <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight md:text-6xl">{project.title}</h1>
          </div>
        </section>

        <MotionSection className="py-16">
          <div className="container-shell grid gap-12 lg:grid-cols-[1.3fr_0.9fr]">
            <div>
              <span className="section-label">O projeto</span>
              <h2 className="mt-2 text-3xl font-black text-primary">Objetivo</h2>
              <p className="mt-5 text-base font-medium leading-8 text-slate-600">{project.objetivo}</p>

              <h2 className="mt-10 text-3xl font-black text-primary">Benefícios</h2>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {project.beneficios.map((b) => (
                  <li key={b} className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-4 soft-shadow">
                    <CheckCircle2 className="mt-0.5 shrink-0 text-secondary" size={20} />
                    <span className="text-sm font-semibold leading-6 text-slate-700">{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            <aside className="h-fit rounded-lg border border-slate-200 bg-[#f5f7f8] p-7">
              <h3 className="text-lg font-black text-primary">Resultados alcançados</h3>
              <div className="mt-5 grid gap-5">
                {project.resultados.map((r) => (
                  <div key={r.label}>
                    <strong className="block text-3xl font-black text-secondary"><Counter value={r.value} /></strong>
                    <span className="text-sm font-semibold text-slate-600">{r.label}</span>
                  </div>
                ))}
              </div>
              {project.parceiros.length ? (
                <>
                  <h3 className="mt-8 flex items-center gap-2 text-lg font-black text-primary">
                    <Handshake size={20} className="text-secondary" /> Parceiros
                  </h3>
                  <ul className="mt-4 grid gap-2 text-sm font-semibold text-slate-600">
                    {project.parceiros.map((p) => (
                      <li key={p}>• {p}</li>
                    ))}
                  </ul>
                </>
              ) : null}
            </aside>
          </div>
        </MotionSection>

        {project.gallery.length ? (
          <MotionSection className="bg-[#f5f7f8] py-16">
            <div className="container-shell">
              <span className="section-label">Galeria</span>
              <h2 className="mt-2 text-3xl font-black text-primary">Registros do projeto</h2>
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {project.gallery.map((img, index) => (
                  <div key={index} className="relative aspect-[4/3] overflow-hidden rounded-lg soft-shadow">
                    <Image src={img} alt={`${project.title} - imagem ${index + 1}`} fill className="object-cover" sizes="(min-width: 1024px) 33vw, 50vw" />
                  </div>
                ))}
              </div>
            </div>
          </MotionSection>
        ) : null}

        {(project.editions ?? []).map((edition, ei) =>
          edition.photos.length ? (
            <MotionSection key={ei} className="py-16 odd:bg-white even:bg-[#f5f7f8]">
              <div className="container-shell">
                <span className="section-label">Edição</span>
                <h2 className="mt-2 text-3xl font-black text-primary">{edition.title || `Edição ${ei + 1}`}</h2>
                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {edition.photos.map((img, index) => (
                    <div key={index} className="relative aspect-[4/3] overflow-hidden rounded-lg soft-shadow">
                      <Image src={img} alt={`${edition.title} - imagem ${index + 1}`} fill className="object-cover" sizes="(min-width: 1024px) 33vw, 50vw" />
                    </div>
                  ))}
                </div>
              </div>
            </MotionSection>
          ) : null,
        )}

        <CtaBand />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
