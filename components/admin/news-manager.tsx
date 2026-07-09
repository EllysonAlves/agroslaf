"use client";

import { ImagePlus, Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ImageField } from "@/components/admin/image-field";
import { api } from "@/lib/api";
import type { NewsItem } from "@/lib/site-data";

const empty: NewsItem = {
  slug: "",
  date: "",
  category: "Institucional",
  author: "",
  title: "",
  excerpt: "",
  image: "",
  content: "",
  published: true,
  featured: false,
  gallery: [],
  tags: [],
};

const categories = ["Institucional", "Projetos", "Capacitacoes", "Eventos", "Comunidade"];
const input = "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#4bae4f]";
const lbl = "text-xs font-black uppercase text-slate-600";

export function NewsManager() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [editing, setEditing] = useState<NewsItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [galUploading, setGalUploading] = useState(false);
  const [tagsText, setTagsText] = useState("");
  const [contentUploading, setContentUploading] = useState(false);

  function load() {
    api.listAllNews().then(setItems).catch(() => setItems([]));
  }
  useEffect(load, []);

  function startEdit(item: NewsItem, novo = false) {
    setEditing({ ...empty, ...item });
    setIsNew(novo);
    setTagsText((item.tags ?? []).join(", "));
    setError("");
  }

  async function save() {
    if (!editing) return;
    setSaving(true);
    setError("");
    const payload = {
      ...editing,
      tags: tagsText.split(",").map((t) => t.trim()).filter(Boolean),
    };
    try {
      if (isNew) await api.createNews(payload);
      else await api.updateNews(editing.slug, payload);
      setEditing(null);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  }

  async function remove(slug: string) {
    if (!confirm("Excluir esta notícia?")) return;
    await api.deleteNews(slug);
    load();
  }

  async function uploadGallery(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (!files.length || !editing) return;
    setGalUploading(true);
    setError("");
    try {
      const urls: string[] = [];
      for (const file of files) {
        const result = await api.uploadImage(file);
        urls.push(result.url);
      }
      setEditing({ ...editing, gallery: [...(editing.gallery ?? []), ...urls] });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha no upload");
    } finally {
      setGalUploading(false);
      event.target.value = "";
    }
  }

  function removeGalleryAt(index: number) {
    if (!editing) return;
    setEditing({ ...editing, gallery: (editing.gallery ?? []).filter((_, i) => i !== index) });
  }

  async function insertContentImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !editing) return;
    setContentUploading(true);
    setError("");
    try {
      const result = await api.uploadImage(file);
      const current = editing.content ?? "";
      const sep = current && !current.endsWith("\n") ? "\n\n" : "";
      setEditing({ ...editing, content: `${current}${sep}${result.url}\n` });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha no upload");
    } finally {
      setContentUploading(false);
      event.target.value = "";
    }
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-black text-[#003b5c]">Notícias ({items.length})</h2>
        <button onClick={() => startEdit(empty, true)} className="inline-flex items-center gap-2 rounded-full bg-[#4bae4f] px-5 py-2.5 text-xs font-black uppercase text-white">
          <Plus size={16} /> Nova notícia
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {items.map((n) => (
          <div key={n.slug} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3">
            <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-md bg-slate-100">
              {n.image ? <Image src={n.image} alt="" fill className="object-cover" sizes="80px" unoptimized /> : null}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex min-w-0 items-center gap-2">
                <strong className="truncate text-[#003b5c]">{n.title}</strong>
                {n.featured ? <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-black uppercase text-amber-700">Destaque</span> : null}
                {n.published === false ? <span className="shrink-0 rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-black uppercase text-slate-600">Rascunho</span> : null}
              </div>
              <span className="block truncate text-xs font-bold uppercase text-slate-400">{n.date} • {n.category}{n.author ? ` • ${n.author}` : ""}</span>
            </div>
            <button onClick={() => startEdit(n)} className="rounded-full p-2 text-slate-500 hover:bg-slate-100" aria-label="Editar">
              <Pencil size={18} />
            </button>
            <button onClick={() => remove(n.slug)} className="rounded-full p-2 text-red-500 hover:bg-red-50" aria-label="Excluir">
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      {editing ? (
        <div className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-black/50 p-3 sm:p-4">
          <div className="my-6 w-full max-w-2xl rounded-xl bg-white p-4 shadow-2xl sm:my-8 sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-black text-[#003b5c]">{isNew ? "Nova notícia" : "Editar notícia"}</h3>
              <button onClick={() => setEditing(null)} className="rounded-full p-2 hover:bg-slate-100" aria-label="Fechar">
                <X size={20} />
              </button>
            </div>
            <div className="grid gap-4">
              <label className="grid gap-1.5">
                <span className={lbl}>Título</span>
                <input className={input} value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
              </label>

              <div className="grid gap-4 sm:grid-cols-3">
                <label className="grid gap-1.5">
                  <span className={lbl}>Data (texto)</span>
                  <input className={input} placeholder="18 de novembro, 2025" value={editing.date} onChange={(e) => setEditing({ ...editing, date: e.target.value })} />
                </label>
                <label className="grid gap-1.5">
                  <span className={lbl}>Categoria</span>
                  <select className={input} value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })}>
                    {categories.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-1.5">
                  <span className={lbl}>Autor</span>
                  <input className={input} placeholder="Nome do autor" value={editing.author ?? ""} onChange={(e) => setEditing({ ...editing, author: e.target.value })} />
                </label>
              </div>

              <ImageField label="Imagem de capa" value={editing.image} onChange={(url) => setEditing({ ...editing, image: url })} />

              <label className="grid gap-1.5">
                <span className={lbl}>Resumo</span>
                <textarea className={input} rows={2} value={editing.excerpt} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} />
              </label>
              <div className="grid gap-1.5">
                <span className={lbl}>Conteúdo completo (um parágrafo por linha; imagens ficam em uma linha própria)</span>
                <textarea className={input} rows={8} value={editing.content ?? ""} onChange={(e) => setEditing({ ...editing, content: e.target.value })} />
                <label className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-full bg-[#003b5c] px-4 py-2 text-xs font-black uppercase text-white">
                  {contentUploading ? <Loader2 size={14} className="animate-spin" /> : <ImagePlus size={14} />}
                  {contentUploading ? "Enviando..." : "Inserir imagem no conteúdo"}
                  <input type="file" accept="image/*" className="hidden" onChange={insertContentImage} disabled={contentUploading} />
                </label>
                <p className="text-xs text-slate-400">A imagem entra como uma linha (a URL) no fim do conteúdo. Recorte e cole essa linha para posicioná-la entre os parágrafos.</p>
              </div>

              <label className="grid gap-1.5">
                <span className={lbl}>Tags (separadas por vírgula)</span>
                <input
                  className={input}
                  placeholder="agricultura, capacitação, comunidade"
                  value={tagsText}
                  onChange={(e) => setTagsText(e.target.value)}
                />
              </label>

              <div className="grid gap-1.5">
                <span className={lbl}>Galeria de imagens da notícia</span>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                  {(editing.gallery ?? []).map((url, i) => (
                    <div key={`${url}-${i}`} className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-slate-200">
                      <Image src={url} alt="" fill className="object-cover" sizes="100px" unoptimized />
                      <button type="button" onClick={() => removeGalleryAt(i)} className="absolute right-1 top-1 rounded-full bg-white/90 p-1 text-red-500 shadow" aria-label="Remover foto">
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  <label className="flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-slate-300 text-slate-400 hover:border-[#4bae4f] hover:text-[#4bae4f]">
                    {galUploading ? <Loader2 size={18} className="animate-spin" /> : <ImagePlus size={18} />}
                    <span className="text-[9px] font-black uppercase">{galUploading ? "Enviando" : "Enviar"}</span>
                    <input type="file" accept="image/*" multiple className="hidden" onChange={uploadGallery} disabled={galUploading} />
                  </label>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                  <input type="checkbox" checked={editing.published !== false} onChange={(e) => setEditing({ ...editing, published: e.target.checked })} />
                  Publicada (desmarque para rascunho)
                </label>
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                  <input type="checkbox" checked={!!editing.featured} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} />
                  Destaque
                </label>
              </div>

              {error ? <p className="text-sm font-bold text-red-600">{error}</p> : null}

              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setEditing(null)} className="rounded-full border border-slate-300 px-5 py-2.5 text-xs font-black uppercase text-slate-600">
                  Cancelar
                </button>
                <button onClick={save} disabled={saving} className="rounded-full bg-[#4bae4f] px-6 py-2.5 text-xs font-black uppercase text-white disabled:opacity-60">
                  {saving ? "Salvando..." : "Salvar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
