# EnergyStress — Engineering Quality Pass
**Date:** 2026-06-06
**Status:** Approved

---

## Goal

Full engineering quality audit and remediation of the EnergyStress dashboard using parallel agent diagnosis. Covers: responsive design, skeleton screens, chart accessibility, server.py quality, JS quality, performance, security, and E2E tests.

---

## Approach: Parallel Agent Diagnosis → Prioritised Fixes → E2E Tests

### Phase 1 — Parallel Diagnosis (8 agents simultaneously)

| Agent | Scope |
|---|---|
| `ecc:python-reviewer` | `server.py` — PEP8, type hints, error handling, Pythonic idioms |
| `ecc:fastapi-reviewer` | `server.py` — async correctness, Pydantic schemas, OpenAPI, production readiness |
| `ecc:typescript-reviewer` | `frontend/js/**` — all JS files, async correctness, error propagation |
| `ecc:performance-optimizer` | Plotly.js bundle, synchronous script loading, data fetching patterns |
| `ecc:silent-failure-hunter` | Error swallowing in JS catch blocks and Python exception handlers |
| `dev-tools:qa-responsive-style` | CSS — missing mobile breakpoints, no responsive grid |
| `dev-tools:qa-ux-friction` | UX friction in fetch flow, tab switching, empty/loading/error states |
| `ecc:security-reviewer` | FastAPI endpoints, CORS, input validation, user-supplied params |

### Phase 2 — Fixes by severity

Collect all agent reports, deduplicate overlapping findings, implement fixes CRITICAL → HIGH → MEDIUM. Use relevant skills for each fix type:
- CSS/responsive fixes → `ui-ux-pro-max` + `ecc:make-interfaces-feel-better`
- JS fixes → guided by `ecc:typescript-reviewer` findings
- Python fixes → guided by `ecc:python-reviewer` + `ecc:fastapi-reviewer` findings
- Performance → `ecc:performance-optimizer` recommendations

### Phase 3 — Tests + Verification

- `ecc:e2e-runner` — E2E tests for critical paths: fetch Spain 2025-04-28, tab switching, metric display, error state
- `superpowers:verification-before-completion` before final commit
- Push to `jcaballero-ethz/App`

---

## Known Issues (pre-diagnosis)

Already identified before running agents:

| Issue | Severity | Area |
|---|---|---|
| No mobile responsive breakpoints | HIGH | CSS |
| Spinner instead of skeleton screen for data fetch (>1s) | MEDIUM | UX |
| Plotly charts use color only — not accessible for colorblind | HIGH | Accessibility |
| Plotly.js + html2pdf.js loaded synchronously in head | MEDIUM | Performance |
| server.py never reviewed by python/fastapi agents | UNKNOWN | Backend |
| JS files never reviewed by typescript agent | UNKNOWN | Frontend |
| 0 E2E or unit tests | HIGH | Testing |

---

## Files in Scope

**Backend:** `server.py`

**Frontend JS:** `frontend/js/app.js`, `frontend/js/api.js`, `frontend/js/charts/stress.js`, `frontend/js/charts/generation.js`, `frontend/js/charts/map.js`, `frontend/js/charts/capacity.js`, `frontend/js/compare.js`, `frontend/js/report.js`

**Frontend CSS:** `frontend/css/base.css`, `frontend/css/layout.css`, `frontend/css/metrics.css`, `frontend/css/charts.css`, `frontend/css/tables.css`

---

## Success Criteria

1. All CRITICAL and HIGH agent findings resolved
2. Dashboard usable on 375px mobile viewport
3. Fetch operation shows skeleton screen, not blank spinner
4. Plotly charts have accessible color alternatives
5. E2E test passes: Spain 2025-04-28 loads and shows metrics
6. `server.py` passes python-reviewer + fastapi-reviewer with no HIGH issues
