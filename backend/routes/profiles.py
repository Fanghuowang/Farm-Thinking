from fastapi import APIRouter

from models.plant_profiles import PLANT_PROFILES

router = APIRouter(prefix="/api", tags=["profiles"])


@router.get("/plant-profiles")
def list_plant_profiles():
    result = []
    for name, profile in PLANT_PROFILES.items():
        result.append({
            "name": name,
            "display_name": profile["display_name"],
            "growth_stage": profile["growth_stage"],
            "growth_duration_days": profile["growth_duration_days"],
            "thresholds": profile["thresholds"],
        })
    return result
