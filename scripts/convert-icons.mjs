/*
 * @Description:
 * @Author: 安知鱼
 * @Date: 2025-12-04 19:11:24
 * @LastEditTime: 2025-12-04 19:11:29
 * @LastEditors: 安知鱼
 */
/**
 * SVG 图标转换为 PNG
 * 用于生成 Chrome/Edge 扩展商店所需的 PNG 图标
 */
import sharp from "sharp";
import { readFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..");
const iconsDir = join(rootDir, "icons");

// 图标尺寸配置
const sizes = [16, 32, 48, 128];

async function convertSvgToPng() {
  console.log("🎨 开始转换 SVG 图标为 PNG...\n");

  // 读取主 SVG 文件
  const svgPath = join(iconsDir, "logo.svg");
  const svgBuffer = readFileSync(svgPath);

  for (const size of sizes) {
    const outputPath = join(iconsDir, `icon-${size}.png`);

    await sharp(svgBuffer)
      .resize(size, size, {
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toFile(outputPath);

    console.log(`✅ 已生成: icon-${size}.png (${size}x${size})`);
  }

  console.log("\n🎉 所有 PNG 图标生成完成!");
}

convertSvgToPng().catch(console.error);
