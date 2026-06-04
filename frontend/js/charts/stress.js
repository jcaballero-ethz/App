function renderStressCharts(d) {
  Plotly.newPlot('chart-price', [{
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

  const colors = d.phi.map(v => v >= d.threshold ? '#ea580c' : '#bfdbfe');
  Plotly.newPlot('chart-phi', [{
    x: d.times, y: d.phi,
    type: 'bar',
    marker: { color: colors },
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
}
