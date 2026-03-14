import { useState } from 'react';
import { useProjectStore } from '../../store/projectStore.ts';
import { exportToSvg } from '../../utils/exportSvg.ts';
import { exportProjectToFile, importProjectFromFile } from '../../utils/fileIO.ts';
import { TemplateDialog } from './TemplateDialog.tsx';
import type { SheetFormat } from '../../types/index.ts';

const FORMATS: SheetFormat[] = ['A4', 'A3', 'A2'];

export function Toolbar() {
  const {
    projectName, setProjectName,
    schematicFormat, setSchematicFormat,
    activeSheet, setActiveSheet,
    undo, redo, saveProject,
    schematicPast, schematicFuture, isDirty,
    edgeType, setEdgeType,
    routingMode, setRoutingMode,
  } = useProjectStore();

  const isLayout = activeSheet === 'layout';
  const [templateOpen, setTemplateOpen] = useState(false);

  return (
    <header className="h-12 bg-[#252540] border-b border-[#3a3a5c] flex items-center gap-4 px-4">
      {/* Nazwa projektu */}
      <input
        type="text"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
        className="text-sm font-semibold bg-transparent text-gray-200 border-b border-transparent hover:border-gray-500 focus:border-blue-400 focus:outline-none px-1 py-0.5 w-48"
        placeholder="Nazwa projektu"
      />

      {isDirty && <span className="text-xs text-orange-400">●</span>}

      <div className="h-6 w-px bg-[#3a3a5c]" />

      {/* Zakladki: Schemat / Lokalizacja */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => setActiveSheet('schematic')}
          className={`px-3 py-1 text-xs rounded ${
            !isLayout ? 'bg-gray-800 text-white' : 'bg-[#2a2a45] text-gray-400 hover:bg-[#3a3a5c]'
          }`}
        >
          Schemat
        </button>
        <button
          onClick={() => setActiveSheet('layout')}
          className={`px-3 py-1 text-xs rounded ${
            isLayout ? 'bg-amber-700 text-white' : 'bg-[#2a2a45] text-gray-400 hover:bg-[#3a3a5c]'
          }`}
        >
          Lokalizacja
        </button>
      </div>

      <div className="h-6 w-px bg-[#3a3a5c]" />

      {/* Format arkusza */}
      <div className="flex items-center gap-1">
        <span className="text-xs text-gray-400">Format:</span>
        {FORMATS.map((f) => (
          <button
            key={f}
            onClick={() => setSchematicFormat(f)}
            className={`px-2 py-0.5 text-xs rounded ${
              schematicFormat === f
                ? 'bg-blue-500 text-white'
                : 'bg-[#2a2a45] text-gray-400 hover:bg-[#3a3a5c]'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="h-6 w-px bg-[#3a3a5c]" />

      {/* Typ polaczenia */}
      <div className="flex items-center gap-1">
        <span className="text-xs text-gray-400">Linia:</span>
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
                : 'bg-[#2a2a45] text-gray-400 hover:bg-[#3a3a5c]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="h-6 w-px bg-[#3a3a5c]" />

      {/* Tryb trasowania */}
      <div className="flex items-center gap-1">
        <span className="text-xs text-gray-400">Trasa:</span>
        {([
          ['auto', 'Auto'],
          ['manual', 'Ręczna'],
        ] as const).map(([mode, label]) => (
          <button
            key={mode}
            onClick={() => setRoutingMode(mode)}
            className={`px-2 py-0.5 text-xs rounded ${
              routingMode === mode
                ? 'bg-purple-600 text-white'
                : 'bg-[#2a2a45] text-gray-400 hover:bg-[#3a3a5c]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="h-6 w-px bg-[#3a3a5c]" />

      {/* Undo / Redo */}
      <button
        onClick={undo}
        disabled={schematicPast.length === 0}
        className="px-2 py-1 text-sm rounded text-gray-300 hover:bg-[#3a3a5c] disabled:opacity-30 disabled:cursor-not-allowed"
        title="Cofnij (Ctrl+Z)"
      >
        ↩ Cofnij
      </button>
      <button
        onClick={redo}
        disabled={schematicFuture.length === 0}
        className="px-2 py-1 text-sm rounded text-gray-300 hover:bg-[#3a3a5c] disabled:opacity-30 disabled:cursor-not-allowed"
        title="Ponów (Ctrl+Y)"
      >
        ↪ Ponów
      </button>

      <div className="h-6 w-px bg-[#3a3a5c]" />

      {/* Zapis */}
      <button
        onClick={saveProject}
        className="px-2 py-1 text-sm text-gray-300 rounded hover:bg-[#3a3a5c]"
        title="Zapisz (Ctrl+S)"
      >
        Zapisz
      </button>

      <div className="h-6 w-px bg-[#3a3a5c]" />

      {/* Eksport / Import */}
      <button
        onClick={() => exportToSvg(schematicFormat, projectName)}
        className="px-2 py-1 text-xs text-gray-300 rounded hover:bg-[#3a3a5c]"
        title="Eksport SVG"
      >
        SVG
      </button>
      <button
        onClick={() => {
          const state = useProjectStore.getState();
          const data = JSON.stringify({
            projectName: state.projectName,
            projectInfo: state.projectInfo,
            schematicFormat: state.schematicFormat,
            layoutFormat: state.layoutFormat,
            nodes: state.nodes,
            edges: state.edges,
            layoutNodes: state.layoutNodes,
            layoutEdges: state.layoutEdges,
            labelCounters: state.labelCounters,
          });
          exportProjectToFile(data, state.projectName);
        }}
        className="px-2 py-1 text-xs text-gray-300 rounded hover:bg-[#3a3a5c]"
        title="Eksport JSON"
      >
        JSON
      </button>
      <button
        onClick={async () => {
          try {
            const json = await importProjectFromFile();
            useProjectStore.getState().loadProject(json);
          } catch {
            // Uzytkownik anulowal wybor pliku
          }
        }}
        className="px-2 py-1 text-xs text-gray-300 rounded hover:bg-[#3a3a5c]"
        title="Wczytaj projekt JSON"
      >
        Wczytaj
      </button>

      <div className="h-6 w-px bg-[#3a3a5c]" />

      {/* Szablony */}
      <button
        onClick={() => setTemplateOpen(true)}
        className="px-2 py-1 text-xs rounded bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
        title="Wczytaj szablon instalacji"
      >
        Szablony
      </button>

      <TemplateDialog open={templateOpen} onClose={() => setTemplateOpen(false)} />
    </header>
  );
}
