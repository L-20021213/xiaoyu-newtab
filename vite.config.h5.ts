/*
 * @Description: H5 构建配置
 * @Author: 安知鱼
 * @Date: 2025-12-04
 */
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  plugins: [
    vue(),
    viteStaticCopy({
      targets: [
        {
          src: "public/wallpaper/*",
          dest: "wallpaper",
        },
        {
          src: "public/icons/*",
          dest: "icons",
        },
        {
          src: "icons/*",
          dest: "icons",
        },
      ],
    }),
  ],
  // 确保 public 目录正确设置（manifest.json 等会被复制到根目录）
  publicDir: "public",
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  // 定义环境变量，用于检测是否是 H5 模式
  define: {
    __IS_H5__: JSON.stringify(true),
  },
  build: {
    outDir: "dist/h5",
    // 启用 CSS 代码分割
    cssCodeSplit: true,
    // 生成 sourcemap 便于调试
    sourcemap: false,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
      },
      output: {
        // 优化分包策略
        manualChunks: {
          vue: ["vue", "pinia"],
        },
      },
    },
  },
  // 开发服务器配置
  server: {
    port: 3000,
    open: true,
  },
  // 预览服务器配置
  preview: {
    port: 4173,
    open: true,
  },
});
