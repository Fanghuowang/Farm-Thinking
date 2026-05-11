TNB_OFFPEAK_RATE = 0.218  # RM/kWh (midnight - 2pm)
TNB_PEAK_RATE = 0.518     # RM/kWh (2pm - midnight)
FIXED_SCHEDULE_PEAK_HOURS = 12  # Fixed schedule runs lights 12h during daytime (peak)

WATER_PER_PUMP_CYCLE = 2.5  # litres per pump activation

AI_PEAK_FRACTION = 0.3   # AI shifts 70% of load to off-peak
FIXED_PEAK_FRACTION = 0.7  # Fixed schedule runs 70% during peak


def _daily_energy_cost(kwh_per_day, peak_fraction):
    peak_kwh = kwh_per_day * peak_fraction
    offpeak_kwh = kwh_per_day * (1 - peak_fraction)
    return peak_kwh * TNB_PEAK_RATE + offpeak_kwh * TNB_OFFPEAK_RATE


def calculate_savings(sensor_data, schedule_type="daily"):
    energy_kw = sensor_data.get("energy_consumption", 2.0)
    hours_per_day = 24 if schedule_type == "daily" else 12
    kwh_per_day = energy_kw * hours_per_day

    fixed_cost = _daily_energy_cost(kwh_per_day, FIXED_PEAK_FRACTION)
    ai_cost = _daily_energy_cost(kwh_per_day, AI_PEAK_FRACTION)

    rm_saved = round(fixed_cost - ai_cost, 2)
    kwh_peak_avoided = round(kwh_per_day * (FIXED_PEAK_FRACTION - AI_PEAK_FRACTION), 2)

    soil_moisture = sensor_data.get("soil_moisture", 50)
    moisture_low = soil_moisture < 35
    water_saved = round(WATER_PER_PUMP_CYCLE * 0.4, 1) if not moisture_low else 0.0

    return {
        "fixed_schedule_cost_rm": round(fixed_cost, 2),
        "ai_optimized_cost_rm": round(ai_cost, 2),
        "rm_saved": rm_saved,
        "kwh_saved": kwh_peak_avoided,
        "water_saved_litres": water_saved,
        "schedule_type": schedule_type,
    }
