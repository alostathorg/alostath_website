import { AbsoluteFill } from "remotion";
import { C } from "../brand";
import { Canvas } from "./Sketch";

/** A scene on the paper: its drawing in the full-frame SVG, and HTML (type, bubbles) above it. */
export const Page: React.FC<{ svg?: React.ReactNode; children?: React.ReactNode; background?: string }> = ({ svg, children, background = C.paper }) => (
  <AbsoluteFill style={{ backgroundColor: background }}>
    <Canvas>{svg}</Canvas>
    {children}
  </AbsoluteFill>
);
