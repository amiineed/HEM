from backend.domain.models import HeatingDecision, Measurement, Sensor


def calculate_heating_decision(sensor: Sensor, latest: Measurement | None) -> HeatingDecision:
    temperature = latest.temperature_c if latest else None
    co2 = latest.co2_ppm if latest else None
    air_quality_alert = "CRITICAL" if co2 is not None and co2 > 1000 else "OK"
    if sensor.heating_mode == "MANUAL_ON":
        heating_should_run = True
        energy_saving_active = False
    elif sensor.heating_mode == "MANUAL_OFF":
        heating_should_run = False
        energy_saving_active = True
    else:
        heating_should_run = temperature is not None and temperature <= sensor.target_temp_c
        energy_saving_active = not heating_should_run
    return HeatingDecision(
        heating_should_run=heating_should_run,
        energy_saving_active=energy_saving_active,
        air_quality_alert=air_quality_alert,
        heating_mode=sensor.heating_mode,
        target_temp_c=sensor.target_temp_c,
        current_temperature_c=temperature,
        co2_ppm=co2,
    )
