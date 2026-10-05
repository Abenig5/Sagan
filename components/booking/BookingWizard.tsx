"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getDictionary, type Lang } from "@/lib/i18n/dictionaries";
import {
  CATEGORIES,
  fromPriceForCategory,
  getService,
  groupedServices,
  priceLabel,
  priceRangeLabel,
  serviceName,
  type CategoryId,
} from "@/lib/data/catalogue";
import { dateLabel } from "@/lib/format";
import type { Iso, HM } from "@/lib/dates";
import Calendar from "./Calendar";
import TimesPanel from "./TimesPanel";
import { submitBooking } from "@/lib/actions/booking";

interface Draft {
  categoryId: CategoryId | null;
  serviceId: string | null;
  hairLength: number | null;
  date: Iso | null;
  time: HM | null;
  name: string;
  phone: string;
  email: string;
  notes: string;
}

const EMPTY: Draft = {
  categoryId: null,
  serviceId: null,
  hairLength: null,
  date: null,
  time: null,
  name: "",
  phone: "",
  email: "",
  notes: "",
};

export default function BookingWizard({
  lang,
  initialCategory,
}: {
  lang: Lang;
  initialCategory: CategoryId | null;
}) {
  const t = getDictionary(lang);
  const router = useRouter();
  const [step, setStep] = useState(initialCategory ? 2 : 1);
  const [draft, setDraft] = useState<Draft>({ ...EMPTY, categoryId: initialCategory });
  const [ref, setRef] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const service = draft.serviceId ? getService(draft.serviceId) : undefined;
  const needsLength = !!service && service.pricing.kind === "length";

  const can: Record<number, boolean> = {
    1: !!draft.categoryId,
    2: !!service && (!needsLength || draft.hairLength !== null),
    3: !!draft.date && !!draft.time,
    4: draft.name.trim().length > 1 && (draft.phone.trim().length > 5 || draft.email.includes("@")),
  };

  function setPartial(p: Partial<Draft>) {
    setDraft((d) => ({ ...d, ...p }));
  }

  function pickCategory(id: CategoryId) {
    setPartial({ categoryId: id, serviceId: null, hairLength: null });
  }

  function pickService(id: string) {
    setPartial({ serviceId: id, hairLength: null });
  }

  async function next() {
    if (!can[step]) return;
    if (step === 4) {
      setSubmitting(true);
      setSubmitError(null);
      try {
        const res = await submitBooking({
          categoryId: draft.categoryId!,
          serviceId: draft.serviceId!,
          hairLength: draft.hairLength,
          date: draft.date!,
          time: draft.time!,
          name: draft.name,
          phone: draft.phone,
          email: draft.email,
          notes: draft.notes,
          lang,
        });
        if (!res.ok) {
          setSubmitError(res.error === "conflict" ? t.noTimes : t.loginErr);
          setSubmitting(false);
          return;
        }
        setRef(res.ref ?? null);
        setStep(5);
      } finally {
        setSubmitting(false);
      }
      return;
    }
    setStep((s) => s + 1);
  }

  function prev() {
    setStep((s) => Math.max(1, s - 1));
  }

  function resetBooking() {
    setDraft({ ...EMPTY });
    setRef(null);
    setStep(1);
  }

  const svcName = service ? serviceName(service, lang) + (needsLength && draft.hairLength !== null ? ` · ${t.lengths[draft.hairLength]}` : "") : "—";
  const sumPrice = service ? priceLabel(service, lang, draft.hairLength, t.perHour) : "—";

  const steps = t.stepsL.map((label, i) => ({ n: i + 1, label }));

  if (step === 5) {
    return (
      <div className="container container--booking" style={{ padding: "64px var(--pad-x) 88px" }}>
        <div className="confirm-box">
          <img src="/assets/monogram-mark.png" alt="" />
          <h2>{t.thanksTitle}</h2>
          <p>{t.thanks(svcName, draft.date ? dateLabel(draft.date, t, lang) : "", draft.time || "")}</p>
          {ref && <p className="vat-note">Ref. {ref}</p>}
          <div className="summary-actions" style={{ justifyContent: "center" }}>
            <button className="btn btn-primary" onClick={resetBooking}>
              {t.another}
            </button>
            <button className="btn btn-secondary" onClick={() => router.push(`/${lang}`)}>
              {t.backHome}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container container--booking" style={{ padding: "64px var(--pad-x) 88px" }}>
      <p className="kicker">{t.bkKicker}</p>

      <div className="booking-steps">
        {steps.map((s) => (
          <div
            key={s.n}
            className="booking-step"
            style={{ borderTopColor: s.n <= step ? "var(--color-accent)" : "var(--color-divider)" }}
          >
            <span
              className="booking-step__n tabular-nums"
              style={{ color: s.n === step ? "var(--color-accent-700)" : s.n < step ? "var(--color-text)" : "var(--color-neutral-600)" }}
            >
              0{s.n}
            </span>
            <span className="booking-step__label" data-current={s.n === step}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      <div className="booking-layout">
        <div>
          {step === 1 && (
            <>
              <h2>{t.q1}</h2>
              <div className="cat-grid">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    className="card cat-card"
                    onClick={() => pickCategory(c.id)}
                    style={{
                      background: draft.categoryId === c.id ? "var(--tint)" : "var(--color-paper)",
                      borderColor: draft.categoryId === c.id ? "var(--color-accent)" : "var(--color-divider)",
                    }}
                  >
                    <h3 className="card-title">{c[lang][0]}</h3>
                    <p className="card-body">{c[lang][1]}</p>
                    <span className="vat-note tabular-nums">
                      {t.from} {fromPriceForCategory(c.id)}
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 2 && draft.categoryId && (
            <>
              <h2>{t.q2}</h2>
              <div className="svc-list">
                {groupedServices(draft.categoryId).map((g, gi) => (
                  <div key={gi}>
                    {g.items.map((s) => {
                      const on = s.id === draft.serviceId;
                      return (
                        <button key={s.id} className="svc-option radio-row" data-on={on} onClick={() => pickService(s.id)}>
                          <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <span className="radio-dot" />
                            {serviceName(s, lang)}
                          </span>
                          <span className="svc-option__range">{priceRangeLabel(s, t.perHour)}</span>
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
              {needsLength && service && service.pricing.kind === "length" && (
                <div className="length-box">
                  <p style={{ margin: 0, fontWeight: 600 }}>{t.hairLength}</p>
                  <div className="length-opts">
                    {[service.pricing.short, service.pricing.medium, service.pricing.long].map((price, i) => {
                      const label = t.lengths[i];
                      const on = draft.hairLength === i;
                      return (
                        <button
                          key={i}
                          className="length-opt"
                          onClick={() => setPartial({ hairLength: i })}
                          style={{ background: on ? "var(--tint)" : "var(--color-paper)", borderColor: on ? "var(--color-accent)" : "var(--color-divider)" }}
                        >
                          {label}
                          <div className="length-opt__price tabular-nums">{price}.–</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}

          {step === 3 && (
            <>
              <h2>{t.q3}</h2>
              <Calendar lang={lang} t={t} selectedDate={draft.date} onSelectDate={(date) => setPartial({ date, time: null })} />
              <TimesPanel lang={lang} t={t} date={draft.date} selectedTime={draft.time} onSelectTime={(time) => setPartial({ time })} />
            </>
          )}

          {step === 4 && (
            <>
              <h2>{t.stepsL[3]}</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 480 }}>
                <div className="field">
                  <label>{t.fName}</label>
                  <input className="input" value={draft.name} onChange={(e) => setPartial({ name: e.target.value })} />
                </div>
                <div className="field">
                  <label>{t.fPhone}</label>
                  <input className="input" type="tel" value={draft.phone} onChange={(e) => setPartial({ phone: e.target.value })} />
                </div>
                <div className="field">
                  <label>{t.fEmail}</label>
                  <input className="input" type="email" value={draft.email} onChange={(e) => setPartial({ email: e.target.value })} />
                </div>
                <div className="field">
                  <label>{t.fNotes}</label>
                  <textarea
                    className="input"
                    placeholder={t.phNotes}
                    value={draft.notes}
                    onChange={(e) => setPartial({ notes: e.target.value })}
                  />
                </div>
                {submitError && <p className="login-error">{submitError}</p>}
              </div>
            </>
          )}

          <div className="summary-actions">
            {step > 1 && (
              <button className="btn btn-secondary" onClick={prev} disabled={submitting}>
                {t.back}
              </button>
            )}
            <button className="btn btn-primary" onClick={next} disabled={!can[step] || submitting}>
              {step === 4 ? t.send : t.cont}
            </button>
          </div>
        </div>

        <aside className="summary-panel">
          <p className="kicker" style={{ color: "var(--color-accent-700)" }}>{t.yourAppt}</p>
          <div className="summary-row">
            <span>{t.sum[0]}</span>
            <span>{draft.categoryId ? CATEGORIES.find((c) => c.id === draft.categoryId)?.[lang][0] : "—"}</span>
          </div>
          <div className="summary-row">
            <span>{t.sum[1]}</span>
            <span>{svcName}</span>
          </div>
          <div className="summary-row">
            <span>{t.sum[2]}</span>
            <span>{draft.date ? dateLabel(draft.date, t, lang) : "—"}</span>
          </div>
          <div className="summary-row">
            <span>{t.sum[3]}</span>
            <span>{draft.time || "—"}</span>
          </div>
          <p className="summary-price tabular-nums">{sumPrice}</p>
          <p className="vat-note">{t.vatPay}</p>
        </aside>
      </div>
    </div>
  );
}
