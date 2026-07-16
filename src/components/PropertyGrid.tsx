import type { PropertyProgress } from "@/lib/onboarding";
import { PropertyCard } from "./PropertyCard";
import { EmptyState } from "./EmptyState";

interface PropertyGridProps {
  properties: PropertyProgress[];
  onSelect: (id: string) => void;
}

export function PropertyGrid({ properties, onSelect }: PropertyGridProps) {
  if (properties.length === 0) {
    return (
      <EmptyState
        message="No properties match this view"
        hint="Try a different filter — everything shows up under All."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 pb-10 sm:grid-cols-2 sm:gap-6 sm:pb-12 lg:grid-cols-3">
      {properties.map((progress) => (
        <PropertyCard
          key={progress.property.id}
          progress={progress}
          onSelect={() => onSelect(progress.property.id)}
        />
      ))}
    </div>
  );
}
