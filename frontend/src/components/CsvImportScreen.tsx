import { useState } from 'react';
import {
  AlertCircle,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Database,
  FileCheck2,
  FileSpreadsheet,
  Plus,
  Radio,
  ServerCog,
  UploadCloud,
} from 'lucide-react';

interface CsvImportScreenProps {
  onOpenImporter: () => void;
}

const previewRows = [
  {
    recordedAt: '2026-10-15 14:20:37',
    elapsedMs: '102223',
    co2: '1272 ppm',
    temperature: '22.4 °C',
    humidity: '68.0 %',
  },
  {
    recordedAt: '2026-10-15 14:21:07',
    elapsedMs: '132503',
    co2: '1275 ppm',
    temperature: '22.6 °C',
    humidity: '70.0 %',
  },
  {
    recordedAt: '2026-10-15 14:21:38',
    elapsedMs: '162624',
    co2: '1288 ppm',
    temperature: '23.2 °C',
    humidity: '71.0 %',
  },
];

const shell = 'rounded-xl border border-slate-200 bg-white shadow-xs';

function StepHeader({
  step,
  title,
  description,
  complete = false,
}: {
  step: number;
  title: string;
  description: string;
  complete?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className={`flex size-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
        complete ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-white'
      }`}>
        {complete ? <Check className="size-4" /> : step}
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        <p className="mt-0.5 text-[11px] text-slate-500">{description}</p>
      </div>
    </div>
  );
}

export function CsvImportScreen({ onOpenImporter }: CsvImportScreenProps) {
  const [target, setTarget] = useState<'existing' | 'new'>('existing');

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-5">
        <section className={`${shell} p-5`}>
          <StepHeader
            step={1}
            title="Choix du capteur cible"
            description="Associer les mesures CSV au bon équipement."
            complete={target === 'existing'}
          />

          <div className="mt-5 space-y-3">
            <label className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition ${
              target === 'existing'
                ? 'border-emerald-300 bg-emerald-50/70 ring-1 ring-emerald-100'
                : 'border-slate-200 hover:bg-slate-50'
            }`}>
              <input
                type="radio"
                name="sensor-target"
                value="existing"
                checked={target === 'existing'}
                onChange={() => setTarget('existing')}
                className="size-4 accent-emerald-600"
              />
              <div className={`flex size-10 items-center justify-center rounded-xl ${
                target === 'existing' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'
              }`}>
                <Radio className="size-4.5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-xs font-semibold text-slate-900">Capteur Prototype #1</p>
                  <span className="rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[9px] font-semibold text-slate-500">Wemos D1 Mini</span>
                </div>
                <p className="mt-1 text-[10px] text-slate-500">Seul capteur actuellement configuré</p>
              </div>
              {target === 'existing' && <CheckCircle2 className="size-5 text-emerald-600" />}
            </label>

            <label className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition ${
              target === 'new'
                ? 'border-blue-300 bg-blue-50/70 ring-1 ring-blue-100'
                : 'border-dashed border-slate-300 bg-slate-50/50 hover:border-slate-400'
            }`}>
              <input
                type="radio"
                name="sensor-target"
                value="new"
                checked={target === 'new'}
                onChange={() => setTarget('new')}
                className="size-4 accent-blue-600"
              />
              <div className="flex size-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400">
                <Plus className="size-4.5" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-slate-700">Créer un nouveau capteur</p>
                <p className="mt-1 text-[10px] text-slate-500">Pour préparer la future base de données</p>
              </div>
              <Database className="size-4 text-slate-400" />
            </label>
          </div>

          {target === 'new' && (
            <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2.5 text-[10px] leading-4 text-blue-700">
              Cette option prépare le futur rattachement en base de données. Aucun nouveau capteur fictif n’est créé dans la supervision actuelle.
            </div>
          )}
        </section>

        <section className={`${shell} p-5`}>
          <StepHeader
            step={2}
            title="Fichier téléversé"
            description="Détection automatique du format et du schéma."
            complete
          />

          <button
            onClick={onOpenImporter}
            className="mt-5 flex w-full items-center gap-4 rounded-xl border-2 border-dashed border-emerald-300 bg-emerald-50/50 p-5 text-left transition hover:bg-emerald-50"
          >
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-xs ring-1 ring-emerald-100">
              <FileSpreadsheet className="size-6" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-semibold text-slate-900">mesures_capteurs 1.csv</p>
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-white px-2 py-0.5 text-[9px] font-bold text-emerald-700">
                  <FileCheck2 className="size-3" /> CHARGÉ
                </span>
              </div>
              <p className="mt-1 text-[11px] text-slate-500">22 lignes détectées · UTF-8 · import prêt</p>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-semibold text-emerald-700">
              <UploadCloud className="size-4" /> Remplacer
            </div>
          </button>

          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-950 p-4">
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.13em] text-slate-400">
                <CircleDot className="size-3.5 text-emerald-400" /> Format détecté
              </p>
              <span className="font-mono text-[9px] text-emerald-400">SCHEMA_OK</span>
            </div>
            <p className="mt-3 text-xs font-medium text-slate-100">5 colonnes sans en-tête</p>
            <p className="mt-2 break-words font-mono text-[10px] leading-5 text-slate-400">
              recorded_at, elapsed_ms, co2_ppm, temperature_c, humidity_pct
            </p>
          </div>
        </section>
      </div>

      <section className={`${shell} overflow-hidden`}>
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <StepHeader
            step={3}
            title="Résultat de validation Backend"
            description="Contrôle des types, du format et de l’intégrité des mesures."
            complete
          />
          <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-[10px] font-semibold text-emerald-700">
            <ServerCog className="size-3.5" /> Validation terminée avec succès
          </div>
        </div>

        <div className="grid grid-cols-4 gap-px border-b border-slate-200 bg-slate-200">
          <div className="bg-white p-4">
            <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">Lignes lues</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">22</p>
            <p className="mt-1 text-[10px] text-slate-500">Total du fichier</p>
          </div>
          <div className="bg-emerald-50/60 p-4">
            <p className="text-[10px] font-medium uppercase tracking-wide text-emerald-600">Mesures valides importées</p>
            <p className="mt-2 text-2xl font-semibold text-emerald-700">22</p>
            <p className="mt-1 flex items-center gap-1 text-[10px] text-emerald-600"><CheckCircle2 className="size-3" /> 100% acceptées</p>
          </div>
          <div className="bg-amber-50/60 p-4">
            <p className="text-[10px] font-medium uppercase tracking-wide text-amber-600">Doublons ignorés</p>
            <p className="mt-2 text-2xl font-semibold text-amber-700">0</p>
            <p className="mt-1 text-[10px] text-amber-600">Aucun doublon détecté</p>
          </div>
          <div className="bg-red-50/60 p-4">
            <p className="text-[10px] font-medium uppercase tracking-wide text-red-600">Lignes rejetées</p>
            <p className="mt-2 text-2xl font-semibold text-red-700">0</p>
            <p className="mt-1 flex items-center gap-1 text-[10px] text-red-600"><AlertCircle className="size-3" /> HTML / erreurs</p>
          </div>
        </div>

        <div className="flex items-center justify-between px-5 py-3">
          <div>
            <p className="text-xs font-semibold text-slate-800">Aperçu des 3 premières lignes</p>
            <p className="mt-0.5 text-[10px] text-slate-500">Données brutes avant insertion dans la supervision</p>
          </div>
          <span className="flex items-center gap-1 text-[10px] font-medium text-slate-400">Capteur Prototype #1 <ChevronRight className="size-3" /> CSV_IMPORT</span>
        </div>

        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="border-y border-slate-200 bg-slate-50/80 text-slate-500">
              <th className="px-5 py-3 font-medium">Horodatage <span className="font-mono text-[9px] text-slate-400">(recorded_at)</span></th>
              <th className="px-5 py-3 font-medium">Temps capteur <span className="font-mono text-[9px] text-slate-400">(elapsed_ms)</span></th>
              <th className="px-5 py-3 font-medium">CO₂ <span className="text-[9px] text-slate-400">(ppm)</span></th>
              <th className="px-5 py-3 font-medium">Température <span className="text-[9px] text-slate-400">(°C)</span></th>
              <th className="px-5 py-3 font-medium">Humidité <span className="text-[9px] text-slate-400">(%)</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {previewRows.map((row, index) => (
              <tr key={row.recordedAt} className="hover:bg-slate-50/70">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <span className="flex size-5 items-center justify-center rounded bg-slate-100 text-[9px] font-semibold text-slate-500">{index + 1}</span>
                    <span className="font-mono text-[11px] font-medium text-slate-700">{row.recordedAt}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 font-mono text-[11px] text-slate-600">{row.elapsedMs}</td>
                <td className="px-5 py-3.5 font-mono text-[11px] font-semibold text-red-700">{row.co2}</td>
                <td className="px-5 py-3.5 font-mono text-[11px] font-semibold text-blue-700">{row.temperature}</td>
                <td className="px-5 py-3.5 font-mono text-[11px] font-semibold text-teal-700">{row.humidity}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50/60 px-5 py-3">
          <p className="text-[10px] text-slate-500">22 mesures prêtes à être associées au Capteur Prototype #1.</p>
          <button className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700">
            <Check className="size-3.5" /> Confirmer l’importation
          </button>
        </div>
      </section>
    </div>
  );
}
