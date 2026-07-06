"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError("تعذّر تسجيل الدخول — تحقّق من البريد وكلمة المرور.");
      return;
    }
    router.replace(params.get("next") || "/admin");
    router.refresh();
  }

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "var(--surface-1)", padding: 24 }}>
      <form onSubmit={onSubmit} style={{ width: "100%", maxWidth: 380, background: "var(--canvas)", border: "1px solid var(--hairline)", borderRadius: 18, padding: 36 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/alostath-logo.png" alt="مؤسسة الأستاذ" style={{ height: 44, marginBottom: 24 }} />
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 6px" }}>لوحة التحكم</h1>
        <p style={{ fontSize: 14, color: "var(--text-muted)", margin: "0 0 24px" }}>سجّل الدخول لإدارة محتوى الموقع.</p>
        <label style={{ display: "block", fontSize: 14, fontWeight: 500, marginBottom: 6 }}>البريد الإلكتروني</label>
        <input className="ct-field" type="email" dir="ltr" required value={email} onChange={(e) => setEmail(e.target.value)} style={{ marginBottom: 16, textAlign: "left" }} />
        <label style={{ display: "block", fontSize: 14, fontWeight: 500, marginBottom: 6 }}>كلمة المرور</label>
        <input className="ct-field" type="password" dir="ltr" required value={password} onChange={(e) => setPassword(e.target.value)} style={{ marginBottom: 20, textAlign: "left" }} />
        {error && <div style={{ fontSize: 14, color: "#b3261e", marginBottom: 16 }}>{error}</div>}
        <button type="submit" className="btn btn-primary btn-lg" style={{ width: "100%" }} disabled={loading}>
          {loading ? "جارٍ الدخول…" : "دخول"}
        </button>
      </form>
    </div>
  );
}
