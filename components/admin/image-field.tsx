"use client";

import { ImagePlus, Loader2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { api } from "@/lib/api";

type ImageFieldProps = {
  label?: string;
  value: string;
  onChange: (url: string) => void;
};

export function ImageField({ label = "Imagem", value, onChange }: ImageFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const result = await api.uploadImage(file);
      onChange(result.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha no upload");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="grid gap-2">
      <span className="text-xs font-black uppercase text-slate-600">{label}</span>
      <div className="flex items-center gap-4">
        <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
          {value ? (
            <Image src={value} alt="" fill className="object-cover" sizes="112px" unoptimized />
          ) : (
            <div className="flex h-full items-center justify-center text-slate-300">
              <ImagePlus size={24} />
            </div>
          )}
        </div>
        <div className="flex-1">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#003b5c] px-4 py-2 text-xs font-black uppercase text-white">
            {uploading ? <Loader2 size={14} className="animate-spin" /> : <ImagePlus size={14} />}
            {uploading ? "Enviando..." : "Enviar foto"}
            <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
          </label>
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="ou cole o caminho da imagem"
            className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#4bae4f]"
          />
          {error ? <p className="mt-1 text-xs font-bold text-red-600">{error}</p> : null}
        </div>
      </div>
    </div>
  );
}
