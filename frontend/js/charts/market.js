function renderMarket(data) {
  const el = document.getElementById('market-content');
  if (!el) return;
  if (!data) {
    el.innerHTML = '<div class="empty-state"><p>Market data unavailable for this period.</p></div>';
    return;
  }

  el.innerHTML = `
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:24px;">
      <div class="metric-card">
        <div class="metric-label">Avg Price</div>
        <div class="metric-value">€${data.avg_price.toFixed(1)}</div>
        <div class="metric-sub">EUR/MWh</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Volatility (σ)</div>
        <div class="metric-value orange">${data.price_std.toFixed(1)}</div>
        <div class="metric-sub">std dev EUR/MWh</div>
      </div>
      <div class="metric-card tint-green">
        <div class="metric-label">Min Price</div>
        <div class="metric-value green">€${data.min_price.toFixed(1)}</div>
        <div class="metric-sub">period minimum</div>
      </div>
      <div class="metric-card tint-blue">
        <div class="metric-label">Max Price</div>
        <div class="metric-value blue">€${data.max_price.toFixed(1)}</div>
        <div class="metric-sub">period maximum</div>
      </div>
    </div>
    <div class="chart-card" style="margin-bottom:16px;">
      <div id="chart-market-price" style="height:260px;"></div>
    </div>
    <div class="chart-card">
      <div id="chart-market-hist" style="height:220px;"></div>
    </div>
  `;

  Plotly.react('chart-market-price', [
    {
      x: data.times, y: data.prices,
      type: 'scatter', mode: 'lines',
      line: { color: '#6366f1', width: 1.5 },
      name: 'Price',
      hovertemplate: '%{y:.2f} EUR/MWh<extra></extra>',
    },
    {
      x: [...data.times, ...data.times.slice().reverse()],
      y: [...data.times.map(() => data.avg_price + data.price_std),
          ...data.times.map(() => data.avg_price - data.price_std)],
      fill: 'toself', fillcolor: 'rgba(99,102,241,0.08)',
      line: { width: 0 }, showlegend: false, hoverinfo: 'skip',
    },
  ], {
    ...PLOTLY_BASE,
    yaxis: { ...PLOTLY_BASE.yaxis, title: 'EUR/MWh' },
    title: { text: 'Price with ±1σ Volatility Band', font: { size: 11, color: '#64748b' }, x: 0.02 },
  }, { responsive: true, displayModeBar: false });

  Plotly.react('chart-market-hist', [{
    x: data.prices, type: 'histogram', nbinsx: 24,
    marker: { color: '#6366f1', opacity: 0.8 },
    hovertemplate: '%{y} hours at ~%{x:.1f} EUR/MWh<extra></extra>',
  }], {
    ...PLOTLY_BASE,
    xaxis: { ...PLOTLY_BASE.xaxis, title: 'EUR/MWh' },
    yaxis: { ...PLOTLY_BASE.yaxis, title: 'Hours' },
    title: { text: 'Price Distribution', font: { size: 11, color: '#64748b' }, x: 0.02 },
  }, { responsive: true, displayModeBar: false });
}
