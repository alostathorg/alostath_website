import { AbsoluteFill, useCurrentFrame } from "remotion";

/** A fine, moving film grain over the whole frame: texture that keeps flat colour from feeling digital. */
export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.06 }) => {
  const seed = Math.floor(useCurrentFrame() / 2) % 12;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "overlay", opacity }}>
      <svg width="1080" height="1920" viewBox="0 0 1080 1920">
        <filter id={`grain-${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={seed} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="1080" height="1920" filter={`url(#grain-${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};
