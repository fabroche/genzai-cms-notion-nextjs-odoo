import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Configurar tiempos de cache del Router Cache (cliente)
    staleTimes: {
      dynamic: 0, // Para rutas dinámicas, no cachear en cliente
      static: 5, // Para rutas estáticas, cachear 5 segundos
    },
  },
};

export default nextConfig;
