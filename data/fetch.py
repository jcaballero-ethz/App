import os
import pandas as pd
from functools import lru_cache
from entsoe import EntsoePandasClient

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

API_KEY = os.environ.get('ENTSOE_API_KEY', '')
if not API_KEY:
    raise RuntimeError("ENTSOE_API_KEY environment variable is not set")

COUNTRY_CODES = {
    'Spain':       'ES',
    'Germany':     'DE_LU',
    'France':      'FR',
    'Italy':       'IT',
    'Portugal':    'PT',
    'Netherlands': 'NL',
    'Belgium':     'BE',
    'Austria':     'AT',
    'Switzerland': 'CH',
    'Poland':      'PL',
    'Denmark':     'DK',
    'Norway':      'NO',
    'Sweden':      'SE',
    'Finland':     'FI',
    'Greece':      'GR',
    'Czech Rep.':  'CZ',
    'Hungary':     'HU',
    'Romania':     'RO',
}

NEIGHBORS = {
    'ES':    ['FR', 'PT'],
    'FR':    ['ES', 'DE_LU', 'IT', 'BE', 'CH'],
    'DE_LU': ['FR', 'NL', 'BE', 'AT', 'CH', 'PL', 'CZ'],
    'IT':    ['FR', 'AT', 'CH'],
    'PT':    ['ES'],
    'NL':    ['DE_LU', 'BE'],
    'BE':    ['FR', 'DE_LU', 'NL'],
    'AT':    ['DE_LU', 'IT', 'CH', 'CZ', 'HU'],
    'CH':    ['FR', 'DE_LU', 'IT', 'AT'],
    'PL':    ['DE_LU', 'CZ'],
    'DK':    ['DE_LU', 'SE', 'NO'],
    'NO':    ['SE', 'DK', 'FI'],
    'SE':    ['NO', 'DK', 'FI'],
    'FI':    ['SE', 'NO'],
    'CZ':    ['DE_LU', 'AT', 'PL'],
    'HU':    ['AT', 'RO'],
    'RO':    ['HU'],
    'GR':    [],
}

COUNTRY_COORDS = {
    'ES':    (40.4, -3.7),   'FR':    (46.2,  2.2),   'DE_LU': (51.2, 10.5),
    'IT':    (42.5, 12.5),   'PT':    (39.4, -8.2),   'NL':    (52.4,  5.3),
    'BE':    (50.5,  4.5),   'AT':    (47.5, 14.5),   'CH':    (46.8,  8.2),
    'PL':    (52.0, 20.0),   'DK':    (56.0, 10.0),   'NO':    (61.0,  8.0),
    'SE':    (63.0, 16.0),   'FI':    (64.0, 26.0),   'GR':    (39.0, 22.0),
    'CZ':    (49.8, 15.5),   'HU':    (47.2, 19.5),   'RO':    (45.9, 25.0),
}

def _client():
    return EntsoePandasClient(api_key=API_KEY)

@lru_cache(maxsize=128)
def get_prices(country_code, start, end):
    return _client().query_day_ahead_prices(country_code, start=start, end=end)

@lru_cache(maxsize=128)
def get_load(country_code, start, end):
    return _client().query_load(country_code, start=start, end=end)

@lru_cache(maxsize=128)
def get_generation(country_code, start, end):
    return _client().query_generation(country_code, start=start, end=end)

@lru_cache(maxsize=256)
def get_crossborder_flows(from_code, to_code, start, end):
    try:
        return _client().query_crossborder_flows(from_code, to_code, start=start, end=end)
    except Exception:
        return None

@lru_cache(maxsize=64)
def get_installed_capacity(country_code, start, end):
    return _client().query_installed_generation_capacity(country_code, start=start, end=end)
