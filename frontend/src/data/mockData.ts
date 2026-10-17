export type BuildingId = 'all' | 'prototype-1';

export type HeatingMode = 'eco-19' | 'reduit-16' | 'hors-gel' | 'ventilation-forcée';

export interface BuildingInfo {
  id: Exclude<BuildingId, 'all'>;
  name: string;
  code: string;
  address: string;
  surfaceM2: number;
  type: 'Scolaire' | 'Administratif' | 'Sportif' | 'Culturel' | 'Technique';
  reduction2023Pct: number;
  target2023Pct: number;
  baselineMwh: number;
  projectedMwh: number;
  targetTempC: number;
  nightTempC: number;
  heatingMode: HeatingMode;
  sensorsActive: number;
  sensorsTotal: number;
  boilerStatus:
    | 'Optimal (Loi d’eau Éco)'
    | 'Réduit Nuit Actif'
    | 'Dérive Consigne (+1.3°C)'
    | 'Régulation Priorité Air';
}

export interface SensorReading {
  id: string;
  sensorCode: string;
  buildingId: Exclude<BuildingId, 'all'>;
  buildingName: string;
  room: string;
  floor: string;
  temperatureC: number;
  targetTempC: number;
  co2Ppm: number;
  humidityPct: number;
  lastTimestamp: string;
  sourceFile: string;
  isSimulated?: boolean;
  valveOpeningPct: number;
  occupancy: 'Occupé' | 'Inoccupé' | 'Période Scolaire' | 'Fermé';
}

export interface HourlyTelemetryPoint {
  hour: string;
  tempMeasured: number;
  tempTarget: number;
  co2Ppm: number;
  co2SchoolPeak: number;
  powerKw: number;
  baselineKw: number;
}

export interface CsvImportLog {
  id: string;
  filename: string;
  importedAt: string;
  rowsCount: number;
  buildingScope: string;
  status: 'Validé & Indexé' | 'Alerte CO₂ Détectée' | 'Prêt Migration SQL';
  delimiter: string;
  encoding: string;
  checksum: string;
}

export const BUILDINGS: BuildingInfo[] = [
  {
    id: 'prototype-1',
    name: 'Capteur Prototype #1 (Wemos D1 Mini)',
    code: 'PROTO-WEMOS-01',
    address: 'Prototype physique unique',
    surfaceM2: 0,
    type: 'Technique',
    reduction2023Pct: 30,
    target2023Pct: 30,
    baselineMwh: 0,
    projectedMwh: 0,
    targetTempC: 19,
    nightTempC: 19,
    heatingMode: 'eco-19',
    sensorsActive: 1,
    sensorsTotal: 1,
    boilerStatus: 'Optimal (Loi d’eau Éco)',
  },
];

export const SENSOR_READINGS: SensorReading[] = [
  {
    id: 'prototype-1-reading',
    sensorCode: 'PROTO-WEMOS-01',
    buildingId: 'prototype-1',
    buildingName: 'Capteur Prototype #1',
    room: 'Wemos D1 Mini',
    floor: 'Prototype',
    temperatureC: 26.9,
    targetTempC: 19,
    co2Ppm: 1410,
    humidityPct: 63,
    lastTimestamp: '2026-10-15 14:31:13',
    sourceFile: 'mesures_capteurs 1.csv',
    valveOpeningPct: 0,
    occupancy: 'Occupé',
  },
];

export const HOURLY_TELEMETRY: HourlyTelemetryPoint[] = [
  ['14:20', 22.4, 19, 1272],
  ['14:29', 26.8, 19, 1390],
  ['14:30', 26.8, 19, 1396],
  ['14:30', 26.9, 19, 1403],
  ['14:31', 26.9, 19, 1410],
].map(([hour, tempMeasured, tempTarget, co2Ppm]) => ({
  hour: hour as string,
  tempMeasured: tempMeasured as number,
  tempTarget: tempTarget as number,
  co2Ppm: co2Ppm as number,
  co2SchoolPeak: co2Ppm as number,
  powerKw: 0,
  baselineKw: 0,
}));

export const CSV_IMPORT_LOGS: CsvImportLog[] = [
  {
    id: 'csv-1',
    filename: 'mesures_capteurs 1.csv',
    importedAt: '15/10/2026 à 14:31:13',
    rowsCount: 22,
    buildingScope: 'Capteur Prototype #1',
    status: 'Alerte CO₂ Détectée',
    delimiter: ';',
    encoding: 'UTF-8',
    checksum: 'prototype-01',
  },
];

export const SAMPLE_CSV_CONTENT = `recorded_at;elapsed_ms;co2_ppm;temperature_c;humidity_pct;source
2026-10-15 14:31:13;738003;1410;26.9;63.0;CSV_IMPORT
2026-10-15 14:30:43;707869;1403;26.9;63.0;CSV_IMPORT
2026-10-15 14:30:12;677380;1396;26.8;64.0;CSV_IMPORT
2026-10-15 14:29:42;647254;1390;26.8;64.0;CSV_IMPORT
2026-10-15 14:20:37;102223;1272;22.4;68.0;CSV_IMPORT`;
