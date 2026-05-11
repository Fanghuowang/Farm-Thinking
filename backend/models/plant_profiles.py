PLANT_PROFILES = {
    "Lettuce": {
        "display_name": "Lettuce",
        "growth_stage": "vegetative",
        "growth_duration_days": 30,
        "sensor_bounds": {
            "temperature": {"min": 15, "max": 22, "target": 18},
            "humidity": {"min": 60, "max": 80, "target": 70},
            "soil_moisture": {"min": 40, "max": 70, "target": 55},
            "ph": {"min": 5.5, "max": 6.5, "target": 6.0},
            "reservoir_level": {"min": 0, "max": 100, "target": 75},
            "energy_consumption": {"min": 0.8, "max": 3.5, "target": 1.8},
            "ambient_light": {"min": 0, "max": 800, "target": 350},
        },
        "thresholds": {
            "temp_high": 24,
            "temp_low": 14,
            "humidity_high": 85,
            "humidity_low": 55,
            "soil_moisture_low": 35,
            "ph_high": 7.0,
            "ph_low": 5.0,
            "reservoir_low": 20,
            "light_high": 700,
            "light_low": 150,
        },
    },
    "Strawberry": {
        "display_name": "Strawberry",
        "growth_stage": "fruiting",
        "growth_duration_days": 60,
        "sensor_bounds": {
            "temperature": {"min": 18, "max": 28, "target": 22},
            "humidity": {"min": 55, "max": 75, "target": 65},
            "soil_moisture": {"min": 35, "max": 65, "target": 50},
            "ph": {"min": 5.0, "max": 6.5, "target": 5.8},
            "reservoir_level": {"min": 0, "max": 100, "target": 70},
            "energy_consumption": {"min": 1.0, "max": 4.0, "target": 2.2},
            "ambient_light": {"min": 0, "max": 900, "target": 500},
        },
        "thresholds": {
            "temp_high": 30,
            "temp_low": 16,
            "humidity_high": 80,
            "humidity_low": 50,
            "soil_moisture_low": 30,
            "ph_high": 7.0,
            "ph_low": 4.8,
            "reservoir_low": 25,
            "light_high": 800,
            "light_low": 200,
        },
    },
    "Saffron": {
        "display_name": "Saffron",
        "growth_stage": "flowering",
        "growth_duration_days": 90,
        "sensor_bounds": {
            "temperature": {"min": 12, "max": 25, "target": 17},
            "humidity": {"min": 40, "max": 60, "target": 50},
            "soil_moisture": {"min": 20, "max": 50, "target": 35},
            "ph": {"min": 6.0, "max": 8.0, "target": 7.0},
            "reservoir_level": {"min": 0, "max": 100, "target": 60},
            "energy_consumption": {"min": 0.5, "max": 3.0, "target": 1.5},
            "ambient_light": {"min": 0, "max": 1000, "target": 600},
        },
        "thresholds": {
            "temp_high": 28,
            "temp_low": 10,
            "humidity_high": 65,
            "humidity_low": 35,
            "soil_moisture_low": 20,
            "ph_high": 8.5,
            "ph_low": 5.5,
            "reservoir_low": 15,
            "light_high": 900,
            "light_low": 250,
        },
    },
}


def get_profile(name):
    return PLANT_PROFILES.get(name)


def list_profiles():
    return list(PLANT_PROFILES.keys())
