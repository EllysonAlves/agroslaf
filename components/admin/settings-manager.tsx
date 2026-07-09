"use client";

import { ImagePlus, Loader2, Plus, Save, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { ImageField } from "@/components/admin/image-field";
import { api } from "@/lib/api";
import { iconOptions } from "@/lib/icons";
import { applyTheme, defaultSettings, mergeSettings, sectionLabels, type SiteSettings } from "@/lib/settings";

const input = "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#4bae4f]";
const lbl = "text-xs font-black uppercase text-slate-600";
const card = "rounded-xl border border-slate-200 bg-white p-6";
const h = "text-lg font-black text-[#003b5c] mb-4";
const addBtn = "inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-xs font-black uppercase text-slate-600 hover:border-[#4bae4f]";

export function SettingsManager() {
  const [s, setS] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [themeName, setThemeName] = useState("");

  useEffect(() => {
    api
      .getSettings()
      .then((data) => setS(mergeSettings(defaultSettings, data)))
      .catch(() => setS(defaultSettings))
      .finally(() => setLoading(false));
  }, []);

  function patch(part: Partial<SiteSettings>) {
    setS((prev) => ({ ...prev, ...part }));
  }

  async function save() {
    setSaving(true);
    setMsg("");
    try {
      await api.updateSettings(s);
      setMsg("Configurações salvas com sucesso!");
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-slate-500">Carregando...</p>;

  return (
    <div className="grid gap-6 pb-24">
      {/* CONTATO / IDENTIDADE */}
      <section className={card}>
        <h3 className={h}>Identidade e contato</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nome do site" value={s.siteInfo.name} onChange={(v) => patch({ siteInfo: { ...s.siteInfo, name: v } })} />
          <Field label="Tagline" value={s.siteInfo.tagline} onChange={(v) => patch({ siteInfo: { ...s.siteInfo, tagline: v } })} />
          <Field label="Telefone (exibido)" value={s.siteInfo.phone} onChange={(v) => patch({ siteInfo: { ...s.siteInfo, phone: v } })} />
          <Field label="WhatsApp (só números, ex: 5581...)" value={s.siteInfo.phoneRaw} onChange={(v) => patch({ siteInfo: { ...s.siteInfo, phoneRaw: v } })} />
          <Field label="E-mail" value={s.siteInfo.email} onChange={(v) => patch({ siteInfo: { ...s.siteInfo, email: v } })} />
          <Field label="Endereço" value={s.siteInfo.address} onChange={(v) => patch({ siteInfo: { ...s.siteInfo, address: v } })} />
        </div>
        <div className="mt-4">
          <ImageField label="Logo (cabeçalho / navbar)" value={s.images.logo} onChange={(url) => patch({ images: { ...s.images, logo: url } })} />
        </div>
      </section>

      {/* BANNER / HERO */}
      <section className={card}>
        <h3 className={h}>Banner principal (home)</h3>
        <div className="grid gap-4">
          <ImageField label="Imagem de fundo do banner (usada quando há só 1 foto)" value={s.hero.image} onChange={(url) => patch({ hero: { ...s.hero, image: url }, images: { ...s.images, hero: url } })} />
          <MultiImageField
            label="Fotos do banner (1 foto = preenche; várias = lado a lado)"
            value={s.hero.images ?? []}
            onChange={(imgs) => patch({ hero: { ...s.hero, images: imgs } })}
          />
          <ImageField label="Logo do banner (home)" value={s.hero.logo} onChange={(url) => patch({ hero: { ...s.hero, logo: url } })} />
          <Field label="Título" value={s.hero.title} onChange={(v) => patch({ hero: { ...s.hero, title: v } })} />
          <Area label="Subtítulo" value={s.hero.subtitle} onChange={(v) => patch({ hero: { ...s.hero, subtitle: v } })} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Botão 1 - texto" value={s.hero.ctaPrimaryLabel} onChange={(v) => patch({ hero: { ...s.hero, ctaPrimaryLabel: v } })} />
            <Field label="Botão 1 - link" value={s.hero.ctaPrimaryHref} onChange={(v) => patch({ hero: { ...s.hero, ctaPrimaryHref: v } })} />
            <Field label="Botão 2 - texto" value={s.hero.ctaSecondaryLabel} onChange={(v) => patch({ hero: { ...s.hero, ctaSecondaryLabel: v } })} />
            <Field label="Botão 2 - link" value={s.hero.ctaSecondaryHref} onChange={(v) => patch({ hero: { ...s.hero, ctaSecondaryHref: v } })} />
          </div>
        </div>
      </section>

      {/* NOSSA HISTORIA */}
      <section className={card}>
        <h3 className={h}>Nossa História</h3>
        <div className="grid gap-4">
          <Area label="Introdução" value={s.about.intro} onChange={(v) => patch({ about: { ...s.about, intro: v } })} />
          <Area
            label="Parágrafos (um por linha)"
            rows={5}
            value={s.about.paragraphs.join("\n")}
            onChange={(v) => patch({ about: { ...s.about, paragraphs: v.split("\n").map((l) => l.trim()).filter(Boolean) } })}
          />
          <div className="grid gap-4 sm:grid-cols-3">
            <NumField label="Fundadores" value={s.about.founders.total} onChange={(n) => patch({ about: { ...s.about, founders: { ...s.about.founders, total: n } } })} />
            <NumField label="Homens" value={s.about.founders.homens} onChange={(n) => patch({ about: { ...s.about, founders: { ...s.about.founders, homens: n } } })} />
            <NumField label="Mulheres" value={s.about.founders.mulheres} onChange={(n) => patch({ about: { ...s.about, founders: { ...s.about.founders, mulheres: n } } })} />
          </div>
          <ListEditor
            label="Valores"
            items={s.about.valores}
            empty={{ title: "", text: "" }}
            onChange={(valores) => patch({ about: { ...s.about, valores } })}
            render={(item, set) => (
              <div className="grid gap-2 sm:grid-cols-[1fr_2fr]">
                <input className={input} placeholder="Título" value={item.title} onChange={(e) => set({ ...item, title: e.target.value })} />
                <input className={input} placeholder="Texto" value={item.text} onChange={(e) => set({ ...item, text: e.target.value })} />
              </div>
            )}
          />
        </div>
      </section>

      {/* LINHA DO TEMPO */}
      <section className={card}>
        <h3 className={h}>Linha do tempo</h3>
        <ListEditor
          label="Marcos"
          items={s.timeline}
          empty={{ year: "", title: "", text: "" }}
          onChange={(timeline) => patch({ timeline })}
          render={(item, set) => (
            <div className="grid gap-2 sm:grid-cols-[100px_1fr]">
              <input className={input} placeholder="Ano" value={item.year} onChange={(e) => set({ ...item, year: e.target.value })} />
              <input className={input} placeholder="Título" value={item.title} onChange={(e) => set({ ...item, title: e.target.value })} />
              <textarea className={`${input} sm:col-span-2`} rows={2} placeholder="Texto" value={item.text} onChange={(e) => set({ ...item, text: e.target.value })} />
            </div>
          )}
        />
      </section>

      {/* NUMEROS / METRICAS */}
      <section className={card}>
        <h3 className={h}>Nosso impacto em números</h3>
        <ListEditor
          label="Indicadores"
          items={s.metrics}
          empty={{ value: "", label: "", iconName: "leaf" }}
          onChange={(metrics) => patch({ metrics })}
          render={(item, set) => (
            <div className="grid gap-2 sm:grid-cols-[100px_1fr_160px]">
              <input className={input} placeholder="Valor (300+)" value={item.value} onChange={(e) => set({ ...item, value: e.target.value })} />
              <input className={input} placeholder="Descrição" value={item.label} onChange={(e) => set({ ...item, label: e.target.value })} />
              <select className={input} value={item.iconName} onChange={(e) => set({ ...item, iconName: e.target.value })}>
                {iconOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          )}
        />
      </section>

      {/* DEPOIMENTOS */}
      <section className={card}>
        <h3 className={h}>Depoimentos</h3>
        <ListEditor
          label="Depoimentos"
          items={s.stories}
          empty={{ name: "", role: "", quote: "", image: "" }}
          onChange={(stories) => patch({ stories })}
          render={(item, set) => (
            <div className="grid gap-2">
              <div className="grid gap-2 sm:grid-cols-2">
                <input className={input} placeholder="Nome" value={item.name} onChange={(e) => set({ ...item, name: e.target.value })} />
                <input className={input} placeholder="Função / local" value={item.role} onChange={(e) => set({ ...item, role: e.target.value })} />
              </div>
              <textarea className={input} rows={2} placeholder="Depoimento" value={item.quote} onChange={(e) => set({ ...item, quote: e.target.value })} />
              <ImageField label="Foto" value={item.image} onChange={(url) => set({ ...item, image: url })} />
            </div>
          )}
        />
      </section>

      {/* TRANSPARENCIA */}
      <section className={card}>
        <h3 className={h}>Transparência (documentos)</h3>
        <ListEditor
          label="Documentos"
          items={s.transparencyDocs}
          empty={{ title: "", category: "Relatorios", date: "", url: "#" }}
          onChange={(transparencyDocs) => patch({ transparencyDocs })}
          render={(item, set) => (
            <div className="grid gap-2 sm:grid-cols-[2fr_1fr_80px]">
              <input className={input} placeholder="Título do documento" value={item.title} onChange={(e) => set({ ...item, title: e.target.value })} />
              <input className={input} placeholder="Categoria" value={item.category} onChange={(e) => set({ ...item, category: e.target.value })} />
              <input className={input} placeholder="Ano" value={item.date} onChange={(e) => set({ ...item, date: e.target.value })} />
              <div className="sm:col-span-3">
                <DocField value={item.url} onChange={(url) => set({ ...item, url })} />
              </div>
            </div>
          )}
        />
      </section>

      {/* FOOTER */}
      <section className={card}>
        <h3 className={h}>Rodapé (footer)</h3>
        <div className="grid gap-4">
          <Area label="Descrição" value={s.footer.description} onChange={(v) => patch({ footer: { ...s.footer, description: v } })} />
          <Field label="Texto de copyright" value={s.footer.copyright} onChange={(v) => patch({ footer: { ...s.footer, copyright: v } })} />
          <Field label="Nota final" value={s.footer.note} onChange={(v) => patch({ footer: { ...s.footer, note: v } })} />
          <ListEditor
            label="Redes sociais"
            items={s.footer.socials}
            empty={{ label: "Facebook", href: "#" }}
            onChange={(socials) => patch({ footer: { ...s.footer, socials } })}
            render={(item, set) => (
              <div className="grid gap-2 sm:grid-cols-2">
                <select className={input} value={item.label} onChange={(e) => set({ ...item, label: e.target.value })}>
                  <option>Facebook</option>
                  <option>Instagram</option>
                  <option>YouTube</option>
                </select>
                <input className={input} placeholder="Link" value={item.href} onChange={(e) => set({ ...item, href: e.target.value })} />
              </div>
            )}
          />
        </div>
      </section>

      {/* CTA */}
      <section className={card}>
        <h3 className={h}>Chamada final (CTA)</h3>
        <div className="grid gap-4">
          <Field label="Título" value={s.cta.title} onChange={(v) => patch({ cta: { ...s.cta, title: v } })} />
          <Area label="Subtítulo" value={s.cta.subtitle} onChange={(v) => patch({ cta: { ...s.cta, subtitle: v } })} />
          <Field label="Texto do botão" value={s.cta.buttonLabel} onChange={(v) => patch({ cta: { ...s.cta, buttonLabel: v } })} />
        </div>
      </section>

      {/* TEMA E CORES */}
      <section className={card}>
        <h3 className={h}>Tema e cores</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-1.5">
            <span className={lbl}>Cor primária</span>
            <div className="flex items-center gap-2">
              <input type="color" value={s.theme.primary} onChange={(e) => { patch({ theme: { ...s.theme, primary: e.target.value } }); applyTheme(e.target.value, s.theme.secondary); }} className="h-10 w-12 rounded border border-slate-300" />
              <input className={input} value={s.theme.primary} onChange={(e) => { patch({ theme: { ...s.theme, primary: e.target.value } }); applyTheme(e.target.value, s.theme.secondary); }} />
            </div>
          </div>
          <div className="grid gap-1.5">
            <span className={lbl}>Cor secundária</span>
            <div className="flex items-center gap-2">
              <input type="color" value={s.theme.secondary} onChange={(e) => { patch({ theme: { ...s.theme, secondary: e.target.value } }); applyTheme(s.theme.primary, e.target.value); }} className="h-10 w-12 rounded border border-slate-300" />
              <input className={input} value={s.theme.secondary} onChange={(e) => { patch({ theme: { ...s.theme, secondary: e.target.value } }); applyTheme(s.theme.primary, e.target.value); }} />
            </div>
          </div>
        </div>
        <p className="mt-2 text-xs text-slate-500">As mudanças aparecem na hora como prévia. Clique em &ldquo;Salvar configurações&rdquo; para publicar no site.</p>

        <div className="mt-5">
          <span className={lbl}>Temas salvos</span>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {s.themes.map((t, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg border border-slate-200 p-3">
                <span className="flex gap-1">
                  <span className="inline-block h-6 w-6 rounded-full border border-slate-300" style={{ background: t.primary }} />
                  <span className="inline-block h-6 w-6 rounded-full border border-slate-300" style={{ background: t.secondary }} />
                </span>
                <span className="flex-1 truncate text-sm font-bold text-slate-700">{t.name}</span>
                <button type="button" onClick={() => { patch({ theme: { primary: t.primary, secondary: t.secondary } }); applyTheme(t.primary, t.secondary); }} className="rounded-full bg-slate-800 px-3 py-1 text-[11px] font-black uppercase text-white">
                  Aplicar
                </button>
                <button type="button" onClick={() => patch({ themes: s.themes.filter((_, idx) => idx !== i) })} className="rounded-full p-1.5 text-red-500 hover:bg-red-50" aria-label="Remover tema">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <input className={`${input} max-w-xs`} placeholder="Nome do tema (ex: Copa 2026)" value={themeName} onChange={(e) => setThemeName(e.target.value)} />
            <button
              type="button"
              onClick={() => {
                if (!themeName.trim()) return;
                patch({ themes: [...s.themes, { name: themeName.trim(), primary: s.theme.primary, secondary: s.theme.secondary }] });
                setThemeName("");
              }}
              className={addBtn}
            >
              <Plus size={14} /> Salvar tema atual
            </button>
          </div>
        </div>
      </section>

      {/* SECOES VISIVEIS */}
      <section className={card}>
        <h3 className={h}>Seções visíveis</h3>
        <p className="mb-4 text-sm text-slate-500">Desmarque para esconder uma seção do site (útil para campanhas/eventos).</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {sectionLabels.map(({ key, label }) => (
            <label key={key} className="flex items-center gap-3 rounded-lg border border-slate-200 px-4 py-3">
              <input
                type="checkbox"
                checked={s.sections[key]}
                onChange={(e) => patch({ sections: { ...s.sections, [key]: e.target.checked } })}
              />
              <span className="text-sm font-bold text-slate-700">{label}</span>
            </label>
          ))}
        </div>
      </section>

      {/* BARRA SALVAR */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <span className={`min-w-0 flex-1 truncate text-sm font-bold ${msg.includes("sucesso") ? "text-green-600" : "text-red-600"}`}>{msg}</span>
          <button onClick={save} disabled={saving} className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#4bae4f] px-4 py-2.5 text-xs font-black uppercase text-white disabled:opacity-60 sm:px-6">
            <Save size={16} /> <span className="hidden sm:inline">{saving ? "Salvando..." : "Salvar configurações"}</span><span className="sm:hidden">{saving ? "..." : "Salvar"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---- pequenos componentes de campo ---- */

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="grid gap-1.5">
      <span className={lbl}>{label}</span>
      <input className={input} value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

function Area({ label, value, onChange, rows = 3 }: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <label className="grid gap-1.5">
      <span className={lbl}>{label}</span>
      <textarea className={input} rows={rows} value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

function NumField({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <label className="grid gap-1.5">
      <span className={lbl}>{label}</span>
      <input type="number" className={input} value={value} onChange={(e) => onChange(Number(e.target.value) || 0)} />
    </label>
  );
}

function ListEditor<T>({
  label,
  items,
  empty,
  onChange,
  render,
}: {
  label: string;
  items: T[];
  empty: T;
  onChange: (items: T[]) => void;
  render: (item: T, set: (next: T) => void) => React.ReactNode;
}) {
  function setAt(index: number, next: T) {
    onChange(items.map((it, i) => (i === index ? next : it)));
  }
  function removeAt(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }
  function add() {
    onChange([...items, structuredClone(empty)]);
  }

  return (
    <div className="grid gap-3">
      <span className={lbl}>{label}</span>
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
          <div className="flex-1">{render(item, (next) => setAt(i, next))}</div>
          <button type="button" onClick={() => removeAt(i)} className="rounded-full p-2 text-red-500 hover:bg-red-50" aria-label="Remover">
            <Trash2 size={16} />
          </button>
        </div>
      ))}
      <button type="button" onClick={add} className={addBtn}>
        <Plus size={14} /> Adicionar
      </button>
    </div>
  );
}

function MultiImageField({ label, value, onChange }: { label: string; value: string[]; onChange: (v: string[]) => void }) {
  const [uploading, setUploading] = useState(false);

  async function handle(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    try {
      const urls: string[] = [];
      for (const file of files) {
        const result = await api.uploadImage(file);
        urls.push(result.url);
      }
      onChange([...(value ?? []), ...urls]);
    } catch {
      /* ignore */
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  return (
    <div className="grid gap-1.5">
      <span className={lbl}>{label}</span>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
        {(value ?? []).map((url, i) => (
          <div key={`${url}-${i}`} className="relative aspect-[4/3] overflow-hidden rounded-lg border border-slate-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="h-full w-full object-cover" />
            <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} className="absolute right-1 top-1 rounded-full bg-white/90 p-1 text-red-500 shadow" aria-label="Remover">
              <X size={12} />
            </button>
          </div>
        ))}
        <label className="flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-slate-300 text-slate-400 hover:border-[#4bae4f] hover:text-[#4bae4f]">
          {uploading ? <Loader2 size={18} className="animate-spin" /> : <ImagePlus size={18} />}
          <span className="text-[9px] font-black uppercase">{uploading ? "Enviando" : "Enviar"}</span>
          <input type="file" accept="image/*" multiple className="hidden" onChange={handle} disabled={uploading} />
        </label>
      </div>
    </div>
  );
}

function DocField({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const result = await api.uploadDocument(file);
      onChange(result.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha no upload");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  return (
    <div className="grid gap-2">
      <div className="flex flex-wrap items-center gap-3">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#003b5c] px-4 py-2 text-xs font-black uppercase text-white">
          {uploading ? "Enviando..." : "Enviar arquivo (PDF)"}
          <input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt" className="hidden" onChange={handleFile} disabled={uploading} />
        </label>
        {value && value !== "#" ? (
          <a href={value} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-[#4bae4f] underline">
            Ver arquivo atual
          </a>
        ) : null}
      </div>
      <input
        className={input}
        placeholder="ou cole o link do arquivo"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {error ? <p className="text-xs font-bold text-red-600">{error}</p> : null}
    </div>
  );
}
