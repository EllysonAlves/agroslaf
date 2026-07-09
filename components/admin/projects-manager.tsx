"use client";

import { ImagePlus, Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ImageField } from "@/components/admin/image-field";
import { api } from "@/lib/api";
import { iconOptions } from "@/lib/icons";
import { projectCategories, type Project } from "@/lib/site-data";

const empty: Project = {
  slug: "",
  title: "",
  category: "Agricultura",
  iconName: "sprout",
  summary: "",
  image: "",
  objetivo: "",
  beneficios: [],
  resultados: [],
  gallery: [],
  editions: [],
  parceiros: [],
};

const lines = (text: string) => text.split("\n").map((l) => l.trim()).filter(Boolean);
const toText = (arr: string[]) => arr.join("\n");
const resultadosToText = (arr: { value: string; label: string }[]) =>
  arr.map((r) => `${r.value} | ${r.label}`).join("\n");
const textToResultados = (text: string) =>
  lines(text).map((l) => {
    const [value, ...rest] = l.split("|");
    return { value: value.trim(), label: rest.join("|").trim() };
  });

const input = "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#4bae4f]";
const lbl = "text-xs font-black uppercase text-slate-600";

export function ProjectsManager() {
  const [items, setItems] = useState<Project[]>([]);
  const [editing, setEditing] = useState<Project | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // textos de campos multilinha
  const [beneficios, setBeneficios] = useState("");
  const [resultados, setResultados] = useState("");
  const [parceiros, setParceiros] = useState("");
  const [galUploading, setGalUploading] = useState(false);
  const [edUploadingIdx, setEdUploadingIdx] = useState<number | null>(null);

  function load() {
    api.listProjects().then(setItems).catch(() => setItems([]));
  }
  useEffect(load, []);

  function startEdit(project: Project, novo = false) {
    setEditing({ ...project });
    setIsNew(novo);
    setBeneficios(toText(project.beneficios));
    setResultados(resultadosToText(project.resultados));
    setParceiros(toText(project.parceiros));
    setError("");
  }

  async function save() {
    if (!editing) return;
    setSaving(true);
    setError("");
    const payload: Partial<Project> = {
      ...editing,
      beneficios: lines(beneficios),
      resultados: textToResultados(resultados),
      gallery: editing.gallery,
      parceiros: lines(parceiros),
    };
    try {
      if (isNew) await api.createProject(payload);
      else await api.updateProject(editing.slug, payload);
      setEditing(null);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  }

  async function remove(slug: string) {
    if (!confirm("Excluir este projeto?")) return;
    await api.deleteProject(slug);
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
      setEditing({ ...editing, gallery: [...editing.gallery, ...urls] });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha no upload");
    } finally {
      setGalUploading(false);
      event.target.value = "";
    }
  }

  function removeGalleryAt(index: number) {
    if (!editing) return;
    setEditing({ ...editing, gallery: editing.gallery.filter((_, i) => i !== index) });
  }

  function addEdition() {
    if (!editing) return;
    setEditing({ ...editing, editions: [...(editing.editions ?? []), { title: "", photos: [] }] });
  }

  function setEditionTitle(i: number, title: string) {
    if (!editing) return;
    const editions = (editing.editions ?? []).map((ed, idx) => (idx === i ? { ...ed, title } : ed));
    setEditing({ ...editing, editions });
  }

  function removeEdition(i: number) {
    if (!editing) return;
    setEditing({ ...editing, editions: (editing.editions ?? []).filter((_, idx) => idx !== i) });
  }

  async function uploadEditionPhotos(i: number, event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (!files.length || !editing) return;
    setEdUploadingIdx(i);
    setError("");
    try {
      const urls: string[] = [];
      for (const file of files) {
        const result = await api.uploadImage(file);
        urls.push(result.url);
      }
      const editions = (editing.editions ?? []).map((ed, idx) =>
        idx === i ? { ...ed, photos: [...ed.photos, ...urls] } : ed,
      );
      setEditing({ ...editing, editions });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha no upload");
    } finally {
      setEdUploadingIdx(null);
      event.target.value = "";
    }
  }

  function removeEditionPhoto(i: number, j: number) {
    if (!editing) return;
    const editions = (editing.editions ?? []).map((ed, idx) =>
      idx === i ? { ...ed, photos: ed.photos.filter((_, k) => k !== j) } : ed,
    );
    setEditing({ ...editing, editions });
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-black text-[#003b5c]">Projetos ({items.length})</h2>
        <button
          onClick={() => startEdit(empty, true)}
          className="inline-flex items-center gap-2 rounded-full bg-[#4bae4f] px-5 py-2.5 text-xs font-black uppercase text-white"
        >
          <Plus size={16} /> Novo projeto
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {items.map((p) => (
          <div key={p.slug} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3">
            <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-md bg-slate-100">
              {p.image ? <Image src={p.image} alt="" fill className="object-cover" sizes="80px" unoptimized /> : null}
            </div>
            <div className="min-w-0 flex-1">
              <strong className="block truncate text-[#003b5c]">{p.title}</strong>
              <span className="text-xs font-bold uppercase text-slate-400">{p.category}</span>
            </div>
            <button onClick={() => startEdit(p)} className="rounded-full p-2 text-slate-500 hover:bg-slate-100" aria-label="Editar">
              <Pencil size={18} />
            </button>
            <button onClick={() => remove(p.slug)} className="rounded-full p-2 text-red-500 hover:bg-red-50" aria-label="Excluir">
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      {editing ? (
        <div className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-black/50 p-3 sm:p-4">
          <div className="my-6 w-full max-w-2xl rounded-xl bg-white p-4 shadow-2xl sm:my-8 sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-black text-[#003b5c]">{isNew ? "Novo projeto" : "Editar projeto"}</h3>
              <button onClick={() => setEditing(null)} className="rounded-full p-2 hover:bg-slate-100" aria-label="Fechar">
                <X size={20} />
              </button>
            </div>

            <div className="grid gap-4">
              <label className="grid gap-1.5">
                <span className={lbl}>Título</span>
                <input className={input} value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-1.5">
                  <span className={lbl}>Categoria</span>
                  <select className={input} value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })}>
                    {projectCategories.filter((c) => c !== "Todos").map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-1.5">
                  <span className={lbl}>Ícone</span>
                  <select className={input} value={editing.iconName} onChange={(e) => setEditing({ ...editing, iconName: e.target.value as Project["iconName"] })}>
                    {iconOptions.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </label>
              </div>

              <ImageField label="Imagem principal" value={editing.image} onChange={(url) => setEditing({ ...editing, image: url })} />

              <label className="grid gap-1.5">
                <span className={lbl}>Resumo (card)</span>
                <textarea className={input} rows={2} value={editing.summary} onChange={(e) => setEditing({ ...editing, summary: e.target.value })} />
              </label>
              <label className="grid gap-1.5">
                <span className={lbl}>Objetivo (página do projeto)</span>
                <textarea className={input} rows={3} value={editing.objetivo} onChange={(e) => setEditing({ ...editing, objetivo: e.target.value })} />
              </label>
              <label className="grid gap-1.5">
                <span className={lbl}>Benefícios (um por linha)</span>
                <textarea className={input} rows={4} value={beneficios} onChange={(e) => setBeneficios(e.target.value)} />
              </label>
              <label className="grid gap-1.5">
                <span className={lbl}>Resultados (formato: valor | descrição)</span>
                <textarea className={input} rows={3} placeholder="120+ | quintais implantados" value={resultados} onChange={(e) => setResultados(e.target.value)} />
              </label>
              <div className="grid gap-1.5">
                <span className={lbl}>Galeria geral (sem divisão)</span>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {editing.gallery.map((url, i) => (
                    <div key={`${url}-${i}`} className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-slate-200">
                      <Image src={url} alt="" fill className="object-cover" sizes="120px" unoptimized />
                      <button
                        type="button"
                        onClick={() => removeGalleryAt(i)}
                        className="absolute right-1 top-1 rounded-full bg-white/90 p-1 text-red-500 shadow"
                        aria-label="Remover foto"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  <label className="flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-slate-300 text-slate-400 hover:border-[#4bae4f] hover:text-[#4bae4f]">
                    {galUploading ? <Loader2 size={22} className="animate-spin" /> : <ImagePlus size={22} />}
                    <span className="text-[10px] font-black uppercase">{galUploading ? "Enviando" : "Enviar"}</span>
                    <input type="file" accept="image/*" multiple className="hidden" onChange={uploadGallery} disabled={galUploading} />
                  </label>
                </div>
              </div>

              <div className="grid gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
                <div className="flex items-center justify-between">
                  <span className={lbl}>Edições / álbuns (subdivisões)</span>
                  <button type="button" onClick={addEdition} className="inline-flex items-center gap-1 rounded-full border border-slate-300 px-3 py-1 text-[11px] font-black uppercase text-slate-600 hover:border-[#4bae4f]">
                    <Plus size={12} /> Nova edição
                  </button>
                </div>
                {(editing.editions ?? []).map((ed, i) => (
                  <div key={i} className="rounded-lg border border-slate-200 bg-white p-3">
                    <div className="mb-2 flex items-center gap-2">
                      <input className={input} placeholder="Título da edição (ex: Edição 2024)" value={ed.title} onChange={(e) => setEditionTitle(i, e.target.value)} />
                      <button type="button" onClick={() => removeEdition(i)} className="rounded-full p-2 text-red-500 hover:bg-red-50" aria-label="Remover edição">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                      {ed.photos.map((url, j) => (
                        <div key={`${url}-${j}`} className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-slate-200">
                          <Image src={url} alt="" fill className="object-cover" sizes="100px" unoptimized />
                          <button type="button" onClick={() => removeEditionPhoto(i, j)} className="absolute right-1 top-1 rounded-full bg-white/90 p-1 text-red-500 shadow" aria-label="Remover foto">
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                      <label className="flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-slate-300 text-slate-400 hover:border-[#4bae4f] hover:text-[#4bae4f]">
                        {edUploadingIdx === i ? <Loader2 size={18} className="animate-spin" /> : <ImagePlus size={18} />}
                        <span className="text-[9px] font-black uppercase">{edUploadingIdx === i ? "Enviando" : "Enviar"}</span>
                        <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => uploadEditionPhotos(i, e)} disabled={edUploadingIdx === i} />
                      </label>
                    </div>
                  </div>
                ))}
                {(editing.editions ?? []).length === 0 ? (
                  <p className="text-xs text-slate-400">Sem edições. Crie edições para separar as fotos por tema ou data (ex.: &quot;Edição 2024&quot;, &quot;Entrega de kits&quot;).</p>
                ) : null}
              </div>

              <label className="grid gap-1.5">
                <span className={lbl}>Parceiros (um por linha)</span>
                <textarea className={input} rows={3} value={parceiros} onChange={(e) => setParceiros(e.target.value)} />
              </label>

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
