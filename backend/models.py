from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.database import Base


class BuildingModel(Base):
    __tablename__ = "buildings"

    id: Mapped[str] = mapped_column(String(100), primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    code: Mapped[str] = mapped_column(String(100), nullable=False, unique=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)

    sensors: Mapped[list["SensorModel"]] = relationship(
        back_populates="building",
        cascade="all, delete-orphan",
    )


class SensorModel(Base):
    __tablename__ = "sensors"

    id: Mapped[str] = mapped_column(String(100), primary_key=True)
    building_id: Mapped[str] = mapped_column(
        ForeignKey("buildings.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    room_name: Mapped[str] = mapped_column(String(255), nullable=False)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="ONLINE")
    target_temp_c: Mapped[float] = mapped_column(Float, nullable=False, default=19.0)
    heating_mode: Mapped[str] = mapped_column(String(20), nullable=False, default="AUTO")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)

    building: Mapped[BuildingModel] = relationship(back_populates="sensors")
    measurements: Mapped[list["MeasurementModel"]] = relationship(
        back_populates="sensor",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )


class MeasurementModel(Base):
    __tablename__ = "measurements"
    __table_args__ = (
        UniqueConstraint(
            "sensor_id",
            "recorded_at",
            "elapsed_ms",
            name="uq_measurement_sensor_recorded_elapsed",
        ),
    )

    id: Mapped[str] = mapped_column(String(100), primary_key=True)
    sensor_id: Mapped[str] = mapped_column(
        ForeignKey("sensors.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    recorded_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    elapsed_ms: Mapped[int] = mapped_column(Integer, nullable=False)
    co2_ppm: Mapped[int] = mapped_column(Integer, nullable=False)
    temperature_c: Mapped[float] = mapped_column(Float, nullable=False)
    humidity_pct: Mapped[float] = mapped_column(Float, nullable=False)
    data_source: Mapped[str] = mapped_column(String(30), nullable=False, default="CSV_IMPORT")

    sensor: Mapped[SensorModel] = relationship(back_populates="measurements")
