import { prisma } from "@/lib/prisma";
import { getAdminLang } from "@/lib/i18n/server";
import { getSettings } from "@/lib/settings";
import { listClosures } from "@/lib/closures";
import { mondayOf, addDays, todayIso, type Iso } from "@/lib/dates";
import AvailabilityView from "@/components/admin/AvailabilityView";

export const dynamic = "force-dynamic";

export default async function AdminAvailabilityPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const lang = await getAdminLang();
  const sp = await searchParams;
  const ref: Iso = sp.ref && /^\d{4}-\d{2}-\d{2}$/.test(sp.ref) ? sp.ref : todayIso();
  const monday = mondayOf(ref);
  const dates = Array.from({ length: 7 }, (_, i) => addDays(monday, i));

  const [settings, closures, bookings, blocked] = await Promise.all([
    getSettings(),
    listClosures(),
    prisma.booking.findMany({
      where: { date: { in: dates }, status: { not: "declined" } },
      select: { id: true, date: true, time: true, name: true, categoryId: true, status: true },
    }),
    prisma.blockedSlot.findMany({ where: { date: { in: dates } }, select: { date: true, time: true } }),
  ]);

  return (
    <AvailabilityView
      lang={lang}
      refDate={ref}
      dates={dates}
      settings={settings}
      closures={closures.map((c) => ({ id: c.id, from: c.from, to: c.to, note: c.note }))}
      bookings={bookings.map((b) => ({ ...b, categoryId: b.categoryId as any }))}
      blocked={blocked}
    />
  );
}
