// The end card: the strategy's name stamped in olive, its three steps, the foundation's logo and its site.
import { Img, interpolate, useCurrentFrame } from "remotion";
import { asset, C, LOGO, logoWidth, MONO, TEXT } from "../brand";
import { Teacher } from "../components/People";
import { Box, Sk } from "../components/Sketch";
import { Bulb } from "../components/Things";
import { At } from "../components/Words";
import { clamp, easeOut, progress } from "../lib/motion";
import { Page } from "./ClassScenes";
import { beats, type Timeline } from "./timeline";

const STEPS = [
  { text: "1. اسأل.", color: C.ink, key: "ask" as const },
  { text: "2. انتظر.", color: C.goldText, key: "wait" as const },
  { text: "3. ثم قل الاسم.", color: C.olive, key: "name" as const },
];

export const End: React.FC<{ timeline: Timeline }> = ({ timeline }) => {
  const frame = useCurrentFrame();
  const b = beats(timeline).end;
  const stamp = interpolate(frame, [b.stamp, b.stamp + 7], [0, 1], { ...clamp, easing: easeOut });
  const card = progress(frame, b.ask - 6, 8);
  const brand = progress(frame, b.done + 4, 14);
  return (
    <Page
      svg={
        <>
          {card > 0 ? (
            <g opacity={card}>
              <Sk seed={700} items={[{ k: "rect", x: 170, y: 735, w: 740, h: 270, fill: C.sheet, stroke: C.olive, width: 3.4 }]} />
              <Sk seed={701} still items={[815, 895].map((y) => ({ k: "line" as const, a: [190, y] as [number, number], b: [890, y] as [number, number], stroke: C.hairline, width: 2 }))} />
              <Bulb x={250} y={858} r={24} on={progress(frame, b.wait, 8)} seed={702} />
            </g>
          ) : null}
          <g opacity={card}>
            <Teacher x={990} y={1005} s={0.55} pose="hip" seed={710} />
          </g>
        </>
      }
    >
      <At x={540} y={455} style={{ opacity: progress(frame, 0, 10) }}>
        <span style={{ fontFamily: TEXT, fontWeight: 500, fontSize: 36, color: C.inkSubtle }}>استراتيجية صفّية</span>
      </At>
      <At x={540} y={585} style={{ opacity: stamp, scale: String(1.3 - 0.3 * stamp) }}>
        <Box border={C.olive} width={5} pad="10px 40px 18px" tilt={-3} fill={C.paper}>
          <span style={{ fontFamily: TEXT, fontWeight: 700, fontSize: 78, color: C.olive }}>السؤال قبل الاسم</span>
        </Box>
      </At>
      <At x={540} y={686} style={{ opacity: stamp, direction: "ltr" }}>
        <span style={{ fontFamily: MONO, fontWeight: 500, fontSize: 28, color: C.inkSubtle }}>Cold Call</span>
      </At>
      {STEPS.map((s, n) => (
        <At key={s.key} x={850} y={[778, 858, 938][n]} anchor="right" style={{ opacity: progress(frame, b[s.key], 7) }}>
          <span style={{ fontFamily: TEXT, fontWeight: 600, fontSize: 44, color: s.color }}>{s.text}</span>
        </At>
      ))}
      <At x={540} y={1120} style={{ opacity: brand }}>
        <Img src={asset(LOGO.file)} style={{ width: logoWidth(300), display: "block" }} />
      </At>
      <At x={540} y={1232} style={{ opacity: brand, direction: "ltr" }}>
        <span style={{ fontFamily: MONO, fontWeight: 500, fontSize: 32, color: C.olive }}>ostath.sa</span>
      </At>
      <At x={540} y={1305} style={{ opacity: brand }}>
        <span style={{ fontFamily: TEXT, fontWeight: 400, fontSize: 24, color: C.inkSubtle }}>
          مستوحاة من كتاب <span style={{ direction: "ltr", unicodeBidi: "isolate" }}>Teach Like a Champion</span> لدوغ ليموف
        </span>
      </At>
    </Page>
  );
};
