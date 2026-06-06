function renderAlerts(data) {
  const el = document.getElementById('alerts-content');
  if (!el) return;
  if (!data) {
    el.innerHTML = '<div class="empty-state"><p>Alerts data unavailable.</p></div>';
    return;
  }

  const sevLabel = data.alert_count === 0 ? 'NORMAL' : data.alert_count <= 3 ? 'WARNING' : 'CRITICAL';
  const sevColor = data.alert_count === 0 ? 'var(--surplus)' : data.alert_count <= 3 ? 'var(--orange)' : 'var(--stress)';
  const peakPhi  = data.phi_values.length ? Math.max(...data.phi_values).toFixed(0) : '—';

  el.innerHTML = `
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:24px;">
      <div class="metric-card">
        <div class="metric-label">Alert Status</div>
        <div class="metric-value" style="color:${sevColor};">${sevLabel}</div>
        <div class="metric-sub">${data.alert_count} stress hours detected</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">φ Threshold (90th pct)</div>
        <div class="metric-value">${data.threshold.toFixed(0)}</div>
        <div class="metric-sub">kEUR/h</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Peak φ</div>
        <div class="metric-value orange">${peakPhi}</div>
        <div class="metric-sub">kEUR/h maximum</div>
      </div>
    </div>
    <div class="chart-card" style="margin-bottom:16px;">
      <div id="chart-alerts-timeline" style="height:240px;"></div>
    </div>
    <div class="table-card">
      <div style="padding:14px 20px;border-bottom:1px solid var(--border);font-size:11px;font-weight:600;color:var(--text-muted);letter-spacing:0.5px;text-transform:uppercase;">
        Stress Event Log
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>#</th><th>Timestamp</th><th>φ (kEUR/h)</th><th>Severity</th></tr></thead>
          <tbody id="alerts-table"></tbody>
        </table>
      </div>
    </div>
  `;

  if (data.stress_hours.length > 0) {
    Plotly.react('chart-alerts-timeline', [
      {
        x: data.stress_hours, y: data.phi_values,
        type: 'bar',
        marker: { color: data.phi_values.map(v => v > data.threshold * 1.5 ? '#f87171' : '#f59e0b') },
        hovertemplate: '%{x}<br>φ = %{y:.0f} kEUR/h<extra></extra>',
      },
      {
        x: [data.stress_hours[0], data.stress_hours[data.stress_hours.length - 1]],
        y: [data.threshold, data.threshold],
        type: 'scatter', mode: 'lines',
        line: { color: '#64748b', dash: 'dash', width: 1 },
        hoverinfo: 'skip', showlegend: false,
      },
    ], {
      ...PLOTLY_BASE,
      yaxis: { ...PLOTLY_BASE.yaxis, title: 'kEUR/h' },
      showlegend: false,
      title: { text: 'Stress Hours — φ Index', font: { size: 11, color: '#64748b' }, x: 0.02 },
    }, { responsive: true, displayModeBar: false });
  } else {
    document.getElementById('chart-alerts-timeline').innerHTML =
      '<p style="text-align:center;padding:60px;color:var(--text-muted);">No stress events in this period.</p>';
  }

  const tbody = document.getElementById('alerts-table');
  if (tbody) {
    tbody.innerHTML = data.stress_hours.map((t, i) => {
      const v   = data.phi_values[i];
      const sev = v > data.threshold * 1.5 ? 'CRITICAL' : 'WARNING';
      const col = sev === 'CRITICAL' ? 'var(--stress)' : 'var(--orange)';
      const ts  = new Date(t).toLocaleString('en-GB', { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' });
      return `<tr>
        <td>${i + 1}</td><td>${ts}</td>
        <td style="font-weight:700;color:var(--orange);">${v.toFixed(0)}</td>
        <td><span style="font-size:10px;font-weight:700;letter-spacing:0.5px;color:${col};">${sev}</span></td>
      </tr>`;
    }).join('');
  }
}
