const GEN_COLORS = {
  'Solar':                           '#fbbf24',
  'Wind Onshore':                    '#059669',
  'Wind Offshore':                   '#34d399',
  'Nuclear':                         '#67e8f9',
  'Hydro Water Reservoir':           '#38bdf8',
  'Hydro Run-of-river and poundage': '#7dd3fc',
  'Hydro Pumped Storage':            '#0284c7',
  'Fossil Gas':                      '#fb923c',
  'Fossil Hard coal':                '#6b7280',
  'Fossil Brown coal/Lignite':       '#44403c',
  'Fossil Oil':                      '#c2410c',
  'Biomass':                         '#a78bfa',
  'Other renewable':                 '#6ee7b7',
  'Other':                           '#d1d5db',
  'Geothermal':                      '#f472b6',
  'Waste':                           '#93c5fd',
};

const DASHES = ['solid', 'dot', 'dash', 'longdash', 'dashdot', 'longdashdot'];

function renderGeneration(g, stress) {
  const traces = [];

  Object.entries(g.series).forEach(([name, vals], i) => {
    traces.push({
      x: g.times, y: vals,
      name,
      type: 'scatter',
      stackgroup: 'gen',
      line: { width: 1, dash: DASHES[i % DASHES.length] },
      fillcolor: GEN_COLORS[name] || '#d1d5db',
      hovertemplate: `<b>${name}</b><br>%{y:.2f} GW<extra></extra>`,
    });
  });

  traces.push({
    x: stress.times, y: stress.load,
    name: 'Load',
    type: 'scatter',
    line: { color: '#94a3b8', width: 1.5, dash: 'dot' },
    hovertemplate: '<b>Load</b><br>%{y:.2f} GW<extra></extra>',
  });

  Plotly.react('chart-gen', traces, {
    ...PLOTLY_BASE,
    yaxis: { ...PLOTLY_BASE.yaxis, title: 'GW' },
    legend: {
      orientation: 'h',
      y: -0.2,
      font: { size: 10 },
    },
  }, { responsive: true, displayModeBar: false });

  const totals = Object.entries(g.series)
    .map(([name, vals]) => ({ name, avg: vals.reduce((a, b) => a + b, 0) / vals.length }))
    .sort((a, b) => b.avg - a.avg);
  const total = totals.reduce((s, t) => s + t.avg, 0);

  function escHtml(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  const tbody = document.getElementById('gen-table');
  tbody.innerHTML = '';
  totals.forEach(({ name, avg }) => {
    const dot = `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${GEN_COLORS[name] || '#d1d5db'};margin-right:8px;flex-shrink:0"></span>`;
    const tr = document.createElement('tr');
    const share = total > 0 ? (avg / total * 100).toFixed(1) : '0.0';
    tr.innerHTML = `<td style="display:flex;align-items:center">${dot}${escHtml(name)}</td><td>${avg.toFixed(3)}</td><td>${share}%</td>`;
    tbody.appendChild(tr);
  });

  if (g.times.length > 0) {
    const lastIdx = g.times.length - 1;
    const donutLabels = [], donutValues = [];
    Object.entries(g.series).forEach(([name, vals]) => {
      const v = vals[lastIdx] || 0;
      if (v > 0.01) { donutLabels.push(name); donutValues.push(v); }
    });

    Plotly.react('chart-gen-donut', [{
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
    const donutTotal = donutValues.reduce((a,b)=>a+b,0) || 1;
    const renew = donutLabels.reduce((s,l,i) => renewKeys.some(r=>l.includes(r)) ? s+donutValues[i] : s, 0);
    const co2   = donutLabels.reduce((s,l,i) => s+(CO2[l]||0)*donutValues[i], 0) / donutTotal;

    const pEl = document.getElementById('gen-renewable-pct');
    const cEl = document.getElementById('gen-co2-est');
    if (pEl) pEl.textContent = `${(renew/donutTotal*100).toFixed(1)}%`;
    if (cEl) cEl.textContent = `CO₂ intensity: ~${co2.toFixed(0)} gCO₂/kWh`;
  }
}
