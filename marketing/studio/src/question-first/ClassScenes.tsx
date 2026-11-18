// The classroom scenes: the hook, Wednesday (the name first), Sunday (the question first), ten minutes later, and the
// payoff. Every beat is keyed on the speakers' words (timeline.ts).
import { AbsoluteFill, Img, interpolate, useCurrentFrame } from "remotion";
import { asset, C, LOGO, logoWidth, MONO, TEXT } from "../brand";
import { StandingKid, Teacher } from "../components/People";
import { Canvas, Sk } from "../components/Sketch";
import { Bulb, Ring, Tick, Timer } from "../components/Things";
import { At, Bubble, Label, Tag } from "../components/Words";
import { clamp, progress } from "../lib/motion";
import { ABDULLAH, BACK_ROW, Classroom, FAISAL, type KidState, pos, RAISERS, shuffled, WINDOW_SEAT } from "./Classroom";
import { beats, type Timeline } from "./timeline";

const index2 = (row: number, col: number) => row * 6 + col;

const ALL = Array.from({ length: 30 }, (_, i) => i);
const QUIET = shuffled(
  ALL.filter((i) => !RAISERS.includes(i)),
  7,
);
/** A bulb going out (or coming on) as a quick fade. */
const flick = (frame: number, at: number) => progress(frame, at, 5);

export const Page: React.FC<{ svg?: React.ReactNode; children?: React.ReactNode }> = ({ svg, children }) => (
  <AbsoluteFill style={{ backgroundColor: C.paper }}>
    <Canvas>{svg}</Canvas>
    {children}
  </AbsoluteFill>
);

/** The teacher at the top right of the classroom, where his bubbles start. */
const TEACHER = { x: 975, y: 545 };
const BUBBLE = { x: 905, y: 372 };

export const Hook: React.FC<{ timeline: Timeline }> = ({ timeline }) => {
  const frame = useCurrentFrame();
  const b = beats(timeline).hook;
  const state = (i: number): KidState => {
    if (RAISERS.includes(i)) return { on: 1 };
    return { on: 1 - flick(frame, b.off + QUIET.indexOf(i) * 1.4), mood: frame > b.off + 20 ? "flat" : "smile" };
  };
  const logo = interpolate(frame, [0, 10], [0, 1], clamp);
  return (
    <Page svg={<Classroom state={state} />}>
      <At x={540} y={300} style={{ opacity: logo }}>
        <Img src={asset(LOGO.file)} style={{ width: logoWidth(240), display: "block" }} />
      </At>
      <Label x={540} y={470} text="مين يعرف…؟" from={b.who} color={C.olive} size={40} />
    </Page>
  );
};

export const Wednesday: React.FC<{ timeline: Timeline }> = ({ timeline }) => {
  const frame = useCurrentFrame();
  const b = beats(timeline).wednesday;
  const offFirst = b.ask + 18;
  const offNamed = b.named + 14;
  const state = (i: number): KidState => {
    const hand = RAISERS.includes(i) ? progress(frame, b.hands + RAISERS.indexOf(i) * 4, 8) * (1 - progress(frame, b.reset, 8)) : 0;
    if (i === ABDULLAH) {
      const red = frame >= b.red ? 0.65 + 0.35 * Math.abs(Math.sin(((frame - b.red) / 30) * Math.PI * 2.2)) : 0;
      const firstOff = frame < b.reset ? flick(frame, offFirst + QUIET.indexOf(i) * 1.2) : 0;
      const relit = frame >= b.reset ? 1 : 1 - firstOff;
      return { on: relit, red: Math.min(1, red * progress(frame, b.red, 6)), mood: frame >= b.named ? "worried" : "smile" };
    }
    let on = 1;
    if (!RAISERS.includes(i) && frame < b.reset) on = 1 - flick(frame, offFirst + QUIET.indexOf(i) * 1.2);
    if (frame >= b.reset && frame < offNamed) on = Math.max(on, progress(frame, b.reset + (i % 9) * 1.5, 6));
    if (frame >= offNamed) on = 1 - flick(frame, offNamed + ALL.indexOf(i) * 0.7);
    return { on, hand, mood: frame >= offNamed + 10 ? "flat" : "smile" };
  };
  const notMe = [index2(0, 2), index2(1, 0), index2(3, 4), index2(4, 2)];
  return (
    <Page
      svg={
        <>
          <Classroom state={state} />
          <Teacher x={TEACHER.x} y={TEACHER.y} pose={frame >= b.named ? "point" : "ask"} seed={50} />
        </>
      }
    >
      <Tag text="الأربعاء" />
      <Bubble x={BUBBLE.x} y={BUBBLE.y} text="مين يعرف كم 3/4 من 12؟" from={b.ask} to={b.named - 1} />
      <Bubble x={BUBBLE.x} y={BUBBLE.y} text="عبدالله، كم 3/4 من 12؟" from={b.named} />
      <Label x={540} y={1322} text="نفس الثلاثة دايم" from={b.same} to={b.reset} color={C.goldText} />
      <Label x={540} y={1322} text="الاسم أولاً = 29 تنطفي" from={b.off} color={C.rust} />
      {notMe.map((i, n) => (
        <Label key={i} x={pos(i).x} y={pos(i).y - 112} text="مو أنا" from={b.notMe + n * 3} to={b.notMe + 46} size={26} color={C.inkMuted} />
      ))}
    </Page>
  );
};
export const Sunday: React.FC<{ timeline: Timeline }> = ({ timeline }) => {
  const frame = useCurrentFrame();
  const b = beats(timeline).sunday;
  const lightFrom = b.askDone;
  const LIGHT = shuffled(ALL, 19);
  const step = Math.max(1, (b.thirty - lightFrom - 6) / 30);
  const state = (i: number): KidState => {
    const on = frame < lightFrom ? 0.0 : progress(frame, lightFrom + LIGHT.indexOf(i) * step, 6);
    if (i === ABDULLAH) return { on, mood: frame >= b.right ? "happy" : frame >= b.name ? "o" : "smile" };
    return { on, mood: frame >= b.thirty ? "smile" : "flat" };
  };
  const timer = frame >= lightFrom ? progress(frame, lightFrom, 60, (t) => t) : 0;
  const a = pos(ABDULLAH);
  const f = pos(FAISAL);
  const w = pos(WINDOW_SEAT);
  return (
    <Page
      svg={
        <>
          <Classroom state={state} window />
          <Teacher x={TEACHER.x} y={TEACHER.y} pose={frame >= b.name ? "point" : "ask"} seed={60} />
          {frame >= lightFrom - 6 ? <Timer x={110} y={430} d={100} p={timer} seed={70} /> : null}
          <Ring x={a.x} y={a.y} d={98} p={progress(frame, b.name, 10)} seed={71} />
          <Tick x={a.x + 52} y={a.y - 36} p={progress(frame, b.right, 6)} seed={72} />
          <Ring x={f.x} y={f.y} d={98} p={progress(frame, b.faisal, 10)} seed={73} />
          {BACK_ROW.map((i, n) => (
            <Ring key={i} x={pos(i).x} y={pos(i).y} d={98} p={progress(frame, b.back + n * 3, 10)} seed={74 + n} />
          ))}
          <Ring x={w.x} y={w.y} d={98} p={progress(frame, b.window, 10)} seed={81} />
        </>
      }
    >
      <Tag text="الأحد" />
      {frame >= lightFrom - 6 ? (
        <At x={110} y={430}>
          <span style={{ fontFamily: MONO, fontWeight: 600, fontSize: 30, color: C.ink }}>2</span>
          <span style={{ fontFamily: TEXT, fontWeight: 600, fontSize: 26, color: C.ink }}> ث</span>
        </At>
      ) : null}
      <Bubble x={BUBBLE.x} y={BUBBLE.y} text="في فصلنا، أي أحد ممكن أسأله… رافع يده أو لا." from={b.rule} to={b.ask - 1} maxWidth={720} size={36} />
      <Bubble x={BUBBLE.x} y={BUBBLE.y} text="كم 3/4 من 12؟" from={b.ask} to={b.name - 1} />
      <Bubble x={BUBBLE.x} y={BUBBLE.y} text="عبدالله." from={b.name} to={b.how - 1} />
      <Bubble x={BUBBLE.x} y={BUBBLE.y} text="كيف طلعت معك؟" from={b.how} />
      <Label x={540} y={1322} text="30/30 يفكّرون" from={b.thirty} to={b.answer - 1} color={C.goldText} />
      <Label x={540} y={1322} text="«مو متأكد… بس أتوقع 9؟»" from={b.answer} to={b.none - 1} color={C.sageText} size={36} />
      <Label x={540} y={1322} text="ولا مصباح انطفى" from={b.none} color={C.sageText} />
    </Page>
  );
};

export const Later: React.FC<{ timeline: Timeline }> = ({ timeline }) => {
  const frame = useCurrentFrame();
  const b = beats(timeline).later;
  const state = (i: number): KidState => ({ on: 1, hand: i === ABDULLAH ? progress(frame, b.hand, 10) : 0, mood: i === ABDULLAH ? "happy" : "smile" });
  const inset = progress(frame, b.abdullah, 12);
  const dim = 1 - 0.75 * inset;
  return (
    <Page
      svg={
        <>
          <Classroom state={state} dim={dim} />
          <Teacher x={TEACHER.x} y={TEACHER.y} pose="ask" seed={90} />
          {inset > 0 ? (
            <g opacity={inset}>
              <Sk seed={91} items={[{ k: "rect", x: 250, y: 560, w: 580, h: 640, fill: C.goldSoft, stroke: C.gold, width: 6 }]} />
              <StandingKid x={540} y={1140} s={1.25} hand={1} seed={92} />
              <Bulb x={540} y={760} r={30} on={progress(frame, b.abdullah + 6, 8)} seed={95} />
            </g>
          ) : null}
        </>
      }
    >
      <Tag text="بعد عشر دقايق" />
      <Bubble x={BUBBLE.x} y={BUBBLE.y} text="السؤال اللي بعده…" from={b.next} />
      <Label x={540} y={600} text="أول مرة هالترم" from={b.first} color={C.goldText} size={34} />
    </Page>
  );
};

export const Payoff: React.FC<{ timeline: Timeline }> = ({ timeline }) => {
  const frame = useCurrentFrame();
  const b = beats(timeline).payoff;
  const state = (): KidState => ({ on: 1, mood: frame >= b.think ? "happy" : "smile" });
  return (
    <Page svg={<Classroom state={state} />}>
      <Tag text="كل حصة" />
      <Label x={540} y={430} text="أي أحد ممكن ينسأل" from={b.anyone} color={C.olive} size={38} />
      <Label x={540} y={1322} text="الكل يفكّر" from={b.think} color={C.goldText} size={40} />
    </Page>
  );
};
