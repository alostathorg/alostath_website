import { permanentRedirect } from "next/navigation";
import { AWARD_PATH } from "@/lib/award";

// There is one award and /awards is its page. Old per-award URLs
// (/awards/resha, /awards/qissa, …) and shared links land there.
export default function AwardSlugRedirect() {
  permanentRedirect(AWARD_PATH);
}
