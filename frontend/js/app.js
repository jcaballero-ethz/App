const STATE = {
  country: 'ES',
  start:   '2025-04-28',
  end:     '2025-04-28',
  stress:  null,
  gen:     null,
  cap:     null,
  flows:   null,
};

const PLOTLY_BASE = {
  paper_bgcolor: '#ffffff',
  plot_bgcolor:  '#ffffff',
  font: { family: 'system-ui, sans-serif', color: '#334155', size: 11 },
  margin: { t: 8, b: 36, l: 48, r: 12 },
  xaxis: { gridcolor: '#F1F5F9', zeroline: false, color: '#94A3B8' },
  yaxis: { gridcolor: '#F1F5F9', zeroline: false, color: '#94A3B8' },
  hovermode: 'x unified',
};

function animateValue(el, end, suffix, duration) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.textContent = end + (suffix || '');
    return;
  }
  const startTime = performance.now();
  function step(now) {
    const pct = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - pct, 3);
    const val = end * eased;
    el.textContent = val.toFixed(Number.isInteger(end) ? 0 : 2) + (suffix || '');
    if (pct < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

document.addEventListener('DOMContentLoaded', async () => {
  const { countries } = await API.countries().catch(() => ({ countries: {} }));
  const sel = document.getElementById('country-select');
  Object.entries(countries).forEach(([name, code]) => {
    const o = document.createElement('option');
    o.value = code;
    o.textContent = name;
    if (code === 'ES') o.selected = true;
    sel.appendChild(o);
  });

  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => showSection(item.dataset.section));
  });

  document.querySelectorAll('.nav-item').forEach((item, idx, items) => {
    item.addEventListener('keydown', (e) => {
      let target = null;
      if (e.key === 'ArrowRight') target = items[(idx + 1) % items.length];
      if (e.key === 'ArrowLeft')  target = items[(idx - 1 + items.length) % items.length];
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); showSection(item.dataset.section); }
      if (target) { target.focus(); showSection(target.dataset.section); }
    });
  });
});

function showSection(name) {
  document.querySelectorAll('.nav-item').forEach(i => {
    const active = i.dataset.section === name;
    i.classList.toggle('active', active);
    i.setAttribute('aria-selected', active);
  });
  document.querySelectorAll('.section').forEach(s =>
    s.classList.toggle('active', s.id === `section-${name}`));

  if (name === 'map')     renderMap();
  if (name === 'cap')     { renderCap(); setTimeout(() => Plotly.Plots.resize('chart-cap'), 50); }
  if (name === 'compare') renderCompare();
  if (name === 'report')  renderReport();
}

async function fetchAll() {
  const country = document.getElementById('country-select').value;
  const start   = document.getElementById('start-date').value;
  const end     = document.getElementById('end-date').value;
  STATE.country = country;
  STATE.start   = start;
  STATE.end     = end;

  document.getElementById('empty-state').classList.add('hidden');
  document.getElementById('content').classList.add('hidden');
  document.getElementById('loading').classList.remove('hidden');
  document.getElementById('error-msg').classList.add('hidden');
  const fetchBtn = document.getElementById('fetch-btn');
  fetchBtn.disabled = true;
  fetchBtn.classList.add('loading');

  window._mapData = null;

  try {
    const [stress, gen, cap, flows] = await Promise.all([
      API.stress(country, start, end),
      API.generation(country, start, end).catch(() => null),
      API.capacity(country, start, end).catch(() => null),
      API.flows(country, start, end).catch(() => null),
    ]);

    STATE.stress = stress;
    STATE.gen    = gen;
    STATE.cap    = cap;
    STATE.flows  = flows;

    renderMetrics(stress);
    renderStressCharts(stress);
    if (gen) renderGeneration(gen, stress);
    renderFlowsTable(flows);

    document.getElementById('loading').classList.add('hidden');
    document.getElementById('content').classList.remove('hidden');
    showSection('stress');

  } catch(e) {
    document.getElementById('loading').classList.add('hidden');
    document.getElementById('empty-state').classList.remove('hidden');
    const err = document.getElementById('error-msg');
    err.textContent = `Error: ${e.message}`;
    err.classList.remove('hidden');
  }

  fetchBtn.disabled = false;
  fetchBtn.classList.remove('loading');
}

function renderMetrics(d) {
  animateValue(document.getElementById('m-price'), parseFloat(d.avg_price), ' EUR/MWh', 600);
  document.getElementById('m-price-sub').textContent = `Range ${Math.min(...d.prices).toFixed(1)}–${Math.max(...d.prices).toFixed(1)}`;

  animateValue(document.getElementById('m-load'), parseFloat(d.avg_load), ' GW', 600);
  document.getElementById('m-load-sub').textContent  = `Peak ${Math.max(...d.load).toFixed(1)} GW`;

  animateValue(document.getElementById('m-phi'), parseFloat(d.max_phi), ' kEUR/h', 600);
  document.getElementById('m-phi-sub').textContent   = `${d.phi.filter(v => v >= d.threshold).length} stress hours`;

  const minEl = document.getElementById('m-minprice');
  animateValue(minEl, parseFloat(d.min_price), ' EUR/MWh', 600);
  minEl.className = `metric-value ${d.min_price < 0 ? 'green' : 'orange'}`;

  const card = document.getElementById('card-min');
  card.className = `metric-card ${d.min_price < 0 ? 'tint-green' : 'tint-orange'}`;
}
