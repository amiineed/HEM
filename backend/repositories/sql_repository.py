from collections.abc import Iterable
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from backend.domain.models import Building, Measurement, Sensor, utc_now
from backend.models import BuildingModel, MeasurementModel, SensorModel


class SQLRepository:
    def __init__(self, db: Session):
        self.db = db

    def list_buildings(self) -> list[Building]:
        rows = self.db.scalars(select(BuildingModel).order_by(BuildingModel.created_at)).all()
        return [Building.model_validate(row) for row in rows]

    def get_building(self, building_id: str) -> Building | None:
        row = self.db.get(BuildingModel, building_id)
        return Building.model_validate(row) if row else None

    def add_building(self, building: Building) -> Building:
        row = BuildingModel(**building.model_dump())
        self.db.add(row)
        self._commit_with_conflict("bâtiment", building.id)
        return Building.model_validate(row)

    def list_sensors(self) -> list[Sensor]:
        rows = self.db.scalars(select(SensorModel).order_by(SensorModel.created_at)).all()
        return [Sensor.model_validate(row) for row in rows]

    def get_sensor(self, sensor_id: str) -> Sensor | None:
        row = self.db.get(SensorModel, sensor_id)
        return Sensor.model_validate(row) if row else None

    def add_sensor(self, sensor: Sensor) -> Sensor:
        row = SensorModel(
            **sensor.model_dump(),
            created_at=utc_now(),
        )
        self.db.add(row)
        self._commit_with_conflict("capteur", sensor.id)
        return Sensor.model_validate(row)

    def update_sensor(self, sensor: Sensor) -> Sensor:
        row = self.db.get(SensorModel, sensor.id)
        if row is None:
            raise ValueError(f"Capteur inconnu: {sensor.id}")
        for field in ("building_id", "name", "room_name", "status", "target_temp_c", "heating_mode"):
            setattr(row, field, getattr(sensor, field))
        self.db.commit()
        self.db.refresh(row)
        return Sensor.model_validate(row)

    def delete_sensor(self, sensor_id: str) -> bool:
        row = self.db.get(SensorModel, sensor_id)
        if row is None:
            return False
        self.db.delete(row)
        self.db.commit()
        return True

    def list_for_sensor(self, sensor_id: str) -> list[Measurement]:
        rows = self.db.scalars(
            select(MeasurementModel)
            .where(MeasurementModel.sensor_id == sensor_id)
            .order_by(MeasurementModel.recorded_at)
        ).all()
        return [Measurement.model_validate(row) for row in rows]

    def add_many(self, measurements: Iterable[Measurement]) -> tuple[int, int]:
        inserted = 0
        duplicates = 0
        for measurement in measurements:
            try:
                with self.db.begin_nested():
                    row = MeasurementModel(**measurement.model_dump())
                    self.db.add(row)
                    self.db.flush()
            except IntegrityError:
                duplicates += 1
            else:
                inserted += 1
        self.db.commit()
        return inserted, duplicates

    def _commit_with_conflict(self, entity: str, entity_id: str) -> None:
        try:
            self.db.commit()
        except IntegrityError as exc:
            self.db.rollback()
            raise ValueError(f"Le {entity} {entity_id} existe déjà ou référence un bâtiment invalide") from exc
        self.db.flush()
