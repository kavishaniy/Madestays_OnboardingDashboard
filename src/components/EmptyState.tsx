interface EmptyStateProps {
  message: string;
  hint?: string;
}

export function EmptyState({ message, hint }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-hairline-strong bg-surface/60 px-6 py-20 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-hairline-strong">
        <span className="font-display text-xl italic text-ink-soft">—</span>
      </div>
      <p className="font-display text-lg text-ink">{message}</p>
      {hint && <p className="mt-2 max-w-sm text-sm text-ink-soft">{hint}</p>}
    </div>
  );
}
