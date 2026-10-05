"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getDictionary, type Lang } from "@/lib/i18n/dictionaries";

export default function LoginForm({ lang }: { lang: Lang }) {
  const t = getDictionary(lang);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError(t.loginErr);
      return;
    }
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError(t.loginErr);
      return;
    }
    router.push("/admin/bookings");
    router.refresh();
  }

  return (
    <form onSubmit={submit}>
      <div className="field">
        <label>{t.fEmail}</label>
        <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="field">
        <label>{t.password}</label>
        <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      {error && <p className="login-error">{error}</p>}
      <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
        {t.signIn}
      </button>
    </form>
  );
}
