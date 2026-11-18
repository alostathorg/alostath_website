// The classroom of «أخفّ تدخّل», seen from the side: the board with the pizza to share, the lesson's player badge
// («الدرس شغّال» with its progress, or «الدرس واقف» with the time it has stood still), five students at their desks, the
// teacher, and the spotlight that dims the class when he stops for one student.
import { C, MONO, TEXT } from "../brand";
import { type Mood, type SeatArms, SeatedKid, seatedHead, type Hair } from "../components/People";
import { Box, Sk } from "../components/Sketch";
import { At, rich } from "../components/Words";

export const FLOOR = 1250;
export const BOARD = { x: 150, y: 360, w: 710, h: 180 };
export const PIZZA = { x: 748, y: 450, d: 132 };

/** The five students, right to left: their seat, their look. */
export const KIDS = {
  faisal: { x: 820, kind: "side" as Hair, glasses: true },
  saud: { x: 670, kind: "short" as Hair, glasses: false },
  abdullah: { x: 520, kind: "spiky" as Hair, glasses: false },
  turki: { x: 370, kind: "kufi" as Hair, glasses: false },
  majed: { x: 220, kind: "buzz" as Hair, glasses: false },
};
export type KidId = keyof typeof KIDS;
export type KidPose = { mood?: Mood; lean?: number; down?: number; arms?: SeatArms };

/** The pizza on the board, cut along [cut] 0 → 1 slices (eight cuts, drawn one after another), with a slice lifted
 *  out by [served] 0 → 1. */
export const Pizza: React.FC<{ cut: number; served?: number; seed: number }> = ({ cut, served = 0, seed }) => {
  const { x, y, d } = PIZZA;
  const toppings: [number, number][] = [
    [-30, -22],
    [18, -34],
    [34, 4],
    [-8, 6],
    [-34, 22],
    [14, 30],
    [-14, -40],
  ];
  const cuts = Math.round(cut * 4 * 100) / 100;
  const lines = [0, 1, 2, 3].flatMap((i) => {
    const p = Math.min(1, Math.max(0, cuts - i));
    if (p <= 0) return [];
    const a = (i * Math.PI) / 4;
    const r = (d / 2) * p;
    return [{ k: "line" as const, a: [x - Math.cos(a) * r, y - Math.sin(a) * r] as [number, number], b: [x + Math.cos(a) * r, y + Math.sin(a) * r] as [number, number], stroke: C.goldText, width: 3 }];
  });
  const sx = served * 26;
  const sy = -served * 30;
  return (
    <g>
      <Sk seed={seed} items={[{ k: "circle", c: [x, y], d, fill: C.gold, stroke: C.goldText, width: 3 }, { k: "circle", c: [x, y], d: d - 18, fill: C.goldTint, stroke: C.goldText, width: 2 }]} />
      <Sk seed={seed + 1} still items={toppings.map(([tx, ty]) => ({ k: "circle" as const, c: [x + tx, y + ty] as [number, number], d: 15, fill: C.rust, stroke: C.rust, width: 1.5 }))} />
      <Sk seed={seed + 2} items={lines} />
      {served > 0 ? (
        <Sk
          seed={seed + 3}
          items={[{ k: "path", d: `M${x + sx},${y + sy} L${x + sx + d / 2},${y + sy} A${d / 2},${d / 2} 0 0 0 ${x + sx + (d / 2) * Math.cos(Math.PI / 4)},${y + sy - (d / 2) * Math.sin(Math.PI / 4)} Z`, fill: C.goldTint, stroke: C.goldText, width: 3 }]}
        />
      ) : null}
    </g>
  );
};

/** The board: olive, framed in wood, with the sum to solve and the pizza. */
export const Board: React.FC<{ cut: number; served?: number }> = ({ cut, served }) => (
  <g>
    <Sk seed={500} items={[{ k: "rect", x: BOARD.x, y: BOARD.y, w: BOARD.w, h: BOARD.h, fill: C.olive, stroke: C.goldText, width: 7 }]} />
    <Pizza cut={cut} served={served} seed={510} />
  </g>
);

/** The sum on the board, in chalk. */
export const BoardText: React.FC = () => (
  <At x={420} y={BOARD.y + BOARD.h / 2}>
    <span style={{ fontFamily: TEXT, fontWeight: 600, fontSize: 48, color: C.paper }}>{rich("1 بيتزا ÷ 8 = ؟")}</span>
  </At>
);

const time = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

/** The lesson's player: «▶ الدرس شغّال» with its progress (0 → 1), or «⏸ الدرس واقف» with the seconds it has stood still. */
export const Badge: React.FC<{ paused: boolean; progress: number; stopped: number; label?: string; x?: number; y?: number }> = ({ paused, progress, stopped, label, x = 330, y = 612 }) => (
  <At x={x} y={y}>
    <Box border={paused ? C.rust : C.sageText} pad="8px 20px 12px" still={false}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, direction: "rtl" }}>
        <span style={{ fontFamily: TEXT, fontWeight: 600, fontSize: 28, color: paused ? C.rust : C.sageText }}>{label ?? (paused ? "⏸ الدرس واقف" : "▶ الدرس شغّال")}</span>
        {paused ? (
          <span style={{ fontFamily: MONO, fontWeight: 600, fontSize: 30, color: C.rustTint, background: C.ink, borderRadius: 6, padding: "2px 12px 4px", direction: "ltr" }}>{time(stopped)}</span>
        ) : (
          <span style={{ display: "inline-block", width: 150, height: 14, borderRadius: 7, border: `2.5px solid ${C.sageText}`, position: "relative", overflow: "hidden" }}>
            <span style={{ position: "absolute", insetBlock: 0, right: 0, width: `${Math.round(progress * 100)}%`, background: C.sage }} />
          </span>
        )}
      </div>
    </Box>
  </At>
);

/** The five students, each at their desk, in the pose the scene gives them; [tick] drives pencils and tapping. */
export const Students: React.FC<{ pose: (id: KidId) => KidPose; tick: number; only?: KidId }> = ({ pose, tick, only }) => (
  <g>
    {(Object.keys(KIDS) as KidId[])
      .filter((id) => !only || id === only)
      .map((id, i) => {
        const k = KIDS[id];
        const p = pose(id);
        return <SeatedKid key={id} x={k.x} y={FLOOR} kind={k.kind} glasses={k.glasses} mood={p.mood} lean={p.lean} down={p.down} arms={p.arms} tick={tick + i * 1.3} seed={800 + i * 10} />;
      })}
  </g>
);

/** Where a student's head is, in the pose they hold. */
export const headOf = (id: KidId, p: KidPose) => seatedHead(KIDS[id].x, FLOOR, p.lean ?? 0, p.down ?? 0);

/** The class dimmed, and a cone of light from the board onto one student. */
export const Spotlight: React.FC<{ x: number; dim: number }> = ({ x, dim }) =>
  dim > 0 ? (
    <g>
      <rect x={0} y={0} width={1080} height={1920} fill={C.ink} opacity={0.5 * dim} />
      <path d={`M${x - 22},${BOARD.y + BOARD.h + 6} L${x + 22},${BOARD.y + BOARD.h + 6} L${x + 100},${FLOOR + 6} L${x - 100},${FLOOR + 6} Z`} fill={C.goldTint} opacity={0.55 * dim} />
    </g>
  ) : null;

/** The floor line under the desks. */
export const Floor: React.FC = () => <Sk seed={520} still items={[{ k: "line", a: [40, FLOOR + 4], b: [1040, FLOOR + 4], stroke: C.hairline, width: 3 }]} />;

/** A paper plane thrown across the room: [p] 0 → 1 along its arc. */
export const PaperPlane: React.FC<{ p: number; from: [number, number]; to: [number, number]; seed: number }> = ({ p, from, to, seed }) => {
  if (p <= 0 || p >= 1) return null;
  const x = from[0] + (to[0] - from[0]) * p;
  const y = from[1] + (to[1] - from[1]) * p - Math.sin(p * Math.PI) * 120;
  return (
    <Sk
      seed={seed}
      items={[
        { k: "poly", pts: [[x - 34, y + 4], [x + 30, y - 10], [x - 6, y + 16]], fill: C.sheet, width: 2.6 },
        { k: "line", a: [x - 34, y + 4], b: [x + 30, y - 10], width: 2.2 },
      ]}
    />
  );
};

/** The intervention ladder, small, beside the board: six rungs, the one in use lit. */
export const MiniLadder: React.FC<{ rung: number; seed: number }> = ({ rung, seed }) => {
  const x0 = 912;
  const x1 = 948;
  const ys = [528, 500, 472, 444, 416, 388];
  return (
    <Sk
      seed={seed}
      items={[
        { k: "line", a: [x0, 372], b: [x0, 540], width: 3 },
        { k: "line", a: [x1, 372], b: [x1, 540], width: 3 },
        ...ys.map((y, i) => ({ k: "line" as const, a: [x0, y] as [number, number], b: [x1, y] as [number, number], stroke: i + 1 === rung ? C.gold : C.inkSubtle, width: i + 1 === rung ? 5 : 2.4 })),
        ...(rung > 0 ? [{ k: "circle" as const, c: [x0 - 18, ys[rung - 1]] as [number, number], d: 14, fill: C.gold, stroke: C.goldText, width: 2 }] : []),
      ]}
    />
  );
};
