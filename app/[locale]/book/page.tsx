import type { Lang } from "@/lib/i18n/dictionaries";
import { CATEGORIES, type CategoryId } from "@/lib/data/catalogue";
import BookingWizard from "@/components/booking/BookingWizard";

export default async function BookPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ cat?: string }>;
}) {
  const lang = (await params).locale as Lang;
  const sp = await searchParams;
  const cat = CATEGORIES.find((c) => c.id === sp.cat)?.id as CategoryId | undefined;

  return <BookingWizard lang={lang} initialCategory={cat ?? null} />;
}
