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

function renderGeneration(g, stress) {
  const traces = [];

  Object.entries(g.series).forEach(([name, vals]) => {
    traces.push({
      x: g.times, y: vals,
      name,
      type: 'scatter',
      stackgroup: 'gen',
      line: { width: 0 },
      fillcolor: GEN_COLORS[name] || '#d1d5db',
      hovertemplate: `<b>${name}</b><br>%{y:.2f} GW<extra></extra>`,
    });
  });

  traces.push({
    x: stress.times, y: stress.load,
    name: 'Load',
    type: 'scatter',
    line: { color: '#111827', width: 1.5, dash: 'dot' },
    hovertemplate: '<b>Load</b><br>%{y:.2f} GW<extra></extra>',
  });

  Plotly.newPlot('chart-gen', traces, {
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

  const tbody = document.getElementById('gen-table');
  tbody.innerHTML = '';
  totals.forEach(({ name, avg }) => {
    const dot = `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${GEN_COLORS[name] || '#d1d5db'};margin-right:8px;flex-shrink:0"></span>`;
    const tr = document.createElement('tr');
    tr.innerHTML = `<td style="display:flex;align-items:center">${dot}${name}</td><td>${avg.toFixed(3)}</td><td>${(avg / total * 100).toFixed(1)}%</td>`;
    tbody.appendChild(tr);
  });
}
