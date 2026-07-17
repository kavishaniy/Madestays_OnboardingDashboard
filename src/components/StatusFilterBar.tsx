"use client";

import { useEffect, useRef, useState } from "react";
import type { FilterKey, SortKey } from "@/lib/onboarding";
import { FILTERS, SORT_OPTIONS } from "@/lib/onboarding";

interface StatusFilterBarProps {
  active: FilterKey[];
  onToggle: (key: FilterKey) => void;
  onSelect: (key: FilterKey) => void;
  counts: Record<FilterKey, number>;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortKey: SortKey;
  onSortChange: (sortKey: SortKey) => void;
  bedroomFilter: number | null;
  onBedroomFilterChange: (bedrooms: number | null) => void;
}

export function StatusFilterBar({
  active,
  onToggle,
  onSelect,
  counts,
  searchQuery,
  onSearchChange,
  sortKey,
  onSortChange,
  bedroomFilter,
  onBedroomFilterChange,
}: StatusFilterBarProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isFilterOpen && !isSortOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setIsFilterOpen(false);
      }
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setIsSortOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsFilterOpen(false);
        setIsSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, [isFilterOpen, isSortOpen]);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 py-4 sm:py-6">
      <div role="tablist" aria-label="Filter properties by status" className="flex flex-wrap gap-2">
        {FILTERS.map((filter) => {
          const isActive = active.includes(filter.key);
          return (
            <button
              key={filter.key}
              role="tab"
              aria-selected={isActive}
              onClick={() => onSelect(filter.key)}
              className={`rounded-full border px-3 py-1.5 text-sm font-medium transition sm:px-4 sm:py-2 ${
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

      <div className="flex shrink-0 items-center gap-2">
        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.75}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft/60"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search properties…"
            aria-label="Search properties by name or location"
            className="h-9 w-40 rounded-full border border-hairline bg-surface pl-9 pr-3 text-sm text-ink placeholder:text-ink-soft/60 transition focus:border-hairline-strong focus:outline-none focus:ring-2 focus:ring-brass/40 sm:h-10 sm:w-56"
          />
        </div>

        <div ref={sortRef} className="relative shrink-0">
          <button
            type="button"
            onClick={() => setIsSortOpen((prev) => !prev)}
            aria-haspopup="true"
            aria-expanded={isSortOpen}
            aria-label="Sort properties"
            className={`flex h-9 w-9 items-center justify-center rounded-full border transition sm:h-10 sm:w-10 ${
              isSortOpen
                ? "border-bottle bg-bottle text-surface"
                : "border-hairline bg-surface text-ink-soft hover:border-hairline-strong hover:text-ink"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.75}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 sm:h-[18px] sm:w-[18px]"
            >
              <path d="M3 7h11M3 12h7M3 17h4" />
              <path d="M17 5v14M17 5l3.5 3.5M17 19l-3.5-3.5" />
            </svg>
          </button>

          {isSortOpen && (
            <ul
              aria-label="Sort properties"
              className="absolute right-0 top-full z-10 mt-2 w-56 overflow-hidden rounded-xl border border-hairline bg-surface shadow-card"
            >
              {SORT_OPTIONS.map((option) => {
                const isActive = option.value === sortKey;
                return (
                  <li key={option.value}>
                    <label
                      className={`flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-2.5 text-left text-sm transition ${
                        isActive ? "bg-stone font-medium text-ink" : "text-ink-soft hover:bg-stone/60 hover:text-ink"
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="sort-option"
                          checked={isActive}
                          onChange={() => onSortChange(option.value)}
                          className="h-4 w-4 border-hairline-strong accent-bottle"
                        />
                        {option.label}
                      </span>
                    </label>
                  </li>
                );
              })}
              <li className="border-t border-hairline px-4 py-3">
                <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-ink-soft/70">
                  Bedrooms
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => onBedroomFilterChange(null)}
                    className={`rounded-full border px-2.5 py-1 text-xs font-medium transition ${
                      bedroomFilter === null
                        ? "border-bottle bg-bottle text-surface"
                        : "border-hairline bg-surface text-ink-soft hover:border-hairline-strong hover:text-ink"
                    }`}
                  >
                    Any
                  </button>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => onBedroomFilterChange(n)}
                      className={`rounded-full border px-2.5 py-1 text-xs font-medium transition ${
                        bedroomFilter === n
                          ? "border-bottle bg-bottle text-surface"
                          : "border-hairline bg-surface text-ink-soft hover:border-hairline-strong hover:text-ink"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </li>
            </ul>
          )}
        </div>

        <div ref={filterRef} className="relative shrink-0">
        <button
          type="button"
          onClick={() => setIsFilterOpen((prev) => !prev)}
          aria-haspopup="true"
          aria-expanded={isFilterOpen}
          aria-label="Filter properties"
          className={`flex h-9 w-9 items-center justify-center rounded-full border transition sm:h-10 sm:w-10 ${
            isFilterOpen
              ? "border-bottle bg-bottle text-surface"
              : "border-hairline bg-surface text-ink-soft hover:border-hairline-strong hover:text-ink"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.75}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 sm:h-[18px] sm:w-[18px]"
          >
            <polygon points="4 4 20 4 14 12.5 14 19 10 21 10 12.5 4 4" />
          </svg>
        </button>

        {isFilterOpen && (
          <ul
            aria-label="Filter properties by status"
            className="absolute right-0 top-full z-10 mt-2 w-52 overflow-hidden rounded-xl border border-hairline bg-surface shadow-card"
          >
            {FILTERS.map((filter) => {
              const isActive = active.includes(filter.key);
              return (
                <li key={filter.key}>
                  <label
                    className={`flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-2.5 text-left text-sm transition ${
                      isActive ? "bg-stone font-medium text-ink" : "text-ink-soft hover:bg-stone/60 hover:text-ink"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={isActive}
                        onChange={() => onToggle(filter.key)}
                        className="h-4 w-4 rounded border-hairline-strong accent-bottle"
                      />
                      {filter.label}
                    </span>
                    <span className="font-mono text-xs text-ink-soft/60">{counts[filter.key]}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        )}
        </div>
      </div>
    </div>
  );
}
