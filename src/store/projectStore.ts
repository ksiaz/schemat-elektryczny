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
import type { ProjectData } from '../types/project.ts';

const MAX_HISTORY = 50;
const AUTOSAVE_INTERVAL = 30_000;
const STORAGE_KEY = 'schemat-pv-project';

interface ProjectState {
  // Metadane
  projectName: string;
  projectInfo: ProjectInfo;
  activeSheet: 'schematic' | 'singleLine' | 'layout';
  schematicFormat: SheetFormat;
  layoutFormat: SheetFormat;
  isDirty: boolean;

  // Schemat
  nodes: Node<SchematicNodeData>[];
  edges: Edge[];

  // Layout (Etap 7)
  layoutNodes: Node[];
  layoutEdges: Edge[];

  // Single line
  singleLineNodes: Node<SchematicNodeData>[];
  singleLineEdges: Edge[];
  singleLinePast: HistoryEntry[];
  singleLineFuture: HistoryEntry[];
  singleLineFormat: SheetFormat;

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

  // Akcje — single line
  setSingleLineNodes: (nodes: Node<SchematicNodeData>[]) => void;
  setSingleLineEdges: (edges: Edge[]) => void;
  onSingleLineNodesChange: (changes: NodeChange<Node<SchematicNodeData>>[]) => void;
  onSingleLineEdgesChange: (changes: EdgeChange[]) => void;
  pushSingleLineHistory: () => void;
  setSingleLineFormat: (format: SheetFormat) => void;

  // Zaznaczenie edge
  selectedEdgeId: string | null;
  setSelectedEdgeId: (id: string | null) => void;

  // Undo/redo
  undo: () => void;
  redo: () => void;

  // Projekt
  setProjectName: (name: string) => void;
  setSchematicFormat: (format: SheetFormat) => void;
  setActiveSheet: (sheet: 'schematic' | 'singleLine' | 'layout') => void;
  saveProject: () => void;
  loadProject: (json: string) => void;
  getProjectData: () => ProjectData;
  applyProjectData: (data: ProjectData) => void;

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
    address: '',
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
  singleLineNodes: [],
  singleLineEdges: [],
  singleLinePast: [],
  singleLineFuture: [],
  singleLineFormat: 'A4',

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
    if (state.activeSheet === 'layout') {
      state.pushLayoutHistory();
      set({ layoutNodes: [...state.layoutNodes, node], isDirty: true });
    } else if (state.activeSheet === 'singleLine') {
      state.pushSingleLineHistory();
      set({ singleLineNodes: [...state.singleLineNodes, node], isDirty: true });
    } else {
      state.pushHistory();
      set({ nodes: [...state.nodes, node], isDirty: true });
    }
  },

  deleteSelectedNodes: () => {
    const state = get();
    const sheet = state.activeSheet;

    // Edge selected
    if (state.selectedEdgeId) {
      if (sheet === 'layout') {
        state.pushLayoutHistory();
        set({
          layoutEdges: state.layoutEdges.filter((e) => e.id !== state.selectedEdgeId),
          selectedEdgeId: null, isDirty: true,
        });
      } else if (sheet === 'singleLine') {
        state.pushSingleLineHistory();
        set({
          singleLineEdges: state.singleLineEdges.filter((e) => e.id !== state.selectedEdgeId),
          selectedEdgeId: null, isDirty: true,
        });
      } else {
        state.pushHistory();
        set({
          edges: state.edges.filter((e) => e.id !== state.selectedEdgeId),
          selectedEdgeId: null, isDirty: true,
        });
      }
      return;
    }

    // Node selected
    if (!state.selectedNodeId) return;
    if (sheet === 'layout') {
      state.pushLayoutHistory();
      set({
        layoutNodes: state.layoutNodes.filter((n) => n.id !== state.selectedNodeId),
        layoutEdges: state.layoutEdges.filter(
          (e) => e.source !== state.selectedNodeId && e.target !== state.selectedNodeId
        ),
        selectedNodeId: null, isDirty: true,
      });
    } else if (sheet === 'singleLine') {
      state.pushSingleLineHistory();
      set({
        singleLineNodes: state.singleLineNodes.filter((n) => n.id !== state.selectedNodeId),
        singleLineEdges: state.singleLineEdges.filter(
          (e) => e.source !== state.selectedNodeId && e.target !== state.selectedNodeId
        ),
        selectedNodeId: null, isDirty: true,
      });
    } else {
      state.pushHistory();
      set({
        nodes: state.nodes.filter((n) => n.id !== state.selectedNodeId),
        edges: state.edges.filter(
          (e) => e.source !== state.selectedNodeId && e.target !== state.selectedNodeId
        ),
        selectedNodeId: null, isDirty: true,
      });
    }
  },

  updateNodeData: (nodeId, data) => {
    const state = get();
    if (state.activeSheet === 'layout') {
      state.pushLayoutHistory();
      set({
        layoutNodes: state.layoutNodes.map((n) =>
          n.id === nodeId ? { ...n, data: { ...n.data, ...data } } : n
        ),
        isDirty: true,
      });
    } else if (state.activeSheet === 'singleLine') {
      state.pushSingleLineHistory();
      set({
        singleLineNodes: state.singleLineNodes.map((n) =>
          n.id === nodeId ? { ...n, data: { ...n.data, ...data } } : n
        ),
        isDirty: true,
      });
    } else {
      state.pushHistory();
      set({
        nodes: state.nodes.map((n) =>
          n.id === nodeId ? { ...n, data: { ...n.data, ...data } } : n
        ),
        isDirty: true,
      });
    }
  },

  updateEdgeData: (edgeId, data) => {
    const state = get();
    if (state.activeSheet === 'layout') {
      state.pushLayoutHistory();
      set({
        layoutEdges: state.layoutEdges.map((e) =>
          e.id === edgeId ? { ...e, data: { ...e.data, ...data } } : e
        ),
        isDirty: true,
      });
    } else if (state.activeSheet === 'singleLine') {
      state.pushSingleLineHistory();
      set({
        singleLineEdges: state.singleLineEdges.map((e) =>
          e.id === edgeId ? { ...e, data: { ...e.data, ...data } } : e
        ),
        isDirty: true,
      });
    } else {
      state.pushHistory();
      set({
        edges: state.edges.map((e) =>
          e.id === edgeId ? { ...e, data: { ...e.data, ...data } } : e
        ),
        isDirty: true,
      });
    }
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
    const state = get();
    if (state.activeSheet === 'singleLine') {
      if (state.singleLinePast.length === 0) return;
      const prev = state.singleLinePast[state.singleLinePast.length - 1];
      set({
        singleLinePast: state.singleLinePast.slice(0, -1),
        singleLineFuture: [{ nodes: state.singleLineNodes, edges: state.singleLineEdges }, ...state.singleLineFuture],
        singleLineNodes: prev.nodes,
        singleLineEdges: prev.edges,
        isDirty: true,
      });
      return;
    }
    if (state.activeSheet === 'layout') {
      if (state.layoutPast.length === 0) return;
      const prev = state.layoutPast[state.layoutPast.length - 1];
      set({
        layoutPast: state.layoutPast.slice(0, -1),
        layoutFuture: [{ nodes: state.layoutNodes as Node<SchematicNodeData>[], edges: state.layoutEdges }, ...state.layoutFuture],
        layoutNodes: prev.nodes,
        layoutEdges: prev.edges,
        isDirty: true,
      });
      return;
    }
    if (state.schematicPast.length === 0) return;
    const prev = state.schematicPast[state.schematicPast.length - 1];
    set({
      schematicPast: state.schematicPast.slice(0, -1),
      schematicFuture: [{ nodes: state.nodes, edges: state.edges }, ...state.schematicFuture],
      nodes: prev.nodes,
      edges: prev.edges,
      isDirty: true,
    });
  },

  redo: () => {
    const state = get();
    if (state.activeSheet === 'singleLine') {
      if (state.singleLineFuture.length === 0) return;
      const next = state.singleLineFuture[0];
      set({
        singleLineFuture: state.singleLineFuture.slice(1),
        singleLinePast: [...state.singleLinePast, { nodes: state.singleLineNodes, edges: state.singleLineEdges }],
        singleLineNodes: next.nodes,
        singleLineEdges: next.edges,
        isDirty: true,
      });
      return;
    }
    if (state.activeSheet === 'layout') {
      if (state.layoutFuture.length === 0) return;
      const next = state.layoutFuture[0];
      set({
        layoutFuture: state.layoutFuture.slice(1),
        layoutPast: [...state.layoutPast, { nodes: state.layoutNodes as Node<SchematicNodeData>[], edges: state.layoutEdges }],
        layoutNodes: next.nodes,
        layoutEdges: next.edges,
        isDirty: true,
      });
      return;
    }
    if (state.schematicFuture.length === 0) return;
    const next = state.schematicFuture[0];
    set({
      schematicFuture: state.schematicFuture.slice(1),
      schematicPast: [...state.schematicPast, { nodes: state.nodes, edges: state.edges }],
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
      singleLineNodes: state.singleLineNodes,
      singleLineEdges: state.singleLineEdges,
      singleLineFormat: state.singleLineFormat,
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

  getProjectData: () => {
    const s = get();
    return {
      projectName: s.projectName,
      projectInfo: s.projectInfo,
      schematicFormat: s.schematicFormat,
      layoutFormat: s.layoutFormat,
      nodes: s.nodes,
      edges: s.edges,
      layoutNodes: s.layoutNodes,
      layoutEdges: s.layoutEdges,
      singleLineNodes: s.singleLineNodes,
      singleLineEdges: s.singleLineEdges,
      singleLineFormat: s.singleLineFormat,
      labelCounters: s.labelCounters,
    };
  },

  applyProjectData: (data) => {
    set({
      projectName: data.projectName ?? 'Nowy projekt',
      projectInfo: data.projectInfo ?? get().projectInfo,
      schematicFormat: data.schematicFormat ?? 'A4',
      layoutFormat: data.layoutFormat ?? 'A4',
      nodes: data.nodes ?? [],
      edges: data.edges ?? [],
      layoutNodes: data.layoutNodes ?? [],
      layoutEdges: data.layoutEdges ?? [],
      singleLineNodes: data.singleLineNodes ?? [],
      singleLineEdges: data.singleLineEdges ?? [],
      singleLineFormat: data.singleLineFormat ?? 'A4',
      singleLinePast: [], singleLineFuture: [],
      labelCounters: data.labelCounters ?? {},
      schematicPast: [], schematicFuture: [],
      layoutPast: [], layoutFuture: [],
      isDirty: false,
    });
  },

  loadProject: (json) => {
    try {
      get().applyProjectData(JSON.parse(json) as ProjectData);
    } catch {
      console.error('Blad wczytywania projektu');
    }
  },

  // --- Akcje single line ---
  setSingleLineNodes: (singleLineNodes) => set({ singleLineNodes, isDirty: true }),
  setSingleLineEdges: (singleLineEdges) => set({ singleLineEdges, isDirty: true }),
  setSingleLineFormat: (format) => set({ singleLineFormat: format, isDirty: true }),

  onSingleLineNodesChange: (changes) => {
    set((state) => ({
      singleLineNodes: applyNodeChanges(changes, state.singleLineNodes),
      isDirty: true,
    }));
  },

  onSingleLineEdgesChange: (changes) => {
    set((state) => ({
      singleLineEdges: applyEdgeChanges(changes, state.singleLineEdges),
      isDirty: true,
    }));
  },

  pushSingleLineHistory: () => {
    set((state) => ({
      singleLinePast: [
        ...state.singleLinePast.slice(-MAX_HISTORY + 1),
        { nodes: state.singleLineNodes, edges: state.singleLineEdges },
      ],
      singleLineFuture: [],
    }));
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
