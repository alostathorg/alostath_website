// Prepares public/ for a video. Everything it writes is gitignored: rerun it after syncing the site.
//   public/site/assets/  the site's logos and gold pattern (public/assets/alostath-*), copied as they are
//   public/fonts/        the site's typefaces as src/styles/tokens/fonts.css names them: IBM Plex Sans Arabic (all type)
//                        and IBM Plex Mono (figures). The site loads them from Google Fonts, so they are downloaded once
//                        from Google Fonts' own repository (OFL), pinned to one commit.
//   public/media/<id>/   the video's sound effects (from marketing/library/sfx, peak-normalised) and voice lines (from
//                        ~/Movies/Al-Ostath Marketing/<id>/lines/, named <nn>-<role>.mp3 or just <nn>.mp3), each set to
//                        the same loudness so lines from different takes match
//   public/media/<id>/manifest.json   every clip's duration, plus word timings when a line has <name>.words.json
// The composition reads the manifest, so the video's timing follows the real voice lines, or estimates until then.
// Usage: npm run prep -- 01-cold-call
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { copyFile, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const STUDIO = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const REPO = resolve(STUDIO, "..", "..");
const PUBLIC = join(STUDIO, "public");
const MEDIA = process.env.ALOSTATH_MEDIA_DIR ?? join(homedir(), "Movies", "Al-Ostath Marketing");

const id = process.argv[2];
if (!id) throw new Error("usage: npm run prep -- <video-id>");
const script = JSON.parse(await readFile(join(STUDIO, "..", "videos", id, "script.json"), "utf8"));

// 1. The site's brand files, copied as they are (never edited).
const ASSETS = ["alostath-logo.png", "alostath-logo-inverse.png", "alostath-logo-header.png", "alostath-logo-header-inverse.png", "alostath-pattern.svg"];
await rm(join(PUBLIC, "site"), { recursive: true, force: true });
await mkdir(join(PUBLIC, "site", "assets"), { recursive: true });
for (const name of ASSETS) await copyFile(join(REPO, "public", "assets", name), join(PUBLIC, "site", "assets", name));
console.log(`site: ${ASSETS.length} brand files → public/site/assets`);

// 2. The typefaces. Pinned to one commit of github.com/google/fonts, so every prep gets the same files.
const FONTS_COMMIT = "7af0d90b4d532ffa4b041937b560c6df4e7b1e95";
const FONTS = [
  "ofl/ibmplexsansarabic/IBMPlexSansArabic-Regular.ttf",
  "ofl/ibmplexsansarabic/IBMPlexSansArabic-Medium.ttf",
  "ofl/ibmplexsansarabic/IBMPlexSansArabic-SemiBold.ttf",
  "ofl/ibmplexsansarabic/IBMPlexSansArabic-Bold.ttf",
  "ofl/ibmplexsansarabic/OFL.txt",
  "ofl/ibmplexmono/IBMPlexMono-Regular.ttf",
  "ofl/ibmplexmono/IBMPlexMono-Medium.ttf",
  "ofl/ibmplexmono/IBMPlexMono-SemiBold.ttf",
  "ofl/ibmplexmono/OFL.txt",
];
// The site names its faces in its tokens: warn when they change, so the video follows.
const tokens = await readFile(join(REPO, "src", "styles", "tokens", "fonts.css"), "utf8");
if (!tokens.includes("IBM Plex Sans Arabic")) console.log("warning: src/styles/tokens/fonts.css no longer names IBM Plex Sans Arabic; update FONTS here and src/brand.ts");
if (!tokens.includes("IBM Plex Mono")) console.log("warning: src/styles/tokens/fonts.css no longer names IBM Plex Mono; update FONTS here and src/brand.ts");
await mkdir(join(PUBLIC, "fonts"), { recursive: true });
let fetched = 0;
for (const path of FONTS) {
  const name = path.split("/").at(-1).replace("OFL.txt", `OFL-${path.split("/")[1]}.txt`);
  const to = join(PUBLIC, "fonts", name);
  if (existsSync(to)) continue;
  const url = `https://raw.githubusercontent.com/google/fonts/${FONTS_COMMIT}/${path}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`could not download ${url} (${res.status})`);
  await writeFile(to, Buffer.from(await res.arrayBuffer()));
  fetched++;
}
console.log(`fonts: ${FONTS.filter((f) => f.endsWith(".ttf")).length} faces in public/fonts${fetched ? ` (${fetched} downloaded)` : ""}`);

// 3. The video's audio: sound effects from the library, voice lines from ~/Movies/Al-Ostath Marketing/<id>/lines.
const seconds = (file) =>
  Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file]).toString().trim());

// ffmpeg prints the volumedetect result on stderr.
const peak = (file) => {
  const { stderr } = spawnSync("ffmpeg", ["-hide_banner", "-nostats", "-i", file, "-af", "volumedetect", "-f", "null", "-"], { encoding: "utf8" });
  return Number(/max_volume: (-?[\d.]+) dB/.exec(stderr)?.[1] ?? 0);
};

/** Copies [src] to [dest] with its peak raised or lowered to [targetDb]. */
function normalise(src, dest, targetDb) {
  const gain = (targetDb - peak(src)).toFixed(2);
  execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-i", src, "-af", `volume=${gain}dB`, "-ar", "44100", dest]);
}

/** Integrated loudness (LUFS) and true peak (dBTP) of [file], as ffmpeg's loudnorm measures them. */
const loudness = (file) => {
  const { stderr } = spawnSync("ffmpeg", ["-hide_banner", "-nostats", "-i", file, "-af", "loudnorm=print_format=json", "-f", "null", "-"], { encoding: "utf8" });
  const m = JSON.parse(stderr.slice(stderr.lastIndexOf("{"), stderr.lastIndexOf("}") + 1));
  return { lufs: Number(m.input_i), peak: Number(m.input_tp) };
};

/** Voice lines all sit at one loudness, so lines from different takes (or generated one by one) match. One gain per
 *  line keeps its own phrasing; the render masters the mix to −14 LUFS. */
const VOICE_LUFS = -23;
function level(src, dest) {
  const gain = VOICE_LUFS - loudness(src).lufs;
  execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-i", src, "-af", `volume=${gain.toFixed(2)}dB`, "-ar", "44100", "-b:a", "192k", dest]);
  return gain;
}

const src = join(MEDIA, id, "lines");
const out = join(PUBLIC, "media", id);
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
const manifest = { video: id, sfx: {}, lines: {} };

const library = join(STUDIO, "..", "library", "sfx");
const missing = [];
for (const fx of script.sfx ?? []) {
  const from = join(library, `${fx}.mp3`);
  if (!existsSync(from)) {
    missing.push(fx);
    continue;
  }
  await mkdir(join(out, "sfx"), { recursive: true });
  const to = join(out, "sfx", `${fx}.mp3`);
  normalise(from, to, -3);
  manifest.sfx[fx] = { file: `media/${id}/sfx/${fx}.mp3`, seconds: seconds(to) };
}
if (missing.length) console.log(`not in marketing/library/sfx yet: ${missing.join(", ")}`);

// A line's file is <nn>-<role>.mp3 (what a split writes) or simply <nn>.mp3 (a line generated on its own).
await mkdir(src, { recursive: true });
const lineFiles = await readdir(src);
for (const line of script.lines) {
  const name = [`${line.id}-${line.role}`, line.id].find((n) => lineFiles.includes(`${n}.mp3`));
  if (!name) continue;
  await mkdir(join(out, "lines"), { recursive: true });
  const to = join(out, "lines", `${line.id}-${line.role}.mp3`);
  const gain = level(join(src, `${name}.mp3`), to);
  const after = loudness(to);
  console.log(`  ${line.id}: ${seconds(to).toFixed(2)} s, ${gain >= 0 ? "+" : ""}${gain.toFixed(1)} dB → ${after.lufs.toFixed(1)} LUFS, peak ${after.peak.toFixed(1)} dBTP`);
  const wordsFile = join(src, `${name}.words.json`);
  manifest.lines[line.id] = {
    file: `media/${id}/lines/${line.id}-${line.role}.mp3`,
    seconds: seconds(to),
    words: existsSync(wordsFile) ? JSON.parse(await readFile(wordsFile, "utf8")) : undefined,
  };
}

await writeFile(join(out, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
const voiced = Object.keys(manifest.lines).length;
console.log(`media: ${Object.keys(manifest.sfx).length} sfx, ${voiced}/${script.lines.length} voice lines → public/media/${id}`);
if (voiced < script.lines.length) console.log(`voice lines go in ${src} (lines without one are timed by estimate)`);
