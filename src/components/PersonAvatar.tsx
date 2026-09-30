import { monogram, type Person } from "@/lib/org";

/** A board member's portrait, or a monogram when the profile has no photo. */
export default function PersonAvatar({ person, size, radius }: { person: Person; size: number; radius: number | string }) {
  const frame = {
    width: size,
    height: size,
    borderRadius: radius,
    border: "3px solid var(--canvas)",
    boxShadow: "0 4px 12px rgba(35,39,26,0.10)",
  } as const;
  if (person.img) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={person.img} alt={person.name} style={{ ...frame, objectFit: "cover" }} />;
  }
  return (
    <div
      role="img"
      aria-label={person.name}
      style={{
        ...frame,
        background: "var(--olive-900)",
        color: "var(--gold-500)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.4,
        fontWeight: 700,
      }}
    >
      {monogram(person.name)}
    </div>
  );
}
