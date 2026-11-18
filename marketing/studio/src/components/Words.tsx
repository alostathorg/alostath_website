// Type for the drawn videos: scene tags, speech bubbles, labels and the spoken captions, all in hand-drawn boxes.
// Arabic is set right to left in IBM Plex Sans Arabic; figures (12, 3/4, 29) switch to IBM Plex Mono, as on the site.
import { interpolate, useCurrentFrame } from "remotion";
import { C, MONO, TEXT } from "../brand";
import { clamp, easeOut } from "../lib/motion";
import { FPS, type Line, plain, wordFrames } from "../lib/timeline";
import { Box } from "./Sketch";

/** [text] with every run of figures (12, 3/4, 30/30) set in the mono face. */
export const rich = (text: string) =>
  text.split(/([0-9]+(?:\/[0-9]+)?)/).map((part, i) =>
    i % 2 ? (
      <span key={i} style={{ fontFamily: MONO, fontWeight: 500, fontSize: "0.92em" }}>
        {part}
      </span>
    ) : (
      part
    ),
  );

/** Fades in from [from] over a few frames while settling a few pixels; fades out at [to] if given. */
const appear = (frame: number, from: number, to = Infinity) => {
  const p = interpolate(frame, [from, from + 7], [0, 1], { ...clamp, easing: easeOut });
  const out = to === Infinity ? 1 : interpolate(frame, [to - 6, to], [1, 0], clamp);
  return { opacity: Math.min(p, out), translate: `0px ${(1 - p) * 10}px` };
};

/** Something placed by its centre (or its right edge with [anchor] "right") at (x, y) in the frame. */
export const At: React.FC<{ x: number; y: number; anchor?: "center" | "right" | "left"; children: React.ReactNode; style?: React.CSSProperties }> = ({ x, y, anchor = "center", children, style }) => (
  <div
    style={{
      position: "absolute",
      left: anchor === "right" ? undefined : x,
      right: anchor === "right" ? 1080 - x : undefined,
      top: y,
      transform: anchor === "center" ? "translate(-50%, -50%)" : "translate(0, -50%)",
      direction: "rtl",
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {children}
  </div>
);

/** The scene's tag at the top: «الأربعاء», «الجمعة · بيت العيلة». */
export const Tag: React.FC<{ text: string; from?: number; y?: number }> = ({ text, from = 0, y = 290 }) => {
  const frame = useCurrentFrame();
  return (
    <At x={540} y={y} style={appear(frame, from)}>
      <Box pad="8px 30px 12px">
        <span style={{ fontFamily: TEXT, fontWeight: 600, fontSize: 40, color: C.ink }}>{rich(text)}</span>
      </Box>
    </At>
  );
};

/** A small boxed label in [color] (border and type), shown from [from] to [to]. */
export const Label: React.FC<{ x: number; y: number; text: string; from: number; to?: number; color?: string; size?: number; tilt?: number; fill?: string; anchor?: "center" | "right" | "left" }> = ({
  x,
  y,
  text,
  from,
  to,
  color = C.ink,
  size = 34,
  tilt = 0,
  fill = C.sheet,
  anchor,
}) => {
  const frame = useCurrentFrame();
  if (frame < from || (to !== undefined && frame > to)) return null;
  return (
    <At x={x} y={y} anchor={anchor} style={appear(frame, from, to)}>
      <Box border={color} fill={fill} pad="6px 22px 10px" tilt={tilt}>
        <span style={{ fontFamily: TEXT, fontWeight: 600, fontSize: size, color }}>{rich(text)}</span>
      </Box>
    </At>
  );
};

/** A speech bubble whose [side] edge sits at x (the speaker is on that side), with a short stroke to the speaker. */
export const Bubble: React.FC<{ x: number; y: number; text: string; from: number; to?: number; color?: string; side?: "right" | "left"; size?: number; maxWidth?: number }> = ({
  x,
  y,
  text,
  from,
  to,
  color = C.olive,
  side = "right",
  size = 38,
  maxWidth = 760,
}) => {
  const frame = useCurrentFrame();
  if (frame < from || (to !== undefined && frame > to)) return null;
  return (
    <At x={x} y={y} anchor={side} style={{ ...appear(frame, from, to), whiteSpace: "normal" }}>
      <div style={{ position: "relative" }}>
        <div style={{ position: "absolute", top: "50%", [side === "right" ? "right" : "left"]: -30, width: 30, height: 4, background: C.ink, borderRadius: 2, rotate: side === "right" ? "8deg" : "-8deg" }} />
        <Box pad="12px 30px 16px" style={{ maxWidth }}>
          <span style={{ fontFamily: TEXT, fontWeight: 600, fontSize: size, color, lineHeight: 1.45, display: "inline-block" }}>{rich(text)}</span>
        </Box>
      </div>
    </At>
  );
};

/** The voice's role colours: the border of its caption box. */
export const ROLE_COLOR: Record<string, string> = { narrator: C.ink, teacher: C.olive, student: C.sageText, grandpa: C.goldText };

/** Groups a line's words into the chunks a caption shows: a break after punctuation, or after [max] words. */
function chunks(words: string[], max = 5): number[][] {
  const out: number[][] = [];
  let cur: number[] = [];
  words.forEach((w, i) => {
    cur.push(i);
    if (/[…،.؟!:]$/.test(w) || cur.length >= max) {
      out.push(cur);
      cur = [];
    }
  });
  if (cur.length) out.push(cur);
  return out;
}

/** The spoken words, a few at a time, at the bottom of the scene: words already said in ink, the rest faint. */
export const Captions: React.FC<{ lines: Line[]; y?: number }> = ({ lines, y = 1440 }) => {
  const frame = useCurrentFrame();
  const hold = Math.round(0.35 * FPS);
  const i = lines.findIndex((l, n) => {
    const next = lines[n + 1];
    const end = Math.min(l.from + l.frames + hold, next ? next.from : Infinity);
    return frame >= l.from && frame < end;
  });
  if (i < 0) return null;
  const line = lines[i];
  const words = plain(line.text).split(/\s+/).filter(Boolean);
  const starts = wordFrames(line);
  const groups = chunks(words);
  const g = groups.findLastIndex((c) => starts[c[0]] <= frame);
  const group = groups[Math.max(0, g)];
  const shownFrom = starts[group[0]];
  return (
    <At x={540} y={y} style={appear(frame, shownFrom)}>
      <Box border={ROLE_COLOR[line.role] ?? C.ink} pad="10px 30px 16px">
        <span style={{ fontFamily: TEXT, fontWeight: 500, fontSize: 46, lineHeight: 1.4 }}>
          {group.map((w, n) => (
            <span key={w} style={{ color: frame >= starts[w] ? C.ink : C.inkFaint }}>
              {n ? " " : ""}
              {words[w]}
            </span>
          ))}
        </span>
      </Box>
    </At>
  );
};
