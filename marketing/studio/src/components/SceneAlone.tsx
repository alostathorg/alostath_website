import { AbsoluteFill } from "remotion";
import { C } from "../brand";
import { WobbleDefs } from "./Sketch";

/** One scene of a video alone, for the Studio's per-scene compositions. */
export function sceneAlone<T>(Scene: React.FC<{ timeline: T }>) {
  const Alone: React.FC<{ timeline: T }> = ({ timeline }) => (
    <AbsoluteFill style={{ backgroundColor: C.paper }}>
      <WobbleDefs />
      <Scene timeline={timeline} />
    </AbsoluteFill>
  );
  return Alone;
}
