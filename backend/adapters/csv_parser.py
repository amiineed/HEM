import csv
import io
from datetime import datetime, timezone
from typing import BinaryIO

from backend.domain.models import Measurement


def _parse_recorded_at(value: str) -> datetime:
    parsed = datetime.fromisoformat(value.strip().replace("Z", "+00:00"))
    return parsed if parsed.tzinfo else parsed.replace(tzinfo=timezone.utc)


def parse_measurements(file: BinaryIO, sensor_id: str) -> tuple[list[Measurement], int, list[str]]:
    """Parse headerless 5-column or legacy 4-column sensor CSV data."""
    text = io.TextIOWrapper(file, encoding="utf-8-sig", errors="replace")
    measurements: list[Measurement] = []
    rejected_rows = 0
    errors: list[str] = []
    try:
        for line_number, row in enumerate(csv.reader(text), start=1):
            if not row or not any(cell.strip() for cell in row):
                continue
            if any("<!doctype" in cell.lower() or "<html" in cell.lower() for cell in row):
                rejected_rows += 1
                errors.append(f"Ligne {line_number}: contenu HTML invalide")
                continue
            try:
                if len(row) == 5:
                    recorded_at = _parse_recorded_at(row[0])
                    values = row[1:]
                elif len(row) == 4:
                    recorded_at = datetime.fromtimestamp(0, tz=timezone.utc)
                    values = row
                else:
                    raise ValueError("nombre de colonnes attendu: 4 ou 5")
                elapsed_ms = int(values[0].strip())
                co2_ppm = int(values[1].strip())
                temperature_c = float(values[2].strip())
                humidity_pct = float(values[3].strip())
                if elapsed_ms < 0 or co2_ppm < 0:
                    raise ValueError("elapsed_ms et co2_ppm doivent être positifs")
                measurements.append(
                    Measurement(
                        sensor_id=sensor_id,
                        recorded_at=recorded_at,
                        elapsed_ms=elapsed_ms,
                        co2_ppm=co2_ppm,
                        temperature_c=temperature_c,
                        humidity_pct=humidity_pct,
                    )
                )
            except (TypeError, ValueError, OverflowError) as exc:
                rejected_rows += 1
                errors.append(f"Ligne {line_number}: {exc}")
    finally:
        text.detach()
    return measurements, rejected_rows, errors
