import type { OnboardingData, Property, StepDefinition, StepStatus } from "./types";

export type FilterKey = "all" | "live" | "in_progress" | "needs_attention";

export interface ResolvedStep {
  id: string;
  label: string;
  order: number;
  status: StepStatus;
  note?: string;
  isKnownStatus: boolean;
}

export interface PropertyProgress {
  property: Property;
  steps: ResolvedStep[];
  completedCount: number;
  totalCount: number;
  percentComplete: number;
  needsAttention: boolean;
  isLive: boolean;
  filterBucket: Exclude<FilterKey, "all">;
}

const KNOWN_STATUSES = new Set(["complete", "in_progress", "action_required", "not_started"]);

export const STATUS_OPTIONS: { value: StepStatus; label: string }[] = [
  { value: "not_started", label: "Not started" },
  { value: "in_progress", label: "In progress" },
  { value: "action_required", label: "Action required" },
  { value: "complete", label: "Complete" },
];

/**
 * Merge a property's recorded steps against the canonical step definitions.
 * Some properties (e.g. a brand-new listing) have an empty `steps` array —
 * rather than showing nothing, every definition still appears here, defaulted
 * to "not_started". This is the one place that assumption lives.
 */
export function resolvePropertySteps(
  property: Property,
  stepDefinitions: StepDefinition[]
): ResolvedStep[] {
  const byId = new Map(property.steps.map((step) => [step.id, step]));

  return [...stepDefinitions]
    .sort((a, b) => a.order - b.order)
    .map((definition) => {
      const recorded = byId.get(definition.id);
      const status = recorded?.status ?? "not_started";
      return {
        id: definition.id,
        label: definition.label,
        order: definition.order,
        status,
        note: recorded?.note,
        isKnownStatus: KNOWN_STATUSES.has(status),
      };
    });
}

export function getPropertyProgress(
  property: Property,
  stepDefinitions: StepDefinition[]
): PropertyProgress {
  const steps = resolvePropertySteps(property, stepDefinitions);
  return deriveProgress(property, steps);
}

function deriveProgress(property: Property, steps: ResolvedStep[]): PropertyProgress {
  const totalCount = steps.length;
  const completedCount = steps.filter((s) => s.status === "complete").length;
  const percentComplete = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  // Anything the legend doesn't recognise (e.g. "on_hold") is treated as
  // needing a human look, same as an explicit action_required — an unknown
  // status is exactly the kind of thing that shouldn't be silently buried.
  const needsAttention = steps.some((s) => s.status === "action_required" || !s.isKnownStatus);
  const isLive = totalCount > 0 && completedCount === totalCount;

  const filterBucket: Exclude<FilterKey, "all"> = needsAttention
    ? "needs_attention"
    : isLive
    ? "live"
    : "in_progress";

  return { property, steps, completedCount, totalCount, percentComplete, needsAttention, isLive, filterBucket };
}

/**
 * Recompute a property's progress after a single step's status changes
 * in the UI. This is a client-side-only edit (no backend to persist to) —
 * it lets the detail modal reflect an updated status and have every derived
 * figure (percent, filter bucket, live state) stay in sync.
 */
export function updateStepStatus(
  progress: PropertyProgress,
  stepId: string,
  status: StepStatus
): PropertyProgress {
  const steps = progress.steps.map((step) =>
    step.id === stepId ? { ...step, status, isKnownStatus: KNOWN_STATUSES.has(status) } : step
  );
  return deriveProgress(progress.property, steps);
}

export function buildPortfolio(data: OnboardingData): PropertyProgress[] {
  return data.properties.map((property) => getPropertyProgress(property, data.onboardingStepDefinitions));
}

export const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "live", label: "Live" },
  { key: "in_progress", label: "In progress" },
  { key: "needs_attention", label: "Needs attention" },
];

export function filterPortfolio(portfolio: PropertyProgress[], filters: FilterKey[]): PropertyProgress[] {
  if (filters.length === 0 || filters.includes("all")) return portfolio;
  return portfolio.filter((p) => filters.includes(p.filterBucket));
}

export type SortKey =
  | "name_asc"
  | "target_date_asc"
  | "target_date_desc"
  | "progress_desc"
  | "progress_asc"
  | "bedrooms_desc";

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "target_date_asc", label: "Soonest date" },
  { value: "target_date_desc", label: "Latest date" },
  { value: "progress_desc", label: "Most progress" },
  { value: "progress_asc", label: "Least progress" },
  { value: "name_asc", label: "Name A–Z" },
  { value: "bedrooms_desc", label: "Most bedrooms" },
];

export function sortPortfolio(portfolio: PropertyProgress[], sortKey: SortKey): PropertyProgress[] {
  const sorted = [...portfolio];

  switch (sortKey) {
    case "name_asc":
      return sorted.sort((a, b) => a.property.name.localeCompare(b.property.name));
    case "target_date_asc":
      return sorted.sort(
        (a, b) => new Date(a.property.targetGoLiveDate).getTime() - new Date(b.property.targetGoLiveDate).getTime()
      );
    case "target_date_desc":
      return sorted.sort(
        (a, b) => new Date(b.property.targetGoLiveDate).getTime() - new Date(a.property.targetGoLiveDate).getTime()
      );
    case "progress_desc":
      return sorted.sort((a, b) => b.percentComplete - a.percentComplete);
    case "progress_asc":
      return sorted.sort((a, b) => a.percentComplete - b.percentComplete);
    case "bedrooms_desc":
      return sorted.sort((a, b) => b.property.bedrooms - a.property.bedrooms);
    default:
      return sorted;
  }
}

export function formatStatusLabel(status: string): string {
  return status
    .split("_")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

interface StatusStyle {
  dot: string;
  text: string;
  chipBg: string;
  chipBorder: string;
}

const STATUS_STYLES: Record<string, StatusStyle> = {
  complete: {
    dot: "bg-bottle",
    text: "text-bottle",
    chipBg: "bg-bottle/10",
    chipBorder: "border-bottle/20",
  },
  in_progress: {
    dot: "bg-slate",
    text: "text-slate",
    chipBg: "bg-slate/10",
    chipBorder: "border-slate/20",
  },
  action_required: {
    dot: "bg-rust",
    text: "text-rust",
    chipBg: "bg-rust/10",
    chipBorder: "border-rust/20",
  },
  not_started: {
    dot: "bg-taupe",
    text: "text-ink-soft",
    chipBg: "bg-taupe/10",
    chipBorder: "border-taupe/25",
  },
};

const FALLBACK_STYLE: StatusStyle = {
  dot: "bg-taupe",
  text: "text-ink-soft",
  chipBg: "bg-transparent",
  chipBorder: "border-hairline-strong border-dashed",
};

export function getStatusStyle(status: string): StatusStyle {
  return STATUS_STYLES[status] ?? FALLBACK_STYLE;
}

const SHORT_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function formatGoLiveDate(dateString: string): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  const day = date.getUTCDate();
  const month = SHORT_MONTHS[date.getUTCMonth()];
  const year = date.getUTCFullYear();
  return `${day} ${month} ${year}`;
}
