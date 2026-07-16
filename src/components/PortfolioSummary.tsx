import type { PropertyProgress } from "@/lib/onboarding";

interface PortfolioSummaryProps {
  portfolio: PropertyProgress[];
}

export function PortfolioSummary({ portfolio }: PortfolioSummaryProps) {
  const total = portfolio.length;
  const live = portfolio.filter((p) => p.isLive).length;
  const needingAttention = portfolio.filter((p) => p.needsAttention).length;
  const overallPercent =
    total === 0 ? 0 : Math.round(portfolio.reduce((sum, p) => sum + p.percentComplete, 0) / total);

  const stats = [
    { label: "Properties", value: total },
    { label: "Live", value: live },
    { label: "Needing attention", value: needingAttention },
    { label: "Portfolio complete", value: `${overallPercent}%` },
  ];

  return (
    <div className="flex flex-col gap-6 border-b border-hairline pb-8 pt-8 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-soft">Portfolio overview</p>
        <h1 className="mt-2 font-display text-3xl italic text-ink">Your properties, at a glance</h1>
      </div>
      <dl className="grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label}>
            <dt className="text-xs uppercase tracking-wide text-ink-soft">{stat.label}</dt>
            <dd className="mt-1 font-display text-2xl text-ink">{stat.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
