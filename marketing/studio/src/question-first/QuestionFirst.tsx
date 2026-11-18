import { Audio } from "@remotion/media";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { AbsoluteFill, staticFile } from "remotion";
import { C } from "../brand";
import { Grain } from "../components/Grain";
import { WobbleDefs } from "../components/Sketch";
import { Captions } from "../components/Words";
import { Hook, Later, Payoff, Sunday, Wednesday } from "./ClassScenes";
import { End } from "./End";
import { Friday, Saturday } from "./HomeScenes";
import type { SceneId, Timeline } from "./timeline";

const SCENES: readonly { id: SceneId; name: string; component: React.FC<{ timeline: Timeline }> }[] = [
  { id: "hook", name: "Hook", component: Hook },
  { id: "wednesday", name: "Wednesday", component: Wednesday },
  { id: "friday", name: "Friday", component: Friday },
  { id: "saturday", name: "Saturday", component: Saturday },
  { id: "sunday", name: "Sunday", component: Sunday },
  { id: "later", name: "Later", component: Later },
  { id: "payoff", name: "Payoff", component: Payoff },
  { id: "end", name: "End", component: End },
];

/** «السؤال قبل الاسم»: a class where only three hands go up; the name first switches twenty-nine students off; a
 *  grandfather's Friday quiz (question, a wait, then the name); and the class where nobody switches off. */
export const QuestionFirst: React.FC<{ timeline: Timeline }> = ({ timeline }) => (
  <AbsoluteFill style={{ backgroundColor: C.paper }}>
    <WobbleDefs />
    <TransitionSeries>
      {SCENES.flatMap(({ id, name, component: Scene }, i) => [
        ...(i ? [<TransitionSeries.Transition key={`${id}-in`} presentation={fade()} timing={linearTiming({ durationInFrames: timeline.transition })} />] : []),
        <TransitionSeries.Sequence key={id} name={name} durationInFrames={timeline.scenes[id].frames}>
          <Scene timeline={timeline} />
        </TransitionSeries.Sequence>,
      ])}
    </TransitionSeries>
    <Captions lines={timeline.lines} />
    <Grain opacity={0.035} />
    {timeline.lines.map((l) => (l.file ? <Audio key={l.id} src={staticFile(l.file)} from={l.from} /> : null))}
  </AbsoluteFill>
);

/** One scene alone, for the Studio's per-scene compositions. */
export const sceneAlone = (Scene: React.FC<{ timeline: Timeline }>) => {
  const Alone: React.FC<{ timeline: Timeline }> = ({ timeline }) => (
    <AbsoluteFill style={{ backgroundColor: C.paper }}>
      <WobbleDefs />
      <Scene timeline={timeline} />
    </AbsoluteFill>
  );
  return Alone;
};

export { SCENES as QUESTION_FIRST_SCENES };
