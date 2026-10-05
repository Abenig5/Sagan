"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { getDictionary, type Lang } from "@/lib/i18n/dictionaries";
import { parseIso, todayIso, type Iso } from "@/lib/dates";
import { addClosure, removeClosure } from "@/lib/actions/availability";
import PageHeader from "./PageHeader";

interface ClosureLite {
  id: string;
  from: Iso;
  to: Iso;
  note: string | null;
}

export default function ClosuresView({ lang, closures }: { lang: Lang; closures: ClosureLite[] }) {
  const t = getDictionary(lang);
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [cFrom, setCFrom] = useState("");
  const [cTo, setCTo] = useState("");
  const [cNote, setCNote] = useState("");

  const today = todayIso();
  const canAdd = !!cFrom && !!cTo && cTo >= cFrom;
  const upcoming = closures.filter((c) => c.to >= today).sort((a, b) => a.from.localeCompare(b.from));

  function add(e: React.FormEvent) {
    e.preventDefault();
    if (!canAdd) return;
    startTransition(async () => {
      await addClosure(cFrom, cTo, cNote);
      setCFrom("");
      setCTo("");
      setCNote("");
      router.refresh();
    });
  }

  function remove(id: string) {
    startTransition(async () => {
      await removeClosure(id);
      router.refresh();
    });
  }

  return (
    <div>
      <PageHeader title={t.adminNav.closures} description={t.closuresNote} />

      <section className="admin-card">
        <h2 className="admin-card__title">{t.addClosure}</h2>
        <form className="closures-form" onSubmit={add}>
          <div className="field">
            <label htmlFor="c-from">{t.fromL}</label>
            <input
              id="c-from"
              className="input"
              type="date"
              min={today}
              value={cFrom}
              onChange={(e) => {
                setCFrom(e.target.value);
                if (!cTo || cTo < e.target.value) setCTo(e.target.value);
              }}
            />
          </div>
          <div className="field">
            <label htmlFor="c-to">{t.toL}</label>
            <input id="c-to" className="input" type="date" min={cFrom || today} value={cTo} onChange={(e) => setCTo(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="c-note">{t.noteL}</label>
            <input id="c-note" className="input" placeholder={t.notePh} value={cNote} onChange={(e) => setCNote(e.target.value)} />
          </div>
          <button className="btn btn-primary" type="submit" disabled={!canAdd || pending}>
            + {t.addClosure}
          </button>
        </form>
      </section>

      <section className="admin-card">
        <h2 className="admin-card__title">{t.adminNav.closures}</h2>
        {upcoming.length === 0 ? (
          <p className="times-hint">{t.noClosures}</p>
        ) : (
          upcoming.map((c) => (
            <div key={c.id} className="closure-row">
              <span>
                <strong className="tabular-nums">
                  {c.from === c.to ? shortDate(c.from, t, lang) : `${shortDate(c.from, t, lang)} – ${shortDate(c.to, t, lang)}`}
                </strong>
                {c.note ? <span className="vat-note"> · {c.note}</span> : null}
              </span>
              <button className="btn btn-ghost btn-sm" onClick={() => remove(c.id)} disabled={pending}>
                {t.remove}
              </button>
            </div>
          ))
        )}
      </section>
    </div>
  );
}

function shortDate(date: Iso, t: ReturnType<typeof getDictionary>, lang: Lang) {
  const dt = parseIso(date);
  return `${dt.getDate()}${lang === "de" ? "." : ""} ${t.months[dt.getMonth()]} ${dt.getFullYear()}`;
}
