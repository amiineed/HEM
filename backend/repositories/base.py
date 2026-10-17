from abc import ABC, abstractmethod

from backend.domain.models import Building, Measurement, Sensor


class BuildingRepository(ABC):
    @abstractmethod
    def list_buildings(self) -> list[Building]:
        raise NotImplementedError

    @abstractmethod
    def add_building(self, building: Building) -> Building:
        raise NotImplementedError


class SensorRepository(ABC):
    @abstractmethod
    def list_sensors(self) -> list[Sensor]:
        raise NotImplementedError

    @abstractmethod
    def get(self, sensor_id: str) -> Sensor | None:
        raise NotImplementedError

    @abstractmethod
    def add_sensor(self, sensor: Sensor) -> Sensor:
        raise NotImplementedError

    @abstractmethod
    def update(self, sensor: Sensor) -> Sensor:
        raise NotImplementedError


class MeasurementRepository(ABC):
    @abstractmethod
    def list_for_sensor(self, sensor_id: str) -> list[Measurement]:
        raise NotImplementedError

    @abstractmethod
    def add_many(self, measurements: list[Measurement]) -> tuple[int, int]:
        """Return (inserted_rows, duplicate_rows)."""
        raise NotImplementedError
