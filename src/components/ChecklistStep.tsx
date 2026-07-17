"use client";

import { useEffect, useRef, useState } from "react";
import type { ResolvedStep } from "@/lib/onboarding";
import { STATUS_OPTIONS, formatStatusLabel, getStatusStyle } from "@/lib/onboarding";

interface ChecklistStepProps {
  step: ResolvedStep;
  onStatusChange?: (status: string) => void;
}

export function ChecklistStep({ step, onStatusChange }: ChecklistStepProps) {
  const style = getStatusStyle(step.status);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
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
    <li className="flex flex-col gap-2 border-b border-hairline py-4 last:border-b-0">
      <div className="flex flex-wrap items-start justify-between gap-2 sm:gap-4">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 font-mono text-xs text-ink-soft/60">{String(step.order).padStart(2, "0")}</span>
          <span className="text-sm font-medium text-ink">{step.label}</span>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {onStatusChange ? (
            <div ref={dropdownRef} className="relative shrink-0">
              <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                aria-haspopup="true"
                aria-expanded={isOpen}
                aria-label={`Change status for ${step.label}`}
                className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-brass/40 ${style.chipBg} ${style.chipBorder} ${style.text}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                {formatStatusLabel(step.status)}
                <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-3 w-3">
                  <path
                    d="M5 7.5L10 12.5L15 7.5"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {isOpen && (
                <ul
                  aria-label={`Change status for ${step.label}`}
                  className="absolute right-0 top-full z-10 mt-2 w-44 overflow-hidden rounded-xl border border-hairline bg-surface shadow-card"
                >
                  {STATUS_OPTIONS.map((option) => {
                    const isActive = step.isKnownStatus && option.value === step.status;
                    return (
                      <li key={option.value}>
                        <button
                          type="button"
                          onClick={() => {
                            onStatusChange(option.value);
                            setIsOpen(false);
                          }}
                          className={`flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm transition ${
                            isActive
                              ? "bg-stone font-medium text-ink"
                              : "text-ink-soft hover:bg-stone/60 hover:text-ink"
                          }`}
                        >
                          {option.label}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          ) : (
            <span
              className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${style.chipBg} ${style.chipBorder} ${style.text}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
              {formatStatusLabel(step.status)}
            </span>
          )}
        </div>
      </div>
      {step.note && (
        <p className="ml-7 rounded-lg bg-stone/60 px-3 py-2 text-sm italic text-ink-soft">{step.note}</p>
      )}
      {!step.isKnownStatus && (
        <p className="ml-7 text-xs text-ink-soft/70">
          This status isn&apos;t in the standard list — flagged here so it doesn&apos;t get missed.
        </p>
      )}
    </li>
  );
}
