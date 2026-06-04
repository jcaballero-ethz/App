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
  plot_bgcolor:  '#fafafa',
  font: { family: 'Inter, system-ui, sans-serif', color: '#374151', size: 11 },
  margin: { t: 8, b: 36, l: 48, r: 12 },
  xaxis: { gridcolor: '#f3f4f6', zeroline: false, color: '#9ca3af' },
  yaxis: { gridcolor: '#f3f4f6', zeroline: false, color: '#9ca3af' },
  hovermode: 'x unified',
};

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
});

function showSection(name) {
  document.querySelectorAll('.nav-item').forEach(i =>
    i.classList.toggle('active', i.dataset.section === name));
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
  document.getElementById('fetch-btn').disabled = true;

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

  document.getElementById('fetch-btn').disabled = false;
}

function renderMetrics(d) {
  document.getElementById('m-price').textContent    = `${d.avg_price} EUR/MWh`;
  document.getElementById('m-price-sub').textContent = `Range ${Math.min(...d.prices).toFixed(1)}–${Math.max(...d.prices).toFixed(1)}`;
  document.getElementById('m-load').textContent     = `${d.avg_load} GW`;
  document.getElementById('m-load-sub').textContent  = `Peak ${Math.max(...d.load).toFixed(1)} GW`;
  document.getElementById('m-phi').textContent      = `${d.max_phi} kEUR/h`;
  document.getElementById('m-phi-sub').textContent   = `${d.phi.filter(v => v >= d.threshold).length} stress hours`;

  const minEl = document.getElementById('m-minprice');
  minEl.textContent = `${d.min_price} EUR/MWh`;
  minEl.className   = `metric-value ${d.min_price < 0 ? 'green' : 'orange'}`;

  const card = document.getElementById('card-min');
  card.className = `metric-card ${d.min_price < 0 ? 'tint-green' : 'tint-orange'}`;
}
