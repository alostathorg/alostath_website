import Link from "next/link";
import type { Translation } from "@/lib/types";
import { formatArabicDate } from "@/lib/format";
import { TRANSLATIONS_PATH, formatCount, modeLabel, sourceOf } from "@/lib/translations";

/** One line of the /translations list. The source is named before the click. */
export default function TranslationRow({ item }: { item: Translation }) {
  const src = sourceOf(item).name;
  return (
    <Link href={`${TRANSLATIONS_PATH}/${item.slug}`} className="tl-row">
      <div className="tl-row-meta">
        {item.category && <span className="tl-chip">{item.category}</span>}
        <span className={`tl-chip ${item.mode === "full" ? "is-gold" : "is-sage"}`}>{modeLabel(item.mode)}</span>
      </div>
      <h3 className="tl-row-title">{item.title}</h3>
      {item.original_title && <div className="tl-row-orig" dir="ltr">{item.original_title}</div>}
      {item.excerpt && <p className="tl-row-excerpt">{item.excerpt}</p>}
      <div className="tl-row-foot">
        {src && <span className="tl-src">{src}</span>}
        <span>{formatCount(item.word_count)} كلمة</span>
        {item.published_at && <span>{formatArabicDate(item.published_at)}</span>}
      </div>
    </Link>
  );
}
