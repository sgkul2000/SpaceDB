# SpaceBase

Space and venue discovery dashboard. Search, filter, save spaces, track bookings, view activity.

---

## Running it

```bash
npm run dev   # http://localhost:3000
```

That's it — no separate API process needed. Data is served directly from `db.json` via Next.js API routes.

If you want to reset the data:

```bash
npm run generate  # rewrites db.json with fresh faker data
```

json-server (`npm run api`) still works locally if you want full mutation persistence during development, but it's not required.

Tests:

```bash
npm test
```

---

## Folder structure

Feature-based. Everything for a feature lives together:

```
src/
  app/              # routes only, no logic
  features/
    auth/
    discovery/      # filter logic, hooks, cards, grid, filter panel
    saved/
    bookings/
    dashboard/
  components/
    layout/         # Sidebar, AuthGuard
  lib/              # api.ts, format.ts
  hooks/            # useDebounce
  types/
```

---

## Server vs client components

Page files are server components that fetch data and pass it down. Client boundaries are pushed as far down as possible.

| File | Client? | Why |
|---|---|---|
| `discovery/page.tsx` | No | just fetches and passes spaces |
| `saved/page.tsx` | No | same |
| `dashboard/page.tsx` | No | parallel fetches bookings + saved + spaces |
| `bookings/page.tsx` | No | fetches bookings list |
| `SpaceGrid` | Yes | needs `useSearchParams` for URL filter state |
| `SpaceCard` | Yes | reads/writes Zustand saved store |
| `FilterPanel` | Yes | controlled inputs |
| `BookingsTable` | Yes | sort, selection, mutations |
| `DashboardView` | Yes | recharts needs the browser |
| `AuthGuard` | Yes | reads Zustand on mount, can't run on server |
| `Sidebar` | Yes | reads user from auth store |

---

## How filters work

URL params are the source of truth. When a filter changes:

1. `useFiltersFromUrl` serializes the new state to search params
2. `router.replace()` updates the URL (no reload)
3. On next render, `parseFilters(useSearchParams())` gives back a typed `Filters` object
4. `applyFilters` + `sortSpaces` are pure functions — they just take spaces + filters and return results

This means filters survive refresh and the URL is shareable. Search is debounced at 300ms — local state updates immediately for feel, URL updates after the user stops typing.

---

## Virtualization

Used `@tanstack/react-virtual` with row-based virtualization (each virtual item = one row of cards, not one card).

Row-based made more sense here because column count varies with viewport width. Virtualizing by row keeps the math simple.

Chose `@tanstack/react-virtual` over `react-window` because it's headless (no markup opinions) and more actively maintained. The trade-off: column count is computed on mount and doesn't respond to window resize — a resize observer would fix this but felt like overkill.

Used recharts for the dashboard chart. It's React-native, composable, and I only needed one bar chart — didn't want to pull in chart.js and manage canvas refs for that.

---

## State

- **Zustand** — auth session + saved space IDs. Needs to be accessible across the tree without prop drilling.
- **URL params** — discovery filters. Shareable, refresh-safe, back-button-friendly.
- **Local useState** — everything ephemeral: search input value, sort direction, row selections in the bookings table.

---

## What I'd do differently with more time

- The "Book now" button doesn't go anywhere — a detail page or modal with an actual booking form would complete the flow
- Availability date filter is wired into the type system and URL serialization but not shown in the UI yet (json-server can't really support it without some workarounds)
- Column count in the grid doesn't update on resize — needs a ResizeObserver
- Failed save toggles roll back silently, should show a toast
- No E2E tests — Playwright for the auth flow and filter round-trips would be worth adding

---

## Time

Around 12–13 hours. Auth and setup was maybe 2.5h, discovery took the longest at around 4h (filter composition + virtualization), the other three pages together were about 3h, then tests and polish and this README was another 3h or so.
