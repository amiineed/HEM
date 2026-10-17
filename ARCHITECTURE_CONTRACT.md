# Contrat d'Architecture & d'API — Smart City Hem (Projet 4010)

## 1. Format du fichier CSV réel (`mesures_capteurs 1.csv`)
- Fichier sans ligne d'en-tête (headerless).
- Format 5 colonnes : `recorded_at,elapsed_ms,co2_ppm,temperature_c,humidity_pct`
  Exemple : `2026-10-15 14:20:37,102223,1272,22.4,68.0`
- Format rétrocompatible 4 colonnes : `elapsed_ms,co2_ppm,temperature_c,humidity_pct`
  Exemple : `57430,335,22.2,54.0`
- Règle de nettoyage : rejeter toute ligne contenant du HTML (`<!DOCTYPE`) ou des valeurs non numériques, et l'incrémenter dans `rejected_rows`.

## 2. Modèle de données commun
- **Building** : `id` (str), `name` (str), `code` (str), `created_at` (ISO-8601)
- **Sensor** : `id` (str), `building_id` (str), `name` (str), `room_name` (str), `status` ("ONLINE"|"OFFLINE"), `target_temp_c` (float, défaut 19.0), `heating_mode` ("AUTO"|"MANUAL_ON"|"MANUAL_OFF")
- **Measurement** : `id` (str), `sensor_id` (str), `recorded_at` (ISO-8601), `elapsed_ms` (int), `co2_ppm` (int), `temperature_c` (float), `humidity_pct` (float), `data_source` ("CSV_IMPORT"|"LORA_GATEWAY")
- **Unicité (Anti-doublon)** : `(sensor_id, recorded_at, elapsed_ms)`

## 3. Endpoints API REST (`/api/v1`)
- `GET /api/v1/buildings` & `POST /api/v1/buildings`
- `GET /api/v1/sensors` & `POST /api/v1/sensors`
- `GET /api/v1/sensors/{sensor_id}/measurements` (renvoie `sensor`, `stats`, `heating_decision` et `measurements`)
- `POST /api/v1/sensors/{sensor_id}/import-csv` (multipart/form-data avec champ `file`, renvoie `{ total_rows, inserted_rows, duplicate_rows, rejected_rows, errors }`)
- `PATCH /api/v1/sensors/{sensor_id}/control` (body: `{ heating_mode, target_temp_c }`)