import { Audio } from "@remotion/media";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { AbsoluteFill, staticFile } from "remotion";
import { C } from "../brand";
import { Grain } from "../components/Grain";
import { WobbleDefs } from "../components/Sketch";
import { Captions } from "../components/Words";
import { Cinema, End, Ladder, Later, Paused, Playing } from "./Scenes";
import type { SceneId, Timeline } from "./timeline";

const SCENES: readonly { id: SceneId; name: string; component: React.FC<{ timeline: Timeline }> }[] = [
  { id: "paused", name: "Paused", component: Paused },
  { id: "cinema", name: "Cinema", component: Cinema },
  { id: "ladder", name: "Ladder", component: Ladder },
  { id: "playing", name: "Playing", component: Playing },
  { id: "later", name: "Later", component: Later },
  { id: "end", name: "End", component: End },
];

/** «أخفّ تدخّل»: a lesson that stops for every student while the pizza stays whole; a film the usher never stops; the
 *  intervention ladder; and the same class fixed small, the lesson playing to its end. */
export const FixItSmall: React.FC<{ timeline: Timeline }> = ({ timeline }) => (
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

export { SCENES as FIX_IT_SMALL_SCENES };
