// Splits one recording that reads several script lines in a row (e.g. the whole script pasted into the
// ElevenLabs website) into one file per line, with the timing of every word (the scenes' beats sit on them).
// A recording of a single line works the same way: pass that one line to --lines.
// Word timings come from ElevenLabs forced alignment, which matches the audio to the script's own words: exact,
// free on our plan, and unbothered by numbers written as words. Without a key it falls back to a local Whisper
// transcription (mlx_whisper) matched to the script by text (a dialect spelling Whisper writes as two words still
// finds its word), with its boundaries snapped to the real pauses. Each line is cut at the quietest moment between
// it and the next.
//
// Usage: npm run voice:split -- <video> <take.mp3> --lines 01-24 [--voice narrator] [--only 03,05]
//   --lines   the script lines the take reads, in order (01-24, or 03,06, or a single 04)
//   --voice   whose voice the take is, when a video has a voice per role; lines of another role are kept as
//             placeholders until that voice comes. A one-voice video (script.json "voice": { "mode": "one" }) needs none.
//   --only    keep just these lines from this take (the best line from each of several takes)
// Writes ~/Movies/Al-Ostath Marketing/<video>/lines/<nn>-<role>.mp3 + .words.json, and lines/takes.json.
import { execFileSync, spawnSync } from "node:child_process";
import { createReadStream, existsSync } from "node:fs";
import { mkdtemp, readFile, rename, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, join } from "node:path";
import { client, errText, loadVideo, readJSON, writeJSON } from "./lib.mjs";

const args = process.argv.slice(2);
const [id, take] = args;
const opt = (name) => args[args.indexOf(`--${name}`) + 1];
if (!id || !take || !args.includes("--lines")) {
  console.error("usage: npm run voice:split -- <video> <take.mp3> --lines 01-24 [--voice narrator]");
  process.exit(1);
}
const { script, out } = await loadVideo(id);
const oneVoice = script.voice?.mode === "one";
if (!oneVoice && !args.includes("--voice")) {
  console.error("this video has a voice per role: pass --voice <role>");
  process.exit(1);
}
const voice = oneVoice ? "one" : opt("voice");
const placeholder = (role) => !oneVoice && role !== voice;

const range = opt("lines");
const ids = range.includes("-")
  ? script.lines.map((l) => l.id).filter((x) => x >= range.split("-")[0] && x <= range.split("-")[1])
  : range.split(",");
const lines = ids.map((x) => script.lines.find((l) => l.id === x) ?? (() => { throw new Error(`no line ${x}`); })());

// The script's words without audio tags or harakat (the dialect script carries full tashkeel to steer the voice).
const plain = (t) => t.replace(/\[[^\]]+\]\s*/g, "").replace(/[ً-ْٰ]/g, "").trim();
const scriptWords = lines.map((l) => plain(l.text).split(/\s+/).filter(Boolean));

/** A word's letters only, with the spellings a transcription and a dialect script disagree on made equal. */
const letters = (w) => plain(w).replace(/[^\p{L}\p{N}]/gu, "").replace(/[أإآ]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي");
/** Edit distance between two words, over the longer one's length: 0 the same, 1 nothing alike. */
function distance(a, b) {
  if (!a.length || !b.length) return 1;
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[b.length] / Math.max(a.length, b.length);
}
/** Matches the script's words to the words Whisper heard, in order, allowing a word heard as two («عالواتساب» heard
 *  as «على الواتساب») or two heard as one, and words missed or added. Returns one { start, end } per script word,
 *  and the mean distance of the match (0 is a perfect read). */
function matchWords(script, heard) {
  const S = script.map(letters);
  const H = heard.map((w) => letters(w.word));
  const [n, m] = [S.length, H.length];
  const cost = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(Infinity));
  const step = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(null));
  cost[0][0] = 0;
  for (let i = 0; i <= n; i++) {
    for (let j = 0; j <= m; j++) {
      const c = cost[i][j];
      if (c === Infinity) continue;
      const go = (di, dj, add) => {
        if (i + di > n || j + dj > m || c + add >= cost[i + di][j + dj]) return;
        cost[i + di][j + dj] = c + add;
        step[i + di][j + dj] = [di, dj];
      };
      if (i < n && j < m) go(1, 1, distance(S[i], H[j]));
      if (i < n && j + 1 < m) go(1, 2, distance(S[i], H[j] + H[j + 1]) + 0.1);
      if (i + 1 < n && j < m) go(2, 1, distance(S[i] + S[i + 1], H[j]) + 0.1);
      go(1, 0, 1);
      go(0, 1, 1);
    }
  }
  const out = new Array(n).fill(null);
  for (let i = n, j = m; i > 0 || j > 0; ) {
    const [di, dj] = step[i][j];
    if (di && dj) {
      const [start, end] = [heard[j - dj].start, heard[j - 1].end];
      if (di === 1) out[i - 1] = { start, end };
      else [out[i - 2], out[i - 1]] = [{ start, end: (start + end) / 2 }, { start: (start + end) / 2, end }];
    }
    i -= di;
    j -= dj;
  }
  // A script word nobody heard takes the gap between its neighbours.
  for (let k = 0; k < n; k++) {
    if (out[k]) continue;
    const before = out.slice(0, k).reverse().find(Boolean);
    const after = out.slice(k + 1).find(Boolean);
    const start = before?.end ?? after?.start ?? 0;
    out[k] = { start, end: Math.max(start + 0.08, after?.start ?? start + 0.3) };
  }
  return { words: out, mean: cost[n][m] / n };
}

// 1. Word timings: forced alignment to the script, or Whisper.
const expected = scriptWords.flat().length;
let words;
let aligned = false;
try {
  const r = await client.forcedAlignment.create({ file: createReadStream(take), text: scriptWords.map((w) => w.join(" ")).join("\n") });
  const found = r.words.filter((w) => w.text.trim());
  if (found.length !== expected) throw new Error(`aligned ${found.length} words, the lines have ${expected}`);
  words = found.map(({ start, end }) => ({ start, end }));
  aligned = true;
  console.log("word timings: ElevenLabs forced alignment");
} catch (e) {
  console.log(`word timings: Whisper (forced alignment unavailable: ${errText(e)})`);
  // The transcription is kept in the temp folder per take, so splitting the same take again (--only) is instant.
  const { size, mtimeMs } = await stat(take);
  const cache = join(tmpdir(), `alostath-whisper-${basename(take)}-${size}-${Math.round(mtimeMs)}.json`);
  if (!existsSync(cache)) {
    const tmp = await mkdtemp(join(tmpdir(), "alostath-split-"));
    execFileSync("mlx_whisper", [take, "--model", "mlx-community/whisper-large-v3-mlx", "--language", "ar", "--word-timestamps", "True", "--output-format", "json", "--output-dir", tmp, "--verbose", "False"], { stdio: "ignore" });
    await rename(join(tmp, `${basename(take).replace(/\.[^.]+$/, "")}.json`), cache);
    await rm(tmp, { recursive: true, force: true });
  }
  const heard = JSON.parse(await readFile(cache, "utf8"));
  const heardWords = heard.segments.flatMap((s) => s.words ?? []);
  const { words: matched, mean } = matchWords(scriptWords.flat(), heardWords);
  console.log(`Whisper heard ${heardWords.length} words for the lines' ${expected}; matched by text (mean distance ${mean.toFixed(2)})`);
  if (mean > 0.4) {
    console.error(`the take does not read lines ${ids.join(",")}; check --lines`);
    console.error(`heard: ${heard.text}`);
    process.exit(1);
  }
  words = matched;
}

// 2. Loudness every 10 ms, to cut where it is quietest.
const pcm = execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-i", take, "-ac", "1", "-ar", "16000", "-f", "s16le", "-"], { maxBuffer: 1 << 28 });
const rms = [];
for (let i = 0; i + 320 <= pcm.length; i += 320) {
  let sum = 0;
  for (let j = i; j < i + 320; j += 2) sum += pcm.readInt16LE(j) ** 2;
  rms.push(Math.sqrt(sum / 160));
}
const quietest = (t, span = 0.3) => {
  let best = Math.round(t * 100);
  for (let k = Math.max(0, Math.round((t - span) * 100)); k <= Math.min(rms.length - 1, Math.round((t + span) * 100)); k++) if (rms[k] < rms[best]) best = k;
  return best / 100;
};
const duration = Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", take]).toString());

// 3. One cut per boundary between lines, so neighbouring lines never overlap or leave a gap.
const groups = [];
let w = 0;
for (const sw of scriptWords) {
  groups.push(words.slice(w, w + sw.length));
  w += sw.length;
}

// (Whisper only; forced alignment is exact.) Whisper's word times drift around pauses, and the story's beats sit
// right on them. Where the script pauses inside a line («…», «،», «.», «:»), snap the boundary to the real silence
// in the audio: the word before ends where the silence starts, the next word starts where it ends. A silence is
// 0.1 s or more under 3% of the take's loud level.
const loud = [...rms].sort((a, b) => a - b)[Math.floor(rms.length * 0.95)];
const silences = [];
for (let k = 0, run = -1; k <= rms.length; k++) {
  const quiet = k < rms.length && rms[k] < loud * 0.03;
  if (quiet && run < 0) run = k;
  if (!quiet && run >= 0) {
    if (k - run >= 10) silences.push([run / 100, k / 100]);
    run = -1;
  }
}
for (const [i, g] of aligned ? [] : groups.entries()) {
  for (let j = 0; j < g.length - 1; j++) {
    if (!/[…،,.:]$/.test(scriptWords[i][j])) continue;
    const [a, b] = [g[j], g[j + 1]];
    const pause = silences.find(([s]) => s >= a.start + 0.08 && s <= b.end + 0.6);
    if (!pause) continue;
    a.end = pause[0];
    b.start = Math.max(b.start, pause[1]);
    b.end = Math.max(b.end, b.start + 0.08);
  }
}
const cuts = [Math.max(0, groups[0][0].start - 0.15)];
for (let i = 1; i < groups.length; i++) cuts.push(quietest((groups[i - 1].at(-1).end + groups[i][0].start) / 2));
cuts.push(duration);

// 4. Cut each line, and keep its words (script text, measured timing) relative to the cut.
const takes = (await readJSON(join(out, "lines", "takes.json"))) ?? {};
const only = args.includes("--only") ? opt("only").split(",") : ids;
for (const [i, line] of lines.entries()) {
  if (!only.includes(line.id)) continue;
  const mine = groups[i];
  const [start, end] = [cuts[i], cuts[i + 1]];
  const at = (t) => +Math.min(end - start, Math.max(0, t - start)).toFixed(3);
  const name = `${line.id}-${line.role}`;
  const file = join(out, "lines", `${name}.mp3`);
  spawnSync("mkdir", ["-p", join(out, "lines")]);
  // Trim inside the filter so the fades are timed on the cut line, not on the whole take.
  const trim = `atrim=start=${start.toFixed(3)}:end=${end.toFixed(3)},asetpts=PTS-STARTPTS`;
  const fades = `afade=t=in:d=0.015,afade=t=out:st=${(end - start - 0.05).toFixed(3)}:d=0.05`;
  execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-i", take, "-af", `${trim},${fades}`, "-ar", "44100", "-b:a", "192k", file]);
  await writeJSON(join(out, "lines", `${name}.words.json`), mine.map((m, k) => ({ text: scriptWords[i][k], start: at(m.start), end: at(m.end) })));
  takes[line.id] = { file: `${name}.mp3`, take: basename(take), voice, cut: [+start.toFixed(2), +end.toFixed(2)], placeholder: placeholder(line.role) };
  console.log(`${name}: ${start.toFixed(2)}–${end.toFixed(2)}s${placeholder(line.role) ? `  (placeholder: ${voice}'s voice)` : ""}`);
}
await writeJSON(join(out, "lines", "takes.json"), takes);
