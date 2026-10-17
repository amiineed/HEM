import { useMemo, useState } from 'react';
import {
  Building2,
  ChevronDown,
  Database,
  Download,
  FileSpreadsheet,
  Radio,
  Thermometer,
  Waves,
  Wind,
} from 'lucide-react';

interface ArchiveRow {
  recordedAt: string;
  elapsedMs: number;
  sensor: string;
  co2: number;
  temperature: number;
  humidity: number;
  source: 'CSV_IMPORT';
}

const archiveRows: ArchiveRow[] = [
  ['2026-10-15 14:20:37', 102223, 1272, 22.4, 68],
  ['2026-10-15 14:21:07', 132503, 1275, 22.6, 70],
  ['2026-10-15 14:21:38', 162624, 1288, 23.2, 71],
  ['2026-10-15 14:22:08', 192778, 1294, 23.8, 70],
  ['2026-10-15 14:22:38', 222931, 1302, 24.2, 69],
  ['2026-10-15 14:23:09', 253287, 1310, 24.6, 69],
  ['2026-10-15 14:23:39', 283442, 1318, 24.9, 68],
  ['2026-10-15 14:24:09', 313598, 1325, 25.1, 68],
  ['2026-10-15 14:24:40', 344003, 1331, 25.3, 67],
  ['2026-10-15 14:25:10', 374159, 1338, 25.5, 67],
  ['2026-10-15 14:25:40', 404315, 1344, 25.7, 67],
  ['2026-10-15 14:26:11', 434721, 1350, 25.9, 66],
  ['2026-10-15 14:26:41', 464876, 1356, 26.1, 66],
  ['2026-10-15 14:27:11', 495032, 1362, 26.3, 66],
  ['2026-10-15 14:27:42', 525438, 1369, 26.4, 65],
  ['2026-10-15 14:28:12', 555594, 1375, 26.5, 65],
  ['2026-10-15 14:28:42', 585750, 1381, 26.6, 65],
  ['2026-10-15 14:29:13', 616156, 1386, 26.7, 64],
  ['2026-10-15 14:29:42', 647254, 1390, 26.8, 64],
  ['2026-10-15 14:30:12', 677380, 1396, 26.8, 64],
  ['2026-10-15 14:30:43', 707869, 1403, 26.9, 63],
  ['2026-10-15 14:31:13', 738003, 1410, 26.9, 63],
].map(([recordedAt, elapsedMs, co2, temperature, humidity]) => ({
  recordedAt: String(recordedAt),
  elapsedMs: Number(elapsedMs),
  sensor: 'Capteur Prototype #1',
  co2: Number(co2),
  temperature: Number(temperature),
  humidity: Number(humidity),
  source: 'CSV_IMPORT' as const,
}));

const shell = 'rounded-xl border border-slate-200 bg-white shadow-xs';

function HistoryChart({ rows }: { rows: ArchiveRow[] }) {
  const safeRows = rows?.length ? rows : [];
  const width = 920;
  const height = 300;
  const left = 54;
  const right = 22;
  const top = 20;
  const trackHeight = 62;
  const gap = 26;
  const plotWidth = width - left - right;
  const x = (index: number) => left + (index / Math.max(1, safeRows.length - 1)) * plotWidth;
  const scale = (value: number, min: number, max: number, track: number) =>
    top + track * (trackHeight + gap) + trackHeight - ((value - min) / Math.max(1, max - min)) * trackHeight;
  const pathFor = (key: 'co2' | 'temperature' | 'humidity', min: number, max: number, track: number) =>
    safeRows
      .map((row, index) => `${index === 0 ? 'M' : 'L'} ${x(index).toFixed(1)} ${scale(row?.[key] ?? min, min, max, track).toFixed(1)}`)
      .join(' ');

  return (
    <div className={`${shell} overflow-hidden`}>
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <div>
          <p className="text-sm font-semibold text-slate-900">Évolution temporelle</p>
          <p className="mt-0.5 text-[11px] text-slate-500">22 mesures · 15/10/2026 de 14:20:37 à 14:31:13</p>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-semibold">
          <span className="flex items-center gap-1.5 text-red-700"><span className="size-2 rounded-full bg-red-500" /> CO₂ (ppm)</span>
          <span className="flex items-center gap-1.5 text-blue-700"><span className="size-2 rounded-full bg-blue-500" /> Température (°C)</span>
          <span className="flex items-center gap-1.5 text-teal-700"><span className="size-2 rounded-full bg-teal-500" /> Humidité (%)</span>
        </div>
      </div>
      <div className="h-80 px-4 py-3">
        {safeRows.length === 0 ? (
          <div className="flex h-full items-center justify-center text-xs text-slate-400">Aucune mesure disponible.</div>
        ) : (
          <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" role="img" aria-label="Évolution du CO2, de la température et de l’humidité">
            {[
              { label: 'CO₂', unit: 'ppm', track: 0, color: '#dc2626', values: ['1 410', '1 341', '1 272'] },
              { label: 'Temp.', unit: '°C', track: 1, color: '#2563eb', values: ['26.9', '25.5', '22.4'] },
              { label: 'Hum.', unit: '%', track: 2, color: '#0d9488', values: ['71', '66.5', '63'] },
            ].map((item) => {
              const trackTop = top + item.track * (trackHeight + gap);
              return (
                <g key={item.label}>
                  <rect x={left} y={trackTop} width={plotWidth} height={trackHeight} rx="6" fill="#f8fafc" />
                  {[0, 0.5, 1].map((part, index) => (
                    <g key={part}>
                      <line x1={left} x2={width - right} y1={trackTop + part * trackHeight} y2={trackTop + part * trackHeight} stroke="#e2e8f0" strokeDasharray="3 5" />
                      <text x={left - 7} y={trackTop + part * trackHeight + 3} textAnchor="end" className="fill-slate-400 text-[8px] font-mono">{item.values[index]}</text>
                    </g>
                  ))}
                  <text x="0" y={trackTop + 12} fill={item.color} className="text-[10px] font-semibold">{item.label}</text>
                  <text x="0" y={trackTop + 25} className="fill-slate-400 text-[8px]">{item.unit}</text>
                </g>
              );
            })}
            <path d={pathFor('co2', 1270, 1415, 0)} fill="none" stroke="#dc2626" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            <path d={pathFor('temperature', 22, 27.2, 1)} fill="none" stroke="#2563eb" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            <path d={pathFor('humidity', 62, 72, 2)} fill="none" stroke="#0d9488" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            <text x={left} y={height - 4} className="fill-slate-500 text-[9px] font-mono">14:20:37</text>
            <text x={left + plotWidth / 2} y={height - 4} textAnchor="middle" className="fill-slate-400 text-[9px] font-mono">14:25:55</text>
            <text x={width - right} y={height - 4} textAnchor="end" className="fill-slate-500 text-[9px] font-mono">14:31:13</text>
          </svg>
        )}
      </div>
    </div>
  );
}

export function HistoryMeasurementsScreen() {
  const [source, setSource] = useState('all');
  const filteredRows = useMemo(
    () => source === 'all' || source === 'CSV_IMPORT' ? archiveRows : [],
    [source],
  );

  const handleExport = () => {
    const header = 'recorded_at,elapsed_ms,sensor,co2_ppm,temperature_c,humidity_pct,source';
    const lines = archiveRows.map((row) =>
      [
        row?.recordedAt ?? '',
        row?.elapsedMs ?? 0,
        row?.sensor ?? 'Capteur Prototype #1',
        row?.co2 ?? 0,
        row?.temperature ?? 0,
        row?.humidity ?? 0,
        row?.source ?? 'CSV_IMPORT',
      ].join(','),
    );
    const blob = new Blob([[header, ...lines].join('\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'historique_capteur_prototype_1.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const stats = [
    { label: 'CO₂', icon: Wind, tone: 'red', min: '1 272 ppm', average: '1 341 ppm', max: '1 410 ppm' },
    { label: 'Température', icon: Thermometer, tone: 'blue', min: '22.4 °C', average: '25.5 °C', max: '26.9 °C' },
    { label: 'Humidité', icon: Waves, tone: 'teal', min: '63.0 %', average: '66.5 %', max: '71.0 %' },
  ];
  const tones: Record<string, string> = {
    red: 'bg-red-50 text-red-600',
    blue: 'bg-blue-50 text-blue-600',
    teal: 'bg-teal-50 text-teal-600',
  };

  return (
    <div className="space-y-5">
      <div className={`${shell} flex items-center gap-3 p-3`}>
        <div className="relative min-w-60 flex-1">
          <Radio className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-emerald-600" />
          <select disabled className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-8 text-xs font-semibold text-slate-700">
            <option>Capteur Prototype #1 (SENS-01)</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
        </div>
        <div className="relative min-w-64 flex-1">
          <Building2 className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
          <select disabled className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-8 text-xs font-semibold text-slate-700">
            <option>Salle de Sport Pilote (BAT-HEM-01)</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
        </div>
        <div className="relative min-w-48">
          <Database className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
          <select value={source} onChange={(event) => setSource(event.target.value)} className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-9 pr-8 text-xs font-medium text-slate-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100">
            <option value="all">Toutes les sources</option>
            <option value="CSV_IMPORT">CSV_IMPORT</option>
            <option value="LORA_GATEWAY">LORA_GATEWAY</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
        </div>
        <button onClick={handleExport} className="flex h-10 shrink-0 items-center gap-2 rounded-lg bg-emerald-600 px-4 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700">
          <Download className="size-3.5" /> Exporter en CSV
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className={`${shell} p-4`}>
              <div className="flex items-center gap-3">
                <div className={`flex size-9 items-center justify-center rounded-lg ${tones[stat.tone]}`}><Icon className="size-4" /></div>
                <div><p className="text-xs font-semibold text-slate-800">{stat.label}</p><p className="mt-0.5 text-[10px] text-slate-400">Résumé des 22 mesures</p></div>
              </div>
              <div className="mt-4 grid grid-cols-3 divide-x divide-slate-200 rounded-lg bg-slate-50 py-2.5 text-center">
                <div><p className="text-[9px] uppercase tracking-wide text-slate-400">Min</p><p className="mt-1 font-mono text-[11px] font-semibold text-slate-700">{stat.min}</p></div>
                <div><p className="text-[9px] uppercase tracking-wide text-slate-400">Moyenne</p><p className="mt-1 font-mono text-[11px] font-semibold text-slate-900">{stat.average}</p></div>
                <div><p className="text-[9px] uppercase tracking-wide text-slate-400">Max</p><p className="mt-1 font-mono text-[11px] font-semibold text-slate-700">{stat.max}</p></div>
              </div>
            </div>
          );
        })}
      </div>

      <HistoryChart rows={filteredRows} />

      <div className={`${shell} overflow-hidden`}>
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div><p className="text-sm font-semibold text-slate-900">Archives télémétriques</p><p className="mt-0.5 text-[11px] text-slate-500">Historique complet du fichier mesures_capteurs 1.csv</p></div>
          <span className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1.5 text-[10px] font-medium text-slate-600"><FileSpreadsheet className="size-3.5" /> {filteredRows?.length ?? 0} lignes affichées</span>
        </div>
        <div className="max-h-[470px] overflow-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead className="sticky top-0 z-10">
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500">
                <th className="px-4 py-3 font-medium">Horodatage <span className="font-mono text-[9px] text-slate-400">(recorded_at)</span></th>
                <th className="px-4 py-3 font-medium">Temps capteur <span className="font-mono text-[9px] text-slate-400">(elapsed_ms)</span></th>
                <th className="px-4 py-3 font-medium">Capteur</th>
                <th className="px-4 py-3 font-medium">CO₂ (ppm)</th>
                <th className="px-4 py-3 font-medium">Température (°C)</th>
                <th className="px-4 py-3 font-medium">Humidité (%)</th>
                <th className="px-4 py-3 font-medium">Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(filteredRows ?? []).map((row, index) => (
                <tr key={`${row?.recordedAt ?? 'row'}-${index}`} className="hover:bg-slate-50/70">
                  <td className="px-4 py-3 font-mono text-[10px] font-medium text-slate-700">{row?.recordedAt ?? '—'}</td>
                  <td className="px-4 py-3 font-mono text-[10px] text-slate-500">{(row?.elapsedMs ?? 0).toLocaleString('fr-FR')} ms</td>
                  <td className="px-4 py-3"><p className="whitespace-nowrap text-[11px] font-semibold text-slate-800">{row?.sensor ?? 'Capteur Prototype #1'}</p><p className="mt-0.5 font-mono text-[9px] text-slate-400">SENS-01</p></td>
                  <td className="px-4 py-3 font-mono text-[11px] font-semibold text-red-700">{row?.co2 ?? 0} ppm</td>
                  <td className="px-4 py-3 font-mono text-[11px] font-semibold text-blue-700">{(row?.temperature ?? 0).toFixed(1)} °C</td>
                  <td className="px-4 py-3 font-mono text-[11px] font-semibold text-teal-700">{(row?.humidity ?? 0).toFixed(1)} %</td>
                  <td className="px-4 py-3"><span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2 py-1 font-mono text-[9px] font-semibold text-slate-600"><Database className="size-3" /> {row?.source ?? 'CSV_IMPORT'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredRows.length === 0 && <div className="p-10 text-center text-xs text-slate-400">Aucune mesure pour la source sélectionnée.</div>}
        </div>
      </div>
    </div>
  );
}
