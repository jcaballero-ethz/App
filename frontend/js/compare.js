function renderCompare() {
  const container = document.getElementById('compare-content');
  if (container.dataset.initialized) return;
  container.dataset.initialized = '1';

  container.innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
      ${[1,2].map(i => `
      <div>
        <div style="background:var(--bg-subtle);border:1px solid var(--border);border-radius:var(--radius);padding:16px;margin-bottom:16px">
          <div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:12px">Panel ${i}</div>
          <label style="font-size:11px;color:var(--text-muted);display:block;margin-bottom:4px">Country</label>
          <select id="cmp-country-${i}" style="width:100%;border:1px solid var(--border);border-radius:6px;padding:6px 8px;font-size:12px;margin-bottom:8px;font-family:inherit"></select>
          <label style="font-size:11px;color:var(--text-muted);display:block;margin-bottom:4px">Start</label>
          <input type="date" id="cmp-start-${i}" value="2025-04-28" style="width:100%;border:1px solid var(--border);border-radius:6px;padding:6px 8px;font-size:12px;margin-bottom:8px;font-family:inherit">
          <label style="font-size:11px;color:var(--text-muted);display:block;margin-bottom:4px">End</label>
          <input type="date" id="cmp-end-${i}" value="2025-04-28" style="width:100%;border:1px solid var(--border);border-radius:6px;padding:6px 8px;font-size:12px;margin-bottom:8px;font-family:inherit">
          <button onclick="loadComparePanel(${i})" style="width:100%;background:var(--green);color:white;border-radius:6px;padding:7px;font-size:12px;font-weight:600;cursor:pointer;border:none;font-family:inherit">Load</button>
        </div>
        <div id="cmp-result-${i}"><p style="color:var(--text-muted);font-size:13px;padding:20px 0">Click Load to fetch data.</p></div>
      </div>`).join('')}
    </div>`;

  API.countries().then(({ countries }) => {
    [1,2].forEach(i => {
      const sel = document.getElementById(`cmp-country-${i}`);
      Object.entries(countries).forEach(([name, code]) => {
        const o = document.createElement('option');
        o.value = code; o.textContent = name;
        if ((i === 1 && code === 'ES') || (i === 2 && code === 'DE_LU')) o.selected = true;
        sel.appendChild(o);
      });
    });
  });
}

async function loadComparePanel(i) {
  const country = document.getElementById(`cmp-country-${i}`).value;
  const start   = document.getElementById(`cmp-start-${i}`).value;
  const end     = document.getElementById(`cmp-end-${i}`).value;
  const result  = document.getElementById(`cmp-result-${i}`);

  result.innerHTML = '<div style="padding:40px;text-align:center"><div class="spinner"></div></div>';

  try {
    const d = await API.stress(country, start, end);
    const stressHours = d.phi.filter(v => v >= d.threshold).length;
    const severity = stressHours === 0 ? 'NONE'
      : stressHours <= 2 ? 'LOW'
      : stressHours <= 6 ? 'MEDIUM'
      : stressHours <= 12 ? 'HIGH' : 'CRITICAL';
    const sevColor = { NONE:'#059669', LOW:'#059669', MEDIUM:'#d97706', HIGH:'#ea580c', CRITICAL:'#dc2626' };

    result.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">
        <div class="metric-card tint-green">
          <div class="metric-label">Avg Price</div>
          <div class="metric-value green">${d.avg_price} EUR/MWh</div>
        </div>
        <div class="metric-card tint-orange">
          <div class="metric-label">Peak Phi</div>
          <div class="metric-value orange">${d.max_phi} kEUR/h</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Stress Hours</div>
          <div class="metric-value" style="color:${sevColor[severity]}">${stressHours}</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Severity</div>
          <div class="metric-value" style="color:${sevColor[severity]};font-size:18px">${severity}</div>
        </div>
      </div>
      <div style="height:160px" id="cmp-chart-${i}"></div>`;

    Plotly.newPlot(`cmp-chart-${i}`, [{
      x: d.times, y: d.prices,
      type: 'scatter', fill: 'tozeroy',
      line: { color: '#059669', width: 1 },
      fillcolor: 'rgba(5,150,105,0.07)',
      name: 'Price',
    }], {
      ...PLOTLY_BASE,
      height: 160,
      margin: { t: 4, b: 28, l: 40, r: 8 },
    }, { responsive: true, displayModeBar: false });

  } catch(e) {
    result.innerHTML = `<p style="color:var(--orange);font-size:13px">Error: ${e.message}</p>`;
  }
}
