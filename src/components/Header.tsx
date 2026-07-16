import type { Owner } from "@/lib/types";

interface HeaderProps {
  owner: Owner;
}

export function Header({ owner }: HeaderProps) {
  const firstName = owner.name.split(" ")[0];

  return (
    <header className="flex flex-col gap-3 border-b border-hairline pb-4 sm:flex-row sm:items-center sm:justify-between sm:pb-6">
      <div className="flex items-center gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-brass/40 font-display text-sm italic text-brass sm:h-9 sm:w-9">
          M
        </span>
        <span className="font-display text-lg tracking-wide text-ink sm:text-xl">Madestays</span>
      </div>
      <div className="sm:text-right">
        <p className="text-sm text-ink-soft">Welcome back, {firstName}</p>
        <p className="font-mono text-xs text-ink-soft/70">{owner.accountManager}</p>
      </div>
    </header>
  );
}
