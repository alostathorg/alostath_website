// The scenes of «أخفّ تدخّل». Every beat is keyed on the spoken words (timeline.ts).
import { interpolate, useCurrentFrame } from "remotion";
import { C, TEXT } from "../brand";
import { Page } from "../components/Page";
import { Teacher } from "../components/People";
import { Sk } from "../components/Sketch";
import { StrategyCard } from "../components/StrategyCard";
import { Ring, Timer } from "../components/Things";
import { At, Bubble, Label, Tag } from "../components/Words";
import { clamp, progress } from "../lib/motion";
import { FAHD_SEAT, Hall, LadderCard, LadderLabels, Rows, SCREEN, Usher, usherHead } from "./Cinema";
import { Badge, Board, BoardText, Floor, headOf, type KidId, type KidPose, KIDS, MiniLadder, PaperPlane, PIZZA, Spotlight, Students } from "./Room";
import { beats, type Timeline } from "./timeline";

const TEACHER_X = 965;
/** Where the teacher's bubbles sit: under the board, right side, toward him. */
const SAY = { x: 935, y: 692 };
const kidBubbleY = (id: KidId, p: KidPose) => headOf(id, p)[1] - 96;

export const Paused: React.FC<{ timeline: Timeline }> = ({ timeline }) => {
  const frame = useCurrentFrame();
  const b = beats(timeline).paused;
  const stopped = frame >= b.pause;
  const dim = progress(frame, b.pause, 8);
  const target: KidId = frame >= b.majed ? "majed" : frame >= b.turki ? "turki" : "saud";
  const real = Math.max(0, (frame - b.pause) / 30);
  const atJump = (b.later - b.pause) / 30;
  const seconds = frame < b.later ? real : interpolate(frame, [b.later, b.later + 28], [atJump, 273], clamp);
  const played = 0.08 + 0.1 * Math.min(1, frame / Math.max(1, b.pause));
  const pose = (id: KidId): KidPose => {
    switch (id) {
      case "saud":
        return !stopped ? { arms: "chat", lean: -1, mood: "happy" } : { arms: "rest", mood: frame < b.others ? "o" : "flat" };
      case "abdullah":
        return !stopped ? { arms: "rest", lean: 0.4, mood: "smile" } : { arms: "rest", mood: "flat" };
      case "turki":
        return frame < b.turki ? { arms: "tap", mood: "smile" } : { arms: "rest", mood: frame < b.majed ? "o" : "flat" };
      case "majed":
        return frame < b.up ? { arms: "fold", down: 1, mood: "flat" } : { arms: "rest", down: 1 - progress(frame, b.up, 12), mood: "worried" };
      case "faisal":
        return frame >= b.plane - 8 && frame < b.plane + 30 ? { arms: "up", mood: "happy" } : { arms: "rest", mood: stopped && frame < b.plane ? "flat" : "happy" };
    }
  };
  const tick = frame / 3;
  return (
    <Page
      svg={
        <>
          <Board cut={0} />
          <Floor />
          <Students pose={pose} tick={tick} />
          <Teacher x={TEACHER_X} y={1250} pose={stopped ? "point" : "ask"} seed={900} />
          <Spotlight x={KIDS[target].x} dim={dim} />
          {dim > 0 ? <Students pose={pose} tick={tick} only={target} /> : null}
          <Ring x={PIZZA.x} y={PIZZA.y} d={168} p={progress(frame, b.pizza, 14)} seed={910} />
          <PaperPlane p={progress(frame, b.plane, 40, (t) => t)} from={[KIDS.faisal.x + 20, 960]} to={[260, 760]} seed={920} />
        </>
      }
    >
      <BoardText />
      <Tag text={frame < b.later ? "الأحد · 10:35" : "الأحد · 10:47"} from={frame < b.later ? 0 : b.later} />
      <Badge paused={stopped} progress={played} stopped={seconds} />
      <Label x={KIDS.saud.x - 40} y={kidBubbleY("saud", pose("saud"))} text="بسس…" from={0} to={b.pause - 1} size={28} color={C.inkMuted} />
      <Bubble x={SAY.x} y={SAY.y} text="يعني لو قسمنا البيتزا على 8…" from={b.teach} to={b.pause - 1} />
      <Bubble x={SAY.x} y={SAY.y} text="سعود! عسى السالفة حلوة هناك؟" from={b.pause} to={b.turki - 1} />
      <Label x={KIDS.saud.x} y={kidBubbleY("saud", pose("saud"))} text="مين؟ أنا؟" from={b.who} to={b.others - 1} size={30} color={C.sageText} />
      <Label x={540} y={1330} text="+29 وقفوا معه" from={b.others} to={b.later - 1} color={C.rust} size={34} />
      <Bubble x={SAY.x} y={SAY.y} text="تركي، خلاص الطقطقة." from={b.turki} to={b.majed - 1} />
      <Bubble x={SAY.x} y={SAY.y} text="ماجد… ارفع راسك لو سمحت." from={b.majed} to={b.later - 1} />
      <Label x={540} y={1330} text="بعد 12 دقيقة… البيتزا ما انقسمت" from={b.pizza} color={C.rust} size={34} />
    </Page>
  );
};

export const Cinema: React.FC<{ timeline: Timeline }> = ({ timeline }) => {
  const frame = useCurrentFrame();
  const b = beats(timeline).cinema;
  const total = timeline.scenes.cinema.frames;
  const walk = progress(frame, b.usher, 34);
  const kick = frame < b.kick ? 0 : frame < b.thanks + 6 ? progress(frame, b.kick, 6) : 1 - progress(frame, b.thanks + 6, 8);
  const [ux, uy] = usherHead(Math.max(walk, 0.0001));
  const fahd: [number, number] = [FAHD_SEAT.x, 1091];
  return (
    <Page
      svg={
        <>
          <Hall film={frame / total} seed={1000} />
          <Rows phone={progress(frame, b.phone, 6)} kick={kick} fahdMood={frame >= b.fahd ? "o" : "smile"} tick={frame / 2} seed={1100} />
          <Usher walk={walk} torch={progress(frame, b.usher + 24, 10)} seed={1200} />
        </>
      }
    >
      <Tag text="الخميس · السينما" />
      <Badge paused={false} progress={frame / total} stopped={0} label="▶ الفيلم شغّال" x={540} y={SCREEN.y + SCREEN.h + 46} />
      <Label x={820} y={SCREEN.y + SCREEN.h + 46} text="ما وقف" from={b.noStop} color={C.sageText} size={28} />
      <Bubble x={ux - 40} y={uy - 90} text="رجولك يا بطل… مشكور." from={b.whisper} to={b.fahd - 1} size={28} color={C.inkMuted} />
      <Label x={fahd[0] + 70} y={1300} text="وأنا أوقف فيلمي كل دقيقتين!" from={b.fahd} color={C.olive} size={32} />
    </Page>
  );
};

export const Ladder: React.FC<{ timeline: Timeline }> = ({ timeline }) => {
  const frame = useCurrentFrame();
  const b = beats(timeline).ladder;
  const open = progress(frame, 0, 10);
  const shown = interpolate(frame, [b.line, b.line + 6 * 7], [0, 6], clamp);
  return (
    <Page
      svg={
        <>
          <Hall film={0.5 + frame / 600} seed={1000} />
          <Rows phone={0} kick={0} fahdMood="smile" tick={0} seed={1100} />
          <LadderCard open={open} shown={shown} mark={progress(frame, b.low, 8)} seed={1300} />
        </>
      }
    >
      <Tag text="الخميس · السينما" />
      <LadderLabels open={open} shown={shown} />
      <Label x={360} y={1160} text="خلّك هنا" from={b.low} color={C.sageText} size={30} />
      {frame >= b.playing ? <Badge paused={false} progress={0.4 + (frame - b.playing) / 300} stopped={0} x={540} y={1300} /> : null}
    </Page>
  );
};

export const Playing: React.FC<{ timeline: Timeline }> = ({ timeline }) => {
  const frame = useCurrentFrame();
  const b = beats(timeline).playing;
  const total = timeline.scenes.playing.frames;
  const partner = frame >= b.partner && frame < b.whisper;
  const writing = frame >= b.all;
  const pose = (id: KidId): KidPose => {
    if (partner) return { arms: "turn", lean: id === "faisal" || id === "abdullah" ? -1 : 1, mood: "happy" };
    switch (id) {
      case "saud":
        if (frame < b.tap) return { arms: "chat", lean: -1, mood: "happy" };
        return writing ? { arms: "write", mood: "smile" } : { arms: "rest", mood: "o" };
      case "turki":
        if (frame < b.all) return { arms: "tap", mood: "smile" };
        return frame >= b.two && frame < b.thanks + 20 ? { arms: "rest", mood: "smile" } : { arms: "write", mood: "smile" };
      case "majed":
        if (frame < b.two) return { arms: "fold", down: 1, mood: "flat" };
        return frame < b.thanks + 20 ? { arms: "rest", down: 1 - progress(frame, b.two, 12), mood: "smile" } : { arms: "write", mood: "smile" };
      default:
        return writing ? { arms: "write", mood: "smile" } : { arms: "rest", mood: "smile" };
    }
  };
  const tx = interpolate(frame, [b.tap - 16, b.tap, b.praise - 14, b.praise], [TEACHER_X, 772, 772, 912], clamp);
  const tpose = frame >= b.praise ? "tap" : frame >= b.whisper ? "rest" : frame >= b.tap && frame < b.all ? "tap" : "ask";
  const rung = frame >= b.whisper ? 4 : frame >= b.two ? 3 : frame >= b.all ? 2 : frame >= b.look ? 1 : 0;
  const look = frame >= b.look && frame < b.tap ? progress(frame, b.look, 8) : 0;
  const [sx, sy] = headOf("saud", pose("saud"));
  return (
    <Page
      svg={
        <>
          <Board cut={progress(frame, b.cut, 36, (t) => t)} />
          <Floor />
          <MiniLadder rung={rung} seed={1400} />
          <Students pose={pose} tick={frame / 3} />
          <Teacher x={tx} y={1250} pose={tpose} seed={1410} />
          {look > 0 ? <path d={`M${TEACHER_X - 14},${1066} Q${(TEACHER_X + sx) / 2},${960} ${sx + 26},${sy - 6}`} stroke={C.olive} strokeWidth={4} strokeDasharray="4 12" strokeLinecap="round" fill="none" opacity={look} /> : null}
          {frame >= b.thirty ? <Timer x={110} y={612} d={92} p={progress(frame, b.thirty, 300, (t) => t)} seed={1420} /> : null}
        </>
      }
    >
      <BoardText />
      <Tag text="الأحد · نفس الفصل" />
      <Badge paused={false} progress={0.18 + 0.5 * (frame / total)} stopped={0} />
      {frame >= b.thirty ? (
        <At x={110} y={612}>
          <span style={{ fontFamily: TEXT, fontWeight: 600, fontSize: 26, color: C.ink }}>30 ث</span>
        </At>
      ) : null}
      <Bubble x={SAY.x} y={SAY.y} text="يعني البيتزا تنقسم 8…" from={b.cut - 20} to={b.look - 1} />
      <Label x={540} y={1330} text="بدون إضاءة" from={b.noLight} to={b.all - 1} color={C.sageText} size={32} />
      <Bubble x={SAY.x} y={SAY.y} text="يلا الكل، الأقلام تكتب." from={b.all - 12} to={b.two - 14} />
      <Bubble x={SAY.x} y={SAY.y} text="باقي اثنين يطالعون السبورة… شكراً." from={b.two - 12} to={b.partner - 12} size={34} />
      <Bubble x={SAY.x} y={SAY.y} text="التفت لزميلك… 30 ثانية… يلا!" from={b.partner - 10} to={b.whisper - 1} />
      <Label x={KIDS.saud.x} y={kidBubbleY("saud", pose("saud")) - 10} text="سعود، أبي قلمك يكتب…" from={b.whisper} to={b.whisperDone + 10} size={26} color={C.olive} />
      <Label x={KIDS.faisal.x - 10} y={kidBubbleY("faisal", pose("faisal")) - 10} text="كفو عليك!" from={b.praise} to={b.small + 30} size={28} color={C.goldText} />
      <Label x={540} y={1330} text="صحّحها وهي صغيرة" from={b.small} color={C.sageText} size={36} />
    </Page>
  );
};

export const Later: React.FC<{ timeline: Timeline }> = ({ timeline }) => {
  const frame = useCurrentFrame();
  const b = beats(timeline).later;
  const total = timeline.scenes.later.frames;
  const pose = (id: KidId): KidPose => {
    if (id === "saud" && frame >= b.joke && frame < b.shh + 30) return { arms: "up", mood: "happy" };
    if (id === "abdullah" && frame >= b.shh) return { arms: "chat", lean: 1, mood: "smile" };
    return { arms: "write", mood: "smile" };
  };
  return (
    <Page
      svg={
        <>
          <Board cut={1} served={progress(frame, 6, 18)} />
          <Floor />
          <MiniLadder rung={1} seed={1400} />
          <Students pose={pose} tick={frame / 3} />
          <Teacher x={TEACHER_X} y={1250} pose="point" seed={1500} />
        </>
      }
    >
      <BoardText />
      <Tag text="بعد أسبوعين" />
      <Badge paused={false} progress={0.8 + 0.15 * (frame / total)} stopped={0} />
      <Label x={KIDS.saud.x} y={kidBubbleY("saud", pose("saud")) - 60} text="شباب! مين يبي يسمع نكتة؟" from={b.joke} to={b.shh + 40} size={30} color={C.sageText} />
      <Label x={540} y={1330} text="فهد ما وقف" from={b.noStop} color={C.sageText} size={34} />
      <Label x={KIDS.abdullah.x - 30} y={kidBubbleY("abdullah", pose("abdullah")) + 4} text="اشش… خلّنا نشوف النهاية" from={b.shh} size={30} color={C.sageText} />
    </Page>
  );
};

export const End: React.FC<{ timeline: Timeline }> = ({ timeline }) => {
  const frame = useCurrentFrame();
  const b = beats(timeline).end;
  return (
    <StrategyCard
      name="أخفّ تدخّل"
      latin="Least Invasive Intervention"
      stamp={b.stamp}
      cardFrom={b.fix - 6}
      done={b.done}
      steps={[
        { text: "1. صحّحها وهي صغيرة.", color: C.ink, at: b.fix },
        { text: "2. وخلّ الدرس يمشي.", color: C.olive, at: b.keep },
      ]}
      mark={(top, height) => (
        <Sk
          seed={1600}
          opacity={progress(frame, b.keep, 8)}
          items={[
            { k: "circle", c: [250, top + height / 2], d: 64, fill: C.sageTint, stroke: C.sageText, width: 3 },
            { k: "poly", pts: [[240, top + height / 2 - 16], [266, top + height / 2], [240, top + height / 2 + 16]], fill: C.sageText, stroke: C.sageText, width: 2 },
          ]}
        />
      )}
      side={<Teacher x={990} y={1005} s={0.55} pose="hip" seed={1610} />}
    />
  );
};
