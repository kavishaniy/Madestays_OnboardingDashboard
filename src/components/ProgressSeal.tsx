interface ProgressSealProps {
  percent: number;
  size?: number;
}

/**
 * The signature visual element: a brass seal-style progress ring. Reads at a
 * glance on the grid, and doubles as the anchor in the detail view — one
 * consistent motif for "how far through onboarding is this property".
 */
export function ProgressSeal({ percent, size = 56 }: ProgressSealProps) {
  const clamped = Math.min(100, Math.max(0, percent));
  const strokeWidth = size <= 40 ? 3 : 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div
      className="relative inline-flex shrink-0 items-center justify-center rounded-full bg-surface/90 shadow-sm ring-1 ring-hairline backdrop-blur"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-hairline"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="stroke-brass transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <span className="absolute font-mono text-[11px] font-medium text-ink" aria-hidden="true">
        {clamped}%
      </span>
      <span className="sr-only">{clamped} percent of onboarding complete</span>
    </div>
  );
}
