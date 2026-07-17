# Madestays — Owner Onboarding Dashboard

The dashboard a Madestays property owner sees when they log in to track their properties through onboarding — photography, safety certificates, insurance, payout setup, and the rest of the checklist — before a listing goes live.

Built with **Next.js (App Router) + React + TypeScript**, styled with **Tailwind CSS**, reading from the supplied `onboarding-data.json`. No backend: this is the front end only, as scoped.

## Running it

```bash
npm install
npm run dev
```

Open **http://localhost:3000**. Data loading has a ~900ms simulated delay (`src/lib/data.ts`) so the loading state is always visible on first paint — refresh to see it again.

```bash
npm run build && npm start   # production build
```

## What's here

**1. Portfolio overview** — a summary band up top (properties / live / needing attention / overall completion) so the owner gets the state of their whole portfolio before looking at any single property, plus a grid of property cards each showing a progress ring, live/attention badges, target go-live date, and step-completion count at a glance, with no click required.

**2. Filtering** — status tabs (All / Live / In progress / Needs attention) derived from each property's own step data, alongside a search box and a sort/refine popover (by go-live date, progress, name, or bedroom count), with a one-click reset once any of those are touched.

**3. Property detail view** — clicking a card opens a modal with the full 10-step checklist: every step's status, and the note explaining what's outstanding where one exists.

**Handled deliberately:**
- **Loading** — a skeleton state matching the eventual layout, not a spinner over blank space.
- **Empty results** — a proper empty state (not a blank grid) when a filter/search combination matches nothing, with a way back out.
- **Awkward data** — an empty `steps` array, a status not in the legend, a missing image, and an unusually long property name are all handled explicitly (see *Assumptions* below) rather than left to silently break the layout.

## Design approach

The brief's audience is an owner of several luxury London/Cotswolds/Cornwall short-let properties, so the tone aimed for is closer to a private estate agency or members' club than a generic SaaS dashboard: a cool stone background, a deep bottle-green brand colour, Fraunces for display type paired with Inter for body/data, and a monospace face for figures and dates — a ledger feel, fitting for tracking documentation and sign-off.

The signature element is the brass "seal" progress ring used on both the property cards and the detail view — one consistent motif for "how far through onboarding is this property," rather than a generic percentage bar repeated in different styles.

## Assumptions made

- **Empty `steps` array** (`Kingsgate Mews House` has none): rather than showing a broken/empty checklist, every property is checked against the full 10-item `onboardingStepDefinitions` list, and any step missing from a property's own `steps` array defaults to `not_started`. This lives in one place — `resolvePropertySteps` in `src/lib/onboarding.ts`.
- **Unrecognised status** (`on_hold` on Lower Slaughter's payout step, which isn't in `statusLegend`): treated as something that needs a human look, same as `action_required`, rather than silently miscategorised as fine. It's labelled honestly in the UI ("On Hold") rather than hidden.
- **"Live"** is defined as every one of the 10 steps being `complete`. Only Cadogan Gardens currently qualifies.
- **Filter categories** (All / Live / In Progress / Needs Attention) are derived, not present in the data — "Needs Attention" takes priority for any property with at least one `action_required` or unrecognised-status step.
- **Missing property image** (`Porthcurno Cliff House`): falls back to a plaque-style panel with the property's initials rather than a broken image icon.
- **Overall portfolio completion** in the summary band is the average of each property's own percent-complete, not a single flat count across all steps — this keeps a 2-property and a 10-property owner comparable.

## A known trade-off, called out rather than hidden

The step-status control in the property detail modal is currently editable by whoever is viewing it. For a real product this is a permissions problem: an owner shouldn't be able to mark their own safety certificate or insurance step "Complete" — that's Madestays' team's call to verify, not the owner's to self-certify. I've left it interactive here because there's no backend in this exercise to model "who can change what," and it's a useful way to demonstrate the checklist's derived state (percent complete, live status, filter bucket) recalculating live. In a real build this would be split into an owner-facing read-only status and a separate internal verification flow.

## With more time

- Split step-status editing (above) into a proper read-only owner view plus an internal-only verification surface.
- A dedicated `/properties/[id]` route as an alternative to the modal, so a specific property's checklist is linkable/shareable.
- Persist filter/search/sort state in the URL rather than component state, so a filtered view is shareable/bookmarkable.
- Real image-loading fallback handling (retry/skeleton) for the placeholder image URLs, which can occasionally be slow.
- Unit tests around `src/lib/onboarding.ts`, since that's where all the "awkward data" handling lives and is the highest-value thing to protect against regressions.

## AI tools

This project was built with **GitHub Copilot Chat (agent mode) in VS Code**, using the Claude Sonnet 5 model, across a series of chat turns covering scaffolding, styling passes, targeted bug fixes (an image not rendering, a hydration mismatch from locale-dependent date formatting), and a self-review pass that reconsidered a few features against the brief's actual scope.

VS Code's Copilot Chat doesn't have a Claude-Code-style `/export` command, so there's no single transcript file to export in that format — see `ai-sessions/README.md` for what's included instead.


