import type { ResolvedStep } from "@/lib/onboarding";
import { STATUS_OPTIONS, formatStatusLabel, getStatusStyle } from "@/lib/onboarding";

interface ChecklistStepProps {
  step: ResolvedStep;
  onStatusChange?: (status: string) => void;
}

export function ChecklistStep({ step, onStatusChange }: ChecklistStepProps) {
  const style = getStatusStyle(step.status);

  return (
    <li className="flex flex-col gap-2 border-b border-hairline py-4 last:border-b-0">
      <div className="flex flex-wrap items-start justify-between gap-2 sm:gap-4">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 font-mono text-xs text-ink-soft/60">{String(step.order).padStart(2, "0")}</span>
          <span className="text-sm font-medium text-ink">{step.label}</span>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {onStatusChange ? (
            <span className="relative inline-flex items-center">
              <span className={`h-1.5 w-1.5 rounded-full ${style.dot} pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2`} />
              <select
                aria-label={`Change status for ${step.label}`}
                value={step.isKnownStatus ? step.status : ""}
                onChange={(e) => onStatusChange(e.target.value)}
                className={`cursor-pointer appearance-none rounded-full border py-1 pl-6 pr-7 text-xs font-medium transition hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-brass/40 ${style.chipBg} ${style.chipBorder} ${style.text}`}
                style={{ colorScheme: "light" }}
              >
                {!step.isKnownStatus && (
                  <option value="" disabled style={{ backgroundColor: "#F8F7F2", color: "#1F241F" }}>
                    Change status…
                  </option>
                )}
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value} style={{ backgroundColor: "#F8F7F2", color: "#1F241F" }}>
                    {option.label}
                  </option>
                ))}
              </select>
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                fill="none"
                className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2"
              >
                <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={style.text} />
              </svg>
            </span>
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
