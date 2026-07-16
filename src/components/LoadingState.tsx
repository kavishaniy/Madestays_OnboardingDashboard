function Bone({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-full bg-hairline ${className}`} />;
}

export function LoadingState() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8" aria-busy="true" aria-live="polite">
      <div className="flex items-center justify-between border-b border-hairline pb-6">
        <Bone className="h-9 w-32" />
        <Bone className="h-9 w-40" />
      </div>

      <div className="flex flex-col gap-6 border-b border-hairline pb-8 pt-8 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-3">
          <Bone className="h-3 w-32" />
          <Bone className="h-7 w-64 rounded-lg" />
        </div>
        <div className="grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Bone className="h-2.5 w-16" />
              <Bone className="h-6 w-10 rounded-md" />
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2 py-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Bone key={i} className="h-9 w-24" />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 pb-12 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-2xl border border-hairline bg-surface shadow-card">
            <div className="aspect-[4/3] w-full animate-pulse bg-hairline" />
            <div className="space-y-3 p-5">
              <Bone className="h-4 w-3/4 rounded-md" />
              <Bone className="h-3 w-1/2 rounded-md" />
              <div className="flex items-center justify-between border-t border-hairline pt-3">
                <Bone className="h-3 w-20 rounded-md" />
                <Bone className="h-3 w-16 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <span className="sr-only">Loading your portfolio…</span>
    </div>
  );
}
