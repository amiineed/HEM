import { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Database,
  Eye,
  EyeOff,
  FileSpreadsheet,
  Flame,
  Gauge,
  Link2,
  Radio,
  Thermometer,
  Waves,
  Wind,
} from 'lucide-react';

interface SensorSupervisionDashboardProps {
  onImport: () => void;
}

const rows = [
  {
    recordedAt: '2026-10-15 14:31:13',
    elapsedMs: '738003 ms',
    co2: 1410,
    temperature: '26.9 °C',
    humidity: '63.0 %',
  },
  {
    recordedAt: '2026-10-15 14:30:43',
    elapsedMs: '707869 ms',
    co2: 1403,
    temperature: '26.9 °C',
    humidity: '63.0 %',
  },
  {
    recordedAt: '2026-10-15 14:30:12',
    elapsedMs: '677380 ms',
    co2: 1396,
    temperature: '26.8 °C',
    humidity: '64.0 %',
  },
  {
    recordedAt: '2026-10-15 14:29:42',
    elapsedMs: '647254 ms',
    co2: 1390,
    temperature: '26.8 °C',
    humidity: '64.0 %',
  },
  {
    recordedAt: '2026-10-15 14:20:37',
    elapsedMs: '102223 ms',
    co2: 1272,
    temperature: '22.4 °C',
    humidity: '68.0 %',
  },
];

const shell = 'rounded-xl border border-slate-200 bg-white shadow-xs';

function ActiveSensorHeader({ onImport }: SensorSupervisionDashboardProps) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_minmax(260px,0.34fr)] gap-4">
      <div className={`${shell} overflow-hidden`}>
        <div className="flex items-center gap-4 p-5">
          <div className="relative flex size-12 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-emerald-400">
            <Radio className="size-5" />
            <span className="absolute -right-0.5 -top-0.5 size-3 rounded-full border-2 border-white bg-emerald-500" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3">
              <p className="truncate text-base font-semibold text-slate-950">Capteur Prototype #1 <span className="font-medium text-slate-500">(Wemos D1 Mini)</span></p>
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                Actif - Alimenté par CSV
              </span>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] text-slate-500">
              <span className="flex items-center gap-1.5">
                <FileSpreadsheet className="size-3.5 text-emerald-600" />
                Fichier chargé :
                <strong className="font-mono font-semibold text-slate-700">mesures_capteurs 1.csv</strong>
                <span className="text-slate-400">(22 mesures valides)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock3 className="size-3.5 text-slate-400" />
                Période :
                <strong className="font-medium text-slate-700">15 oct. 2026 (14:20:37 à 14:31:13)</strong>
              </span>
            </div>
          </div>
          <button
            onClick={onImport}
            className="shrink-0 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] font-semibold text-slate-600 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
          >
            Remplacer le CSV
          </button>
        </div>
        <div className="flex items-center gap-2 border-t border-slate-100 bg-slate-50/70 px-5 py-2.5 text-[10px] text-slate-500">
          <Database className="size-3.5 text-slate-400" />
          Source active : <span className="font-mono font-semibold text-slate-700">CSV_IMPORT</span>
          <span className="text-slate-300">•</span>
          Dernière mesure enregistrée le 15/10/2026 à 14:31:13
        </div>
      </div>

      <button className="group flex min-h-32 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-5 text-left transition hover:border-emerald-400 hover:bg-emerald-50/70">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 transition group-hover:border-emerald-200 group-hover:text-emerald-600">
            <Link2 className="size-4.5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-700 group-hover:text-emerald-800">+ Associer un nouveau capteur</p>
            <p className="mt-1 text-[10px] leading-4 text-slate-400">Évolution future Base de données</p>
          </div>
        </div>
      </button>
    </div>
  );
}

function KpiCards() {
  return (
    <div className="grid grid-cols-4 gap-4">
      <div className={`${shell} relative overflow-hidden p-4`}>
        <div className="absolute inset-x-0 top-0 h-0.5 bg-red-500" />
        <div className="flex items-start justify-between">
          <p className="text-xs font-semibold text-slate-600">Dernier CO₂ mesuré</p>
          <div className="flex size-8 items-center justify-center rounded-lg bg-red-50 text-red-600"><Wind className="size-4" /></div>
        </div>
        <p className="mt-3 text-2xl font-semibold tracking-tight text-red-700">1 410 ppm</p>
        <p className="mt-1.5 text-[10px] font-medium text-slate-500">Moyenne: 1 341 ppm</p>
        <div className="mt-3 flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-2 py-1.5 text-[10px] font-semibold text-red-700">
          <AlertTriangle className="size-3" /> Alerte Critique &gt; 1000 ppm
        </div>
      </div>

      <div className={`${shell} relative overflow-hidden p-4`}>
        <div className="absolute inset-x-0 top-0 h-0.5 bg-blue-500" />
        <div className="flex items-start justify-between">
          <p className="text-xs font-semibold text-slate-600">Température mesurée</p>
          <div className="flex size-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600"><Thermometer className="size-4" /></div>
        </div>
        <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">26.9 °C</p>
        <p className="mt-1.5 text-[10px] font-medium text-slate-500">Hausse de 22.4 °C à 26.9 °C en 10 min</p>
        <div className="mt-5 flex items-center gap-2 text-[10px] font-medium text-blue-700">
          <span className="size-2 rounded-full bg-blue-500" /> Dernière valeur du fichier CSV
        </div>
      </div>

      <div className={`${shell} relative overflow-hidden p-4`}>
        <div className="absolute inset-x-0 top-0 h-0.5 bg-teal-500" />
        <div className="flex items-start justify-between">
          <p className="text-xs font-semibold text-slate-600">Humidité relative</p>
          <div className="flex size-8 items-center justify-center rounded-lg bg-teal-50 text-teal-600"><Waves className="size-4" /></div>
        </div>
        <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">63.0 %</p>
        <p className="mt-1.5 text-[10px] font-medium leading-4 text-slate-500">Baisse de 71.0 % à 63.0 %</p>
        <div className="mt-3 flex items-center gap-2 text-[10px] font-medium text-teal-700">
          <span className="size-2 rounded-full bg-teal-500" /> Mesure hygrométrique valide
        </div>
      </div>

      <div className={`${shell} relative overflow-hidden p-4`}>
        <div className="absolute inset-x-0 top-0 h-0.5 bg-emerald-500" />
        <div className="flex items-start justify-between">
          <p className="text-xs font-semibold text-slate-600">État Chauffage <span className="text-emerald-700">(Objectif -30%)</span></p>
          <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600"><Flame className="size-4" /></div>
        </div>
        <div className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-1.5 text-[11px] font-bold text-emerald-800">
          <CheckCircle2 className="size-3.5" /> ARRÊT AUTOMATIQUE
        </div>
        <p className="mt-3 text-[10px] leading-4 text-slate-500">Consigne <strong className="text-slate-700">19.0 °C</strong> largement dépassée</p>
        <div className="mt-2 flex items-center gap-1.5 text-[10px] font-semibold text-emerald-700"><Gauge className="size-3" /> Économie d’énergie active</div>
      </div>
    </div>
  );
}

function TimeSeriesChart() {
  const tracks = [
    {
      label: 'CO₂',
      unit: 'ppm',
      color: '#dc2626',
      fill: '#fef2f2',
      top: 22,
      values: '58,87 123,82 188,77 253,72 318,68 383,63 448,58 513,53 578,48 643,42 708,37 773,32',
      min: '1 272',
      max: '1 410',
    },
    {
      label: 'Température',
      unit: '°C',
      color: '#2563eb',
      fill: '#eff6ff',
      top: 146,
      values: '58,226 123,218 188,207 253,198 318,188 383,180 448,173 513,166 578,160 643,155 708,152 773,150',
      min: '22.4',
      max: '26.9',
    },
    {
      label: 'Humidité',
      unit: '%',
      color: '#0d9488',
      fill: '#f0fdfa',
      top: 270,
      values: '58,291 123,296 188,302 253,309 318,315 383,321 448,329 513,335 578,342 643,350 708,357 773,363',
      min: '63',
      max: '71',
    },
  ];

  return (
    <div className={`${shell} overflow-hidden`}>
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <div>
          <p className="text-sm font-semibold text-slate-900">Évolution des mesures</p>
          <p className="mt-0.5 text-[11px] text-slate-500">3 séries synchronisées · 15/10/2026 de 14:20:37 à 14:31:13</p>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-medium">
          <span className="flex items-center gap-1.5 text-red-700"><span className="size-2 rounded-full bg-red-500" /> CO₂</span>
          <span className="flex items-center gap-1.5 text-blue-700"><span className="size-2 rounded-full bg-blue-500" /> Température</span>
          <span className="flex items-center gap-1.5 text-teal-700"><span className="size-2 rounded-full bg-teal-500" /> Humidité</span>
        </div>
      </div>
      <div className="px-5 py-4">
        <svg viewBox="0 0 820 405" className="h-[405px] w-full" role="img" aria-label="Courbes CO2, température et humidité du capteur prototype">
          {tracks.map((track, index) => (
            <g key={track.label}>
              <rect x="46" y={track.top} width="742" height="96" rx="8" fill={track.fill} />
              {[0, 1, 2].map((line) => (
                <line
                  key={line}
                  x1="58"
                  x2="773"
                  y1={track.top + 16 + line * 32}
                  y2={track.top + 16 + line * 32}
                  stroke="#cbd5e1"
                  strokeDasharray="3 5"
                  opacity="0.7"
                />
              ))}
              <text x="0" y={track.top + 20} fill={track.color} className="text-[11px] font-semibold">{track.label}</text>
              <text x="0" y={track.top + 35} className="fill-slate-400 text-[9px]">{track.unit}</text>
              <text x="782" y={track.top + 18} className="fill-slate-400 text-[9px] font-mono">{track.max}</text>
              <text x="782" y={track.top + 84} className="fill-slate-400 text-[9px] font-mono">{track.min}</text>
              {index === 0 && (
                <>
                  <line x1="58" x2="773" y1="103" y2="103" stroke="#dc2626" strokeDasharray="5 4" />
                  <text x="765" y="98" textAnchor="end" className="fill-red-600 text-[9px] font-semibold">Seuil 1 000 ppm</text>
                </>
              )}
              {index === 1 && (
                <>
                  <line x1="58" x2="773" y1="228" y2="228" stroke="#16a34a" strokeDasharray="5 4" />
                  <text x="765" y="223" textAnchor="end" className="fill-green-600 text-[9px] font-semibold">Consigne 19.0 °C</text>
                </>
              )}
              <polyline points={track.values} fill="none" stroke={track.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="58" cy={index === 0 ? 87 : index === 1 ? 226 : 291} r="3.5" fill={track.color} stroke="white" strokeWidth="2" />
              <circle cx="773" cy={index === 0 ? 32 : index === 1 ? 150 : 363} r="4.5" fill={track.color} stroke="white" strokeWidth="2" />
            </g>
          ))}
          <line x1="58" x2="58" y1="18" y2="372" stroke="#94a3b8" strokeDasharray="3 4" />
          <line x1="773" x2="773" y1="18" y2="372" stroke="#94a3b8" strokeDasharray="3 4" />
          <text x="58" y="396" textAnchor="start" className="fill-slate-500 text-[9px] font-mono">14:20:37</text>
          <text x="415" y="396" textAnchor="middle" className="fill-slate-400 text-[9px] font-mono">14:25:55</text>
          <text x="773" y="396" textAnchor="end" className="fill-slate-500 text-[9px] font-mono">14:31:13</text>
        </svg>
      </div>
    </div>
  );
}

function MeasurementsTable() {
  return (
    <div className={`${shell} overflow-hidden`}>
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <div>
          <p className="text-sm font-semibold text-slate-900">Mesures réelles du fichier CSV</p>
          <p className="mt-0.5 text-[11px] text-slate-500">Valeurs importées sans enrichissement ni données simulées</p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[10px] text-slate-500">
          <FileSpreadsheet className="size-3.5 text-emerald-600" />
          <span className="font-mono font-semibold text-slate-700">mesures_capteurs 1.csv</span>
          <span>• 22 lignes valides</span>
        </div>
      </div>

      <table className="w-full border-collapse text-left text-xs">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500">
            <th className="px-5 py-3 font-medium">Horodatage <span className="font-mono text-[9px] text-slate-400">(recorded_at)</span></th>
            <th className="px-5 py-3 font-medium">Temps capteur <span className="font-mono text-[9px] text-slate-400">(elapsed_ms)</span></th>
            <th className="px-5 py-3 font-medium">CO₂ <span className="text-[9px] text-slate-400">(ppm)</span></th>
            <th className="px-5 py-3 font-medium">Température <span className="text-[9px] text-slate-400">(°C)</span></th>
            <th className="px-5 py-3 font-medium">Humidité <span className="text-[9px] text-slate-400">(%)</span></th>
            <th className="px-5 py-3 font-medium">Source</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row) => (
            <tr key={row.recordedAt} className="transition-colors hover:bg-slate-50/70">
              <td className="px-5 py-4 font-mono text-[11px] font-medium text-slate-700">{row.recordedAt}</td>
              <td className="px-5 py-4 font-mono text-[11px] text-slate-500">{row.elapsedMs}</td>
              <td className="px-5 py-4">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-semibold text-red-700">{row.co2} ppm</span>
                  <span className="rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[9px] font-bold text-red-700">Critique</span>
                </div>
              </td>
              <td className="px-5 py-4 font-mono font-semibold text-blue-700">{row.temperature}</td>
              <td className="px-5 py-4 font-mono font-semibold text-teal-700">{row.humidity}</td>
              <td className="px-5 py-4">
                <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2 py-1 font-mono text-[10px] font-semibold text-slate-600">
                  <Database className="size-3" /> CSV_IMPORT
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50/60 px-5 py-3 text-[10px] text-slate-400">
        <span>5 mesures affichées sur 22 mesures valides</span>
        <span>Données brutes · aucun capteur fictif</span>
      </div>
    </div>
  );
}

export function SensorSupervisionDashboard({ onImport }: SensorSupervisionDashboardProps) {
  const [showEmptyState, setShowEmptyState] = useState(false);

  return (
    <div className="space-y-5">
      <ActiveSensorHeader onImport={onImport} />
      <KpiCards />
      <TimeSeriesChart />
      <MeasurementsTable />
      <div className={`rounded-xl border p-4 ${showEmptyState ? 'border-slate-300 bg-white' : 'border-dashed border-slate-300 bg-slate-50/60'}`}>
        <div className="flex items-center justify-between gap-4">
          {showEmptyState ? (
            <div className="flex flex-1 items-center gap-4 py-2">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-400"><FileSpreadsheet className="size-5" /></div>
              <div>
                <p className="text-sm font-semibold text-slate-800">Aucune mesure importée pour Capteur Prototype #1</p>
                <p className="mt-1 text-xs text-slate-500">Cliquez sur Importer un CSV pour afficher la supervision.</p>
              </div>
              <button onClick={onImport} className="ml-auto rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700">Importer un CSV</button>
            </div>
          ) : (
            <div>
              <p className="text-xs font-semibold text-slate-600">Variante avant import</p>
              <p className="mt-0.5 text-[10px] text-slate-400">Prévisualiser l’état du tableau de bord sans données CSV.</p>
            </div>
          )}
          <button
            onClick={() => setShowEmptyState((current) => !current)}
            className="flex shrink-0 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[11px] font-semibold text-slate-600 hover:bg-slate-50"
          >
            {showEmptyState ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
            {showEmptyState ? 'Masquer la variante' : 'Voir l’état vide'}
          </button>
        </div>
      </div>
    </div>
  );
}
