from fastapi import APIRouter
from pydantic import BaseModel

from automation.savings_calculator import calculate_savings

router = APIRouter(prefix="/api", tags=["savings"])


class SavingsRequest(BaseModel):
    sensor_data: dict
    schedule_type: str = "daily"


@router.post("/savings")
def get_savings(req: SavingsRequest):
    result = calculate_savings(req.sensor_data, req.schedule_type)
    return result
