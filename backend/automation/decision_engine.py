from datetime import datetime, timezone

from decision_log import add_entry


def evaluate_rules(sensor_data, thresholds):
    actions = []

    temp = sensor_data.get("temperature", 0)
    if temp > thresholds["temp_high"]:
        actions.append({"actuator": "fan", "command": "on", "reason": f"Temp {temp} exceeds {thresholds['temp_high']}"})
    elif temp < thresholds["temp_low"]:
        actions.append({"actuator": "heater", "command": "on", "reason": f"Temp {temp} below {thresholds['temp_low']}"})

    moisture = sensor_data.get("soil_moisture", 0)
    if moisture < thresholds["soil_moisture_low"]:
        actions.append({"actuator": "pump", "command": "on", "reason": f"Soil moisture {moisture} below {thresholds['soil_moisture_low']}"})

    light = sensor_data.get("ambient_light", 0)
    if light > thresholds["light_high"]:
        actions.append({"actuator": "light", "command": "dim", "reason": f"Ambient light {light} exceeds {thresholds['light_high']}"})
    elif light < thresholds["light_low"]:
        actions.append({"actuator": "light", "command": "bright", "reason": f"Ambient light {light} below {thresholds['light_low']}"})

    hour = datetime.now(timezone.utc).hour
    if 22 <= hour or hour <= 6:
        actions.append({"actuator": "light", "command": "bright", "reason": "Off-peak hours: increasing light to shift energy load"})

    humidity = sensor_data.get("humidity", 0)
    if humidity > thresholds["humidity_high"]:
        actions.append({"actuator": "fan", "command": "on", "reason": f"Humidity {humidity} exceeds {thresholds['humidity_high']}"})

    return actions


def run_automation(sensor_data, thresholds):
    actions = evaluate_rules(sensor_data, thresholds)
    for action in actions:
        add_entry(
            source="automation",
            action=action["command"],
            detail=f"{action['actuator']} -> {action['command']}: {action['reason']}",
            severity="info",
        )
    return actions
