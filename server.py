import sys, os, logging
sys.path.insert(0, os.path.dirname(__file__))

from fastapi import FastAPI, HTTPException

logger = logging.getLogger(__name__)
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import pandas as pd
import numpy as np
from concurrent.futures import ThreadPoolExecutor, as_completed

from data.fetch import (
    get_prices, get_load, get_generation,
    get_crossborder_flows, get_installed_capacity,
    COUNTRY_CODES, NEIGHBORS
)

app = FastAPI()

# All transmission corridors in the network (both directions handled in logic)
ALL_CORRIDORS = [
    ('ES','FR'), ('ES','PT'),
    ('FR','DE_LU'), ('FR','IT'), ('FR','BE'), ('FR','CH'),
    ('DE_LU','NL'), ('DE_LU','BE'), ('DE_LU','AT'), ('DE_LU','CH'), ('DE_LU','PL'), ('DE_LU','CZ'),
    ('IT','AT'), ('IT','CH'),
    ('NL','BE'),
    ('AT','CH'), ('AT','CZ'), ('AT','HU'),
    ('PL','CZ'),
    ('DK','SE'), ('DK','NO'),
    ('NO','SE'), ('NO','FI'),
    ('SE','FI'),
    ('CZ','HU'), ('HU','RO'),
]

ENTSOE_TO_ISO3 = {
    'ES': 'ESP', 'FR': 'FRA', 'DE_LU': 'DEU', 'IT': 'ITA',
    'PT': 'PRT', 'NL': 'NLD', 'BE': 'BEL', 'AT': 'AUT',
    'CH': 'CHE', 'PL': 'POL', 'DK': 'DNK', 'NO': 'NOR',
    'SE': 'SWE', 'FI': 'FIN', 'GR': 'GRC', 'CZ': 'CZE',
    'HU': 'HUN', 'RO': 'ROU',
}

def _ts(date_str, tz='Europe/Madrid'):
    return pd.Timestamp(date_str, tz=tz)

def _fetch_prices_safe(country, s, e, tz):
    try:
        p = get_prices(country, s, e)
        p.index = p.index.tz_convert(tz)
        return country, p
    except Exception:
        return country, None

def _fetch_flow_safe(a, b, s, e, tz):
    try:
        f = get_crossborder_flows(a, b, s, e)
        if f is not None:
            f = f.resample('h').mean()
            f.index = f.index.tz_convert(tz)
        return (a, b), f
    except Exception:
        return (a, b), None

@app.get('/api/stress')
def stress(country: str, start: str, end: str):
    try:
        tz     = 'Europe/Madrid'
        s      = _ts(start, tz)
        e      = _ts(end, tz) + pd.Timedelta(days=1)
        prices = get_prices(country, s, e)
        load   = get_load(country, s, e)
        load_h = load.resample('h').mean().iloc[:, 0]
        prices.index = prices.index.tz_convert(tz)
        load_h.index = load_h.index.tz_convert(tz)
        common = prices.index.intersection(load_h.index)
        phi    = load_h[common] * prices[common] / 1000
        thr    = float(phi.quantile(0.90))
        return {
            'times':     [str(t) for t in common],
            'prices':    prices[common].round(2).tolist(),
            'load':      (load_h[common] / 1000).round(2).tolist(),
            'phi':       phi.round(1).tolist(),
            'threshold': round(thr, 1),
            'avg_price': round(float(prices.mean()), 2),
            'avg_load':  round(float(load_h.mean()) / 1000, 2),
            'max_phi':   round(float(phi.max()), 1),
            'min_price': round(float(prices.min()), 2),
        }
    except Exception as e:
        logger.exception("Endpoint error")
        raise HTTPException(status_code=400, detail="Could not fetch data. Check country code and date range.")

@app.get('/api/generation')
def generation(country: str, start: str, end: str):
    try:
        tz  = 'Europe/Madrid'
        s   = _ts(start, tz)
        e   = _ts(end, tz) + pd.Timedelta(days=1)
        gen = get_generation(country, s, e)
        gen_actual = gen[[c for c in gen.columns if 'Actual Aggregated' in str(c)]].copy()
        gen_actual.columns = [c[0] if isinstance(c, tuple) else c for c in gen_actual.columns]
        gen_actual.index = gen_actual.index.tz_convert(tz)
        gen_actual = gen_actual.resample('h').mean()
        result = {}
        for col in gen_actual.columns:
            vals = gen_actual[col].fillna(0).values / 1000
            if vals.max() > 0.01:
                result[str(col)] = [round(v, 3) for v in vals.tolist()]
        return {'times': [str(t) for t in gen_actual.index], 'series': result}
    except Exception as e:
        logger.exception("Endpoint error")
        raise HTTPException(status_code=400, detail="Could not fetch data. Check country code and date range.")

@app.get('/api/map_hourly')
def map_hourly(country: str, start: str, end: str):
    """
    Returns hourly prices for all countries + flows for all corridors.
    Fetches in parallel for speed.
    """
    try:
        tz = 'Europe/Madrid'
        s  = _ts(start, tz)
        e  = _ts(end, tz) + pd.Timedelta(days=1)

        all_countries = list(ENTSOE_TO_ISO3.keys())

        # Fetch all prices in parallel
        country_prices = {}
        with ThreadPoolExecutor(max_workers=8) as ex:
            futures = {ex.submit(_fetch_prices_safe, c, s, e, tz): c for c in all_countries}
            for fut in as_completed(futures):
                code, p = fut.result()
                if p is not None:
                    country_prices[code] = p

        if country not in country_prices:
            raise ValueError(f'Could not fetch prices for {country}')

        # Reference time index from selected country
        ref_idx = country_prices[country].index
        times   = [str(t) for t in ref_idx]

        # Build hourly price arrays per ISO3 country
        prices_by_country = {}
        for code, p in country_prices.items():
            iso3 = ENTSOE_TO_ISO3.get(code)
            if iso3:
                aligned = p.reindex(ref_idx, method='nearest', tolerance='1h').ffill().fillna(0)
                prices_by_country[iso3] = [round(v, 2) for v in aligned.values.tolist()]

        # Fetch all corridor flows in parallel
        corridors_to_fetch = []
        for a, b in ALL_CORRIDORS:
            corridors_to_fetch.append((a, b))
            corridors_to_fetch.append((b, a))

        raw_flows = {}
        with ThreadPoolExecutor(max_workers=8) as ex:
            futures = {ex.submit(_fetch_flow_safe, a, b, s, e, tz): (a, b) for a, b in corridors_to_fetch}
            for fut in as_completed(futures):
                key, f = fut.result()
                if f is not None:
                    raw_flows[key] = f

        # Net flow per corridor (positive = A→B)
        flows_hourly = {}
        for a, b in ALL_CORRIDORS:
            exp = raw_flows.get((a, b))
            imp = raw_flows.get((b, a))
            if exp is not None or imp is not None:
                exp_a = exp.reindex(ref_idx, fill_value=0) if exp is not None else pd.Series(0, index=ref_idx)
                imp_a = imp.reindex(ref_idx, fill_value=0) if imp is not None else pd.Series(0, index=ref_idx)
                net = exp_a - imp_a
                corridor_key = f'{a}-{b}'
                flows_hourly[corridor_key] = {
                    'from': a, 'to': b,
                    'values': [round(v, 1) for v in net.values.tolist()],
                }

        return {
            'times':    times,
            'prices':   prices_by_country,
            'flows':    flows_hourly,
            'selected': country,
        }
    except Exception as e:
        logger.exception("Endpoint error")
        raise HTTPException(status_code=400, detail="Could not fetch data. Check country code and date range.")

@app.get('/api/flows')
def flows(country: str, start: str, end: str):
    try:
        tz = 'Europe/Madrid'
        s  = _ts(start, tz)
        e  = _ts(end, tz) + pd.Timedelta(days=1)
        result = {}
        for nb in NEIGHBORS.get(country, []):
            exp = get_crossborder_flows(country, nb, s, e)
            imp = get_crossborder_flows(nb, country, s, e)
            if exp is not None or imp is not None:
                export_mw = round(float(exp.mean()), 1) if exp is not None else 0.0
                import_mw = round(float(imp.mean()), 1) if imp is not None else 0.0
                result[nb] = {'export': export_mw, 'import': import_mw, 'net': round(export_mw - import_mw, 1)}
        return {'flows': result}
    except Exception as e:
        logger.exception("Endpoint error")
        raise HTTPException(status_code=400, detail="Could not fetch data. Check country code and date range.")

@app.get('/api/capacity')
def capacity(country: str, start: str, end: str):
    try:
        tz  = 'Europe/Madrid'
        s   = _ts(start, tz)
        e   = _ts(end, tz) + pd.Timedelta(days=1)
        cap = get_installed_capacity(country, s, e)
        latest = cap.iloc[-1].sort_values(ascending=False)
        latest = latest[latest > 0]
        if latest.empty:
            return {'sources': [], 'values': []}
        return {
            'sources': [str(c) for c in latest.index],
            'values':  [round(v / 1000, 2) for v in latest.values],
        }
    except Exception as e:
        logger.exception("Endpoint error")
        raise HTTPException(status_code=400, detail="Could not fetch data. Check country code and date range.")

@app.get('/api/countries')
def countries():
    return {'countries': COUNTRY_CODES}

app.mount('/static', StaticFiles(directory=os.path.join(os.path.dirname(__file__), 'frontend')), name='static')

@app.get('/')
def root():
    return FileResponse(os.path.join(os.path.dirname(__file__), 'frontend', 'index.html'))
