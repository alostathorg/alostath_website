import { WORDS_GOAL, formatCount, goalPercent } from "@/lib/translations";

/**
 * «مليون كلمة» — published Arabic words against the goal. The figures come
 * from translations_totals() (published rows only), so a draft never moves it.
 */
export default function WordsCounter({
  words,
  items,
  tone = "dark",
}: {
  words: number;
  items: number;
  tone?: "dark" | "light";
}) {
  const pct = goalPercent(words);
  return (
    <div className={`tl-counter${tone === "light" ? " is-light" : ""}`}>
      <div className="tl-counter-num">
        <strong>{formatCount(words)}</strong>
        <span>كلمة مترجمة من أصل {formatCount(WORDS_GOAL)}</span>
      </div>
      <div className="tl-counter-bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label="التقدّم نحو مليون كلمة">
        <span style={{ width: `${pct}%` }} />
      </div>
      <div className="tl-counter-foot">
        <span>{formatCount(items)} مادة منشورة</span>
        <span>{pct}% من الهدف</span>
      </div>
    </div>
  );
}
