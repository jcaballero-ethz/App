# EnergyStress — Visual Overhaul v2
**Date:** 2026-06-06
**Goal:** Eliminate the "AI-made" generic look. Reference: Electricity Maps + Wood Mackenzie + Bloomberg editorial.

## Problem
Current app looks like a generic dark dashboard template:
- Metric cards with visible borders (most common AI design pattern)
- system-ui font, no typographic hierarchy
- Numbers same visual weight as labels
- Sidebar labels generic ("Platform", "Analysis")
- Data appears instantly with no visual narrative
- Color used decoratively, not semantically

## Design Principles
1. **Reduction** — remove ornament, let data speak
2. **Semantic color** — green=renewable, amber=price, red=stress. Never decorative.
3. **Editorial typography** — primary KPI at 52px Inter 800, negative letter-spacing
4. **Live signal** — pulsing dot = real data
5. **Gradient identity line** — 2px green→indigo→red = unique brand mark

---

## 1. Typography — Inter Font

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

Scale:
- Hero KPI: `52px / 800 / letter-spacing: -3px`
- Large metric: `28px / 700 / letter-spacing: -1.5px`
- Label: `10px / 500 / letter-spacing: 1.5px / uppercase`

---

## 2. Semantic Color Rules

| Color | Hex | Only use for |
|-------|-----|-------------|
| Green `#22c55e` | Renewable %, live dot, positive |
| Amber `#f59e0b` | Price EUR/MWh, caution |
| Red `#f87171` | Stress, φ exceeded, alerts |
| Indigo `#6366f1` | Brand, sidebar active, neutral charts |
| Blue `#60a5fa` | Load/demand values |

---

## 3. Component Changes

### 3a. Remove Metric Card Borders
Before: card with background + 1px border + border-radius
After: number + label, separated only by horizontal dividers and whitespace

### 3b. Hero KPI Layout (overview.js)
```
● SPAIN · DAY-AHEAD
€142.50 /MWh
2025-04-28 · 4 stress hours above threshold
────────────────── (gradient line)
73%        4,567      HIGH
Renewable  Peak φ     Stress
```

### 3c. Brand Gradient Line
```css
height: 2px;
background: linear-gradient(to right, #22c55e 25%, #6366f1 55%, #f87171 80%, transparent);
```

### 3d. Live Dot
```css
@keyframes live-pulse {
  0%,100% { box-shadow: 0 0 0 3px rgba(34,197,94,0.2); }
  50%     { box-shadow: 0 0 0 7px rgba(34,197,94,0.04); }
}
```

---

## 4. Sidebar — Icons + Short Labels

Replace text-only items with SVG icon (16px) + short name.

Label map:
- "Command Overview" → ⚡ Overview
- "Stress Analysis" → 〰 Stress
- "Market Intelligence" → 📊 Market
- "Generation & Mix" → ⚙ Generation
- "Network & Flows" → 🌐 Network
- "Historical Trends" → 🕐 Historical
- "Alerts & Watchlist" → 🔔 Alerts
- "Country Compare" → ⇄ Compare
- "Capacity & Infra" → 🗄 Capacity
- "Intelligence Report" → 📄 Report

Remove group labels ("Platform", "Analysis") → subtle `<hr>` dividers.

---

## 5. Staggered Entrance Animations

```css
@keyframes enterUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
.enter-1 { animation: enterUp 0.4s ease 0.05s both; }
.enter-2 { animation: enterUp 0.4s ease 0.12s both; }
.enter-3 { animation: enterUp 0.4s ease 0.19s both; }
.enter-4 { animation: enterUp 0.4s ease 0.26s both; }
```

---

## 6. Header
- Country select: flag emoji + name (🇪🇸 Spain)
- Button text: "Analyse ⚡" instead of "Fetch data"

---

## Files to Change
| File | Change |
|------|--------|
| `index.html` | Inter font link, sidebar icons+labels, button text |
| `css/base.css` | Font family, enterUp keyframes, live-dot |
| `css/metrics.css` | Remove card borders, new borderless layout |
| `css/sidebar.css` | Icon+label items, remove section group labels |
| `js/charts/overview.js` | Hero KPI layout, gradient line, semantic colors |
| `js/app.js` | Flag+country name, apply enter-N classes on render |

## Out of Scope
- Three.js 3D (future)
- Real-time ticker (future)
