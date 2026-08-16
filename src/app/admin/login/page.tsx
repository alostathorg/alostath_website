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
    <div className="admin-login">
      <form onSubmit={onSubmit} className="admin-login-card">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/alostath-logo.png" alt="مؤسسة الأستاذ" />
        <h1 className="admin-title" style={{ fontSize: 22 }}>لوحة التحكم</h1>
        <p className="admin-subtitle" style={{ margin: "6px 0 24px" }}>سجّل الدخول لإدارة محتوى الموقع.</p>

        <div className="admin-field" style={{ marginBottom: 16 }}>
          <label className="admin-label">البريد الإلكتروني</label>
          <input className="admin-input is-ltr" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" />
        </div>
        <div className="admin-field" style={{ marginBottom: 22 }}>
          <label className="admin-label">كلمة المرور</label>
          <input className="admin-input is-ltr" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        </div>

        {error && <div className="admin-error">{error}</div>}

        <button type="submit" className="admin-btn admin-btn-primary admin-btn-block" disabled={loading}>
          {loading ? "جارٍ الدخول…" : "دخول"}
        </button>
      </form>
    </div>
  );
}
