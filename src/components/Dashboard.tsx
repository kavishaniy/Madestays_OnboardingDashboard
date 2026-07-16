"use client";

import { useMemo, useState } from "react";
import type { Owner } from "@/lib/types";
import type { FilterKey, PropertyProgress } from "@/lib/onboarding";
import { filterPortfolio } from "@/lib/onboarding";
import { Header } from "./Header";
import { PortfolioSummary } from "./PortfolioSummary";
import { StatusFilterBar } from "./StatusFilterBar";
import { PropertyGrid } from "./PropertyGrid";
import { PropertyDetailModal } from "./PropertyDetailModal";

interface DashboardProps {
  owner: Owner;
  portfolio: PropertyProgress[];
}

export function Dashboard({ owner, portfolio }: DashboardProps) {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => filterPortfolio(portfolio, filter), [portfolio, filter]);

  const counts = useMemo(
    () => ({
      all: portfolio.length,
      live: portfolio.filter((p) => p.filterBucket === "live").length,
      in_progress: portfolio.filter((p) => p.filterBucket === "in_progress").length,
      needs_attention: portfolio.filter((p) => p.filterBucket === "needs_attention").length,
    }),
    [portfolio]
  );

  const selected = selectedId ? portfolio.find((p) => p.property.id === selectedId) ?? null : null;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <Header owner={owner} />
      <PortfolioSummary portfolio={portfolio} />
      <StatusFilterBar active={filter} onChange={setFilter} counts={counts} />
      <PropertyGrid properties={filtered} onSelect={setSelectedId} />
      <PropertyDetailModal progress={selected} onClose={() => setSelectedId(null)} />
    </div>
  );
}
