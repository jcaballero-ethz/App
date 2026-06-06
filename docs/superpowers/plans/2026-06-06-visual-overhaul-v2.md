# Visual Overhaul v2 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace generic AI-made dark dashboard look with editorial, intentional design — Fira Code for data numbers, semantic colors (green=renewable, amber=price, red=stress), borderless cards, live dot, gradient identity line, sidebar SVG icons, staggered entrance animations.

**Architecture:** CSS tokens first (base.css), then component CSS (metrics.css, sidebar.css), then JS render updates (overview.js, app.js, stress.js). Each phase leaves the app working.

**Tech Stack:** Vanilla JS, CSS custom properties, Plotly.js 2.27, FastAPI. Python: `/opt/anaconda3/envs/zen-garden-env/bin/python`. Dir: `/Users/javiercaballero/Proyecto_Javi/energy-stress-app/`

**Spec:** `docs/superpowers/specs/2026-06-06-visual-overhaul-v2.md`

**ui-ux-pro-max says:** Fira Code (data) + Fira Sans/Inter (UI), amber #D97706 for price CTA, SVG icons mandatory (no emojis in structure), 150-300ms transitions, hover tooltips.

---

## Pre-flight

- [ ] `kill $(lsof -ti :8000) 2>/dev/null || true`
- [ ] `/opt/anaconda3/envs/zen-garden-env/bin/python -m pytest tests/ -v` — 11 passed

---

## Task 1 — Typography: Fira Code + Inter fonts

**Files:**
- Modify: `frontend/index.html`
- Modify: `frontend/css/base.css`

- [ ] **Step 1: Add Google Fonts preconnect + link in index.html**

Find `<link rel="stylesheet" href="/static/css/base.css">` and add BEFORE it:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600;700&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

- [ ] **Step 2: Update font-family in base.css**

Find:
```css
  font-family: system-ui, -apple-system, sans-serif;
```
Replace with:
```css
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
```

- [ ] **Step 3: Add font + utility vars to :root in base.css**

Inside `:root { ... }`, after `--radius-sm: 6px;`, add:
```css
  --font-data: 'Fira Code', 'Courier New', monospace;
  --font-ui:   'Inter', system-ui, sans-serif;
```

- [ ] **Step 4: Verify**
```bash
/opt/anaconda3/envs/zen-garden-env/bin/python -c "import server; print('OK')"
```
Expected: `OK`

- [ ] **Step 5: Commit**
```bash
git add frontend/index.html frontend/css/base.css
git commit -m "feat: typography — Fira Code (numbers) + Inter (UI) via Google Fonts"
```

---

## Task 2 — CSS Tokens: Animations, Live Dot, Gradient Line, Number Classes

**Files:**
- Modify: `frontend/css/base.css`

- [ ] **Step 1: Append to end of base.css**

```css
/* ── Staggered entrance ── */
@keyframes enterUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
.enter-1 { animation: enterUp 0.35s ease 0.05s both; }
.enter-2 { animation: enterUp 0.35s ease 0.10s both; }
.enter-3 { animation: enterUp 0.35s ease 0.16s both; }
.enter-4 { animation: enterUp 0.35s ease 0.22s both; }
.enter-5 { animation: enterUp 0.35s ease 0.28s both; }

/* ── Live dot ── */
@keyframes live-pulse {
  0%, 100% { box-shadow: 0 0 0 3px rgba(34,197,94,0.2); }
  50%       { box-shadow: 0 0 0 7px rgba(34,197,94,0.04); }
}
.live-dot {
  display: inline-block;
  width: 7px; height: 7px;
  border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 0 3px rgba(34,197,94,0.2);
  animation: live-pulse 2s ease-in-out infinite;
  flex-shrink: 0;
}

/* ── Number typography ── */
.num-hero {
  font-family: var(--font-data);
  font-size: 52px; font-weight: 700;
  line-height: 1; letter-spacing: -2px;
  font-variant-numeric: tabular-nums;
}

/* ── Semantic value colors ── */
.val-green { color: #22c55e; }
.val-amber { color: #f59e0b; }
.val-red   { color: #f87171; }
.val-blue  { color: #60a5fa; }

/* ── Gradient identity line ── */
.gradient-line {
  height: 2px;
  background: linear-gradient(to right, #22c55e 20%, #6366f1 55%, #f87171 80%, transparent);
  border-radius: 1px;
  margin: 20px 0 22px;
  border: none;
}
```

- [ ] **Step 2: Commit**
```bash
git add frontend/css/base.css
git commit -m "feat: CSS tokens — enterUp, live-dot, gradient-line, semantic val-* classes"
```

---

## Task 3 — Borderless Metric Cards

**Files:**
- Modify: `frontend/css/metrics.css`

- [ ] **Step 1: Read current metrics.css**

Note existing `.metric-card`, `.tint-*`, `.metric-value` rules.

- [ ] **Step 2: Replace the entire .metric-card block**

Find the `.metric-card` rule and all `.tint-*` variants. Replace them all with:

```css
/* ── Metric Cards — borderless editorial ── */
.metrics-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0;
  margin-bottom: 28px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
}

.metric-card {
  padding: 20px 24px;
  border-right: 1px solid var(--border);
  background: var(--card-bg);
  transition: background 0.15s;
}
.metric-card:last-child { border-right: none; }
.metric-card:hover { background: rgba(255,255,255,0.02); }

.metric-card.tint-green  { border-top: 2px solid #22c55e; }
.metric-card.tint-blue   { border-top: 2px solid #60a5fa; }
.metric-card.tint-orange { border-top: 2px solid #f59e0b; }

.metric-label {
  font-size: 10px; font-weight: 500;
  letter-spacing: 1.5px; text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 6px;
}

.metric-value {
  font-family: var(--font-data);
  font-size: 26px; font-weight: 600;
  line-height: 1.1; letter-spacing: -1px;
  color: var(--text);
  font-variant-numeric: tabular-nums;
}
.metric-value.green  { color: #22c55e; }
.metric-value.orange { color: #f59e0b; }
.metric-value.blue   { color: #60a5fa; }

.metric-sub {
  font-size: 11px; color: var(--text-muted);
  margin-top: 4px; line-height: 1.4;
}

@media (max-width: 768px) {
  .metrics-row { grid-template-columns: repeat(2, 1fr); }
  .metric-card:nth-child(2) { border-right: none; }
}
@media (max-width: 375px) {
  .metric-card { padding: 14px 16px; }
  .metric-value { font-size: 20px; }
}
```

- [ ] **Step 3: Commit**
```bash
git add frontend/css/metrics.css
git commit -m "feat: metric cards — borderless, Fira Code numbers, tint top-borders only"
```

---

## Task 4 — Sidebar: SVG Icons + Short Labels

**Files:**
- Modify: `frontend/index.html` (nav block)
- Modify: `frontend/css/sidebar.css`

- [ ] **Step 1: Replace entire nav.app-sidebar content in index.html**

Find `<nav class="app-sidebar" ...>` through `</nav>` and replace with:

```html
    <nav class="app-sidebar" role="navigation" aria-label="Main navigation">
      <div class="sidebar-item active" data-section="overview" tabindex="0" aria-current="page">
        <svg class="sidebar-icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" stroke-width="1.5"/><rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" stroke-width="1.5"/><rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" stroke-width="1.5"/><rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" stroke-width="1.5"/></svg>
        <span>Overview</span>
      </div>
      <div class="sidebar-divider"></div>
      <div class="sidebar-item" data-section="stress" tabindex="0">
        <svg class="sidebar-icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><polyline points="1,12 4,7 7,10 10,4 13,8 15,5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span>Stress</span>
      </div>
      <div class="sidebar-item" data-section="market" tabindex="0">
        <svg class="sidebar-icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect x="1" y="10" width="3" height="5" rx="0.5" stroke="currentColor" stroke-width="1.5"/><rect x="6" y="6" width="3" height="9" rx="0.5" stroke="currentColor" stroke-width="1.5"/><rect x="11" y="2" width="3" height="13" rx="0.5" stroke="currentColor" stroke-width="1.5"/></svg>
        <span>Market</span>
      </div>
      <div class="sidebar-item" data-section="gen" tabindex="0">
        <svg class="sidebar-icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><circle cx="8" cy="8" r="3" stroke="currentColor" stroke-width="1.5"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M11.54 4.46l-1.41 1.41M4.95 11.54l-1.41 1.41" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
        <span>Generation</span>
      </div>
      <div class="sidebar-item" data-section="map" tabindex="0">
        <svg class="sidebar-icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><circle cx="8" cy="8" r="6.5" stroke="currentColor" stroke-width="1.5"/><path d="M1.5 8h13M8 1.5c-2 2-3 4-3 6.5s1 4.5 3 6.5M8 1.5c2 2 3 4 3 6.5s-1 4.5-3 6.5" stroke="currentColor" stroke-width="1.5"/></svg>
        <span>Network</span>
      </div>
      <div class="sidebar-item" data-section="historical" tabindex="0">
        <svg class="sidebar-icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><circle cx="8" cy="8" r="6.5" stroke="currentColor" stroke-width="1.5"/><polyline points="8,4 8,8 11,10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span>Historical</span>
      </div>
      <div class="sidebar-item" data-section="alerts" tabindex="0">
        <svg class="sidebar-icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M8 1.5a5 5 0 0 1 5 5v2.5l1 2H2l1-2V6.5a5 5 0 0 1 5-5z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M6.5 13.5a1.5 1.5 0 0 0 3 0" stroke="currentColor" stroke-width="1.5"/></svg>
        <span>Alerts</span>
      </div>
      <div class="sidebar-divider"></div>
      <div class="sidebar-item" data-section="compare" tabindex="0">
        <svg class="sidebar-icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M5 3H2v10h3M11 3h3v10h-3M5 8h6M8 5l3 3-3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span>Compare</span>
      </div>
      <div class="sidebar-item" data-section="cap" tabindex="0">
        <svg class="sidebar-icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect x="1.5" y="4.5" width="13" height="9" rx="1" stroke="currentColor" stroke-width="1.5"/><path d="M5 4.5V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1.5" stroke="currentColor" stroke-width="1.5"/><line x1="5" y1="9" x2="11" y2="9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
        <span>Capacity</span>
      </div>
      <div class="sidebar-item" data-section="report" tabindex="0">
        <svg class="sidebar-icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M4 1.5h5.5L13 5v9.5H4V1.5z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M9 1.5V5h3.5" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><line x1="6" y1="8" x2="10.5" y2="8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="6" y1="10.5" x2="10.5" y2="10.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
        <span>Report</span>
      </div>
    </nav>
```

- [ ] **Step 2: Update sidebar.css — add icon layout + divider**

In `frontend/css/sidebar.css`:

Replace `.sidebar-section-label { ... }` with:
```css
.sidebar-divider {
  height: 1px;
  background: var(--border);
  margin: 6px 12px;
}
```

Replace the base `.sidebar-item { ... }` rule with:
```css
.sidebar-item {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 8px 16px;
  font-size: 12px; font-weight: 500;
  color: var(--text-muted);
  cursor: pointer;
  border-left: 2px solid transparent;
  transition: color 0.15s, background 0.15s, border-color 0.15s;
  user-select: none;
  border-radius: 0 4px 4px 0;
  margin-right: 6px;
}
```

After the last rule in the file, add:
```css
.sidebar-icon {
  width: 15px; height: 15px;
  flex-shrink: 0;
  opacity: 0.6;
  transition: opacity 0.15s;
}
.sidebar-item:hover .sidebar-icon,
.sidebar-item.active .sidebar-icon { opacity: 1; }

@media (max-width: 768px) {
  .sidebar-item { gap: 0; padding: 10px 12px; }
  .sidebar-item span { display: none; }
  .sidebar-icon { width: 16px; height: 16px; }
  .sidebar-divider { display: none; }
}
```

- [ ] **Step 3: Verify sidebar item count**
```bash
grep -c "sidebar-item" /Users/javiercaballero/Proyecto_Javi/energy-stress-app/frontend/index.html
```
Expected: 10

- [ ] **Step 4: Commit**
```bash
git add frontend/index.html frontend/css/sidebar.css
git commit -m "feat: sidebar — SVG icons + short labels, dividers, mobile icon-only"
```

---

## Task 5 — Command Overview: Hero KPI + Live Dot + Gradient Line

**Files:**
- Modify: `frontend/index.html` (section-overview containers)
- Modify: `frontend/js/charts/overview.js`

- [ ] **Step 1: Update section-overview in index.html**

Find `<section class="section" id="section-overview">` and replace its inner content with:

```html
        <div id="overview-hero" class="enter-1"></div>
        <div id="overview-kpis" class="metrics-row enter-2"></div>
        <div id="overview-charts">
          <div class="chart-card enter-3" style="display:grid;grid-template-columns:1fr 1fr;gap:16px;padding:16px;">
            <div id="chart-overview-price" style="height:160px;"></div>
            <div id="chart-overview-phi" style="height:160px;"></div>
          </div>
        </div>
```

- [ ] **Step 2: Replace entire overview.js**

```javascript
function renderOverview(stress, gen) {
  if (!stress || !gen) return;

  const renewableKeys = ['Wind Onshore','Wind Offshore','Solar','Hydro Run-of-river and poundage',
    'Hydro Water Reservoir','Other renewable','Geothermal'];
  const totalGen = Object.values(gen.series)
    .reduce((s, v) => s + v.reduce((a, b) => a + b, 0) / v.length, 0);
  const renewGen = Object.entries(gen.series)
    .filter(([k]) => renewableKeys.some(r => k.includes(r)))
    .reduce((s, [, v]) => s + v.reduce((a, b) => a + b, 0) / v.length, 0);
  const renewPct    = totalGen > 0 ? Math.round(renewGen / totalGen * 100) : 0;
  const stressHours = stress.phi.filter(v => v >= stress.threshold).length;
  const greenStop   = Math.min(renewPct, 40);
  const redStart    = stressHours > 4 ? 60 : stressHours > 0 ? 72 : 88;

  const heroEl = document.getElementById('overview-hero');
  if (heroEl) {
    heroEl.innerHTML = `
      <div style="padding:28px 0 4px;">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;">
          <span class="live-dot"></span>
          <span style="font-size:10px;font-weight:600;letter-spacing:2.5px;text-transform:uppercase;color:var(--text-muted);">${STATE.country || '—'} &middot; Day-ahead</span>
        </div>
        <div class="num-hero" style="color:#fff;">€${stress.avg_price.toFixed(2)}<span style="font-size:18px;font-weight:400;color:var(--text-muted);letter-spacing:0;"> /MWh</span></div>
        <div style="font-size:12px;color:var(--text-muted);margin-top:6px;">
          ${STATE.start || '—'} &middot; ${stressHours} stress hour${stressHours !== 1 ? 's' : ''} above threshold &middot; ${renewPct}% renewable
        </div>
        <hr class="gradient-line" style="background:linear-gradient(to right,#22c55e ${greenStop}%,#6366f1 55%,#f87171 ${redStart}%,transparent);">
      </div>`;
  }

  const kpisEl = document.getElementById('overview-kpis');
  if (kpisEl) {
    kpisEl.innerHTML = `
      <div class="metric-card tint-blue">
        <div class="metric-label">Avg Price</div>
        <div class="metric-value val-amber">€${stress.avg_price.toFixed(1)}</div>
        <div class="metric-sub">min €${stress.min_price.toFixed(1)} · EUR/MWh</div>
      </div>
      <div class="metric-card tint-green">
        <div class="metric-label">Renewable</div>
        <div class="metric-value val-green">${renewPct}%</div>
        <div class="metric-sub">of total generation mix</div>
      </div>
      <div class="metric-card ${stressHours > 4 ? 'tint-orange' : ''}">
        <div class="metric-label">Peak φ</div>
        <div class="metric-value ${stress.max_phi >= stress.threshold ? 'val-red' : ''}">${stress.max_phi.toFixed(0)}</div>
        <div class="metric-sub">${stressHours} hours above threshold</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Avg Load</div>
        <div class="metric-value val-blue">${stress.avg_load.toFixed(1)}</div>
        <div class="metric-sub">GW average demand</div>
      </div>`;
  }

  Plotly.react('chart-overview-price', [{
    x: stress.times, y: stress.prices,
    type: 'scatter', mode: 'lines',
    line: { color: '#f59e0b', width: 1.5 },
    fill: 'tozeroy', fillcolor: 'rgba(245,158,11,0.07)',
    hovertemplate: '%{y:.1f} EUR/MWh<extra></extra>',
  }], {
    ...PLOTLY_BASE,
    margin: { t: 16, r: 10, b: 30, l: 44 },
    yaxis: { ...PLOTLY_BASE.yaxis, title: 'EUR/MWh' },
    title: { text: 'Price', font: { size: 11, color: '#64748b' }, x: 0.02 },
  }, { responsive: true, displayModeBar: false });

  const phiColors = stress.phi.map(v => v >= stress.threshold ? '#f87171' : '#6366f1');
  Plotly.react('chart-overview-phi', [{
    x: stress.times, y: stress.phi,
    type: 'bar', marker: { color: phiColors },
    hovertemplate: '%{y:.0f} kEUR/h<extra></extra>',
  }], {
    ...PLOTLY_BASE,
    margin: { t: 16, r: 10, b: 30, l: 44 },
    yaxis: { ...PLOTLY_BASE.yaxis, title: 'kEUR/h' },
    title: { text: 'Stress φ', font: { size: 11, color: '#64748b' }, x: 0.02 },
  }, { responsive: true, displayModeBar: false });
}
```

- [ ] **Step 3: Verify syntax**
```bash
node --check /Users/javiercaballero/Proyecto_Javi/energy-stress-app/frontend/js/charts/overview.js && echo "OK"
```
Expected: `OK`

- [ ] **Step 4: Commit**
```bash
git add frontend/js/charts/overview.js frontend/index.html
git commit -m "feat: Overview hero KPI — live dot, 52px price, dynamic gradient line, semantic colors"
```

---

## Task 6 — Semantic Colors + Stagger + Country Flags in app.js

**Files:**
- Modify: `frontend/js/app.js`
- Modify: `frontend/js/charts/stress.js`

- [ ] **Step 1: Replace renderMetrics in app.js**

Find and replace the entire `function renderMetrics(d) { ... }`:

```javascript
function renderMetrics(d) {
  animateValue(document.getElementById('m-price'), parseFloat(d.avg_price), ' EUR/MWh', 600);
  document.getElementById('m-price-sub').textContent = `Range ${Math.min(...d.prices).toFixed(1)}–${Math.max(...d.prices).toFixed(1)}`;
  document.getElementById('m-price').className = 'metric-value val-amber';

  animateValue(document.getElementById('m-load'), parseFloat(d.avg_load), ' GW', 600);
  document.getElementById('m-load-sub').textContent = `Peak ${Math.max(...d.load).toFixed(1)} GW`;
  document.getElementById('m-load').className = 'metric-value val-blue';

  animateValue(document.getElementById('m-phi'), parseFloat(d.max_phi), ' kEUR/h', 600);
  document.getElementById('m-phi-sub').textContent = `${d.phi.filter(v => v >= d.threshold).length} stress hours`;
  document.getElementById('m-phi').className = `metric-value ${d.max_phi >= d.threshold ? 'val-red' : ''}`;

  const minEl = document.getElementById('m-minprice');
  animateValue(minEl, parseFloat(d.min_price), ' EUR/MWh', 600);
  minEl.className = `metric-value ${d.min_price < 0 ? 'val-green' : 'val-amber'}`;
  document.getElementById('card-min').className = `metric-card ${d.min_price < 0 ? 'tint-green' : ''}`;
}
```

- [ ] **Step 2: Add staggered entrance in fetchAll**

Inside `fetchAll()`, right after `renderFlowsTable(flows);` and before `hide('loading');`, add:

```javascript
    // Staggered entrance on data load
    ['overview-hero','overview-kpis','overview-charts','metrics-row'].forEach((id, i) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.classList.remove('enter-1','enter-2','enter-3','enter-4');
      void el.offsetWidth;
      el.classList.add(`enter-${i + 1}`);
    });
```

- [ ] **Step 3: Add country flags in DOMContentLoaded**

Inside the `DOMContentLoaded` handler, find:
```javascript
  Object.entries(countries).forEach(([name, code]) => {
    const o = document.createElement('option');
    o.value = code;
    o.textContent = name;
```
Replace with:
```javascript
  const FLAGS = {ES:'🇪🇸',FR:'🇫🇷',DE_LU:'🇩🇪',IT:'🇮🇹',PT:'🇵🇹',NL:'🇳🇱',BE:'🇧🇪',AT:'🇦🇹',CH:'🇨🇭',PL:'🇵🇱',DK:'🇩🇰',NO:'🇳🇴',SE:'🇸🇪',FI:'🇫🇮',GR:'🇬🇷',CZ:'🇨🇿',HU:'🇭🇺',RO:'🇷🇴'};
  Object.entries(countries).forEach(([name, code]) => {
    const o = document.createElement('option');
    o.value = code;
    o.textContent = FLAGS[code] ? `${FLAGS[code]} ${name}` : name;
```

- [ ] **Step 4: Fix stress.js price line to amber**

In `frontend/js/charts/stress.js`, find:
```javascript
    line: { color: '#059669', width: 1.5 },
    fillcolor: 'rgba(5,150,105,0.08)',
```
Replace:
```javascript
    line: { color: '#f59e0b', width: 1.5 },
    fillcolor: 'rgba(245,158,11,0.06)',
```

Also fix phi bar colors in stress.js:
Find: `const colors   = d.phi.map(v => v >= d.threshold ? '#ea580c' : '#bfdbfe');`
Replace: `const colors   = d.phi.map(v => v >= d.threshold ? '#f87171' : '#6366f1');`

- [ ] **Step 5: Verify syntax**
```bash
node --check /Users/javiercaballero/Proyecto_Javi/energy-stress-app/frontend/js/app.js && node --check /Users/javiercaballero/Proyecto_Javi/energy-stress-app/frontend/js/charts/stress.js && echo "OK"
```
Expected: `OK`

- [ ] **Step 6: Commit**
```bash
git add frontend/js/app.js frontend/js/charts/stress.js
git commit -m "feat: semantic colors, stagger animations, country flags in selector"
```

---

## Task 7 — Update Fetch Button + Final Test

**Files:**
- Modify: `frontend/index.html`

- [ ] **Step 1: Rename button in index.html**

Find:
```html
          <span class="btn-label">Fetch data</span>
```
Replace:
```html
          <span class="btn-label">Analyse</span>
```

- [ ] **Step 2: Run full test suite**
```bash
/opt/anaconda3/envs/zen-garden-env/bin/python -m pytest tests/ -v
```
Expected: 11 passed.

- [ ] **Step 3: Start server + smoke test**
```bash
/opt/anaconda3/envs/zen-garden-env/bin/uvicorn server:app --reload --port 8000
```
Open http://localhost:8000. Verify:
1. Inter font loaded (labels crisp)
2. Sidebar: icons + short labels, dividers between groups
3. Select shows 🇪🇸 Spain etc.
4. Click "Analyse" → data loads
5. Overview: pulsing live dot, €XX.XX at 52px, gradient line visible
6. Metric cards: no box borders, top-color tints, Fira Code numbers
7. Stress chart: amber price line, indigo/red phi bars
8. Elements fade-in with stagger
9. Mobile 375px: sidebar shows icons only

- [ ] **Step 4: Final commit + push**
```bash
git add -A
git commit -m "feat: visual overhaul v2 — editorial typography, semantic colors, live dot, SVG icons, gradient line"
git push origin main
```
