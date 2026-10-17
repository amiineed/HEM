import { useMemo, useState } from 'react';
import { Database, Download, FileSpreadsheet, Radio, Thermometer, Waves, Wind } from 'lucide-react';
import type { Sensor, SensorMeasurements } from '../api';

interface Props { sensor: Sensor | null; detail: SensorMeasurements | null; }
const shell = 'rounded-xl border border-slate-200 bg-white shadow-xs';
const formatDate = (value: string) => new Date(value).toLocaleString('fr-FR');

export function HistoryMeasurementsScreen({ sensor, detail }: Props) {
  const [source, setSource] = useState('all');
  const rows = useMemo(() => (detail?.measurements ?? []).filter((item) => source === 'all' || item.data_source === source), [detail, source]);
  const metric = (key: 'co2_ppm' | 'temperature_c' | 'humidity_pct') => {
    const values = rows.map((item) => item[key]);
    return { min: values.length ? Math.min(...values) : null, max: values.length ? Math.max(...values) : null, avg: values.length ? values.reduce((a, b) => a + b, 0) / values.length : null };
  };
  const stats = [
    ['CO₂', Wind, metric('co2_ppm'), 'ppm'],
    ['Température', Thermometer, metric('temperature_c'), '°C'],
    ['Humidité', Waves, metric('humidity_pct'), '%'],
  ] as const;
  const exportCsv = () => {
    const content = ['recorded_at,elapsed_ms,co2_ppm,temperature_c,humidity_pct,data_source', ...rows.map((item) => `${item.recorded_at},${item.elapsed_ms},${item.co2_ppm},${item.temperature_c},${item.humidity_pct},${item.data_source}`)].join('\n');
    const url = URL.createObjectURL(new Blob([content], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = `${sensor?.id ?? 'mesures'}_historique.csv`; link.click(); URL.revokeObjectURL(url);
  };
  if (!sensor || !detail) return <div className={`${shell} p-10 text-center text-sm text-slate-500`}>Chargement de l’historique…</div>;
  return <div className="space-y-5">
    <div className={`${shell} flex items-center gap-3 p-3`}>
      <div className="flex flex-1 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold"><Radio className="size-3.5 text-emerald-600" />{sensor.name} ({sensor.id})</div>
      <select value={source} onChange={(event) => setSource(event.target.value)} className="h-10 rounded-lg border border-slate-200 px-3 text-xs"><option value="all">Toutes les sources</option><option value="CSV_IMPORT">CSV_IMPORT</option><option value="LORA_GATEWAY">LORA_GATEWAY</option></select>
      <button onClick={exportCsv} className="flex h-10 items-center gap-2 rounded-lg bg-emerald-600 px-4 text-xs font-semibold text-white"><Download className="size-3.5" />Exporter en CSV</button>
    </div>
    <div className="grid grid-cols-3 gap-4">{stats.map(([label, Icon, values, unit]) => <div key={label} className={`${shell} p-4`}><div className="flex items-center gap-2 text-xs font-semibold"><Icon className="size-4 text-emerald-600" />{label}</div><div className="mt-4 grid grid-cols-3 text-center text-[10px]"><span>Min<br /><strong>{values.min?.toFixed(1) ?? '—'} {unit}</strong></span><span>Moyenne<br /><strong>{values.avg?.toFixed(1) ?? '—'} {unit}</strong></span><span>Max<br /><strong>{values.max?.toFixed(1) ?? '—'} {unit}</strong></span></div></div>)}</div>
    <section className={`${shell} overflow-hidden`}><div className="flex items-center justify-between border-b border-slate-200 px-5 py-4"><div><p className="text-sm font-semibold">Archives télémétriques</p><p className="mt-1 text-[11px] text-slate-500">Mesures réellement stockées par le backend</p></div><span className="text-xs text-slate-500"><FileSpreadsheet className="mr-1 inline size-3.5" />{rows.length} lignes</span></div><div className="max-h-[520px] overflow-auto"><table className="w-full text-left text-xs"><thead className="sticky top-0 bg-slate-50 text-slate-500"><tr>{['Horodatage','Temps capteur','CO₂','Température','Humidité','Source'].map((heading) => <th key={heading} className="px-4 py-3 font-medium">{heading}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{[...rows].reverse().map((item) => <tr key={item.id}><td className="px-4 py-3 font-mono">{formatDate(item.recorded_at)}</td><td className="px-4 py-3 font-mono">{item.elapsed_ms} ms</td><td className="px-4 py-3 font-mono text-red-700">{item.co2_ppm} ppm</td><td className="px-4 py-3 font-mono text-blue-700">{item.temperature_c.toFixed(1)} °C</td><td className="px-4 py-3 font-mono text-teal-700">{item.humidity_pct.toFixed(1)} %</td><td className="px-4 py-3"><span className="rounded bg-slate-100 px-2 py-1 font-mono text-[10px]"><Database className="mr-1 inline size-3" />{item.data_source}</span></td></tr>)}</tbody></table>{!rows.length && <p className="p-10 text-center text-xs text-slate-400">Aucune mesure disponible.</p>}</div></section>
  </div>;
}
