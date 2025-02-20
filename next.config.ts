import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['127.0.0.1', 'localhost'], // Ajoute '127.0.0.1' ou 'localhost' ici
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/login",
        permanent: false, // false = redirection 307 (temporaire), true = redirection 308 (permanente)
      },
    ];
  },
};

export default nextConfig;
