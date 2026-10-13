/**
 * The «how we choose» band that sits right under an index hero — the
 * partners' three criteria, the initiatives' three conditions. A heading
 * column and a numbered spec row on hairlines, rather than three loose
 * boxed cards on a grey strip.
 */
export default function CriteriaBand({
  title,
  note,
  items,
}: {
  title: string;
  note?: string;
  items: { t: string; d: string }[];
}) {
  return (
    <section className="crit">
      <div className="crit-in" data-reveal="1">
        <div className="crit-head">
          <h2>{title}</h2>
          {note && <p>{note}</p>}
        </div>
        <ol className="crit-list">
          {items.map((c, i) => (
            <li key={c.t} className="crit-item">
              <span className="crit-num">{String(i + 1).padStart(2, "0")}</span>
              <h3>{c.t}</h3>
              <p>{c.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
