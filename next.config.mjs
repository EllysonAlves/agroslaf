/** @type {import('next').NextConfig} */
const nextConfig = {
  // Exportacao 100% estatica -> gera a pasta `out/` para subir no public_html (HostGator)
  output: "export",
  // Necessario no export: nao usa o otimizador de imagens do servidor Node
  images: {
    unoptimized: true,
  },
  // Gera /pagina/index.html -> URLs amigaveis funcionam no Apache do cPanel
  trailingSlash: true,
};

export default nextConfig;
