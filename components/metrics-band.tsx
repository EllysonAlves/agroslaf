"use client";

import { Counter } from "@/components/counter";
import { getIcon } from "@/lib/icons";
import { useSiteSettings } from "@/lib/settings";

export function MetricsBand() {
  const { metrics, sections } = useSiteSettings();

  if (!sections.metrics) return null;

  return (
    <section className="bg-primary py-16 text-white">
      <div className="container-shell text-center">
        <span className="section-label">Números que transformam</span>
        <h2 className="mt-2 text-3xl font-black md:text-4xl">Nosso impacto em números</h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {metrics.map(({ value, label, iconName }) => {
            const Icon = getIcon(iconName);
            return (
              <div key={label} className="rounded-lg border border-secondary/70 px-5 py-8">
                <Icon className="mx-auto text-secondary" size={40} strokeWidth={2.4} />
                <strong className="mt-5 block text-4xl font-black"><Counter value={value} /></strong>
                <span className="mt-2 block text-sm font-bold leading-5 text-white/85">{label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
