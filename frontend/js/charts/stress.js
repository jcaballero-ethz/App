function renderStressCharts(d) {
  if (!d?.times?.length) return;
  Plotly.react('chart-price', [{
    x: d.times, y: d.prices,
    type: 'scatter', fill: 'tozeroy',
    line: { color: '#059669', width: 1.5 },
    fillcolor: 'rgba(5,150,105,0.08)',
    name: 'Price',
    hovertemplate: '%{y:.2f} EUR/MWh<extra></extra>',
  }], {
    ...PLOTLY_BASE,
    shapes: [{
      type: 'line',
      x0: d.times[0], x1: d.times[d.times.length - 1],
      y0: 0, y1: 0,
      line: { color: '#e5e5e5', dash: 'dash', width: 1 },
    }],
  }, { responsive: true, displayModeBar: false });

  const colors   = d.phi.map(v => v >= d.threshold ? '#ea580c' : '#bfdbfe');
  const patterns = d.phi.map(v => v >= d.threshold ? '/' : '');
  Plotly.react('chart-phi', [{
    x: d.times, y: d.phi,
    type: 'bar',
    marker: { color: colors, pattern: { shape: patterns } },
    name: 'Phi',
    hovertemplate: '%{y:.0f} kEUR/h<extra></extra>',
  }], {
    ...PLOTLY_BASE,
    shapes: [{
      type: 'line',
      x0: d.times[0], x1: d.times[d.times.length - 1],
      y0: d.threshold, y1: d.threshold,
      line: { color: '#ea580c', dash: 'dash', width: 1.2 },
    }],
    annotations: [{
      x: d.times[d.times.length - 1],
      y: d.threshold,
      text: '90th pct',
      showarrow: false,
      font: { size: 10, color: '#ea580c' },
      xanchor: 'right',
      yanchor: 'bottom',
    }],
  }, { responsive: true, displayModeBar: false });

  const tbody = document.getElementById('stress-table');
  tbody.innerHTML = '';
  const rows = d.times
    .map((t, i) => ({ t, phi: d.phi[i], price: d.prices[i], load: d.load[i] }))
    .filter(r => r.phi >= d.threshold)
    .sort((a, b) => b.phi - a.phi)
    .slice(0, 15);

  rows.forEach(r => {
    const tr = document.createElement('tr');
    const time = new Date(r.t).toLocaleString('en-GB', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
    tr.innerHTML = `
      <td>${time}</td>
      <td style="color:var(--orange);font-weight:700">${r.phi.toFixed(0)}</td>
      <td>${r.price.toFixed(2)}</td>
      <td>${r.load.toFixed(2)}</td>
      <td><span class="badge badge-stress">STRESS</span></td>`;
    tbody.appendChild(tr);
  });

  // Hour × weekday heatmap
  const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const buckets = Array.from({length: 24}, () => Array(7).fill(null).map(() => []));
  d.times.forEach((t, i) => {
    const dt = new Date(t);
    buckets[dt.getHours()][(dt.getDay() + 6) % 7].push(d.phi[i]);
  });
  const z = buckets.map(row => row.map(vals => vals.length ? vals.reduce((a,b)=>a+b,0)/vals.length : null));

  Plotly.react('chart-stress-heatmap', [{
    z, x: DAYS,
    y: Array.from({length: 24}, (_, i) => `${String(i).padStart(2,'0')}:00`),
    type: 'heatmap',
    colorscale: [[0,'#1a1d27'],[0.5,'#6366f1'],[1,'#f87171']],
    hovertemplate: '%{y} %{x}: %{z:.0f} kEUR/h<extra></extra>',
    showscale: true,
  }], {
    ...PLOTLY_BASE,
    margin: { t: 16, r: 80, b: 40, l: 56 },
    xaxis: { ...PLOTLY_BASE.xaxis },
    yaxis: { ...PLOTLY_BASE.yaxis, title: 'Hour', autorange: 'reversed' },
    title: { text: 'Average φ by Hour of Day × Weekday', font: { size: 11, color: '#64748b' }, x: 0.02 },
  }, { responsive: true, displayModeBar: false });
}
