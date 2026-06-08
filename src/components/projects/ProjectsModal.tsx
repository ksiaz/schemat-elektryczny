import { useEffect, useState, useCallback } from 'react';
import { useProjectStore } from '../../store/projectStore.ts';
import { isSignedIn, getEmail } from '../../services/googleAuth.ts';
import type { ProjectMeta } from '../../types/project.ts';

export function ProjectsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const {
    storageMode, setStorageMode, getActiveStorage,
    newProject, openProject, currentProjectId, saveAsProject,
  } = useProjectStore();
  const saveCurrent = useProjectStore((s) => s.saveCurrent);
  const [items, setItems] = useState<ProjectMeta[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const where = () => (storageMode === 'drive' ? 'Google Drive' : 'lokalnie (w przeglądarce)');

  const refresh = useCallback(() => {
    setLoading(true); setError(null);
    getActiveStorage().list()
      .then(setItems)
      .catch((e) => setError(String(e?.message ?? e)))
      .finally(() => setLoading(false));
  }, [getActiveStorage]);

  useEffect(() => { if (open) refresh(); }, [open, storageMode, refresh]);

  if (!open) return null;

  const goDrive = () => {
    if (!isSignedIn()) {
      alert('Aby użyć Google Drive, najpierw kliknij „Zaloguj Google" w pasku narzędzi.');
      return;
    }
    setStorageMode('drive');
  };

  const onNew = async () => {
    const name = prompt('Nazwa nowego projektu:', 'Nowy projekt');
    if (!name) return;
    try {
      await newProject(name);
      alert(`Utworzono „${name}" — ${where()}.`);
      onClose();
    } catch (e) {
      alert('Błąd tworzenia projektu: ' + ((e as Error)?.message ?? e));
    }
  };

  const onOpen = async (id: string) => {
    try { await openProject(id); onClose(); }
    catch (e) { alert('Błąd otwierania: ' + ((e as Error)?.message ?? e)); }
  };

  const onRename = async (m: ProjectMeta) => {
    const name = prompt('Nowa nazwa:', m.name);
    if (!name) return;
    try { await getActiveStorage().rename(m.id, name); refresh(); }
    catch (e) { alert('Błąd zmiany nazwy: ' + ((e as Error)?.message ?? e)); }
  };

  const onDuplicate = async (m: ProjectMeta) => {
    try { await getActiveStorage().duplicate(m.id, `${m.name} (kopia)`); refresh(); }
    catch (e) { alert('Błąd duplikowania: ' + ((e as Error)?.message ?? e)); }
  };

  const onDelete = async (m: ProjectMeta) => {
    if (!confirm(`Usunąć projekt „${m.name}"? Tej operacji nie można cofnąć.`)) return;
    try { await getActiveStorage().remove(m.id); refresh(); }
    catch (e) { alert('Błąd usuwania: ' + ((e as Error)?.message ?? e)); }
  };

  const onSaveNow = async () => {
    try {
      // Brak aktywnego projektu — utworz nowy plik zamiast cichego nic-nie-robienia.
      if (!currentProjectId) {
        const name = prompt('Nazwa projektu do zapisania:', 'Nowy projekt');
        if (!name) return;
        await saveAsProject(name);
        alert(`Zapisano „${name}" — ${where()}.`);
        refresh();
        return;
      }
      const res = await saveCurrent();
      if (res.conflict) {
        if (confirm('Ten projekt zmienił się w międzyczasie. OK = nadpisz mimo to, Anuluj = wczytaj nowszą wersję.')) {
          useProjectStore.setState({ currentProjectUpdatedAt: null });
          await saveCurrent();
        } else {
          await openProject(currentProjectId);
          refresh();
          return;
        }
      }
      alert(`Zapisano — ${where()}.`);
      refresh();
    } catch (e) {
      alert('Błąd zapisu: ' + ((e as Error)?.message ?? e));
    }
  };

  const signedIn = isSignedIn();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="w-[560px] max-h-[80vh] flex flex-col bg-white rounded-lg shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-3 border-b border-gray-200">
          <h2 className="text-sm font-bold text-gray-800">Projekty</h2>
          <div className="flex gap-1 text-xs">
            <button onClick={() => setStorageMode('local')}
              className={`px-2 py-1 rounded ${storageMode === 'local' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>Lokalne</button>
            <button onClick={goDrive}
              className={`px-2 py-1 rounded ${storageMode === 'drive' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>Drive</button>
          </div>
        </div>

        {/* Status trybu / logowania — dla jasnosci gdzie trafia zapis */}
        <div className="px-3 py-1.5 text-[11px] border-b border-gray-100">
          {storageMode === 'drive'
            ? (signedIn
                ? <span className="text-green-700">Drive — zalogowano{getEmail() ? ` jako ${getEmail()}` : ''}. Zapisy trafiają do współdzielonego folderu.</span>
                : <span className="text-red-600">Drive wybrany, ale NIE jesteś zalogowany — kliknij „Zaloguj Google" w pasku.</span>)
            : <span className="text-gray-600">Tryb lokalny (zapis w przeglądarce). Zaloguj się i wybierz „Drive", aby zapisać na Google Drive.</span>}
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
          <button onClick={onSaveNow} className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 mr-2">Zapisz teraz</button>
          <button onClick={onClose} className="px-3 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200">Zamknij</button>
        </div>
      </div>
    </div>
  );
}
