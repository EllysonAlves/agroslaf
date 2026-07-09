"use client";

import { Images, LayoutGrid, LogOut, Lock, Newspaper, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { GalleryManager } from "@/components/admin/gallery-manager";
import { NewsManager } from "@/components/admin/news-manager";
import { ProjectsManager } from "@/components/admin/projects-manager";
import { SettingsManager } from "@/components/admin/settings-manager";
import { api, getToken, setToken } from "@/lib/api";
import { images } from "@/lib/site-data";

type Tab = "projetos" | "galeria" | "noticias" | "config";

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<Tab>("projetos");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setAuthed(Boolean(getToken()));
  }, []);

  async function login(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.login(username, password);
      setToken(res.token);
      setAuthed(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha no login");
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    setToken(null);
    setAuthed(false);
  }

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f7f8] p-4">
        <form onSubmit={login} className="w-full max-w-sm rounded-xl bg-white p-8 shadow-xl">
          <div className="mb-6 flex flex-col items-center text-center">
            <Image src={images.logo} alt="AGROSLAF" width={64} height={64} className="rounded-full" />
            <h1 className="mt-3 text-2xl font-black text-[#003b5c]">Painel AGROSLAF</h1>
            <p className="text-sm font-semibold text-slate-500">Acesso administrativo</p>
          </div>
          <div className="grid gap-4">
            <label className="grid gap-1.5">
              <span className="text-xs font-black uppercase text-slate-600">Usuário</span>
              <input
                className="rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-[#4bae4f]"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
              />
            </label>
            <label className="grid gap-1.5">
              <span className="text-xs font-black uppercase text-slate-600">Senha</span>
              <input
                type="password"
                className="rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-[#4bae4f]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </label>
            {error ? <p className="text-sm font-bold text-red-600">{error}</p> : null}
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#4bae4f] px-6 py-3.5 text-sm font-black uppercase text-white disabled:opacity-60"
            >
              <Lock size={16} /> {loading ? "Entrando..." : "Entrar"}
            </button>
            <Link href="/" className="text-center text-xs font-bold uppercase text-slate-400 hover:text-slate-600">
              Voltar ao site
            </Link>
          </div>
        </form>
      </div>
    );
  }

  const tabs: { key: Tab; label: string; icon: typeof LayoutGrid }[] = [
    { key: "projetos", label: "Projetos", icon: LayoutGrid },
    { key: "galeria", label: "Galeria", icon: Images },
    { key: "noticias", label: "Notícias", icon: Newspaper },
    { key: "config", label: "Configurações", icon: Settings },
  ];

  return (
    <div className="min-h-screen overflow-x-clip bg-[#f5f7f8]">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-[#003b5c] text-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
          <div className="flex items-center gap-3">
            <Image src={images.logo} alt="" width={40} height={40} className="rounded-full" />
            <div className="leading-tight">
              <strong className="block text-sm font-black sm:text-base">Painel AGROSLAF</strong>
              <span className="hidden text-xs text-white/70 sm:block">Gerenciamento de conteúdo</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="hidden text-xs font-bold uppercase text-white/80 hover:text-white sm:inline">
              Ver site
            </Link>
            <button onClick={logout} className="inline-flex items-center gap-2 rounded-full border border-white/30 px-4 py-2 text-xs font-black uppercase">
              <LogOut size={14} /> Sair
            </button>
          </div>
        </div>
        <div className="mx-auto max-w-5xl px-4">
          <div className="flex gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {tabs.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`inline-flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-xs font-black uppercase transition ${
                  tab === key ? "border-[#4bae4f] text-white" : "border-transparent text-white/60 hover:text-white"
                }`}
              >
                <Icon size={16} /> {label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        {tab === "projetos" ? <ProjectsManager /> : null}
        {tab === "galeria" ? <GalleryManager /> : null}
        {tab === "noticias" ? <NewsManager /> : null}
        {tab === "config" ? <SettingsManager /> : null}
      </main>
    </div>
  );
}
