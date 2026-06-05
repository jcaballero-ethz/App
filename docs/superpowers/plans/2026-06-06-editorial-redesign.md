# Editorial Dashboard Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the navy-sidebar layout with an editorial/consultancy design: cream background, dark header, horizontal tabs, Georgia serif metrics, red `#C9184A` labels, and entrance animations.

**Architecture:** CSS-only redesign (variables + new `layout.css`) + `index.html` structure swap (sidebar → header+tabs). JS files are unchanged except `app.js` gains a number-counter animation and updated `PLOTLY_BASE` theme.

**Tech Stack:** Vanilla CSS, Vanilla JS, Plotly.js

---

### Task 1: Replace `frontend/css/base.css`

**Files:** Modify `frontend/css/base.css`

- [ ] Replace entire file with editorial design tokens

```css
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg:           #FAF8F5;
  --header-bg:    #0F172A;
  --header-text:  #F8FAFC;
  --card-bg:      #FFFFFF;
  --text:         #0F172A;
  --text-mid:     #334155;
  --text-muted:   #94A3B8;
  --accent:       #C9184A;
  --accent-light: #FECDD3;
  --border:       #E2E8F0;
  --stress:       #DC2626;
  --surplus:      #16A34A;
  --orange:       #f97316;
  --orange-light: #fff7ed;
  --orange-border:#fed7aa;
  --blue:         #3b82f6;
  --blue-light:   #eff6ff;
  --blue-border:  #bfdbfe;
  --shadow-sm:    0 1px 3px rgba(15,23,42,0.06), 0 1px 2px rgba(15,23,42,0.04);
  --shadow-md:    0 4px 20px rgba(0,0,0,0.06);
  --radius:       8px;
  --radius-sm:    6px;
}
```

---

### Task 2: Create `frontend/css/layout.css`

**Files:** Create `frontend/css/layout.css`

- [ ] Header + tabs CSS (see spec)

---

### Task 3: Clear `frontend/css/sidebar.css`

- [ ] Replace with `/* sidebar.css — removed; layout moved to layout.css */`

---

### Task 4: Update `frontend/css/metrics.css`

- [ ] Georgia serif values, red uppercase labels, hover border-color accent-light

---

### Task 5: Update `frontend/css/charts.css`

- [ ] Georgia chart titles, accent colors replace green

---

### Task 6: Update `frontend/css/tables.css` and `report.css`

- [ ] Replace green accent references with `var(--accent)`

---

### Task 7: Replace `frontend/index.html`

- [ ] Remove sidebar, add header+tabs structure

---

### Task 8: Update `frontend/js/app.js`

- [ ] Update PLOTLY_BASE, add animateValue counter, loading spinner in fetchAll

---

### Task 9: Commit and push

```bash
git add frontend/ && git commit -m "feat: editorial redesign — cream bg, dark header, Georgia serif, red accent"
git push
```
