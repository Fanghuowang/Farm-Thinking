from datetime import datetime, timezone

_log = []
MAX_ENTRIES = 200


def add_entry(source, action, detail, severity="info"):
    entry = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "source": source,
        "action": action,
        "detail": detail,
        "severity": severity,
    }
    _log.append(entry)
    if len(_log) > MAX_ENTRIES:
        _log.pop(0)
    return entry


def get_entries(limit=50):
    return _log[-limit:]
