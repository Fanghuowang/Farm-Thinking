# Aero-AI
**UTMxHackathon 2026 — Case Study 1: Precision Urban Agriculture**

## Quick Start

Prerequisites: Node.js 18+, Python 3.10+, Git

Backend:
```
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Frontend:
```
cd frontend
npm install
npm start
```
Open http://localhost:3000


## Problem

Manual vertical farming wastes water and electricity due to reactive climate control and fixed lighting schedules. Urban farmers lack affordable, data-driven automation tools.

## Solution

Aero-AI monitors indoor vertical farms in real-time, automates fans, pumps, and lights based on predictive thresholds, shifts energy loads to off-peak TNB hours, and provides AI-driven crop advice.

## Features

- Real-time sensor dashboard (temperature, humidity, soil moisture, pH, reservoir, energy)
- Predictive alerts (VPD spike warnings, reservoir dry-out estimates)
- Automated control (rule-based engine for fans, pumps, LED lighting)
- Energy optimization (TNB peak/off-peak tariff calculator with RM savings)
- AI Agronomist (GPT-4o optional, rule-based fallback)
- Multi-crop support (Lettuce, Strawberry, Saffron)
- Decision log (full audit trail)
- Demo mode (compresses 24h into 5 minutes)

## Tech Stack

- Frontend: React 19, Chakra UI, ApexCharts
- Backend: Python FastAPI, WebSocket
- Real-time: WebSocket (sensor stream), REST (commands)
- Mock Data: Custom engine with diurnal patterns and random walk
- AI: OpenAI GPT-4o (optional), rule-based fallback
- Future Hardware: ESP32, SHT4x sensors, PWM LED drivers, peristaltic pumps

## Architecture

ESP32 sensors on each rack publish via MQTT to a cloud-hosted FastAPI backend. The backend streams data to a React dashboard via WebSocket. Each rack is one MQTT topic — adding racks requires no backend changes.



