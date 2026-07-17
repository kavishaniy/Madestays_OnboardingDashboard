"use client";

import Image from "next/image";
import type { PropertyProgress } from "@/lib/onboarding";
import { formatGoLiveDate } from "@/lib/onboarding";
import { ProgressSeal } from "./ProgressSeal";

interface PropertyCardProps {
  progress: PropertyProgress;
  onSelect: () => void;
}

function getInitials(name: string): string {
  const words = name.split(" ").filter(Boolean);
  const initials = words
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
  return initials || name.slice(0, 2).toUpperCase();
}

export function PropertyCard({ progress, onSelect }: PropertyCardProps) {
  const { property, percentComplete, needsAttention, isLive, completedCount, totalCount } = progress;
  const attentionCount = progress.steps.filter((s) => s.status === "action_required" || !s.isKnownStatus).length;

  return (
    <button
      onClick={onSelect}
      className="group flex flex-col overflow-hidden rounded-2xl border border-hairline bg-surface text-left shadow-card transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone">
        {property.image ? (
          <Image
            src={property.image}
            alt={property.name}
            fill
            sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-stone to-hairline">
            <span className="font-display text-3xl italic text-ink-soft">{getInitials(property.name)}</span>
          </div>
        )}

        <div className="absolute right-3 top-3">
          <ProgressSeal percent={percentComplete} size={52} />
        </div>

        {isLive && (
          <span className="absolute left-3 top-3 rounded-full bg-bottle px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-surface">
            Live
          </span>
        )}

        <span className="absolute bottom-3 left-3 rounded-full bg-surface px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-ink shadow-sm">
          Live Date: {formatGoLiveDate(property.targetGoLiveDate)}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="line-clamp-2 font-display text-lg leading-snug text-ink">{property.name}</h3>
          <p className="mt-1 text-sm text-ink-soft">{property.location}</p>
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 border-t border-hairline pt-3">
          <span className="flex items-center gap-1.5 font-mono text-xs text-ink-soft">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.75}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 shrink-0"
              aria-hidden="true"
            >
              <path d="M2 4v16" />
              <path d="M2 8h18a2 2 0 0 1 2 2v10" />
              <path d="M2 17h20" />
              <path d="M6 8v9" />
            </svg>
            {property.bedrooms} bed{property.bedrooms === 1 ? "" : "s"}
          </span>
          {needsAttention ? (
            <span className="shrink-0 rounded-full border border-rust/25 bg-rust/10 px-2.5 py-1 text-xs font-medium text-rust">
              {attentionCount} need{attentionCount === 1 ? "s" : ""} attention
            </span>
          ) : (
            <span className="shrink-0 text-xs font-medium text-ink-soft">
              {completedCount}/{totalCount} steps
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
