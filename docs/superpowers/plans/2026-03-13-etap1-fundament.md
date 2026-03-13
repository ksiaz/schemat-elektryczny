# Etap 1 — Fundament: Plan Implementacji

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dzialajacy edytor schematow z canvasem React Flow, sidebar z drag&drop, 5 pierwszych wezlow SVG (falownik, RCD, MCB, szyna AC, uziom), Zustand store z undo/redo, i podstawowymi polaczeniami.

**Architecture:** Aplikacja React 19 + TypeScript z @xyflow/react jako silnikiem canvas. Zustand zarzadza stanem (nodes/edges/historia). Layout: toolbar u gory, sidebar po lewej, canvas w centrum, panel properties po prawej. Tailwind CSS do stylowania UI.

**Tech Stack:** React 19, TypeScript (strict), Vite 8, @xyflow/react, Zustand, Tailwind CSS

**Spec:** `docs/superpowers/specs/2026-03-13-pv-schematic-editor-design.md`

---

## Struktura plikow po zakonczeniu Etapu 1

```
src/
├── App.tsx                          # Glowny layout (toolbar + sidebar + canvas + properties)
├── main.tsx                         # Entry point (bez zmian wzgledem obecnego)
├── index.css                        # Tailwind directives + reset
├── types/
│   └── index.ts                     # Wszystkie typy TS
├── constants/
│   └── index.ts                     # WIRE_COLORS, ELEMENT_DEFINITIONS
├── store/
│   └── projectStore.ts              # Zustand store (nodes, edges, historia, akcje)
├── components/
│   ├── canvas/
│   │   └── SchematicCanvas.tsx       # React Flow wrapper z siatka, drop handler
│   ├── sidebar/
│   │   └── Sidebar.tsx               # Lista elementow, drag start
│   ├── toolbar/
│   │   └── Toolbar.tsx               # Undo/redo, nazwa projektu, format arkusza
│   └── properties/
│       └── PropertiesPanel.tsx       # Panel wlasciwosci (placeholder — Etap 4)
├── nodes/
│   ├── index.ts                      # nodeTypes registry
│   └── ac/
│       ├── InverterNode.tsx          # Falownik DC/AC — symbol SVG
│       ├── RcdNode.tsx               # Wylacznik RCD — symbol SVG
│       ├── McbNode.tsx               # Wylacznik MCB — symbol SVG
│       ├── AcBusbarNode.tsx          # Szyna zbiorcza AC
│       └── GroundNode.tsx            # Symbol uziomu
└── utils/
    └── sheetDimensions.ts           # Wymiary arkuszy A4/A3/A2 w px
```

---

## Chunk 1: Konfiguracja i typy

### Task 1: Konfiguracja Tailwind CSS

**Files:**
- Modify: `src/index.css`
- Create: `postcss.config.js`
- Delete: `src/App.css`

- [ ] **Step 1: Utworz postcss.config.js**

```js
// postcss.config.js
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
```

- [ ] **Step 2: Zastap zawartosc src/index.css**

```css
@import 'tailwindcss';

/* React Flow wymaga pelnej wysokosci */
html, body, #root {
  height: 100%;
  margin: 0;
  padding: 0;
}
```

- [ ] **Step 3: Usun src/App.css**

- [ ] **Step 4: Zweryfikuj build**

Run: `npm run build`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add postcss.config.js src/index.css
git rm src/App.css
git commit -m "chore: konfiguracja Tailwind CSS z PostCSS"
```

---

### Task 2: Typy TypeScript

**Files:**
- Create: `src/types/index.ts`

- [ ] **Step 1: Utworz plik typow**

```typescript
// src/types/index.ts
import type { Node, Edge } from '@xyflow/react';

// --- Formaty arkuszy ---
export type SheetFormat = 'A4' | 'A3' | 'A2';

// --- Kolory zyl ---
export type WireType = 'L1' | 'L2' | 'L3' | 'N' | 'PE' | 'DC';

// --- Kategorie elementow ---
export type ElementCategory = 'dc' | 'ac' | 'inverter' | 'ev' | 'transfer' | 'grounding' | 'enclosure' | 'wiring';

// --- Definicja elementu w bibliotece ---
export interface ElementDefinition {
  id: string;
  name: string;
  category: ElementCategory;
  designation: string;
  nodeType: string;
  defaultLabel: string;
  parameters: ParameterDefinition[];
}

export interface ParameterDefinition {
  key: string;
  label: string;
  type: 'text' | 'number' | 'select';
  unit?: string;
  options?: string[];
  defaultValue?: string | number;
}

// --- Dane wezla (przechowywane w node.data) ---
export interface SchematicNodeData {
  label: string;
  elementId: string;
  designation: string;
  parameters: Record<string, string | number>;
  [key: string]: unknown;
}

// --- Informacje o projekcie (ramka rysunkowa) ---
export interface ProjectInfo {
  projectName: string;
  drawingNumber: string;
  revision: string;
  designer: string;
  date: string;
  scale: string;
  format: SheetFormat;
  companyLogo?: string;
}

// --- Historia undo/redo ---
export interface HistoryEntry {
  nodes: Node<SchematicNodeData>[];
  edges: Edge[];
}

// --- Abstrakcja zapisu ---
export interface StorageAdapter {
  save(projectId: string, data: string): Promise<void>;
  load(projectId: string): Promise<string | null>;
  list(): Promise<string[]>;
  delete(projectId: string): Promise<void>;
}
```

- [ ] **Step 2: Zweryfikuj kompilacje**

Run: `npm run build`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/types/index.ts
git commit -m "feat: typy TypeScript — ElementDefinition, SchematicNodeData, ProjectInfo"
```

---

### Task 3: Stale i wymiary arkuszy

**Files:**
- Create: `src/constants/index.ts`
- Create: `src/utils/sheetDimensions.ts`

- [ ] **Step 1: Utworz stale**

```typescript
// src/constants/index.ts
import type { ElementDefinition, WireType } from '../types/index.ts';

// Kolory zyl wg normy (L1 szary, L2 czarny, L3 brazowy)
export const WIRE_COLORS: Record<WireType, string> = {
  L1: '#808080',
  L2: '#1a1a1a',
  L3: '#8B4513',
  N:  '#0000CD',
  PE: '#228B22',
  DC: '#FF0000',
};

// 5 elementow na Etap 1
export const ELEMENT_DEFINITIONS: ElementDefinition[] = [
  {
    id: 'inverter',
    name: 'Falownik DC/AC',
    category: 'inverter',
    designation: 'U',
    nodeType: 'inverter',
    defaultLabel: 'U1',
    parameters: [
      { key: 'model', label: 'Model', type: 'text' },
      { key: 'power', label: 'Moc', type: 'number', unit: 'kW' },
      { key: 'mppt', label: 'Liczba MPPT', type: 'number', defaultValue: 2 },
      { key: 'type', label: 'Typ', type: 'select', options: ['ON-grid', 'Hybryda', 'Off-grid'] },
    ],
  },
  {
    id: 'rcd',
    name: 'Wyłącznik RCD',
    category: 'ac',
    designation: 'F-RCD',
    nodeType: 'rcd',
    defaultLabel: 'F1',
    parameters: [
      { key: 'rcdType', label: 'Typ', type: 'select', options: ['A', 'B', 'F', 'B+'] },
      { key: 'ratingCurrent', label: 'In', type: 'number', unit: 'A', defaultValue: 25 },
      { key: 'sensitivityCurrent', label: 'IΔn', type: 'number', unit: 'mA', defaultValue: 30 },
      { key: 'poles', label: 'Bieguny', type: 'select', options: ['2P', '4P'] },
    ],
  },
  {
    id: 'mcb',
    name: 'Wyłącznik MCB',
    category: 'ac',
    designation: 'F',
    nodeType: 'mcb',
    defaultLabel: 'F2',
    parameters: [
      { key: 'curve', label: 'Krzywa', type: 'select', options: ['B', 'C', 'D'] },
      { key: 'ratingCurrent', label: 'In', type: 'number', unit: 'A', defaultValue: 16 },
      { key: 'poles', label: 'Bieguny', type: 'select', options: ['1P', '2P', '3P', '4P'] },
    ],
  },
  {
    id: 'ac_busbar',
    name: 'Szyna zbiorcza AC',
    category: 'wiring',
    designation: '',
    nodeType: 'acBusbar',
    defaultLabel: 'Szyna AC',
    parameters: [],
  },
  {
    id: 'ground_rod',
    name: 'Uziom',
    category: 'grounding',
    designation: '',
    nodeType: 'ground',
    defaultLabel: 'Uziom',
    parameters: [
      { key: 'resistance', label: 'RE', type: 'number', unit: 'Ω' },
      { key: 'groundType', label: 'Typ', type: 'select', options: ['pionowy', 'poziomy'] },
    ],
  },
];
```

- [ ] **Step 2: Utworz wymiary arkuszy**

```typescript
// src/utils/sheetDimensions.ts
import type { SheetFormat } from '../types/index.ts';

// Wymiary w mm (orientacja pozioma)
const SHEET_MM: Record<SheetFormat, { width: number; height: number }> = {
  A4: { width: 297, height: 210 },
  A3: { width: 420, height: 297 },
  A2: { width: 594, height: 420 },
};

const MARGIN_MM = 10;
// 1mm = 3.78px przy 96 DPI
const MM_TO_PX = 3.78;

export function getSheetDimensions(format: SheetFormat) {
  const sheet = SHEET_MM[format];
  return {
    widthPx: Math.round(sheet.width * MM_TO_PX),
    heightPx: Math.round(sheet.height * MM_TO_PX),
    workAreaX: Math.round(MARGIN_MM * MM_TO_PX),
    workAreaY: Math.round(MARGIN_MM * MM_TO_PX),
    workAreaWidth: Math.round((sheet.width - 2 * MARGIN_MM) * MM_TO_PX),
    workAreaHeight: Math.round((sheet.height - 2 * MARGIN_MM) * MM_TO_PX),
    widthMm: sheet.width,
    heightMm: sheet.height,
    marginMm: MARGIN_MM,
  };
}
```

- [ ] **Step 3: Zweryfikuj build**

Run: `npm run build`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/constants/index.ts src/utils/sheetDimensions.ts
git commit -m "feat: stale — kolory zyl, definicje elementow, wymiary arkuszy"
```

---

## Chunk 2: Zustand store

### Task 4: Store projektu z undo/redo

**Files:**
- Create: `src/store/projectStore.ts`

- [ ] **Step 1: Utworz store**

```typescript
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

  // Layout (Etap 7 — na razie puste)
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

  // Autonumeracja — counter inkrementuje sie TYLKO w addNode
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

  setSelectedNodeId: (id) => set({ selectedNodeId: id }),
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

// --- Helper do generowania etykiety (uzywany w drop handler) ---
export function generateNextLabel(designation: string): string {
  const state = useProjectStore.getState();
  const [label, updatedCounters] = nextLabel(designation, state.labelCounters);
  useProjectStore.setState({ labelCounters: updatedCounters });
  return label;
}
```

- [ ] **Step 2: Zweryfikuj build**

Run: `npm run build`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/store/projectStore.ts
git commit -m "feat: Zustand store z undo/redo, auto-zapis, save/load"
```

---

## Chunk 3: Wezly SVG (5 pierwszych symboli)

### Task 5: Wezly React Flow — symbole elektryczne SVG

**Files:**
- Create: `src/nodes/ac/InverterNode.tsx`
- Create: `src/nodes/ac/RcdNode.tsx`
- Create: `src/nodes/ac/McbNode.tsx`
- Create: `src/nodes/ac/AcBusbarNode.tsx`
- Create: `src/nodes/ac/GroundNode.tsx`
- Create: `src/nodes/index.ts`

- [ ] **Step 1: Utworz InverterNode.tsx**

```tsx
// src/nodes/ac/InverterNode.tsx
import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type InverterNodeType = Node<SchematicNodeData, 'inverter'>;

export function InverterNode({ data, selected }: NodeProps<InverterNodeType>) {
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}>
      <Handle type="target" position={Position.Top} id="dc-in" className="!bg-red-500 !w-2 !h-2" />

      {/* Symbol falownika PN-EN 60617: prostokat z DC→AC */}
      <svg width="60" height="50" viewBox="0 0 60 50">
        <rect x="5" y="5" width="50" height="40" fill="white" stroke="black" strokeWidth="1.5" />
        <text x="18" y="22" fontSize="10" fontFamily="monospace" textAnchor="middle">=</text>
        <line x1="30" y1="8" x2="30" y2="42" stroke="black" strokeWidth="0.8" strokeDasharray="2,2" />
        <text x="42" y="22" fontSize="10" fontFamily="monospace" textAnchor="middle">~</text>
        <line x1="20" y1="35" x2="40" y2="35" stroke="black" strokeWidth="1" />
        <polygon points="38,32 44,35 38,38" fill="black" />
      </svg>

      <div className="text-xs font-bold mt-1">{data.label}</div>
      {data.parameters.model && (
        <div className="text-[10px] text-gray-500">{String(data.parameters.model)}</div>
      )}
      {data.parameters.power && (
        <div className="text-[10px] text-gray-500">{String(data.parameters.power)} kW</div>
      )}

      <Handle type="source" position={Position.Bottom} id="ac-out" className="!bg-gray-500 !w-2 !h-2" />
    </div>
  );
}
```

- [ ] **Step 2: Utworz RcdNode.tsx**

```tsx
// src/nodes/ac/RcdNode.tsx
import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type RcdNodeType = Node<SchematicNodeData, 'rcd'>;

export function RcdNode({ data, selected }: NodeProps<RcdNodeType>) {
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}>
      <Handle type="target" position={Position.Top} id="in" className="!bg-gray-700 !w-2 !h-2" />

      <svg width="40" height="60" viewBox="0 0 40 60">
        <line x1="20" y1="0" x2="20" y2="10" stroke="black" strokeWidth="1.5" />
        <rect x="5" y="10" width="30" height="35" fill="white" stroke="black" strokeWidth="1.5" />
        <circle cx="20" cy="27" r="8" fill="none" stroke="black" strokeWidth="1" />
        <line x1="20" y1="19" x2="20" y2="35" stroke="black" strokeWidth="1" />
        <line x1="28" y1="20" x2="35" y2="40" stroke="black" strokeWidth="0.8" />
        <line x1="20" y1="45" x2="20" y2="60" stroke="black" strokeWidth="1.5" />
      </svg>

      <div className="text-xs font-bold mt-1">{data.label}</div>
      {data.parameters.rcdType && (
        <div className="text-[10px] text-gray-500">
          Typ {String(data.parameters.rcdType)} {String(data.parameters.ratingCurrent ?? '')}A {String(data.parameters.sensitivityCurrent ?? '')}mA
        </div>
      )}

      <Handle type="source" position={Position.Bottom} id="out" className="!bg-gray-700 !w-2 !h-2" />
    </div>
  );
}
```

- [ ] **Step 3: Utworz McbNode.tsx**

```tsx
// src/nodes/ac/McbNode.tsx
import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type McbNodeType = Node<SchematicNodeData, 'mcb'>;

export function McbNode({ data, selected }: NodeProps<McbNodeType>) {
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}>
      <Handle type="target" position={Position.Top} id="in" className="!bg-gray-700 !w-2 !h-2" />

      <svg width="30" height="55" viewBox="0 0 30 55">
        <line x1="15" y1="0" x2="15" y2="10" stroke="black" strokeWidth="1.5" />
        <line x1="15" y1="10" x2="22" y2="25" stroke="black" strokeWidth="1.5" />
        <line x1="10" y1="20" x2="18" y2="20" stroke="black" strokeWidth="1" />
        <line x1="14" y1="16" x2="14" y2="24" stroke="black" strokeWidth="1" />
        <circle cx="15" cy="30" r="2" fill="black" />
        <line x1="15" y1="32" x2="15" y2="55" stroke="black" strokeWidth="1.5" />
      </svg>

      <div className="text-xs font-bold mt-1">{data.label}</div>
      {data.parameters.curve && (
        <div className="text-[10px] text-gray-500">
          {String(data.parameters.curve)}{String(data.parameters.ratingCurrent ?? '')}A
        </div>
      )}

      <Handle type="source" position={Position.Bottom} id="out" className="!bg-gray-700 !w-2 !h-2" />
    </div>
  );
}
```

- [ ] **Step 4: Utworz AcBusbarNode.tsx**

```tsx
// src/nodes/ac/AcBusbarNode.tsx
import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type AcBusbarNodeType = Node<SchematicNodeData, 'acBusbar'>;

export function AcBusbarNode({ data, selected }: NodeProps<AcBusbarNodeType>) {
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}>
      <Handle type="target" position={Position.Top} id="in" className="!bg-gray-700 !w-2 !h-2" />

      <svg width="120" height="16" viewBox="0 0 120 16">
        <rect x="0" y="5" width="120" height="6" fill="black" rx="1" />
      </svg>

      <div className="text-xs font-bold mt-1">{data.label}</div>

      <Handle type="source" position={Position.Bottom} id="out-1" className="!bg-gray-700 !w-2 !h-2" style={{ left: '20%' }} />
      <Handle type="source" position={Position.Bottom} id="out-2" className="!bg-gray-700 !w-2 !h-2" style={{ left: '40%' }} />
      <Handle type="source" position={Position.Bottom} id="out-3" className="!bg-gray-700 !w-2 !h-2" style={{ left: '60%' }} />
      <Handle type="source" position={Position.Bottom} id="out-4" className="!bg-gray-700 !w-2 !h-2" style={{ left: '80%' }} />
    </div>
  );
}
```

- [ ] **Step 5: Utworz GroundNode.tsx**

```tsx
// src/nodes/ac/GroundNode.tsx
import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type GroundNodeType = Node<SchematicNodeData, 'ground'>;

export function GroundNode({ data, selected }: NodeProps<GroundNodeType>) {
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}>
      <Handle type="target" position={Position.Top} id="in" className="!bg-green-600 !w-2 !h-2" />

      <svg width="40" height="40" viewBox="0 0 40 40">
        <line x1="20" y1="0" x2="20" y2="15" stroke="black" strokeWidth="1.5" />
        <line x1="6" y1="15" x2="34" y2="15" stroke="black" strokeWidth="1.5" />
        <line x1="10" y1="22" x2="30" y2="22" stroke="black" strokeWidth="1.5" />
        <line x1="14" y1="29" x2="26" y2="29" stroke="black" strokeWidth="1.5" />
      </svg>

      <div className="text-xs font-bold mt-1">{data.label}</div>
      {data.parameters.resistance && (
        <div className="text-[10px] text-gray-500">RE={String(data.parameters.resistance)}Ω</div>
      )}
    </div>
  );
}
```

- [ ] **Step 6: Utworz rejestr nodeTypes**

```typescript
// src/nodes/index.ts
import { InverterNode } from './ac/InverterNode.tsx';
import { RcdNode } from './ac/RcdNode.tsx';
import { McbNode } from './ac/McbNode.tsx';
import { AcBusbarNode } from './ac/AcBusbarNode.tsx';
import { GroundNode } from './ac/GroundNode.tsx';

// Obiekt bez adnotacji NodeTypes — pozwala na wezsze typy generyczne
// React Flow akceptuje to strukturalnie w props `nodeTypes`
export const nodeTypes = {
  inverter: InverterNode,
  rcd: RcdNode,
  mcb: McbNode,
  acBusbar: AcBusbarNode,
  ground: GroundNode,
} as const;
```

- [ ] **Step 7: Zweryfikuj build**

Run: `npm run build`
Expected: PASS

- [ ] **Step 8: Commit**

```bash
git add src/nodes/
git commit -m "feat: 5 wezlow SVG — falownik, RCD, MCB, szyna AC, uziom"
```

---

## Chunk 4: Komponenty UI i layout

### Task 6: SchematicCanvas — wrapper React Flow

**Files:**
- Create: `src/components/canvas/SchematicCanvas.tsx`

Kluczowe: uzywa `useReactFlow().screenToFlowPosition()` do przeliczenia pozycji drop na wspolrzedne canvas.

- [ ] **Step 1: Utworz komponent canvas**

```tsx
// src/components/canvas/SchematicCanvas.tsx
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  useOnSelectionChange,
  useReactFlow,
  addEdge,
  type Connection,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useCallback } from 'react';
import { useProjectStore, generateNextLabel } from '../../store/projectStore.ts';
import { nodeTypes } from '../../nodes/index.ts';
import { getSheetDimensions } from '../../utils/sheetDimensions.ts';
import { ELEMENT_DEFINITIONS } from '../../constants/index.ts';
import type { SchematicNodeData } from '../../types/index.ts';
import type { Node } from '@xyflow/react';

export function SchematicCanvas() {
  const {
    nodes, edges, schematicFormat,
    setEdges, addNode, pushHistory,
    setSelectedNodeId,
    onNodesChange, onEdgesChange,
  } = useProjectStore();

  const { screenToFlowPosition } = useReactFlow();
  const sheet = getSheetDimensions(schematicFormat);

  // Zaznaczenie wezla
  useOnSelectionChange({
    onChange: ({ nodes: selectedNodes }) => {
      setSelectedNodeId(selectedNodes.length === 1 ? selectedNodes[0].id : null);
    },
  });

  // Polaczenia
  const onConnect = useCallback((connection: Connection) => {
    pushHistory();
    setEdges(addEdge(connection, useProjectStore.getState().edges));
  }, [pushHistory, setEdges]);

  // Drag & drop z sidebar
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const elementId = event.dataTransfer.getData('application/schematic-element');
    if (!elementId) return;

    const definition = ELEMENT_DEFINITIONS.find((d) => d.id === elementId);
    if (!definition) return;

    // Przelicz pozycje ekranowa na wspolrzedne canvas (uwzglednia pan/zoom)
    const position = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    // Domyslne wartosci parametrow
    const parameters: Record<string, string | number> = {};
    for (const param of definition.parameters) {
      if (param.defaultValue !== undefined) {
        parameters[param.key] = param.defaultValue;
      }
    }

    const label = generateNextLabel(definition.designation) || definition.defaultLabel;

    const newNode: Node<SchematicNodeData> = {
      id: `${definition.nodeType}-${Date.now()}`,
      type: definition.nodeType,
      position,
      data: {
        label,
        elementId: definition.id,
        designation: definition.designation,
        parameters,
      },
    };

    addNode(newNode);
  }, [screenToFlowPosition, addNode]);

  return (
    <div className="flex-1 relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDragOver={onDragOver}
        onDrop={onDrop}
        nodeTypes={nodeTypes}
        fitView
        snapToGrid
        snapGrid={[10, 10]}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        minZoom={0.2}
        maxZoom={4}
        style={{ width: '100%', height: '100%' }}
      >
        <Background variant={BackgroundVariant.Dots} gap={10} size={1} color="#ddd" />
        <Controls />
        <MiniMap
          pannable
          zoomable
          className="!bg-white !border !border-gray-200"
        />

        {/* Ramka arkusza jako wezel React Flow — rysowana w ukladzie canvas */}
        {/* Uproszczona wersja — pelna ramka rysunkowa w Etapie 8 */}
        <svg
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: sheet.widthPx,
            height: sheet.heightPx,
            pointerEvents: 'none',
            overflow: 'visible',
          }}
        >
          <rect
            x={0} y={0}
            width={sheet.widthPx} height={sheet.heightPx}
            fill="white" stroke="#999" strokeWidth="1"
          />
          {/* Margines wewnetrzny */}
          <rect
            x={sheet.workAreaX} y={sheet.workAreaY}
            width={sheet.workAreaWidth} height={sheet.workAreaHeight}
            fill="none" stroke="#ccc" strokeWidth="0.5" strokeDasharray="4,4"
          />
        </svg>
      </ReactFlow>
    </div>
  );
}
```

**Uwaga o ramce:** SVG jako dziecko `<ReactFlow>` renderuje sie w ukladzie ekranowym, nie canvas. W Etapie 8 zostanie to zastapione wlasciwym custom node'em lub panelem w viewporcie. Na potrzeby Etapu 1 — wizualna orientacja jest wystarczajaca.

- [ ] **Step 2: Zweryfikuj build**

Run: `npm run build`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/components/canvas/SchematicCanvas.tsx
git commit -m "feat: SchematicCanvas — React Flow z siatka, drag&drop, polaczenia"
```

---

### Task 7: Sidebar z biblioteka elementow

**Files:**
- Create: `src/components/sidebar/Sidebar.tsx`

- [ ] **Step 1: Utworz sidebar**

```tsx
// src/components/sidebar/Sidebar.tsx
import { ELEMENT_DEFINITIONS } from '../../constants/index.ts';
import type { ElementCategory } from '../../types/index.ts';

const CATEGORY_NAMES: Record<ElementCategory, string> = {
  dc: 'Strona DC',
  ac: 'Strona AC',
  inverter: 'Falownik / magazyn',
  ev: 'Ładowarki EV',
  transfer: 'Przełączniki',
  grounding: 'Uziemienie',
  enclosure: 'Rozdzielnice',
  wiring: 'Linie i szyny',
};

const groupedElements = ELEMENT_DEFINITIONS.reduce<Record<string, typeof ELEMENT_DEFINITIONS>>((groups, el) => {
  const cat = el.category;
  if (!groups[cat]) groups[cat] = [];
  groups[cat].push(el);
  return groups;
}, {});

export function Sidebar() {
  const onDragStart = (event: React.DragEvent, elementId: string) => {
    event.dataTransfer.setData('application/schematic-element', elementId);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="w-56 bg-gray-50 border-r border-gray-200 overflow-y-auto p-3">
      <h2 className="text-sm font-bold text-gray-700 mb-3">Elementy</h2>

      {Object.entries(groupedElements).map(([category, elements]) => (
        <div key={category} className="mb-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            {CATEGORY_NAMES[category as ElementCategory] ?? category}
          </h3>
          <div className="space-y-1">
            {elements.map((el) => (
              <div
                key={el.id}
                draggable
                onDragStart={(e) => onDragStart(e, el.id)}
                className="flex items-center gap-2 px-2 py-1.5 bg-white border border-gray-200 rounded cursor-grab hover:border-blue-400 hover:bg-blue-50 transition-colors text-sm"
              >
                <span className="text-gray-400 font-mono text-xs w-8">
                  {el.designation || '—'}
                </span>
                <span className="text-gray-700">{el.name}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </aside>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sidebar/Sidebar.tsx
git commit -m "feat: Sidebar z lista elementow i drag start"
```

---

### Task 8: Toolbar

**Files:**
- Create: `src/components/toolbar/Toolbar.tsx`

- [ ] **Step 1: Utworz toolbar**

```tsx
// src/components/toolbar/Toolbar.tsx
import { useProjectStore } from '../../store/projectStore.ts';
import type { SheetFormat } from '../../types/index.ts';

const FORMATS: SheetFormat[] = ['A4', 'A3', 'A2'];

export function Toolbar() {
  const {
    projectName, setProjectName,
    schematicFormat, setSchematicFormat,
    undo, redo, saveProject,
    schematicPast, schematicFuture, isDirty,
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
        💾 Zapisz
      </button>
    </header>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/toolbar/Toolbar.tsx
git commit -m "feat: Toolbar z nazwa projektu, format arkusza, undo/redo, zapis"
```

---

### Task 9: PropertiesPanel (placeholder)

**Files:**
- Create: `src/components/properties/PropertiesPanel.tsx`

- [ ] **Step 1: Utworz placeholder panelu wlasciwosci**

```tsx
// src/components/properties/PropertiesPanel.tsx
import { useProjectStore } from '../../store/projectStore.ts';
import { ELEMENT_DEFINITIONS } from '../../constants/index.ts';

export function PropertiesPanel() {
  const { selectedNodeId, nodes } = useProjectStore();

  const selectedNode = selectedNodeId
    ? nodes.find((n) => n.id === selectedNodeId)
    : null;

  if (!selectedNode) {
    return (
      <aside className="w-60 bg-gray-50 border-l border-gray-200 p-3">
        <p className="text-sm text-gray-400 italic">
          Zaznacz element na schemacie, aby zobaczyć jego właściwości.
        </p>
      </aside>
    );
  }

  const definition = ELEMENT_DEFINITIONS.find(
    (d) => d.id === selectedNode.data.elementId
  );

  return (
    <aside className="w-60 bg-gray-50 border-l border-gray-200 p-3 overflow-y-auto">
      <h2 className="text-sm font-bold text-gray-700 mb-2">Właściwości</h2>

      <div className="space-y-2 text-sm">
        <div>
          <span className="text-gray-500">Typ:</span>{' '}
          <span className="font-medium">{definition?.name ?? '—'}</span>
        </div>
        <div>
          <span className="text-gray-500">Etykieta:</span>{' '}
          <span className="font-medium">{selectedNode.data.label}</span>
        </div>
        <div>
          <span className="text-gray-500">Oznaczenie:</span>{' '}
          <span className="font-mono">{selectedNode.data.designation || '—'}</span>
        </div>

        {/* Parametry — read-only; edycja w Etapie 4 */}
        {definition?.parameters.map((param) => (
          <div key={param.key}>
            <span className="text-gray-500">{param.label}:</span>{' '}
            <span className="font-medium">
              {String(selectedNode.data.parameters[param.key] ?? '—')}
              {param.unit && selectedNode.data.parameters[param.key] ? ` ${param.unit}` : ''}
            </span>
          </div>
        ))}
      </div>
    </aside>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/properties/PropertiesPanel.tsx
git commit -m "feat: PropertiesPanel — wyswietlanie wlasciwosci zaznaczonego elementu"
```

---

### Task 10: Glowny layout App.tsx + skroty klawiaturowe

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/main.tsx` (usunac import App.css)

- [ ] **Step 1: Zastap App.tsx nowym layoutem**

```tsx
// src/App.tsx
import { useEffect } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { Toolbar } from './components/toolbar/Toolbar.tsx';
import { Sidebar } from './components/sidebar/Sidebar.tsx';
import { SchematicCanvas } from './components/canvas/SchematicCanvas.tsx';
import { PropertiesPanel } from './components/properties/PropertiesPanel.tsx';
import { useProjectStore } from './store/projectStore.ts';
import { startAutosave, stopAutosave } from './store/projectStore.ts';

function App() {
  const { undo, redo, saveProject, deleteSelectedNodes } = useProjectStore();

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
          <SchematicCanvas />
          <PropertiesPanel />
        </div>
      </div>
    </ReactFlowProvider>
  );
}

export default App;
```

- [ ] **Step 2: Wyczysc main.tsx** — usun `import './App.css'` jesli istnieje. Usun tez import `reactLogo`, `viteLogo`, `heroImg` jesli sa.

- [ ] **Step 3: Zweryfikuj build**

Run: `npm run build`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx src/main.tsx
git commit -m "feat: glowny layout — toolbar, sidebar, canvas, properties + skroty klawiaturowe"
```

---

## Chunk 5: Weryfikacja koncowa

### Task 11: Test end-to-end — pelna weryfikacja Etapu 1

- [ ] **Step 1: npm run build** — brak bledow TS
- [ ] **Step 2: npm run lint** — brak ostrzezen ESLint
- [ ] **Step 3: npm run dev** — aplikacja uruchamia sie
- [ ] **Step 4: Testy manualne:**
  - Przeciagnij falownik z sidebar na canvas — pojawia sie symbol SVG z etykieta U1
  - Przeciagnij RCD — pojawia sie z etykieta F-RCD1
  - Przeciagnij MCB, szyne AC, uziom — wszystkie widoczne
  - Kliknij na element — panel Properties pokazuje jego dane
  - Polacz dwa elementy (przeciagnij z handle do handle) — linia polaczenia
  - Pan/zoom canvasu — elementy i siatka sie przesuwaja
  - Ctrl+Z — cofa ostatnia akcje
  - Ctrl+Y — ponawia
  - Ctrl+S — zapisuje (kropka isDirty znika)
  - Delete — usuwa zaznaczony element
  - Zmien format arkusza A4 → A3 → A2
  - Zmien nazwe projektu w toolbarze
  - Odswiez strone — projekt wczytuje sie z localStorage

- [ ] **Step 5: Napraw ewentualne bledy** wykryte w testach manualnych

- [ ] **Step 6: Commit finalny**

```bash
git add -A
git commit -m "feat: Etap 1 kompletny — fundament edytora schematow PV"
```
