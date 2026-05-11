import math
import random
from datetime import datetime, timezone

from models.plant_profiles import PLANT_PROFILES

DEFAULT_BOUNDS = {
    "temperature": {"min": 15, "max": 35, "target": 24},
    "humidity": {"min": 40, "max": 90, "target": 65},
    "soil_moisture": {"min": 20, "max": 80, "target": 50},
    "ph": {"min": 5.0, "max": 8.0, "target": 6.2},
    "reservoir_level": {"min": 0, "max": 100, "target": 70},
    "energy_consumption": {"min": 0.5, "max": 5.0, "target": 2.0},
    "ambient_light": {"min": 0, "max": 1000, "target": 400},
}

_state = {}


def _get_state(profile_name):
    if profile_name not in _state:
        profile = PLANT_PROFILES.get(profile_name)
        bounds = profile["sensor_bounds"] if profile else DEFAULT_BOUNDS
        _state[profile_name] = {
            key: cfg["target"] for key, cfg in bounds.items()
        }
    return _state[profile_name]


def _diurnal_offset(hour):
    # Peak around hour 14 (2 PM), trough around hour 2 (2 AM)
    return math.sin((hour - 6) * math.pi / 12)


def _apply_diurnal(key, base_value, hour, bounds):
    cfg = bounds[key]
    amplitude = (cfg["max"] - cfg["min"]) * 0.2

    if key == "ambient_light":
        if 6 <= hour <= 18:
            peak = math.sin((hour - 6) * math.pi / 12)
            return cfg["target"] + (cfg["max"] - cfg["target"]) * peak * 0.8
        return max(cfg["min"], base_value * 0.05)

    if key == "energy_consumption":
        if 18 <= hour or hour <= 6:
            return base_value * 1.3
        return base_value * 0.8

    if key in ("temperature", "humidity"):
        return base_value + amplitude * _diurnal_offset(hour)

    return base_value


def _random_walk(current, cfg, step_scale=0.02):
    drift = random.gauss(0, (cfg["max"] - cfg["min"]) * step_scale)
    new_val = current + drift
    mean_revert = (cfg["target"] - new_val) * 0.05
    new_val += mean_revert
    return max(cfg["min"], min(cfg["max"], new_val))


def generate_sensor_data(plant_profile="Lettuce", noise=True):
    profile = PLANT_PROFILES.get(plant_profile)
    bounds = profile["sensor_bounds"] if profile else DEFAULT_BOUNDS
    state = _get_state(plant_profile)
    now = datetime.now(timezone.utc)
    hour = now.hour + now.minute / 60

    readings = {}
    for key, cfg in bounds.items():
        if noise:
            state[key] = _random_walk(state[key], cfg)
        else:
            state[key] = cfg["target"]

        value = _apply_diurnal(key, state[key], hour, bounds)

        if noise:
            jitter = random.gauss(0, (cfg["max"] - cfg["min"]) * 0.005)
            value += jitter

        value = max(cfg["min"], min(cfg["max"], value))

        if key in ("ph", "energy_consumption"):
            readings[key] = round(value, 2)
        elif key == "ambient_light":
            readings[key] = round(value, 1)
        else:
            readings[key] = round(value, 1)

    readings["timestamp"] = now.isoformat()
    return readings
