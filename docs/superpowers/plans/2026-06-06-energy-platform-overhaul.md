# Energy Intelligence Platform — Complete Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the 6-tab light dashboard into a professional 10-section dark analytics platform with sidebar navigation, 3 new backend endpoints, and 4 new analysis sections.

**Architecture:** Phase 1 rewrites the visual foundation (CSS tokens + sidebar layout); Phase 2 improves existing sections using current data; Phase 3 adds new FastAPI endpoints and the sections that depend on them; Phase 4 polishes Compare and Reports then runs full QA. Each phase leaves the app in a working, deployable state.

**Tech Stack:** FastAPI / Python 3.11, vanilla JS (ES2022), Plotly.js 2.27 (CDN defer), CSS custom properties, pytest + httpx.

**Spec:** `docs/superpowers/specs/2026-06-05-energy-platform-overhaul.md`

---

## Pre-flight checks

- [ ] Server running check: `lsof -i :8000` — kill any existing uvicorn process before starting
- [ ] All existing tests pass: `/opt/anaconda3/envs/zen-garden-env/bin/python -m pytest tests/ -v`
- [ ] Working directory: `/Users/javiercaballero/Proyecto_Javi/energy-stress-app/`

---

## Phase 1 — Foundation: Dark Theme + Sidebar Layout

> **REQUIRED before this phase:** Invoke `ui-ux-pro-max` skill with query: "dark analytics platform energy data dashboard indigo accent sidebar navigation Datadog Grafana professional". Use its output to validate or adjust the token values below.

### Task 1: Update CSS variables for dark theme

**Files:**
- Modify: `frontend/css/base.css`

- [ ] **Step 1: Replace the `:root` block**

Find the existing `:root { ... }` block and replace it entirely:

```css
:root {
  --bg:           #0f1117;
  --header-bg:    #0a0d14;
  --sidebar-bg:   #0d1017;
  --card-bg:      #1a1d27;
  --text:         #e2e8f0;
  --text-mid:     #94a3b8;
  --text-muted:   #64748b;
  --accent:       #6366f1;
  --accent-light: rgba(99,102,241,0.15);
  --border:       #1e2235;
  --stress:       #f87171;
  --surplus:      #34d399;
  --orange:       #f59e0b;
  --orange-light: rgba(245,158,11,0.1);
  --orange-border:#78350f;
  --blue:         #60a5fa;
  --blue-light:   rgba(96,165,250,0.1);
  --blue-border:  #1e3a5f;
  --shadow-sm:    0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3);
  --shadow-md:    0 4px 20px rgba(0,0,0,0.5);
  --radius:       8px;
  --radius-sm:    6px;
}
```

- [ ] **Step 2: Update skeleton shimmer colors**

Find the `.skeleton` rule and replace the gradient:

```css
.skeleton {
  background: linear-gradient(90deg, #1e2235 25%, #252840 50%, #1e2235 75%);
  background-size: 600px 100%;
  animation: shimmer 1.4s ease-in-out infinite;
  border-radius: var(--radius-sm);
}
```

- [ ] **Step 3: Update `.empty-hint` background**

```css
.empty-hint {
  display: inline-block;
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 10px 18px;
  font-size: 13px;
  box-shadow: var(--shadow-sm);
  transition-property: border-color, box-shadow;
  transition-duration: 150ms;
  transition-timing-function: ease-out;
}
```

- [ ] **Step 4: Verify server starts**

```bash
/opt/anaconda3/envs/zen-garden-env/bin/python -c "import server; print('OK')"
```

Expected: `OK`

- [ ] **Step 5: Commit**

```bash
git add frontend/css/base.css
git commit -m "feat: dark theme CSS tokens — #0f1117 bg, #6366f1 accent"
```

---

### Task 2: Build sidebar component CSS

**Files:**
- Modify: `frontend/css/sidebar.css` (currently a stub)

- [ ] **Step 1: Replace sidebar.css entirely**

```css
/* ── App body (header + sidebar + content row) ── */
.app-body {
  display: flex;
  flex: 1;
  overflow: hidden;
  min-height: 0;
}

/* ── Sidebar ── */
.app-sidebar {
  width: 180px;
  background: var(--sidebar-bg);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  overflow-y: auto;
  padding: 8px 0;
}

.sidebar-section-label {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--text-muted);
  padding: 16px 20px 4px;
}

.sidebar-item {
  padding: 9px 20px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-muted);
  cursor: pointer;
  border-left: 2px solid transparent;
  transition: color 0.15s, background 0.15s, border-color 0.15s;
  user-select: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar-item:hover {
  color: var(--text);
  background: rgba(99,102,241,0.06);
}

.sidebar-item:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: -2px;
}

.sidebar-item.active {
  color: var(--accent);
  border-left-color: var(--accent);
  background: var(--accent-light);
  font-weight: 600;
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .app-body { flex-direction: column; }
  .app-sidebar {
    width: 100%;
    flex-direction: row;
    overflow-x: auto;
    overflow-y: hidden;
    padding: 0;
    border-right: none;
    border-bottom: 1px solid var(--border);
    -webkit-overflow-scrolling: touch;
  }
  .sidebar-section-label { display: none; }
  .sidebar-item {
    padding: 10px 14px;
    font-size: 12px;
    white-space: nowrap;
    border-left: none;
    border-bottom: 2px solid transparent;
  }
  .sidebar-item.active {
    border-left: none;
    border-bottom-color: var(--accent);
    background: transparent;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/css/sidebar.css
git commit -m "feat: sidebar component CSS — 180px dark sidebar with active state"
```

---

### Task 3: Clean up layout.css

**Files:**
- Modify: `frontend/css/layout.css`

- [ ] **Step 1: Remove the Navigation Tabs section**

Delete everything from the comment `/* ── Navigation Tabs ── */` to the end of the `.nav-item.active { }` closing brace. Keep only the header rules (`.app-header`, `.header-logo`, `.header-controls`, `.btn-fetch` variants, and responsive `@media` blocks that only reference header elements).

- [ ] **Step 2: Update `.btn-fetch:hover`**

```css
.btn-fetch:hover { background: #4f52d4; }
```

- [ ] **Step 3: Commit**

```bash
git add frontend/css/layout.css
git commit -m "refactor: remove tabs CSS from layout.css, update accent hover"
```

---

### Task 4: Restructure index.html — sidebar layout

**Files:**
- Modify: `frontend/index.html`

- [ ] **Step 1: Read the full current index.html before editing**

Note the exact current structure and all existing section IDs.

- [ ] **Step 2: Replace the `.app-tabs` block with sidebar + open `.app-body`**

Find the `<!-- Navigation tabs -->` comment and the entire `.app-tabs` div. Replace it with:

```html
  <div class="app-body">
    <!-- Sidebar navigation -->
    <nav class="app-sidebar" role="navigation" aria-label="Main navigation">
      <div class="sidebar-section-label">Platform</div>
      <div class="sidebar-item active" data-section="overview" tabindex="0" role="menuitem">Command Overview</div>
      <div class="sidebar-section-label">Analysis</div>
      <div class="sidebar-item" data-section="stress" tabindex="0" role="menuitem">Stress Analysis</div>
      <div class="sidebar-item" data-section="market" tabindex="0" role="menuitem">Market Intelligence</div>
      <div class="sidebar-item" data-section="gen" tabindex="0" role="menuitem">Generation &amp; Mix</div>
      <div class="sidebar-item" data-section="map" tabindex="0" role="menuitem">Network &amp; Flows</div>
      <div class="sidebar-item" data-section="historical" tabindex="0" role="menuitem">Historical Trends</div>
      <div class="sidebar-item" data-section="alerts" tabindex="0" role="menuitem">Alerts &amp; Watchlist</div>
      <div class="sidebar-section-label">Compare &amp; Report</div>
      <div class="sidebar-item" data-section="compare" tabindex="0" role="menuitem">Country Compare</div>
      <div class="sidebar-item" data-section="cap" tabindex="0" role="menuitem">Capacity &amp; Infra</div>
      <div class="sidebar-item" data-section="report" tabindex="0" role="menuitem">Intelligence Report</div>
    </nav>
```

- [ ] **Step 3: Wrap existing main content in `.app-body` and close the wrapper**

The existing `<div class="main" id="main">` (or equivalent) should sit inside `.app-body` after the `</nav>`. Find the closing `</div>` of the main content area and add `</div><!-- /app-body -->` after it, before the closing `</div><!-- /app -->`.

- [ ] **Step 4: Add 4 new empty sections inside `#content`**

Inside `<div id="content">`, after the last existing `</section>`, add:

```html
      <section class="section" id="section-overview">
        <div id="overview-kpis" class="metrics-row"></div>
        <div id="overview-charts"></div>
      </section>

      <section class="section" id="section-market">
        <div id="market-content"></div>
      </section>

      <section class="section" id="section-historical">
        <div id="historical-content"></div>
      </section>

      <section class="section" id="section-alerts">
        <div id="alerts-content"></div>
      </section>
```

- [ ] **Step 5: Remove `active` class from `section-stress`**

Change `<section class="section active" id="section-stress">` to `<section class="section" id="section-stress">`.

- [ ] **Step 6: Add 4 new script tags before `</body>`**

```html
<script src="/static/js/charts/overview.js" defer></script>
<script src="/static/js/charts/market.js" defer></script>
<script src="/static/js/charts/historical.js" defer></script>
<script src="/static/js/charts/alerts.js" defer></script>
```

- [ ] **Step 7: Rename Risk Report heading to Intelligence Report**

Find any visible "Risk Report" text inside `section-report` and update to "Intelligence Report".

- [ ] **Step 8: Verify in browser**

```bash
cd /Users/javiercaballero/Proyecto_Javi/energy-stress-app
/opt/anaconda3/envs/zen-garden-env/bin/uvicorn server:app --reload --port 8000
```

Open http://localhost:8000. Expected: dark background, sidebar with 10 items, "Command Overview" active, header still visible.

- [ ] **Step 9: Commit**

```bash
git add frontend/index.html
git commit -m "feat: sidebar layout — 10 sections, .app-body wrapper, dark structure"
```

---

### Task 5: Update app.js

**Files:**
- Modify: `frontend/js/app.js`

- [ ] **Step 1: Read the full current app.js**

Note exact locations of `PLOTLY_BASE`, `showSection`, `STATE`, `fetchAll`, `DOMContentLoaded`.

- [ ] **Step 2: Replace PLOTLY_BASE**

```javascript
const PLOTLY_BASE = {
  paper_bgcolor: '#1a1d27',
  plot_bgcolor:  '#1a1d27',
  font: { family: 'system-ui, -apple-system, sans-serif', size: 11, color: '#94a3b8' },
  margin: { t: 20, r: 16, b: 40, l: 48 },
  xaxis: {
    gridcolor: '#2a2d3a', gridwidth: 1,
    linecolor: '#2a2d3a', tickcolor: '#2a2d3a',
    color: '#64748b', zeroline: false,
  },
  yaxis: {
    gridcolor: '#2a2d3a', gridwidth: 1,
    linecolor: '#2a2d3a', tickcolor: '#2a2d3a',
    color: '#64748b', zeroline: false,
  },
  showlegend: false,
};
```

- [ ] **Step 3: Add new keys to STATE**

```javascript
const STATE = {
  country: null, start: null, end: null,
  stress: null, gen: null, cap: null, flows: null,
  market: null, historical: null, alerts: null,
};
```

- [ ] **Step 4: Replace showSection — update selector and add new section handlers**

```javascript
function showSection(name) {
  document.querySelectorAll('.sidebar-item').forEach(i => {
    const active = i.dataset.section === name;
    i.classList.toggle('active', active);
    i.setAttribute('aria-selected', active);
  });
  document.querySelectorAll('.section').forEach(s =>
    s.classList.toggle('active', s.id === `section-${name}`));

  if (name === 'overview')   renderOverview(STATE.stress, STATE.gen);
  if (name === 'map')        renderMap();
  if (name === 'cap')        { renderCap(); setTimeout(() => Plotly.Plots.resize('chart-cap'), 50); }
  if (name === 'compare')    renderCompare();
  if (name === 'report')     renderReport();
  if (name === 'market')     renderMarket(STATE.market);
  if (name === 'historical') renderHistorical(STATE.historical);
  if (name === 'alerts')     renderAlerts(STATE.alerts);
}
```

- [ ] **Step 5: Update DOMContentLoaded — change .nav-item to .sidebar-item, update arrow keys**

Replace the existing click and keydown listeners:

```javascript
  document.querySelectorAll('.sidebar-item').forEach(item => {
    item.addEventListener('click', () => showSection(item.dataset.section));
  });

  document.querySelectorAll('.sidebar-item').forEach((item, idx, items) => {
    item.addEventListener('keydown', (e) => {
      let target = null;
      if (e.key === 'ArrowDown') target = items[(idx + 1) % items.length];
      if (e.key === 'ArrowUp')   target = items[(idx - 1 + items.length) % items.length];
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); showSection(item.dataset.section); }
      if (target) { target.focus(); showSection(target.dataset.section); }
    });
  });
```

- [ ] **Step 6: Update fetchAll — add new parallel endpoint calls**

```javascript
async function fetchAll() {
  const country = STATE.country;
  const start   = STATE.start;
  const end     = STATE.end;
  show('loading'); hide('error-msg');
  try {
    const [stress, gen, cap, flows, market, historical, alerts] = await Promise.all([
      API.stress(country, start, end),
      API.generation(country, start, end),
      API.capacity(country, start, end),
      API.flows(country, start, end),
      API.market(country, start, end).catch(() => null),
      API.historical(country, start, end).catch(() => null),
      API.alerts(country, start, end).catch(() => null),
    ]);
    STATE.stress = stress; STATE.gen = gen; STATE.cap = cap; STATE.flows = flows;
    STATE.market = market; STATE.historical = historical; STATE.alerts = alerts;
    hide('loading'); show('content');
    renderMetrics(stress);
    renderStressCharts(stress);
    renderGeneration(gen, stress);
    renderFlowsTable(flows);
    showSection('overview');
  } catch (err) {
    hide('loading');
    const el = document.getElementById('error-msg');
    el.textContent = err.message || 'Could not fetch data.';
    show('error-msg');
  }
}
```

- [ ] **Step 7: Verify existing charts still render**

Fetch Spain 2025-04-28. Click Stress Analysis, Generation, Map, Capacity — all should render. Then click new sidebar items — they show empty sections (expected for now).

- [ ] **Step 8: Commit**

```bash
git add frontend/js/app.js
git commit -m "feat: app.js dark PLOTLY_BASE, sidebar switching, new STATE + fetchAll"
```

---

### Task 6: Phase 1 QA agents

- [ ] **Step 1: Launch all 3 in parallel (background)**

```
Agent 1 (dev-tools:qa-responsive-style): Check sidebar responsive at 375/768px — does it collapse to horizontal tabs?
Agent 2 (dev-tools:qa-ux-friction): Audit sidebar navigation UX — labels, active states, keyboard nav
Agent 3 (ecc:code-reviewer): Review base.css, sidebar.css, layout.css, index.html, app.js changes
```

- [ ] **Step 2: Fix all CRITICAL/HIGH findings**

- [ ] **Step 3: Commit fixes**

```bash
git add -A
git commit -m "fix: Phase 1 QA — responsive, UX, code review findings"
```

---

## Phase 2 — Core Sections: Improved Charts

### Task 7: Command Overview section

**Files:**
- Create: `frontend/js/charts/overview.js`

- [ ] **Step 1: Create overview.js**

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
  const renewPct = totalGen > 0 ? Math.round(renewGen / totalGen * 100) : 0;
  const stressHours = stress.phi.filter(v => v >= stress.threshold).length;

  document.getElementById('overview-kpis').innerHTML = `
    <div class="metric-card tint-blue">
      <div class="metric-label">Stress Index (φ peak)</div>
      <div class="metric-value ${stress.max_phi >= stress.threshold ? 'orange' : ''}">${stress.max_phi.toFixed(0)}</div>
      <div class="metric-sub">${stressHours} hours above 90th pct threshold</div>
    </div>
    <div class="metric-card">
      <div class="metric-label">Avg Price</div>
      <div class="metric-value">€${stress.avg_price.toFixed(1)}</div>
      <div class="metric-sub">EUR/MWh · min €${stress.min_price.toFixed(1)}</div>
    </div>
    <div class="metric-card tint-green">
      <div class="metric-label">Renewable Share</div>
      <div class="metric-value green">${renewPct}%</div>
      <div class="metric-sub">of total generation mix</div>
    </div>
    <div class="metric-card">
      <div class="metric-label">Avg Load</div>
      <div class="metric-value blue">${stress.avg_load.toFixed(1)}</div>
      <div class="metric-sub">GW average demand</div>
    </div>
  `;

  document.getElementById('overview-charts').innerHTML = `
    <div class="chart-card" style="display:grid;grid-template-columns:1fr 1fr;gap:16px;padding:16px;">
      <div id="chart-overview-price" style="height:160px;"></div>
      <div id="chart-overview-phi" style="height:160px;"></div>
    </div>
  `;

  Plotly.newPlot('chart-overview-price', [{
    x: stress.times, y: stress.prices,
    type: 'scatter', mode: 'lines',
    line: { color: '#60a5fa', width: 1.5 },
    fill: 'tozeroy', fillcolor: 'rgba(96,165,250,0.08)',
    hovertemplate: '%{y:.1f} EUR/MWh<extra></extra>',
    name: 'Price',
  }], {
    ...PLOTLY_BASE,
    margin: { t: 16, r: 10, b: 30, l: 44 },
    yaxis: { ...PLOTLY_BASE.yaxis, title: 'EUR/MWh' },
    title: { text: 'Price', font: { size: 11, color: '#64748b' }, x: 0.02 },
  }, { responsive: true, displayModeBar: false });

  const phiColors = stress.phi.map(v => v >= stress.threshold ? '#f87171' : '#6366f1');
  Plotly.newPlot('chart-overview-phi', [{
    x: stress.times, y: stress.phi,
    type: 'bar',
    marker: { color: phiColors },
    hovertemplate: '%{y:.0f} kEUR/h<extra></extra>',
    name: 'φ',
  }], {
    ...PLOTLY_BASE,
    margin: { t: 16, r: 10, b: 30, l: 44 },
    yaxis: { ...PLOTLY_BASE.yaxis, title: 'kEUR/h' },
    title: { text: 'Stress Index φ', font: { size: 11, color: '#64748b' }, x: 0.02 },
  }, { responsive: true, displayModeBar: false });
}
```

- [ ] **Step 2: Verify**

Fetch Spain 2025-04-28, click "Command Overview". Expected: 4 KPI cards + 2 sparklines side by side.

- [ ] **Step 3: Launch ecc:typescript-reviewer on overview.js**

- [ ] **Step 4: Fix HIGH findings, then commit**

```bash
git add frontend/js/charts/overview.js
git commit -m "feat: Command Overview — KPI cards + price/phi sparklines"
```

---

### Task 8: Improve Stress Analysis — add heatmap

**Files:**
- Modify: `frontend/js/charts/stress.js`
- Modify: `frontend/index.html`

- [ ] **Step 1: Add heatmap container in index.html**

Inside `<section class="section" id="section-stress">`, after the last existing chart card, add:

```html
        <div class="chart-card" style="margin-top:16px;">
          <div id="chart-stress-heatmap" style="height:300px;"></div>
        </div>
```

- [ ] **Step 2: Append heatmap rendering to renderStressCharts in stress.js**

At the end of `renderStressCharts(d)`, add:

```javascript
  // Hour × weekday heatmap
  const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const buckets = Array.from({length: 24}, () => Array(7).fill(null).map(() => []));
  d.times.forEach((t, i) => {
    const dt = new Date(t);
    buckets[dt.getHours()][(dt.getDay() + 6) % 7].push(d.phi[i]);
  });
  const z = buckets.map(row => row.map(vals => vals.length ? vals.reduce((a,b)=>a+b,0)/vals.length : null));

  Plotly.newPlot('chart-stress-heatmap', [{
    z, x: DAYS,
    y: Array.from({length: 24}, (_, i) => `${String(i).padStart(2,'0')}:00`),
    type: 'heatmap',
    colorscale: [[0,'#1a1d27'],[0.5,'#6366f1'],[1,'#f87171']],
    hovertemplate: '%{y} %{x}: %{z:.0f} kEUR/h<extra></extra>',
    showscale: true,
  }], {
    ...PLOTLY_BASE,
    margin: { t: 16, r: 80, b: 40, l: 56 },
    xaxis: { ...PLOTLY_BASE.xaxis },
    yaxis: { ...PLOTLY_BASE.yaxis, title: 'Hour', autorange: 'reversed' },
    title: { text: 'Average φ by Hour of Day × Weekday', font: { size: 11, color: '#64748b' }, x: 0.02 },
  }, { responsive: true, displayModeBar: false });
```

- [ ] **Step 3: Verify, then commit**

```bash
git add frontend/js/charts/stress.js frontend/index.html
git commit -m "feat: stress section — hour×weekday phi heatmap"
```

---

### Task 9: Improve Generation — donut + CO₂

**Files:**
- Modify: `frontend/js/charts/generation.js`
- Modify: `frontend/index.html`

- [ ] **Step 1: Add containers in index.html**

After the existing chart in `section-gen`, add:

```html
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:16px;">
          <div class="chart-card">
            <div id="chart-gen-donut" style="height:260px;"></div>
          </div>
          <div class="metric-card" style="display:flex;flex-direction:column;justify-content:center;padding:28px;">
            <div class="metric-label">Renewable Share (now)</div>
            <div class="metric-value green" id="gen-renewable-pct">—</div>
            <div class="metric-sub" id="gen-co2-est" style="margin-top:12px;">CO₂ intensity: —</div>
          </div>
        </div>
```

- [ ] **Step 2: Append to renderGeneration in generation.js**

At the end of `renderGeneration(g, stress)`, add:

```javascript
  const lastIdx = g.times.length - 1;
  const donutLabels = [], donutValues = [];
  Object.entries(g.series).forEach(([name, vals]) => {
    const v = vals[lastIdx] || 0;
    if (v > 0.01) { donutLabels.push(name); donutValues.push(v); }
  });

  Plotly.newPlot('chart-gen-donut', [{
    labels: donutLabels, values: donutValues,
    type: 'pie', hole: 0.55,
    marker: { colors: donutLabels.map(l => GEN_COLORS[l] || '#64748b') },
    textinfo: 'percent', textfont: { size: 10, color: '#e2e8f0' },
    hovertemplate: '<b>%{label}</b><br>%{value:.2f} GW<extra></extra>',
  }], {
    ...PLOTLY_BASE,
    margin: { t: 16, r: 10, b: 10, l: 10 },
    title: { text: 'Current Mix Snapshot', font: { size: 11, color: '#64748b' }, x: 0.5, xanchor: 'center' },
    showlegend: false,
  }, { responsive: true, displayModeBar: false });

  const renewKeys = ['Wind Onshore','Wind Offshore','Solar','Hydro Run-of-river and poundage',
    'Hydro Water Reservoir','Other renewable','Geothermal','Biomass'];
  const CO2 = { 'Fossil Gas':490,'Fossil Hard coal':820,'Fossil Brown coal/Lignite':1050,'Fossil Oil':650,'Nuclear':12,'Biomass':230 };
  const total = donutValues.reduce((a,b)=>a+b,0) || 1;
  const renew = donutLabels.reduce((s,l,i) => renewKeys.some(r=>l.includes(r)) ? s+donutValues[i] : s, 0);
  const co2   = donutLabels.reduce((s,l,i) => s+(CO2[l]||0)*donutValues[i], 0) / total;

  const pEl = document.getElementById('gen-renewable-pct');
  const cEl = document.getElementById('gen-co2-est');
  if (pEl) pEl.textContent = `${(renew/total*100).toFixed(1)}%`;
  if (cEl) cEl.textContent = `CO₂ intensity: ~${co2.toFixed(0)} gCO₂/kWh`;
```

- [ ] **Step 3: Commit**

```bash
git add frontend/js/charts/generation.js frontend/index.html
git commit -m "feat: generation — donut snapshot + renewable % + CO2 estimate"
```

---

### Task 10: Improve Capacity chart

**Files:**
- Modify: `frontend/js/charts/capacity.js`

- [ ] **Step 1: Replace Plotly.newPlot call in renderCap with improved layout**

```javascript
  Plotly.newPlot('chart-cap', [{
    x: cap.values,
    y: cap.sources,
    type: 'bar',
    orientation: 'h',
    marker: {
      color: cap.sources.map(s => GEN_COLORS[s] || '#64748b'),
      opacity: 0.9,
      pattern: { shape: cap.sources.map((_, i) => ['','/','\\ ','x','-','|','+','.'][i % 8]) },
    },
    text: cap.values.map(v => `${v.toFixed(1)} GW`),
    textposition: 'outside',
    textfont: { color: '#94a3b8', size: 10 },
    hovertemplate: '<b>%{y}</b><br>%{x:.1f} GW<extra></extra>',
  }], {
    ...PLOTLY_BASE,
    height: Math.max(320, cap.sources.length * 38),
    xaxis: { ...PLOTLY_BASE.xaxis, title: 'GW', tickformat: '.1f' },
    yaxis: { ...PLOTLY_BASE.yaxis, type: 'category', automargin: true },
    margin: { t: 16, b: 48, l: 180, r: 80 },
  }, { responsive: true, displayModeBar: false });
```

- [ ] **Step 2: Commit**

```bash
git add frontend/js/charts/capacity.js
git commit -m "feat: capacity chart — dark theme, value labels, pattern fills"
```

---

### Task 11: Phase 2 QA agents

- [ ] **Step 1: Launch in parallel**

```
Agent 1 (ecc:typescript-reviewer): Review generation.js, stress.js, capacity.js, overview.js
Agent 2 (ecc:code-reviewer): Full Phase 2 code review
Agent 3 (ecc:performance-optimizer): Identify Plotly.newPlot calls that should be Plotly.react on re-renders
```

- [ ] **Step 2: Apply Plotly.react where performance optimizer flags re-render issues**

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "fix: Phase 2 QA — Plotly.react, reviewer findings"
```

---

## Phase 3 — New Endpoints + New Sections

> **REQUIRED before this phase:** Invoke `ecc:fastapi-patterns` skill to validate endpoint design before writing server.py.

### Task 12: New backend endpoints (server.py) — TDD

**Files:**
- Modify: `server.py`
- Modify: `tests/test_api.py`

- [ ] **Step 1: Write failing tests first**

Add to `tests/test_api.py`:

```python
def test_historical_missing_params_returns_422():
    r = client.get('/api/historical')
    assert r.status_code == 422

def test_market_missing_params_returns_422():
    r = client.get('/api/market')
    assert r.status_code == 422

def test_alerts_missing_params_returns_422():
    r = client.get('/api/alerts')
    assert r.status_code == 422

def test_historical_invalid_country_returns_400():
    r = client.get('/api/historical?country=XX&start=2025-04-28&end=2025-04-28')
    assert r.status_code == 400

def test_market_invalid_country_returns_400():
    r = client.get('/api/market?country=XX&start=2025-04-28&end=2025-04-28')
    assert r.status_code == 400

def test_alerts_invalid_country_returns_400():
    r = client.get('/api/alerts?country=XX&start=2025-04-28&end=2025-04-28')
    assert r.status_code == 400
```

- [ ] **Step 2: Run — confirm 6 new tests FAIL**

```bash
/opt/anaconda3/envs/zen-garden-env/bin/python -m pytest tests/test_api.py -v -k "historical or market or alerts"
```

Expected: 6 failures.

- [ ] **Step 3: Add Pydantic models to server.py** (after existing models)

```python
class HistoricalResponse(BaseModel):
    times: list[str]
    prices: list[float]
    load: list[float]
    avg_price: float
    min_price: float
    max_price: float


class MarketResponse(BaseModel):
    times: list[str]
    prices: list[float]
    avg_price: float
    price_std: float
    min_price: float
    max_price: float


class AlertsResponse(BaseModel):
    stress_hours: list[str]
    phi_values: list[float]
    threshold: float
    alert_count: int
```

- [ ] **Step 4: Add the three endpoints to server.py** (after `/api/countries`)

```python
@app.get('/api/historical', response_model=HistoricalResponse)
def historical(country: str, start: str, end: str) -> dict:
    try:
        tz     = 'Europe/Madrid'
        s      = _ts(start, tz)
        e      = _ts(end, tz) + pd.Timedelta(days=1)
        prices = get_prices(country, s, e)
        load   = get_load(country, s, e)
        load_h = load.resample('h').mean().iloc[:, 0]
        prices.index = prices.index.tz_convert(tz)
        load_h.index = load_h.index.tz_convert(tz)
        common = prices.index.intersection(load_h.index)
        p = prices[common]
        l = load_h[common] / 1000
        return {
            'times':     [str(t) for t in common],
            'prices':    p.round(2).tolist(),
            'load':      l.round(2).tolist(),
            'avg_price': round(float(p.mean()), 2),
            'min_price': round(float(p.min()), 2),
            'max_price': round(float(p.max()), 2),
        }
    except Exception:
        logger.exception("Endpoint error")
        raise HTTPException(status_code=400, detail="Could not fetch data. Check country code and date range.")


@app.get('/api/market', response_model=MarketResponse)
def market(country: str, start: str, end: str) -> dict:
    try:
        tz     = 'Europe/Madrid'
        s      = _ts(start, tz)
        e      = _ts(end, tz) + pd.Timedelta(days=1)
        prices = get_prices(country, s, e)
        prices.index = prices.index.tz_convert(tz)
        return {
            'times':     [str(t) for t in prices.index],
            'prices':    prices.round(2).tolist(),
            'avg_price': round(float(prices.mean()), 2),
            'price_std': round(float(prices.std()), 2),
            'min_price': round(float(prices.min()), 2),
            'max_price': round(float(prices.max()), 2),
        }
    except Exception:
        logger.exception("Endpoint error")
        raise HTTPException(status_code=400, detail="Could not fetch data. Check country code and date range.")


@app.get('/api/alerts', response_model=AlertsResponse)
def alerts(country: str, start: str, end: str) -> dict:
    try:
        tz     = 'Europe/Madrid'
        s      = _ts(start, tz)
        e      = _ts(end, tz) + pd.Timedelta(days=1)
        prices = get_prices(country, s, e)
        load   = get_load(country, s, e)
        load_h = load.resample('h').mean().iloc[:, 0]
        prices.index = prices.index.tz_convert(tz)
        load_h.index = load_h.index.tz_convert(tz)
        common = prices.index.intersection(load_h.index)
        phi    = load_h[common] * prices[common] / 1000
        thr    = float(phi.quantile(0.90))
        mask   = phi >= thr
        return {
            'stress_hours': [str(t) for t in phi[mask].index],
            'phi_values':   phi[mask].round(1).tolist(),
            'threshold':    round(thr, 1),
            'alert_count':  int(mask.sum()),
        }
    except Exception:
        logger.exception("Endpoint error")
        raise HTTPException(status_code=400, detail="Could not fetch data. Check country code and date range.")
```

- [ ] **Step 5: Run all tests — all must pass**

```bash
/opt/anaconda3/envs/zen-garden-env/bin/python -m pytest tests/test_api.py -v
```

Expected: 11 tests pass.

- [ ] **Step 6: Launch ecc:python-reviewer and ecc:fastapi-reviewer on server.py**

- [ ] **Step 7: Fix HIGH findings, then commit**

```bash
git add server.py tests/test_api.py
git commit -m "feat: /api/historical, /api/market, /api/alerts + TDD tests"
```

---

### Task 13: New API client methods

**Files:**
- Modify: `frontend/js/api.js`

- [ ] **Step 1: Add three methods to the API object** (after `countries`)

```javascript
  historical: (country, start, end) =>
    API._get(`/api/historical?country=${country}&start=${start}&end=${end}`),

  market: (country, start, end) =>
    API._get(`/api/market?country=${country}&start=${start}&end=${end}`),

  alerts: (country, start, end) =>
    API._get(`/api/alerts?country=${country}&start=${start}&end=${end}`),
```

- [ ] **Step 2: Commit**

```bash
git add frontend/js/api.js
git commit -m "feat: api.js — historical, market, alerts client methods"
```

---

### Task 14: Market Intelligence section

**Files:**
- Create: `frontend/js/charts/market.js`

- [ ] **Step 1: Create market.js**

```javascript
function renderMarket(data) {
  const el = document.getElementById('market-content');
  if (!el) return;
  if (!data) {
    el.innerHTML = '<div class="empty-state"><p>Market data unavailable for this period.</p></div>';
    return;
  }

  el.innerHTML = `
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:24px;">
      <div class="metric-card">
        <div class="metric-label">Avg Price</div>
        <div class="metric-value">€${data.avg_price.toFixed(1)}</div>
        <div class="metric-sub">EUR/MWh</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Volatility (σ)</div>
        <div class="metric-value orange">${data.price_std.toFixed(1)}</div>
        <div class="metric-sub">std dev EUR/MWh</div>
      </div>
      <div class="metric-card tint-green">
        <div class="metric-label">Min Price</div>
        <div class="metric-value green">€${data.min_price.toFixed(1)}</div>
        <div class="metric-sub">period minimum</div>
      </div>
      <div class="metric-card tint-blue">
        <div class="metric-label">Max Price</div>
        <div class="metric-value blue">€${data.max_price.toFixed(1)}</div>
        <div class="metric-sub">period maximum</div>
      </div>
    </div>
    <div class="chart-card" style="margin-bottom:16px;">
      <div id="chart-market-price" style="height:260px;"></div>
    </div>
    <div class="chart-card">
      <div id="chart-market-hist" style="height:220px;"></div>
    </div>
  `;

  Plotly.newPlot('chart-market-price', [
    {
      x: data.times, y: data.prices,
      type: 'scatter', mode: 'lines',
      line: { color: '#6366f1', width: 1.5 },
      name: 'Price',
      hovertemplate: '%{y:.2f} EUR/MWh<extra></extra>',
    },
    {
      x: [...data.times, ...data.times.slice().reverse()],
      y: [...data.times.map(() => data.avg_price + data.price_std),
          ...data.times.map(() => data.avg_price - data.price_std)],
      fill: 'toself', fillcolor: 'rgba(99,102,241,0.08)',
      line: { width: 0 }, showlegend: false, hoverinfo: 'skip',
    },
  ], {
    ...PLOTLY_BASE,
    yaxis: { ...PLOTLY_BASE.yaxis, title: 'EUR/MWh' },
    title: { text: 'Price with ±1σ Volatility Band', font: { size: 11, color: '#64748b' }, x: 0.02 },
  }, { responsive: true, displayModeBar: false });

  Plotly.newPlot('chart-market-hist', [{
    x: data.prices, type: 'histogram', nbinsx: 24,
    marker: { color: '#6366f1', opacity: 0.8 },
    hovertemplate: '%{y} hours at ~%{x:.1f} EUR/MWh<extra></extra>',
  }], {
    ...PLOTLY_BASE,
    xaxis: { ...PLOTLY_BASE.xaxis, title: 'EUR/MWh' },
    yaxis: { ...PLOTLY_BASE.yaxis, title: 'Hours' },
    title: { text: 'Price Distribution', font: { size: 11, color: '#64748b' }, x: 0.02 },
  }, { responsive: true, displayModeBar: false });
}
```

- [ ] **Step 2: Verify — fetch data, click Market Intelligence. Expected: 4 KPIs + price+band chart + histogram.**

- [ ] **Step 3: Commit**

```bash
git add frontend/js/charts/market.js
git commit -m "feat: Market Intelligence — price series, volatility band, histogram"
```

---

### Task 15: Historical Trends section

**Files:**
- Create: `frontend/js/charts/historical.js`

- [ ] **Step 1: Create historical.js**

```javascript
function renderHistorical(data) {
  const el = document.getElementById('historical-content');
  if (!el) return;
  if (!data || !data.times.length) {
    el.innerHTML = '<div class="empty-state"><p>Historical data unavailable for this period.</p></div>';
    return;
  }

  el.innerHTML = `
    <div class="chart-card" style="margin-bottom:16px;">
      <div id="chart-hist-price" style="height:260px;"></div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
      <div class="chart-card"><div id="chart-hist-load" style="height:220px;"></div></div>
      <div class="chart-card"><div id="chart-hist-stats" style="height:220px;"></div></div>
    </div>
  `;

  Plotly.newPlot('chart-hist-price', [{
    x: data.times, y: data.prices,
    type: 'scatter', mode: 'lines',
    line: { color: '#f59e0b', width: 1.5 },
    fill: 'tozeroy', fillcolor: 'rgba(245,158,11,0.06)',
    hovertemplate: '%{y:.2f} EUR/MWh<extra></extra>',
  }], {
    ...PLOTLY_BASE,
    yaxis: { ...PLOTLY_BASE.yaxis, title: 'EUR/MWh' },
    title: { text: 'Price Over Period', font: { size: 11, color: '#64748b' }, x: 0.02 },
  }, { responsive: true, displayModeBar: false });

  Plotly.newPlot('chart-hist-load', [{
    x: data.times, y: data.load,
    type: 'scatter', mode: 'lines',
    line: { color: '#60a5fa', width: 1.5 },
    hovertemplate: '%{y:.2f} GW<extra></extra>',
  }], {
    ...PLOTLY_BASE,
    yaxis: { ...PLOTLY_BASE.yaxis, title: 'GW' },
    title: { text: 'Load Over Period', font: { size: 11, color: '#64748b' }, x: 0.02 },
  }, { responsive: true, displayModeBar: false });

  Plotly.newPlot('chart-hist-stats', [{
    x: ['Min', 'Avg', 'Max'],
    y: [data.min_price, data.avg_price, data.max_price],
    type: 'bar',
    marker: { color: ['#34d399', '#6366f1', '#f87171'] },
    text: [`€${data.min_price.toFixed(1)}`, `€${data.avg_price.toFixed(1)}`, `€${data.max_price.toFixed(1)}`],
    textposition: 'outside',
    textfont: { color: '#94a3b8', size: 11 },
    hovertemplate: '%{x}: %{y:.2f} EUR/MWh<extra></extra>',
  }], {
    ...PLOTLY_BASE,
    yaxis: { ...PLOTLY_BASE.yaxis, title: 'EUR/MWh' },
    title: { text: 'Price Statistics', font: { size: 11, color: '#64748b' }, x: 0.02 },
  }, { responsive: true, displayModeBar: false });
}
```

- [ ] **Step 2: Verify — fetch data, click Historical Trends. Expected: 3 charts.**

- [ ] **Step 3: Commit**

```bash
git add frontend/js/charts/historical.js
git commit -m "feat: Historical Trends — price/load timeline + stats bar chart"
```

---

### Task 16: Alerts & Watchlist section

**Files:**
- Create: `frontend/js/charts/alerts.js`

- [ ] **Step 1: Create alerts.js**

```javascript
function renderAlerts(data) {
  const el = document.getElementById('alerts-content');
  if (!el) return;
  if (!data) {
    el.innerHTML = '<div class="empty-state"><p>Alerts data unavailable.</p></div>';
    return;
  }

  const sevLabel = data.alert_count === 0 ? 'NORMAL' : data.alert_count <= 3 ? 'WARNING' : 'CRITICAL';
  const sevColor = data.alert_count === 0 ? 'var(--surplus)' : data.alert_count <= 3 ? 'var(--orange)' : 'var(--stress)';
  const peakPhi  = data.phi_values.length ? Math.max(...data.phi_values).toFixed(0) : '—';

  el.innerHTML = `
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:24px;">
      <div class="metric-card">
        <div class="metric-label">Alert Status</div>
        <div class="metric-value" style="color:${sevColor};">${sevLabel}</div>
        <div class="metric-sub">${data.alert_count} stress hours detected</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">φ Threshold (90th pct)</div>
        <div class="metric-value">${data.threshold.toFixed(0)}</div>
        <div class="metric-sub">kEUR/h</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Peak φ</div>
        <div class="metric-value orange">${peakPhi}</div>
        <div class="metric-sub">kEUR/h maximum</div>
      </div>
    </div>
    <div class="chart-card" style="margin-bottom:16px;">
      <div id="chart-alerts-timeline" style="height:240px;"></div>
    </div>
    <div class="table-card">
      <div style="padding:14px 20px;border-bottom:1px solid var(--border);font-size:11px;font-weight:600;color:var(--text-muted);letter-spacing:0.5px;text-transform:uppercase;">
        Stress Event Log
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>#</th><th>Timestamp</th><th>φ (kEUR/h)</th><th>Severity</th></tr></thead>
          <tbody id="alerts-table"></tbody>
        </table>
      </div>
    </div>
  `;

  if (data.stress_hours.length > 0) {
    Plotly.newPlot('chart-alerts-timeline', [
      {
        x: data.stress_hours, y: data.phi_values,
        type: 'bar',
        marker: { color: data.phi_values.map(v => v > data.threshold * 1.5 ? '#f87171' : '#f59e0b') },
        hovertemplate: '%{x}<br>φ = %{y:.0f} kEUR/h<extra></extra>',
      },
      {
        x: [data.stress_hours[0], data.stress_hours[data.stress_hours.length - 1]],
        y: [data.threshold, data.threshold],
        type: 'scatter', mode: 'lines',
        line: { color: '#64748b', dash: 'dash', width: 1 },
        hoverinfo: 'skip', showlegend: false,
      },
    ], {
      ...PLOTLY_BASE,
      yaxis: { ...PLOTLY_BASE.yaxis, title: 'kEUR/h' },
      showlegend: false,
      title: { text: 'Stress Hours — φ Index', font: { size: 11, color: '#64748b' }, x: 0.02 },
    }, { responsive: true, displayModeBar: false });
  } else {
    document.getElementById('chart-alerts-timeline').innerHTML =
      '<p style="text-align:center;padding:60px;color:var(--text-muted);">No stress events in this period.</p>';
  }

  const tbody = document.getElementById('alerts-table');
  if (tbody) {
    tbody.innerHTML = data.stress_hours.map((t, i) => {
      const v   = data.phi_values[i];
      const sev = v > data.threshold * 1.5 ? 'CRITICAL' : 'WARNING';
      const col = sev === 'CRITICAL' ? 'var(--stress)' : 'var(--orange)';
      const ts  = new Date(t).toLocaleString('en-GB', { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' });
      return `<tr>
        <td>${i + 1}</td><td>${ts}</td>
        <td style="font-weight:700;color:var(--orange);">${v.toFixed(0)}</td>
        <td><span style="font-size:10px;font-weight:700;letter-spacing:0.5px;color:${col};">${sev}</span></td>
      </tr>`;
    }).join('');
  }
}
```

- [ ] **Step 2: Verify — fetch data, click Alerts. Expected: 3 KPIs + timeline chart + event log table.**

- [ ] **Step 3: Launch ecc:typescript-reviewer on market.js, historical.js, alerts.js simultaneously**

- [ ] **Step 4: Fix HIGH findings, then commit**

```bash
git add frontend/js/charts/alerts.js
git commit -m "feat: Alerts & Watchlist — severity status, timeline, event log"
```

---

### Task 17: Phase 3 QA agents

- [ ] **Step 1: Launch all 5 in parallel**

```
Agent 1 (ecc:python-reviewer): Review server.py new endpoints
Agent 2 (ecc:fastapi-reviewer): FastAPI pattern compliance
Agent 3 (ecc:security-reviewer): Input validation on new endpoints
Agent 4 (dev-tools:qa-frontend-backend-alignment): JS API calls vs server response shapes
Agent 5 (ecc:code-reviewer): Full Phase 3 review
```

- [ ] **Step 2: Fix all CRITICAL/HIGH findings**

- [ ] **Step 3: Run full test suite**

```bash
/opt/anaconda3/envs/zen-garden-env/bin/python -m pytest tests/ -v
```

Expected: all 11 tests pass.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "fix: Phase 3 QA — security, alignment, reviewer findings"
```

---

## Phase 4 — Polish + Final QA

### Task 18: Improve Country Compare

**Files:**
- Modify: `frontend/js/compare.js`
- Modify: `frontend/index.html`

- [ ] **Step 1: Read current compare.js before editing**

- [ ] **Step 2: Replace section-compare content in index.html**

```html
      <section class="section" id="section-compare">
        <div style="margin-bottom:16px;display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
          <span style="font-size:12px;color:var(--text-muted);">Compare:</span>
          <select id="compare-c1" style="background:var(--card-bg);border:1px solid var(--border);border-radius:var(--radius-sm);padding:5px 9px;font-size:12px;color:var(--text);height:30px;"></select>
          <select id="compare-c2" style="background:var(--card-bg);border:1px solid var(--border);border-radius:var(--radius-sm);padding:5px 9px;font-size:12px;color:var(--text);height:30px;"></select>
          <button id="compare-run" class="btn-fetch" style="min-width:80px;"><span class="btn-label">Compare</span></button>
        </div>
        <div id="compare-content"></div>
      </section>
```

- [ ] **Step 3: Replace renderCompare in compare.js**

```javascript
async function renderCompare() {
  const sel1 = document.getElementById('compare-c1');
  const sel2 = document.getElementById('compare-c2');
  if (!sel1 || !sel2) return;

  if (sel1.options.length === 0) {
    const { countries } = await API.countries();
    Object.entries(countries).forEach(([code, name]) => {
      [sel1, sel2].forEach(s => {
        const o = document.createElement('option');
        o.value = code; o.textContent = name;
        s.appendChild(o);
      });
    });
    sel1.value = STATE.country || 'ES';
    sel2.value = 'FR';
  }

  const btn = document.getElementById('compare-run');
  if (btn && !btn._bound) {
    btn._bound = true;
    btn.addEventListener('click', async () => {
      const c1 = sel1.value, c2 = sel2.value;
      if (c1 === c2) return;
      btn.classList.add('loading');
      try {
        const [s1, s2] = await Promise.all([
          API.stress(c1, STATE.start, STATE.end),
          API.stress(c2, STATE.start, STATE.end),
        ]);
        renderCompareCharts(c1, c2, s1, s2);
      } finally {
        btn.classList.remove('loading');
      }
    });
  }
}

function renderCompareCharts(c1, c2, s1, s2) {
  const el = document.getElementById('compare-content');
  el.innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:16px;">
      <div class="metric-card"><div class="metric-label">${c1} Avg Price</div><div class="metric-value">€${s1.avg_price.toFixed(1)}</div></div>
      <div class="metric-card"><div class="metric-label">${c2} Avg Price</div><div class="metric-value">€${s2.avg_price.toFixed(1)}</div></div>
      <div class="metric-card"><div class="metric-label">${c1} Peak φ</div><div class="metric-value orange">${s1.max_phi.toFixed(0)}</div></div>
      <div class="metric-card"><div class="metric-label">${c2} Peak φ</div><div class="metric-value orange">${s2.max_phi.toFixed(0)}</div></div>
    </div>
    <div class="chart-card">
      <div id="chart-compare-price" style="height:280px;"></div>
    </div>
  `;

  Plotly.newPlot('chart-compare-price', [
    { x: s1.times, y: s1.prices, name: c1, type: 'scatter', mode: 'lines', line: { color: '#6366f1', width: 1.5 } },
    { x: s2.times, y: s2.prices, name: c2, type: 'scatter', mode: 'lines', line: { color: '#f59e0b', width: 1.5 } },
  ], {
    ...PLOTLY_BASE,
    showlegend: true,
    legend: { orientation: 'h', y: -0.2, font: { size: 10 } },
    yaxis: { ...PLOTLY_BASE.yaxis, title: 'EUR/MWh' },
    title: { text: `Price: ${c1} vs ${c2}`, font: { size: 11, color: '#64748b' }, x: 0.02 },
  }, { responsive: true, displayModeBar: false });
}
```

- [ ] **Step 4: Commit**

```bash
git add frontend/js/compare.js frontend/index.html
git commit -m "feat: Country Compare — dual selector, price comparison chart"
```

---

### Task 19: Improve Intelligence Report

**Files:**
- Modify: `frontend/js/report.js`

- [ ] **Step 1: Read current report.js before editing**

- [ ] **Step 2: Replace renderReport and add exportCSV/exportPDF**

```javascript
function renderReport() {
  const el = document.querySelector('#section-report');
  if (!el || !STATE.stress) return;
  const s = STATE.stress;
  const stressHours = s.phi.filter(v => v >= s.threshold).length;
  const status      = stressHours > 6 ? 'HIGH STRESS' : stressHours > 2 ? 'ELEVATED' : 'NORMAL';
  const statusColor = stressHours > 6 ? 'var(--stress)' : stressHours > 2 ? 'var(--orange)' : 'var(--surplus)';

  el.innerHTML = `
    <div style="max-width:720px;">
      <div style="display:flex;justify-content:space-between;align-items:baseline;border-bottom:1px solid var(--border);padding-bottom:16px;margin-bottom:24px;">
        <div>
          <div style="font-size:18px;font-weight:700;color:var(--text);">Intelligence Report</div>
          <div style="font-size:12px;color:var(--text-muted);margin-top:4px;">${STATE.country} · ${STATE.start} to ${STATE.end}</div>
        </div>
        <div style="display:flex;gap:8px;">
          <button onclick="exportCSV()" class="btn-fetch" style="background:var(--card-bg);border:1px solid var(--border);color:var(--text);min-width:90px;">
            <span class="btn-label">Export CSV</span>
          </button>
          <button onclick="exportPDF()" class="btn-fetch" style="min-width:90px;">
            <span class="btn-label">Export PDF</span>
          </button>
        </div>
      </div>
      <div style="margin-bottom:20px;">
        <span style="font-size:11px;letter-spacing:1px;text-transform:uppercase;font-weight:700;color:${statusColor};">${status}</span>
        <p style="margin-top:8px;line-height:1.7;color:var(--text-mid);font-size:14px;">
          During ${STATE.start} – ${STATE.end}, ${STATE.country} recorded an average electricity price of
          <strong style="color:var(--text);">€${s.avg_price.toFixed(2)}/MWh</strong>
          (min €${s.min_price.toFixed(2)}/MWh). The stress index φ peaked at
          <strong style="color:var(--orange);">${s.max_phi.toFixed(0)} kEUR/h</strong>, with
          ${stressHours} hour${stressHours !== 1 ? 's' : ''} exceeding the 90th percentile threshold of
          ${s.threshold.toFixed(0)} kEUR/h. Average demand was ${s.avg_load.toFixed(2)} GW.
        </p>
      </div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:24px;">
        <div class="metric-card"><div class="metric-label">Avg Price</div><div class="metric-value">€${s.avg_price.toFixed(1)}</div></div>
        <div class="metric-card"><div class="metric-label">Peak φ</div><div class="metric-value orange">${s.max_phi.toFixed(0)}</div></div>
        <div class="metric-card"><div class="metric-label">Stress Hours</div><div class="metric-value" style="color:${statusColor};">${stressHours}</div></div>
        <div class="metric-card"><div class="metric-label">Avg Load GW</div><div class="metric-value blue">${s.avg_load.toFixed(1)}</div></div>
      </div>
      <div class="chart-card">
        <div id="chart-report-price" style="height:220px;"></div>
      </div>
    </div>
  `;

  Plotly.newPlot('chart-report-price', [{
    x: s.times, y: s.prices,
    type: 'scatter', mode: 'lines',
    line: { color: '#6366f1', width: 1.5 },
    fill: 'tozeroy', fillcolor: 'rgba(99,102,241,0.08)',
    hovertemplate: '%{y:.2f} EUR/MWh<extra></extra>',
  }], {
    ...PLOTLY_BASE,
    yaxis: { ...PLOTLY_BASE.yaxis, title: 'EUR/MWh' },
  }, { responsive: true, displayModeBar: false });
}

function exportCSV() {
  if (!STATE.stress) return;
  const s = STATE.stress;
  const rows = [['timestamp','price_eur_mwh','load_gw','phi_keur_h','above_threshold']];
  s.times.forEach((t, i) =>
    rows.push([t, s.prices[i], s.load[i], s.phi[i], s.phi[i] >= s.threshold ? 1 : 0]));
  const blob = new Blob([rows.map(r => r.join(',')).join('\n')], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `energy_${STATE.country}_${STATE.start}_${STATE.end}.csv`;
  a.click();
}

function exportPDF() {
  const el = document.querySelector('#section-report');
  if (!el || typeof html2pdf === 'undefined') return;
  html2pdf().set({
    margin: 16,
    filename: `energy_report_${STATE.country}_${STATE.start}.pdf`,
    image: { type: 'jpeg', quality: 0.95 },
    html2canvas: { scale: 2, backgroundColor: '#0f1117' },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
  }).from(el).save();
}
```

- [ ] **Step 2: Verify**

Fetch data, click "Intelligence Report". Expected: narrative text, 4 KPIs, price chart, Export CSV downloads file, Export PDF generates PDF.

- [ ] **Step 3: Commit**

```bash
git add frontend/js/report.js
git commit -m "feat: Intelligence Report — narrative, KPIs, CSV + PDF export"
```

---

### Task 20: Final QA + verification + push

- [ ] **Step 1: Run full test suite**

```bash
/opt/anaconda3/envs/zen-garden-env/bin/python -m pytest tests/ -v
```

Expected: all 11 tests pass.

- [ ] **Step 2: Launch 5 final QA agents in parallel**

```
Agent 1 (ecc:code-reviewer): Full codebase review of all overhaul changes
Agent 2 (dev-tools:qa-ux-friction): Full UX audit of the new platform
Agent 3 (dev-tools:qa-responsive-style): Responsive at 375/768px with sidebar
Agent 4 (ecc:security-reviewer): New endpoints + CSV export
Agent 5 (superpowers:verification-before-completion): Smoke test checklist
```

- [ ] **Step 3: Manual smoke test**

Start server: `uvicorn server:app --reload --port 8000`

1. Dark background on load
2. Sidebar with 10 items, "Command Overview" active
3. Fetch Spain 2025-04-28 → skeleton → data loads
4. Click all 10 sidebar items — no JS errors in console
5. Command Overview: 4 KPIs + 2 sparklines visible
6. Stress Analysis: charts + heatmap visible
7. Market Intelligence: 4 KPIs + price chart + histogram
8. Historical Trends: 3 charts
9. Alerts & Watchlist: status card + timeline + event log
10. Country Compare: select FR, click Compare → dual-country chart
11. Intelligence Report: narrative + Export CSV → file downloads
12. Resize to 375px → sidebar becomes horizontal scrollable row

- [ ] **Step 4: Fix any blocking issues found**

- [ ] **Step 5: Final commit + push**

```bash
git add -A
git commit -m "feat: complete Energy Intelligence Platform overhaul — 10 sections, dark theme, sidebar nav"
git push origin main
```

---

## Files Summary

| File | Action |
|------|--------|
| `frontend/css/base.css` | Modified — dark CSS tokens |
| `frontend/css/sidebar.css` | Modified — full sidebar CSS |
| `frontend/css/layout.css` | Modified — remove tabs, update hover |
| `frontend/index.html` | Modified — sidebar nav, app-body, 4 new sections |
| `frontend/js/app.js` | Modified — dark PLOTLY_BASE, sidebar switching, STATE |
| `frontend/js/api.js` | Modified — 3 new API methods |
| `frontend/js/charts/overview.js` | Created |
| `frontend/js/charts/market.js` | Created |
| `frontend/js/charts/historical.js` | Created |
| `frontend/js/charts/alerts.js` | Created |
| `frontend/js/charts/stress.js` | Modified — heatmap |
| `frontend/js/charts/generation.js` | Modified — donut, CO2 |
| `frontend/js/charts/capacity.js` | Modified — dark labels |
| `frontend/js/compare.js` | Modified — dual country |
| `frontend/js/report.js` | Modified — narrative, CSV, PDF |
| `server.py` | Modified — 3 new endpoints + Pydantic models |
| `tests/test_api.py` | Modified — 6 new tests |
