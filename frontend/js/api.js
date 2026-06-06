const API = {
  async _get(url) {
    const r = await fetch(url);
    if (!r.ok) {
      let detail = `HTTP ${r.status}`;
      try { const d = await r.json(); if (d.detail) detail = d.detail; } catch {}
      throw new Error(detail);
    }
    const d = await r.json();
    if (d.detail) throw new Error(d.detail);
    return d;
  },

  stress:    (country, start, end) =>
    API._get(`/api/stress?country=${country}&start=${start}&end=${end}`),

  generation:(country, start, end) =>
    API._get(`/api/generation?country=${country}&start=${start}&end=${end}`),

  mapHourly: (country, start, end) =>
    API._get(`/api/map_hourly?country=${country}&start=${start}&end=${end}`),

  flows:     (country, start, end) =>
    API._get(`/api/flows?country=${country}&start=${start}&end=${end}`),

  capacity:  (country, start, end) =>
    API._get(`/api/capacity?country=${country}&start=${start}&end=${end}`),

  countries: () =>
    API._get('/api/countries'),

  historical: (country, start, end) =>
    API._get(`/api/historical?country=${country}&start=${start}&end=${end}`),

  market: (country, start, end) =>
    API._get(`/api/market?country=${country}&start=${start}&end=${end}`),

  alerts: (country, start, end) =>
    API._get(`/api/alerts?country=${country}&start=${start}&end=${end}`),
};
