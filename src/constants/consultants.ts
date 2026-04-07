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
  /** Iconify icon id (e.g. tabler:moon-stars) */
  icon: string;
  /** Tailwind gradient for frame + icon chip */
  gradientBorder: string;
}[] = [
  {
    id: "Loneliness",
    blurb: "Talk through isolation and quiet days — you’re not alone here.",
    borderAccent: "border-l-violet-400",
    cardTint: "bg-violet-500/[0.06]",
    icon: "tabler:moon-stars",
    gradientBorder: "from-violet-400/70 via-fuchsia-500/50 to-indigo-600/60",
  },
  {
    id: "Breakup",
    blurb: "Process endings, closure, and what comes next — at your pace.",
    borderAccent: "border-l-rose-400",
    cardTint: "bg-rose-500/[0.06]",
    icon: "tabler:heart-broken",
    gradientBorder: "from-rose-400/70 via-pink-500/50 to-red-600/55",
  },
  {
    id: "Feeling Low",
    blurb: "Gentle support when energy is low and everything feels heavy.",
    borderAccent: "border-l-sky-400",
    cardTint: "bg-sky-500/[0.06]",
    icon: "tabler:cloud-rain",
    gradientBorder: "from-sky-400/70 via-cyan-500/45 to-blue-600/55",
  },
  {
    id: "Stress",
    blurb: "Vent, breathe, and unpack pressure from work, life, or both.",
    borderAccent: "border-l-amber-400",
    cardTint: "bg-amber-500/[0.06]",
    icon: "tabler:bolt",
    gradientBorder: "from-amber-400/75 via-orange-500/50 to-yellow-600/45",
  },
  {
    id: "Overthinking",
    blurb: "Slow the spiral — clear space to think without judging yourself.",
    borderAccent: "border-l-emerald-400",
    cardTint: "bg-emerald-500/[0.06]",
    icon: "tabler:brain",
    gradientBorder: "from-emerald-400/70 via-teal-500/50 to-cyan-600/55",
  },
];
