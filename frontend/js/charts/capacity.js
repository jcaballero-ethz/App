function renderCap() {
  const cap = STATE.cap;
  const el  = document.getElementById('chart-cap');
  if (!cap?.sources?.length) {
    el.innerHTML = '<p style="color:var(--text-muted);padding:40px;text-align:center">Capacity data not available.</p>';
    return;
  }

  Plotly.react('chart-cap', [{
    x: cap.values,
    y: cap.sources,
    type: 'bar',
    orientation: 'h',
    marker: {
      color: cap.sources.map(s => GEN_COLORS[s] || '#64748b'),
      opacity: 0.9,
      pattern: { shape: cap.sources.map((_, i) => ['','/','\\ ','x','-','|','+','.'][i % 8]) },
    },
    text: cap.values.map(v => `${v.toFixed(1)} GW`),
    textposition: 'outside',
    textfont: { color: '#94a3b8', size: 10 },
    hovertemplate: '<b>%{y}</b><br>%{x:.1f} GW<extra></extra>',
  }], {
    ...PLOTLY_BASE,
    height: Math.max(320, cap.sources.length * 38),
    xaxis: { ...PLOTLY_BASE.xaxis, title: 'GW', tickformat: '.1f' },
    yaxis: { ...PLOTLY_BASE.yaxis, type: 'category', automargin: true },
    margin: { t: 16, b: 48, l: 180, r: 80 },
  }, { responsive: true, displayModeBar: false });
}
