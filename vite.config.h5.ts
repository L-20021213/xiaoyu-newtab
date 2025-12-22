/*
 * @Description: H5 构建配置
 * @Author: 安知鱼
 * @Date: 2025-12-04
 */
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { compression } from "vite-plugin-compression2";

export default defineConfig({
  plugins: [
    vue(),
    // 仅复制必要的资源（其他壁纸从 CDN 加载）
    viteStaticCopy({
      targets: [
        {
          src: "public/icons/*",
          dest: "icons",
        },
        {
          src: "icons/*",
          dest: "icons",
        },
        {
          src: "public/site.webmanifest",
          dest: ".",
        },
        // 本地默认壁纸（首次加载使用，无需网络）
        {
          src: "public/wallpaper/static/3.jpg",
          dest: "wallpaper",
          rename: "default.jpg",
        },
      ],
    }),
    // Gzip + Brotli 压缩（服务器可直接返回预压缩文件）
    compression({
      exclude: [/\.(br)$/, /\.(gz)$/, /\.(png)$/, /\.(jpg)$/, /\.(webp)$/],
      threshold: 1024,
    }),
  ],
  // 禁用默认 public 目录复制（壁纸资源已迁移到云端 CDN）
  publicDir: false,
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
