// Timing for «أخفّ تدخّل» (videos/02-fix-it-small): six scenes, one voice.
//   paused   01–09 the lesson plays until Fahd stops for Saud; the class dims, the badge reads «الدرس واقف» and counts;
//                  Turki's tapping, Majed's head; a paper plane; twelve minutes on, the pizza is still whole
//   cinema   10–14 Thursday: the film plays on through a phone and a kicked seat; the usher whispers; Fahd sees it
//   ladder   15    the intervention ladder: stay low on it, keep the film playing
//   playing  16–24 Sunday, the same class: a look, a tap, «يلا الكل», «باقي اثنين», partners, a whisper, praise; the
//                  pizza gets cut and the lesson never stops
//   later    25–28 two weeks on: Saud's joke, and Abdullah: «اشش… خلّنا نشوف النهاية»
//   end      29    «أخفّ تدخّل» (Least Invasive Intervention): صحّحها وهي صغيرة، وخلّ الدرس يمشي
//
// Until the voice exists (~/Movies/Al-Ostath Marketing/02-fix-it-small/lines, then `npm run prep`), every line is
// timed by an estimate from its length; the beats are keyed on words, so they follow the real read.
import script from "../../../videos/02-fix-it-small/script.json";
import { buildTimeline as build, type Line, type Manifest, type ScenePlan, type Timeline as Base, wordFrame } from "../lib/timeline";

export const VIDEO = "02-fix-it-small";
export type SceneId = "paused" | "cinema" | "ladder" | "playing" | "later" | "end";
export type Timeline = Base<SceneId>;

export const TRANSITION = 10;

const PLAN: ScenePlan<SceneId>[] = [
  {
    id: "paused",
    min: 26,
    tail: 1.1,
    lines: [{ id: "01", at: 0.8 }, { id: "02", gap: 0.5 }, { id: "03", gap: 0.3 }, { id: "04", gap: 0.3 }, { id: "05", gap: 0.5 }, { id: "06", gap: 0.5 }, { id: "07", gap: 0.5 }, { id: "08", gap: 0.5 }, { id: "09", gap: 0.6 }],
  },
  { id: "cinema", min: 13, tail: 0.8, lines: [{ id: "10", at: 0.6 }, { id: "11", gap: 0.4 }, { id: "12", gap: 0.4 }, { id: "13", gap: 0.5 }, { id: "14", gap: 0.4 }] },
  { id: "ladder", min: 5.5, tail: 1.3, lines: [{ id: "15", at: 1.0 }] },
  {
    id: "playing",
    min: 24,
    tail: 1.0,
    lines: [{ id: "16", at: 0.6 }, { id: "17", gap: 0.5 }, { id: "18", gap: 0.4 }, { id: "19", gap: 0.4 }, { id: "20", gap: 0.4 }, { id: "21", gap: 0.4 }, { id: "22", gap: 0.5 }, { id: "23", gap: 0.5 }, { id: "24", gap: 0.5 }],
  },
  { id: "later", min: 8, tail: 1.3, lines: [{ id: "25", at: 0.6 }, { id: "26", gap: 0.4 }, { id: "27", gap: 0.4 }, { id: "28", gap: 0.4 }] },
  { id: "end", min: 7, tail: 2.6, lines: [{ id: "29", at: 0.6 }] },
];

export const buildTimeline = (manifest: Manifest | null): Timeline => build(script, PLAN, manifest, TRANSITION);
export const PLANNED = buildTimeline(null);

const end = (l: Line) => l.from + l.frames;

/** Story beats, in frames from their scene's start, on the spoken words (real timings once the voice is aligned,
 *  estimates until then). Words are matched without tashkeel. */
export function beats(t: Timeline) {
  const L = (s: SceneId, id: string) => {
    const line = t.scenes[s].lines.find((l) => l.id === id);
    if (!line) throw new Error(`no line ${id} in ${s}`);
    return line;
  };
  const at = (s: SceneId, id: string, word: string) => wordFrame(L(s, id), word);
  const start = (s: SceneId, id: string) => L(s, id).from;
  const done = (s: SceneId, id: string) => end(L(s, id));
  return {
    paused: {
      teach: start("paused", "02"),
      pause: at("paused", "03", "سعود"),
      who: start("paused", "04"),
      others: at("paused", "05", "التسعة"),
      turki: at("paused", "06", "تركي"),
      majed: at("paused", "07", "ماجد"),
      up: at("paused", "07", "ارفع"),
      plane: at("paused", "08", "ثاني"),
      later: at("paused", "09", "ثنعش"),
      pizza: at("paused", "09", "البيتزا"),
    },
    cinema: {
      phone: at("cinema", "11", "جوال"),
      kick: at("cinema", "11", "يرفس"),
      usher: at("cinema", "11", "والموظف"),
      noStop: at("cinema", "11", "يوقف"),
      whisper: start("cinema", "12"),
      thanks: at("cinema", "12", "مشكور"),
      fahd: start("cinema", "14"),
    },
    ladder: { line: start("ladder", "15"), low: at("ladder", "15", "تحت"), playing: at("ladder", "15", "شغال"), done: done("ladder", "15") },
    playing: {
      same: start("playing", "16"),
      cut: at("playing", "17", "تنقسم"),
      look: at("playing", "18", "نظرة"),
      tap: at("playing", "18", "لمسة"),
      noLight: at("playing", "18", "الضوء"),
      all: at("playing", "19", "الأقلام"),
      two: at("playing", "20", "اثنين"),
      thanks: at("playing", "20", "شكرا"),
      partner: at("playing", "21", "التفت"),
      thirty: at("playing", "21", "ثلاثين"),
      whisper: start("playing", "22"),
      whisperDone: done("playing", "22"),
      praise: at("playing", "23", "مدح"),
      small: at("playing", "24", "تصحيح"),
    },
    later: { line: start("later", "25"), joke: start("later", "26"), noStop: at("later", "27", "يوقف"), shh: start("later", "28") },
    end: { stamp: at("end", "29", "أخف"), fix: at("end", "29", "صححها"), keep: at("end", "29", "وخل"), done: done("end", "29") },
  };
}
export type Beats = ReturnType<typeof beats>;
