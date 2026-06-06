import pytest
from fastapi.testclient import TestClient
from server import app

client = TestClient(app)


def test_countries_returns_dict():
    r = client.get('/api/countries')
    assert r.status_code == 200
    data = r.json()
    assert 'countries' in data
    assert isinstance(data['countries'], dict)
    assert 'ES' in data['countries'].values()


def test_stress_missing_params_returns_422():
    r = client.get('/api/stress')
    assert r.status_code == 422


def test_stress_invalid_country_returns_400():
    r = client.get('/api/stress?country=XX&start=2025-04-28&end=2025-04-28')
    assert r.status_code == 400


def test_capacity_missing_params_returns_422():
    r = client.get('/api/capacity')
    assert r.status_code == 422


def test_root_returns_html():
    r = client.get('/')
    assert r.status_code == 200
    assert 'text/html' in r.headers['content-type']


def test_historical_missing_params_returns_422():
    r = client.get('/api/historical')
    assert r.status_code == 422

def test_market_missing_params_returns_422():
    r = client.get('/api/market')
    assert r.status_code == 422

def test_alerts_missing_params_returns_422():
    r = client.get('/api/alerts')
    assert r.status_code == 422

def test_historical_invalid_country_returns_400():
    r = client.get('/api/historical?country=XX&start=2025-04-28&end=2025-04-28')
    assert r.status_code == 400

def test_market_invalid_country_returns_400():
    r = client.get('/api/market?country=XX&start=2025-04-28&end=2025-04-28')
    assert r.status_code == 400

def test_alerts_invalid_country_returns_400():
    r = client.get('/api/alerts?country=XX&start=2025-04-28&end=2025-04-28')
    assert r.status_code == 400
