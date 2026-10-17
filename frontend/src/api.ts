const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export type HeatingMode = 'AUTO' | 'MANUAL_ON' | 'MANUAL_OFF';
export type SensorStatus = 'ONLINE' | 'OFFLINE';

export interface Building {
  id: string;
  name: string;
  code: string;
  created_at: string;
}

export interface Sensor {
  id: string;
  building_id: string;
  name: string;
  room_name: string;
  status: SensorStatus;
  target_temp_c: number;
  heating_mode: HeatingMode;
}

export interface Measurement {
  id: string;
  sensor_id: string;
  recorded_at: string;
  elapsed_ms: number;
  co2_ppm: number;
  temperature_c: number;
  humidity_pct: number;
  data_source: 'CSV_IMPORT' | 'LORA_GATEWAY';
}

export interface Stats {
  count: number;
  temperature_c: MetricStats;
  co2_ppm: MetricStats;
  humidity_pct: MetricStats;
}

export interface MetricStats {
  min: number | null;
  max: number | null;
  average: number | null;
}

export interface HeatingDecision {
  heating_should_run: boolean;
  energy_saving_active: boolean;
  air_quality_alert: 'OK' | 'CRITICAL';
  heating_mode: HeatingMode;
  target_temp_c: number;
  current_temperature_c: number | null;
  co2_ppm: number | null;
}

export interface SensorMeasurements {
  sensor: Sensor;
  stats: Stats;
  heating_decision: HeatingDecision;
  measurements: Measurement[];
}

export interface ImportResult {
  total_rows: number;
  inserted_rows: number;
  duplicate_rows: number;
  rejected_rows: number;
  errors: string[];
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, init);
  if (!response.ok) {
    let detail = `Erreur API (${response.status})`;
    try {
      const payload = await response.json();
      detail = payload.detail ?? detail;
    } catch {
      // Keep the HTTP status when the server does not return JSON.
    }
    throw new Error(detail);
  }
  return response.json() as Promise<T>;
}

export const api = {
  listBuildings: () => request<Building[]>('/buildings'),
  createBuilding: (payload: Pick<Building, 'name' | 'code'>) =>
    request<Building>('/buildings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
  listSensors: () => request<Sensor[]>('/sensors'),
  createSensor: (payload: Omit<Sensor, 'status'> & { status?: SensorStatus }) =>
    request<Sensor>('/sensors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'ONLINE', ...payload }),
    }),
  getSensorMeasurements: (sensorId: string) =>
    request<SensorMeasurements>(`/sensors/${encodeURIComponent(sensorId)}/measurements`),
  importCsv: (sensorId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return request<ImportResult>(`/sensors/${encodeURIComponent(sensorId)}/import-csv`, {
      method: 'POST',
      body: formData,
    });
  },
  updateSensorControl: (
    sensorId: string,
    payload: Partial<Pick<Sensor, 'heating_mode' | 'target_temp_c'>>,
  ) =>
    request<Sensor>(`/sensors/${encodeURIComponent(sensorId)}/control`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
};
