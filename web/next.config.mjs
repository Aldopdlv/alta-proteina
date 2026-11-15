/** @type {import('next').NextConfig} */
const nextConfig = {
  // El contenedor copia solo el output standalone (ver Dockerfile).
  output: 'standalone',
  poweredByHeader: false,
  // `pg` usa módulos nativos de Node: se carga desde node_modules, no se empaqueta.
  serverExternalPackages: ['pg'],
  eslint: { ignoreDuringBuilds: true },
  // Capturas de Yape (5 MB) y fotos del panel (8 MB).
  experimental: { serverActions: { bodySizeLimit: '10mb' } },
};

export default nextConfig;
