from fastapi import APIRouter
from pydantic import BaseModel

from decision_log import add_entry

router = APIRouter(prefix="/api", tags=["actuator"])

VALID_ACTUATORS = {"fan", "pump", "light", "heater"}
VALID_COMMANDS = {"on", "off", "dim", "bright"}


class ActuatorCommand(BaseModel):
    actuator: str
    command: str
    value: float | None = None


@router.post("/actuator")
def handle_actuator(cmd: ActuatorCommand):
    if cmd.actuator not in VALID_ACTUATORS:
        return {"ok": False, "error": f"Unknown actuator: {cmd.actuator}"}
    if cmd.command not in VALID_COMMANDS:
        return {"ok": False, "error": f"Unknown command: {cmd.command}"}

    detail = f"{cmd.actuator} -> {cmd.command}"
    if cmd.value is not None:
        detail += f" ({cmd.value})"
    severity = "warning" if cmd.command in ("on", "bright") else "info"

    entry = add_entry(source="manual", action=cmd.command, detail=detail, severity=severity)
    return {"ok": True, "entry": entry}
