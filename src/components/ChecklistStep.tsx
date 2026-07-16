import type { ResolvedStep } from "@/lib/onboarding";
import { formatStatusLabel, getStatusStyle } from "@/lib/onboarding";

interface ChecklistStepProps {
  step: ResolvedStep;
}

export function ChecklistStep({ step }: ChecklistStepProps) {
  const style = getStatusStyle(step.status);

  return (
    <li className="flex flex-col gap-2 border-b border-hairline py-4 last:border-b-0">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 font-mono text-xs text-ink-soft/60">{String(step.order).padStart(2, "0")}</span>
          <span className="text-sm font-medium text-ink">{step.label}</span>
        </div>
        <span
          className={`flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${style.chipBg} ${style.chipBorder} ${style.text}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
          {formatStatusLabel(step.status)}
        </span>
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
