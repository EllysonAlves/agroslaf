"use client";

import Image from "next/image";
import { CtaBand } from "@/components/cta-band";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { MetricsBand } from "@/components/metrics-band";
import { MotionSection } from "@/components/motion-section";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { useSiteSettings } from "@/lib/settings";

export default function SobrePage() {
  const { about, timeline, images, sections } = useSiteSettings();

  return (
    <>
      <Header />
      <main className="pt-20">
        <section className="relative min-h-[360px] overflow-hidden text-white">
          <Image src={images.hero} alt="Comunidade do Sítio Lagoa Funda" fill priority className="object-cover" sizes="100vw" />
          <div className="hero-overlay absolute inset-0" />
          <div className="container-shell relative flex min-h-[360px] flex-col justify-end py-12">
            <span className="section-label">Nossa história</span>
            <h1 className="mt-2 max-w-3xl text-4xl font-black leading-tight md:text-6xl">
              Três décadas de união, trabalho e transformação.
            </h1>
          </div>
        </section>

        <MotionSection className="py-16">
          <div className="container-shell grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              {about.paragraphs.map((p) => (
                <p key={p} className="mb-4 text-base font-medium leading-8 text-slate-600">{p}</p>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="rounded-lg border border-slate-200 bg-white p-5 soft-shadow">
                <strong className="block text-3xl font-black text-secondary">{about.founders.total}</strong>
                <span className="text-xs font-bold text-slate-500">fundadores</span>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-5 soft-shadow">
                <strong className="block text-3xl font-black text-primary">{about.founders.homens}</strong>
                <span className="text-xs font-bold text-slate-500">homens</span>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-5 soft-shadow">
                <strong className="block text-3xl font-black text-[#b88746]">{about.founders.mulheres}</strong>
                <span className="text-xs font-bold text-slate-500">mulheres</span>
              </div>
            </div>
          </div>
        </MotionSection>

        <MotionSection className="bg-[#f5f7f8] py-16">
          <div className="container-shell">
            <div className="text-center">
              <span className="section-label">Linha do tempo</span>
              <h2 className="mt-2 text-4xl font-black text-primary">Nossa trajetória</h2>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-4">
              {timeline.map((item) => (
                <article key={item.year} className="rounded-lg border border-slate-200 bg-white p-6 text-center soft-shadow">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-lg font-black text-white">
                    {item.year.slice(2)}
                  </div>
                  <strong className="mt-4 block text-xl font-black text-primary">{item.year}</strong>
                  <h3 className="mt-2 text-sm font-black text-primary">{item.title}</h3>
                  <p className="mt-3 text-sm font-medium leading-6 text-slate-600">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </MotionSection>

        <MotionSection className="py-16">
          <div className="container-shell">
            <div className="text-center">
              <span className="section-label">Nossos valores</span>
              <h2 className="mt-2 text-4xl font-black text-primary">O que nos move</h2>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {about.valores.map((v) => (
                <article key={v.title} className="rounded-lg border border-slate-200 bg-white p-6 soft-shadow">
                  <strong className="block text-lg font-black text-primary">{v.title}</strong>
                  <p className="mt-3 text-sm font-medium leading-6 text-slate-600">{v.text}</p>
                </article>
              ))}
            </div>
          </div>
        </MotionSection>

        {sections.metrics ? <MetricsBand /> : null}
        {sections.cta ? <CtaBand /> : null}
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
