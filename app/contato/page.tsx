"use client";

import { Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { useState } from "react";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { MotionSection } from "@/components/motion-section";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { siteInfo } from "@/lib/site-data";

export default function ContatoPage() {
  const [form, setForm] = useState({ nome: "", email: "", mensagem: "" });

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const text = `Olá, meu nome é ${form.nome}. ${form.mensagem} (e-mail: ${form.email})`;
    window.open(`https://wa.me/${siteInfo.phoneRaw}?text=${encodeURIComponent(text)}`, "_blank");
  }

  return (
    <>
      <Header />
      <main className="pt-20">
        <section className="bg-primary py-16 text-white">
          <div className="container-shell">
            <span className="section-label">Contato</span>
            <h1 className="mt-2 text-4xl font-black md:text-6xl">Faça parte dessa história</h1>
            <p className="mt-4 max-w-2xl text-base font-medium leading-7 text-white/85">
              Quer se associar ou saber mais sobre nossos projetos? Fale com a AGROSLAF.
            </p>
          </div>
        </section>

        <MotionSection className="py-16">
          <div className="container-shell grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="grid gap-5">
              <a href={`tel:+${siteInfo.phoneRaw}`} className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-5 soft-shadow">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/12 text-secondary"><Phone size={22} /></div>
                <div>
                  <span className="text-xs font-bold uppercase text-slate-500">Telefone</span>
                  <strong className="block font-black text-primary">{siteInfo.phone}</strong>
                </div>
              </a>
              <a href={`mailto:${siteInfo.email}`} className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-5 soft-shadow">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/12 text-secondary"><Mail size={22} /></div>
                <div>
                  <span className="text-xs font-bold uppercase text-slate-500">E-mail</span>
                  <strong className="block font-black text-primary">{siteInfo.email}</strong>
                </div>
              </a>
              <div className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-5 soft-shadow">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/12 text-secondary"><MapPin size={22} /></div>
                <div>
                  <span className="text-xs font-bold uppercase text-slate-500">Endereço</span>
                  <strong className="block font-black text-primary">{siteInfo.address}</strong>
                </div>
              </div>
              <a
                href={`https://wa.me/${siteInfo.phoneRaw}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-lg bg-[#25D366] p-5 text-white soft-shadow"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20"><MessageCircle size={22} /></div>
                <div>
                  <span className="text-xs font-bold uppercase text-white/80">WhatsApp</span>
                  <strong className="block font-black">Fale agora com a gente</strong>
                </div>
              </a>
            </div>

            <form onSubmit={handleSubmit} className="rounded-lg border border-slate-200 bg-white p-7 soft-shadow">
              <h2 className="text-2xl font-black text-primary">Envie uma mensagem</h2>
              <p className="mt-2 text-sm font-medium text-slate-500">Preencha o formulário e continue a conversa pelo WhatsApp.</p>
              <div className="mt-6 grid gap-4">
                <label className="grid gap-1.5">
                  <span className="text-xs font-black uppercase text-slate-600">Nome</span>
                  <input
                    required
                    value={form.nome}
                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                    className="rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-secondary"
                    placeholder="Seu nome"
                  />
                </label>
                <label className="grid gap-1.5">
                  <span className="text-xs font-black uppercase text-slate-600">E-mail</span>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-secondary"
                    placeholder="seu@email.com"
                  />
                </label>
                <label className="grid gap-1.5">
                  <span className="text-xs font-black uppercase text-slate-600">Mensagem</span>
                  <textarea
                    required
                    rows={4}
                    value={form.mensagem}
                    onChange={(e) => setForm({ ...form, mensagem: e.target.value })}
                    className="rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-secondary"
                    placeholder="Como podemos ajudar?"
                  />
                </label>
                <button
                  type="submit"
                  className="focus-ring inline-flex items-center justify-center gap-2 rounded-full bg-secondary px-7 py-4 text-sm font-black uppercase text-white transition hover:bg-secondary-dark"
                >
                  <Send size={18} /> Enviar mensagem
                </button>
              </div>
            </form>
          </div>
        </MotionSection>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
