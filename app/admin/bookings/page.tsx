import { prisma } from "@/lib/prisma";
import { getAdminLang } from "@/lib/i18n/server";
import BookingsView, { type AdminBooking } from "@/components/admin/BookingsView";

export const dynamic = "force-dynamic";

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ select?: string }>;
}) {
  const lang = await getAdminLang();
  const { select } = await searchParams;

  const rows = await prisma.booking.findMany({
    orderBy: [{ date: "asc" }, { time: "asc" }],
    select: {
      id: true,
      ref: true,
      categoryId: true,
      serviceId: true,
      hairLength: true,
      date: true,
      time: true,
      name: true,
      phone: true,
      email: true,
      notes: true,
      status: true,
    },
  });

  const bookings: AdminBooking[] = rows.map((r) => ({ ...r, categoryId: r.categoryId as AdminBooking["categoryId"] }));

  return <BookingsView lang={lang} initialBookings={bookings} initialSelectedId={select ?? null} />;
}
