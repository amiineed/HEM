import React, { useState } from 'react';
import {
  BUILDINGS,
  BuildingId,
  SAMPLE_CSV_CONTENT,
  SensorReading,
} from '../data/mockData';
import {
  AlertTriangle,
  CheckCircle2,
  Database,
  FileSpreadsheet,
  Upload,
  X,
} from 'lucide-react';

interface CsvImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSensors: (newSensors: SensorReading[], filename: string) => void;
}

export const CsvImportModal: React.FC<CsvImportModalProps> = ({
  isOpen,
  onClose,
  onImportSensors,
}) => {
  const [csvText, setCsvText] = useState<string>(SAMPLE_CSV_CONTENT);
  const [filename, setFilename] = useState<string>('hem_lot_capteurs_14h25.csv');
  const [parseError, setParseError] = useState<string | null>(null);

  if (!isOpen) return null;

  const parsePreview = (): SensorReading[] => {
    const lines = csvText
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    if (lines.length <= 1) return [];

    const rows = lines.slice(1);
    return rows.map((row, idx) => {
      const parts = row.includes(';') ? row.split(';') : row.split(',');
      const code = (parts[0] || `HEM-CSV-${idx + 1}`).trim();
      const rawBld = (parts[1] || 'ecole-victor-hugo').trim() as Exclude<
        BuildingId,
        'all'
      >;
      const matchedBld =
        BUILDINGS.find((b) => b.id === rawBld) || BUILDINGS[0];
      const room = (parts[2] || 'Salle Municipale').trim();
      const floor = (parts[3] || 'RDC').trim();
      const temp = parseFloat(parts[4]) || 19.0;
      const target = parseFloat(parts[5]) || 19.0;
      const co2 = parseInt(parts[6], 10) || 650;
      const hum = parseInt(parts[7], 10) || 50;
      const ts = (parts[8] || '2023-11-24 14:25:00').trim();

      return {
        id: `csv-imp-${Date.now()}-${idx}`,
        sensorCode: code,
        buildingId: matchedBld.id,
        buildingName: matchedBld.name,
        room,
        floor,
        temperatureC: temp,
        targetTempC: target,
        co2Ppm: co2,
        humidityPct: hum,
        lastTimestamp: ts,
        sourceFile: filename,
        valveOpeningPct: temp > target ? 15 : 42,
        occupancy: 'Occupé',
      };
    });
  };

  const previewRows = parsePreview();
  const criticalCount = previewRows.filter((r) => r.co2Ppm > 1000).length;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFilename(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target?.result;
      if (typeof content === 'string') {
        setCsvText(content);
        setParseError(null);
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmImport = () => {
    if (previewRows.length === 0) {
      setParseError(
        'Aucune ligne de mesure valide détectée. Vérifiez le format CSV (séparateur ; ou ,).'
      );
      return;
    }
    onImportSensors(previewRows, filename);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl border border-slate-200 shadow-xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Importer un fichier CSV de mesures IoT (Ville de Hem)
              </h3>
              <p className="text-xs text-slate-500">
                Mode actif : Stockage CSV structuré • Schéma compatible PostgreSQL / TimescaleDB
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* File Picker + Schema Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-emerald-300 rounded-xl bg-emerald-50/40 hover:bg-emerald-50/80 transition-colors cursor-pointer">
              <Upload className="w-6 h-6 text-emerald-600 mb-1.5" />
              <span className="text-xs font-semibold text-slate-800">
                Sélectionner un fichier .CSV local
              </span>
              <span className="text-[11px] text-slate-500 mt-0.5">
                Fichier actif : <strong className="font-mono text-emerald-700">{filename}</strong>
              </span>
              <input
                type="file"
                accept=".csv,text/csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                <Database className="w-4 h-4 text-emerald-600" />
                <span>Prêt pour Base de données (ORM / SQL)</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed mt-1">
                Chaque ligne CSV est validée, typée et indexée en mémoire locale avec détection automatique des seuils critiques (<span className="text-red-600 font-semibold">CO₂ &gt; 1000 ppm</span> et dérives chauffage).
              </p>
              <div className="mt-2 flex items-center gap-2 text-[11px] font-mono text-slate-500">
                <span className="px-2 py-0.5 rounded bg-white border border-slate-200">
                  UTF-8
                </span>
                <span className="px-2 py-0.5 rounded bg-white border border-slate-200">
                  Séparateur ; ou ,
                </span>
              </div>
            </div>
          </div>

          {/* Raw CSV Editor */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Contenu brut du lot CSV (modifiable avant injection)
              </label>
              <button
                type="button"
                onClick={() => {
                  setCsvText(SAMPLE_CSV_CONTENT);
                  setFilename('hem_lot_capteurs_14h25.csv');
                }}
                className="text-xs text-emerald-600 hover:text-emerald-700 font-medium cursor-pointer"
              >
                Réinitialiser l’exemple municipal
              </button>
            </div>
            <textarea
              rows={4}
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-slate-900 text-slate-100 font-mono text-xs p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {parseError && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
              {parseError}
            </div>
          )}

          {/* Parsed Preview Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-800">
                Aperçu avant indexation ({previewRows.length} relevés détectés)
              </span>
              {criticalCount > 0 ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-red-100 text-red-700 border border-red-200">
                  <AlertTriangle className="w-3 h-3" />
                  {criticalCount} dépassement(s) CO₂ &gt; 1000 ppm
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3" />
                  Tous les seuils sont nominaux
                </span>
              )}
            </div>
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/60 text-slate-500">
                  <th className="py-2 px-3 font-medium">Capteur</th>
                  <th className="py-2 px-3 font-medium">Bâtiment & Salle</th>
                  <th className="py-2 px-3 font-medium">Temp. / Consigne</th>
                  <th className="py-2 px-3 font-medium">CO₂ (ppm)</th>
                  <th className="py-2 px-3 font-medium">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {previewRows.map((r) => {
                  const isCrit = r.co2Ppm > 1000;
                  return (
                    <tr key={r.id} className={isCrit ? 'bg-red-50/40' : 'bg-white'}>
                      <td className="py-2 px-3 font-mono font-semibold text-slate-800">
                        {r.sensorCode}
                      </td>
                      <td className="py-2 px-3">
                        <div className="font-medium text-slate-900">{r.buildingName}</div>
                        <div className="text-slate-500 text-[11px]">{r.room}</div>
                      </td>
                      <td className="py-2 px-3 font-mono text-blue-700 font-semibold">
                        {r.temperatureC.toFixed(1)}°C{' '}
                        <span className="text-slate-400 font-normal">
                          / {r.targetTempC.toFixed(1)}°C
                        </span>
                      </td>
                      <td className="py-2 px-3 font-mono font-semibold">
                        <span
                          className={`px-2 py-0.5 rounded ${
                            isCrit
                              ? 'bg-red-100 text-red-700 border border-red-300'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {r.co2Ppm} ppm
                        </span>
                      </td>
                      <td className="py-2 px-3">
                        {isCrit ? (
                          <span className="text-red-600 font-semibold text-[11px]">
                            Alerte Critique (&gt;1000 ppm)
                          </span>
                        ) : (
                          <span className="text-emerald-600 font-medium text-[11px]">
                            Optimal
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-200">
          <span className="text-xs text-slate-500">
            Les mesures importées mettront à jour instantanément le tableau de supervision.
          </span>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleConfirmImport}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              Injecter {previewRows.length} mesures dans la supervision
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
