"use client";

import type { FilterKey } from "@/lib/onboarding";
import { FILTERS } from "@/lib/onboarding";

interface StatusFilterBarProps {
  active: FilterKey;
  onChange: (key: FilterKey) => void;
  counts: Record<FilterKey, number>;
}

export function StatusFilterBar({ active, onChange, counts }: StatusFilterBarProps) {
  return (
    <div role="tablist" aria-label="Filter properties by status" className="flex flex-wrap gap-2 py-6">
      {FILTERS.map((filter) => {
        const isActive = filter.key === active;
        return (
          <button
            key={filter.key}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(filter.key)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
              isActive
                ? "border-bottle bg-bottle text-surface"
                : "border-hairline bg-surface text-ink-soft hover:border-hairline-strong hover:text-ink"
            }`}
          >
            {filter.label}
            <span className={`ml-1.5 font-mono text-xs ${isActive ? "text-surface/70" : "text-ink-soft/60"}`}>
              {counts[filter.key]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
