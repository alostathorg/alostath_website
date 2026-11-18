// Away from the class: Friday at the family house (the grandfather's quiz: question, a wait, then the name), and the
// night before Sunday (names written next to the questions).
import { useCurrentFrame } from "remotion";
import { C, TEXT } from "../brand";
import { Sitting, sittingHead, Teacher } from "../components/People";
import { Sk, roundRect } from "../components/Sketch";
import { Bulb, Dallah, Finjan, Gift, Lamp, Ring, Spider, Timer, Trap } from "../components/Things";
import { At, Bubble, Label, Tag, rich } from "../components/Words";
import { progress } from "../lib/motion";
import { Page } from "./ClassScenes";
import { beats, type Timeline } from "./timeline";

const FLOOR = 1150;
/** The family is drawn at FLOOR and enlarged by S about the rug's lower edge, so it fills the frame like the class. */
const S = 1.15;
const PIVOT_Y = FLOOR + 44;
const FAMILY_TRANSFORM = `translate(${540 * (1 - S)} ${PIVOT_Y * (1 - S)}) scale(${S})`;
/** A point of the family drawing in frame coordinates. */
const T = (x: number, y: number): [number, number] => [540 + (x - 540) * S, PIVOT_Y + (y - PIVOT_Y) * S];

const FAMILY = [
  { id: "grandpa", x: 800, who: "grandpa" as const },
  { id: "boy1", x: 640, who: "boy" as const, kind: "kufi" as const },
  { id: "sara", x: 500, who: "girl" as const },
  { id: "boy2", x: 360, who: "boy" as const, kind: "short" as const },
  { id: "fahd", x: 190, who: "teacher" as const },
];
const THINKERS = ["sara", "boy2", "fahd", "boy1"];
const CUSHIONS = [110, 315, 520, 725, 930];

/** The majlis: back cushions along the wall and a Sadu-striped rug on the floor. */
const Majlis: React.FC = () => {
  const zig: [number, number][] = [];
  for (let x = 0; x <= 1080; x += 30) zig.push([x, FLOOR + ((x / 30) % 2 ? 30 : 12)]);
  return (
    <>
      <Sk seed={400} still items={CUSHIONS.map((x) => ({ k: "path" as const, d: roundRect(x - 92, FLOOR - 86, 184, 84, 22), fill: C.sageTint, stroke: C.ink, width: 3 }))} />
      <Sk
        seed={401}
        still
        items={CUSHIONS.map((x) => ({ k: "poly" as const, pts: [[x, FLOOR - 58], [x + 12, FLOOR - 44], [x, FLOOR - 30], [x - 12, FLOOR - 44]] as [number, number][], fill: C.rust, stroke: C.rust, width: 2 }))}
      />
      <Sk
        seed={402}
        items={[
          { k: "rect", x: -20, y: FLOOR, w: 1120, h: 44, fill: C.goldSoft, stroke: C.ink, width: 3 },
          { k: "line", a: [-10, FLOOR + 7], b: [1090, FLOOR + 7], stroke: C.olive, width: 2.4 },
          { k: "line", a: [-10, FLOOR + 37], b: [1090, FLOOR + 37], stroke: C.olive, width: 2.4 },
          { k: "linear", pts: zig, stroke: C.rust, width: 3.2 },
        ]}
      />
    </>
  );
};

export const Friday: React.FC<{ timeline: Timeline }> = ({ timeline }) => {
  const frame = useCurrentFrame();
  const b = beats(timeline).friday;
  const waitFrames = Math.max(12, b.name - b.wait);
  const bulbOn = (id: string) => progress(frame, b.wait + (THINKERS.indexOf(id) + 0.5) * (waitFrames / (THINKERS.length + 0.5)), 6);
  const formula = frame >= b.q;
  const saraUp = frame >= b.eight && frame < b.capitals;
  const [sx, sy] = sittingHead(500, FLOOR, "girl");
  const [lx, ly] = T(sx, sy);
  return (
    <Page
      svg={
        <>
          <g transform={FAMILY_TRANSFORM}>
            <Majlis />
            {FAMILY.map((p, i) => (
              <Sitting
                key={p.id}
                x={p.x}
                y={FLOOR}
                who={p.who}
                kind={"kind" in p ? p.kind : undefined}
                arms={p.id === "grandpa" ? "cup" : p.id === "sara" && saraUp ? "up" : "lap"}
                mood={(p.id === "sara" || p.id === "grandpa") && frame >= b.name ? "happy" : "smile"}
                seed={410 + i * 10}
              />
            ))}
            <Dallah x={930} y={FLOOR + 4} s={0.8} seed={470} />
            <Finjan x={870} y={1064} seed={471} />
            {FAMILY.filter((p) => p.id !== "grandpa").map((p) => {
              const [hx, hy] = sittingHead(p.x, FLOOR, p.who);
              return <Bulb key={p.id} x={hx} y={hy - (p.who === "teacher" ? 78 : 64)} r={14} on={bulbOn(p.id)} seed={480 + p.x} />;
            })}
            <Ring x={sx} y={sy} d={74} p={progress(frame, b.name, 10)} seed={490} />
          </g>
          {frame >= b.spider && frame < b.capitals + 8 ? (
            <g opacity={progress(frame, b.spider, 8) * (1 - progress(frame, b.capitals, 8))}>
              <Spider x={540} y={470} s={1.05} seed={491} />
            </g>
          ) : null}
          {frame >= b.wait - 4 && frame < b.capitals ? <Timer x={540} y={612} d={84} p={progress(frame, b.wait, waitFrames, (t) => t)} seed={492} /> : null}
          {formula ? (
            <Sk
              seed={493}
              opacity={progress(frame, b.w, 8)}
              items={[
                { k: "line", a: [735, 520], b: [655, 520], width: 3 },
                { k: "line", a: [425, 520], b: [345, 520], width: 3, stroke: frame >= b.n ? C.ink : "rgba(0,0,0,0)" },
              ]}
            />
          ) : null}
          {frame >= b.gift ? (
            <g opacity={progress(frame, b.gift, 8)}>
              <Gift x={410} y={705} seed={494} />
            </g>
          ) : null}
          {frame >= b.trap ? (
            <g opacity={progress(frame, b.trap, 6)}>
              <Trap x={680} y={705} crossed={progress(frame, b.trap + 6, 14)} seed={495} />
            </g>
          ) : null}
        </>
      }
    >
      <Tag text="الجمعة · بيت العيلة" />
      <Bubble x={880} y={770} text="سؤال يا عيال: كم رجل للعنكبوت؟" from={b.ask} to={b.name - 1} color={C.goldText} size={36} />
      {frame >= b.wait - 4 && frame < b.capitals ? (
        <At x={540} y={612}>
          <span style={{ fontFamily: TEXT, fontWeight: 600, fontSize: 21, color: C.ink }}>انتظار</span>
        </At>
      ) : null}
      <Bubble x={880} y={770} text="سارة!" from={b.name} to={b.capitals - 1} color={C.goldText} />
      <Label x={lx} y={ly - 205} text="8!" from={b.eight} to={b.capitals - 1} color={C.goldText} size={44} />
      <Bubble x={200} y={770} side="left" text="عشان كذا كنت أعرف عواصم الدول كلها!" from={b.capitals} to={b.q - 1} size={34} maxWidth={720} />
      {["الرياض", "القاهرة", "طوكيو", "باريس"].map((c, n) => (
        <Label key={c} x={[170, 330, 230, 400][n]} y={[680, 610, 540, 470][n]} text={c} from={b.capitals + 8 + n * 6} to={b.q - 1} size={28} color={C.olive} tilt={[-4, 3, -2, 4][n]} />
      ))}
      <Label x={830} y={520} text="1 سؤال" from={b.q} color={C.olive} size={36} />
      <Label x={540} y={520} text="2 انتظار" from={b.w} color={C.goldText} size={36} />
      <Label x={250} y={520} text="3 الاسم" from={b.n} color={C.olive} size={36} />
      <Label x={540} y={612} text="+ ابتسامة" from={b.smile} color={C.sageText} size={32} />
      <Label x={410} y={792} text="هدية" from={b.gift + 4} color={C.goldText} size={30} />
      <Label x={680} y={792} text="مو فخ" from={b.trap + 8} color={C.rust} size={30} />
    </Page>
  );
};

const QUESTIONS = ["1. كم 3/4 من 12؟", "2. كم 2/3 من 12؟", "3. كم 3/4 من 20؟", "4. ليش؟"];
const NAMES = ["← عبدالله", "← فيصل", "← ماجد", "← تركي"];
const ROW_Y = [505, 575, 645, 715];
/** Seats on the little seating chart that the names land on: Abdullah, Faisal, the back row, the window corner. */
const SEATS: [number, number][] = [
  [2, 3],
  [1, 1],
  [4, 2],
  [0, 5],
];
const DESK = 1180;

export const Saturday: React.FC<{ timeline: Timeline }> = ({ timeline }) => {
  const frame = useCurrentFrame();
  const b = beats(timeline).saturday;
  const typed = (n: number) => progress(frame, b.write + n * 12, 12, (t) => t);
  const named = (n: number) => progress(frame, n === 0 ? b.abdullah : b.corners + (n - 1) * 8, 8);
  const dot = (r: number, c: number): [number, number] => [300 - c * 27, 690 + r * 27];
  return (
    <Page
      svg={
        <>
          <Sk seed={600} items={[{ k: "rect", x: 110, y: 360, w: 860, h: 480, fill: C.sheet, stroke: C.ink, width: 3.2 }]} />
          <Sk seed={601} still items={[470, 540, 610, 680, 750].map((y) => ({ k: "line" as const, a: [140, y] as [number, number], b: [945, y] as [number, number], stroke: C.hairline, width: 2 }))} />
          <Sk seed={602} still items={[{ k: "line", a: [928, 370], b: [928, 830], stroke: C.rustTint, width: 2.6 }]} />
          <Sk seed={603} still items={Array.from({ length: 30 }, (_, i) => ({ k: "circle" as const, c: dot(Math.floor(i / 6), i % 6), d: 11, fill: C.surface, stroke: C.inkFaint, width: 1.6 }))} />
          {SEATS.map(([r, c], n) => (named(n) > 0 ? <Sk key={n} seed={610 + n} opacity={named(n)} items={[{ k: "circle", c: dot(r, c), d: 16, fill: n === 0 ? C.gold : C.olive, stroke: C.ink, width: 1.8 }]} /> : null))}
          <Sk
            seed={620}
            items={[
              { k: "rect", x: 120, y: 930, w: 170, h: 160, fill: C.oliveDeep, stroke: C.ink, width: 3.2 },
              { k: "line", a: [205, 932], b: [205, 1088], stroke: C.surface, width: 3 },
              { k: "line", a: [122, 1010], b: [288, 1010], stroke: C.surface, width: 3 },
              { k: "circle", c: [252, 966], d: 30, fill: C.goldTint, stroke: C.gold, width: 2 },
              { k: "circle", c: [150, 960], d: 5, fill: C.goldTint, stroke: C.goldTint, width: 1 },
              { k: "circle", c: [172, 1046], d: 4, fill: C.goldTint, stroke: C.goldTint, width: 1 },
              { k: "circle", c: [250, 1060], d: 4, fill: C.goldTint, stroke: C.goldTint, width: 1 },
            ]}
          />
          <Teacher x={760} y={DESK + 56} s={0.95} pose="write" seed={630} />
          <Sk
            seed={640}
            items={[
              { k: "rect", x: 560, y: DESK - 14, w: 130, h: 14, fill: C.sheet, stroke: C.ink, width: 2.4 },
              { k: "line", a: [688, DESK - 18], b: [676, DESK - 40], stroke: C.goldText, width: 4 },
              { k: "rect", x: 80, y: DESK, w: 920, h: 56, fill: C.goldTint, stroke: C.ink, width: 3.2 },
              { k: "line", a: [120, DESK + 56], b: [120, DESK + 140], width: 3.2 },
              { k: "line", a: [960, DESK + 56], b: [960, DESK + 140], width: 3.2 },
            ]}
          />
          <Lamp x={950} y={DESK} seed={650} />
        </>
      }
    >
      <Tag text="ليلة الأحد" />
      <At x={905} y={418} anchor="right">
        <span style={{ fontFamily: TEXT, fontWeight: 600, fontSize: 40, color: C.olive }}>أسئلة الأحد</span>
      </At>
      <At x={232} y={664}>
        <span style={{ fontFamily: TEXT, fontWeight: 500, fontSize: 22, color: C.inkSubtle }}>مقاعد الفصل</span>
      </At>
      {QUESTIONS.map((q, n) => (
        <At key={q} x={905} y={ROW_Y[n]} anchor="right" style={{ clipPath: `inset(0 0 0 ${(1 - typed(n)) * 100}%)` }}>
          <span style={{ fontFamily: TEXT, fontWeight: 500, fontSize: 36, color: C.ink }}>{rich(q)}</span>
        </At>
      ))}
      {NAMES.map((name, n) => (
        <At key={name} x={540} y={ROW_Y[n]} anchor="right" style={{ opacity: named(n) }}>
          <span style={{ fontFamily: TEXT, fontWeight: 600, fontSize: 36, color: n === 0 ? C.goldText : C.olive }}>{name}</span>
        </At>
      ))}
      <Label x={290} y={ROW_Y[0] + 2} text="سهل أول" from={b.easy} color={C.sageText} size={28} />
    </Page>
  );
};
