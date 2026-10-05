import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getAdminLang } from "@/lib/i18n/server";
import AdminChrome from "@/components/admin/AdminChrome";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const [lang, session] = await Promise.all([getAdminLang(), getServerSession(authOptions)]);
  // Only signed-in staff get the count (the login page shares this layout).
  const pendingCount = session ? await prisma.booking.count({ where: { status: "pending" } }) : 0;

  return (
    <AdminChrome lang={lang} pendingCount={pendingCount}>
      {children}
    </AdminChrome>
  );
}
