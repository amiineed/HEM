import { useState } from 'react';
import {
  Building2,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Database,
  FileSpreadsheet,
  History,
  MapPin,
  Plus,
  Radio,
  Save,
  Thermometer,
  Upload,
  Warehouse,
  Wind,
  X,
} from 'lucide-react';

interface SensorBuildingManagementProps {
  onImport: () => void;
}

type DrawerType = 'sensor' | 'building' | null;

const shell = 'rounded-xl border border-slate-200 bg-white shadow-xs';

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <span className="mb-1.5 block text-[11px] font-semibold text-slate-700">{children}</span>;
}

function SensorDrawer({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/30 backdrop-blur-[1px]">
      <div className="absolute inset-y-0 right-0 flex w-[460px] flex-col border-l border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><Radio className="size-5" /></div>
            <div>
              <p className="text-base font-semibold text-slate-900">Ajouter un capteur</p>
              <p className="mt-0.5 text-[11px] text-slate-500">Configurer un nouvel équipement de mesure.</p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Fermer" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X className="size-4.5" /></button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
          <label className="block">
            <FieldLabel>Nom du capteur</FieldLabel>
            <input
              type="text"
              placeholder='Ex : "Capteur Wemos #2"'
              className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-800 outline-none placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </label>

          <label className="block">
            <FieldLabel>Bâtiment associé</FieldLabel>
            <div className="relative">
              <select className="h-10 w-full appearance-none rounded-lg border border-slate-300 bg-white px-3 pr-9 text-xs font-medium text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100">
                <option>Salle de Sport Pilote - BAT-HEM-01</option>
                <option>+ Créer un nouveau bâtiment</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            </div>
          </label>

          <label className="block">
            <FieldLabel>Salle / Emplacement</FieldLabel>
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder='Ex : "Vestiaires"'
                className="h-10 w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 text-xs text-slate-800 outline-none placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          </label>

          <label className="block">
            <FieldLabel>Température de consigne (°C)</FieldLabel>
            <div className="relative">
              <Thermometer className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-blue-500" />
              <input
                type="number"
                defaultValue="19.0"
                step="0.5"
                className="h-10 w-full rounded-lg border border-slate-300 bg-white pl-9 pr-12 font-mono text-xs font-semibold text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">°C</span>
            </div>
          </label>

          <fieldset>
            <legend className="mb-2 text-[11px] font-semibold text-slate-700">Mode d’alimentation initial</legend>
            <div className="space-y-2">
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-emerald-300 bg-emerald-50/60 p-3.5 ring-1 ring-emerald-100">
                <input type="radio" name="data-mode" defaultChecked className="mt-0.5 size-4 accent-emerald-600" />
                <FileSpreadsheet className="mt-0.5 size-4 text-emerald-600" />
                <span>
                  <span className="block text-xs font-semibold text-emerald-900">Importation Fichier CSV (Mode A)</span>
                  <span className="mt-1 block text-[10px] leading-4 text-emerald-700">Chargement manuel de mesures structurées.</span>
                </span>
              </label>
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-3.5 hover:bg-slate-50">
                <input type="radio" name="data-mode" className="mt-0.5 size-4 accent-blue-600" />
                <Database className="mt-0.5 size-4 text-slate-400" />
                <span>
                  <span className="block text-xs font-semibold text-slate-700">Passerelle LoRa / Base de données</span>
                  <span className="mt-1 block text-[10px] leading-4 text-slate-500">Mode B futur — connexion automatisée.</span>
                </span>
              </label>
            </div>
          </fieldset>

          <label className="block">
            <FieldLabel>Identifiant matériel / IP <span className="font-normal text-slate-400">(Optionnel)</span></FieldLabel>
            <input
              type="text"
              placeholder="Ex : 172.20.60.103 ou DevEUI"
              className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 font-mono text-xs text-slate-800 outline-none placeholder:font-sans placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </label>

          <div className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2.5 text-[10px] leading-4 text-blue-700">
            Le nouveau capteur sera créé sans mesures. Vous pourrez ensuite lui associer un fichier CSV depuis l’inventaire.
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-slate-200 bg-slate-50 px-6 py-4">
          <button onClick={onClose} className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">Annuler</button>
          <button className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700"><Save className="size-3.5" /> Créer le capteur</button>
        </div>
      </div>
    </div>
  );
}

function BuildingDrawer({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/30 backdrop-blur-[1px]">
      <div className="absolute inset-y-0 right-0 flex w-[440px] flex-col border-l border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700"><Building2 className="size-5" /></div>
            <div><p className="text-base font-semibold text-slate-900">Ajouter un bâtiment</p><p className="mt-0.5 text-[11px] text-slate-500">Créer un nouveau site communal.</p></div>
          </div>
          <button onClick={onClose} aria-label="Fermer" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X className="size-4.5" /></button>
        </div>
        <div className="flex-1 space-y-5 p-6">
          <label className="block"><FieldLabel>Nom du bâtiment</FieldLabel><input type="text" placeholder="Ex : Gymnase municipal" className="h-10 w-full rounded-lg border border-slate-300 px-3 text-xs outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" /></label>
          <label className="block"><FieldLabel>Code bâtiment</FieldLabel><input type="text" placeholder="Ex : BAT-HEM-02" className="h-10 w-full rounded-lg border border-slate-300 px-3 font-mono text-xs outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" /></label>
          <label className="block"><FieldLabel>Type de bâtiment</FieldLabel><div className="relative"><select className="h-10 w-full appearance-none rounded-lg border border-slate-300 px-3 text-xs outline-none focus:border-emerald-500"><option>École</option><option>Gymnase</option><option>Mairie</option><option>Autre bâtiment communal</option></select><ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" /></div></label>
          <label className="block"><FieldLabel>Adresse</FieldLabel><textarea rows={3} placeholder="Adresse communale complète" className="w-full rounded-lg border border-slate-300 p-3 text-xs outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" /></label>
        </div>
        <div className="flex justify-end gap-2 border-t border-slate-200 bg-slate-50 px-6 py-4">
          <button onClick={onClose} className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700">Annuler</button>
          <button className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white"><Building2 className="size-3.5" /> Créer le bâtiment</button>
        </div>
      </div>
    </div>
  );
}

export function SensorBuildingManagement({ onImport }: SensorBuildingManagementProps) {
  const [drawer, setDrawer] = useState<DrawerType>(null);

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-emerald-600">Infrastructure IoT</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">Gestion des Bâtiments & Capteurs</h1>
            <p className="mt-1 text-xs text-slate-500">Configurez les bâtiments communaux et associez vos capteurs avant d’importer leurs mesures CSV.</p>
          </div>
          <div className="flex items-center gap-2.5">
            <button onClick={() => setDrawer('building')} className="flex h-10 items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50"><Plus className="size-3.5" /> Ajouter un bâtiment</button>
            <button onClick={() => setDrawer('sensor')} className="flex h-10 items-center gap-2 rounded-lg bg-emerald-600 px-4 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700"><Plus className="size-3.5" /> Ajouter un capteur</button>
          </div>
        </div>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Bâtiments configurés</h2>
              <p className="mt-0.5 text-[11px] text-slate-500">1 bâtiment actif dans la supervision.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className={`${shell} relative overflow-hidden p-5 ring-1 ring-emerald-100`}>
              <div className="absolute inset-y-0 left-0 w-1 bg-emerald-500" />
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-slate-950 text-emerald-400"><Warehouse className="size-5" /></div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-slate-900">Salle de Sport Pilote <span className="font-medium text-slate-500">(Mairie de Hem)</span></p>
                      <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-700">1 capteur actif</span>
                    </div>
                    <p className="mt-1 font-mono text-[10px] font-semibold text-slate-500">BAT-HEM-01</p>
                  </div>
                </div>
                <button className="text-[10px] font-semibold text-slate-400 hover:text-slate-700">Modifier</button>
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3">
                <span className="flex items-center gap-1.5 text-[10px] text-slate-500"><MapPin className="size-3.5" /> Salle de test configurée</span>
                <span className="flex items-center gap-1.5 rounded-md bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600"><FileSpreadsheet className="size-3" /> Alimenté par CSV</span>
              </div>
            </div>

            <button onClick={() => setDrawer('building')} className="group flex min-h-32 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-5 text-center transition hover:border-emerald-400 hover:bg-emerald-50/60">
              <div>
                <div className="mx-auto flex size-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 transition group-hover:border-emerald-200 group-hover:text-emerald-600"><Plus className="size-4.5" /></div>
                <p className="mt-3 text-xs font-semibold text-slate-700 group-hover:text-emerald-800">Ajouter un nouveau bâtiment communal</p>
                <p className="mx-auto mt-1 max-w-sm text-[10px] leading-4 text-slate-400">École, Gymnase, Mairie… pour y rattacher de futurs capteurs</p>
              </div>
            </button>
          </div>
        </section>

        <section className={`${shell} overflow-hidden`}>
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Inventaire des capteurs du bâtiment sélectionné</h2>
              <p className="mt-0.5 text-[11px] text-slate-500">Salle de Sport Pilote · 1 capteur réel configuré</p>
            </div>
            <button onClick={() => setDrawer('sensor')} className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-[11px] font-semibold text-emerald-700 hover:bg-emerald-100"><Plus className="size-3.5" /> Ajouter un capteur</button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500">
                  <th className="px-4 py-3 font-medium">Capteur / ID</th>
                  <th className="px-4 py-3 font-medium">Bâtiment rattaché</th>
                  <th className="px-4 py-3 font-medium">Pièce / Zone</th>
                  <th className="px-4 py-3 font-medium">Dernier CO₂</th>
                  <th className="px-4 py-3 font-medium">Dernière Température</th>
                  <th className="px-4 py-3 font-medium">Dernière Humidité</th>
                  <th className="px-4 py-3 font-medium">Source de données</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-slate-50/60">
                  <td className="px-4 py-4">
                    <p className="whitespace-nowrap text-xs font-semibold text-slate-900">Capteur Prototype #1</p>
                    <p className="mt-0.5 whitespace-nowrap text-[10px] text-slate-500">Wemos D1 Mini · <span className="font-mono">SENS-01</span></p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="whitespace-nowrap font-medium text-slate-700">Salle de Sport Pilote</p>
                    <p className="mt-0.5 font-mono text-[10px] text-slate-400">BAT-HEM-01</p>
                  </td>
                  <td className="px-4 py-4"><span className="flex items-center gap-1.5 whitespace-nowrap text-slate-600"><MapPin className="size-3.5 text-slate-400" /> Salle de test</span></td>
                  <td className="px-4 py-4">
                    <p className="font-mono font-semibold text-red-700">1 410 ppm</p>
                    <span className="mt-1 inline-flex rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[9px] font-bold text-red-700">Critique &gt; 1000 ppm</span>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-mono font-semibold text-blue-700">26.9 °C</p>
                    <p className="mt-1 text-[9px] text-slate-400">Consigne 19.0 °C</p>
                  </td>
                  <td className="px-4 py-4 font-mono font-semibold text-teal-700">63.0 %</td>
                  <td className="px-4 py-4"><span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-md bg-slate-100 px-2 py-1 font-mono text-[9px] font-semibold text-slate-600"><Database className="size-3" /> CSV_IMPORT (22 mesures)</span></td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={onImport} className="flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-emerald-600 px-2.5 py-2 text-[10px] font-semibold text-white hover:bg-emerald-700"><Upload className="size-3" /> Importer CSV</button>
                      <button className="flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-slate-200 px-2.5 py-2 text-[10px] font-semibold text-slate-600 hover:bg-slate-50"><History className="size-3" /> Voir historique</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex items-center gap-2 border-t border-slate-200 bg-slate-50/60 px-5 py-3 text-[10px] text-slate-500"><CheckCircle2 className="size-3.5 text-emerald-600" /> Inventaire à jour · dernière mesure reçue le 15/10/2026 à 14:31:13</div>
        </section>
      </div>

      {drawer === 'sensor' && <SensorDrawer onClose={() => setDrawer(null)} />}
      {drawer === 'building' && <BuildingDrawer onClose={() => setDrawer(null)} />}
    </>
  );
}
