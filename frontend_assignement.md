# Frontend Take-Home: Space & Venue Discovery Dashboard

## What You're Building

Build a **Space Discovery & Management Dashboard** — a platform where users can search, filter, and save spaces (meeting rooms, banquet halls, coworking spaces, etc.), track bookings, and view activity analytics.

**Dataset:** 500+ spaces. The UI must remain fast and responsive under this load.

---

## Core Pages / Views

### 0. Authentication

Implement a basic auth flow that gates the rest of the app.

#### Login Page
- Email + password fields with show/hide password toggle
- "Remember me" checkbox (persist session in `localStorage`)
- "Forgot password?" — show a toast/notification (no real reset flow needed)
- Social login buttons (Google, Microsoft, Apple) — UI only, clicking any logs the user in as a guest
- Link to Register page
- Validation: email format, password required; show inline error on failure
- On success: redirect to Discovery page

#### Register Page
- Fields: First name, Last name, Email, Phone, Password, Confirm Password
- Validate: all required, password ≥ 8 chars, passwords match; show inline errors
- On success: log the user in and redirect to Discovery page
- Link back to Login

#### Session & Logout
- After login, user's name and avatar initials appear in the sidebar
- Protected routes: navigating to any page while logged out should redirect to Login
- Logout button in sidebar: clears session, redirects to Login
- Use mock auth (no real backend needed) — store session in `localStorage` or `sessionStorage`

---

### 1. Discovery Page (Primary Feature)

This is the main page. Users search and filter a large catalog of spaces.

#### Search
- Full-text search input across: space name, location, description
- Debounce input (don't fire on every keystroke)
- Live result count: `"Showing 47 of 512 spaces"`
- Clear search button; empty state when no results match

#### Filter Panel
Users can apply multiple filters simultaneously. All filters compose with **AND logic**.

| Filter | Type |
|---|---|
| Category | Multi-select (e.g. Banquet Hall, Meeting Room, Coworking, Rooftop, Studio) |
| City / Location | Multi-select dropdown from available locations |
| Price Range | Slider or dynamic buckets derived from actual data — not hardcoded |
| Capacity | Min–Max range input |
| Amenities | Multi-select tags (Parking, Catering, AV Equipment, WiFi, Outdoor, Bar) |
| Minimum Rating | Star selector (1–5) |
| Availability Date | Date picker (optional — mark clearly if not implemented) |

- Active filters displayed as removable chips below the search bar
- Active filter count badge on "Filters" button (mobile)
- "Clear all filters" when any filter is active
- Filter state must be **synced to URL query params** — filters survive page refresh and can be shared via URL

#### Results Grid
- Card-based grid layout (responsive: 1 col mobile, 2 col tablet, 3–4 col desktop)
- Each card shows: cover image, space name, location, star rating + count, capacity, amenity tags, price per day, "Save" (heart) toggle, CTA button
- Sort options: Price (asc/desc), Rating, Capacity, Newest
- **Virtualization required** — the grid must handle 500+ cards without layout jank. Use windowing (e.g. `react-virtual`, `@tanstack/react-virtual`) or cursor-based pagination. Justify your choice in the README.

---

### 2. Saved Collection (Favourites)

- Grid of spaces the user has saved (heart-toggled from Discovery)
- Search within saved collection
- Filter by category or city within saved
- Remove from saved
- Empty state with CTA back to Discovery

---

### 3. Dashboard Overview

A summary panel (sidebar section or dedicated tab) showing the user's activity.

- **Stats cards:** Total Spaces Browsed, Saved Spaces, Active Bookings, Total Spent — each with a trend indicator (e.g. "+12% from last month")
- **Activity chart:** Monthly bookings or spend — a simple line or bar chart (build it yourself or use a lightweight chart lib like `recharts` or `chart.js` — justify in README)
- **Upcoming items list:** Next 3–5 upcoming bookings with status badges (Confirmed, Pending, Unread)

---

### 4. Bookings Table

A data table of the user's booking history.

- Columns: Space Name, Date, Type, Status, Amount, Actions
- **Search** across Space Name
- **Filter** by Status (multi-select: Pending, Confirmed, Cancelled) and Date Range
- Sortable columns with visual indicator
- Sticky header on scroll
- **Bulk actions:** Select rows → "Cancel selected" (PATCH API call per row) + "Export CSV"
- Selection count badge: `"3 of 24 selected"`
- "Select all" selects only filtered rows, not all 500+
- Empty state, loading state, error state with retry

---

## API & Data

- Use **json-server** as mock API (`npx json-server db.json --port 3001`)
- Your `db.json` must include:
  - `spaces` — **500+ entries** with realistic variety: name, description, city, category, price, capacity, rating, reviewCount, amenities (array), imageUrl, createdAt
  - `bookings` — 20–30 entries: spaceId, spaceName, date, type, status, amount
  - `saved` — user's saved space IDs
- Fetch spaces from `GET /spaces` on load
- Bulk actions: `PATCH /bookings/:id` per selected row
- Save/unsave: `POST /saved` / `DELETE /saved/:id`

---

## Technical Requirements

- **React 18+** with **TypeScript** (strict mode — no `any` unless justified with a comment)
- **Next.js App Router** — you must make deliberate Server Component vs Client Component boundary decisions. Document them in your README.
- **Auth:** mock login/register using `localStorage` or `sessionStorage`. No real auth provider needed. Protected routes must redirect to `/login` if unauthenticated.
- **No UI component libraries** (no MUI, Chakra, Ant Design, etc.) — build all components from scratch
- **Styling:** CSS Modules, Tailwind, or CSS-in-JS — your choice, must be consistent throughout
- **State management:** your choice — document the reasoning. URL params are the source of truth for filters.
- **Virtualization** for the Discovery grid (required — not optional)
- **Custom hooks** — search, filter composition, pagination/virtualization, and API calls should each live in a dedicated custom hook
- **Unit tests** for: filter composition logic, sort logic, URL param serialization/deserialization, and at least one custom hook. Use Vitest or Jest.

---

## What We're Evaluating

| Area | What we look at |
|---|---|
| Auth flow | Form validation, error states, session persistence, protected route redirect |
| Search & filter architecture | How cleanly is multi-filter state managed and composed? Is the URL the source of truth? |
| Performance at scale | Does the grid stay responsive with 500+ items? Virtualization or pagination used correctly? |
| Component design | Are components focused, reusable, and correctly split server/client? |
| TypeScript | Proper types, discriminated unions for filter state, no `any` leakage |
| Custom hooks | Are side effects and logic correctly extracted and testable? |
| Data handling | Deduplication, dynamic price bucketing, AND filter composition |
| Edge states | Empty, loading, error states — are they handled everywhere? |
| README quality | Can we follow the reasoning for every non-obvious decision? |

---

## Deliverables

### 1. GitHub Repository
- Clean commit history (not a single giant commit — we read the git log)
- Organized folder structure (feature-based or domain-based — justify in README)
- All code in TypeScript

### 2. README.md
- Setup: how to run json-server + the app (two processes)
- How to run tests
- Architecture overview — why you split components and hooks the way you did
- Server vs Client component decisions — where and why
- Filter state design — how URL params and React state stay in sync
- Virtualization choice — what you picked and why
- Trade-offs — what you chose and what you considered but rejected
- What you'd improve with more time (prioritized list)
- Time spent (estimate is fine)

### 3. Live Demo
- Deploy to Vercel, Netlify, or similar
- Include URL in README — it must actually work

---

## Time & Submission

**Time:** 12–16 hours
**Deadline:** 5 days from receiving this assignment

**Submit:** GitHub URL + Live Demo URL + Time spent

---

## Questions?

Reply if anything is unclear. Good luck.
