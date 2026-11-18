// Thursday at the cinema: a dark hall, the film that never stops (a ball bouncing to its end), rows of seats, a phone
// that lights up, a boy kicking a seat, and the usher who fixes it with a whisper; then the intervention ladder.
import { C, TEXT } from "../brand";
import { Kid, ManHead } from "../components/People";
import { Sk, roundRect } from "../components/Sketch";
import { At } from "../components/Words";

export const SCREEN = { x: 140, y: 390, w: 800, h: 300 };
const ROWS = [835, 985, 1135];
const LEFT = [95, 205, 315, 425, 535, 645];
const RIGHT = [880, 990];
export const FAHD_SEAT = { x: 425, row: 2 };
export const NEPHEW_SEAT = { x: 535, row: 2 };
export const PHONE_SEAT = { x: 205, row: 1 };
export const KICKER_SEAT = { x: 645, row: 1 };
export const AISLE_X = 790;

/** The hall's dark, and the screen with the film: a ball that bounces across in [film] 0 → 1, and a progress line. */
export const Hall: React.FC<{ film: number; seed: number }> = ({ film, seed }) => {
  const bx = SCREEN.x + 70 + (SCREEN.w - 140) * ((film * 3) % 1);
  const by = SCREEN.y + SCREEN.h - 70 - Math.abs(Math.sin(film * Math.PI * 9)) * 150;
  return (
    <g>
      <rect x={0} y={330} width={1080} height={980} fill={C.oliveDeep} />
      <Sk
        seed={seed}
        items={[
          { k: "rect", x: SCREEN.x, y: SCREEN.y, w: SCREEN.w, h: SCREEN.h, fill: C.paper, stroke: C.gold, width: 6 },
          { k: "line", a: [SCREEN.x + 20, SCREEN.y + SCREEN.h - 30], b: [SCREEN.x + SCREEN.w - 20, SCREEN.y + SCREEN.h - 30], stroke: C.sage, width: 5 },
        ]}
      />
      <Sk
        seed={seed + 1}
        items={[
          { k: "circle", c: [bx, by], d: 46, fill: C.gold, stroke: C.goldText, width: 3 },
          { k: "circle", c: [bx - 7, by - 4], d: 5, fill: C.ink, width: 1 },
          { k: "circle", c: [bx + 7, by - 4], d: 5, fill: C.ink, width: 1 },
          { k: "path", d: `M${bx - 8},${by + 6} Q${bx},${by + 13} ${bx + 8},${by + 6}`, width: 2.4 },
          { k: "path", d: `M${SCREEN.x + SCREEN.w - 70},${SCREEN.y + 60} l0,-26 l14,-4 l0,26`, stroke: C.olive, width: 3 },
          { k: "circle", c: [SCREEN.x + SCREEN.w - 74, SCREEN.y + 62], d: 10, fill: C.olive, stroke: C.olive, width: 1 },
        ]}
      />
    </g>
  );
};

/** One seat back, drawn in front of whoever sits in it. */
const seat = (x: number, y: number): { k: "path"; d: string; fill: string; stroke: string; width: number } => ({ k: "path", d: roundRect(x - 48, y, 96, 76, 14), fill: C.rust, stroke: C.ink, width: 3 });

/** The audience, row by row: silhouettes, Fahd and his nephew in the last row, the phone and the kicker. */
export const Rows: React.FC<{ phone: number; kick: number; fahdMood: "smile" | "o" | "happy"; tick: number; seed: number }> = ({ phone, kick, fahdMood, tick, seed }) => {
  const kickX = KICKER_SEAT.x;
  const front = ROWS[KICKER_SEAT.row - 1];
  const swing = kick > 0 ? Math.sin(tick * 1.4) * 10 * kick : 0;
  return (
    <g>
      {ROWS.map((y, row) => (
        <g key={row}>
          {[...LEFT, ...RIGHT].map((x) => {
            if (row === FAHD_SEAT.row && x === FAHD_SEAT.x) return <ManHead key={x} x={x} y={y - 44} r={26} mood={fahdMood} seed={seed + 50} />;
            if (row === NEPHEW_SEAT.row && x === NEPHEW_SEAT.x) return <Kid key={x} x={x} y={y - 34} r={24} kind="kufi" mood="happy" seed={seed + 60} />;
            if ((x + row * 7) % 4 === 1 && row !== 2) return null;
            return <Sk key={x} seed={seed + x + row} items={[{ k: "circle", c: [x, y - 14], d: 44, fill: C.inkMuted, stroke: C.inkSubtle, width: 2.4 }]} />;
          })}
          {row === PHONE_SEAT.row && phone > 0 ? (
            <g opacity={phone}>
              <circle cx={PHONE_SEAT.x} cy={y - 50} r={46} fill={C.sageTint} opacity={0.45} />
              <Sk seed={seed + 70} items={[{ k: "rect", x: PHONE_SEAT.x - 13, y: y - 70, w: 26, h: 40, fill: C.sheet, stroke: C.ink, width: 2.4 }]} />
            </g>
          ) : null}
          <Sk seed={seed + 100 + row} still items={[...LEFT, ...RIGHT].map((x) => seat(x, y))} />
          {row === KICKER_SEAT.row && kick > 0 ? (
            <g opacity={kick}>
              <Sk
                seed={seed + 80}
                items={[
                  { k: "linear", pts: [[kickX + 18, y + 26], [kickX + 46, y - 34 + swing], [kickX + 28, front + 70 + swing]], stroke: C.surface, width: 5 },
                  { k: "ellipse", c: [kickX + 26, front + 72 + swing], w: 22, h: 12, fill: C.surface, stroke: C.surface, width: 2 },
                  { k: "arc", c: [kickX + 30, front + 80], w: 54, h: 30, start: Math.PI * 0.15, stop: Math.PI * 0.7, stroke: C.goldTint, width: 3 },
                ]}
              />
            </g>
          ) : null}
        </g>
      ))}
    </g>
  );
};

/** The usher with his cap and torch, walking down the aisle to [x] by [walk] 0 → 1; the torch lights the kicker. */
export const Usher: React.FC<{ walk: number; torch: number; seed: number }> = ({ walk, torch, seed }) => {
  if (walk <= 0) return null;
  const x = 1120 - (1120 - AISLE_X) * walk;
  const y = 1240;
  const head: [number, number] = [x, y - 210];
  return (
    <g>
      {torch > 0 ? <path d={`M${x - 30},${y - 140} L${KICKER_SEAT.x + 60},${ROWS[KICKER_SEAT.row] - 30} L${KICKER_SEAT.x + 40},${ROWS[KICKER_SEAT.row] + 90} Z`} fill={C.goldTint} opacity={0.4 * torch} /> : null}
      <Sk
        seed={seed}
        items={[
          { k: "path", d: `M${x - 18},${y - 180} L${x - 30},${y - 10} L${x + 30},${y - 10} L${x + 18},${y - 180} Z`, fill: C.olive, stroke: C.ink, width: 3 },
          { k: "linear", pts: [[x - 18, y - 168], [x - 30, y - 150], [x - 34, y - 142]], width: 3 },
          { k: "rect", x: x - 46, y: y - 150, w: 18, h: 12, fill: C.ink, width: 2 },
          { k: "linear", pts: [[x + 18, y - 168], [x + 26, y - 120], [x + 22, y - 90]], width: 3 },
          { k: "circle", c: head, d: 52, fill: C.sheet, width: 3 },
          { k: "path", d: `M${x - 27},${y - 214} Q${x},${y - 252} ${x + 27},${y - 214} L${x - 40},${y - 210} Z`, fill: C.rust, stroke: C.ink, width: 2.6 },
          { k: "circle", c: [x - 8, y - 206], d: 5.5, fill: C.ink, width: 1 },
          { k: "circle", c: [x + 8, y - 206], d: 5.5, fill: C.ink, width: 1 },
          { k: "path", d: `M${x - 7},${y - 194} Q${x},${y - 189} ${x + 7},${y - 194}`, width: 2.4 },
          { k: "line", a: [x - 10, y - 8], b: [x - 14, y], width: 3 },
          { k: "line", a: [x + 10, y - 8], b: [x + 14, y], width: 3 },
        ]}
      />
    </g>
  );
};
export const usherHead = (walk: number): [number, number] => [1120 - (1120 - AISLE_X) * walk, 1030];

/** The intervention ladder, large, on a card over the dimmed hall: six rungs from the lightest at the bottom to the
 *  heaviest at the top, each named as it appears ([shown] counts them), and the rung to stay on marked. */
const RUNGS = [
  { text: "نظرة · لمسة", color: C.sageText },
  { text: "«يلا الكل…»", color: C.sageText },
  { text: "«باقي اثنين…»", color: C.olive },
  { text: "همسة", color: C.olive },
  { text: "تصحيح سريع وكمّل", color: C.goldText },
  { text: "عاقبة", color: C.rust },
];
const RUNG_Y = [1160, 1040, 920, 800, 680, 560];
export const LadderCard: React.FC<{ open: number; shown: number; mark: number; seed: number }> = ({ open, shown, mark, seed }) =>
  open > 0 ? (
    <g opacity={open}>
      <rect x={0} y={330} width={1080} height={980} fill={C.ink} opacity={0.35} />
      <Sk seed={seed} items={[{ k: "rect", x: 150, y: 380, w: 780, h: 880, fill: C.sheet, stroke: C.olive, width: 4 }]} />
      <Sk
        seed={seed + 1}
        items={[
          { k: "line", a: [780, 500], b: [780, 1220], stroke: C.goldText, width: 6 },
          { k: "line", a: [880, 500], b: [880, 1220], stroke: C.goldText, width: 6 },
          ...RUNG_Y.map((y, i) => ({ k: "line" as const, a: [780, y] as [number, number], b: [880, y] as [number, number], stroke: i < shown ? C.goldText : C.hairline, width: 6 })),
          ...(mark > 0 ? [{ k: "circle" as const, c: [830, RUNG_Y[0]] as [number, number], d: 30 * mark, fill: C.sage, stroke: C.sageText, width: 2.4 }] : []),
        ]}
      />
    </g>
  ) : null;
export const LadderLabels: React.FC<{ open: number; shown: number }> = ({ open, shown }) =>
  open > 0 ? (
    <>
      <At x={450} y={440} style={{ opacity: open }}>
        <span style={{ fontFamily: TEXT, fontWeight: 700, fontSize: 44, color: C.olive }}>سلّم التدخّل</span>
      </At>
      {RUNGS.map((r, i) => (
        <At key={r.text} x={750} y={RUNG_Y[i]} anchor="right" style={{ opacity: Math.min(open, Math.max(0, Math.min(1, shown - i))) }}>
          <span style={{ fontFamily: TEXT, fontWeight: 600, fontSize: 40, color: r.color }}>{r.text}</span>
        </At>
      ))}
    </>
  ) : null;
