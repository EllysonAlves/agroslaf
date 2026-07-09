// =============================================================================
// CLIENTE DA API LARAVEL
// -----------------------------------------------------------------------------
// O site (Next export) consome a API Laravel (projeto agroslaf-api).
// Configure a base pela variavel NEXT_PUBLIC_API_BASE.
//   - Dev:  http://localhost:8000/api
//   - Prod: https://api.seudominio.com.br/api
// =============================================================================

import type { GalleryPhoto, NewsItem, Project } from "@/lib/site-data";
import type { SiteSettings } from "@/lib/settings";

export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, "") || "/api";

const TOKEN_KEY = "agroslaf_admin_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) window.localStorage.setItem(TOKEN_KEY, token);
  else window.localStorage.removeItem(TOKEN_KEY);
}

type RequestOptions = {
  method?: string;
  body?: unknown;
  auth?: boolean;
  isForm?: boolean;
};

async function request<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, auth = false, isForm = false } = opts;
  const headers: Record<string, string> = { Accept: "application/json" };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  let payload: BodyInit | undefined;
  if (body !== undefined) {
    if (isForm) {
      payload = body as FormData;
    } else {
      headers["Content-Type"] = "application/json";
      payload = JSON.stringify(body);
    }
  }
  const res = await fetch(`${API_BASE}/${path}`, { method, headers, body: payload });
  const text = await res.text();
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    throw new Error("Resposta invalida do servidor");
  }
  if (!res.ok) {
    const message =
      (data as { error?: string; message?: string })?.error ||
      (data as { message?: string })?.message ||
      `Erro ${res.status} na requisicao`;
    throw new Error(message);
  }
  return data as T;
}

// ---- Publico ----
export const api = {
  listProjects: () => request<Project[]>("projects"),
  getProject: (slug: string) => request<Project>(`projects/${encodeURIComponent(slug)}`),
  listGallery: () => request<GalleryPhoto[]>("gallery"),
  listNews: () => request<NewsItem[]>("news"),
  listAllNews: () => request<NewsItem[]>("admin/news", { auth: true }),
  getNews: (slug: string) => request<NewsItem>(`news/${encodeURIComponent(slug)}`),

  // ---- Admin ----
  login: (username: string, password: string) =>
    request<{ token: string; user: { username: string } }>("auth/login", {
      method: "POST",
      body: { username, password },
    }),

  createProject: (data: Partial<Project>) =>
    request<Project>("projects", { method: "POST", body: data, auth: true }),
  updateProject: (slug: string, data: Partial<Project>) =>
    request<Project>(`projects/${encodeURIComponent(slug)}`, {
      method: "PUT",
      body: data,
      auth: true,
    }),
  deleteProject: (slug: string) =>
    request<{ ok: true }>(`projects/${encodeURIComponent(slug)}`, {
      method: "DELETE",
      auth: true,
    }),

  createPhoto: (data: Partial<GalleryPhoto>) =>
    request<GalleryPhoto>("gallery", { method: "POST", body: data, auth: true }),
  deletePhoto: (id: number) =>
    request<{ ok: true }>(`gallery/${id}`, { method: "DELETE", auth: true }),

  createNews: (data: Partial<NewsItem>) =>
    request<NewsItem>("news", { method: "POST", body: data, auth: true }),
  updateNews: (slug: string, data: Partial<NewsItem>) =>
    request<NewsItem>(`news/${encodeURIComponent(slug)}`, {
      method: "PUT",
      body: data,
      auth: true,
    }),
  deleteNews: (slug: string) =>
    request<{ ok: true }>(`news/${encodeURIComponent(slug)}`, {
      method: "DELETE",
      auth: true,
    }),

  getSettings: () => request<Partial<SiteSettings>>("settings"),
  updateSettings: (data: SiteSettings) =>
    request<SiteSettings>("settings", { method: "PUT", body: data, auth: true }),

  uploadImage: (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return request<{ path: string; url: string }>("upload", {
      method: "POST",
      body: form,
      auth: true,
      isForm: true,
    });
  },

  uploadDocument: (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return request<{ path: string; url: string; name: string }>("upload/document", {
      method: "POST",
      body: form,
      auth: true,
      isForm: true,
    });
  },
};
