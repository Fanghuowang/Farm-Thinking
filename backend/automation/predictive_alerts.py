def check_predictive_alerts(sensor_data, thresholds):
    alerts = []

    reservoir = sensor_data.get("reservoir_level", 0)
    reservoir_low = thresholds.get("reservoir_low", 20)
    if reservoir < reservoir_low:
        hours_remaining = max(1, int(reservoir / 2))
        alerts.append({
            "type": "alert",
            "severity": "critical",
            "message": f"Reservoir at {reservoir}% - will run dry in ~{hours_remaining}h. Refill immediately.",
        })
    elif reservoir < reservoir_low * 1.5:
        hours_remaining = max(2, int(reservoir / 2))
        alerts.append({
            "type": "alert",
            "severity": "warning",
            "message": f"Reservoir at {reservoir}% - estimated {hours_remaining}h remaining.",
        })

    temp = sensor_data.get("temperature", 0)
    humidity = sensor_data.get("humidity", 0)
    vpd = _calc_vpd(temp, humidity)
    if vpd > 2.0:
        alerts.append({
            "type": "alert",
            "severity": "critical",
            "message": f"VPD spike: {vpd:.2f} kPa. High transpiration stress risk.",
        })
    elif vpd > 1.5:
        alerts.append({
            "type": "alert",
            "severity": "warning",
            "message": f"VPD elevated: {vpd:.2f} kPa. Monitor plant stress.",
        })

    return alerts


def _calc_vpd(temp_c, humidity_pct):
    svp = 0.6108 * pow(2.71828, (17.27 * temp_c) / (temp_c + 237.3))
    vpd = svp * (1 - humidity_pct / 100)
    return round(vpd, 3)
