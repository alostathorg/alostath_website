// Renders frames as PNGs (one bundle for everything asked), for a visual check without opening the Studio.
// Usage: npm run stills -- 01-wadi-backyard                    one still per scene, once its narration has played
//                                                            → out/stills/01-wadi-backyard/01-wadi.png …
//        npm run stills -- WadiBackyard 45 160 420           chosen frames of one composition → out/stills/WadiBackyard-45.png …
//        npm run stills -- WadiBackyard:0,120 Other:300       several compositions
//        SCALE=0.5 npm run stills -- …                       (default: 1 for a video's scenes, 0.5 for chosen frames)
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import { existsSync } from "node:fs";
import { mkdir, readFile, rm } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const STUDIO = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const out = join(STUDIO, "out", "stills");
const serveUrl = await bundle({ entryPoint: join(STUDIO, "src", "index.ts"), publicDir: join(STUDIO, "public") });

const scriptFile = args.length === 1 ? join(STUDIO, "..", "videos", args[0], "script.json") : null;
if (scriptFile && existsSync(scriptFile)) {
  // A video: one still per scene, on the frame after the scene's last line ends (or before its exit transition).
  const video = args[0];
  const script = JSON.parse(await readFile(scriptFile, "utf8"));
  const composition = await selectComposition({ serveUrl, id: script.composition, inputProps: {} });
  const { scenes, transition } = composition.props.timeline;
  const dir = join(out, video);
  await rm(dir, { recursive: true, force: true });
  await mkdir(dir, { recursive: true });
  console.log(`${script.composition}: ${composition.durationInFrames} frames at ${composition.fps} fps (${(composition.durationInFrames / composition.fps).toFixed(1)} s)`);
  for (const [i, [id, scene]] of Object.entries(scenes).entries()) {
    const last = scene.lines.at(-1);
    const settled = last ? last.from + last.frames + 8 : Math.round(scene.frames / 2);
    const frame = scene.from + Math.min(settled, scene.frames - transition - 2);
    const output = join(dir, `${String(i + 1).padStart(2, "0")}-${id}.png`);
    await renderStill({ composition, serveUrl, frame, output, scale: Number(process.env.SCALE ?? 1) });
    console.log(`${output}  (frame ${frame}, ${(frame / composition.fps).toFixed(2)} s)`);
  }
} else {
  const jobs = args.some((a) => a.includes(":"))
    ? args.map((a) => ({ id: a.split(":")[0], frames: a.split(":")[1].split(",").map(Number) }))
    : [{ id: args[0], frames: args.slice(1).map(Number) }];
  await mkdir(out, { recursive: true });
  for (const { id, frames } of jobs) {
    const composition = await selectComposition({ serveUrl, id, inputProps: {} });
    console.log(`${id}: ${composition.durationInFrames} frames at ${composition.fps} fps (${(composition.durationInFrames / composition.fps).toFixed(1)} s)`);
    for (const frame of frames) {
      const output = join(out, `${id}-${frame}.png`);
      await renderStill({ composition, serveUrl, frame, output, scale: Number(process.env.SCALE ?? 0.5) });
      console.log(output);
    }
  }
}
