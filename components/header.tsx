"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { navItems } from "@/lib/site-data";
import { useSiteSettings } from "@/lib/settings";

export function Header() {
  const [open, setOpen] = useState(false);
  const { images, siteInfo } = useSiteSettings();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-primary/92 text-white backdrop-blur-xl">
      <div className="container-shell flex h-20 items-center justify-between gap-6">
        <Link href="/" className="focus-ring flex items-center rounded-sm" aria-label={siteInfo.name}>
          <Image src={images.logo} alt={siteInfo.name} width={240} height={80} className="h-16 w-auto object-contain" />
        </Link>

        <nav className="hidden items-center gap-7 text-xs font-extrabold uppercase lg:flex">
          {navItems.map((item) => (
            <Link key={item.label} href={item.href} className="focus-ring rounded-sm transition hover:text-secondary-light">
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="focus-ring inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 lg:hidden"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-white/10 bg-primary lg:hidden">
          <nav className="container-shell grid gap-1 py-4 text-sm font-bold uppercase">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="focus-ring rounded-md px-2 py-3"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
