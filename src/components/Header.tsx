import type { Owner } from "@/lib/types";

interface HeaderProps {
  owner: Owner;
}

export function Header({ owner }: HeaderProps) {
  const firstName = owner.name.split(" ")[0];

  return (
    <header className="flex flex-col gap-3 border-b border-hairline pb-4 sm:flex-row sm:items-center sm:justify-between sm:pb-6">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-bottle font-display text-sm text-brass-light shadow-card sm:h-10 sm:w-10">
          M
        </span>
        <span className="font-display text-lg font-medium tracking-[0.04em] text-ink sm:text-xl">Madestays</span>
      </div>
      <div className="sm:text-right">
        <p className="text-sm text-ink-soft">Welcome back, {firstName}</p>
        <p className="font-mono text-xs text-ink-soft/70">{owner.accountManager}</p>
      </div>
    </header>
  );
}
