import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const IMAGE_DIR = path.join(ROOT, "src", "image");
const QUALITY = 72;

function formatMb(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

async function main() {
  const files = await fs.readdir(IMAGE_DIR);
  const pngFiles = files.filter((file) => file.toLowerCase().endsWith(".png"));

  if (pngFiles.length === 0) {
    console.log("No PNG files found in src/image.");
    return;
  }

  let totalBefore = 0;
  let totalAfter = 0;

  console.log(`Converting ${pngFiles.length} PNG files to WebP (quality ${QUALITY})...`);

  for (const file of pngFiles) {
    const src = path.join(IMAGE_DIR, file);
    const target = path.join(IMAGE_DIR, `${path.parse(file).name}.webp`);

    const beforeStats = await fs.stat(src);
    totalBefore += beforeStats.size;

    await sharp(src)
      .webp({ quality: QUALITY, effort: 6 })
      .toFile(target);

    const afterStats = await fs.stat(target);
    totalAfter += afterStats.size;

    const savedBytes = beforeStats.size - afterStats.size;
    const savedPct = ((savedBytes / beforeStats.size) * 100).toFixed(1);

    console.log(
      `${file} -> ${path.basename(target)} | ${formatMb(beforeStats.size)} => ${formatMb(afterStats.size)} | saved ${formatMb(savedBytes)} (${savedPct}%)`
    );
  }

  const totalSaved = totalBefore - totalAfter;
  const totalSavedPct = ((totalSaved / totalBefore) * 100).toFixed(1);

  console.log("\nSummary");
  console.log(`Total PNG size : ${formatMb(totalBefore)}`);
  console.log(`Total WebP size: ${formatMb(totalAfter)}`);
  console.log(`Saved          : ${formatMb(totalSaved)} (${totalSavedPct}%)`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
