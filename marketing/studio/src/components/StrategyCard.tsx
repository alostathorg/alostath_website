// The end card every strategy video closes on: «استراتيجية صفّية», the strategy's name stamped in olive with its English
// name under it, its steps on a ruled card (each on its own word), then the foundation's logo, its site and the source.
import { Img, interpolate, useCurrentFrame } from "remotion";
import { asset, C, LOGO, logoWidth, MONO, TEXT } from "../brand";
import { clamp, easeOut, progress } from "../lib/motion";
import { Page } from "./Page";
import { Box, Sk } from "./Sketch";
import { At } from "./Words";

export type Step = { text: string; color: string; at: number };

export const StrategyCard: React.FC<{
  name: string;
  latin: string;
  /** Frames (from the scene's start): the stamp lands, the card opens, the line ends. */
  stamp: number;
  cardFrom: number;
  done: number;
  steps: Step[];
  /** Drawn on the card's left, inside the SVG: a bulb, a badge. Gets the card's top and height. */
  mark?: (top: number, height: number) => React.ReactNode;
  /** Drawn beside the card (the teacher). */
  side?: React.ReactNode;
  nameSize?: number;
}> = ({ name, latin, stamp: stampAt, cardFrom, done, steps, mark, side, nameSize = 78 }) => {
  const frame = useCurrentFrame();
  const stamp = interpolate(frame, [stampAt, stampAt + 7], [0, 1], { ...clamp, easing: easeOut });
  const card = progress(frame, cardFrom, 8);
  const brand = progress(frame, done + 4, 14);
  const top = 735;
  const row = 80;
  const height = 70 + steps.length * row;
  const rowY = (n: number) => top + 45 + n * row;
  return (
    <Page
      svg={
        <>
          {card > 0 ? (
            <g opacity={card}>
              <Sk seed={700} items={[{ k: "rect", x: 170, y: top, w: 740, h: height, fill: C.sheet, stroke: C.olive, width: 3.4 }]} />
              <Sk seed={701} still items={steps.slice(1).map((_, n) => ({ k: "line" as const, a: [190, rowY(n) + row / 2] as [number, number], b: [890, rowY(n) + row / 2] as [number, number], stroke: C.hairline, width: 2 }))} />
              {mark?.(top, height)}
            </g>
          ) : null}
          <g opacity={card}>{side}</g>
        </>
      }
    >
      <At x={540} y={455} style={{ opacity: progress(frame, 0, 10) }}>
        <span style={{ fontFamily: TEXT, fontWeight: 500, fontSize: 36, color: C.inkSubtle }}>استراتيجية صفّية</span>
      </At>
      <At x={540} y={585} style={{ opacity: stamp, scale: String(1.3 - 0.3 * stamp) }}>
        <Box border={C.olive} width={5} pad="10px 40px 18px" tilt={-3} fill={C.paper}>
          <span style={{ fontFamily: TEXT, fontWeight: 700, fontSize: nameSize, color: C.olive }}>{name}</span>
        </Box>
      </At>
      <At x={540} y={686} style={{ opacity: stamp, direction: "ltr" }}>
        <span style={{ fontFamily: MONO, fontWeight: 500, fontSize: 28, color: C.inkSubtle }}>{latin}</span>
      </At>
      {steps.map((s, n) => (
        <At key={s.text} x={850} y={rowY(n)} anchor="right" style={{ opacity: progress(frame, s.at, 7) }}>
          <span style={{ fontFamily: TEXT, fontWeight: 600, fontSize: 44, color: s.color }}>{s.text}</span>
        </At>
      ))}
      <At x={540} y={top + height + 115} style={{ opacity: brand }}>
        <Img src={asset(LOGO.file)} style={{ width: logoWidth(300), display: "block" }} />
      </At>
      <At x={540} y={top + height + 227} style={{ opacity: brand, direction: "ltr" }}>
        <span style={{ fontFamily: MONO, fontWeight: 500, fontSize: 32, color: C.olive }}>ostath.sa</span>
      </At>
      <At x={540} y={top + height + 300} style={{ opacity: brand }}>
        <span style={{ fontFamily: TEXT, fontWeight: 400, fontSize: 24, color: C.inkSubtle }}>
          مستوحاة من كتاب <span style={{ direction: "ltr", unicodeBidi: "isolate" }}>Teach Like a Champion</span> لدوغ ليموف
        </span>
      </At>
    </Page>
  );
};
