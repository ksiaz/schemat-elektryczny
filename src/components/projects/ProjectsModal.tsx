import { useEffect, useState, useCallback } from 'react';
import { useProjectStore } from '../../store/projectStore.ts';
import type { ProjectMeta } from '../../types/project.ts';

export function ProjectsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const {
    storageMode, setStorageMode, getActiveStorage,
    newProject, openProject, currentProjectId,
  } = useProjectStore();
  const [items, setItems] = useState<ProjectMeta[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(() => {
    setLoading(true); setError(null);
    getActiveStorage().list()
      .then(setItems)
      .catch((e) => setError(String(e?.message ?? e)))
      .finally(() => setLoading(false));
  }, [getActiveStorage]);

  useEffect(() => { if (open) refresh(); }, [open, storageMode, refresh]);

  if (!open) return null;

  const onNew = async () => {
    const name = prompt('Nazwa nowego projektu:', 'Nowy projekt');
    if (!name) return;
    await newProject(name);
    onClose();
  };
  const onOpen = async (id: string) => { await openProject(id); onClose(); };
  const onRename = async (m: ProjectMeta) => {
    const name = prompt('Nowa nazwa:', m.name);
    if (!name) return;
    await getActiveStorage().rename(m.id, name); refresh();
  };
  const onDuplicate = async (m: ProjectMeta) => {
    await getActiveStorage().duplicate(m.id, `${m.name} (kopia)`); refresh();
  };
  const onDelete = async (m: ProjectMeta) => {
    if (!confirm(`Usunąć projekt „${m.name}"? Tej operacji nie można cofnąć.`)) return;
    await getActiveStorage().remove(m.id); refresh();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="w-[560px] max-h-[80vh] flex flex-col bg-white rounded-lg shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-3 border-b border-gray-200">
          <h2 className="text-sm font-bold text-gray-800">Projekty</h2>
          <div className="flex gap-1 text-xs">
            <button onClick={() => setStorageMode('local')}
              className={`px-2 py-1 rounded ${storageMode === 'local' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>Lokalne</button>
            <button onClick={() => setStorageMode('drive')}
              className={`px-2 py-1 rounded ${storageMode === 'drive' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>Drive</button>
          </div>
        </div>

        <div className="flex items-center justify-between p-2 border-b border-gray-100">
          <button onClick={onNew} className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700">+ Nowy projekt</button>
          <button onClick={refresh} className="px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200">Odśwież</button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {loading && <p className="text-xs text-gray-500 p-2">Ładowanie…</p>}
          {error && <p className="text-xs text-red-600 p-2">Błąd: {error}</p>}
          {!loading && !error && items.length === 0 && <p className="text-xs text-gray-500 p-2">Brak projektów.</p>}
          {items.map((m) => (
            <div key={m.id} className={`flex items-center justify-between px-2 py-1.5 rounded hover:bg-gray-50 ${m.id === currentProjectId ? 'bg-blue-50' : ''}`}>
              <button onClick={() => onOpen(m.id)} className="flex-1 text-left">
                <span className="text-xs font-medium text-gray-800">{m.name}</span>
                <span className="block text-[10px] text-gray-400">{new Date(m.updatedAt).toLocaleString()}</span>
              </button>
              <div className="flex gap-1 text-[11px]">
                <button onClick={() => onRename(m)} className="text-gray-500 hover:text-gray-800">Zmień</button>
                <button onClick={() => onDuplicate(m)} className="text-gray-500 hover:text-gray-800">Duplikuj</button>
                <button onClick={() => onDelete(m)} className="text-red-500 hover:text-red-700">Usuń</button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-2 border-t border-gray-200 text-right">
          <button onClick={onClose} className="px-3 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200">Zamknij</button>
        </div>
      </div>
    </div>
  );
}
