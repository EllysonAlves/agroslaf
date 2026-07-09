"use client";

import { Plus, Trash2, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ImageField } from "@/components/admin/image-field";
import { api } from "@/lib/api";
import { galleryCategories, type GalleryPhoto } from "@/lib/site-data";

const input = "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#4bae4f]";
const lbl = "text-xs font-black uppercase text-slate-600";

export function GalleryManager() {
  const [items, setItems] = useState<GalleryPhoto[]>([]);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ title: "", category: "Eventos", image: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function load() {
    api.listGallery().then(setItems).catch(() => setItems([]));
  }
  useEffect(load, []);

  async function save() {
    if (!form.image) {
      setError("Envie uma foto.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await api.createPhoto(form);
      setForm({ title: "", category: "Eventos", image: "" });
      setAdding(false);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: number) {
    if (!confirm("Excluir esta foto?")) return;
    await api.deletePhoto(id);
    load();
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-black text-[#003b5c]">Galeria ({items.length})</h2>
        <button onClick={() => setAdding(true)} className="inline-flex items-center gap-2 rounded-full bg-[#4bae4f] px-5 py-2.5 text-xs font-black uppercase text-white">
          <Plus size={16} /> Nova foto
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((photo) => (
          <div key={photo.id} className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-slate-200">
            {photo.image ? <Image src={photo.image} alt={photo.title} fill className="object-cover" sizes="200px" unoptimized /> : null}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2">
              <span className="block truncate text-xs font-bold text-white">{photo.title}</span>
              <span className="text-[10px] font-bold uppercase text-white/70">{photo.category}</span>
            </div>
            <button
              onClick={() => remove(photo.id)}
              className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 text-red-500 opacity-0 transition group-hover:opacity-100"
              aria-label="Excluir foto"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {adding ? (
        <div className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-black/50 p-3 sm:p-4">
          <div className="my-6 w-full max-w-lg rounded-xl bg-white p-4 shadow-2xl sm:my-8 sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-black text-[#003b5c]">Nova foto</h3>
              <button onClick={() => setAdding(false)} className="rounded-full p-2 hover:bg-slate-100" aria-label="Fechar">
                <X size={20} />
              </button>
            </div>
            <div className="grid gap-4">
              <ImageField label="Foto" value={form.image} onChange={(url) => setForm({ ...form, image: url })} />
              <label className="grid gap-1.5">
                <span className={lbl}>Título</span>
                <input className={input} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </label>
              <label className="grid gap-1.5">
                <span className={lbl}>Categoria</span>
                <select className={input} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {galleryCategories.filter((c) => c !== "Todos").map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>
              {error ? <p className="text-sm font-bold text-red-600">{error}</p> : null}
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setAdding(false)} className="rounded-full border border-slate-300 px-5 py-2.5 text-xs font-black uppercase text-slate-600">
                  Cancelar
                </button>
                <button onClick={save} disabled={saving} className="rounded-full bg-[#4bae4f] px-6 py-2.5 text-xs font-black uppercase text-white disabled:opacity-60">
                  {saving ? "Salvando..." : "Adicionar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
