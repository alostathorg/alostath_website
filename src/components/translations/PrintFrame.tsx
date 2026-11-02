"use client";

import { useEffect } from "react";

/**
 * The page around a printable document. On screen: a toolbar and the A4 sheet
 * on a grey desk. In print: the sheet alone.
 *
 * The browser's own «Save as PDF» is what produces the file — it shapes Arabic
 * correctly, keeps the text selectable and searchable, and embeds the brand
 * font, which no JavaScript PDF library does reliably for RTL. The print
 * dialog opens by itself once the webfonts have loaded, so a click on «PDF»
 * in the dashboard is one more click from a saved file.
 */
export default function PrintFrame({
  draft = false,
  autoPrint = true,
  tools,
  children,
}: {
  /** Adds the «مسودة للمراجعة» watermark on every page. */
  draft?: boolean;
  autoPrint?: boolean;
  /** Extra toolbar links (e.g. the bilingual toggle). */
  tools?: React.ReactNode;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!autoPrint) return;
    let cancelled = false;
    const ready = (document as Document & { fonts?: FontFaceSet }).fonts?.ready ?? Promise.resolve();
    ready.then(() => {
      if (!cancelled) window.setTimeout(() => window.print(), 350);
    });
    return () => {
      cancelled = true;
    };
  }, [autoPrint]);

  return (
    <div className={`tp-desk${draft ? " is-draft" : ""}`}>
      <div className="tp-toolbar" role="toolbar">
        <button type="button" className="tp-toolbtn is-primary" onClick={() => window.print()}>
          حفظ PDF / طباعة
        </button>
        {tools}
        <span className="tp-toolhint">في نافذة الطباعة اختر «حفظ بتنسيق PDF» وجهةً للطباعة.</span>
      </div>
      {draft && (
        <div className="tp-watermark" aria-hidden>
          مسودة للمراجعة
        </div>
      )}
      <div className="tp-sheets">{children}</div>
    </div>
  );
}
