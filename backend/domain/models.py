from datetime import datetime, timezone
from typing import Literal
from uuid import uuid4

from pydantic import BaseModel, ConfigDict, Field


HeatingMode = Literal["AUTO", "MANUAL_ON", "MANUAL_OFF"]
SensorStatus = Literal["ONLINE", "OFFLINE"]
DataSource = Literal["CSV_IMPORT", "LORA_GATEWAY"]


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


class Building(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: str = Field(default_factory=lambda: str(uuid4()))
    name: str
    code: str
    created_at: datetime = Field(default_factory=utc_now)


class Sensor(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: str
    building_id: str
    name: str
    room_name: str
    status: SensorStatus = "ONLINE"
    target_temp_c: float = 19.0
    heating_mode: HeatingMode = "AUTO"


class Measurement(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: str = Field(default_factory=lambda: str(uuid4()))
    sensor_id: str
    recorded_at: datetime
    elapsed_ms: int
    co2_ppm: int
    temperature_c: float
    humidity_pct: float
    data_source: DataSource = "CSV_IMPORT"


class ImportResult(BaseModel):
    total_rows: int
    inserted_rows: int
    duplicate_rows: int
    rejected_rows: int
    errors: list[str] = Field(default_factory=list)


class HeatingDecision(BaseModel):
    heating_should_run: bool
    energy_saving_active: bool
    air_quality_alert: Literal["OK", "CRITICAL"]
    heating_mode: HeatingMode
    target_temp_c: float
    current_temperature_c: float | None = None
    co2_ppm: int | None = None
