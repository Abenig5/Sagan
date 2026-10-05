"use client";

import { useState } from "react";
import { getDictionary, type Lang } from "@/lib/i18n/dictionaries";

export default function ContactForm({ lang }: { lang: Lang }) {
  const t = getDictionary(lang);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const canSend = name.trim().length > 1 && email.includes("@") && message.trim().length > 0;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSend || sending) return;
    setSending(true);
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      setSent(true);
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div className="card" style={{ borderColor: "var(--color-accent)" }}>
        <h3 className="card-title">{t.msgTitle}</h3>
        <p className="card-body">{t.msgThanks}</p>
      </div>
    );
  }

  return (
    <form className="card" onSubmit={submit} style={{ gap: 14 }}>
      <h3 className="card-title">{t.msgTitle}</h3>
      <div className="field">
        <label>{t.name}</label>
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="field">
        <label>{t.fEmail}</label>
        <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="field">
        <label>{t.message}</label>
        <textarea className="input" value={message} onChange={(e) => setMessage(e.target.value)} />
      </div>
      <button type="submit" className="btn btn-primary btn-block" disabled={!canSend || sending}>
        {t.sendMsg}
      </button>
    </form>
  );
}
