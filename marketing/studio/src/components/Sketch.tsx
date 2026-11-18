// Hand-drawn line work for the drawn videos: every shape goes through roughjs, so lines wobble like a marker on paper,
// and every few frames they are redrawn with another seed (a gentle "boil"), the way hand-drawn animation breathes.
// Shapes are cached by their geometry, ink and seed, so a frame only draws what it has not drawn before.
import rough from "roughjs";
import type { Options } from "roughjs/bin/core";
import { useCurrentFrame } from "remotion";
import { C } from "../brand";

const gen = rough.generator();

export type Pt = [number, number];
export type Shape =
  | { k: "line"; a: Pt; b: Pt }
  | { k: "circle"; c: Pt; d: number }
  | { k: "ellipse"; c: Pt; w: number; h: number }
  | { k: "rect"; x: number; y: number; w: number; h: number }
  | { k: "path"; d: string }
  | { k: "poly"; pts: Pt[] }
  | { k: "linear"; pts: Pt[] }
  | { k: "curve"; pts: Pt[] }
  | { k: "arc"; c: Pt; w: number; h: number; start: number; stop: number; closed?: boolean };

/** The ink a shape is drawn with: roughjs options under shorter names. */
export type Ink = {
  stroke?: string;
  width?: number;
  fill?: string;
  fillStyle?: "solid" | "hachure" | "cross-hatch" | "zigzag" | "dots";
  rough?: number;
  bow?: number;
  gap?: number;
  fillWeight?: number;
  angle?: number;
};

type PathInfo = { d: string; stroke: string; strokeWidth: number; fill?: string };
const cache = new Map<string, PathInfo[]>();

function options(ink: Ink, seed: number): Options {
  return {
    seed,
    stroke: ink.stroke ?? C.ink,
    strokeWidth: ink.width ?? 3,
    roughness: ink.rough ?? 0.9,
    bowing: ink.bow ?? 0.8,
    disableMultiStroke: true,
    disableMultiStrokeFill: true,
    preserveVertices: false,
    fill: ink.fill,
    fillStyle: ink.fill ? (ink.fillStyle ?? "solid") : undefined,
    hachureGap: ink.gap ?? 8,
    hachureAngle: ink.angle ?? -41,
    fillWeight: ink.fillWeight ?? 1.6,
  };
}

function draw(s: Shape, ink: Ink, seed: number): PathInfo[] {
  const key = JSON.stringify([s, ink, seed]);
  const hit = cache.get(key);
  if (hit) return hit;
  const o = options(ink, seed);
  const d =
    s.k === "line"
      ? gen.line(s.a[0], s.a[1], s.b[0], s.b[1], o)
      : s.k === "circle"
        ? gen.circle(s.c[0], s.c[1], s.d, o)
        : s.k === "ellipse"
          ? gen.ellipse(s.c[0], s.c[1], s.w, s.h, o)
          : s.k === "rect"
            ? gen.rectangle(s.x, s.y, s.w, s.h, o)
            : s.k === "path"
              ? gen.path(s.d, o)
              : s.k === "poly"
                ? gen.polygon(s.pts, o)
                : s.k === "linear"
                  ? gen.linearPath(s.pts, o)
                  : s.k === "curve"
                    ? gen.curve(s.pts, o)
                    : gen.arc(s.c[0], s.c[1], s.w, s.h, s.start, s.stop, s.closed ?? false, o);
  const paths = gen.toPaths(d) as PathInfo[];
  cache.set(key, paths);
  return paths;
}

/** Frames between redraws of the line work, and how many variants it cycles through. */
const BOIL = 5;
const VARIANTS = 3;

/** The variant of the line work for the current frame (0 when [still]). */
export const useBoil = (still = false) => {
  const frame = useCurrentFrame();
  return still ? 0 : Math.floor(frame / BOIL) % VARIANTS;
};

/** One drawn shape list: each item is a shape plus its ink. [seed] keeps a drawing's wobble its own. */
export const Sk: React.FC<{ items: (Shape & Ink)[]; seed: number; still?: boolean; opacity?: number; style?: React.CSSProperties }> = ({ items, seed, still, opacity, style }) => {
  const boil = useBoil(still);
  return (
    <g opacity={opacity} style={style}>
      {items.flatMap((item, i) => {
        const ink: Ink = { stroke: item.stroke, width: item.width, fill: item.fill, fillStyle: item.fillStyle, rough: item.rough, bow: item.bow, gap: item.gap, fillWeight: item.fillWeight, angle: item.angle };
        return draw(item, ink, seed * 97 + i * 7 + boil + 1).map((p, j) => (
          <path
            key={`${i}-${j}`}
            d={p.d}
            stroke={p.stroke}
            strokeWidth={p.strokeWidth}
            fill={p.fill ?? "none"}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ));
      })}
    </g>
  );
};

/** A rounded rectangle as a path, for roughjs to wobble. */
export const roundRect = (x: number, y: number, w: number, h: number, r: number) =>
  `M${x + r},${y} H${x + w - r} Q${x + w},${y} ${x + w},${y + r} V${y + h - r} Q${x + w},${y + h} ${x + w - r},${y + h} H${x + r} Q${x},${y + h} ${x},${y + h - r} V${y + r} Q${x},${y} ${x + r},${y} Z`;

/** The full-frame SVG that drawings live in (1080 × 1920). */
export const Canvas: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, overflow: "visible", ...style }}>
    {children}
  </svg>
);

/** The SVG filters hand-drawn boxes use for their border: a displacement that wobbles a straight CSS border.
 *  Rendered once per composition; three variants follow the boil. */
export const WobbleDefs: React.FC = () => (
  <svg width={0} height={0} style={{ position: "absolute" }} aria-hidden>
    <defs>
      {[0, 1, 2].map((v) => (
        <filter key={v} id={`wobble-${v}`} x="-5%" y="-20%" width="110%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves={2} seed={v * 11 + 3} />
          <feDisplacementMap in="SourceGraphic" scale={3.2} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      ))}
    </defs>
  </svg>
);

/** Uneven corner radii per boil variant: a box that was drawn, not set. */
const RADII = ["16px 13px 17px 12px / 13px 17px 12px 16px", "13px 17px 12px 16px / 16px 12px 17px 13px", "17px 12px 16px 14px / 12px 16px 13px 17px"];

/** A hand-drawn box around HTML content: the border wobbles (filter) while the content stays crisp. */
export const Box: React.FC<{
  children: React.ReactNode;
  border?: string;
  fill?: string;
  width?: number;
  pad?: string;
  tilt?: number;
  still?: boolean;
  style?: React.CSSProperties;
}> = ({ children, border = C.ink, fill = C.sheet, width = 3, pad = "10px 26px 14px", tilt = 0, still, style }) => {
  const boil = useBoil(still);
  return (
    <div style={{ position: "relative", display: "inline-block", padding: pad, rotate: `${tilt}deg`, ...style }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: fill,
          border: `${width}px solid ${border}`,
          borderRadius: RADII[boil],
          filter: `url(#wobble-${boil})`,
        }}
      />
      <div style={{ position: "relative" }}>{children}</div>
    </div>
  );
};
