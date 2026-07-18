#!/usr/bin/env node
/**
 * Generate short, compressed hover previews for homepage Work cards.
 * Source: full cover films. Output: public/work-previews/<slug>.mp4
 *
 * Usage: node scripts/generate-work-previews.mjs
 */
import { mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public", "work-previews");

/** slug -> source path under public/ */
const SOURCES = {
  tvs: "TVS/tvs-mt-saturday.mp4",
  "connect-coffee-museum": "Connect Coffee/connect-coffee-tour.mp4",
  "kyra-platinum-imports": "Kyra/kyra-urus.mp4",
  slate: "Slate/slate-meat.mp4",
  inti: "INTI/inti-sushi-chef.mp4",
  bambino: "Bambino/bambino-pasta.mp4",
  "autobox-motors": "Autobox/autobox-rr-main.mp4",
  "craydel-kenya": "Craydel/craydel-dan-scholarship.mp4",
  "elias-jewelers": "elias-jewellery-campaign.mp4",
  "posh-autobody": "Posh Auto Body/posh-defender-ppf.mp4",
  "durham-school": "durham-x-radhika.mp4",
  "macaash-investments": "Macaash/macaash-cover.mp4",
  "stiltz-homelift": "Stiltz Lifts/stiltz-college.mp4",
};

mkdirSync(outDir, { recursive: true });

let ok = 0;
let skip = 0;
let fail = 0;

for (const [slug, rel] of Object.entries(SOURCES)) {
  const input = join(root, "public", rel);
  const output = join(outDir, `${slug}.mp4`);

  if (!existsSync(input)) {
    console.warn(`SKIP missing source: ${rel}`);
    skip += 1;
    continue;
  }

  // ~3s loopable cut, max 720p, faststart for quick hover start
  const result = spawnSync(
    "ffmpeg",
    [
      "-y",
      "-ss",
      "00:00:00.5",
      "-i",
      input,
      "-t",
      "3.2",
      "-vf",
      "scale=-2:min(720\\,ih)",
      "-c:v",
      "libx264",
      "-preset",
      "fast",
      "-crf",
      "28",
      "-an",
      "-movflags",
      "+faststart",
      "-pix_fmt",
      "yuv420p",
      output,
    ],
    { encoding: "utf8" },
  );

  if (result.status !== 0) {
    console.error(`FAIL ${slug}:`, result.stderr?.split("\n").slice(-6).join("\n"));
    fail += 1;
    continue;
  }

  console.log(`OK  ${slug} -> work-previews/${slug}.mp4`);
  ok += 1;
}

console.log(`\nDone: ${ok} ok, ${skip} skipped, ${fail} failed`);
