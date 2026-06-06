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
        <div class="metric-sub">min €${stress.min_price.toFixed(1)} &middot; EUR/MWh</div>
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
