import { notFound } from "next/navigation";
import { LOCALES, getDictionary, type Lang } from "@/lib/i18n/dictionaries";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!LOCALES.includes(locale as Lang)) notFound();
  const lang = locale as Lang;
  const t = getDictionary(lang);

  return (
    <div className="site-bg">
      <Header lang={lang} />
      <main>{children}</main>
      <Footer lang={lang} t={t} />
    </div>
  );
}
