export default function SavedBadge({ label, saving }: { label: string; saving: boolean }) {
  return (
    <span className="autosave-badge" data-saving={saving}>
      {saving ? "…" : "●"} {label}
    </span>
  );
}
