// The people of the classroom stories, drawn as stick figures with Saudi dress: boys in thobes (some in a white
// kufi), the teacher in a thobe and a red-checked shemagh with an iqal, the grandfather in a white ghutra, a beige
// bisht with gold trim and a grey beard. Coordinates are in the full 1080 × 1920 frame.
import { C } from "../brand";
import { type Ink, type Pt, type Shape, Sk } from "./Sketch";

type Item = Shape & Ink;
export type Mood = "smile" | "flat" | "worried" | "happy" | "o";
export type Hair = "short" | "kufi" | "spiky" | "side" | "buzz" | "pigtails";

/** A face on a head of radius [r] centred at (x, y). */
function face(x: number, y: number, r: number, mood: Mood, glasses = false): Item[] {
  const k = r / 31;
  const eyes: Item[] = [
    { k: "circle", c: [x - 10 * k, y - 3 * k], d: 6.5 * k, fill: C.ink, width: 1.5 },
    { k: "circle", c: [x + 10 * k, y - 3 * k], d: 6.5 * k, fill: C.ink, width: 1.5 },
  ];
  const mouth: Record<Mood, Item[]> = {
    smile: [{ k: "path", d: `M${x - 11 * k},${y + 10 * k} Q${x},${y + 19 * k} ${x + 11 * k},${y + 10 * k}`, width: 3 }],
    flat: [{ k: "line", a: [x - 8 * k, y + 13 * k], b: [x + 8 * k, y + 13 * k], width: 3 }],
    worried: [
      { k: "path", d: `M${x - 10 * k},${y + 16 * k} Q${x},${y + 8 * k} ${x + 10 * k},${y + 16 * k}`, width: 3 },
      { k: "line", a: [x - 16 * k, y - 14 * k], b: [x - 5 * k, y - 11 * k], width: 2.6 },
      { k: "line", a: [x + 16 * k, y - 14 * k], b: [x + 5 * k, y - 11 * k], width: 2.6 },
    ],
    happy: [{ k: "path", d: `M${x - 13 * k},${y + 8 * k} Q${x},${y + 26 * k} ${x + 13 * k},${y + 8 * k} Z`, fill: C.ink, width: 2.6 }],
    o: [{ k: "circle", c: [x, y + 13 * k], d: 9 * k, width: 2.6 }],
  };
  const specs: Item[] = glasses
    ? [
        { k: "circle", c: [x - 10 * k, y - 3 * k], d: 17 * k, width: 2.4 },
        { k: "circle", c: [x + 10 * k, y - 3 * k], d: 17 * k, width: 2.4 },
        { k: "line", a: [x - 2 * k, y - 4 * k], b: [x + 2 * k, y - 4 * k], width: 2.4 },
      ]
    : [];
  return [...eyes, ...specs, ...mouth[mood]];
}

/** Hair or a cap on a head of radius [r] at (x, y): drawn after the head so it sits on it. */
function hair(x: number, y: number, r: number, kind: Hair): Item[] {
  const k = r / 31;
  const P = (px: number, py: number) => `${x + px * k},${y + py * k}`;
  switch (kind) {
    case "short":
      return [{ k: "path", d: `M${P(-30, -6)} C${P(-32, -30)} ${P(-12, -38)} ${P(0, -37)} C${P(14, -38)} ${P(32, -30)} ${P(30, -6)} C${P(22, -20)} ${P(8, -22)} ${P(0, -19)} C${P(-8, -22)} ${P(-22, -20)} ${P(-30, -6)} Z`, fill: C.ink, width: 2 }];
    case "side":
      return [{ k: "path", d: `M${P(-30, -4)} C${P(-34, -32)} ${P(-6, -42)} ${P(6, -36)} C${P(22, -38)} ${P(34, -26)} ${P(30, -4)} C${P(26, -18)} ${P(14, -26)} ${P(6, -24)} L${P(-4, -14)} C${P(-14, -22)} ${P(-24, -16)} ${P(-30, -4)} Z`, fill: C.ink, width: 2 }];
    case "kufi":
      return [
        { k: "path", d: `M${P(-30, -10)} C${P(-29, -40)} ${P(29, -40)} ${P(30, -10)} Z`, fill: C.sheet, stroke: C.ink, width: 2.8 },
        { k: "line", a: [x - 22 * k, y - 18 * k], b: [x + 22 * k, y - 18 * k], stroke: C.inkFaint, width: 1.8 },
      ];
    case "spiky":
      return [
        {
          k: "linear",
          pts: [
            [x - 26 * k, y - 16 * k],
            [x - 20 * k, y - 40 * k],
            [x - 10 * k, y - 26 * k],
            [x - 2 * k, y - 46 * k],
            [x + 6 * k, y - 27 * k],
            [x + 18 * k, y - 42 * k],
            [x + 24 * k, y - 22 * k],
          ],
          width: 3.2,
        },
      ];
    case "buzz":
      return [{ k: "arc", c: [x, y], w: 62 * k, h: 62 * k, start: Math.PI * 1.08, stop: Math.PI * 1.92, stroke: C.inkMuted, width: 7 }];
    case "pigtails":
      return [
        { k: "path", d: `M${P(-30, -2)} C${P(-34, -34)} ${P(34, -34)} ${P(30, -2)} C${P(18, -20)} ${P(-18, -20)} ${P(-30, -2)} Z`, fill: C.ink, width: 2 },
        { k: "circle", c: [x - 36 * k, y - 4 * k], d: 22 * k, fill: C.ink, width: 2 },
        { k: "circle", c: [x + 36 * k, y - 4 * k], d: 22 * k, fill: C.ink, width: 2 },
      ];
  }
}

/** A student behind a desk, seen from the head up: head at (x, y), a thobe collar below, an arm that rises. */
export const Kid: React.FC<{ x: number; y: number; r?: number; mood?: Mood; kind?: Hair; glasses?: boolean; hand?: number; seed: number }> = ({
  x,
  y,
  r = 31,
  mood = "smile",
  kind = "short",
  glasses = false,
  hand = 0,
  seed,
}) => {
  const items: Item[] = [];
  if (hand > 0) {
    const tip: Pt = [x + (36 + 12 * hand) * (r / 31), y + (44 - 90 * hand) * (r / 31)];
    items.push({ k: "line", a: [x + 26 * (r / 31), y + 44 * (r / 31)], b: tip, width: 3.4 });
    items.push({ k: "circle", c: tip, d: 15 * (r / 31), fill: C.sheet, width: 2.8 });
  }
  items.push({ k: "linear", pts: [[x - 12, y + r - 1], [x, y + r + 12], [x + 12, y + r - 1]], width: 2.6 });
  items.push({ k: "circle", c: [x, y], d: 2 * r, fill: C.sheet, width: 3 });
  items.push(...hair(x, y, r, kind), ...face(x, y, r, mood, glasses));
  return <Sk seed={seed} items={items} />;
};

/** A headdress around a head of radius [r] at (x, y): shemagh (red checks) or ghutra (white), with the iqal. Drawn
 *  before the face so the face sits inside it; the iqal goes on after. */
function headdressBack(x: number, y: number, r: number, red: boolean): Item[] {
  const k = r / 25;
  const P = (px: number, py: number) => `${x + px * k},${y + py * k}`;
  const d = `M${P(-36, 54)} C${P(-40, 10)} ${P(-38, -28)} ${P(0, -36)} C${P(38, -28)} ${P(40, 10)} ${P(36, 54)} L${P(18, 34)} L${P(-18, 34)} Z`;
  return [{ k: "path", d, fill: C.sheet, stroke: C.ink, width: 3 }, ...(red ? ([{ k: "path", d, fill: C.rust, fillStyle: "cross-hatch", gap: 8.5 * k, fillWeight: 1.5, stroke: "none", width: 0.1 }] as Item[]) : [])];
}
function iqal(x: number, y: number, r: number): Item[] {
  const k = r / 25;
  return [
    { k: "ellipse", c: [x, y - 25 * k], w: 50 * k, h: 11 * k, stroke: C.ink, width: 4.2 },
    { k: "ellipse", c: [x, y - 19 * k], w: 54 * k, h: 12 * k, stroke: C.ink, width: 4.2 },
  ];
}

/** An adult's face: eyes, a mustache, a smile and a short beard. */
function manFace(x: number, y: number, r: number, mood: "smile" | "o" | "happy", grey = false): Item[] {
  const k = r / 25;
  const items: Item[] = [
    { k: "circle", c: [x - 8 * k, y - 3 * k], d: 5.5 * k, fill: C.ink, width: 1.4 },
    { k: "circle", c: [x + 8 * k, y - 3 * k], d: 5.5 * k, fill: C.ink, width: 1.4 },
  ];
  if (grey) {
    items.push({
      k: "path",
      d: `M${x - 22 * k},${y + 2 * k} C${x - 24 * k},${y + 34 * k} ${x - 8 * k},${y + 44 * k} ${x},${y + 46 * k} C${x + 8 * k},${y + 44 * k} ${x + 24 * k},${y + 34 * k} ${x + 22 * k},${y + 2 * k} C${x + 12 * k},${y + 14 * k} ${x - 12 * k},${y + 14 * k} ${x - 22 * k},${y + 2 * k} Z`,
      fill: C.hairline,
      stroke: C.inkSubtle,
      width: 2.4,
    });
  } else {
    items.push({ k: "arc", c: [x, y + 2 * k], w: 44 * k, h: 44 * k, start: Math.PI * 0.12, stop: Math.PI * 0.88, stroke: C.inkMuted, width: 3.4 });
  }
  items.push({ k: "path", d: `M${x - 10 * k},${y + 9 * k} Q${x},${y + 5 * k} ${x + 10 * k},${y + 9 * k}`, stroke: grey ? C.inkSubtle : C.ink, width: 4 });
  if (mood === "o") items.push({ k: "circle", c: [x, y + 16 * k], d: 8 * k, width: 2.4 });
  else if (mood === "happy") items.push({ k: "path", d: `M${x - 9 * k},${y + 13 * k} Q${x},${y + 24 * k} ${x + 9 * k},${y + 13 * k} Z`, fill: C.ink, width: 2.2 });
  else items.push({ k: "path", d: `M${x - 7 * k},${y + 14 * k} Q${x},${y + 20 * k} ${x + 7 * k},${y + 14 * k}`, width: 2.6 });
  return items;
}

export type Pose = "rest" | "point" | "ask" | "hip" | "write";

/** The teacher standing on (x, y): thobe, shemagh and iqal; [s] scales him, [pose] places his arms. */
export const Teacher: React.FC<{ x: number; y: number; s?: number; pose?: Pose; mood?: "smile" | "o" | "happy"; seed: number }> = ({ x, y, s = 1, pose = "rest", mood = "smile", seed }) => {
  const P = (px: number, py: number): Pt => [x + px * s, y + py * s];
  const head: Pt = P(0, -180);
  const r = 25 * s;
  const arms: Record<Pose, Pt[][]> = {
    rest: [
      [P(-22, -138), P(-30, -96), P(-27, -62)],
      [P(22, -138), P(30, -96), P(27, -62)],
    ],
    point: [
      [P(-22, -138), P(-58, -122), P(-92, -130)],
      [P(22, -138), P(30, -96), P(27, -62)],
    ],
    ask: [
      [P(-22, -138), P(-48, -150), P(-58, -186)],
      [P(22, -138), P(30, -96), P(27, -62)],
    ],
    hip: [
      [P(-22, -138), P(-44, -108), P(-24, -84)],
      [P(22, -138), P(44, -108), P(24, -84)],
    ],
    write: [
      [P(-22, -138), P(-48, -104), P(-82, -70)],
      [P(22, -138), P(30, -96), P(27, -62)],
    ],
  };
  const body: Item[] = [
    ...arms[pose].map((pts): Item => ({ k: "linear", pts, width: 3.2 })),
    { k: "ellipse", c: P(-11, -4), w: 18 * s, h: 7 * s, fill: C.ink, width: 1 },
    { k: "ellipse", c: P(11, -4), w: 18 * s, h: 7 * s, fill: C.ink, width: 1 },
    { k: "path", d: `M${P(-14, -152)} L${P(-25, -140)} L${P(-31, -8)} L${P(31, -8)} L${P(25, -140)} L${P(14, -152)} Z`, fill: C.sheet, width: 3 },
    { k: "line", a: P(0, -148), b: P(0, -110), stroke: C.inkFaint, width: 2.2 },
  ];
  return (
    <g>
      <Sk seed={seed} items={body} />
      <Sk seed={seed + 1} items={[...headdressBack(head[0], head[1], r, true), { k: "circle", c: head, d: 2 * r, fill: C.sheet, width: 3 }, ...manFace(head[0], head[1], r, mood), ...iqal(head[0], head[1], r)]} />
    </g>
  );
};

/** Someone sitting cross-legged on the floor at (x, y). [who] sets the dress: the grandfather (ghutra, bisht, grey
 *  beard), the teacher (shemagh), a boy (thobe) or a girl (a dress and pigtails). */
export const Sitting: React.FC<{
  x: number;
  y: number;
  who: "grandpa" | "teacher" | "boy" | "girl";
  kind?: Hair;
  mood?: Mood;
  arms?: "lap" | "up" | "cup" | "point";
  seed: number;
}> = ({ x, y, who, kind = "short", mood = "smile", arms = "lap", seed }) => {
  const adult = who === "grandpa" || who === "teacher";
  const s = adult ? 1 : 0.78;
  const P = (px: number, py: number): Pt => [x + px * s, y + py * s];
  const r = adult ? 25 : 31 * 0.78;
  const head: Pt = adult ? P(0, -150) : P(0, -138);
  const robe = who === "girl" ? C.goldSoft : C.sheet;
  const items: Item[] = [];
  const lap: Pt[][] = [
    [P(-24, -108), P(-30, -66), P(-6, -48)],
    [P(24, -108), P(30, -66), P(6, -48)],
  ];
  const armSets: Record<string, Pt[][]> = {
    lap,
    up: [
      [P(-24, -108), P(-46, -150), P(-50, -196)],
      [P(24, -108), P(46, -150), P(50, -196)],
    ],
    cup: [
      [P(-24, -108), P(-30, -66), P(-6, -48)],
      [P(24, -108), P(48, -84), P(70, -96)],
    ],
    point: [
      [P(-24, -108), P(-56, -118), P(-86, -132)],
      [P(24, -108), P(30, -66), P(6, -48)],
    ],
  };
  items.push({ k: "path", d: `M${P(-62, -6)} Q${P(0, -46)} ${P(62, -6)} Q${P(0, 14)} ${P(-62, -6)} Z`, fill: robe, width: 3 });
  if (who === "grandpa") {
    items.push({ k: "path", d: `M${P(-16, -120)} L${P(-36, -112)} L${P(-58, -14)} L${P(58, -14)} L${P(36, -112)} L${P(16, -120)} Z`, fill: C.goldTint, width: 3 });
    items.push({ k: "path", d: `M${P(-13, -120)} L${P(13, -120)} L${P(20, -16)} L${P(-20, -16)} Z`, fill: C.sheet, stroke: C.ink, width: 2.4 });
    items.push({ k: "line", a: P(-13, -120), b: P(-20, -16), stroke: C.gold, width: 4.5 });
    items.push({ k: "line", a: P(13, -120), b: P(20, -16), stroke: C.gold, width: 4.5 });
  } else {
    items.push({ k: "path", d: `M${P(-14, -122)} L${P(-26, -112)} L${P(-40, -14)} L${P(40, -14)} L${P(26, -112)} L${P(14, -122)} Z`, fill: robe, width: 3 });
  }
  items.push(...armSets[arms].map((pts): Item => ({ k: "linear", pts, width: 3.2 })));
  if (arms === "up") {
    for (const side of [-1, 1]) {
      const [hx, hy] = P(side * 50, -196);
      const n = side < 0 ? 5 : 3;
      for (let i = 0; i < n; i++) {
        const a = (-90 + (i - (n - 1) / 2) * 22) * (Math.PI / 180);
        items.push({ k: "line", a: [hx, hy], b: [hx + Math.cos(a) * 18, hy + Math.sin(a) * 18], width: 2.6 });
      }
    }
  }
  const headItems: Item[] = adult
    ? [...headdressBack(head[0], head[1], r, who === "teacher"), { k: "circle", c: head, d: 2 * r, fill: C.sheet, width: 3 }, ...manFace(head[0], head[1], r, mood === "o" ? "o" : mood === "happy" ? "happy" : "smile", who === "grandpa"), ...iqal(head[0], head[1], r)]
    : [{ k: "circle", c: head, d: 2 * r, fill: C.sheet, width: 3 }, ...hair(head[0], head[1], r, who === "girl" ? "pigtails" : kind), ...face(head[0], head[1], r, mood)];
  return (
    <g>
      <Sk seed={seed} items={items} />
      <Sk seed={seed + 1} items={headItems} />
    </g>
  );
};

/** A student standing on (x, y) in a thobe, one hand raised by [hand] 0 → 1; [s] scales him. */
export const StandingKid: React.FC<{ x: number; y: number; s?: number; kind?: Hair; mood?: Mood; hand?: number; seed: number }> = ({ x, y, s = 1, kind = "spiky", mood = "happy", hand = 1, seed }) => {
  const P = (px: number, py: number): Pt => [x + px * s, y + py * s];
  const r = 34 * s;
  const head = P(0, -196);
  const raised = P(-22 - 30 * hand, -150 - 120 * hand);
  const items: Item[] = [
    { k: "ellipse", c: P(-12, -4), w: 20 * s, h: 8 * s, fill: C.ink, width: 1 },
    { k: "ellipse", c: P(12, -4), w: 20 * s, h: 8 * s, fill: C.ink, width: 1 },
    { k: "path", d: `M${P(-14, -160)} L${P(-26, -148)} L${P(-34, -8)} L${P(34, -8)} L${P(26, -148)} L${P(14, -160)} Z`, fill: C.sheet, width: 3 },
    { k: "line", a: P(0, -156), b: P(0, -120), stroke: C.inkFaint, width: 2.2 },
    { k: "linear", pts: [P(24, -146), P(32, -100), P(28, -66)], width: 3.2 },
    { k: "linear", pts: [P(-24, -146), P(-34 - 8 * hand, -150 - 40 * hand), raised], width: 3.2 },
    { k: "circle", c: raised, d: 17 * s, fill: C.sheet, width: 2.8 },
    { k: "circle", c: head, d: 2 * r, fill: C.sheet, width: 3 },
    ...hair(head[0], head[1], r, kind),
    ...face(head[0], head[1], r, mood),
  ];
  return <Sk seed={seed} items={items} />;
};

/** Where a sitting figure's head is, for bulbs and labels. */
export const sittingHead = (x: number, y: number, who: "grandpa" | "teacher" | "boy" | "girl"): Pt => (who === "grandpa" || who === "teacher" ? [x, y - 150] : [x, y - 138 * 0.78]);
