"use client";

import { Camera, Mail, MapPin, Phone, Play, Share2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { navItems } from "@/lib/site-data";
import { useSiteSettings } from "@/lib/settings";

const socialIcons: Record<string, LucideIcon> = {
  Facebook: Share2,
  Instagram: Camera,
  YouTube: Play,
};

export function Footer() {
  const { siteInfo, images, footer } = useSiteSettings();

  return (
    <footer className="bg-primary text-white">
      <div className="relative overflow-hidden">
        <Image src={images.hero} alt="" fill className="object-cover opacity-20" sizes="100vw" />
        <div className="relative bg-primary/85 py-12">
          <div className="container-shell grid gap-8 md:grid-cols-[1.3fr_1fr_1fr]">
            <div>
              <div className="flex items-center gap-3">
                <Image src={images.logo} alt={siteInfo.name} width={52} height={52} className="rounded-full" />
                <strong className="text-2xl font-black">{siteInfo.name}</strong>
              </div>
              <p className="mt-5 max-w-xs text-sm font-medium leading-7 text-white/80">{footer.description}</p>
            </div>

            <div>
              <h2 className="text-sm font-black uppercase">Navegação</h2>
              <ul className="mt-5 grid gap-2 text-sm text-white/85">
                {navItems.map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="focus-ring rounded-sm transition hover:text-secondary-light">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-sm font-black uppercase">Contato</h2>
              <ul className="mt-5 grid gap-3 text-sm text-white/85">
                <li className="flex gap-3"><Phone size={18} /> {siteInfo.phone}</li>
                <li className="flex gap-3"><Mail size={18} /> {siteInfo.email}</li>
                <li className="flex gap-3"><MapPin size={18} /> {siteInfo.address}</li>
              </ul>
              <div className="mt-5 flex gap-4">
                {footer.socials.map((social) => {
                  const Icon = socialIcons[social.label] ?? Share2;
                  return (
                    <Link
                      key={social.label}
                      href={social.href}
                      className="focus-ring flex h-11 w-11 items-center justify-center rounded-full border border-white/30 transition hover:bg-white/10"
                      aria-label={`${social.label} da ${siteInfo.name}`}
                    >
                      <Icon size={20} />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-5">
        <div className="container-shell flex flex-col gap-3 text-xs text-white/72 md:flex-row md:items-center md:justify-between">
          <p>{footer.copyright}</p>
          <p>{footer.note}</p>
        </div>
      </div>
    </footer>
  );
}
