# Energy Intelligence Platform — Complete Overhaul Spec

**Date:** 2026-06-05  
**Status:** Approved by user  
**Project:** energy-stress-app (`/Users/javiercaballero/Proyecto_Javi/energy-stress-app/`)

---

## Goal

Transform the current basic dashboard (6 tabs, minimal analysis, no enterprise feel) into a professional multi-persona energy analytics platform that a real company would use. Target personas: energy trader, TSO operator, energy analyst/consultant, executive.

---

## Visual Identity

| Property | Value |
|---|---|
| Style | Modern Analytics Platform (Datadog / Grafana / Linear) |
| Background | `#0f1117` |
| Sidebar | `#0d1017` |
| Cards | `#1a1d27` |
| Primary accent | `#6366f1` (indigo) |
| Stress/alert | `#f87171` (red) |
| Renewables | `#34d399` (green) |
| Warning | `#f59e0b` (amber) |
| Typography | Inter / system-ui, tabular-nums for data |
| Border | `#1e2235` |

---

## Layout

```
┌─────────────────────────────────────────────────────┐
│  HEADER (48px): Logo · Country · Date · Fetch btn   │
├──────────────┬─���────────────────────────────────────┤
│ SIDEBAR      │                                      │
│ (180px)      │         CONTENT AREA                 │
│              │                                      │
│ 1. Overview  │   (section-specific content)         │
│ 2. Stress    │                                      │
│ 3. Market    │                                      │
│ 4. Generation│                                      │
│ 5. Network   │                                      │
│ 6. Historical│                                      │
│ 7. Alerts    │                                      │
│ 8. Compare   │                                      │
│ 9. Capacity  │                                      │
│ 10. Reports  │                                      │
└──────────────┴──────────────────────────────────────┘
```

- Header: 48px, background `#0a0d14`, logo + country selector + date range + Fetch button
- Sidebar: 180px, background `#0d1017`, border-right `#1e2235`, active section has `#6366f1` left border + `rgba(99,102,241,0.1)` background
- Content: flex-1, overflow-y auto, padding 24px

---

## Sections

### 1. Command Overview (NEW)
Entry dashboard — first thing every user sees.
- 4 KPI cards: Stress Index (severity color), Avg Price (€/MWh), Renewable % (gradient bar), Active Alerts (count badge)
- Mini Europe map: choropleth of current prices, click to change country
- Stress event feed: last 5 detected events with timestamp, severity, cost
- Quick charts row: 24h price sparkline + 24h φ index sparkline side by side

### 2. Stress Analysis (IMPROVED)
- φ index chart: current + 90th percentile threshold + historical average band
- Heatmap hour×weekday: average φ by hour of day vs day of week
- Top stress events table: ranked by cost, with datetime, duration, peak price, peak load
- Percentile gauge: where today's peak φ sits in historical distribution
- Period comparison: current period vs same period last year

### 3. Market Intelligence (NEW)
- Cross-border price spread table: differential vs all neighbors (current hour)
- Price vs renewable correlation scatter chart
- Volatility indicator: rolling 24h standard deviation
- Arbitrage opportunities panel: top 3 corridors with highest spread
- Price distribution histogram: current day vs historical distribution

### 4. Generation & Mix (IMPROVED)
- Stacked area chart improved (colors + patterns)
- Donut chart: current generation mix snapshot
- Renewable % gauge with historical comparison
- CO₂ intensity estimate from generation mix
- Technology evolution bar: installed capacity added per year

### 5. Network & Flows (IMPROVED)
- Interactive Europe map: animated price transitions
- Flow arrows: thickness proportional to net flow volume
- Interconnection table: export, import, net, direction per corridor
- Congestion indicator: corridors near capacity highlighted amber/red

### 6. Historical Trends (NEW)
- Monthly price heatmap: year × month grid
- Annual trend line: price + load + renewable % over multiple years
- Seasonality chart: average by month across all years
- Stress events timeline: all detected events on a timeline

### 7. Alerts & Watchlist (NEW)
- Threshold configurator: user sets price (€/MWh) and stress (φ) thresholds
- Active alerts panel with severity badges (INFO/WARNING/CRITICAL)
- Event log: chronological feed of all threshold crossings
- Severity colors: blue / amber / red

### 8. Country Compare (IMPROVED)
- Up to 4 countries simultaneously
- Side-by-side metric cards per country
- Radar chart: energy profile comparison (price, renewable %, load, volatility, stress freq)
- Differential table: ranked differences

### 9. Capacity & Infrastructure (IMPROVED)
- Horizontal bar chart by technology (improved styling)
- Evolution line chart: total capacity over available years
- Renewables growth panel: solar + wind capacity trend
- Technology breakdown table: GW, % of total, YoY change

### 10. Intelligence Report (IMPROVED)
- Auto-generated narrative from current data
- Key charts embedded (stress, generation mix, price trend)
- Export PDF via html2pdf.js
- Export CSV of current fetch window
- Report timestamp and country header

---

## New Backend Endpoints

| Endpoint | Purpose |
|---|---|
| `GET /api/historical` | Long-range price + load (params: country, start_year, end_year) |
| `GET /api/market` | Cross-border spreads + rolling volatility |
| `GET /api/alerts` | Threshold evaluation against current data (no new ENTSO-E calls) |

Existing 6 endpoints preserved and extended where needed.

---

## Files to Create / Modify

| File | Change |
|---|---|
| `frontend/index.html` | New layout: sidebar + header + content area |
| `frontend/css/base.css` | New CSS vars for full dark theme |
| `frontend/css/layout.css` | Sidebar + header layout rules |
| `frontend/css/sidebar.css` | Sidebar component styles |
| `frontend/js/app.js` | Sidebar navigation logic |
| `frontend/js/charts/overview.js` | NEW |
| `frontend/js/charts/market.js` | NEW |
| `frontend/js/charts/historical.js` | NEW |
| `frontend/js/charts/alerts.js` | NEW |
| `frontend/js/charts/stress.js` | IMPROVED |
| `frontend/js/charts/generation.js` | IMPROVED |
| `frontend/js/charts/map.js` | IMPROVED |
| `frontend/js/charts/capacity.js` | IMPROVED |
| `frontend/js/compare.js` | IMPROVED |
| `frontend/js/report.js` | IMPROVED |
| `server.py` | 3 new endpoints + Pydantic models |

---

## Implementation Phases

1. **Foundation** — layout, sidebar, dark theme CSS tokens
2. **Core sections** — Overview, Stress, Generation, Network (existing data)
3. **New analysis** — Market Intelligence, Historical Trends, Alerts (new endpoints)
4. **Polish** — Compare, Capacity, Reports improvements

---

## Success Criteria

- Looks like a platform a real energy company would pay for
- All 10 sections functional with real ENTSO-E data
- Sidebar navigation with 10 items, no overflow
- Dark theme consistent across all sections
- At least 3 chart types per major section
- PDF and CSV export working
- Mobile-responsive
- All existing tests pass + new tests for new endpoints
