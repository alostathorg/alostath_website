// Timing for «السؤال قبل الاسم» (videos/01-question-first): eight scenes, four voices.
//   hook       01 thirty bulbs, one per student; at «مين يعرف؟» twenty-seven go out
//   wednesday  02–05 three hands, always the same three; then the name first, and twenty-nine bulbs go out
//   friday     06–11 the family's Friday at the grandfather's: question, a wait, then the name; «هدية مو فخ»
//   saturday   12–13 the night before: names written next to the questions, an easy one first for Abdullah
//   sunday     14–21 «أي أحد ممكن أسأله»: question, two seconds, thirty bulbs; Abdullah, then every corner
//   later      22 ten minutes on, a hand goes up: Abdullah's, the first time this term
//   payoff     23 when anyone might be asked, everyone thinks
//   end        24 the strategy: «السؤال قبل الاسم» · اسأل، انتظر، ثم قل الاسم; the logo
//
// Until the voices exist (~/Movies/Al-Ostath Marketing/01-question-first/lines, then `npm run prep`), every line is
// timed by an estimate from its length; the beats below are keyed on words, so they follow the real read.
import script from "../../../videos/01-question-first/script.json";
import { buildTimeline as build, type Line, type Manifest, type ScenePlan, type Timeline as Base, wordFrame } from "../lib/timeline";

export const VIDEO = "01-question-first";
export type SceneId = "hook" | "wednesday" | "friday" | "saturday" | "sunday" | "later" | "payoff" | "end";
export type Timeline = Base<SceneId>;

/** Frames of each crossfade between scenes. */
export const TRANSITION = 10;

const PLAN: ScenePlan<SceneId>[] = [
  { id: "hook", min: 5, tail: 0.7, lines: [{ id: "01", at: 0.6 }] },
  { id: "wednesday", min: 12, tail: 0.9, lines: [{ id: "02", at: 0.7 }, { id: "03", gap: 0.5 }, { id: "04", gap: 0.6 }, { id: "05", gap: 0.4 }] },
  { id: "friday", min: 18, tail: 1.2, lines: [{ id: "06", at: 0.6 }, { id: "07", gap: 0.5 }, { id: "08", gap: 2.2 }, { id: "09", gap: 0.4 }, { id: "10", gap: 0.6 }, { id: "11", gap: 0.8 }] },
  { id: "saturday", min: 8, tail: 1.2, lines: [{ id: "12", at: 0.6 }, { id: "13", gap: 0.6 }] },
  {
    id: "sunday",
    min: 22,
    tail: 1.1,
    lines: [{ id: "14", at: 0.6 }, { id: "15", gap: 0.6 }, { id: "16", gap: 0.5 }, { id: "17", gap: 0.5 }, { id: "18", gap: 0.4 }, { id: "19", gap: 0.4 }, { id: "20", gap: 0.5 }, { id: "21", gap: 0.6 }],
  },
  { id: "later", min: 7, tail: 1.4, lines: [{ id: "22", at: 0.6 }] },
  { id: "payoff", min: 5, tail: 1.3, lines: [{ id: "23", at: 0.5 }] },
  { id: "end", min: 7, tail: 2.6, lines: [{ id: "24", at: 0.6 }] },
];

export const buildTimeline = (manifest: Manifest | null): Timeline => build(script, PLAN, manifest, TRANSITION);
export const PLANNED = buildTimeline(null);

const end = (l: Line) => l.from + l.frames;

/** Story beats, in frames from their scene's start, on the speakers' words (real timings once the voices are aligned,
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
    hook: { who: at("hook", "01", "مين"), off: at("hook", "01", "سبعة"), offDone: done("hook", "01") },
    wednesday: {
      ask: start("wednesday", "02"),
      askDone: done("wednesday", "02"),
      hands: at("wednesday", "03", "ثلاث"),
      same: at("wednesday", "03", "نفس"),
      reset: at("wednesday", "03", "فجرب"),
      named: start("wednesday", "04"),
      off: at("wednesday", "05", "تسعة"),
      notMe: at("wednesday", "05", "مو"),
      red: at("wednesday", "05", "أحمر"),
    },
    friday: {
      quiz: start("friday", "06"),
      ask: start("friday", "07"),
      spider: at("friday", "07", "للعنكبوت"),
      wait: done("friday", "07"),
      name: start("friday", "08"),
      eight: at("friday", "09", "ثمان"),
      capitals: at("friday", "10", "عواصم"),
      capitalsDone: done("friday", "10"),
      q: at("friday", "11", "السؤال"),
      w: at("friday", "11", "انتظار"),
      n: at("friday", "11", "الاسم"),
      smile: at("friday", "11", "ابتسامة"),
      gift: at("friday", "11", "هدية"),
      trap: at("friday", "11", "فخ"),
    },
    saturday: { write: at("saturday", "12", "يكتب"), easy: at("saturday", "13", "سهل"), abdullah: at("saturday", "13", "لعبدالله"), corners: at("saturday", "13", "زاوية") },
    sunday: {
      rule: start("sunday", "14"),
      ask: start("sunday", "15"),
      askDone: done("sunday", "15"),
      two: at("sunday", "16", "ثانيتين"),
      thirty: at("sunday", "16", "ثلاثين"),
      name: start("sunday", "17"),
      answer: start("sunday", "18"),
      how: start("sunday", "19"),
      right: at("sunday", "20", "صح"),
      faisal: at("sunday", "20", "فيصل"),
      back: at("sunday", "20", "الأخير"),
      window: at("sunday", "20", "الشباك"),
      none: start("sunday", "21"),
    },
    later: { next: at("later", "22", "يسأل"), hand: at("later", "22", "وترتفع"), abdullah: at("later", "22", "عبدالله"), first: at("later", "22", "لأول") },
    payoff: { anyone: start("payoff", "23"), think: at("payoff", "23", "يفكرون") },
    end: { stamp: at("end", "24", "السؤال"), ask: at("end", "24", "اسأل"), wait: at("end", "24", "انتظر"), name: at("end", "24", "قول"), done: done("end", "24") },
  };
}
export type Beats = ReturnType<typeof beats>;
