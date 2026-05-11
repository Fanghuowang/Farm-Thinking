import asyncio
import json

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from sensor_streamer import SensorStreamer
from routes.actuator import router as actuator_router
from routes.profiles import router as profiles_router
from routes.ai_advisor import router as ai_advisor_router
from routes.decision_log_route import router as decision_log_router
from routes.savings import router as savings_router
from models.plant_profiles import get_profile
from automation.decision_engine import run_automation
from automation.predictive_alerts import check_predictive_alerts

app = FastAPI(title="Aero-AI", version="1.0.0")
app.include_router(actuator_router)
app.include_router(profiles_router)
app.include_router(ai_advisor_router)
app.include_router(decision_log_router)
app.include_router(savings_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"status": "running", "service": "Aero-AI"}


@app.websocket("/ws/sensor")
async def sensor_ws(websocket: WebSocket):
    await websocket.accept()
    queue = asyncio.Queue()

    async def on_data(data):
        await queue.put(data)

    streamer = SensorStreamer(interval=2.0, callback=on_data)
    await streamer.start()

    try:
        while True:
            data = await queue.get()

            if "timestamp" not in data:
                await websocket.send_json(data)
                continue

            profile = get_profile(streamer.plant_profile)
            thresholds = profile["thresholds"] if profile else {}

            if thresholds:
                run_automation(data, thresholds)
                alerts = check_predictive_alerts(data, thresholds)
                for alert in alerts:
                    await websocket.send_json(alert)

            await websocket.send_json(data)
    except WebSocketDisconnect:
        pass
    finally:
        await streamer.stop()
