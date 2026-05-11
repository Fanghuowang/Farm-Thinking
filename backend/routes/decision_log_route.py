from fastapi import APIRouter

from decision_log import get_entries

router = APIRouter(prefix="/api", tags=["decision-log"])


@router.get("/decision-log")
def read_decision_log(limit: int = 50):
    return get_entries(limit)
