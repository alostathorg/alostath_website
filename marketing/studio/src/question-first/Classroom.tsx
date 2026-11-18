// The classroom: thirty students in five rows of six behind long desks, a bulb above every head. Scenes pass a state
// for each student (bulb on, alarm, hand, mood); the grid itself never moves.
import { Bulb, Plank, Window } from "../components/Things";
import { type Hair, Kid, type Mood } from "../components/People";

export const COLS = 6;
export const ROWS = 5;
/** Column 0 is the right-most (the class reads right to left). */
export const kidX = (col: number) => 915 - col * 150;
export const kidY = (row: number) => 645 + row * 144;
export const index = (row: number, col: number) => row * COLS + col;
export const pos = (i: number) => ({ x: kidX(i % COLS), y: kidY(Math.floor(i / COLS)) });

/** The students the story names, and the three who always raise their hands. */
export const ABDULLAH = index(2, 3);
export const FAISAL = index(1, 1);
export const WINDOW_SEAT = index(0, 5);
export const BACK_ROW = [0, 1, 2, 3, 4, 5].map((c) => index(4, c));
export const RAISERS = [index(0, 1), index(1, 4), index(3, 0)];

export type KidState = { on: number; red?: number; hand?: number; mood?: Mood };

const KINDS: Hair[] = ["short", "kufi", "side", "buzz", "short", "kufi", "side", "short"];
/** Each student's look, fixed by their seat. Abdullah's hair is the spiky one, so the eye finds him. */
const look = (i: number): { kind: Hair; glasses: boolean } =>
  i === ABDULLAH ? { kind: "spiky", glasses: false } : { kind: KINDS[(i * 5 + 3) % KINDS.length], glasses: (i * 7) % 11 === 3 };

/** A fixed shuffle of [items] (the order bulbs go out or come on), the same on every frame. */
export function shuffled<T>(items: T[], seed: number): T[] {
  const out = [...items];
  let s = seed;
  for (let i = out.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export const Classroom: React.FC<{ state: (i: number) => KidState; window?: boolean; dim?: number }> = ({ state, window, dim = 1 }) => {
  const kids = Array.from({ length: COLS * ROWS }, (_, i) => i);
  return (
    <g opacity={dim}>
      {window ? <Window x={20} y={560} w={36} h={430} seed={901} /> : null}
      {kids.map((i) => {
        const { x, y } = pos(i);
        const s = state(i);
        const { kind, glasses } = look(i);
        return (
          <g key={i}>
            <Bulb x={x} y={y - 66} on={s.on} red={s.red ?? 0} seed={1000 + i * 10} />
            <Kid x={x} y={y} kind={kind} glasses={glasses} mood={s.mood ?? "smile"} hand={s.hand ?? 0} seed={2000 + i * 10} />
          </g>
        );
      })}
      {Array.from({ length: ROWS }, (_, r) => (
        <Plank key={r} y={kidY(r) + 38} seed={3000 + r} />
      ))}
    </g>
  );
};
