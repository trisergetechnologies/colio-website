/**
 * Listener categories — align with backend `CONSULTANT_CATEGORIES` / consultant profile.
 */
export const LISTENER_CATEGORY_IDS = [
  "Loneliness",
  "Breakup",
  "Feeling Low",
  "Stress",
  "Overthinking",
] as const;

export type ListenerCategoryId = (typeof LISTENER_CATEGORY_IDS)[number];
export type ListenerCategoryFilter = "All" | ListenerCategoryId;

export function isListenerCategoryId(
  value: string | null,
): value is ListenerCategoryId {
  return (
    !!value &&
    (LISTENER_CATEGORY_IDS as readonly string[]).includes(value)
  );
}

export const LISTENER_CATEGORIES_UI: {
  id: ListenerCategoryId;
  blurb: string;
  borderAccent: string;
  cardTint: string;
}[] = [
  {
    id: "Loneliness",
    blurb: "Talk through isolation and quiet days — you’re not alone here.",
    borderAccent: "border-l-violet-400",
    cardTint: "bg-violet-500/[0.06]",
  },
  {
    id: "Breakup",
    blurb: "Process endings, closure, and what comes next — at your pace.",
    borderAccent: "border-l-rose-400",
    cardTint: "bg-rose-500/[0.06]",
  },
  {
    id: "Feeling Low",
    blurb: "Gentle support when energy is low and everything feels heavy.",
    borderAccent: "border-l-sky-400",
    cardTint: "bg-sky-500/[0.06]",
  },
  {
    id: "Stress",
    blurb: "Vent, breathe, and unpack pressure from work, life, or both.",
    borderAccent: "border-l-amber-400",
    cardTint: "bg-amber-500/[0.06]",
  },
  {
    id: "Overthinking",
    blurb: "Slow the spiral — clear space to think without judging yourself.",
    borderAccent: "border-l-emerald-400",
    cardTint: "bg-emerald-500/[0.06]",
  },
];
