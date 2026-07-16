import type { Owner } from "@/lib/types";

interface HeaderProps {
  owner: Owner;
}

export function Header({ owner }: HeaderProps) {
  const firstName = owner.name.split(" ")[0];

  return (
    <header className="flex flex-col gap-3 border-b border-hairline pb-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-brass/40 font-display text-sm italic text-brass">
          M
        </span>
        <span className="font-display text-xl tracking-wide text-ink">Madestays</span>
      </div>
      <div className="sm:text-right">
        <p className="text-sm text-ink-soft">Welcome back, {firstName}</p>
        <p className="font-mono text-xs text-ink-soft/70">{owner.accountManager}</p>
      </div>
    </header>
  );
}
