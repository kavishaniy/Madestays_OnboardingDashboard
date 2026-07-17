"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { PropertyProgress } from "@/lib/onboarding";
import { formatGoLiveDate } from "@/lib/onboarding";
import { ProgressSeal } from "./ProgressSeal";
import { ChecklistStep } from "./ChecklistStep";

interface PropertyDetailModalProps {
  progress: PropertyProgress | null;
  onClose: () => void;
}

export function PropertyDetailModal({ progress, onClose }: PropertyDetailModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [animatedPercent, setAnimatedPercent] = useState(0);

  useEffect(() => {
    if (!progress) return;
    closeButtonRef.current?.focus();

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [progress, onClose]);

  useEffect(() => {
    if (!progress) {
      setAnimatedPercent(0);
      return;
    }
    setAnimatedPercent(0);
    const raf = requestAnimationFrame(() => setAnimatedPercent(progress.percentComplete));
    return () => cancelAnimationFrame(raf);
  }, [progress]);

  if (!progress) return null;
  const { property } = progress;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-0 backdrop-blur-sm sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="property-detail-title"
      onClick={onClose}
    >
      <div
        className="flex h-full w-full max-w-6xl flex-col overflow-hidden bg-surface shadow-modal sm:h-auto sm:max-h-[90vh] sm:flex-row sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-40 w-full shrink-0 bg-stone sm:h-auto sm:w-2/5">
          {property.image ? (
            <Image src={property.image} alt={property.name} fill sizes="(min-width: 640px) 40vw, 100vw" className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-stone to-hairline">
              <span className="font-display text-4xl italic text-ink-soft">{property.name.slice(0, 1)}</span>
            </div>
          )}
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Close property detail"
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-ink/60 text-surface backdrop-blur transition hover:bg-ink/80"
          >
            ✕
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden sm:w-3/5">
          <div className="flex items-start justify-between gap-4 border-b border-hairline px-4 py-4 sm:px-6 sm:py-5">
            <div>
              <h2 id="property-detail-title" className="font-display text-xl text-ink sm:text-2xl">
                {property.name}
              </h2>
              <p className="mt-1 text-sm text-ink-soft">
                {property.location} · {property.bedrooms} bed{property.bedrooms === 1 ? "" : "s"} · Target{" "}
                {formatGoLiveDate(property.targetGoLiveDate)}
              </p>
            </div>
            <ProgressSeal percent={animatedPercent} size={48} />
          </div>

          <ul className="overflow-y-auto px-4 py-2 sm:px-6">
            {progress.steps.map((step) => (
              <ChecklistStep key={step.id} step={step} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
