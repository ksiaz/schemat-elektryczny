import { useEffect } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { Toolbar } from './components/toolbar/Toolbar.tsx';
import { Sidebar } from './components/sidebar/Sidebar.tsx';
import { SchematicCanvas } from './components/canvas/SchematicCanvas.tsx';
import { LayoutCanvas } from './components/canvas/LayoutCanvas.tsx';
import { SingleLineCanvas } from './components/canvas/SingleLineCanvas.tsx';
import { PropertiesPanel } from './components/properties/PropertiesPanel.tsx';
import { useProjectStore, startAutosave, stopAutosave } from './store/projectStore.ts';

function App() {
  const { undo, redo, saveProject, deleteSelectedNodes, activeSheet } = useProjectStore();

  // Auto-zapis
  useEffect(() => {
    startAutosave();
    return () => stopAutosave();
  }, []);

  // Wczytaj projekt z localStorage przy starcie
  useEffect(() => {
    const saved = localStorage.getItem('schemat-pv-project');
    if (saved) {
      useProjectStore.getState().loadProject(saved);
    }
  }, []);

  // Skroty klawiaturowe
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        undo();
      }
      if (e.ctrlKey && e.key === 'y') {
        e.preventDefault();
        redo();
      }
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        saveProject();
      }
      if (e.key === 'Delete') {
        e.preventDefault();
        deleteSelectedNodes();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, saveProject, deleteSelectedNodes]);

  return (
    <ReactFlowProvider>
      <div className="h-screen flex flex-col bg-white">
        <Toolbar />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          {activeSheet === 'schematic' && <SchematicCanvas />}
          {activeSheet === 'singleLine' && <SingleLineCanvas />}
          {activeSheet === 'layout' && <LayoutCanvas />}
          <PropertiesPanel />
        </div>
      </div>
    </ReactFlowProvider>
  );
}

export default App;
