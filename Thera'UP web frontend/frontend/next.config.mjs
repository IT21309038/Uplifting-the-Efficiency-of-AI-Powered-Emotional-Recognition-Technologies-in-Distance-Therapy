/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      // Proxy final stress plot endpoint (HTTP)
      {
        source: "/final_stress_plot/:id",
        destination: "http://localhost:8000/final_stress_plot/:id",
      },
      // Proxy final emotion plot endpoint (HTTP)
      {
        source: "/final_emotion_plot/:id",
        destination: "http://localhost:8000/final_emotion_plot/:id",
      },
    ];
  },
};

export default nextConfig;