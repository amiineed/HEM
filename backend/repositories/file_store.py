import json
import os
import threading
from pathlib import Path

from backend.domain.models import Building, Measurement, Sensor
from backend.repositories.base import (
    BuildingRepository,
    MeasurementRepository,
    SensorRepository,
)


class FileStore(BuildingRepository, SensorRepository, MeasurementRepository):
    def __init__(self, path: Path | str = Path(__file__).parents[1] / "data" / "store.json"):
        self.path = Path(path)
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self._lock = threading.RLock()
        self._data = self._load()

    def _load(self) -> dict:
        if not self.path.exists():
            data = self._default_data()
            self._save(data)
            return data
        try:
            data = json.loads(self.path.read_text(encoding="utf-8"))
            if not isinstance(data, dict):
                raise ValueError("store.json doit contenir un objet JSON")
            data.setdefault("buildings", [])
            data.setdefault("sensors", [])
            data.setdefault("measurements", [])
            return data
        except (OSError, json.JSONDecodeError, ValueError) as exc:
            raise RuntimeError(f"Impossible de charger le stockage {self.path}: {exc}") from exc

    @staticmethod
    def _default_data() -> dict:
        building = Building(id="BAT-01", name="Salle de Sport Pilote", code="BAT-HEM-01")
        sensor = Sensor(
            id="SENS-01",
            building_id=building.id,
            name="Capteur Prototype #1 - Wemos D1 Mini",
            room_name="Salle principale",
        )
        return {
            "buildings": [building.model_dump(mode="json")],
            "sensors": [sensor.model_dump(mode="json")],
            "measurements": [],
        }

    def _save(self, data: dict | None = None) -> None:
        payload = data if data is not None else self._data
        temporary = self.path.with_suffix(".tmp")
        temporary.write_text(json.dumps(payload, ensure_ascii=True, indent=2), encoding="utf-8")
        os.replace(temporary, self.path)

    def list_buildings(self) -> list[Building]:
        with self._lock:
            return [Building.model_validate(item) for item in self._data["buildings"]]

    def add_building(self, building: Building) -> Building:
        with self._lock:
            if any(item["id"] == building.id for item in self._data["buildings"]):
                raise ValueError(f"Le bâtiment {building.id} existe déjà")
            self._data["buildings"].append(building.model_dump(mode="json"))
            self._save()
            return building

    def list_sensors(self) -> list[Sensor]:
        with self._lock:
            return [Sensor.model_validate(item) for item in self._data["sensors"]]

    def get(self, sensor_id: str) -> Sensor | None:
        with self._lock:
            item = next((item for item in self._data["sensors"] if item["id"] == sensor_id), None)
            return Sensor.model_validate(item) if item else None

    def add_sensor(self, sensor: Sensor) -> Sensor:
        with self._lock:
            if any(item["id"] == sensor.id for item in self._data["sensors"]):
                raise ValueError(f"Le capteur {sensor.id} existe déjà")
            self._data["sensors"].append(sensor.model_dump(mode="json"))
            self._save()
            return sensor

    def update(self, sensor: Sensor) -> Sensor:
        with self._lock:
            for index, item in enumerate(self._data["sensors"]):
                if item["id"] == sensor.id:
                    self._data["sensors"][index] = sensor.model_dump(mode="json")
                    self._save()
                    return sensor
            raise ValueError(f"Capteur inconnu: {sensor.id}")

    def list_for_sensor(self, sensor_id: str) -> list[Measurement]:
        with self._lock:
            return [
                Measurement.model_validate(item)
                for item in self._data["measurements"]
                if item["sensor_id"] == sensor_id
            ]

    def add_many(self, measurements: list[Measurement]) -> tuple[int, int]:
        with self._lock:
            existing = {
                (
                    item["sensor_id"],
                    Measurement.model_validate(item).recorded_at.isoformat(),
                    item["elapsed_ms"],
                )
                for item in self._data["measurements"]
            }
            inserted = 0
            duplicates = 0
            for measurement in measurements:
                key = (
                    measurement.sensor_id,
                    measurement.recorded_at.isoformat(),
                    measurement.elapsed_ms,
                )
                if key in existing:
                    duplicates += 1
                    continue
                self._data["measurements"].append(measurement.model_dump(mode="json"))
                existing.add(key)
                inserted += 1
            if inserted:
                self._save()
            return inserted, duplicates
