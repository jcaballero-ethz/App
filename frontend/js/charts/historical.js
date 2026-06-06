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

  Plotly.react('chart-hist-price', [{
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

  Plotly.react('chart-hist-load', [{
    x: data.times, y: data.load,
    type: 'scatter', mode: 'lines',
    line: { color: '#60a5fa', width: 1.5 },
    hovertemplate: '%{y:.2f} GW<extra></extra>',
  }], {
    ...PLOTLY_BASE,
    yaxis: { ...PLOTLY_BASE.yaxis, title: 'GW' },
    title: { text: 'Load Over Period', font: { size: 11, color: '#64748b' }, x: 0.02 },
  }, { responsive: true, displayModeBar: false });

  Plotly.react('chart-hist-stats', [{
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
