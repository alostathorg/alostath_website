"use client";

import { useEffect, useState } from "react";

/**
 * The dossier's table of contents: sticky beside the chapters on a desktop,
 * marking the chapter in view. Plain anchor links, so it works before (and
 * without) this script.
 */
export default function AwardToc({ chapters }: { chapters: { id: string; t: string }[] }) {
  const [active, setActive] = useState(chapters[0]?.id);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: "-20% 0px -65% 0px" },
    );
    chapters.forEach((c) => {
      const el = document.getElementById(c.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [chapters]);

  return (
    <nav className="aw-toc" aria-label="فصول الوثيقة">
      <div className="aw-toc-k">فصول الوثيقة</div>
      <ol>
        {chapters.map((c, i) => (
          <li key={c.id}>
            <a href={`#${c.id}`} className={active === c.id ? "is-active" : undefined} aria-current={active === c.id ? "location" : undefined}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              {c.t}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
