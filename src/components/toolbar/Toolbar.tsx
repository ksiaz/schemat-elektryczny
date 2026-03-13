import { useProjectStore } from '../../store/projectStore.ts';
import type { SheetFormat } from '../../types/index.ts';

const FORMATS: SheetFormat[] = ['A4', 'A3', 'A2'];

export function Toolbar() {
  const {
    projectName, setProjectName,
    schematicFormat, setSchematicFormat,
    undo, redo, saveProject,
    schematicPast, schematicFuture, isDirty,
    edgeType, setEdgeType,
  } = useProjectStore();

  return (
    <header className="h-12 bg-white border-b border-gray-200 flex items-center gap-4 px-4">
      {/* Nazwa projektu */}
      <input
        type="text"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
        className="text-sm font-semibold bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none px-1 py-0.5 w-48"
        placeholder="Nazwa projektu"
      />

      {isDirty && <span className="text-xs text-orange-500">●</span>}

      <div className="h-6 w-px bg-gray-200" />

      {/* Format arkusza */}
      <div className="flex items-center gap-1">
        <span className="text-xs text-gray-500">Format:</span>
        {FORMATS.map((f) => (
          <button
            key={f}
            onClick={() => setSchematicFormat(f)}
            className={`px-2 py-0.5 text-xs rounded ${
              schematicFormat === f
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="h-6 w-px bg-gray-200" />

      {/* Typ polaczenia */}
      <div className="flex items-center gap-1">
        <span className="text-xs text-gray-500">Linia:</span>
        {([
          ['multilineAc', 'AC 5-żył'],
          ['dcLine', 'DC'],
          ['cable', 'Kabel'],
        ] as const).map(([type, label]) => (
          <button
            key={type}
            onClick={() => setEdgeType(type)}
            className={`px-2 py-0.5 text-xs rounded ${
              edgeType === type
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="h-6 w-px bg-gray-200" />

      {/* Undo / Redo */}
      <button
        onClick={undo}
        disabled={schematicPast.length === 0}
        className="px-2 py-1 text-sm rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
        title="Cofnij (Ctrl+Z)"
      >
        ↩ Cofnij
      </button>
      <button
        onClick={redo}
        disabled={schematicFuture.length === 0}
        className="px-2 py-1 text-sm rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
        title="Ponów (Ctrl+Y)"
      >
        ↪ Ponów
      </button>

      <div className="h-6 w-px bg-gray-200" />

      {/* Zapis */}
      <button
        onClick={saveProject}
        className="px-2 py-1 text-sm rounded hover:bg-gray-100"
        title="Zapisz (Ctrl+S)"
      >
        Zapisz
      </button>
    </header>
  );
}
