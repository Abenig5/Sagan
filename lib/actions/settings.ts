"use server";

import { requireAdmin } from "@/lib/require-admin";
import { updateSettings as updateSettingsDb, resetSettings as resetSettingsDb, type SettingsPatch } from "@/lib/settings";
import { revalidatePath } from "next/cache";

export async function updateSettings(patch: SettingsPatch) {
  await requireAdmin();
  const settings = await updateSettingsDb(patch);
  revalidatePath("/admin/settings");
  revalidatePath("/[locale]", "layout");
  return settings;
}

export async function resetSettings() {
  await requireAdmin();
  const settings = await resetSettingsDb();
  revalidatePath("/admin/settings");
  revalidatePath("/[locale]", "layout");
  return settings;
}
