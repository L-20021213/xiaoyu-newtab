/*
 * @Description:
 * @Author: 安知鱼
 * @Date: 2025-11-28 15:58:52
 * @LastEditTime: 2025-12-05 19:44:21
 * @LastEditors: 安知鱼
 */
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import webExtension from "vite-plugin-web-extension";
import { resolve } from "path";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { compression } from "vite-plugin-compression2";

export default defineConfig(({ mode }) => {
  const browser = mode === "firefox" ? "firefox" : "chrome";

  return {
    plugins: [
      vue(),
      webExtension({
        browser,
        manifest: "manifest.json",
      }),
      // 仅复制必要的资源（其他壁纸从 CDN 加载）
      viteStaticCopy({
        targets: [
          {
            src: "public/icons/*",
            dest: "icons",
          },
          {
            src: "icons/*.png",
            dest: "icons",
          },
          // 复制 PWA 所需文件
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
      // Gzip + Brotli 压缩（对 H5 部署有效，扩展打包时 zip 会自动压缩）
      compression({
        exclude: [/\.(br)$/, /\.(gz)$/, /\.(png)$/, /\.(jpg)$/, /\.(webp)$/],
        threshold: 1024, // 只压缩大于 1KB 的文件
      }),
    ],
    // 禁用默认 public 目录复制（壁纸资源已迁移到云端 CDN）
    publicDir: false,
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
      },
    },
    build: {
      outDir: `dist/${browser}`,
      // 禁用 sourcemap 减小体积（开发时可开启）
      sourcemap: false,
      // 压缩配置
      minify: "esbuild", // 使用 esbuild 压缩，速度更快
      // chunk 大小警告阈值
      chunkSizeWarningLimit: 1000,
    },
  };
});
