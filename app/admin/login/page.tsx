import Link from "next/link";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getAdminLang } from "@/lib/i18n/server";
import LoginForm from "@/components/admin/LoginForm";
import LangSwitch from "@/components/admin/LangSwitch";
import PoweredBy from "@/components/PoweredBy";

export default async function AdminLoginPage() {
  const lang = await getAdminLang();
  const t = getDictionary(lang);

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-card__lang">
          <LangSwitch lang={lang} />
        </div>
        <img src="/assets/monogram-mark.png" alt="Sagan Beauty" />
        <div className="brand-word">SAGAN BEAUTY</div>
        <hr className="login-rule" />
        <h1 style={{ fontSize: 24 }}>{t.loginTitle}</h1>
        <p className="vat-note">{t.loginBody}</p>
        <LoginForm lang={lang} />
        <div style={{ marginTop: 20 }}>
          <Link href={`/${lang}`} className="btn btn-ghost">
            ← {t.viewSite}
          </Link>
        </div>
      </div>
      <div className="login-page__credit">
        <PoweredBy />
      </div>
    </div>
  );
}
