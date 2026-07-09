"use client";

import { Home as HomeIcon, UsersRound } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { CtaBand } from "@/components/cta-band";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { MetricsBand } from "@/components/metrics-band";
import { MotionSection } from "@/components/motion-section";
import { ProjectCard } from "@/components/project-card";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { useProjects } from "@/lib/data";
import { projectCategories, stories } from "@/lib/site-data";

export default function ProjectsPage() {
  const projects = useProjects();
  const [activeCategory, setActiveCategory] = useState("Todos");

  const filteredProjects = useMemo(
    () =>
      activeCategory === "Todos"
        ? projects
        : projects.filter((project) => project.category === activeCategory),
    [projects, activeCategory],
  );

  const [heroIdx, setHeroIdx] = useState(0);

  useEffect(() => {
    if (projects.length <= 1) return;
    const id = setInterval(() => setHeroIdx((i) => (i + 1) % projects.length), 4000);
    return () => clearInterval(id);
  }, [projects.length]);

  return (
    <>
      <Header />
      <main className="pt-20">
        <section className="overflow-hidden bg-white py-16 md:py-24">
          <div className="container-shell grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <nav className="mb-7 text-sm font-bold text-slate-500" aria-label="Breadcrumb">
                <span className="text-secondary">Início</span> <span className="mx-2">›</span> Projetos
              </nav>
              <h1 className="text-4xl font-black leading-[1.05] text-primary sm:text-5xl md:text-6xl">
                Projetos que geram transformação no campo.
              </h1>
              <p className="mt-6 max-w-xl text-lg font-medium leading-8 text-slate-600">
                Iniciativas que promovem desenvolvimento, fortalecem a agricultura familiar e constroem um futuro mais digno para nossa comunidade.
              </p>
              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-4 border-r border-slate-200 pr-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary/12 text-secondary">
                    <UsersRound size={28} />
                  </div>
                  <strong className="text-sm font-black leading-5 text-primary">
                    Foco em pessoas e comunidades
                  </strong>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary/12 text-secondary">
                    <HomeIcon size={28} />
                  </div>
                  <strong className="text-sm font-black leading-5 text-primary">
                    Ações que geram impacto real
                  </strong>
                </div>
              </div>
            </div>

            <div className="relative min-h-[360px] overflow-hidden rounded-l-[42%] border-l-2 border-secondary bg-primary lg:min-h-[470px]">
              {projects.map((project, i) => (
                <Image
                  key={project.slug ?? i}
                  src={project.image}
                  alt={project.title}
                  fill
                  priority={i === 0}
                  className={`object-cover transition-opacity duration-1000 ${i === heroIdx ? "opacity-100" : "opacity-0"}`}
                  sizes="(min-width: 1024px) 52vw, 100vw"
                />
              ))}
            </div>
          </div>
        </section>

        <MotionSection className="bg-[#f5f7f8] py-16">
          <div className="container-shell text-center">
            <span className="section-label">Nossos projetos</span>
            <h2 className="mt-2 text-4xl font-black text-primary">Conheça nossas iniciativas</h2>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              {projectCategories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`focus-ring rounded-full px-5 py-2 text-xs font-black uppercase transition ${
                    activeCategory === category
                      ? "bg-secondary text-white"
                      : "border border-slate-300 bg-white text-slate-600 hover:border-secondary"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="mt-10 grid gap-6 text-left md:grid-cols-2 lg:grid-cols-4">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.slug}
                  slug={project.slug}
                  title={project.title}
                  summary={project.summary}
                  image={project.image}
                  iconName={project.iconName}
                />
              ))}
            </div>
          </div>
        </MotionSection>

        <MetricsBand />

        <MotionSection className="py-20">
          <div className="container-shell text-center">
            <span className="section-label">Impacto na vida das pessoas</span>
            <h2 className="mt-2 text-4xl font-black text-primary">Histórias que nos motivam</h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {stories.map((story) => (
                <article key={story.name} className="grid overflow-hidden rounded-lg border border-slate-200 bg-white text-left soft-shadow sm:grid-cols-[160px_1fr]">
                  <div className="relative min-h-48 sm:min-h-full">
                    <Image src={story.image} alt={story.name} fill className="object-cover" sizes="160px" />
                  </div>
                  <div className="p-6">
                    <span className="text-5xl font-black leading-none text-secondary">&ldquo;</span>
                    <p className="text-sm font-medium leading-7 text-slate-600">{story.quote}</p>
                    <strong className="mt-5 block text-sm font-black text-primary">{story.name}</strong>
                    <span className="text-xs font-bold text-slate-500">{story.role}</span>
                  </div>
                </article>
              ))}
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
