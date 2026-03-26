import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "워드마스터",
        short_name: "워드마스터",
        description: "워드마스터 수능2000 영단어 퀴즈",
        theme_color: "#1a73e8",
        display: "standalone", // 앱처럼 실행되는 핵심 설정
        icons: [
          {
            src: "icon.png", // public 폴더에 icon.png가 있어야 함
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icon.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
