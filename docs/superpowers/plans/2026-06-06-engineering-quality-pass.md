# Engineering Quality Pass — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Audit and remediate the EnergyStress dashboard across responsive design, accessibility, performance, backend quality, and E2E coverage using parallel agent diagnosis followed by targeted fixes.

**Architecture:** Phase 1 launches 8 specialist agents in parallel to diagnose the full stack; Phase 2 applies fixes in CRITICAL → HIGH → MEDIUM order (known issues listed below, agent findings merged after Phase 1); Phase 3 adds API unit tests and verifies.

**Tech Stack:** FastAPI / Python 3.11, vanilla JS (ES2022), Plotly.js 2.27, CSS custom properties, pytest.

---

## Files in scope

| File | What changes |
|---|---|
| `server.py` | Type hints, Pydantic response models |
| `frontend/index.html` | Defer scripts, skeleton HTML |
| `frontend/css/base.css` | Skeleton shimmer, mobile padding |
| `frontend/css/layout.css` | Mobile breakpoints (375 / 768px) |
| `frontend/css/metrics.css` | Stack to 2-col then 1-col on mobile |
| `frontend/js/api.js` | `r.ok` guard before `.json()` |
| `frontend/js/app.js` | Keyboard nav handlers for tabs |
| `frontend/js/charts/stress.js` | Accessible trace dash patterns |
| `frontend/js/charts/generation.js` | Accessible trace dash patterns |
| `frontend/js/charts/capacity.js` | Accessible bar fill patterns |
| `tests/__init__.py` | New — enables pytest discovery |
| `tests/test_api.py` | New — unit tests for all 5 endpoints |

---

## Phase 1 — Parallel Agent Diagnosis

### Task 1: Launch 8 diagnostic agents simultaneously

**Files:** No code changes — read-only agent audit.

- [ ] **Step 1: Launch all 8 agents in a single message**

In ONE message, dispatch these agents with `run_in_background: true` each:

| Agent | subagent_type | Scope |
|---|---|---|
| Python reviewer | `ecc:python-reviewer` | `server.py` |
| FastAPI reviewer | `ecc:fastapi-reviewer` | `server.py` |
| TypeScript reviewer | `ecc:typescript-reviewer` | `frontend/js/**` |
| Performance optimizer | `ecc:performance-optimizer` | `frontend/index.html`, all JS |
| Silent failure hunter | `ecc:silent-failure-hunter` | `frontend/js/**`, `server.py` |
| QA responsive style | `dev-tools:qa-responsive-style` | `frontend/css/**` |
| QA UX friction | `dev-tools:qa-ux-friction` | `frontend/index.html`, `frontend/js/app.js` |
| Security reviewer | `ecc:security-reviewer` | `server.py` endpoints |

- [ ] **Step 2: Collect and triage findings**

When all agents report back, merge findings by severity:
- CRITICAL: fix before anything else
- HIGH: fix in Phase 2 tasks below
- MEDIUM: fix after HIGH items
- LOW: backlog

- [ ] **Step 3: Commit diagnosis log**

```bash
git add docs/
git commit -m "docs: Phase 1 agent diagnosis findings"
```

---

## Phase 2 — Known Issue Fixes (HIGH priority)

### Task 2: Mobile responsive breakpoints

**Files:**
- Modify: `frontend/css/layout.css`
- Modify: `frontend/css/base.css`
- Modify: `frontend/css/metrics.css`

- [ ] **Step 1: Add mobile breakpoints to layout.css**

Append to `frontend/css/layout.css`:

```css
/* ── Responsive ── */
@media (max-width: 768px) {
  .app-header {
    height: auto;
    min-height: 48px;
    flex-wrap: wrap;
    padding: 8px 16px;
    gap: 8px;
  }
  .header-controls {
    width: 100%;
    flex-wrap: wrap;
    gap: 6px;
  }
  .header-controls select,
  .header-controls input[type="date"] {
    flex: 1;
    min-width: 120px;
  }
  .btn-fetch { width: 100%; }

  .app-tabs {
    padding: 0 16px;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  .nav-item { padding: 10px 12px; font-size: 12px; white-space: nowrap; }
}

@media (max-width: 375px) {
  .app-tabs { gap: 0; }
  .nav-item { padding: 10px 8px; font-size: 11px; }
}
```

- [ ] **Step 2: Add responsive padding to base.css**

After the existing `.main { ... }` block in `frontend/css/base.css`, add:

```css
@media (max-width: 768px) {
  .main { padding: 16px; }
}
@media (max-width: 375px) {
  .main { padding: 12px; }
}
```

- [ ] **Step 3: Add responsive metrics grid to metrics.css**

Read `frontend/css/metrics.css` first, then append at end:

```css
@media (max-width: 768px) {
  .metrics-row { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 375px) {
  .metrics-row { grid-template-columns: 1fr; }
}
```

- [ ] **Step 4: Verify on 375px viewport**

Start server: `uvicorn server:app --reload --port 8000`
DevTools → set viewport to 375px.
Expected: header controls wrap, tabs scroll horizontally, metric cards stack 2-col.

- [ ] **Step 5: Commit**

```bash
git add frontend/css/layout.css frontend/css/base.css frontend/css/metrics.css
git commit -m "fix: mobile responsive breakpoints at 375/768px"
```

---

### Task 3: Skeleton screen instead of spinner

**Files:**
- Modify: `frontend/css/base.css`
- Modify: `frontend/index.html`

- [ ] **Step 1: Add skeleton CSS to base.css**

Append to `frontend/css/base.css`:

```css
/* Skeleton screen */
@keyframes shimmer {
  from { background-position: -600px 0; }
  to   { background-position:  600px 0; }
}
.skeleton {
  background: linear-gradient(90deg, #E2E8F0 25%, #F1F5F9 50%, #E2E8F0 75%);
  background-size: 600px 100%;
  animation: shimmer 1.4s ease-in-out infinite;
  border-radius: var(--radius-sm);
}
.skeleton-metrics {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}
.skeleton-metric   { height: 88px; border-radius: var(--radius); }
.skeleton-chart    { height: 280px; border-radius: var(--radius); margin-bottom: 16px; }
.skeleton-chart-half { height: 280px; border-radius: var(--radius); }
.skeleton-charts-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}
@media (max-width: 768px) {
  .skeleton-metrics { grid-template-columns: repeat(2, 1fr); }
  .skeleton-charts-row { grid-template-columns: 1fr; }
}
@media (prefers-reduced-motion: reduce) {
  .skeleton { animation: none; }
}
```

- [ ] **Step 2: Replace loading div in index.html**

In `frontend/index.html`, replace:
```html
    <!-- Loading -->
    <div class="hidden" id="loading" style="padding:80px;text-align:center">
      <div class="spinner"></div>
      <p style="margin-top:12px;color:var(--text-muted);font-size:13px">Fetching data from ENTSO-E...</p>
    </div>
```
With:
```html
    <!-- Skeleton loading -->
    <div class="hidden" id="loading">
      <div class="skeleton-metrics">
        <div class="skeleton skeleton-metric"></div>
        <div class="skeleton skeleton-metric"></div>
        <div class="skeleton skeleton-metric"></div>
        <div class="skeleton skeleton-metric"></div>
      </div>
      <div class="skeleton-charts-row">
        <div class="skeleton skeleton-chart-half"></div>
        <div class="skeleton skeleton-chart-half"></div>
      </div>
      <div class="skeleton skeleton-chart"></div>
    </div>
```

- [ ] **Step 3: Verify visually**

Reload, click Fetch data.
Expected: shimmer skeleton grid appears, disappears when data loads.

- [ ] **Step 4: Commit**

```bash
git add frontend/css/base.css frontend/index.html
git commit -m "feat: skeleton screen replaces spinner during data fetch"
```

---

### Task 4: api.js — guard against non-2xx responses

**Files:**
- Modify: `frontend/js/api.js`

- [ ] **Step 1: Replace api.js**

```javascript
const API = {
  async _get(url) {
    const r = await fetch(url);
    if (!r.ok) {
      let detail = `HTTP ${r.status}`;
      try { const d = await r.json(); if (d.detail) detail = d.detail; } catch {}
      throw new Error(detail);
    }
    const d = await r.json();
    if (d.detail) throw new Error(d.detail);
    return d;
  },

  stress:    (country, start, end) =>
    API._get(`/api/stress?country=${country}&start=${start}&end=${end}`),

  generation:(country, start, end) =>
    API._get(`/api/generation?country=${country}&start=${start}&end=${end}`),

  mapHourly: (country, start, end) =>
    API._get(`/api/map_hourly?country=${country}&start=${start}&end=${end}`),

  flows:     (country, start, end) =>
    API._get(`/api/flows?country=${country}&start=${start}&end=${end}`),

  capacity:  (country, start, end) =>
    API._get(`/api/capacity?country=${country}&start=${start}&end=${end}`),

  countries: () =>
    API._get('/api/countries'),
};
```

- [ ] **Step 2: Commit**

```bash
git add frontend/js/api.js
git commit -m "fix: api.js guards non-2xx responses before parsing JSON"
```

---

### Task 5: server.py — type hints + Pydantic response models

**Files:**
- Modify: `server.py`

- [ ] **Step 1: Add Pydantic models after existing imports in server.py**

After `from data.fetch import (...)`, add:

```python
from pydantic import BaseModel


class StressResponse(BaseModel):
    times: list[str]
    prices: list[float]
    load: list[float]
    phi: list[float]
    threshold: float
    avg_price: float
    avg_load: float
    max_phi: float
    min_price: float


class GenerationResponse(BaseModel):
    times: list[str]
    series: dict[str, list[float]]


class FlowsResponse(BaseModel):
    flows: dict[str, dict]


class CapacityResponse(BaseModel):
    sources: list[str]
    values: list[float]


class CountriesResponse(BaseModel):
    countries: dict[str, str]
```

- [ ] **Step 2: Add type hints to helper functions**

Replace the two helper function signatures:

```python
def _ts(date_str: str, tz: str = 'Europe/Madrid') -> pd.Timestamp:
    return pd.Timestamp(date_str, tz=tz)

def _fetch_prices_safe(country: str, s: pd.Timestamp, e: pd.Timestamp, tz: str) -> tuple:
    # existing body unchanged

def _fetch_flow_safe(a: str, b: str, s: pd.Timestamp, e: pd.Timestamp, tz: str) -> tuple:
    # existing body unchanged
```

- [ ] **Step 3: Add response_model to all endpoints**

Change each `@app.get` decorator to include `response_model`:

```python
@app.get('/api/stress', response_model=StressResponse)
def stress(country: str, start: str, end: str) -> dict:

@app.get('/api/generation', response_model=GenerationResponse)
def generation(country: str, start: str, end: str) -> dict:

@app.get('/api/map_hourly')   # map returns complex nested shape, skip response_model
def map_hourly(country: str, start: str, end: str) -> dict:

@app.get('/api/flows', response_model=FlowsResponse)
def flows(country: str, start: str, end: str) -> dict:

@app.get('/api/capacity', response_model=CapacityResponse)
def capacity(country: str, start: str, end: str) -> dict:

@app.get('/api/countries', response_model=CountriesResponse)
def countries() -> dict:
```

- [ ] **Step 4: Verify server starts**

```bash
cd /Users/javiercaballero/Proyecto_Javi/energy-stress-app
/opt/anaconda3/envs/zen-garden-env/bin/python -c "import server; print('OK')"
```

Expected: `OK` with no import errors.

- [ ] **Step 5: Commit**

```bash
git add server.py
git commit -m "feat: server.py type hints and Pydantic response models"
```

---

### Task 6: Defer Plotly.js and html2pdf.js

**Files:**
- Modify: `frontend/index.html`

- [ ] **Step 1: Add defer to CDN scripts**

In `frontend/index.html` `<head>`, replace:
```html
<script src="https://cdn.plot.ly/plotly-2.27.0.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
```
With:
```html
<script src="https://cdn.plot.ly/plotly-2.27.0.min.js" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js" defer></script>
```

- [ ] **Step 2: Test charts still render after fetch**

Fetch Spain 2025-04-28. Expected: all charts render normally.

- [ ] **Step 3: Commit**

```bash
git add frontend/index.html
git commit -m "perf: defer Plotly.js and html2pdf.js to unblock first paint"
```

---

### Task 7: Keyboard navigation for tabs (ARIA compliant)

**Files:**
- Modify: `frontend/js/app.js`

- [ ] **Step 1: Add ArrowLeft/ArrowRight handler to DOMContentLoaded**

In `frontend/js/app.js`, after this existing block (line ~48):
```javascript
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => showSection(item.dataset.section));
  });
```

Add:
```javascript
  document.querySelectorAll('.nav-item').forEach((item, idx, items) => {
    item.addEventListener('keydown', (e) => {
      let target = null;
      if (e.key === 'ArrowRight') target = items[(idx + 1) % items.length];
      if (e.key === 'ArrowLeft')  target = items[(idx - 1 + items.length) % items.length];
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); showSection(item.dataset.section); }
      if (target) { target.focus(); showSection(target.dataset.section); }
    });
  });
```

- [ ] **Step 2: Verify**

Tab to a nav item, press ArrowRight/Left. Expected: focus moves and section changes.

- [ ] **Step 3: Commit**

```bash
git add frontend/js/app.js
git commit -m "fix: ARIA keyboard navigation (ArrowLeft/Right) for tab items"
```

---

### Task 8: Chart accessibility — dash/pattern alternatives to color

**Files:**
- Modify: `frontend/js/charts/stress.js`
- Modify: `frontend/js/charts/generation.js`
- Modify: `frontend/js/charts/capacity.js`

- [ ] **Step 1: Read all three chart files**

```bash
cat frontend/js/charts/stress.js
cat frontend/js/charts/generation.js
cat frontend/js/charts/capacity.js
```

- [ ] **Step 2: Patch stress.js**

Find the threshold/phi trace and add `line.dash: 'dash'` to distinguish it from the main phi line:
```javascript
// Threshold line trace — add:
line: { color: '#f97316', width: 1.5, dash: 'dash' },
```

- [ ] **Step 3: Patch generation.js**

Add a dash-cycle array before trace construction:
```javascript
const DASHES = ['solid', 'dot', 'dash', 'longdash', 'dashdot', 'longdashdot'];
// For each trace i: line: { dash: DASHES[i % DASHES.length] }
```

- [ ] **Step 4: Patch capacity.js**

Add pattern fills to bar chart:
```javascript
const PATTERNS = ['', '/', '\\', 'x', '-', '|', '+', '.'];
// For each bar i: marker: { ..., pattern: { shape: PATTERNS[i % PATTERNS.length] } }
```

- [ ] **Step 5: Commit**

```bash
git add frontend/js/charts/
git commit -m "fix: chart accessibility — dash patterns and bar fills supplement color coding"
```

---

## Phase 3 — Tests + Verification

### Task 9: API unit tests

**Files:**
- Create: `tests/__init__.py`
- Create: `tests/test_api.py`

- [ ] **Step 1: Install test dependencies**

```bash
/opt/anaconda3/envs/zen-garden-env/bin/pip install pytest httpx
```

Expected: `Successfully installed` or `already satisfied`.

- [ ] **Step 2: Create tests/__init__.py**

Empty file — enables pytest package discovery.

- [ ] **Step 3: Write tests/test_api.py**

```python
import pytest
from fastapi.testclient import TestClient
from server import app

client = TestClient(app)


def test_countries_returns_dict():
    r = client.get('/api/countries')
    assert r.status_code == 200
    data = r.json()
    assert 'countries' in data
    assert isinstance(data['countries'], dict)
    assert 'ES' in data['countries'].values()


def test_stress_missing_params_returns_422():
    r = client.get('/api/stress')
    assert r.status_code == 422


def test_stress_invalid_country_returns_400():
    r = client.get('/api/stress?country=XX&start=2025-04-28&end=2025-04-28')
    assert r.status_code == 400


def test_capacity_missing_params_returns_422():
    r = client.get('/api/capacity')
    assert r.status_code == 422


def test_root_returns_html():
    r = client.get('/')
    assert r.status_code == 200
    assert 'text/html' in r.headers['content-type']
```

- [ ] **Step 4: Run tests**

```bash
cd /Users/javiercaballero/Proyecto_Javi/energy-stress-app
/opt/anaconda3/envs/zen-garden-env/bin/python -m pytest tests/test_api.py -v
```

Expected:
```
tests/test_api.py::test_countries_returns_dict PASSED
tests/test_api.py::test_stress_missing_params_returns_422 PASSED
tests/test_api.py::test_stress_invalid_country_returns_400 PASSED
tests/test_api.py::test_capacity_missing_params_returns_422 PASSED
tests/test_api.py::test_root_returns_html PASSED
5 passed
```

- [ ] **Step 5: Commit**

```bash
git add tests/
git commit -m "test: API unit tests for all endpoints"
```

---

### Task 10: Agent-discovered fixes

After Phase 1 agents report back, implement any CRITICAL/HIGH findings not already covered by Tasks 2–8. Each finding becomes a sub-task with its own commit.

---

### Task 11: Verification + push

- [ ] **Step 1: Run full test suite**

```bash
/opt/anaconda3/envs/zen-garden-env/bin/python -m pytest tests/ -v
```

- [ ] **Step 2: Manual smoke test**

Start server: `uvicorn server:app --reload --port 8000`

1. Empty state SVG renders with pulse animation
2. Fetch Spain 2025-04-28 → skeleton appears → metrics animate in
3. Tab through all 6 sections
4. Keyboard: Tab to nav → ArrowRight cycles tabs
5. Resize to 375px → header wraps, tabs scroll, cards stack

- [ ] **Step 3: Final push**

```bash
git push
```

---

## Success Criteria Check

| Criterion | Task |
|---|---|
| All CRITICAL and HIGH agent findings resolved | Tasks 2–8 + Task 10 |
| Dashboard usable on 375px mobile viewport | Task 2 |
| Fetch shows skeleton screen | Task 3 |
| API error handling is robust | Task 4 |
| Charts accessible to colorblind users | Task 8 |
| server.py typed + documented | Task 5 |
| API unit tests pass | Task 9 |
