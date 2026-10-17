import { useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Archive,
  BarChart3,
  Building2,
  Check,
  ChevronDown,
  CircleGauge,
  Clock3,
  Database,
  FileSpreadsheet,
  Flame,
  Gauge,
  HardDrive,
  History,
  LayoutDashboard,
  Leaf,
  Menu,
  Radio,
  ServerCog,
  Settings2,
  ShieldCheck,
  Thermometer,
  Upload,
  Wind,
  X,
  Zap,
} from 'lucide-react';
import { CsvImportModal } from './components/CsvImportModal';
import { CsvImportScreen } from './components/CsvImportScreen';
import { HeatingControlScreen } from './components/HeatingControlScreen';
import { HistoryMeasurementsScreen } from './components/HistoryMeasurementsScreen';
import { SensorBuildingManagement } from './components/SensorBuildingManagement';
import { SensorSupervisionDashboard } from './components/SensorSupervisionDashboard';
import { TelemetryChart } from './components/TelemetryChart';
import {
  BUILDINGS,
  BuildingId,
  CSV_IMPORT_LOGS,
  HOURLY_TELEMETRY,
  SENSOR_READINGS,
  SensorReading,
} from './data/mockData';

type ViewId = 'dashboard' | 'sensors' | 'imports' | 'history' | 'heating';

const navigation: Array<{
  id: ViewId;
  label: string;
  caption: string;
  icon: typeof LayoutDashboard;
}> = [
  { id: 'dashboard', label: 'Tableau de bord', caption: 'Supervision', icon: LayoutDashboard },
  { id: 'sensors', label: 'Capteurs & Bâtiments', caption: 'Parc IoT municipal', icon: Building2 },
  { id: 'imports', label: 'Importation CSV & Sources', caption: 'Connecteurs de données', icon: FileSpreadsheet },
  { id: 'history', label: 'Historique & Mesures', caption: 'Archives télémétriques', icon: History },
  { id: 'heating', label: 'Pilotage Chauffage', caption: '-30% Objectif 2023', icon: Flame },
];

const viewMeta: Record<ViewId, { eyebrow: string; title: string; description: string }> = {
  dashboard: {
    eyebrow: 'Supervision capteur',
    title: 'Tableau de bord - Supervision Capteur',
    description: 'Télémétrie temps réel et pilotage du chauffage du site municipal.',
  },
  sensors: {
    eyebrow: 'Infrastructure IoT',
    title: 'Capteurs & bâtiments',
    description: 'Disponibilité, qualité d’air et état opérationnel des équipements.',
  },
  imports: {
    eyebrow: 'Gouvernance des données',
    title: 'Importation CSV & sources',
    description: 'Suivi des lots, validation de schéma et préparation base de données.',
  },
  history: {
    eyebrow: 'Analyse temporelle',
    title: 'Historique & mesures',
    description: 'Consultation consolidée des relevés thermiques et de qualité d’air.',
  },
  heating: {
    eyebrow: 'Sobriété énergétique',
    title: 'Pilotage chauffage',
    description: 'Trajectoire de réduction des consommations par bâtiment.',
  },
};

const card = 'rounded-xl border border-slate-200 bg-white shadow-xs';

function StatusBadge({ co2 }: { co2: number }) {
  const style =
    co2 > 1000
      ? 'border-red-200 bg-red-50 text-red-700'
      : co2 >= 800
        ? 'border-amber-200 bg-amber-50 text-amber-700'
        : 'border-emerald-200 bg-emerald-50 text-emerald-700';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[11px] font-semibold ${style}`}>
      <span className="size-1.5 rounded-full bg-current" />
      {co2 > 1000 ? 'Critique' : co2 >= 800 ? 'À surveiller' : 'Optimal'}
    </span>
  );
}

function SensorTable({ sensors, compact = false }: { sensors: SensorReading[]; compact?: boolean }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left text-xs">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500">
            <th className="px-4 py-3 font-medium">Capteur / emplacement</th>
            <th className="px-4 py-3 font-medium">Température</th>
            <th className="px-4 py-3 font-medium">CO₂</th>
            {!compact && <th className="px-4 py-3 font-medium">Humidité</th>}
            <th className="px-4 py-3 font-medium">État</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {sensors.map((sensor) => (
            <tr key={sensor.id} className="transition-colors hover:bg-slate-50/70">
              <td className="px-4 py-3">
                <div className="font-semibold text-slate-800">{sensor.room}</div>
                <div className="mt-0.5 font-mono text-[10px] text-slate-500">
                  {sensor.sensorCode} · {sensor.buildingName}
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1.5 font-mono font-semibold text-blue-700">
                  <Thermometer className="size-3.5" />
                  {sensor.temperatureC.toFixed(1)}°C
                </div>
                <div className="mt-0.5 text-[10px] text-slate-400">Consigne {sensor.targetTempC.toFixed(1)}°C</div>
              </td>
              <td className="px-4 py-3 font-mono font-semibold text-slate-700">{sensor.co2Ppm} ppm</td>
              {!compact && <td className="px-4 py-3 text-slate-600">{sensor.humidityPct}% HR</td>}
              <td className="px-4 py-3"><StatusBadge co2={sensor.co2Ppm} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Dashboard({
  sensors,
  selectedName,
  demoMode,
}: {
  sensors: SensorReading[];
  selectedName: string;
  demoMode: boolean;
}) {
  const averageTemp = sensors.reduce((sum, item) => sum + item.temperatureC, 0) / Math.max(sensors.length, 1);
  const critical = sensors.filter((item) => item.co2Ppm > 1000).length;
  const kpis = [
    { label: 'Capteurs opérationnels', value: '64 / 67', detail: '95,5% du parc connecté', icon: Radio, color: 'emerald' },
    { label: 'Température moyenne', value: `${averageTemp.toFixed(1)}°C`, detail: 'Consigne parc : 18,6°C', icon: Thermometer, color: 'blue' },
    { label: 'Alertes qualité d’air', value: String(critical), detail: 'Seuil critique > 1 000 ppm', icon: Wind, color: critical ? 'red' : 'emerald' },
    { label: 'Économie projetée', value: '-28,7%', detail: 'Objectif 2023 : -30%', icon: Leaf, color: 'emerald' },
  ];
  const tones: Record<string, string> = {
    emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    blue: 'bg-blue-50 text-blue-700 ring-blue-100',
    red: 'bg-red-50 text-red-700 ring-red-100',
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className={`${card} p-4`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500">{kpi.label}</p>
                  <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{kpi.value}</p>
                </div>
                <div className={`flex size-10 items-center justify-center rounded-xl ring-1 ${tones[kpi.color]}`}>
                  <Icon className="size-5" />
                </div>
              </div>
              <p className="mt-2 text-[11px] text-slate-500">{kpi.detail}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-[minmax(0,2fr)_minmax(280px,0.8fr)] gap-5">
        <TelemetryChart
          data={HOURLY_TELEMETRY}
          selectedBuildingName={selectedName}
          isDemoMode={demoMode}
          peakCo2Simulated={demoMode}
        />
        <div className={`${card} flex flex-col overflow-hidden`}>
          <div className="border-b border-slate-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">Pilotage chauffage</p>
                <p className="mt-1 text-xs text-slate-500">Objectif municipal 2023</p>
              </div>
              <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <Flame className="size-5" />
              </div>
            </div>
          </div>
          <div className="flex-1 p-5">
            <div className="flex items-end justify-between">
              <div>
                <span className="text-3xl font-semibold tracking-tight text-emerald-700">-28,7%</span>
                <p className="mt-1 text-xs text-slate-500">vs référence hiver 2022</p>
              </div>
              <span className="rounded-lg bg-amber-50 px-2 py-1 text-[10px] font-semibold text-amber-700">1,3 pt restant</span>
            </div>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full w-[95.6%] rounded-full bg-emerald-500" />
            </div>
            <div className="mt-2 flex justify-between text-[10px] text-slate-400">
              <span>0%</span><span>Cible -30%</span>
            </div>
            <div className="mt-5 space-y-3 border-t border-slate-100 pt-4">
              {[
                ['Consigne jour', '19,0°C', Thermometer],
                ['Consigne nuit', '15,5°C', Clock3],
                ['Puissance instantanée', '138 kW', Zap],
              ].map(([label, value, Icon]) => (
                <div key={label as string} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-slate-500">
                    <Icon className="size-3.5 text-slate-400" />{label as string}
                  </span>
                  <span className="font-mono font-semibold text-slate-800">{value as string}</span>
                </div>
              ))}
            </div>
          </div>
          <button className="m-4 mt-0 flex items-center justify-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100">
            <Settings2 className="size-3.5" /> Ajuster la stratégie
          </button>
        </div>
      </div>

      <div className={`${card} overflow-hidden`}>
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <p className="text-sm font-semibold text-slate-900">Supervision temps réel</p>
            <p className="mt-0.5 text-xs text-slate-500">Derniers relevés reçus · rafraîchissement toutes les 15 minutes</p>
          </div>
          <span className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-700">
            <span className="size-2 animate-pulse rounded-full bg-emerald-500" /> Flux actif
          </span>
        </div>
        <SensorTable sensors={sensors.slice(0, 5)} compact />
      </div>
    </div>
  );
}

function SensorsView({ sensors }: { sensors: SensorReading[] }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-5 gap-3">
        {BUILDINGS.map((building) => (
          <div key={building.id} className={`${card} p-4`}>
            <div className="flex items-start justify-between">
              <div className="flex size-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                <Building2 className="size-4.5" />
              </div>
              <span className="text-[10px] font-semibold text-emerald-700">{building.sensorsActive}/{building.sensorsTotal} actifs</span>
            </div>
            <p className="mt-3 truncate text-xs font-semibold text-slate-900">{building.name}</p>
            <p className="mt-1 text-[10px] text-slate-500">{building.code} · {building.surfaceM2.toLocaleString('fr-FR')} m²</p>
          </div>
        ))}
      </div>
      <div className={`${card} overflow-hidden`}>
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <p className="text-sm font-semibold text-slate-900">Inventaire des capteurs</p>
            <p className="mt-0.5 text-xs text-slate-500">{sensors.length} équipements correspondant au périmètre sélectionné</p>
          </div>
          <button className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50">
            <Menu className="size-3.5" /> Filtrer l’inventaire
          </button>
        </div>
        <SensorTable sensors={sensors} />
      </div>
    </div>
  );
}

function ImportsView({ onImport }: { onImport: () => void }) {
  return (
    <div className="grid grid-cols-[minmax(0,1.55fr)_minmax(300px,0.75fr)] gap-5">
      <div className={`${card} overflow-hidden`}>
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <p className="text-sm font-semibold text-slate-900">Journal des importations</p>
            <p className="mt-0.5 text-xs text-slate-500">Lots CSV contrôlés et indexés dans le stockage local</p>
          </div>
          <button onClick={onImport} className="flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700">
            <Upload className="size-3.5" /> Nouveau lot
          </button>
        </div>
        <div className="divide-y divide-slate-100">
          {CSV_IMPORT_LOGS.map((log) => (
            <div key={log.id} className="flex items-center gap-4 p-5 hover:bg-slate-50/60">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <FileSpreadsheet className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-slate-900">{log.filename}</p>
                <p className="mt-1 text-[11px] text-slate-500">{log.importedAt} · {log.rowsCount} lignes · {log.buildingScope}</p>
              </div>
              <div className="text-right">
                <span className={`rounded-full border px-2 py-1 text-[10px] font-semibold ${
                  log.status.includes('Alerte') ? 'border-red-200 bg-red-50 text-red-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'
                }`}>{log.status}</span>
                <p className="mt-2 font-mono text-[10px] text-slate-400">{log.encoding} · SHA {log.checksum}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <div className={`${card} p-5`}>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><Database className="size-5" /></div>
            <div><p className="text-sm font-semibold text-slate-900">Architecture des données</p><p className="text-xs text-slate-500">Prête à évoluer</p></div>
          </div>
          <div className="mt-5 space-y-3">
            {[
              ['Stockage CSV structuré', 'Actif', HardDrive],
              ['Validation de schéma', 'Active', ShieldCheck],
              ['Connecteur SQL / ORM', 'Prêt', ServerCog],
            ].map(([label, status, Icon]) => (
              <div key={label as string} className="flex items-center justify-between rounded-lg bg-slate-50 p-3 text-xs">
                <span className="flex items-center gap-2 text-slate-600"><Icon className="size-4" />{label as string}</span>
                <span className="font-semibold text-emerald-700">{status as string}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-dashed border-emerald-300 bg-emerald-50/60 p-5 text-center">
          <Upload className="mx-auto size-6 text-emerald-600" />
          <p className="mt-3 text-sm font-semibold text-slate-900">Importer des mesures</p>
          <p className="mx-auto mt-1 max-w-xs text-xs leading-5 text-slate-500">Déposez un CSV UTF-8. Les seuils CO₂ et les dérives de consigne seront détectés automatiquement.</p>
          <button onClick={onImport} className="mt-4 rounded-lg border border-emerald-200 bg-white px-4 py-2 text-xs font-semibold text-emerald-700 shadow-xs hover:bg-emerald-50">Sélectionner un fichier CSV</button>
        </div>
      </div>
    </div>
  );
}

function HistoryView({ sensors }: { sensors: SensorReading[] }) {
  return (
    <div className="space-y-5">
      <TelemetryChart data={HOURLY_TELEMETRY} selectedBuildingName="Parc municipal consolidé" isDemoMode={false} peakCo2Simulated={false} />
      <div className={`${card} overflow-hidden`}>
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div><p className="text-sm font-semibold text-slate-900">Dernières mesures archivées</p><p className="mt-0.5 text-xs text-slate-500">Horodatage et provenance conservés pour chaque relevé</p></div>
          <span className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1.5 text-[11px] text-slate-600"><Archive className="size-3.5" /> 1 800 points / 30 jours</span>
        </div>
        <SensorTable sensors={sensors.slice(0, 6)} />
      </div>
    </div>
  );
}

function HeatingView() {
  return (
    <div className="space-y-5">
      <div className={`${card} p-5`}>
        <div className="flex items-center justify-between">
          <div><p className="text-sm font-semibold text-slate-900">Trajectoire municipale de sobriété</p><p className="mt-1 text-xs text-slate-500">Projection annuelle comparée à la référence énergétique 2022</p></div>
          <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2 text-emerald-700"><Leaf className="size-5" /><span className="text-lg font-semibold">-28,7%</span></div>
        </div>
        <div className="mt-6 grid grid-cols-5 gap-4">
          {BUILDINGS.map((building) => {
            const reached = building.reduction2023Pct >= building.target2023Pct;
            return (
              <div key={building.id} className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-center justify-between">
                  <span className={`flex size-8 items-center justify-center rounded-lg ${reached ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                    {reached ? <Check className="size-4" /> : <Gauge className="size-4" />}
                  </span>
                  <span className={`text-lg font-semibold ${reached ? 'text-emerald-700' : 'text-slate-900'}`}>-{building.reduction2023Pct}%</span>
                </div>
                <p className="mt-3 truncate text-xs font-semibold text-slate-800">{building.name}</p>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${reached ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${Math.min(100, building.reduction2023Pct / 30 * 100)}%` }} /></div>
                <p className="mt-2 text-[10px] text-slate-500">{building.projectedMwh} MWh projetés</p>
              </div>
            );
          })}
        </div>
      </div>
      <TelemetryChart data={HOURLY_TELEMETRY} selectedBuildingName="Comparatif énergétique du parc" isDemoMode={false} peakCo2Simulated={false} />
      <div className="grid grid-cols-3 gap-4">
        {[
          ['Abaissement nocturne', '15,5°C', '22h00 → 06h00', Clock3],
          ['Loi d’eau optimisée', 'Automatique', 'Selon température extérieure', CircleGauge],
          ['Économie estimée', '584 MWh', '≈ 126 tCO₂ évitées', Leaf],
        ].map(([label, value, detail, Icon]) => (
          <div key={label as string} className={`${card} flex items-center gap-4 p-4`}>
            <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><Icon className="size-5" /></div>
            <div><p className="text-xs text-slate-500">{label as string}</p><p className="mt-0.5 text-sm font-semibold text-slate-900">{value as string}</p><p className="text-[10px] text-slate-400">{detail as string}</p></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState<ViewId>('sensors');
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingId>('all');
  const [demoMode, setDemoMode] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [sensors, setSensors] = useState<SensorReading[]>(SENSOR_READINGS);

  const filteredSensors = useMemo(
    () => selectedBuilding === 'all' ? sensors : sensors.filter((sensor) => sensor.buildingId === selectedBuilding),
    [selectedBuilding, sensors],
  );
  const selectedName = selectedBuilding === 'all'
    ? 'Capteur Prototype #1'
    : BUILDINGS.find((building) => building.id === selectedBuilding)?.name ?? 'Bâtiment';
  const meta = viewMeta[view];

  const handleImport = (newSensors: SensorReading[]) => {
    setSensors((current) => [...newSensors, ...current]);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <aside className="fixed inset-y-0 left-0 z-30 flex w-68 flex-col border-r border-slate-200 bg-slate-950 text-white">
        <div className="border-b border-slate-800 px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-lg shadow-emerald-950/30">
              <Activity className="size-5" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight">Smart City Hem</p>
              <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.16em] text-emerald-400">Pilotage bâtiments</p>
            </div>
          </div>
        </div>
        <div className="px-4 pt-5">
          <p className="px-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">Espace de travail</p>
          <nav className="mt-3 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = item.id === view;
              return (
                <button
                  key={item.id}
                  onClick={() => setView(item.id)}
                  className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${
                    active ? 'bg-emerald-500/15 text-white ring-1 ring-emerald-500/20' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'
                  }`}
                >
                  <Icon className={`size-4.5 shrink-0 ${active ? 'text-emerald-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                  <span className="min-w-0">
                    <span className="block truncate text-xs font-medium">{item.label}</span>
                    <span className={`mt-0.5 block truncate text-[10px] ${active ? 'text-emerald-300/80' : 'text-slate-600'}`}>{item.caption}</span>
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
        <div className="mt-auto p-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-200"><Database className="size-4 text-emerald-400" /> Stockage local actif</div>
            <p className="mt-2 text-[10px] leading-4 text-slate-500">Dernière synchronisation CSV<br />15 oct. 2026 · 14:31:13</p>
            <div className="mt-3 flex items-center gap-2 text-[10px] font-medium text-emerald-400"><span className="size-1.5 rounded-full bg-emerald-400" /> Tous les services opérationnels</div>
          </div>
          <div className="mt-4 flex items-center gap-3 px-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-slate-800 text-xs font-semibold text-slate-200">VH</div>
            <div><p className="text-xs font-medium text-slate-300">Ville de Hem</p><p className="text-[10px] text-slate-600">59510 · Nord</p></div>
          </div>
        </div>
      </aside>

      <div className="ml-68 min-w-0">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="flex h-16 items-center gap-4 px-6">
            <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[10px] font-semibold text-emerald-800">
              <Database className="size-3.5" /> Mode actif : Stockage CSV
              <span className="text-emerald-600">(mesures_capteurs 1.csv - 22 lignes)</span>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <div className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-700">
                <Radio className="size-3.5 text-emerald-600" />
                Capteur Prototype #1
                <span className="rounded bg-slate-200 px-1.5 py-0.5 text-[9px] font-bold text-slate-500">VERROUILLÉ</span>
              </div>
              <button onClick={() => setModalOpen(true)} className="flex h-9 items-center gap-2 rounded-lg bg-emerald-600 px-4 text-xs font-semibold text-white shadow-xs transition hover:bg-emerald-700">
                <Upload className="size-3.5" /> + Importer un CSV
              </button>
            </div>
          </div>
        </header>

        <main className="p-6">
          {demoMode && bannerVisible && (
            <div className="mb-5 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700"><AlertTriangle className="size-4" /></div>
              <div className="flex-1"><span className="font-semibold">Mode démonstration actif.</span> Les données et alertes affichées sont simulées à partir d’un scénario réaliste de la Ville de Hem.</div>
              <button onClick={() => setDemoMode(false)} className="rounded-lg border border-amber-300 bg-white/70 px-3 py-1.5 text-[11px] font-semibold text-amber-800 hover:bg-white">Passer aux données CSV</button>
              <button onClick={() => setBannerVisible(false)} aria-label="Fermer la bannière" className="rounded-lg p-1.5 text-amber-600 hover:bg-amber-100"><X className="size-4" /></button>
            </div>
          )}

          {view !== 'sensors' && <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-emerald-600">{meta.eyebrow}</p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">{meta.title}</h1>
              <p className="mt-1 text-xs text-slate-500">{meta.description}</p>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <Clock3 className="size-3.5" /> Dernière mesure : 15 oct. 2026 à 14:31:13
            </div>
          </div>}

          {view === 'dashboard' && <SensorSupervisionDashboard onImport={() => setModalOpen(true)} />}
          {view === 'sensors' && <SensorBuildingManagement onImport={() => setModalOpen(true)} />}
          {view === 'imports' && <CsvImportScreen onOpenImporter={() => setModalOpen(true)} />}
          {view === 'history' && <HistoryMeasurementsScreen />}
          {view === 'heating' && <HeatingControlScreen />}
        </main>
      </div>

      <CsvImportModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onImportSensors={handleImport} />
    </div>
  );
}
