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
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="line-clamp-2 font-display text-lg leading-snug text-ink">{property.name}</h3>
          <p className="mt-1 text-sm text-ink-soft">
            {property.location} · {property.bedrooms} bed{property.bedrooms === 1 ? "" : "s"}
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 border-t border-hairline pt-3">
          <span className="font-mono text-xs text-ink-soft">
            Live Date: {formatGoLiveDate(property.targetGoLiveDate)}
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
