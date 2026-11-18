// Drawn objects for the classroom stories: the thinking bulb, desks, a window, a timer, a spider, a dallah, a gift and
// a trap. Every one is drawn in roughjs ink (Sketch.tsx) inside the full-frame SVG.
import { C } from "../brand";
import { type Ink, type Shape, Sk, roundRect } from "./Sketch";

type Item = Shape & Ink;

/** A bulb's glass: a circle that narrows into a neck, centred on the glass. */
const glass = (x: number, y: number, r: number) =>
  `M${x - 0.63 * r},${y + 0.78 * r} A${r},${r} 0 1 1 ${x + 0.63 * r},${y + 0.78 * r} L${x + 0.46 * r},${y + 1.28 * r} L${x - 0.46 * r},${y + 1.28 * r} Z`;

/** The thinking bulb. [on] 0 → 1 lights it (gold, glow and rays); [red] 0 → 1 turns it to alarm. */
export const Bulb: React.FC<{ x: number; y: number; r?: number; on: number; red?: number; seed: number }> = ({ x, y, r = 15, on, red = 0, seed }) => {
  const base: Item[] = [
    { k: "rect", x: x - 0.46 * r, y: y + 1.28 * r, w: 0.92 * r, h: 0.62 * r, fill: C.hairline, stroke: C.inkSubtle, width: 2.4 },
    { k: "line", a: [x - 0.4 * r, y + 1.5 * r], b: [x + 0.4 * r, y + 1.5 * r], stroke: C.inkSubtle, width: 2 },
  ];
  const rays = (stroke: string): Item[] =>
    [-160, -125, -90, -55, -20].map((deg) => {
      const a = (deg * Math.PI) / 180;
      return { k: "line", a: [x + Math.cos(a) * 1.4 * r, y + Math.sin(a) * 1.4 * r], b: [x + Math.cos(a) * 1.95 * r, y + Math.sin(a) * 1.95 * r], stroke, width: 3 };
    });
  const off = 1 - Math.max(on, red);
  return (
    <g>
      {on > 0 ? <circle cx={x} cy={y} r={2.3 * r} fill={C.goldTint} opacity={0.75 * on * (1 - red)} /> : null}
      {red > 0 ? <circle cx={x} cy={y} r={2.3 * r} fill={C.rustTint} opacity={0.8 * red} /> : null}
      {off > 0 ? <Sk seed={seed} opacity={off} items={[{ k: "path", d: glass(x, y, r), fill: C.surface, stroke: C.inkSubtle, width: 2.6 }]} /> : null}
      {on > 0 ? <Sk seed={seed + 1} opacity={on * (1 - red)} items={[{ k: "path", d: glass(x, y, r), fill: "#EBCB5E", stroke: C.goldText, width: 2.8 }, ...rays(C.gold)]} /> : null}
      {red > 0 ? <Sk seed={seed + 2} opacity={red} items={[{ k: "path", d: glass(x, y, r), fill: "#D9826B", stroke: C.rust, width: 2.8 }, ...rays(C.rust)]} /> : null}
      <Sk seed={seed + 3} items={base} />
    </g>
  );
};

/** A row's desk: a long plank the students sit behind. */
export const Plank: React.FC<{ y: number; x0?: number; x1?: number; seed: number }> = ({ y, x0 = 78, x1 = 1002, seed }) => (
  <Sk seed={seed} items={[{ k: "path", d: roundRect(x0, y, x1 - x0, 15, 4), fill: C.goldTint, stroke: C.ink, width: 3, rough: 0.6 }]} />
);

/** The classroom window at the side of the grid. */
export const Window: React.FC<{ x: number; y: number; w: number; h: number; seed: number; night?: boolean }> = ({ x, y, w, h, seed, night }) => (
  <Sk
    seed={seed}
    items={[
      { k: "rect", x, y, w, h, fill: night ? C.oliveDeep : C.sageTint, stroke: C.ink, width: 3 },
      { k: "line", a: [x + w / 2, y], b: [x + w / 2, y + h], width: 2.4 },
      { k: "line", a: [x, y + h / 2], b: [x + w, y + h / 2], width: 2.4 },
      ...(night ? ([{ k: "circle", c: [x + w * 0.72, y + h * 0.26], d: Math.min(w, h) * 0.22, fill: C.goldTint, stroke: C.gold, width: 2 }] as Item[]) : []),
    ]}
  />
);

/** A ring that marks one student (gold), drawn around a head. [p] 0 → 1 draws it on. */
export const Ring: React.FC<{ x: number; y: number; d?: number; p: number; color?: string; seed: number }> = ({ x, y, d = 84, p, color = C.gold, seed }) =>
  p > 0 ? (
    <g opacity={Math.min(1, p * 1.6)}>
      <Sk seed={seed} items={[{ k: "arc", c: [x, y], w: d, h: d, start: -Math.PI / 2, stop: -Math.PI / 2 + Math.PI * 2 * Math.min(1, p), stroke: color, width: 5, rough: 0.7 }]} />
    </g>
  ) : null;

/** A tick (sage). */
export const Tick: React.FC<{ x: number; y: number; s?: number; p: number; seed: number }> = ({ x, y, s = 1, p, seed }) =>
  p > 0 ? (
    <Sk
      seed={seed}
      opacity={Math.min(1, p * 2)}
      items={[{ k: "linear", pts: [[x - 14 * s, y], [x - 4 * s, y + 11 * s], [x + 16 * s, y - 14 * s]], stroke: C.sageText, width: 5.5, rough: 0.5 }]}
    />
  ) : null;

/** A countdown ring with a label inside: [p] 0 → 1 fills it. */
export const Timer: React.FC<{ x: number; y: number; d?: number; p: number; seed: number; children?: React.ReactNode }> = ({ x, y, d = 92, p, seed }) => (
  <g>
    <Sk seed={seed} items={[{ k: "circle", c: [x, y], d, fill: C.sheet, stroke: C.ink, width: 3 }]} />
    {p > 0 ? (
      <Sk seed={seed + 1} items={[{ k: "arc", c: [x, y], w: d - 14, h: d - 14, start: -Math.PI / 2, stop: -Math.PI / 2 + Math.PI * 2 * Math.min(1, p), stroke: C.gold, width: 7, rough: 0.4 }]} />
    ) : null}
  </g>
);

/** A spider: a body, a head and eight bent legs. */
export const Spider: React.FC<{ x: number; y: number; s?: number; seed: number }> = ({ x, y, s = 1, seed }) => {
  const legs: Item[] = [];
  for (const side of [-1, 1]) {
    for (let i = 0; i < 4; i++) {
      const a = ((-50 + i * 32) * Math.PI) / 180;
      const knee: [number, number] = [x + side * Math.cos(a) * 52 * s, y - 34 * s + Math.sin(a) * 40 * s];
      const foot: [number, number] = [x + side * (Math.cos(a) * 78 * s + 12 * s), y + (8 + i * 12) * s];
      legs.push({ k: "linear", pts: [[x + side * 14 * s, y - 4 * s + i * 4 * s], knee, foot], width: 3.4 });
    }
  }
  return (
    <Sk
      seed={seed}
      items={[
        ...legs,
        { k: "ellipse", c: [x, y], w: 46 * s, h: 40 * s, fill: C.ink },
        { k: "circle", c: [x, y + 26 * s], d: 24 * s, fill: C.ink },
        { k: "line", a: [x, y - 20 * s], b: [x, y - 70 * s], width: 2, stroke: C.inkSubtle },
      ]}
    />
  );
};

/** The dallah, the Arabic coffee pot, standing on [y] at [x]: brass in gold. */
export const Dallah: React.FC<{ x: number; y: number; s?: number; seed: number }> = ({ x, y, s = 1, seed }) => {
  const P = (px: number, py: number) => `${x + px * s},${y + py * s}`;
  return (
    <Sk
      seed={seed}
      items={[
        { k: "path", d: `M${P(14, -30)} C${P(40, -40)} ${P(46, -74)} ${P(66, -90)} L${P(60, -95)} C${P(38, -80)} ${P(34, -52)} ${P(12, -42)} Z`, fill: C.goldTint, stroke: C.goldText, width: 3 },
        { k: "path", d: `M${P(-24, -4)} C${P(-32, -32)} ${P(-15, -48)} ${P(-12, -58)} L${P(12, -58)} C${P(15, -48)} ${P(32, -32)} ${P(24, -4)} Z`, fill: C.goldTint, stroke: C.goldText, width: 3 },
        { k: "ellipse", c: [x, y - 3 * s], w: 50 * s, h: 11 * s, fill: C.goldTint, stroke: C.goldText, width: 3 },
        { k: "path", d: `M${P(-12, -58)} L${P(-9, -76)} L${P(9, -76)} L${P(12, -58)} Z`, fill: C.goldTint, stroke: C.goldText, width: 3 },
        { k: "path", d: `M${P(-15, -76)} Q${P(0, -96)} ${P(15, -76)} Z`, fill: C.gold, stroke: C.goldText, width: 3 },
        { k: "circle", c: [x, y - 100 * s], d: 9 * s, fill: C.gold, stroke: C.goldText, width: 2 },
        { k: "path", d: `M${P(-12, -66)} C${P(-44, -66)} ${P(-48, -30)} ${P(-24, -16)}`, stroke: C.goldText, width: 4 },
      ]}
    />
  );
};

/** A small coffee cup (finjan). */
export const Finjan: React.FC<{ x: number; y: number; seed: number }> = ({ x, y, seed }) => (
  <Sk seed={seed} items={[{ k: "path", d: `M${x - 11},${y - 16} L${x + 11},${y - 16} L${x + 7},${y} L${x - 7},${y} Z`, fill: C.sheet, stroke: C.goldText, width: 2.6 }]} />
);

/** A wrapped gift. */
export const Gift: React.FC<{ x: number; y: number; seed: number }> = ({ x, y, seed }) => (
  <Sk
    seed={seed}
    items={[
      { k: "rect", x: x - 34, y: y - 26, w: 68, h: 52, fill: C.goldTint, stroke: C.ink, width: 3 },
      { k: "rect", x: x - 40, y: y - 40, w: 80, h: 16, fill: C.goldTint, stroke: C.ink, width: 3 },
      { k: "line", a: [x, y - 40], b: [x, y + 26], stroke: C.gold, width: 6 },
      { k: "path", d: `M${x},${y - 40} C${x - 26},${y - 66} ${x - 34},${y - 40} ${x},${y - 40} C${x + 34},${y - 40} ${x + 26},${y - 66} ${x},${y - 40}`, stroke: C.gold, width: 4 },
    ]}
  />
);

/** A sprung trap, crossed out when [crossed] > 0. */
export const Trap: React.FC<{ x: number; y: number; crossed: number; seed: number }> = ({ x, y, crossed, seed }) => (
  <g>
    <Sk
      seed={seed}
      items={[
        { k: "rect", x: x - 42, y: y + 6, w: 84, h: 18, fill: C.surface, stroke: C.ink, width: 3 },
        { k: "path", d: `M${x - 34},${y + 6} Q${x},${y - 46} ${x + 34},${y + 6}`, stroke: C.ink, width: 3 },
        { k: "line", a: [x - 22, y - 6], b: [x + 22, y - 6], stroke: C.inkSubtle, width: 2.4 },
      ]}
    />
    {crossed > 0 ? (
      <Sk
        seed={seed + 1}
        opacity={Math.min(1, crossed * 2)}
        items={[
          { k: "line", a: [x - 52, y - 40], b: [x - 52 + 104 * Math.min(1, crossed * 2), y - 40 + 76 * Math.min(1, crossed * 2)], stroke: C.rust, width: 6 },
          ...(crossed > 0.5 ? ([{ k: "line", a: [x + 52, y - 40], b: [x + 52 - 104 * Math.min(1, (crossed - 0.5) * 2), y - 40 + 76 * Math.min(1, (crossed - 0.5) * 2)], stroke: C.rust, width: 6 }] as Item[]) : []),
        ]}
      />
    ) : null}
  </g>
);

/** A desk lamp standing on [y], its shade facing left and a cone of light when [lit]. */
export const Lamp: React.FC<{ x: number; y: number; seed: number }> = ({ x, y, seed }) => (
  <g>
    <path d={`M${x - 52},${y - 118} L${x - 170},${y} L${x + 10},${y} Z`} fill={C.goldTint} opacity={0.65} />
    <Sk
      seed={seed}
      items={[
        { k: "ellipse", c: [x, y - 4], w: 64, h: 12, fill: C.ink },
        { k: "linear", pts: [[x, y - 6], [x + 22, y - 82], [x - 18, y - 128]], width: 4 },
        { k: "path", d: `M${x - 18},${y - 128} L${x - 70},${y - 112} L${x - 40},${y - 150} Z`, fill: C.gold, stroke: C.goldText, width: 3 },
      ]}
    />
  </g>
);
