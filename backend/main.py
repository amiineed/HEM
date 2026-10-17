from contextlib import asynccontextmanager
from statistics import mean
from typing import Annotated

from fastapi import Depends, FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from backend.adapters.csv_parser import parse_measurements
from backend.domain.models import (
    Building,
    HeatingDecision,
    HeatingMode,
    ImportResult,
    Measurement,
    Sensor,
)
from backend.repositories.file_store import FileStore
from backend.services.energy_service import calculate_heating_decision


store = FileStore()


class SensorControl(BaseModel):
    heating_mode: HeatingMode | None = None
    target_temp_c: float | None = Field(default=None, ge=-50, le=100)


def get_store() -> FileStore:
    return store


@asynccontextmanager
async def lifespan(_: FastAPI):
    yield


app = FastAPI(title="HEM2 Smart City API", version="1.0.0", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/v1/buildings", response_model=list[Building])
def list_buildings(repository: FileStore = Depends(get_store)):
    return repository.list_buildings()


@app.post("/api/v1/buildings", response_model=Building, status_code=201)
def create_building(building: Building, repository: FileStore = Depends(get_store)):
    try:
        return repository.add_building(building)
    except ValueError as exc:
        raise HTTPException(status_code=409, detail=str(exc)) from exc


@app.get("/api/v1/sensors", response_model=list[Sensor])
def list_sensors(repository: FileStore = Depends(get_store)):
    return repository.list_sensors()


@app.post("/api/v1/sensors", response_model=Sensor, status_code=201)
def create_sensor(sensor: Sensor, repository: FileStore = Depends(get_store)):
    if not any(building.id == sensor.building_id for building in repository.list_buildings()):
        raise HTTPException(status_code=404, detail=f"Bâtiment inconnu: {sensor.building_id}")
    try:
        return repository.add_sensor(sensor)
    except ValueError as exc:
        raise HTTPException(status_code=409, detail=str(exc)) from exc


@app.get("/api/v1/sensors/{sensor_id}/measurements")
def get_measurements(sensor_id: str, repository: FileStore = Depends(get_store)):
    sensor = repository.get(sensor_id)
    if sensor is None:
        raise HTTPException(status_code=404, detail=f"Capteur inconnu: {sensor_id}")
    measurements = repository.list_for_sensor(sensor_id)
    temperatures = [item.temperature_c for item in measurements]
    co2_values = [item.co2_ppm for item in measurements]
    humidities = [item.humidity_pct for item in measurements]
    latest = max(measurements, key=lambda item: item.recorded_at) if measurements else None
    return {
        "sensor": sensor,
        "stats": {
            "count": len(measurements),
            "temperature_c": _stats(temperatures),
            "co2_ppm": _stats(co2_values),
            "humidity_pct": _stats(humidities),
        },
        "heating_decision": calculate_heating_decision(sensor, latest),
        "measurements": measurements,
    }


def _stats(values: list[float | int]) -> dict[str, float | None]:
    return {
        "min": min(values) if values else None,
        "max": max(values) if values else None,
        "average": mean(values) if values else None,
    }


@app.post(
    "/api/v1/sensors/{sensor_id}/import-csv",
    response_model=ImportResult,
)
def import_csv(
    sensor_id: str,
    file: Annotated[UploadFile, File(...)],
    repository: FileStore = Depends(get_store),
):
    if repository.get(sensor_id) is None:
        raise HTTPException(status_code=404, detail=f"Capteur inconnu: {sensor_id}")
    if file.filename and not file.filename.lower().endswith(".csv"):
        raise HTTPException(status_code=400, detail="Le fichier doit avoir une extension .csv")
    measurements, rejected_rows, errors = parse_measurements(file.file, sensor_id)
    inserted, duplicates = repository.add_many(measurements)
    return ImportResult(
        total_rows=len(measurements) + rejected_rows,
        inserted_rows=inserted,
        duplicate_rows=duplicates,
        rejected_rows=rejected_rows,
        errors=errors,
    )


@app.patch("/api/v1/sensors/{sensor_id}/control", response_model=Sensor)
def update_control(
    sensor_id: str,
    control: SensorControl,
    repository: FileStore = Depends(get_store),
):
    sensor = repository.get(sensor_id)
    if sensor is None:
        raise HTTPException(status_code=404, detail=f"Capteur inconnu: {sensor_id}")
    updates = control.model_dump(exclude_unset=True)
    try:
        updated = sensor.model_copy(update=updates)
        return repository.update(updated)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
