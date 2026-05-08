# Product Requirements Document (PRD)
## Aero-AI: Autonomous Vertical Farming Resource Optimizer
### UTMxHackathon'26 — Case Study 1

---

## 1. Project Overview
Aero-AI is an intelligent, closed-loop automation platform for indoor vertical farms. It shifts the paradigm from passive monitoring to **autonomous resource optimization**, specifically targeting the profitability gap caused by energy waste, reactive climate control, and lack of agricultural expertise. The high-fidelity prototype will simulate a live vertical farm environment using mock sensor data, showcasing predictive energy management, real-time decision-making, and an AI agronomist.

## 2. Problem Statement
Manual vertical farming leads to:
- Excessive energy consumption from fixed lighting/ cooling schedules
- Plant stress from reactive (not predictive) climate adjustments
- Water waste and suboptimal yields due to human error
- High barrier for non-expert urban farmers to achieve commercial viability

## 3. Solution Overview
A centralized web dashboard that:
- Ingests real-time (simulated) sensor streams (temp, humidity, soil moisture, pH, reservoir level, energy usage)
- Applies **rule-based automation** and **predictive thresholds** to control lights, fans, pumps
- Employs a **Lighting/Cooling Scheduler** to shift loads to off-peak TNB tariff hours
- Provides an **AI Agronomist** (GPT-4 API or rule-based fallback) for harvest/nutrient advice
- Calculates and displays **resource savings** vs. traditional fixed-timer farming

## 4. Core Features (Ranked by Must-Have)
| Priority | Feature | Description |
|----------|---------|-------------|
| P0 | Mock Sensor Data Engine | Backend generates realistic, time-varying data streams for temperature, humidity, soil moisture, pH, reservoir level, energy consumption. Supports multiple plant profiles. |
| P0 | Real-Time Dashboard | Dark-themed industrial UI with live-updating sensor tiles, a VPD gauge, and system status indicators. |
| P0 | Automated Control Logic | Rule-based engine that triggers actuators (simulated) based on thresholds. Actions logged in a “Decision Log”. |
| P0 | Energy & Resource Savings Calculator | Compares “AI-Optimized Schedule” vs “Fixed Schedule”. Shows RM saved, litres of water conserved, kWh avoided. |
| P1 | Predictive Alerts | Trend-based alerts (e.g., “Reservoir will run dry in 18 hours”) and threshold warnings with severity colors. |
| P1 | AI Agronomist Panel | Receives 7-day sensor data summary and outputs natural-language recommendations for harvest timing, pH adjustment, or nutrient changes. |
| P2 | Plant Profile Selector | Dropdown to switch between “Lettuce”, “Strawberry”, “Saffron” — loads specific thresholds and growth parameters. |
| P2 | Historical Trend Charts | 24-hour line charts for temperature, humidity, VPD, and energy usage. |

## 5. Tech Stack
- **Frontend:** React (via Horizon UI Free template), Chakra UI, ApexCharts, Recharts
- **Backend:** Python FastAPI, Uvicorn
- **Real-Time Communication:** WebSocket (from backend to frontend)
- **Mock Data:** Custom Python module (`mock_engine.py`) with configurable drift, noise, and diurnal patterns
- **AI Advisor:** OpenAI API call (GPT-4o) with a fallback deterministic response generator
- **Version Control:** Git, hosted on GitHub

## 6. Deliverables
1. **GitHub Repository** with full source code, README with setup instructions
2. **5-Minute Video** demonstrating dashboard, automation, AI advisor, and resource savings
3. **Working Prototype** accessible via `localhost:3000` with backend at `localhost:8000`

## 7. Design Guidelines
- **Theme:** Dark, industrial, green accents (emerald/teal)
- **Tiles:** Card-based, with live values and delta indicators
- **Layout:** Sidebar navigation, main dashboard with 3-column grid for sensor tiles, charts row, and AI advisor panel
- **Responsive:** Must function on laptop/desktop (hackathon presentation screen)
- **Typography:** Clean, monospaced for data, sans-serif for text

## 8. Constraints
- No real hardware; all sensor data must be mocked.
- All work must be original and completed within the hackathon period.
- The prototype must be demonstrable on a single machine.