// Shared helpers for Al-Ostath's voice tools (ElevenLabs, with a local Whisper fallback in split.mjs). Ported from Seeat
// Al-Masaken's marketing branch.
// The key comes from marketing/.env.local through `node --env-file-if-exists` (see package.json scripts).
// Never put it in code, and never print or open that file.
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import { createWriteStream } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { fileURLToPath } from "node:url";

// Created on first use, so a tool that never reaches ElevenLabs (split.mjs without a key) runs without one.
let elevenLabs;
export const client = new Proxy({}, { get: (_, key) => (elevenLabs ??= new ElevenLabsClient())[key] });

export const MARKETING_DIR = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// Voice lines are media: they live outside git, in one folder per video.
export const MEDIA_DIR = process.env.ALOSTATH_MEDIA_DIR ?? join(homedir(), "Movies", "Al-Ostath Marketing");

export function scriptPath(id) {
  return join(MARKETING_DIR, "videos", id, "script.json");
}

export async function loadVideo(id) {
  const script = JSON.parse(await readFile(scriptPath(id), "utf8"));
  return { script, out: join(MEDIA_DIR, script.id) };
}

export async function readJSON(path) {
  try {
    return JSON.parse(await readFile(path, "utf8"));
  } catch {
    return null;
  }
}

export async function writeJSON(path, data) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(data, null, 2)}\n`);
}

/** Writes whatever the SDK returned (base64 text, bytes, a web or Node stream) to [path]. */
export async function saveAudio(audio, path) {
  await mkdir(dirname(path), { recursive: true });
  if (typeof audio === "string") return writeFile(path, Buffer.from(audio, "base64"));
  if (audio instanceof Uint8Array) return writeFile(path, audio);
  if (audio?.getReader) return pipeline(Readable.fromWeb(audio), createWriteStream(path));
  if (audio?.pipe) return pipeline(audio, createWriteStream(path));
  throw new Error(`unknown audio type for ${path}`);
}

/** Audio tags such as [whispers] steer Eleven v4; strip them where a model or an aligner reads plain text. */
export const stripTags = (text) => text.replace(/\[[^\]]+\]\s*/g, "").trim();

export async function credits() {
  const s = await client.user.subscription.get();
  return { tier: s.tier, used: s.characterCount, limit: s.characterLimit, slotsUsed: s.voiceSlotsUsed, slots: s.voiceLimit };
}

export function errText(e) {
  const detail = e?.body?.detail;
  if (typeof detail === "string") return detail;
  if (detail?.message) return detail.message;
  return e?.message ?? String(e);
}
