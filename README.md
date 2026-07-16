# Madestays — Owner Onboarding Dashboard

A front-end dashboard for a Madestays property owner to track their properties through onboarding: a portfolio overview, status filtering, and a per-property checklist with detail on what's blocking each step.

Built with Next.js (App Router), React, and TypeScript. Styled with Tailwind CSS.

## Running it

```bash
npm install
npm run dev
```

Then open http://localhost:3000. The data load has a ~900ms simulated delay (see `src/lib/data.ts`) so the loading state is visible on every load — refresh to see it again.

```bash
npm run build && npm start   # production build
```

## Design approach

The brief's audience is an owner of several luxury London/Cotswolds/Cornwall short-let properties — the tone aimed for is closer to a private estate agency or members' club than a SaaS dashboard: a cool stone background, a deep bottle-green brand colour, Fraunces for display type paired with Inter for body/data, and IBM Plex Mono for figures and dates (a ledger feel, fitting for tracking documentation and sign-off).

The signature element is the brass "seal" progress ring used on both the property cards and the detail view — one consistent motif for "how far through onboarding is this property," rather than a generic percentage bar.

## Assumptions made

- **Empty `steps` array** (`Kingsgate Mews House` has none): rather than showing a broken/empty checklist, every property is checked against the full 10-item `onboardingStepDefinitions` list, and any step missing from a property's own `steps` array defaults to `not_started`. This lives in one place — `resolvePropertySteps` in `src/lib/onboarding.ts`.
- **Unrecognised status** (`on_hold` on Lower Slaughter's payout step, which isn't in `statusLegend`): treated as something that needs a human look, same as `action_required`, rather than silently miscategorised as fine. It's labelled honestly in the UI ("On Hold") rather than hidden.
- **"Live"** is defined as every one of the 10 steps being `complete`. Only Cadogan Gardens currently qualifies.
- **Filter categories** (All / Live / In Progress / Needs Attention) are derived, not present in the data — "Needs Attention" takes priority for any property with at least one `action_required` or unrecognised-status step.
- **Missing property image** (`Porthcurno Cliff House`): falls back to a plaque-style panel with the property's initials rather than a broken image icon.
- Overall portfolio completion in the summary band is the average of each property's own percent-complete, not a single flat count across all steps — this keeps a 2-property and a 10-property owner comparable.

## With more time

- A dedicated `/properties/[id]` route as an alternative to the modal, so a specific property's checklist is linkable/shareable.
- Persisted filter state in the URL (`?filter=needs_attention`) rather than component state.
- Real image optimisation fallback handling (retry/skeleton) for the placeholder `picsum.photos` URLs, which can occasionally be slow.
- Unit tests around `src/lib/onboarding.ts`, since that's where all the "awkward data" handling lives and is the highest-value thing to protect against regressions.

## AI tools

<!-- Fill this in honestly before submitting — see ai-sessions/ for the brief's export instructions per tool. -->
