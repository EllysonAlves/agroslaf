"use client";

import { useData } from "@/lib/data";
import { useSettingsLoaded } from "@/lib/settings";

export function LoadingGate({ children }: { children: React.ReactNode }) {
  const dataLoaded = useData().loaded;
  const settingsLoaded = useSettingsLoaded();
  const ready = dataLoaded && settingsLoaded;

  return (
    <>
      <div
        aria-hidden={ready}
        className={`fixed inset-0 z-[100] flex items-center justify-center bg-primary transition-opacity duration-500 ${
          ready ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        <span className="h-12 w-12 animate-spin rounded-full border-4 border-white/30 border-t-white" />
      </div>
      {children}
    </>
  );
}
