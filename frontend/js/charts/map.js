window._mapData   = null;
window._mapHour   = 0;
window._mapPlay   = false;
window._mapTimer  = null;

const COUNTRY_COORDS = {
  'ES':[40.4,-3.7],'FR':[46.2,2.2],'DE_LU':[51.2,10.5],
  'IT':[42.5,12.5],'PT':[39.4,-8.2],'NL':[52.4,5.3],
  'BE':[50.5,4.5],'AT':[47.5,14.5],'CH':[46.8,8.2],
  'PL':[52.0,20.0],'DK':[56.0,10.0],'NO':[61.0,8.0],
  'SE':[63.0,16.0],'FI':[64.0,26.0],'GR':[39.0,22.0],
  'CZ':[49.8,15.5],'HU':[47.2,19.5],'RO':[45.9,25.0],
};

const ENTSOE_TO_ISO3 = {
  'ES':'ESP','FR':'FRA','DE_LU':'DEU','IT':'ITA','PT':'PRT',
  'NL':'NLD','BE':'BEL','AT':'AUT','CH':'CHE','PL':'POL',
  'DK':'DNK','NO':'NOR','SE':'SWE','FI':'FIN','GR':'GRC',
  'CZ':'CZE','HU':'HUN','RO':'ROU',
};

function buildMapLayout(hour) {
  const d = window._mapData;
  const t = d?.times?.[hour];
  const label = t
    ? new Date(t).toLocaleString('en-GB', { weekday:'short', month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' })
    : '';
  const selISO  = ENTSOE_TO_ISO3[STATE.country] || '';
  const selP    = d?.prices?.[selISO]?.[hour];
  const pLabel  = selP != null ? ` · ${selP.toFixed(1)} EUR/MWh` : '';

  return {
    geo: {
      scope: 'europe',
      projection: { type: 'natural earth' },
      showland: true,  landcolor: '#f8fafc',
      showocean: true, oceancolor: '#eff6ff',
      showcountries: true, countrycolor: '#e2e8f0',
      showcoastlines: true, coastlinecolor: '#e2e8f0',
      bgcolor: '#ffffff',
      lonaxis: { range: [-15, 35] },
      lataxis: { range: [34, 72] },
    },
    paper_bgcolor: '#ffffff',
    font: { family: 'Inter, system-ui, sans-serif', color: '#374151', size: 11 },
    height: 500,
    margin: { t: 10, b: 10, l: 0, r: 0 },
    showlegend: false,
    annotations: [{
      text: `${label}${pLabel}`,
      showarrow: false, x: 0.01, y: 0.99,
      xref: 'paper', yref: 'paper',
      font: { size: 12, color: '#374151' },
      bgcolor: 'rgba(255,255,255,0.9)',
      bordercolor: '#e5e5e5',
      borderwidth: 1,
      borderpad: 6,
    }],
    coloraxis: {
      colorscale: [
        [0.0, '#059669'], [0.15, '#34d399'],
        [0.4, '#fbbf24'], [0.7, '#f97316'],
        [1.0, '#dc2626'],
      ],
      cmin: -10, cmax: 200,
      colorbar: {
        title: { text: 'EUR/MWh', font: { size: 10 } },
        thickness: 10, len: 0.5,
        tickfont: { size: 9 },
      },
    },
  };
}

function buildMapTraces(hour) {
  const d = window._mapData;
  if (!d) return [];
  const traces = [];

  const locs = [], zvals = [], hovers = [];
  Object.entries(d.prices).forEach(([iso3, arr]) => {
    const v = arr[hour] ?? 0;
    locs.push(iso3);
    zvals.push(v);
    hovers.push(`<b>${iso3}</b><br>${v.toFixed(2)} EUR/MWh`);
  });
  traces.push({
    type: 'choropleth',
    locationmode: 'ISO-3',
    locations: locs, z: zvals,
    coloraxis: 'coloraxis',
    hovertext: hovers,
    hoverinfo: 'text',
    marker: { line: { color: '#ffffff', width: 0.8 } },
  });

  Object.entries(d.flows).forEach(([key, corridor]) => {
    const { from: a, to: b, values } = corridor;
    const ca = COUNTRY_COORDS[a], cb = COUNTRY_COORDS[b];
    if (!ca || !cb) return;
    const flow = values[hour] || 0;
    if (Math.abs(flow) < 50) return;
    const color = flow > 0 ? '#059669' : '#ea580c';
    const width = Math.max(1, Math.min(6, Math.abs(flow) / 500));

    traces.push({
      type: 'scattergeo',
      lat: [ca[0], cb[0]], lon: [ca[1], cb[1]],
      mode: 'lines',
      line: { color, width },
      hoverinfo: 'skip', showlegend: false,
    });

    const frac = flow > 0 ? 0.62 : 0.38;
    traces.push({
      type: 'scattergeo',
      lat: [ca[0] + frac * (cb[0] - ca[0])],
      lon: [ca[1] + frac * (cb[1] - ca[1])],
      mode: 'text',
      text: [flow > 0 ? '>' : '<'],
      textfont: { size: Math.max(9, Math.min(14, Math.abs(flow) / 500)), color },
      hoverinfo: 'skip', showlegend: false,
    });
  });

  return traces;
}

async function renderMap() {
  const start = STATE.start, end = STATE.end, country = STATE.country;
  const cacheKey = `${country}-${start}-${end}`;

  if (!window._mapData || window._mapData._key !== cacheKey) {
    document.getElementById('map-loading').classList.remove('hidden');
    document.getElementById('chart-map').style.visibility = 'hidden';
    document.getElementById('map-scrubber').classList.add('hidden');

    try {
      window._mapData = await API.mapHourly(country, start, end);
      window._mapData._key = cacheKey;
      window._mapHour = 0;
    } catch(e) {
      document.getElementById('map-loading').classList.add('hidden');
      return;
    }
    document.getElementById('map-loading').classList.add('hidden');
    document.getElementById('chart-map').style.visibility = 'visible';
  }

  applyMapHour(window._mapHour);

  const slider = document.getElementById('map-slider');
  slider.max   = window._mapData.times.length - 1;
  slider.value = window._mapHour;
  document.getElementById('map-scrubber').classList.remove('hidden');

  renderFlowsTable(STATE.flows);
}

function applyMapHour(hour) {
  window._mapHour = hour;
  Plotly.react('chart-map', buildMapTraces(hour), buildMapLayout(hour),
    { responsive: true, displayModeBar: false });
  const t = window._mapData?.times?.[hour];
  if (t) {
    document.getElementById('map-time-label').textContent =
      new Date(t).toLocaleString('en-GB', {
        weekday: 'short', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit',
      });
  }
}

function scrubMap(val) { applyMapHour(parseInt(val)); }

function togglePlay() {
  window._mapPlay = !window._mapPlay;
  document.getElementById('map-play').textContent = window._mapPlay ? 'Pause' : 'Play';
  if (window._mapPlay) {
    window._mapTimer = setInterval(() => {
      const next = (window._mapHour + 1) % (window._mapData?.times?.length || 1);
      document.getElementById('map-slider').value = next;
      applyMapHour(next);
    }, 500);
  } else {
    clearInterval(window._mapTimer);
  }
}

function renderFlowsTable(flows) {
  const tbody = document.getElementById('flows-table');
  tbody.innerHTML = '';
  if (!flows?.flows) return;
  Object.entries(flows.flows).forEach(([nb, f]) => {
    const netColor = f.net > 0 ? 'var(--green)' : 'var(--orange)';
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><b>${nb}</b></td>
      <td style="color:var(--green)">${Math.round(f.export)} MW</td>
      <td style="color:var(--orange)">${Math.round(f.import)} MW</td>
      <td style="color:${netColor};font-weight:700">${f.net > 0 ? '+' : ''}${Math.round(f.net)} MW</td>`;
    tbody.appendChild(tr);
  });
}
