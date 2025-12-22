#!/usr/bin/env node

import { createWriteStream } from "fs";
import { readdir, stat, readFile } from "fs/promises";
import { join, relative } from "path";
import archiver from "archiver";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");
const distDir = join(rootDir, "dist");
const chromeDir = join(distDir, "chrome");

async function createZip(sourceDir, outputPath, excludePatterns = []) {
  return new Promise((resolve, reject) => {
    const output = createWriteStream(outputPath);
    const archive = archiver("zip", {
      zlib: { level: 9 }, // 最高压缩级别
    });

    output.on("close", async () => {
      try {
        const fileStat = await stat(outputPath);
        const sizeInMB = (fileStat.size / 1024 / 1024).toFixed(2);
        console.log(`✅ 已创建: ${outputPath} (${sizeInMB} MB)`);
      } catch (err) {
        console.log(`✅ 已创建: ${outputPath}`);
      }
      resolve();
    });

    archive.on("error", err => {
      reject(err);
    });

    archive.pipe(output);

    // 递归添加文件
    async function addFiles(dir, baseDir = dir) {
      const entries = await readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = join(dir, entry.name);
        const relativePath = relative(baseDir, fullPath);

        // 跳过排除的文件
        if (excludePatterns.some(pattern => relativePath.includes(pattern))) {
          continue;
        }

        if (entry.isDirectory()) {
          await addFiles(fullPath, baseDir);
        } else {
          archive.file(fullPath, { name: relativePath });
        }
      }
    }

    addFiles(sourceDir)
      .then(() => {
        archive.finalize();
      })
      .catch(reject);
  });
}

async function packageExtension() {
  console.log("🚀 开始打包扩展...\n");

  // 检查 chrome 目录是否存在
  try {
    await stat(chromeDir);
  } catch (error) {
    console.error("❌ 错误: dist/chrome 目录不存在，请先运行构建命令:");
    console.error("   pnpm build\n");
    process.exit(1);
  }

  // 读取 package.json
  const packageJsonContent = await readFile(join(rootDir, "package.json"), "utf-8");
  const packageJson = JSON.parse(packageJsonContent);
  const version = packageJson.version;

  console.log(`📦 版本: ${version}\n`);

  // 排除的文件模式（压缩文件用于 H5 部署，扩展不需要）
  const excludePatterns = ["node_modules", ".DS_Store", ".gz", ".br"];

  // 打包 Chrome 版本
  const chromeZip = join(distDir, `anheyu-newtab-chrome-v${version}.zip`);
  console.log("📦 正在打包 Chrome 版本...");
  await createZip(chromeDir, chromeZip, excludePatterns);

  // 打包 Edge 版本（与 Chrome 相同，但使用不同的文件名）
  const edgeZip = join(distDir, `anheyu-newtab-edge-v${version}.zip`);
  console.log("📦 正在打包 Edge 版本...");
  await createZip(chromeDir, edgeZip, excludePatterns);

  console.log("\n✨ 打包完成！");
  console.log(`\n📁 文件位置:`);
  console.log(`   Chrome: ${chromeZip}`);
  console.log(`   Edge:   ${edgeZip}`);
  console.log(`\n📤 可以上传到:`);
  console.log(`   Chrome Web Store: https://chrome.google.com/webstore/devconsole`);
  console.log(`   Edge Add-ons: https://partner.microsoft.com/dashboard`);
}

packageExtension().catch(error => {
  console.error("❌ 打包失败:", error);
  process.exit(1);
});
