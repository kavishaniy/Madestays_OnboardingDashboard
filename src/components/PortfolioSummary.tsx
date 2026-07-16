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
    { label: "Live", value: live, accent: "text-bottle" },
    { label: "Needing attention", value: needingAttention, accent: needingAttention > 0 ? "text-rust" : undefined },
    { label: "Portfolio complete", value: `${overallPercent}%`, accent: "text-brass" },
  ];

  return (
    <div className="flex flex-col gap-6 border-b border-hairline pb-6 pt-6 sm:flex-row sm:items-end sm:justify-between sm:pb-8 sm:pt-8">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-soft">Portfolio overview</p>
        <h1 className="mt-2 font-display text-2xl italic text-ink sm:text-3xl">Your properties, at a glance</h1>
      </div>
      <dl className="flex flex-wrap gap-x-6 gap-y-4 sm:flex-nowrap sm:gap-x-10">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className={i > 0 ? "border-l border-hairline pl-6 sm:pl-10" : ""}
          >
            <dt className="text-xs uppercase tracking-wide text-ink-soft">{stat.label}</dt>
            <dd className={`mt-1 font-display text-xl text-ink sm:text-2xl ${stat.accent ?? ""}`}>{stat.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
