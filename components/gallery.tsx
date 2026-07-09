"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { useGallery } from "@/lib/data";
import { galleryCategories, type GalleryPhoto } from "@/lib/site-data";

export function Gallery({ limit }: { limit?: number }) {
  const photos = useGallery();
  const [category, setCategory] = useState("Todos");
  const [active, setActive] = useState<GalleryPhoto | null>(null);

  const filtered = useMemo(() => {
    const list = category === "Todos" ? photos : photos.filter((p) => p.category === category);
    return limit ? list.slice(0, limit) : list;
  }, [photos, category, limit]);

  return (
    <div>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {galleryCategories.map((label) => (
          <button
            key={label}
            type="button"
            onClick={() => setCategory(label)}
            className={`focus-ring rounded-full px-5 py-2 text-xs font-black uppercase transition ${
              category === label
                ? "bg-secondary text-white"
                : "border border-slate-300 bg-white text-slate-600 hover:border-secondary"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((photo) => (
          <button
            key={photo.id}
            type="button"
            onClick={() => setActive(photo)}
            className="focus-ring group relative aspect-[4/3] overflow-hidden rounded-lg soft-shadow"
          >
            <Image
              src={photo.image}
              alt={photo.title}
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
              sizes="(min-width: 1024px) 33vw, 50vw"
            />
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary/90 to-transparent p-4 text-left text-sm font-bold text-white">
              {photo.title}
            </span>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {active ? (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
          >
            <motion.div
              className="relative max-h-[85vh] w-full max-w-3xl overflow-hidden rounded-lg bg-white"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="relative aspect-[4/3] w-full">
                <Image src={active.image} alt={active.title} fill className="object-cover" sizes="100vw" />
              </div>
              <div className="flex items-center justify-between gap-4 p-5">
                <div>
                  <strong className="block font-black text-primary">{active.title}</strong>
                  <span className="text-xs font-bold uppercase text-secondary">{active.category}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActive(null)}
                aria-label="Fechar"
                className="focus-ring absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-primary shadow"
              >
                <X size={20} />
              </button>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
