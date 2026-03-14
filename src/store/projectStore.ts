// src/store/projectStore.ts
import { create } from 'zustand';
import {
  applyNodeChanges,
  applyEdgeChanges,
  type Node,
  type Edge,
  type NodeChange,
  type EdgeChange,
} from '@xyflow/react';
import type {
  SchematicNodeData,
  ProjectInfo,
  SheetFormat,
  HistoryEntry,
} from '../types/index.ts';

const MAX_HISTORY = 50;
const AUTOSAVE_INTERVAL = 30_000;
const STORAGE_KEY = 'schemat-pv-project';

interface ProjectState {
  // Metadane
  projectName: string;
  projectInfo: ProjectInfo;
  activeSheet: 'schematic' | 'layout';
  schematicFormat: SheetFormat;
  layoutFormat: SheetFormat;
  isDirty: boolean;

  // Schemat
  nodes: Node<SchematicNodeData>[];
  edges: Edge[];

  // Layout (Etap 7)
  layoutNodes: Node[];
  layoutEdges: Edge[];

  // Historia — osobna per modul
  schematicPast: HistoryEntry[];
  schematicFuture: HistoryEntry[];
  layoutPast: HistoryEntry[];
  layoutFuture: HistoryEntry[];

  // Akcje — schemat
  setNodes: (nodes: Node<SchematicNodeData>[]) => void;
  setEdges: (edges: Edge[]) => void;
  onNodesChange: (changes: NodeChange<Node<SchematicNodeData>>[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  addNode: (node: Node<SchematicNodeData>) => void;
  deleteSelectedNodes: () => void;
  pushHistory: () => void;
  updateNodeData: (nodeId: string, data: Partial<SchematicNodeData>) => void;
  updateEdgeData: (edgeId: string, data: Record<string, unknown>) => void;

  // Akcje — layout
  setLayoutNodes: (nodes: Node[]) => void;
  setLayoutEdges: (edges: Edge[]) => void;
  onLayoutNodesChange: (changes: NodeChange[]) => void;
  onLayoutEdgesChange: (changes: EdgeChange[]) => void;
  pushLayoutHistory: () => void;

  // Zaznaczenie edge
  selectedEdgeId: string | null;
  setSelectedEdgeId: (id: string | null) => void;

  // Undo/redo
  undo: () => void;
  redo: () => void;

  // Projekt
  setProjectName: (name: string) => void;
  setSchematicFormat: (format: SheetFormat) => void;
  setActiveSheet: (sheet: 'schematic' | 'layout') => void;
  saveProject: () => void;
  loadProject: (json: string) => void;

  // Zaznaczenie
  selectedNodeId: string | null;
  setSelectedNodeId: (id: string | null) => void;

  // Typ polaczenia (wybierany w toolbarze)
  edgeType: 'acL1' | 'acL2' | 'acL3' | 'acN' | 'dcLine' | 'cable' | 'dcPlus' | 'dcMinus' | 'pe';
  setEdgeType: (type: 'acL1' | 'acL2' | 'acL3' | 'acN' | 'dcLine' | 'cable' | 'dcPlus' | 'dcMinus' | 'pe') => void;

  // Tryb trasowania polaczen
  routingMode: 'auto' | 'manual';
  setRoutingMode: (mode: 'auto' | 'manual') => void;

  // Autonumeracja
  labelCounters: Record<string, number>;
}

// Pomocnicza — generuje nastepna etykiete bez side effects
function nextLabel(designation: string, counters: Record<string, number>): [string, Record<string, number>] {
  if (!designation) return ['', counters];
  const updated = { ...counters };
  const count = (updated[designation] ?? 0) + 1;
  updated[designation] = count;
  return [`${designation}${count}`, updated];
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projectName: 'Nowy projekt',
  projectInfo: {
    projectName: '',
    drawingNumber: 'E-01',
    revision: 'A',
    designer: '',
    date: new Date().toLocaleDateString('pl-PL'),
    scale: 'bez skali',
    format: 'A4',
  },
  activeSheet: 'schematic',
  schematicFormat: 'A4',
  layoutFormat: 'A4',
  isDirty: false,

  nodes: [],
  edges: [],
  layoutNodes: [],
  layoutEdges: [],

  schematicPast: [],
  schematicFuture: [],
  layoutPast: [],
  layoutFuture: [],

  selectedNodeId: null,
  selectedEdgeId: null,
  edgeType: 'cable',
  routingMode: 'auto',
  labelCounters: {},

  setNodes: (nodes) => set({ nodes, isDirty: true }),
  setEdges: (edges) => set({ edges, isDirty: true }),

  onNodesChange: (changes) => {
    set((state) => ({
      nodes: applyNodeChanges(changes, state.nodes),
      isDirty: true,
    }));
  },

  onEdgesChange: (changes) => {
    set((state) => ({
      edges: applyEdgeChanges(changes, state.edges),
      isDirty: true,
    }));
  },

  addNode: (node) => {
    const state = get();
    state.pushHistory();
    set({
      nodes: [...state.nodes, node],
      isDirty: true,
    });
  },

  deleteSelectedNodes: () => {
    const state = get();

    // Usun zaznaczony edge
    if (state.selectedEdgeId) {
      state.pushHistory();
      set({
        edges: state.edges.filter((e) => e.id !== state.selectedEdgeId),
        selectedEdgeId: null,
        isDirty: true,
      });
      return;
    }

    // Usun zaznaczony node (+ powiazane edge)
    if (!state.selectedNodeId) return;
    state.pushHistory();
    set({
      nodes: state.nodes.filter((n) => n.id !== state.selectedNodeId),
      edges: state.edges.filter(
        (e) => e.source !== state.selectedNodeId && e.target !== state.selectedNodeId
      ),
      selectedNodeId: null,
      isDirty: true,
    });
  },

  updateNodeData: (nodeId, data) => {
    const state = get();
    state.pushHistory();
    set({
      nodes: state.nodes.map((n) =>
        n.id === nodeId
          ? { ...n, data: { ...n.data, ...data } }
          : n
      ),
      isDirty: true,
    });
  },

  updateEdgeData: (edgeId, data) => {
    const state = get();
    state.pushHistory();
    set({
      edges: state.edges.map((e) =>
        e.id === edgeId
          ? { ...e, data: { ...e.data, ...data } }
          : e
      ),
      isDirty: true,
    });
  },

  setSelectedEdgeId: (id) => set({ selectedEdgeId: id }),

  pushHistory: () => {
    set((state) => ({
      schematicPast: [
        ...state.schematicPast.slice(-MAX_HISTORY + 1),
        { nodes: state.nodes, edges: state.edges },
      ],
      schematicFuture: [],
    }));
  },

  undo: () => {
    const { schematicPast, nodes, edges } = get();
    if (schematicPast.length === 0) return;
    const previous = schematicPast[schematicPast.length - 1];
    set({
      schematicPast: schematicPast.slice(0, -1),
      schematicFuture: [{ nodes, edges }, ...get().schematicFuture],
      nodes: previous.nodes,
      edges: previous.edges,
      isDirty: true,
    });
  },

  redo: () => {
    const { schematicFuture, nodes, edges } = get();
    if (schematicFuture.length === 0) return;
    const next = schematicFuture[0];
    set({
      schematicFuture: schematicFuture.slice(1),
      schematicPast: [...get().schematicPast, { nodes, edges }],
      nodes: next.nodes,
      edges: next.edges,
      isDirty: true,
    });
  },

  setProjectName: (name) => set({ projectName: name, isDirty: true }),
  setSchematicFormat: (format) => set({ schematicFormat: format, isDirty: true }),
  setActiveSheet: (sheet) => set({ activeSheet: sheet }),

  saveProject: () => {
    const state = get();
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
    try {
      localStorage.setItem(STORAGE_KEY, data);
      set({ isDirty: false });
    } catch {
      // localStorage pelny — fallback: pobierz jako plik JSON
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${state.projectName || 'projekt'}.json`;
      a.click();
      URL.revokeObjectURL(url);
      set({ isDirty: false });
    }
  },

  loadProject: (json) => {
    try {
      const data = JSON.parse(json);
      set({
        projectName: data.projectName ?? 'Nowy projekt',
        projectInfo: data.projectInfo ?? get().projectInfo,
        schematicFormat: data.schematicFormat ?? 'A4',
        layoutFormat: data.layoutFormat ?? 'A4',
        nodes: data.nodes ?? [],
        edges: data.edges ?? [],
        layoutNodes: data.layoutNodes ?? [],
        layoutEdges: data.layoutEdges ?? [],
        labelCounters: data.labelCounters ?? {},
        schematicPast: [],
        schematicFuture: [],
        layoutPast: [],
        layoutFuture: [],
        isDirty: false,
      });
    } catch {
      console.error('Blad wczytywania projektu');
    }
  },

  // --- Akcje layout ---
  setLayoutNodes: (layoutNodes) => set({ layoutNodes, isDirty: true }),
  setLayoutEdges: (layoutEdges) => set({ layoutEdges, isDirty: true }),

  onLayoutNodesChange: (changes) => {
    set((state) => ({
      layoutNodes: applyNodeChanges(changes, state.layoutNodes),
      isDirty: true,
    }));
  },

  onLayoutEdgesChange: (changes) => {
    set((state) => ({
      layoutEdges: applyEdgeChanges(changes, state.layoutEdges),
      isDirty: true,
    }));
  },

  pushLayoutHistory: () => {
    set((state) => ({
      layoutPast: [
        ...state.layoutPast.slice(-MAX_HISTORY + 1),
        { nodes: state.layoutNodes as Node<SchematicNodeData>[], edges: state.layoutEdges },
      ],
      layoutFuture: [],
    }));
  },

  setSelectedNodeId: (id) => set({ selectedNodeId: id }),
  setEdgeType: (type) => set({ edgeType: type }),
  setRoutingMode: (mode) => set({ routingMode: mode }),
}));

// --- Auto-zapis ---
let autosaveTimer: ReturnType<typeof setInterval> | null = null;

export function startAutosave() {
  if (autosaveTimer) return;
  autosaveTimer = setInterval(() => {
    const state = useProjectStore.getState();
    if (state.isDirty) {
      state.saveProject();
    }
  }, AUTOSAVE_INTERVAL);
}

export function stopAutosave() {
  if (autosaveTimer) {
    clearInterval(autosaveTimer);
    autosaveTimer = null;
  }
}

// --- Ostrzezenie beforeunload ---
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', (e) => {
    if (useProjectStore.getState().isDirty) {
      e.preventDefault();
    }
  });
}

// --- Helper do generowania etykiety ---
export function generateNextLabel(designation: string): string {
  const state = useProjectStore.getState();
  const [label, updatedCounters] = nextLabel(designation, state.labelCounters);
  useProjectStore.setState({ labelCounters: updatedCounters });
  return label;
}
