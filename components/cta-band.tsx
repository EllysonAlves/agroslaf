"use client";

import Image from "next/image";
import { useSiteSettings } from "@/lib/settings";

export function CtaBand() {
  const { images, cta, sections } = useSiteSettings();

  if (!sections.cta) return null;

  return (
    <section className="relative overflow-hidden bg-primary py-16 text-white">
      <Image src={images.hero} alt="" fill className="object-cover opacity-25" sizes="100vw" />
      <div className="absolute inset-0 bg-primary/80" />
      <div className="container-shell relative">
        <h2 className="max-w-2xl text-3xl font-black leading-tight md:text-5xl">{cta.title}</h2>
        <p className="mt-4 max-w-2xl text-base font-semibold leading-7 text-white/90">{cta.subtitle}</p>
      </div>
    </section>
  );
}
