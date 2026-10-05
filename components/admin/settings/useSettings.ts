"use client";

import { useState, useTransition } from "react";
import type { SalonSettings, SettingsPatch } from "@/lib/settings";
import { updateSettings } from "@/lib/actions/settings";

/** Local copy of the salon settings that saves each change immediately (optimistic). */
export function useSettings(initial: SalonSettings) {
  const [settings, setSettings] = useState(initial);
  const [saving, startTransition] = useTransition();

  function save(patch: SettingsPatch) {
    setSettings((s) => ({ ...s, ...patch }));
    startTransition(async () => {
      await updateSettings(patch);
    });
  }

  return { settings, setSettings, save, saving, startTransition };
}
