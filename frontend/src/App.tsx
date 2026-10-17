import { useEffect, useMemo, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { Activity, Building2, Database, FileSpreadsheet, Flame, History, LayoutDashboard, Upload } from 'lucide-react';
import { api, type Building, type HeatingMode, type ImportResult, type Sensor, type SensorMeasurements } from './api';
import { CsvImportModal } from './components/CsvImportModal';
import { CsvImportScreen } from './components/CsvImportScreen';
import { HeatingControlScreen } from './components/HeatingControlScreen';
import { HistoryMeasurementsScreen } from './components/HistoryMeasurementsScreen';
import { SensorBuildingManagement } from './components/SensorBuildingManagement';
import { SensorSupervisionDashboard } from './components/SensorSupervisionDashboard';

type ViewId = 'dashboard' | 'sensors' | 'imports' | 'history' | 'heating';
const navigation: Array<{ id: ViewId; label: string; icon: typeof LayoutDashboard }> = [
  { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { id: 'sensors', label: 'Capteurs & Bâtiments', icon: Building2 },
  { id: 'imports', label: 'Importation CSV & Sources', icon: FileSpreadsheet },
  { id: 'history', label: 'Historique & Mesures', icon: History },
  { id: 'heating', label: 'Pilotage Chauffage', icon: Flame },
];
const titles: Record<ViewId, string> = { dashboard: 'Tableau de bord', sensors: 'Capteurs & bâtiments', imports: 'Importation CSV & sources', history: 'Historique & mesures', heating: 'Pilotage chauffage' };

export default function App() {
  const [view, setView] = useState<ViewId>('dashboard');
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [details, setDetails] = useState<Record<string, SensorMeasurements>>({});
  const [selectedSensorId, setSelectedSensorId] = useState('');
  const [modalSensorId, setModalSensorId] = useState<string | null>(null);
  const [selectedImportFile, setSelectedImportFile] = useState<File | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState('');

  const selectedSensor = sensors.find((sensor) => sensor.id === selectedSensorId) ?? sensors[0] ?? null;
  const modalSensor = sensors.find((sensor) => sensor.id === modalSensorId) ?? selectedSensor;
  const detail = selectedSensor ? details[selectedSensor.id] ?? null : null;
  const selectedBuilding = selectedSensor ? buildings.find((building) => building.id === selectedSensor.building_id) : null;

  const load = async () => {
    try {
      const [nextBuildings, nextSensors] = await Promise.all([api.listBuildings(), api.listSensors()]);
      setBuildings(nextBuildings); setSensors(nextSensors);
      if (!selectedSensorId && nextSensors[0]) setSelectedSensorId(nextSensors[0].id);
      const fetched = await Promise.all(nextSensors.map(async (sensor) => [sensor.id, await api.getSensorMeasurements(sensor.id)] as const));
      setDetails(Object.fromEntries(fetched));
    } catch (e) { setError(e instanceof Error ? e.message : 'Backend inaccessible'); }
  };
  useEffect(() => { void load(); }, []);
  const openImport = (sensorId = selectedSensor?.id) => { if (sensorId) setModalSensorId(sensorId); };
  const headerFileInput = useRef<HTMLInputElement>(null);
  const openHeaderFilePicker = () => {
    if (selectedSensor) {
      headerFileInput.current?.click();
      return;
    }
    setView('imports');
  };
  const handleHeaderFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setSelectedImportFile(file);
    openImport();
  };
  const importFile = async (file: File) => { if (!modalSensor) throw new Error('Aucun capteur sélectionné'); const result = await api.importCsv(modalSensor.id, file); setImportResult(result); await load(); return result; };
  const updateControl = async (payload: { heating_mode?: HeatingMode; target_temp_c?: number }) => { if (!selectedSensor) return; await api.updateSensorControl(selectedSensor.id, payload); await load(); };
  const createBuilding = async (payload: Pick<Building, 'name' | 'code'>) => { await api.createBuilding(payload); await load(); };
  const createSensor = async (payload: Omit<Sensor, 'status'> & { status?: Sensor['status'] }) => { await api.createSensor(payload); await load(); };
  const refreshAfterSensorDeletion = async (sensorId: string) => {
    if (selectedSensorId === sensorId) setSelectedSensorId('');
    await load();
  };
  const dashboardDetail = detail;
  const renderedView = useMemo(() => {
    if (view === 'dashboard') return <SensorSupervisionDashboard sensor={selectedSensor} detail={dashboardDetail} onImport={() => openImport()} />;
    if (view === 'sensors') return <SensorBuildingManagement buildings={buildings} sensors={sensors} details={details} onCreateBuilding={createBuilding} onCreateSensor={createSensor} onImport={openImport} onDeleteSuccess={deleteSensor} />;
    if (view === 'imports') return <CsvImportScreen sensors={sensors} selectedSensor={selectedSensor} result={importResult} onOpenImporter={() => openImport()} />;
    if (view === 'history') return <HistoryMeasurementsScreen sensor={selectedSensor} detail={detail} />;
    return <HeatingControlScreen sensor={selectedSensor} detail={detail} onControl={updateControl} />;
  }, [view, selectedSensor, detail, dashboardDetail, buildings, sensors, details, importResult]);
  return <div className="min-h-screen bg-slate-50 text-slate-900"><aside className="fixed inset-y-0 left-0 z-30 flex w-68 flex-col bg-slate-950 text-white"><div className="border-b border-slate-800 p-5"><div className="flex items-center gap-3"><div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500"><Activity className="size-5" /></div><div><p className="text-sm font-semibold">Smart City Hem</p><p className="text-[10px] uppercase tracking-widest text-emerald-400">Pilotage bâtiments</p></div></div></div><nav className="space-y-1 p-4">{navigation.map((item) => { const Icon = item.icon; return <button key={item.id} onClick={() => setView(item.id)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-xs ${view === item.id ? 'bg-emerald-500/15 text-white' : 'text-slate-400 hover:bg-slate-900'}`}><Icon className="size-4" />{item.label}</button>; })}</nav><div className="mt-auto p-4 text-[10px] text-slate-500"><Database className="mr-1 inline size-3.5 text-emerald-400" />API backend · {buildings.length} bâtiment(s) · {sensors.length} capteur(s)</div></aside><div className="ml-68"><header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b bg-white/95 px-6"><div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-semibold text-emerald-800"><Database className="size-3.5" />API : http://localhost:8000/api/v1</div><div className="ml-auto flex items-center gap-3"><select value={selectedSensor?.id ?? ''} onChange={(e) => setSelectedSensorId(e.target.value)} className="h-9 rounded-lg border px-3 text-xs font-semibold">{sensors.map((sensor) => <option key={sensor.id} value={sensor.id}>{sensor.name}</option>)}</select><input ref={headerFileInput} type="file" accept=".csv,text/csv" onChange={handleHeaderFile} className="hidden" /><button onClick={openHeaderFilePicker} className="flex h-9 items-center gap-2 rounded-lg bg-emerald-600 px-4 text-xs font-semibold text-white"><Upload className="size-3.5" />Importer un CSV</button></div></header><main className="p-6"><div className="mb-5"><p className="text-[10px] font-semibold uppercase tracking-widest text-emerald-600">{selectedBuilding?.name ?? 'Supervision'}</p><h1 className="mt-1 text-2xl font-semibold">{titles[view]}</h1>{error && <p className="mt-2 rounded-lg bg-red-50 p-2 text-xs text-red-700">{error}</p>}</div>{renderedView}</main></div><CsvImportModal isOpen={modalSensorId !== null} sensor={modalSensor} initialFile={selectedImportFile} onClose={() => { setModalSensorId(null); setSelectedImportFile(null); }} onImport={importFile} /></div>;
}
