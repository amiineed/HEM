import { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle2, FileSpreadsheet, Upload, X } from 'lucide-react';
import type { ImportResult, Sensor } from '../api';

interface Props { isOpen: boolean; sensor: Sensor | null; initialFile?: File | null; onClose: () => void; onImport: (file: File) => Promise<ImportResult>; }

export function CsvImportModal({ isOpen, sensor, initialFile = null, onClose, onImport }: Props) {
  const [file, setFile] = useState<File | null>(initialFile);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (isOpen) {
      setFile(initialFile);
      setResult(null);
      setError('');
    }
  }, [initialFile, isOpen]);
  if (!isOpen) return null;
  const submit = async () => {
    if (!file) { setError('Sélectionnez un fichier CSV.'); return; }
    try { setBusy(true); setError(''); setResult(await onImport(file)); } catch (e) { setError(e instanceof Error ? e.message : 'Import impossible'); } finally { setBusy(false); }
  };
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"><div className="w-full max-w-xl rounded-xl bg-white shadow-2xl"><div className="flex items-center justify-between border-b p-5"><div className="flex items-center gap-3"><FileSpreadsheet className="size-5 text-emerald-600" /><div><p className="text-base font-semibold">Importer un CSV</p><p className="text-xs text-slate-500">{sensor?.name ?? 'Aucun capteur sélectionné'}</p></div></div><button onClick={onClose}><X className="size-5 text-slate-400" /></button></div><div className="space-y-4 p-5"><label className="flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-emerald-300 bg-emerald-50/40 p-8"><Upload className="size-7 text-emerald-600" /><span className="mt-2 text-sm font-semibold">{file?.name ?? 'Sélectionner un fichier .csv'}</span><input type="file" accept=".csv,text/csv" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="hidden" /></label>{error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">{error}</div>}{result && <div className="grid grid-cols-4 gap-2">{[['Total', result.total_rows, 'slate'], ['Insérées', result.inserted_rows, 'emerald'], ['Doublons', result.duplicate_rows, 'amber'], ['Rejetées', result.rejected_rows, 'red']].map(([label, value, tone]) => <div key={String(label)} className={`rounded-lg bg-${tone}-50 p-3 text-center`}><p className="text-[10px] text-slate-500">{label as string}</p><p className="mt-1 text-xl font-semibold">{value as number}</p></div>)}</div>}{result?.errors.length ? <div className="text-xs text-red-700"><AlertTriangle className="mr-1 inline size-3.5" />{result.errors.join(' · ')}</div> : null}</div><div className="flex justify-end gap-2 border-t bg-slate-50 p-4"><button onClick={onClose} className="rounded-lg border px-4 py-2 text-xs font-semibold">Fermer</button><button disabled={busy || !sensor} onClick={() => void submit()} className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white disabled:opacity-50">{result ? <CheckCircle2 className="size-3.5" /> : <Upload className="size-3.5" />}{busy ? 'Import en cours…' : result ? 'Importer à nouveau' : 'Importer le fichier'}</button></div></div></div>;
}
