import Link from "next/link";
import { getDictionary, type Lang } from "@/lib/i18n/dictionaries";
import { CATEGORIES, GROUP_NAMES, groupedServices, serviceName, type Service } from "@/lib/data/catalogue";

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const lang = (await params).locale as Lang;
  const t = getDictionary(lang);
  const L = lang === "de" ? 1 : 0;

  const priceCells = (s: Service) => {
    if (s.pricing.kind === "length") {
      return [s.pricing.short, s.pricing.medium, s.pricing.long].map((v, i) => (
        <span key={i} className="svc-row__price tabular-nums">
          {v}.–
        </span>
      ));
    }
    const label = s.pricing.kind === "hourly" ? `${s.pricing.perHour}.– ${t.perHour}` : `${s.pricing.amount}.–`;
    return (
      <span className="svc-row__price svc-row__price--single tabular-nums">
        {label}
      </span>
    );
  };

  return (
    <div className="container container--services" style={{ padding: "64px var(--pad-x) 88px" }}>
      <p className="kicker">{t.svcKicker}</p>
      <h1>{t.svcTitle}</h1>
      <p className="vat-note" style={{ marginBottom: 32 }}>{t.svcBody}</p>

      <div className="anchor-chips">
        {CATEGORIES.map((c) => (
          <a key={c.id} href={`#${c.id}`} className="tag tag-outline">
            {c[lang][0]}
          </a>
        ))}
      </div>

      {CATEGORIES.map((c) => {
        const hasLengths = c.id === "women";
        const groups = groupedServices(c.id);
        return (
          <div key={c.id} id={c.id} className="svc-cat">
            <div className="svc-cat__head">
              <h2>{c[lang][0]}</h2>
              <Link href={`/${lang}/book?cat=${c.id}`} className="btn btn-ghost">
                {t.book} →
              </Link>
            </div>
            <hr className="hr" style={{ borderTop: "1px solid var(--color-text)", opacity: 0.3 }} />
            {hasLengths && (
              <div className="svc-head-row">
                <span />
                <span>{t.shortU}</span>
                <span>{t.mediumU}</span>
                <span>{t.longU}</span>
              </div>
            )}
            {groups.map((g, gi) => (
              <div key={gi}>
                {g.group && <div className="svc-group-name">{GROUP_NAMES[g.group][L]}</div>}
                {g.items.map((s) => (
                  <div key={s.id} className="svc-row">
                    <span>{serviceName(s, lang)}</span>
                    {priceCells(s)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        );
      })}

      <p className="vat-note">{t.vat}</p>
    </div>
  );
}
