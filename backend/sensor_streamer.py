import asyncio

from mock_engine import generate_sensor_data


class SensorStreamer:
    def __init__(self, plant_profile="Lettuce", interval=2.0, callback=None):
        self.plant_profile = plant_profile
        self.interval = interval
        self.callback = callback
        self._running = False
        self._task = None

    def set_profile(self, profile_name):
        self.plant_profile = profile_name

    def set_interval(self, seconds):
        self.interval = seconds

    async def start(self):
        self._running = True
        self._task = asyncio.create_task(self._loop())

    async def stop(self):
        self._running = False
        if self._task:
            self._task.cancel()
            try:
                await self._task
            except asyncio.CancelledError:
                pass
            self._task = None

    async def _loop(self):
        while self._running:
            data = generate_sensor_data(self.plant_profile, noise=True)
            if self.callback:
                result = self.callback(data)
                if asyncio.iscoroutine(result):
                    await result
            await asyncio.sleep(self.interval)
