"use client";

// =============================================================================
// CACHE DE DADOS (projetos, notícias, galeria)
// -----------------------------------------------------------------------------
// Busca uma única vez ao abrir o site e mantém em memória. Assim, ao navegar
// entre páginas, os dados já estão prontos e não há "flash" de conteúdo padrão.
// =============================================================================

import { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  gallery as fbGallery,
  news as fbNews,
  projects as fbProjects,
  type GalleryPhoto,
  type NewsItem,
  type Project,
} from "@/lib/site-data";

type DataState = {
  projects: Project[];
  news: NewsItem[];
  gallery: GalleryPhoto[];
  loaded: boolean;
};

const DataContext = createContext<DataState>({
  projects: fbProjects,
  news: fbNews,
  gallery: fbGallery,
  loaded: false,
});

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<DataState>({
    projects: fbProjects,
    news: fbNews,
    gallery: fbGallery,
    loaded: false,
  });

  useEffect(() => {
    let active = true;
    Promise.allSettled([api.listProjects(), api.listNews(), api.listGallery()]).then(
      ([p, n, g]) => {
        if (!active) return;
        setData((prev) => ({
          projects: p.status === "fulfilled" && p.value.length ? p.value : prev.projects,
          news: n.status === "fulfilled" && n.value.length ? n.value : prev.news,
          gallery: g.status === "fulfilled" && g.value.length ? g.value : prev.gallery,
          loaded: true,
        }));
      },
    );
    return () => {
      active = false;
    };
  }, []);

  return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
}

export function useData(): DataState {
  return useContext(DataContext);
}

export function useProjects(): Project[] {
  return useContext(DataContext).projects;
}

export function useNews(): NewsItem[] {
  return useContext(DataContext).news;
}

export function useGallery(): GalleryPhoto[] {
  return useContext(DataContext).gallery;
}
