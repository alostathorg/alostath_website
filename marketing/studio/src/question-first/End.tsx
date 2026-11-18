// The end card: «السؤال قبل الاسم» (Cold Call) and its three steps; the bulb lights on «انتظر».
import { useCurrentFrame } from "remotion";
import { C } from "../brand";
import { Teacher } from "../components/People";
import { StrategyCard } from "../components/StrategyCard";
import { Bulb } from "../components/Things";
import { progress } from "../lib/motion";
import { beats, type Timeline } from "./timeline";

export const End: React.FC<{ timeline: Timeline }> = ({ timeline }) => {
  const frame = useCurrentFrame();
  const b = beats(timeline).end;
  return (
    <StrategyCard
      name="السؤال قبل الاسم"
      latin="Cold Call"
      stamp={b.stamp}
      cardFrom={b.ask - 6}
      done={b.done}
      steps={[
        { text: "1. اسأل.", color: C.ink, at: b.ask },
        { text: "2. انتظر.", color: C.goldText, at: b.wait },
        { text: "3. ثم قل الاسم.", color: C.olive, at: b.name },
      ]}
      mark={(top, height) => <Bulb x={250} y={top + height / 2 - 12} r={24} on={progress(frame, b.wait, 8)} seed={702} />}
      side={<Teacher x={990} y={1005} s={0.55} pose="hip" seed={710} />}
    />
  );
};
