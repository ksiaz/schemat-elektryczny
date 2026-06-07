import { useState } from 'react';
import { useProjectStore } from '../../store/projectStore.ts';
import { exportToSvg } from '../../utils/exportSvg.ts';
import { exportToJpg } from '../../utils/exportJpg.ts';
import { exportToPdf } from '../../utils/exportPdf.ts';
import { exportProjectToFile, importProjectFromFile } from '../../utils/fileIO.ts';
import { TemplateDialog } from './TemplateDialog.tsx';
import { ProjectsModal } from '../projects/ProjectsModal.tsx';
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
  const isSingleLine = activeSheet === 'singleLine';
  const [templateOpen, setTemplateOpen] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(false);

  return (
    <header className="h-12 bg-white border-b border-gray-200 flex items-center gap-4 px-4">
      {/* Nazwa projektu */}
      <input
        type="text"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
        className="text-sm font-semibold bg-transparent text-gray-800 border-b border-transparent hover:border-gray-500 focus:border-blue-400 focus:outline-none px-1 py-0.5 w-48"
        placeholder="Nazwa projektu"
      />

      {isDirty && <span className="text-xs text-orange-400">●</span>}

      <div className="h-6 w-px bg-gray-200" />

      {/* Zakladki: Schemat / Jednokreskowy / Lokalizacja */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => setActiveSheet('schematic')}
          className={`px-3 py-1 text-xs rounded ${
            activeSheet === 'schematic' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          Wielokreskowy
        </button>
        <button
          onClick={() => setActiveSheet('singleLine')}
          className={`px-3 py-1 text-xs rounded ${
            activeSheet === 'singleLine' ? 'bg-blue-700 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          Jednokreskowy
        </button>
        <button
          onClick={() => setActiveSheet('layout')}
          className={`px-3 py-1 text-xs rounded ${
            activeSheet === 'layout' ? 'bg-amber-700 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          Lokalizacja
        </button>
      </div>

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
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {!isSingleLine && !isLayout && (
        <>
          <div className="h-6 w-px bg-gray-200" />

          {/* Typ polaczenia */}
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-500">Linia:</span>
            {([
              ['acL1', 'L1'],
              ['acL2', 'L2'],
              ['acL3', 'L3'],
              ['acN', 'N'],
              ['dcLine', 'DC'],
              ['cable', 'Kabel'],
              ['dcPlus', 'DC+'],
              ['dcMinus', 'DC-'],
              ['pe', 'PE'],
            ] as const).map(([type, label]) => (
              <button
                key={type}
                onClick={() => setEdgeType(type)}
                className={`px-2 py-0.5 text-xs rounded ${
                  edgeType === type
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="h-6 w-px bg-gray-200" />

          {/* Tryb trasowania */}
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-500">Trasa:</span>
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
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </>
      )}

      <div className="h-6 w-px bg-gray-200" />

      {/* Undo / Redo */}
      <button
        onClick={undo}
        disabled={schematicPast.length === 0}
        className="px-2 py-1 text-sm rounded text-gray-600 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
        title="Cofnij (Ctrl+Z)"
      >
        ↩ Cofnij
      </button>
      <button
        onClick={redo}
        disabled={schematicFuture.length === 0}
        className="px-2 py-1 text-sm rounded text-gray-600 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
        title="Ponów (Ctrl+Y)"
      >
        ↪ Ponów
      </button>

      <div className="h-6 w-px bg-gray-200" />

      {/* Zapis */}
      <button
        onClick={saveProject}
        className="px-2 py-1 text-sm text-gray-600 rounded hover:bg-gray-200"
        title="Zapisz (Ctrl+S)"
      >
        Zapisz
      </button>

      <div className="h-6 w-px bg-gray-200" />

      {/* Eksport / Import */}
      <button
        onClick={() => exportToPdf(schematicFormat, projectName)}
        className="px-2 py-1 text-xs text-gray-600 rounded hover:bg-gray-200"
        title="Eksport PDF"
      >
        PDF
      </button>
      <button
        onClick={() => exportToJpg(schematicFormat, projectName)}
        className="px-2 py-1 text-xs text-gray-600 rounded hover:bg-gray-200"
        title="Eksport JPG"
      >
        JPG
      </button>
      <button
        onClick={() => exportToSvg(schematicFormat, projectName)}
        className="px-2 py-1 text-xs text-gray-600 rounded hover:bg-gray-200"
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
            singleLineFormat: state.singleLineFormat,
            nodes: state.nodes,
            edges: state.edges,
            layoutNodes: state.layoutNodes,
            layoutEdges: state.layoutEdges,
            singleLineNodes: state.singleLineNodes,
            singleLineEdges: state.singleLineEdges,
            labelCounters: state.labelCounters,
          });
          exportProjectToFile(data, state.projectName);
        }}
        className="px-2 py-1 text-xs text-gray-600 rounded hover:bg-gray-200"
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
        className="px-2 py-1 text-xs text-gray-600 rounded hover:bg-gray-200"
        title="Wczytaj projekt JSON"
      >
        Wczytaj
      </button>

      <div className="h-6 w-px bg-gray-200" />

      {/* Szablony */}
      <button
        onClick={() => setTemplateOpen(true)}
        className="px-2 py-1 text-xs rounded bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
        title="Wczytaj szablon instalacji"
      >
        Szablony
      </button>

      {/* Projekty */}
      <button
        onClick={() => setProjectsOpen(true)}
        className="px-2 py-1 text-xs bg-gray-100 rounded border border-gray-300 hover:bg-gray-200"
      >
        Projekty
      </button>

      <TemplateDialog open={templateOpen} onClose={() => setTemplateOpen(false)} />
      <ProjectsModal open={projectsOpen} onClose={() => setProjectsOpen(false)} />
    </header>
  );
}
