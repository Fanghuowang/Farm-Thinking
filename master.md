# Master Task List — Aero-AI

This file is the single source of truth for all development tasks.  
**Instructions for AI:** As you complete each task, mark it `[x]` and add a note in the Progress Log at the bottom with what was created/changed.

---

## Phase 0: Environment Setup
- [ ] **T0.1** Clone Horizon UI template into `frontend/` and verify it runs (`npm install && npm start`).
- [ ] **T0.2** Initialize `backend/` folder with a Python virtual environment and `requirements.txt` containing `fastapi`, `uvicorn`, `websockets`, `python-dotenv`, `openai`.
- [ ] **T0.3** Ensure all project files are under a single root `Aero-AI/` with `.gitignore` for `node_modules`, `venv`, `.env`.

---

## Phase 1: Backend — Mock Data Engine
- [ ] **T1.1** Create `backend/mock_engine.py` with a function `generate_sensor_data(plant_profile, noise=True)` that returns a dict: `{ temperature, humidity, soil_moisture, ph, reservoir_level, energy_consumption, ambient_light, timestamp }`. Include diurnal pattern, random walk drift, and configurable bounds per profile.
- [ ] **T1.2** Create `backend/models/plant_profiles.py` defining profiles for “Lettuce”, “Strawberry”, “Saffron” with thresholds and target ranges.
- [ ] **T1.3** Implement a `SensorStreamer` class that yields new data every 2 seconds (configurable) with a callback; broadcast via WebSocket.

---

## Phase 2: Backend — API & WebSocket
- [ ] **T2.1** Set up FastAPI app in `backend/main.py` with CORS enabled for `localhost:3000`.
- [ ] **T2.2** Create WebSocket endpoint `/ws/sensor` that streams mock sensor data from `SensorStreamer` as JSON.
- [ ] **T2.3** Create REST endpoint `POST /api/actuator` to receive manual control commands (for demo override) — logs to Decision Log.
- [ ] **T2.4** Create REST endpoint `GET /api/plant-profiles` to return available plant profiles.

---

## Phase 3: Backend — Automation & AI Logic
- [ ] **T3.1** Create `backend/automation/decision_engine.py` with rules: trigger fan if temp > threshold, trigger pump if soil moisture < low, dim lights if ambient_light high, shift light intensity to off-peak hours based on time.
- [ ] **T3.2** Implement energy cost comparison in `backend/automation/savings_calculator.py`: takes current sensor data and schedule type, returns RM saved, kWh saved, water saved (litres).
- [ ] **T3.3** Create `backend/routes/ai_advisor.py` that accepts a plant profile and 7-day sensor summary, returns a recommendation string. Include both a GPT-4o API call and a fallback rule-based generator (if API key missing).
- [ ] **T3.4** Update WebSocket stream to include `decision_log` messages whenever an automation action is taken, plus predictive alert messages (reservoir low, VPD spike).

---

## Phase 4: Frontend — Dashboard Layout & Data Wiring
- [ ] **T4.1** Remove unused pages and components from Horizon UI template; keep only Dashboard view and necessary layout components.
- [ ] **T4.2** Implement WebSocket connection in `frontend/src/hooks/useSensorData.js` (or directly in dashboard) to receive live sensor stream and update React state.
- [ ] **T4.3** Replace default dashboard content with a custom grid layout: top row = 6 sensor stat cards; middle row = two charts (temperature/humidity line, energy bar); bottom left = AI Agronomist card; bottom right = Decision Log.
- [ ] **T4.4** Apply green/teal accent colors to theme in `frontend/src/theme/`.

---

## Phase 5: Frontend — Key UI Components
- [ ] **T5.1** Create `SensorTile` component with icon, value, unit, and color-coded status background (green/amber/red based on thresholds).
- [ ] **T5.2** Build a `VPDGauge` component that displays current Vapor Pressure Deficit with a semi-circular gauge (use ApexCharts Gauge or pure CSS).
- [ ] **T5.3** Build `HistoricalChart` component using ApexCharts line chart to show last 24 hours of temperature and humidity (stored in a simple buffer in frontend state).
- [ ] **T5.4** Build `EnergySavingsCard` showing fixed schedule cost vs AI-optimized cost, plus savings counter.
- [ ] **T5.5** Build `AIAgronomistPanel` that fetches from `/api/ai-advisor` and displays recommendation text.
- [ ] **T5.6** Create `DecisionLog` component that renders a scrollable feed of recent automation actions and alerts.
- [ ] **T5.7** Add `PlantProfileSelector` dropdown that calls backend to switch profiles and resets dashboard.

---

## Phase 6: Integration & Demo Flow
- [ ] **T6.1** Ensure all data flows end-to-end: backend mock engine → WebSocket → frontend state → all components update live.
- [ ] **T6.2** Create a “Demo Mode” toggle that speeds up the sensor stream and simulates a 24-hour cycle in 5 minutes (for video recording).
- [ ] **T6.3** Test every component with mock data and verify no console errors, smooth animations.

---

## Phase 7: Submission Prep
- [ ] **T7.1** Write a comprehensive `README.md` with project description, architecture diagram (ASCII or image), setup instructions, and demo video link.
- [ ] **T7.2** Record the 5-minute video following the rubric sequence (intro, problem, demo, tech, market).
- [ ] **T7.3** Tag a GitHub release `v1.0.0` and upload video link.

---

## Progress Log

| Date | Task Completed | Notes / File Changes |
|------|----------------|----------------------|
|      |                |                      |