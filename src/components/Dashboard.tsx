"use client";

import { useMemo, useState } from "react";
import type { Owner } from "@/lib/types";
import type { FilterKey, PropertyProgress, SortKey } from "@/lib/onboarding";
import { filterPortfolio, sortPortfolio, updateStepStatus } from "@/lib/onboarding";
import { Header } from "./Header";
import { PortfolioSummary } from "./PortfolioSummary";
import { StatusFilterBar } from "./StatusFilterBar";
import { PropertyGrid } from "./PropertyGrid";
import { PropertyDetailModal } from "./PropertyDetailModal";

interface DashboardProps {
  owner: Owner;
  portfolio: PropertyProgress[];
}

export function Dashboard({ owner, portfolio: initialPortfolio }: DashboardProps) {
  const [portfolio, setPortfolio] = useState<PropertyProgress[]>(initialPortfolio);
  const [filters, setFilters] = useState<FilterKey[]>(["all"]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("target_date_asc");
  const [bedroomFilter, setBedroomFilter] = useState<number | null>(null);

  const toggleFilter = (key: FilterKey) => {
    setFilters((prev) => {
      if (key === "all") return ["all"];
      const withoutAll = prev.filter((k) => k !== "all");
      const next = withoutAll.includes(key) ? withoutAll.filter((k) => k !== key) : [...withoutAll, key];
      return next.length === 0 ? ["all"] : next;
    });
  };

  const selectFilter = (key: FilterKey) => setFilters([key]);

  const handleStepStatusChange = (propertyId: string, stepId: string, status: string) => {
    setPortfolio((prev) =>
      prev.map((p) => (p.property.id === propertyId ? updateStepStatus(p, stepId, status) : p))
    );
  };

  const filtered = useMemo(() => {
    const byStatus = filterPortfolio(portfolio, filters);
    const query = searchQuery.trim().toLowerCase();
    const bySearch = query
      ? byStatus.filter(
          (p) =>
            p.property.name.toLowerCase().includes(query) || p.property.location.toLowerCase().includes(query)
        )
      : byStatus;
    const byBedrooms =
      bedroomFilter === null ? bySearch : bySearch.filter((p) => p.property.bedrooms === bedroomFilter);
    return sortPortfolio(byBedrooms, sortKey);
  }, [portfolio, filters, searchQuery, sortKey, bedroomFilter]);

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
    <div className="mx-auto max-w-[1600px] px-6 sm:px-10 lg:px-16">
      <Header owner={owner} />
      <PortfolioSummary portfolio={portfolio} />
      <StatusFilterBar
        active={filters}
        onToggle={toggleFilter}
        onSelect={selectFilter}
        counts={counts}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortKey={sortKey}
        onSortChange={setSortKey}
        bedroomFilter={bedroomFilter}
        onBedroomFilterChange={setBedroomFilter}
      />
      <PropertyGrid properties={filtered} onSelect={setSelectedId} />
      <PropertyDetailModal progress={selected} onClose={() => setSelectedId(null)} onStepStatusChange={handleStepStatusChange} />
    </div>
  );
}
