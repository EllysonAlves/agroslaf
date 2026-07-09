import type { MetadataRoute } from "next";
import { projects } from "@/lib/site-data";

export const dynamic = "force-static";

const baseUrl = "https://agroslaf.org.br";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: baseUrl, priority: 1 },
    { url: `${baseUrl}/sobre`, priority: 0.8 },
    { url: `${baseUrl}/projetos`, priority: 0.9 },
    { url: `${baseUrl}/noticias`, priority: 0.7 },
    { url: `${baseUrl}/transparencia`, priority: 0.7 },
    { url: `${baseUrl}/contato`, priority: 0.6 },
  ];

  const projectPages = projects.map((project) => ({
    url: `${baseUrl}/projeto/?slug=${project.slug}`,
    priority: 0.6,
  }));

  return [...staticPages, ...projectPages].map((page) => ({
    ...page,
    lastModified: new Date(),
  }));
}
