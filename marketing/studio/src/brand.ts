// Al-Ostath's look for video, from the site's tokens (src/styles/tokens/colors.css, fonts.css, typography.css) and its
// press kit (/press): the six official colours, IBM Plex Sans Arabic for all type and IBM Plex Mono for figures.
// `npm run prep` copies the typefaces and the logos into public/.
//
// The drawn videos use the ivory as paper and the ink for every line; olive carries structure (the board, the
// teacher's words, the stamp), gold carries light and celebration (a lit bulb, a hand that rises), sage carries the
// supporting voice (a tick, the student's words). Rust is the site's error colour: a bulb that panics, and the red
// checks of a shemagh, nothing else.
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const C = {
  /** العاجي الفاتح: the paper every scene is drawn on. */
  paper: "#F4F6EE",
  /** A sheet on the paper: notebook pages, caption boxes, bubbles. */
  sheet: "#FFFFFF",
  /** surface-3 and hairline-strong: a second surface, and quiet rules on paper. */
  surface: "#E9ECDF",
  hairline: "#D4D7C7",
  /** الحبر: every line of the drawing, and type. */
  ink: "#23271A",
  inkMuted: "#4F5443",
  inkSubtle: "#868B73",
  /** Disabled ink: an unlit bulb, words not yet spoken. */
  inkFaint: "#ABAF9C",
  /** الزيتوني and الزيتوني الداكن (the board). */
  olive: "#4E5B30",
  oliveDeep: "#1E2814",
  oliveTint: "#E7EADD",
  /** الذهبي: light. gold-700 when gold carries text on light. */
  gold: "#BF9B2F",
  goldText: "#8C7019",
  goldTint: "#F2E7BE",
  goldSoft: "#FBF6E7",
  /** المريمي. sage-700 when it carries text. */
  sage: "#78A183",
  sageText: "#4C7256",
  sageTint: "#DCE6DF",
  /** The site's error colour, and a tint of it on paper. */
  rust: "#A4442E",
  rustTint: "#EBCFC6",
} as const;

/** IBM Plex Sans Arabic: every word on screen. Weight carries the hierarchy; letter-spacing stays 0. */
export const TEXT = "Ostath Sans";
/** IBM Plex Mono: figures and values. */
export const MONO = "Ostath Mono";

// loadFont() holds every frame (delayRender) until its font is ready, so nothing here needs awaiting.
for (const [file, weight] of [
  ["IBMPlexSansArabic-Regular.ttf", "400"],
  ["IBMPlexSansArabic-Medium.ttf", "500"],
  ["IBMPlexSansArabic-SemiBold.ttf", "600"],
  ["IBMPlexSansArabic-Bold.ttf", "700"],
] as const) {
  loadFont({ family: TEXT, url: staticFile(`fonts/${file}`), weight });
}
for (const [file, weight] of [
  ["IBMPlexMono-Regular.ttf", "400"],
  ["IBMPlexMono-Medium.ttf", "500"],
  ["IBMPlexMono-SemiBold.ttf", "600"],
] as const) {
  loadFont({ family: MONO, url: staticFile(`fonts/${file}`), weight });
}

/** The site's brand files, as `npm run prep` copies them from public/assets. */
export const asset = (name: string) => staticFile(`site/assets/${name}`);

/** The full logo (alostath-logo.png, 5405 × 3338) draws its lockup in a centred box 3497 × 1584 px wide; the header
 *  file is cropped so tight that it clips the «ذ». [logoWidth] is the image width that shows the lockup [w] px wide. */
export const LOGO = { file: "alostath-logo.png", inverse: "alostath-logo-inverse.png", visible: 3497 / 5405 };
export const logoWidth = (w: number) => w / LOGO.visible;
