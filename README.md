# ELD Trip Planner — Frontend

React + TypeScript SPA that visualises FMCSA-compliant trucking trips. Submit three locations and current cycle hours — the app displays a live route map, stop timeline, HOS compliance panel, and printable ELD log sheets.

---

## What it does

1. Accepts trip input via a form (current location, pickup, dropoff, cycle hours used)
2. Calls the backend API and renders the full trip plan
3. Shows an interactive Leaflet map with two-color route legs and all projected stops
4. Renders a chronological Drive Plan timeline (driver-facing itinerary)
5. Shows HOS compliance metrics against all 5 FMCSA rules (dispatcher-facing)
6. Renders FMCSA-standard ELD log sheets on an HTML5 Canvas, one per day
7. Prints all ELD log sheets in landscape format — one page per day, nothing else

Fully responsive — desktop uses a three-panel layout (left stats / center map / right summary); mobile uses a bottom-navigation tab switcher.

---

## Requirements

- Node.js 18+
- npm 9+ (comes with Node 18)
- The backend API running at `http://localhost:8000` (see `server/README.md`)

---

## Running locally

```bash
cd client
npm install
npm run dev
```

App is at `http://localhost:5173`.

The dev server proxies `/api/*` to `http://localhost:8000` — make sure the backend is running first.

---

## Running with Docker

From the project root (starts the full stack including backend, Postgres, Redis):

```bash
cp .env.template .env
docker compose up --build
```

Frontend is at `http://localhost:3000`.

To stop:
```bash
docker compose down
```

---

## Environment variables

The only variable the frontend reads is set by Docker Compose automatically. For local dev it defaults to the Vite proxy, so no `.env` file is needed.

| Variable | Default | Description |
|---|---|---|
| `VITE_API_URL` | *(empty — uses Vite proxy)* | Full backend URL. Set to `http://localhost:8000` only when running outside Docker and the proxy is not available |

---

## Available scripts

| Script | What it does |
|---|---|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Type-check then compile to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run type-check` | Run `tsc --noEmit` — no output = no errors |
| `npm run lint` | ESLint over `src/` |

---

## Project structure

```
client/
├── src/
│   ├── main.tsx                    ReactDOM root — ThemeProvider + QueryClientProvider
│   ├── App.tsx                     Router root
│   ├── theme.ts                    MUI createTheme — all design tokens
│   │
│   ├── pages/
│   │   └── PlannerPage.tsx         Main page — wires all panels, handles responsive layout
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppHeader.tsx       Top bar — logo + "New Trip" button
│   │   │   └── TripBreadcrumb.tsx  Origin → destination breadcrumb strip
│   │   │
│   │   ├── TripForm/
│   │   │   └── TripForm.tsx        MUI TextField + Slider — trip input form
│   │   │
│   │   ├── RouteMap/
│   │   │   ├── RouteMap.tsx        Leaflet map — two-color legs, projected stop markers
│   │   │   ├── RoutePolyline.tsx   Dual-layer polyline (halo + main line)
│   │   │   ├── StopMarker.tsx      Colored circle marker per stop type
│   │   │   ├── MapTabSwitcher.tsx  Map / Routes tab toggle (floating, top-left)
│   │   │   └── RoutesBreakdown.tsx Drive Plan timeline — driver-facing itinerary overlay
│   │   │
│   │   ├── ELDLogSheet/
│   │   │   ├── ELDLogSheet.tsx     Day tabs, preview thumbnail, print trigger + print portal
│   │   │   ├── LogCanvas.tsx       HTML5 Canvas — FMCSA paper log renderer
│   │   │   └── LogSheetHeader.tsx  Log sheet header (driver info, date, totals)
│   │   │
│   │   ├── StopTimeline/
│   │   │   └── StopTimeline.tsx    Scrollable stop list with type icons and durations
│   │   │
│   │   ├── TripStats/
│   │   │   └── StatCards.tsx       Distance / driving hours / days / stops stat cards
│   │   │
│   │   ├── TripSummary/
│   │   │   ├── TripSummary.tsx     Route card, driver card, 70-hr cycle bar
│   │   │   ├── HOSCompliance.tsx   5-rule HOS compliance panel with progress bars
│   │   │   ├── FeaturedRouteCard.tsx  Origin → destination hero card
│   │   │   ├── DriverCard.tsx      Driver avatar + route label
│   │   │   └── ETACard.tsx         ETA display card
│   │   │
│   │   └── common/
│   │       ├── LoadingState.tsx    MUI Skeleton loading placeholders
│   │       └── ErrorSnackbar.tsx   MUI Snackbar + Alert for API errors with retry
│   │
│   ├── hooks/
│   │   └── useTripPlan.ts          TanStack Query mutation — POST /api/trips/plan/
│   │
│   ├── lib/
│   │   ├── api.ts                  Axios instance — base URL + error normalisation
│   │   └── utils.ts                formatHours, formatMiles, formatShortLocation
│   │
│   ├── types/
│   │   └── trip.ts                 TypeScript interfaces matching the backend response
│   │
│   └── constants/
│       ├── colors.ts               Stop-type → hex color map
│       └── hos.ts                  MAX_CYCLE_HOURS and other HOS constants
│
├── index.html
├── vite.config.ts                  Proxy /api → http://localhost:8000
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── package.json
└── Dockerfile
```

---

## Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite |
| Language | TypeScript |
| UI | Material UI (MUI) v5 |
| Map | Leaflet + react-leaflet v4 |
| Map tiles | CartoDB Positron (free, no API key) |
| Server state | TanStack Query v5 |
| Date formatting | date-fns |

---

## Key design decisions

**Two-color route legs** — the route geometry is split at the pickup point. The empty run (current → pickup) renders in green; the loaded run (pickup → dropoff) renders in amber. Intermediate stops (fuel, rest, break) are projected onto the route using elapsed-time fractions so their map markers appear where the driver actually was, not at the nearest city.

**ELD canvas rendering** — `LogCanvas.tsx` draws an FMCSA-standard paper log on an HTML5 Canvas. Each segment is drawn as a colored horizontal line on the correct duty-status row. Vertical connectors link status transitions. Stationary segments (pickup, fuel) get a bracket below row 4. The remarks band shows a flag slash at each transition point.

**Print isolation** — `ELDLogSheet.tsx` mounts a hidden `PrintZone` portal directly in `document.body` at `left: -99999px`. During `window.print()`, the global `@media print` rule hides everything via `visibility: hidden` then makes only `#eld-print-zone` visible. Canvas content is preserved because the element always has real dimensions (off-screen, not `display: none`). Each day prints on its own landscape page.

**Responsive layout** — `PlannerPage.tsx` detects `< md (900px)` via `useMediaQuery`. Mobile: full-screen form before results, then a `BottomNavigation` tab switcher (Map / Stops / Summary) with `100dvh` height to handle iOS Safari's address bar. The Leaflet map is always mounted and hidden via CSS to preserve its internal state across tab switches.

---

## HOS compliance panel

`HOSCompliance.tsx` verifies 5 FMCSA rules against the computed trip and surfaces them in a dispatcher-facing panel:

| Rule | CFR Reference |
|---|---|
| 11-hour driving limit per shift | § 395.3(a)(3) |
| 14-hour on-duty window | § 395.3(a)(2) |
| 10-hour rest requirement | § 395.3(a)(1) |
| 30-minute break after 8 cumulative hours | § 395.3(a)(3)(ii) |
| 70-hour/8-day cycle cap | § 395.3(b) |

Each rule shows a colored status icon (ok / warn / error), a progress bar, and the exact value vs. limit. A post-trip readiness block shows either available driving hours for the next load or the exact time a 34-hour restart completes.
