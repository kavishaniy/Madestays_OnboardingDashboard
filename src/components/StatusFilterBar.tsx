"use client";

import { useEffect, useRef, useState } from "react";
import type { FilterKey } from "@/lib/onboarding";
import { FILTERS } from "@/lib/onboarding";

interface StatusFilterBarProps {
  active: FilterKey[];
  onToggle: (key: FilterKey) => void;
  onSelect: (key: FilterKey) => void;
  counts: Record<FilterKey, number>;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function StatusFilterBar({ active, onToggle, onSelect, counts, searchQuery, onSearchChange }: StatusFilterBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, [isOpen]);

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

        <div ref={containerRef} className="relative shrink-0">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-haspopup="true"
          aria-expanded={isOpen}
          aria-label="Filter properties"
          className={`flex h-9 w-9 items-center justify-center rounded-full border transition sm:h-10 sm:w-10 ${
            isOpen
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

        {isOpen && (
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
