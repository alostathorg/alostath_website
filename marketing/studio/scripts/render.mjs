// Renders a video.
//   npm run render -- 01-cold-call           the finished video: the Remotion render, the sound mastered for social
//                                            platforms (−14 LUFS, peaks limited under −1.5 dBFS), and a copy under a clear
//                                            name in the videos folder on the Desktop («فيديوهات الأستاذ», e.g.
//                                            «01 اسأل الجميع.mp4»). An earlier cut of the same video moves to «نسخ سابقة»
//                                            with its date, so nothing is lost.
//   npm run render -- 01-cold-call --draft   a silent cut for review before the voice exists: rendered muted to
//                                            ~/Movies/Al-Ostath Marketing/<id>/draft-silent.mp4, with a copy on the Desktop
//                                            as «01 اسأل الجميع - مسودة بدون صوت.mp4».
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { copyFile, mkdir, readFile, rename, rm, stat } from "node:fs/promises";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const STUDIO = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const MEDIA = process.env.ALOSTATH_MEDIA_DIR ?? join(homedir(), "Movies", "Al-Ostath Marketing");
const VIDEOS = process.env.ALOSTATH_VIDEOS_DIR ?? join(homedir(), "Desktop", "فيديوهات الأستاذ");

const [id, ...flags] = process.argv.slice(2);
if (!id) throw new Error("usage: npm run render -- <video-id> [--draft]");
const script = JSON.parse(await readFile(join(STUDIO, "..", "videos", id, "script.json"), "utf8"));
if (!script.composition) throw new Error(`add "composition" (the Remotion composition id) to videos/${id}/script.json`);
const remotion = (output, extra = []) =>
  execFileSync("npx", ["remotion", "render", "src/index.ts", script.composition, output, "--codec=h264", "--crf=18", ...extra], { cwd: STUDIO, stdio: "inherit" });

/** Files [file] in the Desktop folder as «<nn> <title><suffix>.mp4»; the previous one moves to «نسخ سابقة» with its date. */
async function publish(file, suffix = "") {
  await mkdir(VIDEOS, { recursive: true });
  const name = `${id.slice(0, 2)} ${script.title}${suffix}`;
  const dest = join(VIDEOS, `${name}.mp4`);
  if (existsSync(dest)) {
    const older = join(VIDEOS, "نسخ سابقة");
    await mkdir(older, { recursive: true });
    const t = (await stat(dest)).mtime;
    const pad = (n) => String(n).padStart(2, "0");
    const stamp = `${t.getFullYear()}-${pad(t.getMonth() + 1)}-${pad(t.getDate())} ${pad(t.getHours())}.${pad(t.getMinutes())}`;
    await rename(dest, join(older, `${name} ${stamp}.mp4`));
  }
  await copyFile(file, dest);
  return dest;
}

if (flags.includes("--draft")) {
  const draft = join(MEDIA, id, "draft-silent.mp4");
  await mkdir(dirname(draft), { recursive: true });
  remotion(draft, ["--muted"]);
  console.log(`\n${draft}\n${await publish(draft, " - مسودة بدون صوت")}`);
  process.exit(0);
}

// The finished video carries the voice: refuse to master a video that has none yet.
const manifest = JSON.parse(await readFile(join(STUDIO, "public", "media", id, "manifest.json"), "utf8").catch(() => "{}"));
if (!Object.keys(manifest.lines ?? {}).length) throw new Error(`no voice lines in public/media/${id} (npm run prep -- ${id}); for a silent review copy use --draft`);

const work = join(MEDIA, id, "renders");
await mkdir(work, { recursive: true });
const raw = join(work, `${id}-raw.mp4`);
const master = join(work, `${id}.mp4`);

// 1. Render.
remotion(raw);

// 2. Master the sound: measure, normalise in one linear pass, limit the peaks. The picture is copied as is.
const { stderr } = spawnSync("ffmpeg", ["-hide_banner", "-nostats", "-i", raw, "-af", "loudnorm=I=-14:TP=-1.5:LRA=7:print_format=json", "-f", "null", "-"], { encoding: "utf8" });
const m = JSON.parse(stderr.slice(stderr.lastIndexOf("{"), stderr.lastIndexOf("}") + 1));
const loudness = `loudnorm=I=-14:TP=-1.5:LRA=7:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true`;
execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-i", raw, "-c:v", "copy", "-af", `${loudness},alimiter=limit=0.84:level=false,aresample=48000`, "-c:a", "aac", "-b:a", "192k", master]);
await rm(raw);

// 3. The videos folder: one clear name per video.
console.log(`\n${await publish(master)}`);
