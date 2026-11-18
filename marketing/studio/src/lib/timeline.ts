// Shared timing for the studio's videos. Each video plans its scenes (which voice lines play in each, a minimum
// length, a tail after the last line); scenes stretch to fit the real lines (public/media/<id>/manifest.json, from
// `npm run prep`), or to estimates from the text before the voices exist. Dropping the voice in re-times the video.
import { staticFile } from "remotion";

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;
/** Frames each scene overlaps the next during a transition (a video can pass its own). */
export const TRANSITION = 12;

export type Word = { text: string; start: number; end: number };
export type Line = { id: string; role: string; text: string; from: number; frames: number; file: string | null; words: Word[] | null };
/** [lines] are the scene's voice lines; their `from` is relative to the scene's start. */
export type Scene = { from: number; frames: number; lines: Line[] };
export type Clip = { file: string; seconds: number };
export type Manifest = { sfx: Record<string, Clip>; lines: Record<string, Clip & { words?: Word[] }> };
export type Timeline<S extends string = string> = {
  scenes: Record<S, Scene>;
  lines: Line[];
  total: number;
  /** Frames between scenes (the overlap of each transition). */
  transition: number;
  sfx: Record<string, Clip>;
  hasVoice: boolean;
};
/** A scene: its voice lines (each at least [at] seconds into the scene and [gap] seconds after the line before
 *  it), its minimum length, and the tail kept after its last line. */
export type ScenePlan<S extends string> = { id: S; min: number; tail: number; lines: { id: string; at?: number; gap?: number }[] };
export type Script = { lines: { id: string; role: string; text: string }[] };

/** Line text without audio tags or harakat (the spoken script carries tashkeel to steer the voice). */
export const plain = (text: string) =>
  text
    .replace(/\[[^\]]+\]\s*/g, "")
    .replace(/[ً-ْٰ]/g, "")
    .trim();

/** A spoken-length estimate for a line that has no audio yet (a calm delivery, about 11 characters a second). */
const estimate = (text: string) => plain(text).length / 11 + 0.3;

export function buildTimeline<S extends string>(script: Script, plan: ScenePlan<S>[], manifest: Manifest | null, transition = TRANSITION): Timeline<S> {
  const sec = (s: number) => Math.round(s * FPS);
  const scenes = {} as Record<S, Scene>;
  const lines: Line[] = [];
  let from = 0;
  for (const p of plan) {
    const sceneLines: Line[] = [];
    let cursor = 0;
    for (const { id, at = 0, gap = 0.4 } of p.lines) {
      const src = script.lines.find((l) => l.id === id);
      if (!src) throw new Error(`no line ${id} in the script`);
      const clip = manifest?.lines[id];
      const start = Math.max(at, sceneLines.length ? cursor + gap : 0);
      const seconds = clip?.seconds ?? estimate(src.text);
      sceneLines.push({ id, role: src.role, text: src.text, from: sec(start), frames: sec(seconds), file: clip?.file ?? null, words: clip?.words ?? null });
      cursor = start + seconds;
    }
    const frames = sec(Math.max(p.min, cursor + p.tail));
    scenes[p.id] = { from, frames, lines: sceneLines };
    for (const l of sceneLines) lines.push({ ...l, from: from + l.from });
    from += frames - transition;
  }
  return { scenes, lines, total: from + transition, transition, sfx: manifest?.sfx ?? {}, hasVoice: !!manifest && Object.keys(manifest.lines).length > 0 };
}

/** Start of every word of [line], in seconds from its start: the real timings, or an even spread by length. */
export function wordStarts(line: Line): number[] {
  const words = plain(line.text).split(/\s+/).filter(Boolean);
  if (line.words && line.words.length === words.length) return line.words.map((w) => w.start);
  const total = line.frames / FPS;
  const sum = words.reduce((a, w) => a + w.length + 1, 0);
  let t = 0;
  return words.map((w) => {
    const start = t;
    t += ((w.length + 1) / sum) * total;
    return start;
  });
}

/** Frame (from the line's start) of every word of [line]. */
export const wordFrames = (line: Line) => wordStarts(line).map((s) => line.from + Math.round(s * FPS));

/** Frame (as wordFrames counts) where the first word containing [text] starts, real or estimated; the line's
 *  start if no word matches. Beats keyed on words survive edits to the rest of the line. */
export function wordFrame(line: Line, text: string): number {
  const words = plain(line.text).split(/\s+/).filter(Boolean);
  const i = words.findIndex((w) => w.includes(plain(text)));
  return i < 0 ? line.from : wordFrames(line)[i];
}

/** Seconds into [line] where the first word matching [test] starts, or [fraction] of the line without word timings. */
export function wordAt(line: Line, test: (word: string) => boolean, fraction: number): number {
  const word = line.words?.find((w) => test(plain(w.text)));
  return word ? word.start : (line.frames / FPS) * fraction;
}

/** A video's manifest (from `npm run prep`), or null before it exists. */
export async function loadManifest(video: string, signal?: AbortSignal): Promise<Manifest | null> {
  const res = await fetch(staticFile(`media/${video}/manifest.json`), { signal }).catch(() => null);
  return res?.ok ? ((await res.json()) as Manifest) : null;
}
