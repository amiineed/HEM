import { AlertTriangle, Database, FileSpreadsheet, Flame, Radio, Thermometer, Waves, Wind } from 'lucide-react';
import type { Sensor, SensorMeasurements } from '../api';

interface Props {
  sensor: Sensor | null;
  detail: SensorMeasurements | null;
  onImport: () => void;
}

const shell = 'rounded-xl border border-slate-200 bg-white shadow-xs';
const formatDate = (value: string) => new Date(value).toLocaleString('fr-FR');

export function SensorSupervisionDashboard({ sensor, detail, onImport }: Props) {
  const latest = detail?.measurements.at(-1);
  const stats = detail?.stats;
  if (!sensor || !detail) return <div className={`${shell} p-10 text-center text-sm text-slate-500`}>Chargement des données du capteur…</div>;

  return (
    <div className="space-y-5">
      <section className={`${shell} p-5`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-slate-950 text-emerald-400"><Radio className="size-5" /></div>
            <div><p className="text-base font-semibold text-slate-950">{sensor.name}</p><p className="mt-1 text-xs text-slate-500">{sensor.room_name} · {sensor.id} · {sensor.status}</p></div>
          </div>
          <button onClick={onImport} className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700">Remplacer le CSV</button>
        </div>
        <div className="mt-4 flex flex-wrap gap-5 border-t border-slate-100 pt-3 text-[11px] text-slate-500">
          <span><FileSpreadsheet className="mr-1 inline size-3.5 text-emerald-600" />{detail.measurements.length} mesures enregistrées</span>
          {latest && <span>Dernière mesure : {formatDate(latest.recorded_at)}</span>}
        </div>
      </section>

      <div className="grid grid-cols-4 gap-4">
        {[
          ['CO₂ actuel', latest ? `${latest.co2_ppm} ppm` : '—', stats?.co2_ppm.average ? `Moyenne ${stats.co2_ppm.average.toFixed(0)} ppm` : '—', Wind, latest && latest.co2_ppm > 1000],
          ['Température', latest ? `${latest.temperature_c.toFixed(1)} °C` : '—', `Consigne ${sensor.target_temp_c.toFixed(1)} °C`, Thermometer, false],
          ['Humidité', latest ? `${latest.humidity_pct.toFixed(1)} %` : '—', stats?.humidity_pct.average ? `Moyenne ${stats.humidity_pct.average.toFixed(1)} %` : '—', Waves, false],
          ['Chauffage', detail.heating_decision.heating_should_run ? 'EN MARCHE' : 'COUPÉ', detail.heating_decision.energy_saving_active ? 'Économie active · objectif -30%' : 'Commande active', Flame, false],
        ].map(([label, value, sub, Icon, critical]) => (
          <div key={String(label)} className={`${shell} p-4`}>
            <p className="text-xs font-semibold text-slate-600">{label as string}</p>
            <div className={`mt-3 flex items-center gap-2 text-2xl font-semibold ${critical ? 'text-red-700' : 'text-slate-950'}`}><Icon className="size-5" />{value as string}</div>
            <p className="mt-2 text-[10px] text-slate-500">{sub as string}</p>
          </div>
        ))}
      </div>

      {detail.heating_decision.air_quality_alert === 'CRITICAL' && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700"><AlertTriangle className="mr-2 inline size-4" />Alerte qualité d’air : CO₂ supérieur à 1 000 ppm.</div>
      )}

      <section className={`${shell} overflow-hidden`}>
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4"><div><p className="text-sm font-semibold text-slate-900">Mesures réelles</p><p className="mt-1 text-[11px] text-slate-500">Données récupérées depuis le backend</p></div><span className="text-xs text-slate-500"><Database className="mr-1 inline size-3.5" />{detail.measurements.length} lignes</span></div>
        <div className="max-h-96 overflow-auto">
          <table className="w-full text-left text-xs"><thead className="sticky top-0 bg-slate-50 text-slate-500"><tr>{['Horodatage','Temps capteur','CO₂','Température','Humidité'].map((heading) => <th key={heading} className="px-5 py-3 font-medium">{heading}</th>)}</tr></thead>
            <tbody className="divide-y divide-slate-100">{[...detail.measurements].reverse().map((measurement) => <tr key={measurement.id}><td className="px-5 py-3 font-mono">{formatDate(measurement.recorded_at)}</td><td className="px-5 py-3 font-mono">{measurement.elapsed_ms} ms</td><td className="px-5 py-3 font-mono font-semibold text-red-700">{measurement.co2_ppm} ppm</td><td className="px-5 py-3 font-mono text-blue-700">{measurement.temperature_c.toFixed(1)} °C</td><td className="px-5 py-3 font-mono text-teal-700">{measurement.humidity_pct.toFixed(1)} %</td></tr>)}</tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
