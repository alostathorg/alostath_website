// Shared motion for the studio's videos. The house rule: nothing ever scales. No zoom in or out, no Ken Burns, no
// `scale` on a picture or a scene. Motion is a slow translate (a lateral pan), a clip-path wipe or reveal, an
// opacity fade, and restrained movement of type.
import { Easing, interpolate } from "remotion";

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
/** The design system's own curves (`--sam-ease-out`, `--sam-ease-in-out`). */
export const easeOut = Easing.bezier(0.2, 0.8, 0.2, 1);
export const inOut = Easing.bezier(0.65, 0, 0.35, 1);
/** A long, soft settle for type and reveals. */
export const outSoft = Easing.bezier(0.16, 1, 0.3, 1);

/** 0 → 1 over [frames] from [from], eased. */
export const progress = (frame: number, from: number, frames: number, easing = outSoft) =>
  interpolate(frame, [from, from + Math.max(1, frames)], [0, 1], { ...clamp, easing });

/** Fades in over [inFrames] from [from]; if [to] is given, fades out over [outFrames] ending at [to]. */
export const fade = (frame: number, from: number, inFrames = 14, to = Infinity, outFrames = 12) =>
  Math.min(
    interpolate(frame, [from, from + inFrames], [0, 1], { ...clamp, easing: easeOut }),
    to === Infinity ? 1 : interpolate(frame, [to - outFrames, to], [1, 0], { ...clamp, easing: inOut }),
  );

/** Type that settles into place: it fades in while rising [distance] pixels, from [from]. */
export const rise = (frame: number, from: number, distance = 22, frames = 22) => {
  const p = progress(frame, from, frames);
  return { opacity: p, translate: `0px ${(1 - p) * distance}px` };
};

/** A slow lateral pan: [dx] pixels of travel spread evenly over [frames] from [from] (no easing, like a camera
 *  on a slider), centred on 0 so a picture can be framed at its middle. */
export const pan = (frame: number, from: number, frames: number, dx: number) =>
  interpolate(frame, [from, from + frames], [-dx / 2, dx / 2], clamp);

export type Side = "top" | "right" | "bottom" | "left";

/** A clip-path that reveals an element from one side as [p] goes 0 → 1 (the edge travels away from [side]). */
export const wipe = (p: number, side: Side): string => {
  const hidden = `${((1 - p) * 100).toFixed(3)}%`;
  const inset = { top: "0", right: "0", bottom: "0", left: "0" };
  // The hidden part is the one opposite the side the reveal starts from.
  const opposite: Record<Side, Side> = { top: "bottom", bottom: "top", left: "right", right: "left" };
  inset[opposite[side]] = hidden;
  return `inset(${inset.top} ${inset.right} ${inset.bottom} ${inset.left})`;
};

/** A clip-path that opens from a vertical seam at the centre outward, like a pair of doors, as [p] goes 0 → 1. */
export const doors = (p: number): string => {
  const side = `${((1 - p) * 50).toFixed(3)}%`;
  return `inset(0 ${side} 0 ${side})`;
};
