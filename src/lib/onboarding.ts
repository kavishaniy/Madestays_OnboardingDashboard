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

export function formatGoLiveDate(dateString: string): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
