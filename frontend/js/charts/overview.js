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
