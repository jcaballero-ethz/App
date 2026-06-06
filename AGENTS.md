# EnergyStress — Context for AI Agents (Codex / Claude Code)

## Qué es este proyecto

EnergyStress es un **dashboard de análisis de energía europea en tiempo real** construido con FastAPI + vanilla JS + Plotly.js.
Conecta con la API de ENTSO-E (plataforma oficial del mercado eléctrico europeo) y permite analizar eventos de estrés energético, mix de generación, flujos transfronterizos, precios y capacidad instalada para cualquier país europeo y rango de fechas.

**Este proyecto NO tiene relación con ninguna tesis académica ni con el modelo ZEN-garden.** Es un producto web standalone.

---

## Tech stack

| Capa | Tecnología |
|------|-----------|
| Backend | FastAPI (Python 3.11), pandas, ENTSO-E REST API |
| Frontend | Vanilla JS (ES2022), Plotly.js 2.27 (CDN, deferred), CSS custom properties |
| Fuentes | Inter (UI) + Fira Code (números) via Google Fonts |
| Tests | pytest + httpx — 11 tests |
| Python env | `/opt/anaconda3/envs/zen-garden-env/bin/python` |
| Working dir | `/Users/javiercaballero/Proyecto_Javi/energy-stress-app/` |
| Git remote | `jcaballero-ethz/App` en GitHub, rama `main` |

---

## Estructura de archivos

```
energy-stress-app/
├── server.py                  # FastAPI — todos los endpoints
├── data/fetch.py              # Wrappers de ENTSO-E (get_prices, get_load...)
├── tests/test_api.py          # 11 tests pytest
├── frontend/
│   ├── index.html             # Single-page app
│   ├── css/
│   │   ├── base.css           # Tokens CSS, animaciones, fuentes
│   │   ├── layout.css         # Header, botones
│   │   ├── sidebar.css        # Sidebar con iconos SVG
│   │   ├── metrics.css        # KPI cards (estilo editorial sin bordes)
│   │   ├── charts.css         # Estilos de chart cards
│   │   ├── tables.css         # Estilos de tablas
│   │   └── report.css         # Sección Intelligence Report
│   └── js/
│       ├── app.js             # STATE, fetchAll, showSection, renderMetrics
│       ├── api.js             # Cliente API (todos los fetch)
│       ├── compare.js         # Sección Country Compare
│       ├── report.js          # Intelligence Report + export CSV/PDF
│       └── charts/
│           ├── overview.js    # Command Overview — hero KPI + sparklines
│           ├── stress.js      # Stress Analysis + heatmap
│           ├── generation.js  # Generation Mix + donut + CO₂
│           ├── capacity.js    # Capacity bar chart
│           ├── map.js         # Europe Network map
│           ├── market.js      # Market Intelligence
│           ├── historical.js  # Historical Trends
│           └── alerts.js      # Alerts & Watchlist
```

---

## Endpoints API

| Endpoint | Devuelve |
|----------|---------|
| `GET /api/stress?country=ES&start=2025-04-28&end=2025-04-28` | prices, load, phi, threshold |
| `GET /api/generation` | mix de generación por fuente (GW) |
| `GET /api/capacity` | capacidad instalada por fuente (GW) |
| `GET /api/flows` | flujos transfronterizos |
| `GET /api/market` | serie de precios + avg/std/min/max |
| `GET /api/historical` | timelines de precio + carga |
| `GET /api/alerts` | horas de stress por encima del 90th percentil |
| `GET /api/countries` | códigos de países disponibles |
| `GET /api/map_hourly` | precios + flujos horarios para el mapa europeo |

**Phi (φ)** = `precio × carga / 1000` — coste total del sistema en kEUR/h.
**Stress** = horas donde φ ≥ percentil 90.

---

## 10 secciones del sidebar

1. **Overview** — hero KPI (€/MWh a 52px Fira Code), live dot pulsante, gradient line, 4 KPI cards
2. **Stress** — gráfico de precio, barras de phi, heatmap hora×día, tabla de stress
3. **Market** — serie de precios con banda ±1σ, histograma
4. **Generation** — área apilada + donut snapshot + estimación CO₂
5. **Network** — mapa de Europa con flujos y precios
6. **Historical** — timelines precio/carga + stats
7. **Alerts** — estado NORMAL/WARNING/CRITICAL, timeline phi, event log
8. **Compare** — comparativa de precios entre dos países
9. **Capacity** — barras horizontales por tecnología
10. **Report** — texto narrativo + export CSV/PDF

---

## Sistema de diseño

- **Fondo:** `#0f1117` · **Card:** `#1a1d27` · **Border:** `#1e2235`
- **Acento:** `#6366f1` indigo — brand, sidebar activo, charts neutros
- **Colores semánticos ESTRICTOS:**
  - `#22c55e` verde = renovable / bueno / live
  - `#f59e0b` ámbar = precio / caución
  - `#f87171` rojo = stress / alerta
  - `#60a5fa` azul = carga / demanda
- **Fuentes:** Inter (labels UI) + Fira Code (números, tabular-nums)
- **Animaciones:** `enterUp` stagger (0.35s), `live-pulse` dot, transiciones 150-300ms

---

## Cómo arrancar

```bash
cd /Users/javiercaballero/Proyecto_Javi/energy-stress-app
kill $(lsof -ti :8000) 2>/dev/null || true
/opt/anaconda3/envs/zen-garden-env/bin/uvicorn server:app --reload --port 8000
# Abrir: http://localhost:8000
# Probar con: España (ES) · 2025-04-28 (el apagón ibérico)
```

## Cómo correr los tests

```bash
cd /Users/javiercaballero/Proyecto_Javi/energy-stress-app
/opt/anaconda3/envs/zen-garden-env/bin/python -m pytest tests/ -v
# Esperado: 11 passed
```

---

## Lo que queremos mejorar

### Prioridad ALTA
1. **Secciones vacías en algunos países** — Market, Historical, Alerts muestran "unavailable" cuando ENTSO-E no tiene datos de carga. Necesita fallback mejor: mostrar lo que SÍ hay disponible.
2. **Disponibilidad por país** — Algunos países fallan silenciosamente. Añadir indicador de qué secciones funcionan para cada país.
3. **Mensajes de error** — Los errores son genéricos. Necesitan orientación específica por país.

### Prioridad MEDIA
4. **Más animaciones** — Las transiciones entre secciones son instantáneas. Añadir slide-in al cambiar de sección.
5. **Interactividad de charts** — Hacer que al hacer click en una hora de stress en la tabla, se resalte en el gráfico.
6. **Mobile** — El sidebar es icon-only en mobile pero los charts no están optimizados para móvil.
7. **Skeleton por sección** — El skeleton actual solo cubre la primera carga. Al re-fetchear debería mostrarse por sección.

### Prioridad BAJA
8. **Red 3D con Three.js** — El mapa europeo podría usar una visualización 3D con líneas de flujo animadas.
9. **Presets de fechas** — Botones rápidos: "Hoy", "Últimos 7 días", "Último mes".
10. **Compare mejorado** — Mostrar 6 gráficos comparativos en vez de solo uno.

---

## Reglas de workflow — qué hacer en cada situación

**NO explorar ~/AYUDAS/skills/ libremente. Usar EXACTAMENTE el archivo indicado para cada situación.**

### Antes de escribir código — leer este skill primero

| Situación | Leer este archivo exacto ANTES de empezar |
|-----------|------------------------------------------|
| Cualquier tarea nueva no trivial | `~/AYUDAS/skills/superpowers/brainstorming/brainstorming.md` |
| CSS, HTML, diseño visual | `~/AYUDAS/skills/ui-ux-pro-max/ui-ux-pro-max/ui-ux-pro-max.md` |
| Cambios en `server.py` | `~/AYUDAS/skills/ecc/fastapi-patterns/fastapi-patterns.md` |
| Cambios en archivos `.py` | `~/AYUDAS/skills/ecc/python-patterns/python-patterns.md` |
| Escribir tests | `~/AYUDAS/skills/ecc/python-testing/python-testing.md` |
| Bug / algo roto | `~/AYUDAS/skills/superpowers/systematic-debugging/systematic-debugging.md` |
| Animaciones / transiciones | `~/AYUDAS/skills/ecc/motion-foundations/motion-foundations.md` |

### Para ejecutar trabajo planificado

| Situación | Archivo exacto |
|-----------|---------------|
| Escribir plan de implementación | `~/AYUDAS/skills/superpowers/writing-plans/writing-plans.md` |
| Ejecutar plan con subagentes | `~/AYUDAS/skills/superpowers/subagent-driven-development/subagent-driven-development.md` |
| TDD paso a paso | `~/AYUDAS/skills/superpowers/test-driven-development/test-driven-development.md` |
| Verificar antes de terminar | `~/AYUDAS/skills/superpowers/verification-before-completion/verification-before-completion.md` |

### Agentes a invocar después de cada cambio

Referencia completa en `~/AYUDAS/agentes/README.md`.

| Tras cambiar este archivo | Invocar este agente |
|--------------------------|---------------------|
| Cualquier archivo de código | `ecc:code-reviewer` — SIEMPRE, sin excepción |
| `server.py` | `ecc:fastapi-reviewer` + `ecc:python-reviewer` |
| Cualquier `.py` | `ecc:python-reviewer` |
| Cualquier `.js` | `ecc:typescript-reviewer` |
| CSS o HTML | `dev-tools:qa-responsive-style` + `dev-tools:qa-ux-friction` |
| API + JS juntos | `dev-tools:qa-frontend-backend-alignment` |
| Nuevos endpoints | `ecc:security-reviewer` |
| Algo está roto | `debugging:investigator` |

### Secuencia obligatoria para features nuevas

```
1. Leer brainstorming.md → explorar y clarificar
2. Leer writing-plans.md → escribir plan detallado
3. Leer subagent-driven-development.md → ejecutar plan con subagentes
4. Invocar ecc:code-reviewer al terminar cada tarea
5. Commit + push cuando todo pase los tests
```

### Reglas de código

- TDD: test fallido primero, luego implementación mínima, luego refactor
- Commit tras cada cambio significativo
- Push al terminar la sesión
- No inventar patrones: seguir los existentes en el codebase

---

## Limitaciones conocidas

- ENTSO-E no tiene datos para todos los países. Algunos tienen datos parciales (sin load, sin generation).
- `get_load()` falla para algunos country codes — esto provoca que Market, Historical, Alerts devuelvan 400.
- Sin autenticación en la API — uso local/investigación únicamente.
- La API key de ENTSO-E se carga desde la variable de entorno `ENTSOE_API_KEY`.
