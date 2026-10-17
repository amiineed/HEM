import { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  CloudCog,
  Flame,
  Gauge,
  Hand,
  Leaf,
  Radio,
  Settings2,
  Thermometer,
  Waves,
  Wind,
} from 'lucide-react';

const shell = 'rounded-xl border border-slate-200 bg-white shadow-xs';

export function HeatingControlScreen() {
  const [mode, setMode] = useState<'auto' | 'manual'>('auto');
  const [occupiedTarget, setOccupiedTarget] = useState(19);
  const [unoccupiedTarget, setUnoccupiedTarget] = useState(15);

  return (
    <div className="space-y-5">
      <section className={`${shell} overflow-hidden`}>
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="relative flex size-10 items-center justify-center rounded-xl bg-slate-950 text-emerald-400">
              <Radio className="size-4.5" />
              <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full border-2 border-white bg-emerald-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Capteur Prototype #1 <span className="font-medium text-slate-500">(Wemos D1 Mini)</span></p>
              <p className="mt-0.5 text-[11px] text-slate-500">État actuel de la pièce · issu du CSV à 14:31:13</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
            <span className="size-1.5 rounded-full bg-emerald-500" /> DONNÉES À JOUR
          </span>
        </div>

        <div className="grid grid-cols-3 divide-x divide-slate-200">
          <div className="flex items-center gap-4 p-5">
            <div className="flex size-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><Thermometer className="size-5" /></div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Température réelle</p>
              <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">26.9 °C</p>
              <p className="mt-1 text-[10px] font-medium text-blue-600">+7.9 °C au-dessus de la consigne</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-5">
            <div className="flex size-11 items-center justify-center rounded-xl bg-red-50 text-red-600"><Wind className="size-5" /></div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">CO₂</p>
              <p className="mt-1 text-2xl font-semibold tracking-tight text-red-700">1 410 ppm</p>
              <p className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-red-600"><AlertTriangle className="size-3" /> Aération requise</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-5">
            <div className="flex size-11 items-center justify-center rounded-xl bg-teal-50 text-teal-600"><Waves className="size-5" /></div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Humidité relative</p>
              <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">63.0 %</p>
              <p className="mt-1 text-[10px] font-medium text-teal-600">Dernière mesure CSV</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] gap-5">
        <section className={`${shell} p-5`}>
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600"><Settings2 className="size-4" /></div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Mode de Pilotage</p>
              <p className="mt-0.5 text-[11px] text-slate-500">Choisir la logique de commande du chauffage.</p>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-100 p-1.5">
            <button
              onClick={() => setMode('auto')}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition ${
                mode === 'auto' ? 'bg-white text-emerald-800 shadow-xs ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <div className={`flex size-8 items-center justify-center rounded-lg ${mode === 'auto' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-200 text-slate-400'}`}>
                <Gauge className="size-4" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold">Mode Automatique</p>
                <p className="mt-0.5 text-[10px] opacity-70">Selon capteur & consigne</p>
              </div>
              <span className={`size-4 rounded-full border-4 ${mode === 'auto' ? 'border-emerald-600 bg-white' : 'border-slate-300'}`} />
            </button>
            <button
              onClick={() => setMode('manual')}
              className={`mt-1 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition ${
                mode === 'manual' ? 'bg-white text-blue-800 shadow-xs ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <div className={`flex size-8 items-center justify-center rounded-lg ${mode === 'manual' ? 'bg-blue-50 text-blue-600' : 'bg-slate-200 text-slate-400'}`}>
                <Hand className="size-4" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold">Mode Manuel</p>
                <p className="mt-0.5 text-[10px] opacity-70">Forçage à distance</p>
              </div>
              <span className={`size-4 rounded-full border-4 ${mode === 'manual' ? 'border-blue-600 bg-white' : 'border-slate-300'}`} />
            </button>
          </div>

          <div className={`mt-4 rounded-lg border px-3 py-2.5 text-[10px] leading-4 ${
            mode === 'auto'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
              : 'border-amber-200 bg-amber-50 text-amber-700'
          }`}>
            {mode === 'auto'
              ? 'Le moteur énergétique compare automatiquement la mesure CSV à la consigne active.'
              : 'Le mode manuel désactive la décision automatique jusqu’au retour en mode automatique.'}
          </div>
        </section>

        <section className={`${shell} p-5`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">Réglage de la Consigne</p>
              <p className="mt-0.5 text-[11px] text-slate-500">Seuils utilisés par le moteur en mode automatique.</p>
            </div>
            <span className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-medium text-slate-500">Plage autorisée : 12–24 °C</span>
          </div>

          <div className="mt-5 space-y-5">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600"><Thermometer className="size-4" /></div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800">Occupation</p>
                    <p className="mt-0.5 text-[10px] text-slate-500">Consigne de confort active</p>
                  </div>
                </div>
                <span className="font-mono text-xl font-semibold text-slate-950">{occupiedTarget.toFixed(1)} °C</span>
              </div>
              <input
                type="range"
                min="12"
                max="24"
                step="0.5"
                value={occupiedTarget}
                onChange={(event) => setOccupiedTarget(Number(event.target.value))}
                className="mt-4 h-1.5 w-full cursor-pointer accent-emerald-600"
              />
              <div className="mt-2 flex justify-between font-mono text-[9px] text-slate-400"><span>12 °C</span><span>19 °C recommandé</span><span>24 °C</span></div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600"><Clock3 className="size-4" /></div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800">Inoccupation</p>
                    <p className="mt-0.5 text-[10px] text-slate-500">Abaissement pour économie d’énergie</p>
                  </div>
                </div>
                <span className="font-mono text-xl font-semibold text-slate-950">{unoccupiedTarget.toFixed(1)} °C</span>
              </div>
              <input
                type="range"
                min="12"
                max="24"
                step="0.5"
                value={unoccupiedTarget}
                onChange={(event) => setUnoccupiedTarget(Number(event.target.value))}
                className="mt-4 h-1.5 w-full cursor-pointer accent-indigo-600"
              />
              <div className="mt-2 flex justify-between font-mono text-[9px] text-slate-400"><span>12 °C</span><span>15 °C éco</span><span>24 °C</span></div>
            </div>
          </div>
        </section>
      </div>

      <section className="relative overflow-hidden rounded-xl border border-emerald-300 bg-emerald-950 p-6 text-white shadow-sm">
        <div className="absolute -right-12 -top-16 size-52 rounded-full bg-emerald-500/10 blur-2xl" />
        <div className="relative flex items-start gap-5">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-300 ring-1 ring-emerald-400/20">
            <Flame className="size-7" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-400">Décision du moteur énergétique</p>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-2 py-1 text-[9px] font-bold text-emerald-300 ring-1 ring-emerald-400/20">
                <CheckCircle2 className="size-3" /> DÉCISION ACTIVE
              </span>
            </div>
            <p className="mt-3 text-xl font-semibold tracking-tight text-white">ORDRE : CHAUFFAGE COUPÉ</p>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-emerald-100/80">
              La température mesurée par le capteur (<strong className="text-white">26.9 °C</strong>) dépasse la consigne de <strong className="text-white">19.0 °C</strong> de <strong className="text-emerald-300">+7.9 °C</strong>.
            </p>
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2.5 text-xs font-semibold text-emerald-300 ring-1 ring-white/10">
              <Leaf className="size-4" /> Gain énergétique actif <span className="font-normal text-emerald-100/60">(Objectif -30% vs 2023)</span>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-3 rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
            <div className="relative flex size-9 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-300">
              <CloudCog className="size-4" />
              <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full border-2 border-emerald-950 bg-emerald-400" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-white">Commande synchronisée</p>
              <p className="mt-0.5 text-[9px] text-emerald-200/60">Moteur prêt · mode {mode === 'auto' ? 'auto' : 'manuel'}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
