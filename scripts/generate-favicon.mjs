import sharp from "sharp";

const sourcePath = "public/FAVICON.jpeg";
const WHITE_THRESHOLD = 245;

const { data, info } = await sharp(sourcePath)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

for (let i = 0; i < data.length; i += 4) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  if (r >= WHITE_THRESHOLD && g >= WHITE_THRESHOLD && b >= WHITE_THRESHOLD) {
    data[i + 3] = 0;
  }
}

const transparent = await sharp(data, {
  raw: { width: info.width, height: info.height, channels: 4 },
})
  .png()
  .toBuffer();

const trimmed = await sharp(transparent).trim({ threshold: 10 }).png().toBuffer();
const meta = await sharp(trimmed).metadata();
const size = Math.max(meta.width ?? 1, meta.height ?? 1);

const square = await sharp({
  create: {
    width: size,
    height: size,
    channels: 4,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  },
})
  .composite([{ input: trimmed, gravity: "center" }])
  .png()
  .toBuffer();

await sharp(square).resize(32, 32).png().toFile("src/app/icon.png");
await sharp(square).resize(180, 180).png().toFile("src/app/apple-icon.png");
await sharp(square).resize(512, 512).png().toFile("public/brand/favicon.png");

console.log("Updated favicon from public/FAVICON.jpeg (transparent background)");
