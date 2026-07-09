"use client";

import { motion } from "framer-motion";
import { ArrowRight, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CtaBand } from "@/components/cta-band";
import { FeaturedProjects } from "@/components/featured-projects";
import { Footer } from "@/components/footer";
import { Gallery } from "@/components/gallery";
import { Header } from "@/components/header";
import { MetricsBand } from "@/components/metrics-band";
import { MotionSection } from "@/components/motion-section";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { useNews } from "@/lib/data";
import { getIcon } from "@/lib/icons";
import { useSiteSettings } from "@/lib/settings";
import { transparency } from "@/lib/site-data";

export default function Home() {
  const { hero, about, timeline, stories, sections, siteInfo } = useSiteSettings();
  const liveNews = useNews();
  const bannerImages = (hero.images?.length ? hero.images : [hero.image]).filter(Boolean);

  return (
    <>
      <Header />
      <main>
        <section className="relative min-h-[500px] overflow-hidden bg-primary pt-20 text-white sm:min-h-[620px]">
          {/* 1 foto = preenche o banner; várias = uma ao lado da outra */}
          <div className="absolute inset-0 flex">
            {bannerImages.map((src, i) => (
              <div key={`${src}-${i}`} className="relative h-full flex-1">
                <Image src={src} alt={i === 0 ? siteInfo.name : ""} fill priority={i === 0} className="object-cover" sizes="100vw" />
              </div>
            ))}
          </div>
          {/* degradê: no celular escurece de baixo p/ cima (texto legível); no desktop, primária forte à direita */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/45 to-primary/20 lg:bg-gradient-to-l lg:from-primary lg:from-40% lg:via-primary/70 lg:to-transparent" />
          <div className="container-shell relative flex min-h-[420px] items-center justify-center sm:min-h-[540px] lg:justify-end">
            {/* painel com logo + texto (logo: Identidade; texto: Banner > subtítulo) */}
            <div className="w-full max-w-xl py-12 text-center sm:py-16">
              {hero.logo ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                >
                  <Image
                    src={hero.logo}
                    alt={siteInfo.name}
                    width={420}
                    height={260}
                    priority
                    className="mx-auto h-auto w-56 drop-shadow-lg sm:w-72 lg:w-[22rem]"
                  />
                </motion.div>
              ) : null}
              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.3, ease: "easeOut" }}
                className="mx-auto mt-6 max-w-lg text-lg font-bold leading-8 text-white/95 sm:text-xl"
              >
                {hero.subtitle}
              </motion.p>
            </div>
          </div>
        </section>

        {sections.historia ? (
        <MotionSection id="historia" className="py-20">
          <div className="container-shell grid gap-12 lg:grid-cols-[0.9fr_1.4fr] lg:items-center">
            <div>
              <span className="section-label">Nossa história</span>
              <h2 className="mt-3 text-4xl font-black leading-tight text-primary">
                Três décadas de união, trabalho e transformação.
              </h2>
              <p className="mt-6 text-base font-medium leading-8 text-slate-600">{about.intro}</p>
              {about.paragraphs[2] ? (
                <p className="mt-4 text-base font-medium leading-8 text-slate-600">{about.paragraphs[2]}</p>
              ) : null}
              <Link href="/sobre" className="focus-ring mt-8 inline-flex rounded-full bg-secondary px-7 py-4 text-sm font-black uppercase text-white transition hover:bg-secondary-dark">
                Conheça nossa trajetória
              </Link>
            </div>

            <div className="grid gap-5 md:grid-cols-4">
              {timeline.map((item) => (
                <article key={item.year} className="rounded-lg border border-slate-200 bg-white p-5 text-center soft-shadow">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-lg font-black text-white">
                    {item.year.slice(2)}
                  </div>
                  <strong className="mt-4 block text-lg font-black text-primary">{item.year}</strong>
                  <h3 className="mt-2 text-sm font-black text-primary">{item.title}</h3>
                  <p className="mt-3 text-sm font-medium leading-6 text-slate-600">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </MotionSection>
        ) : null}

        {sections.metrics ? <MetricsBand /> : null}

        {sections.projetos ? (
        <MotionSection id="projetos" className="py-20">
          <div className="container-shell">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <span className="section-label">Projetos em destaque</span>
                <h2 className="mt-2 text-4xl font-black text-primary">Iniciativas que geram transformação</h2>
              </div>
              <Link href="/projetos" className="focus-ring inline-flex items-center gap-2 rounded-full bg-secondary px-6 py-3 text-sm font-black uppercase text-white transition hover:bg-secondary-dark">
                Ver todos os projetos <ArrowRight size={16} />
              </Link>
            </div>
            <FeaturedProjects limit={4} />
          </div>
        </MotionSection>
        ) : null}

        {sections.galeria ? (
        <MotionSection className="bg-[#f5f7f8] py-20">
          <div className="container-shell text-center">
            <span className="section-label">Galeria de destaque</span>
            <h2 className="mt-2 text-4xl font-black text-primary">Momentos que contam nossa história</h2>
            <Gallery limit={6} />
          </div>
        </MotionSection>
        ) : null}

        {sections.depoimentos ? (
        <MotionSection className="bg-primary py-20 text-white">
          <div className="container-shell text-center">
            <span className="section-label">Depoimentos</span>
            <h2 className="mt-2 text-4xl font-black">Histórias reais, vidas transformadas</h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {stories.map((story) => (
                <article key={story.name} className="rounded-lg bg-white p-6 text-left text-primary soft-shadow">
                  <div className="flex items-center gap-4">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full">
                      <Image src={story.image} alt={story.name} fill className="object-cover" sizes="80px" />
                    </div>
                    <div>
                      <strong className="block font-black">{story.name}</strong>
                      <span className="text-sm font-bold text-slate-500">{story.role}</span>
                    </div>
                  </div>
                  <p className="mt-5 text-sm font-medium leading-7 text-slate-600">&ldquo;{story.quote}&rdquo;</p>
                </article>
              ))}
            </div>
          </div>
        </MotionSection>
        ) : null}

        {sections.noticias || sections.transparencia ? (
        <MotionSection className="py-20">
          <div className="container-shell grid gap-12 lg:grid-cols-2">
            {sections.noticias ? (
            <section id="noticias">
              <span className="section-label">Notícias e blog</span>
              <h2 className="mt-2 text-4xl font-black text-primary">Fique por dentro das novidades</h2>
              <div className="mt-8 grid gap-5">
                {liveNews.slice(0, 3).map((item) => (
                  <article key={item.slug} className="grid grid-cols-[112px_1fr] gap-4">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                      <Image src={item.image} alt="" fill className="object-cover" sizes="112px" />
                    </div>
                    <div>
                      <span className="text-xs font-bold uppercase text-slate-500">{item.date}</span>
                      <h3 className="mt-1 text-lg font-black leading-6 text-primary">{item.title}</h3>
                      <Link href={`/noticia/?slug=${item.slug}`} className="mt-2 inline-flex text-sm font-black uppercase text-secondary-deep">Ler mais</Link>
                    </div>
                  </article>
                ))}
              </div>
            </section>
            ) : null}

            {sections.transparencia ? (
            <section id="transparencia">
              <span className="section-label">Transparência</span>
              <h2 className="mt-2 text-4xl font-black text-primary">Compromisso com a transparência</h2>
              <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
                {transparency.map(({ label, iconName }) => {
                  const Icon = getIcon(iconName);
                  return (
                    <Link key={label} href="/transparencia" className="focus-ring rounded-lg border border-slate-200 bg-white p-6 text-center soft-shadow transition hover:-translate-y-1">
                      <Icon className="mx-auto text-secondary" size={34} />
                      <strong className="mt-3 block text-sm font-black text-primary">{label}</strong>
                    </Link>
                  );
                })}
              </div>
              <Link href="/transparencia" className="mt-6 flex items-center gap-3 rounded-full border border-slate-200 bg-white px-5 py-3 text-slate-500">
                <Search className="text-secondary" size={20} />
                <span className="text-sm font-semibold">Buscar documentos...</span>
              </Link>
            </section>
            ) : null}
          </div>
        </MotionSection>
        ) : null}

        {sections.cta ? <CtaBand /> : null}
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
