import { redirect } from "next/navigation";

// Settings were split into focused pages; keep the old URL working.
export default function AdminSettingsPage() {
  redirect("/admin/hours");
}
