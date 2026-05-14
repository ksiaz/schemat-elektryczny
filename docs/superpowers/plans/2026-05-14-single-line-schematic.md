# Schemat jednokreskowy (SLD) — plan implementacji

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dodać trzeci niezależny arkusz „Schemat jednokreskowy" do edytora — biblioteka 18 symboli SLD (PV ON-grid + hybryda), edge z anotacją żył (kreski + etykieta), 3 szablony.

**Architecture:** Trzeci sheet `singleLine` w `projectStore` (osobne `nodes/edges/historia/save-load`), 18 komponentów SVG pod `src/nodes/sld/`, jeden `SingleLineCableEdge` renderujący jednocześnie pęczek ukośnych kresek + etykietę tekstową z `data.cores`, dedykowany `SingleLineCanvas`. Toolbar 3-stanowy `Schemat | Jednokreskowy | Lokalizacja`. Routing manual (waypoints) — bez auto-routingu. Eksport PDF reuse istniejącego mechanizmu na aktywny sheet.

**Tech Stack:** React 19, TypeScript ~5.9, Vite 8, @xyflow/react 12, Zustand 5, Tailwind CSS 4, jsPDF + svg2pdf.js. Projekt **bez frameworka testowego** — weryfikacja każdego tasku: `npm run build` (tsc + vite) + `npm run lint` + ręczne sprawdzenie w przeglądarce (`npm run dev`).

**Spec source:** `docs/superpowers/specs/2026-05-14-single-line-schematic-design.md`

---

## File structure (high-level)

**Tworzymy (nowe pliki):**
- `src/nodes/sld/SldGridSourceNode.tsx` ... + 17 innych symboli
- `src/edges/SingleLineCableEdge.tsx`
- `src/components/canvas/SingleLineCanvas.tsx`
- `src/constants/singleLineElements.ts`
- `src/templates/sld/helpers.ts`
- `src/templates/sld/onGrid1Phase.ts`
- `src/templates/sld/onGrid3Phase.ts`
- `src/templates/sld/hybrid.ts`
- `src/templates/sld/index.ts`

**Modyfikujemy:**
- `src/types/index.ts` (activeSheet union, kategorie SLD)
- `src/store/projectStore.ts` (state SLD + akcje + save/load fallback)
- `src/nodes/index.ts` (rejestracja 18 nodeType)
- `src/edges/index.ts` (rejestracja `singleLineCable`)
- `src/components/sidebar/Sidebar.tsx` (gałąź SLD)
- `src/components/toolbar/Toolbar.tsx` (3-stanowy przełącznik + typ kabla SLD)
- `src/components/toolbar/TemplateDialog.tsx` (sekcja szablonów SLD)
- `src/components/properties/PropertiesPanel.tsx` (formularz edge'a SLD)
- `src/App.tsx` (switch trzech sheetów)
- `CLAUDE.md` (sekcja SLD + deprecate `singleLineMcb`)

---

## Task 1: Rozszerzenie typów dla sheet `singleLine` + kategorii SLD

**Files:**
- Modify: `src/types/index.ts`

- [ ] **Step 1: Otwórz `src/types/index.ts` i znajdź `ElementCategory`**

- [ ] **Step 2: Rozszerz `ElementCategory` o trzy nowe kategorie SLD**

```typescript
export type ElementCategory =
  | 'dc' | 'ac' | 'inverter' | 'ev' | 'transfer'
  | 'grounding' | 'enclosure' | 'wiring'
  | 'sldAcSource' | 'sldAcProtection' | 'sldDc'
  | 'sldInverter' | 'sldGrounding';
```

- [ ] **Step 3: Dodaj typ pomocniczy do edge'a SLD na końcu pliku**

```typescript
export interface SingleLineCableData {
  cableType: string;        // 'YDY' | 'YKY' | 'YKXS' | 'NYM' | 'H1Z2Z2-K' | 'LgY' | string
  cores: number;            // 1..7
  crossSection: number;     // mm²
  peCrossSection?: number;  // mm² (gdy PE chudszy)
  circuitId?: string;       // 'W1', 'O.1'
  length?: number;          // m
  current?: 'AC' | 'DC';
  waypoints?: Array<{ x: number; y: number }>;
}
```

- [ ] **Step 4: Weryfikacja kompilacji**

Run: `npm run build`
Expected: zielone, brak błędów TypeScript.

- [ ] **Step 5: Commit**

```bash
git add src/types/index.ts
git commit -m "feat(sld): typy dla schematu jednokreskowego — kategorie + SingleLineCableData"
```

---

## Task 2: Rozszerzenie `projectStore` o stan SLD, akcje, save/load

**Files:**
- Modify: `src/store/projectStore.ts`

- [ ] **Step 1: Zmiana typu `activeSheet` na trzystanowy**

W `interface ProjectState` zmień:
```typescript
activeSheet: 'schematic' | 'singleLine' | 'layout';
```

I funkcję setter:
```typescript
setActiveSheet: (sheet: 'schematic' | 'singleLine' | 'layout') => void;
```

- [ ] **Step 2: Dodaj pola stanu SLD w `interface ProjectState`** (po polach `layoutNodes`/`layoutEdges`)

```typescript
  // Single line
  singleLineNodes: Node<SchematicNodeData>[];
  singleLineEdges: Edge[];
  singleLinePast: HistoryEntry[];
  singleLineFuture: HistoryEntry[];
  singleLineFormat: SheetFormat;

  setSingleLineNodes: (nodes: Node<SchematicNodeData>[]) => void;
  setSingleLineEdges: (edges: Edge[]) => void;
  onSingleLineNodesChange: (changes: NodeChange<Node<SchematicNodeData>>[]) => void;
  onSingleLineEdgesChange: (changes: EdgeChange[]) => void;
  pushSingleLineHistory: () => void;
  setSingleLineFormat: (format: SheetFormat) => void;
```

- [ ] **Step 3: Zainicjalizuj domyślne wartości w `create<ProjectState>(...)`** (dopisz w obiekcie, obok `layoutNodes/layoutEdges`)

```typescript
  singleLineNodes: [],
  singleLineEdges: [],
  singleLinePast: [],
  singleLineFuture: [],
  singleLineFormat: 'A4',
```

- [ ] **Step 4: Zaimplementuj akcje SLD** (dopisz na końcu `create`, przed zamknięciem)

```typescript
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
```

- [ ] **Step 5: Rozszerz `addNode`** żeby działało dla SLD

Znajdź obecne `addNode: (node) => { ... }` i zastąp:

```typescript
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
```

- [ ] **Step 6: Rozszerz `deleteSelectedNodes`** żeby obsługiwało SLD

Znajdź `deleteSelectedNodes: () => { ... }`. Po bloku `isLayout` dodaj analogiczny blok dla `singleLine`:

```typescript
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
```

- [ ] **Step 7: Rozszerz `updateNodeData` i `updateEdgeData`** o przypadek SLD

Dla obu funkcji dodaj gałąź `singleLine` przed gałęzią `layout`:

```typescript
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
```

- [ ] **Step 8: Rozszerz `undo` i `redo`** o routing per `activeSheet`

Zastąp `undo` i `redo`:

```typescript
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
```

(Uwaga: oryginalne `undo/redo` dotyczyły wyłącznie schematic — to było bug per spec. Naprawiamy przy okazji.)

- [ ] **Step 9: Rozszerz `saveProject` i `loadProject`** o pola SLD

W `saveProject` w obiekcie `data` dopisz:
```typescript
      singleLineNodes: state.singleLineNodes,
      singleLineEdges: state.singleLineEdges,
      singleLineFormat: state.singleLineFormat,
```

W `loadProject` w obiekcie `set({...})` dopisz (z fallbackami dla starych JSON):
```typescript
      singleLineNodes: data.singleLineNodes ?? [],
      singleLineEdges: data.singleLineEdges ?? [],
      singleLineFormat: data.singleLineFormat ?? 'A4',
      singleLinePast: [],
      singleLineFuture: [],
```

- [ ] **Step 10: Build + lint**

Run: `npm run build && npm run lint`
Expected: zielone.

- [ ] **Step 11: Commit**

```bash
git add src/store/projectStore.ts
git commit -m "feat(sld): stan SLD w projectStore — nodes/edges/historia/save-load + routing undo/redo per sheet"
```

---

## Task 3: Edge `SingleLineCableEdge` — renderer (linia + ukośne kreski + etykieta)

**Files:**
- Create: `src/edges/SingleLineCableEdge.tsx`

- [ ] **Step 1: Utwórz plik z komponentem**

```tsx
import { BaseEdge, type EdgeProps } from '@xyflow/react';
import type { SingleLineCableData } from '../types/index.ts';

const HATCH_LEN = 6;       // dlugosc ukosnej kreski [px]
const HATCH_SPACING = 3;   // odstep miedzy kreskami
const HATCH_ANGLE_DEG = 60;
const MIN_LINE_LEN_FOR_HATCH = 60;
const LABEL_OFFSET = 14;

function buildPath(sx: number, sy: number, tx: number, ty: number, waypoints?: Array<{x:number;y:number}>) {
  if (!waypoints || waypoints.length === 0) {
    return `M ${sx} ${sy} L ${tx} ${ty}`;
  }
  let d = `M ${sx} ${sy}`;
  for (const w of waypoints) d += ` L ${w.x} ${w.y}`;
  d += ` L ${tx} ${ty}`;
  return d;
}

function formatLabel(data: SingleLineCableData): string[] {
  const lines: string[] = [];
  const main = `${data.cableType} ${data.cores}×${data.crossSection}`;
  const withPe = data.peCrossSection && data.peCrossSection !== data.crossSection
    ? `${data.cableType} ${data.cores - 1}×${data.crossSection}+${data.peCrossSection}`
    : main;
  lines.push(`${withPe} mm²`);
  if (data.circuitId) lines.push(data.circuitId);
  if (data.length !== undefined) lines.push(`L=${data.length} m`);
  return lines;
}

export function SingleLineCableEdge({
  id, sourceX, sourceY, targetX, targetY, data, selected,
}: EdgeProps) {
  const d = (data ?? {}) as Partial<SingleLineCableData>;
  const cableType = d.cableType ?? 'YDY';
  const cores = d.cores ?? 5;
  const crossSection = d.crossSection ?? 6;
  const waypoints = (d as { waypoints?: Array<{x:number;y:number}> }).waypoints;

  const path = buildPath(sourceX, sourceY, targetX, targetY, waypoints);

  // srodek pierwszego segmentu (sourceX/Y -> waypoint[0] lub target)
  const next = waypoints && waypoints.length > 0 ? waypoints[0] : { x: targetX, y: targetY };
  const midX = (sourceX + next.x) / 2;
  const midY = (sourceY + next.y) / 2;
  const dx = next.x - sourceX;
  const dy = next.y - sourceY;
  const segLen = Math.hypot(dx, dy);

  // kierunek prostopadly do linii — do rozkladania pęczka kresek wzdluz linii
  const ux = segLen > 0 ? dx / segLen : 1;
  const uy = segLen > 0 ? dy / segLen : 0;

  // ukosna kreska pod katem 60deg wzgledem linii
  const angleRad = (HATCH_ANGLE_DEG * Math.PI) / 180;
  // kierunek kreski w lokalnym ukladzie linii: (cos a, sin a)
  // przeloz na globalny:
  const hx = ux * Math.cos(angleRad) - uy * Math.sin(angleRad);
  const hy = ux * Math.sin(angleRad) + uy * Math.cos(angleRad);

  const totalWidth = (cores - 1) * HATCH_SPACING;
  const startX = midX - (ux * totalWidth) / 2;
  const startY = midY - (uy * totalWidth) / 2;

  const showHatches = segLen >= MIN_LINE_LEN_FOR_HATCH;

  const labelLines = formatLabel({
    cableType, cores, crossSection,
    peCrossSection: d.peCrossSection,
    circuitId: d.circuitId,
    length: d.length,
  });

  // pozycja etykiety: prostopadle do linii, po prawej stronie kresek
  const perpX = -uy;
  const perpY = ux;
  const labelX = midX + perpX * LABEL_OFFSET;
  const labelY = midY + perpY * LABEL_OFFSET;

  return (
    <g>
      <BaseEdge id={id} path={path} style={{
        stroke: selected ? '#1d4ed8' : '#222',
        strokeWidth: selected ? 2.5 : 1.5,
      }} />

      {showHatches && Array.from({ length: cores }).map((_, i) => {
        const cx = startX + ux * (i * HATCH_SPACING);
        const cy = startY + uy * (i * HATCH_SPACING);
        const x1 = cx - (hx * HATCH_LEN) / 2;
        const y1 = cy - (hy * HATCH_LEN) / 2;
        const x2 = cx + (hx * HATCH_LEN) / 2;
        const y2 = cy + (hy * HATCH_LEN) / 2;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#222" strokeWidth="1" />;
      })}

      {labelLines.map((text, i) => (
        <text
          key={i}
          x={labelX}
          y={labelY + i * 11}
          fontSize="9"
          fill="#222"
          textAnchor="start"
          style={{ userSelect: 'none', pointerEvents: 'none' }}
        >
          {text}
        </text>
      ))}
    </g>
  );
}
```

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: zielone.

- [ ] **Step 3: Commit**

```bash
git add src/edges/SingleLineCableEdge.tsx
git commit -m "feat(sld): edge SingleLineCableEdge — ukosne kreski + etykieta z cores/cableType"
```

---

## Task 4: Rejestracja `singleLineCable` w `edges/index.ts`

**Files:**
- Modify: `src/edges/index.ts`

- [ ] **Step 1: Dopisz import i rejestrację**

Na początku pliku:
```typescript
import { SingleLineCableEdge } from './SingleLineCableEdge.tsx';
```

W `edgeTypes` po `peRoute: PeRouteEdge,` dopisz:
```typescript
  singleLineCable: SingleLineCableEdge,
```

- [ ] **Step 2: Build + lint**

Run: `npm run build && npm run lint`
Expected: zielone.

- [ ] **Step 3: Commit**

```bash
git add src/edges/index.ts
git commit -m "feat(sld): rejestracja singleLineCable w edgeTypes"
```

---

## Task 5: SLD AC source + measurement (4 symbole)

**Files:**
- Create: `src/nodes/sld/SldGridSourceNode.tsx`
- Create: `src/nodes/sld/SldCableJunctionNode.tsx`
- Create: `src/nodes/sld/SldMeterNode.tsx`
- Create: `src/nodes/sld/SldCtNode.tsx`

Wszystkie symbole SLD mają **dwa handle: top i bottom** (rysunek pionowy top-down) + dwa handle: left/right (opcjonalnie poziom). Jednolite kolory: stroke `#222`, fill `none`/`#333` dla wypełnień, fontSize tytułu 9, fontSize parametrów 7. Wszystkie używają `SchematicNodeData`.

- [ ] **Step 1: `SldGridSourceNode.tsx` — strzałka „z sieci" z etykietą**

```tsx
import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type T = Node<SchematicNodeData, 'sldGridSource'>;

export function SldGridSourceNode({ data, selected }: NodeProps<T>) {
  const network = String(data.parameters.network ?? '~3/N/PE 400/230 V 50 Hz');
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ width: 80, height: 40 }}>
      <svg width="80" height="40" viewBox="0 0 80 40" style={{ overflow: 'visible' }}>
        <text x="40" y="-4" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#333">{data.label || 'Sieć'}</text>
        <text x="40" y="12" textAnchor="middle" fontSize="7" fill="#555">{network}</text>
        <polygon points="34,18 46,18 40,30" fill="#222" />
        <line x1="40" y1="30" x2="40" y2="40" stroke="#222" strokeWidth="1.5" />
      </svg>
      <Handle type="source" position={Position.Bottom} id="out" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333' }} />
    </div>
  );
}
```

- [ ] **Step 2: `SldCableJunctionNode.tsx` — prostokąt z etykietą (ZK)**

```tsx
import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type T = Node<SchematicNodeData, 'sldCableJunction'>;

export function SldCableJunctionNode({ data, selected }: NodeProps<T>) {
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ width: 60, height: 30 }}>
      <Handle type="source" position={Position.Top} id="in" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333' }} />
      <svg width="60" height="30" viewBox="0 0 60 30" style={{ overflow: 'visible' }}>
        <rect x="0" y="0" width="60" height="30" fill="white" stroke="#222" strokeWidth="1.5" />
        <text x="30" y="20" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#222">{data.label || 'ZK'}</text>
      </svg>
      <Handle type="source" position={Position.Bottom} id="out" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333' }} />
    </div>
  );
}
```

- [ ] **Step 3: `SldMeterNode.tsx` — okrąg z `Wh` (1-kier) lub strzałkami (2-kier)**

```tsx
import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type T = Node<SchematicNodeData, 'sldMeter'>;

export function SldMeterNode({ data, selected }: NodeProps<T>) {
  const bidir = String(data.parameters.direction ?? '1-kier') === '2-kier';
  const phases = String(data.parameters.phases ?? '1');
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ width: 50, height: 50 }}>
      <Handle type="source" position={Position.Top} id="in" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333' }} />
      <svg width="50" height="50" viewBox="0 0 50 50" style={{ overflow: 'visible' }}>
        <text x="25" y="-4" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#333">{data.label || 'P1'}</text>
        <circle cx="25" cy="25" r="18" fill="white" stroke="#222" strokeWidth="1.5" />
        <text x="25" y="29" textAnchor="middle" fontSize="10" fill="#222">{bidir ? 'kWh' : 'Wh'}</text>
        {bidir && (
          <>
            <path d="M 8,20 L 4,24 L 8,28" fill="none" stroke="#222" strokeWidth="1" />
            <path d="M 42,20 L 46,24 L 42,28" fill="none" stroke="#222" strokeWidth="1" />
          </>
        )}
        <text x="25" y="58" textAnchor="middle" fontSize="7" fill="#888">{phases}P {bidir ? '2-kier' : '1-kier'}</text>
      </svg>
      <Handle type="source" position={Position.Bottom} id="out" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333' }} />
    </div>
  );
}
```

- [ ] **Step 4: `SldCtNode.tsx` — okrąg z ukośnikiem (przekładnik)**

```tsx
import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type T = Node<SchematicNodeData, 'sldCt'>;

export function SldCtNode({ data, selected }: NodeProps<T>) {
  const ratio = String(data.parameters.ratio ?? '100/5A');
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ width: 40, height: 40 }}>
      <Handle type="source" position={Position.Top} id="in" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333' }} />
      <svg width="40" height="40" viewBox="0 0 40 40" style={{ overflow: 'visible' }}>
        <text x="20" y="-4" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#333">{data.label || 'TA1'}</text>
        <circle cx="20" cy="20" r="14" fill="white" stroke="#222" strokeWidth="1.5" />
        <line x1="8" y1="32" x2="32" y2="8" stroke="#222" strokeWidth="1.5" />
        <text x="20" y="48" textAnchor="middle" fontSize="7" fill="#888">{ratio}</text>
      </svg>
      <Handle type="source" position={Position.Bottom} id="out" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333' }} />
    </div>
  );
}
```

- [ ] **Step 5: Build**

Run: `npm run build`
Expected: zielone (jeszcze nie zarejestrowane w `nodes/index.ts` — zrobimy w Task 11).

- [ ] **Step 6: Commit**

```bash
git add src/nodes/sld/SldGridSourceNode.tsx src/nodes/sld/SldCableJunctionNode.tsx src/nodes/sld/SldMeterNode.tsx src/nodes/sld/SldCtNode.tsx
git commit -m "feat(sld): symbole zrodla AC — gridSource, cableJunction, meter, ct"
```

---

## Task 6: SLD AC switching (2 symbole)

**Files:**
- Create: `src/nodes/sld/SldMainSwitchNode.tsx`
- Create: `src/nodes/sld/SldFireSwitchNode.tsx`

- [ ] **Step 1: `SldMainSwitchNode.tsx` — rozłącznik izolacyjny z X**

```tsx
import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type T = Node<SchematicNodeData, 'sldMainSwitch'>;

export function SldMainSwitchNode({ data, selected }: NodeProps<T>) {
  const poles = String(data.parameters.poles ?? '3P');
  const In = data.parameters.ratingCurrent ? `${data.parameters.ratingCurrent}A` : '';
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ width: 40, height: 50 }}>
      <Handle type="source" position={Position.Top} id="in" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', left: 20 }} />
      <svg width="40" height="50" viewBox="0 0 40 50" style={{ overflow: 'visible' }}>
        <text x="20" y="-4" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#333">{data.label || 'Q1'}</text>
        <line x1="20" y1="0" x2="20" y2="12" stroke="#222" strokeWidth="1.5" />
        <line x1="20" y1="12" x2="30" y2="28" stroke="#222" strokeWidth="2" />
        <circle cx="20" cy="12" r="1.5" fill="#222" />
        <circle cx="20" cy="28" r="1.5" fill="#222" />
        <line x1="16" y1="32" x2="24" y2="40" stroke="#222" strokeWidth="0.9" />
        <line x1="24" y1="32" x2="16" y2="40" stroke="#222" strokeWidth="0.9" />
        <line x1="20" y1="28" x2="20" y2="50" stroke="#222" strokeWidth="1.5" />
        <text x="20" y="58" textAnchor="middle" fontSize="7" fill="#888">{poles} {In}</text>
      </svg>
      <Handle type="source" position={Position.Bottom} id="out" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', left: 20 }} />
    </div>
  );
}
```

- [ ] **Step 2: `SldFireSwitchNode.tsx` — przycisk grzybkowy PWP (czerwone kółko z X)**

```tsx
import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type T = Node<SchematicNodeData, 'sldFireSwitch'>;

export function SldFireSwitchNode({ data, selected }: NodeProps<T>) {
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ width: 40, height: 50 }}>
      <Handle type="source" position={Position.Top} id="in" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', left: 20 }} />
      <svg width="40" height="50" viewBox="0 0 40 50" style={{ overflow: 'visible' }}>
        <text x="20" y="-4" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#333">{data.label || 'PWP'}</text>
        <line x1="20" y1="0" x2="20" y2="13" stroke="#222" strokeWidth="1.5" />
        <circle cx="20" cy="25" r="10" fill="#fee2e2" stroke="#b91c1c" strokeWidth="1.5" />
        <line x1="14" y1="19" x2="26" y2="31" stroke="#b91c1c" strokeWidth="1.5" />
        <line x1="26" y1="19" x2="14" y2="31" stroke="#b91c1c" strokeWidth="1.5" />
        <line x1="20" y1="36" x2="20" y2="50" stroke="#222" strokeWidth="1.5" />
        <text x="20" y="58" textAnchor="middle" fontSize="7" fill="#888">PWP</text>
      </svg>
      <Handle type="source" position={Position.Bottom} id="out" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', left: 20 }} />
    </div>
  );
}
```

- [ ] **Step 3: Build + commit**

```bash
npm run build
git add src/nodes/sld/SldMainSwitchNode.tsx src/nodes/sld/SldFireSwitchNode.tsx
git commit -m "feat(sld): aparaty laczenia AC — mainSwitch, fireSwitch (PWP)"
```

---

## Task 7: SLD AC protection (4 symbole: MCB, RCD, RCBO, SPD-AC)

**Files:**
- Create: `src/nodes/sld/SldMcbNode.tsx`
- Create: `src/nodes/sld/SldRcdNode.tsx`
- Create: `src/nodes/sld/SldRcboNode.tsx`
- Create: `src/nodes/sld/SldSpdAcNode.tsx`

- [ ] **Step 1: `SldMcbNode.tsx` — pojedynczy styk + wyzwalacze**

```tsx
import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type T = Node<SchematicNodeData, 'sldMcb'>;

export function SldMcbNode({ data, selected }: NodeProps<T>) {
  const poles = String(data.parameters.poles ?? '1P');
  const curve = String(data.parameters.curve ?? 'B');
  const In = data.parameters.ratingCurrent ?? 16;
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ width: 40, height: 50 }}>
      <Handle type="source" position={Position.Top} id="in" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', left: 20 }} />
      <svg width="40" height="50" viewBox="0 0 40 50" style={{ overflow: 'visible' }}>
        <text x="20" y="-4" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#333">{data.label || 'F1'}</text>
        <line x1="20" y1="0" x2="20" y2="14" stroke="#222" strokeWidth="1.5" />
        <line x1="20" y1="14" x2="30" y2="30" stroke="#222" strokeWidth="2" />
        <rect x="26" y="22" width="5" height="4" fill="none" stroke="#222" strokeWidth="0.8" />
        <path d="M 16,34 A 4,4 0 0,1 24,34" fill="none" stroke="#222" strokeWidth="0.8" />
        <circle cx="20" cy="37" r="2" fill="#222" />
        <line x1="20" y1="39" x2="20" y2="50" stroke="#222" strokeWidth="1.5" />
        <text x="20" y="58" textAnchor="middle" fontSize="7" fill="#888">{curve}{In}/{poles}</text>
      </svg>
      <Handle type="source" position={Position.Bottom} id="out" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', left: 20 }} />
    </div>
  );
}
```

- [ ] **Step 2: `SldRcdNode.tsx` — trójkąt różnicowy**

```tsx
import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type T = Node<SchematicNodeData, 'sldRcd'>;

export function SldRcdNode({ data, selected }: NodeProps<T>) {
  const poles = String(data.parameters.poles ?? '2P');
  const rcdType = String(data.parameters.rcdType ?? 'A');
  const In = data.parameters.ratingCurrent ?? 25;
  const sens = data.parameters.sensitivityCurrent ?? 30;
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ width: 40, height: 50 }}>
      <Handle type="source" position={Position.Top} id="in" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', left: 20 }} />
      <svg width="40" height="50" viewBox="0 0 40 50" style={{ overflow: 'visible' }}>
        <text x="20" y="-4" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#333">{data.label || 'F-RCD1'}</text>
        <line x1="20" y1="0" x2="20" y2="12" stroke="#222" strokeWidth="1.5" />
        <polygon points="12,16 28,16 20,32" fill="none" stroke="#222" strokeWidth="1.5" />
        <text x="20" y="27" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#222">Δ</text>
        <line x1="20" y1="32" x2="20" y2="50" stroke="#222" strokeWidth="1.5" />
        <text x="20" y="58" textAnchor="middle" fontSize="7" fill="#888">{rcdType} {In}A {sens}mA/{poles}</text>
      </svg>
      <Handle type="source" position={Position.Bottom} id="out" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', left: 20 }} />
    </div>
  );
}
```

- [ ] **Step 3: `SldRcboNode.tsx` — MCB + RCD combo**

```tsx
import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type T = Node<SchematicNodeData, 'sldRcbo'>;

export function SldRcboNode({ data, selected }: NodeProps<T>) {
  const poles = String(data.parameters.poles ?? '1P+N');
  const curve = String(data.parameters.curve ?? 'B');
  const rcdType = String(data.parameters.rcdType ?? 'A');
  const In = data.parameters.ratingCurrent ?? 16;
  const sens = data.parameters.sensitivityCurrent ?? 30;
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ width: 50, height: 60 }}>
      <Handle type="source" position={Position.Top} id="in" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', left: 25 }} />
      <svg width="50" height="60" viewBox="0 0 50 60" style={{ overflow: 'visible' }}>
        <text x="25" y="-4" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#333">{data.label || 'F1'}</text>
        <line x1="25" y1="0" x2="25" y2="10" stroke="#222" strokeWidth="1.5" />
        <line x1="25" y1="10" x2="35" y2="22" stroke="#222" strokeWidth="2" />
        <rect x="31" y="16" width="4" height="3" fill="none" stroke="#222" strokeWidth="0.8" />
        <polygon points="17,28 33,28 25,42" fill="none" stroke="#222" strokeWidth="1.5" />
        <text x="25" y="38" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#222">Δ</text>
        <line x1="25" y1="42" x2="25" y2="60" stroke="#222" strokeWidth="1.5" />
        <text x="25" y="68" textAnchor="middle" fontSize="7" fill="#888">{curve}{In} {rcdType}/{sens}mA {poles}</text>
      </svg>
      <Handle type="source" position={Position.Bottom} id="out" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', left: 25 }} />
    </div>
  );
}
```

- [ ] **Step 4: `SldSpdAcNode.tsx` — strzałka z literą T1/T2**

```tsx
import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type T = Node<SchematicNodeData, 'sldSpdAc'>;

export function SldSpdAcNode({ data, selected }: NodeProps<T>) {
  const klasa = String(data.parameters.spdClass ?? 'T2');
  const uc = data.parameters.uc ? `UC=${data.parameters.uc}V` : '';
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ width: 40, height: 50 }}>
      <Handle type="source" position={Position.Top} id="in" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', left: 20 }} />
      <svg width="40" height="50" viewBox="0 0 40 50" style={{ overflow: 'visible' }}>
        <text x="20" y="-4" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#333">{data.label || 'F-SPD1'}</text>
        <line x1="20" y1="0" x2="20" y2="14" stroke="#222" strokeWidth="1.5" />
        <rect x="12" y="14" width="16" height="20" fill="white" stroke="#222" strokeWidth="1.5" />
        <text x="20" y="28" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#222">{klasa}</text>
        <line x1="14" y1="34" x2="26" y2="34" stroke="#222" strokeWidth="1" />
        <line x1="18" y1="36" x2="22" y2="36" stroke="#222" strokeWidth="1" />
        <line x1="20" y1="38" x2="20" y2="50" stroke="#222" strokeWidth="0.6" strokeDasharray="2,1" />
        <text x="20" y="58" textAnchor="middle" fontSize="7" fill="#888">{uc}</text>
      </svg>
      <Handle type="source" position={Position.Bottom} id="out" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', left: 20 }} />
    </div>
  );
}
```

- [ ] **Step 5: Build + commit**

```bash
npm run build
git add src/nodes/sld/SldMcbNode.tsx src/nodes/sld/SldRcdNode.tsx src/nodes/sld/SldRcboNode.tsx src/nodes/sld/SldSpdAcNode.tsx
git commit -m "feat(sld): zabezpieczenia AC — mcb, rcd, rcbo, spdAc"
```

---

## Task 8: SLD DC group (4 symbole: PV string, DC disconnect, gPV, SPD-DC)

**Files:**
- Create: `src/nodes/sld/SldPvStringNode.tsx`
- Create: `src/nodes/sld/SldDcDisconnectNode.tsx`
- Create: `src/nodes/sld/SldFuseGpvNode.tsx`
- Create: `src/nodes/sld/SldSpdDcNode.tsx`

- [ ] **Step 1: `SldPvStringNode.tsx` — symbol modułu z `n×`**

```tsx
import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type T = Node<SchematicNodeData, 'sldPvString'>;

export function SldPvStringNode({ data, selected }: NodeProps<T>) {
  const n = data.parameters.panelCount ?? 8;
  const voc = data.parameters.voc ?? '';
  const isc = data.parameters.isc ?? '';
  const mpp = data.parameters.mpp ?? '';
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ width: 70, height: 50 }}>
      <Handle type="source" position={Position.Top} id="in" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', left: 35 }} />
      <svg width="70" height="50" viewBox="0 0 70 50" style={{ overflow: 'visible' }}>
        <text x="35" y="-4" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#333">{data.label || 'PV1'}</text>
        <rect x="14" y="6" width="42" height="28" fill="#eef" stroke="#222" strokeWidth="1.5" />
        <line x1="14" y1="6" x2="56" y2="34" stroke="#222" strokeWidth="0.8" />
        <line x1="56" y1="6" x2="14" y2="34" stroke="#222" strokeWidth="0.8" />
        <text x="35" y="24" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#222">{n}×</text>
        <line x1="35" y1="34" x2="35" y2="50" stroke="#222" strokeWidth="1.5" />
        <text x="35" y="58" textAnchor="middle" fontSize="7" fill="#888">
          {voc && `Voc=${voc}V`} {isc && `Isc=${isc}A`}
        </text>
        {mpp && <text x="35" y="68" textAnchor="middle" fontSize="7" fill="#888">{`Pmpp=${mpp}W`}</text>}
      </svg>
      <Handle type="source" position={Position.Bottom} id="out" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', left: 35 }} />
    </div>
  );
}
```

- [ ] **Step 2: `SldDcDisconnectNode.tsx` — rozłącznik DC z literą**

```tsx
import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type T = Node<SchematicNodeData, 'sldDcDisconnect'>;

export function SldDcDisconnectNode({ data, selected }: NodeProps<T>) {
  const poles = String(data.parameters.poles ?? '2P');
  const In = data.parameters.ratingCurrent ? `${data.parameters.ratingCurrent}A` : '';
  const Un = data.parameters.ratingVoltage ? `${data.parameters.ratingVoltage}V` : '';
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ width: 50, height: 50 }}>
      <Handle type="source" position={Position.Top} id="in" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', left: 25 }} />
      <svg width="50" height="50" viewBox="0 0 50 50" style={{ overflow: 'visible' }}>
        <text x="25" y="-4" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#333">{data.label || 'QS1'}</text>
        <line x1="25" y1="0" x2="25" y2="12" stroke="#222" strokeWidth="1.5" />
        <line x1="25" y1="12" x2="35" y2="28" stroke="#222" strokeWidth="2" />
        <circle cx="25" cy="12" r="1.5" fill="#222" />
        <circle cx="25" cy="28" r="1.5" fill="#222" />
        <text x="42" y="22" fontSize="9" fontWeight="bold" fill="#b91c1c">DC</text>
        <line x1="25" y1="28" x2="25" y2="50" stroke="#222" strokeWidth="1.5" />
        <text x="25" y="58" textAnchor="middle" fontSize="7" fill="#888">{poles} {In} {Un}</text>
      </svg>
      <Handle type="source" position={Position.Bottom} id="out" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', left: 25 }} />
    </div>
  );
}
```

- [ ] **Step 3: `SldFuseGpvNode.tsx` — bezpiecznik gPV**

```tsx
import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type T = Node<SchematicNodeData, 'sldFuseGpv'>;

export function SldFuseGpvNode({ data, selected }: NodeProps<T>) {
  const In = data.parameters.ratingCurrent ? `${data.parameters.ratingCurrent}A` : '';
  const Un = data.parameters.ratingVoltage ? `${data.parameters.ratingVoltage}V` : '';
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ width: 30, height: 50 }}>
      <Handle type="source" position={Position.Top} id="in" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333' }} />
      <svg width="30" height="50" viewBox="0 0 30 50" style={{ overflow: 'visible' }}>
        <text x="15" y="-4" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#333">{data.label || 'F1'}</text>
        <line x1="15" y1="0" x2="15" y2="14" stroke="#222" strokeWidth="1.5" />
        <rect x="9" y="14" width="12" height="22" fill="white" stroke="#222" strokeWidth="1.5" />
        <line x1="15" y1="14" x2="15" y2="36" stroke="#222" strokeWidth="1.2" />
        <text x="15" y="29" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#222">gPV</text>
        <line x1="15" y1="36" x2="15" y2="50" stroke="#222" strokeWidth="1.5" />
        <text x="15" y="58" textAnchor="middle" fontSize="7" fill="#888">{In} {Un}</text>
      </svg>
      <Handle type="source" position={Position.Bottom} id="out" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333' }} />
    </div>
  );
}
```

- [ ] **Step 4: `SldSpdDcNode.tsx` — SPD DC**

```tsx
import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type T = Node<SchematicNodeData, 'sldSpdDc'>;

export function SldSpdDcNode({ data, selected }: NodeProps<T>) {
  const klasa = String(data.parameters.spdClass ?? 'T1+2');
  const uc = data.parameters.uc ? `UC=${data.parameters.uc}V` : '';
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ width: 40, height: 50 }}>
      <Handle type="source" position={Position.Top} id="in" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', left: 20 }} />
      <svg width="40" height="50" viewBox="0 0 40 50" style={{ overflow: 'visible' }}>
        <text x="20" y="-4" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#333">{data.label || 'F-SPD1'}</text>
        <line x1="20" y1="0" x2="20" y2="14" stroke="#222" strokeWidth="1.5" />
        <rect x="12" y="14" width="16" height="20" fill="#fee" stroke="#b91c1c" strokeWidth="1.5" />
        <text x="20" y="28" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#b91c1c">{klasa}</text>
        <line x1="20" y1="34" x2="20" y2="50" stroke="#222" strokeWidth="0.6" strokeDasharray="2,1" />
        <text x="20" y="58" textAnchor="middle" fontSize="7" fill="#888">DC {uc}</text>
      </svg>
      <Handle type="source" position={Position.Bottom} id="out" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', left: 20 }} />
    </div>
  );
}
```

- [ ] **Step 5: Build + commit**

```bash
npm run build
git add src/nodes/sld/SldPvStringNode.tsx src/nodes/sld/SldDcDisconnectNode.tsx src/nodes/sld/SldFuseGpvNode.tsx src/nodes/sld/SldSpdDcNode.tsx
git commit -m "feat(sld): strona DC — pvString, dcDisconnect, fuseGpv, spdDc"
```

---

## Task 9: SLD inverter + battery (2 symbole)

**Files:**
- Create: `src/nodes/sld/SldInverterNode.tsx`
- Create: `src/nodes/sld/SldBatteryNode.tsx`

- [ ] **Step 1: `SldInverterNode.tsx` — kwadrat z `=/∼`**

```tsx
import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type T = Node<SchematicNodeData, 'sldInverter'>;

export function SldInverterNode({ data, selected }: NodeProps<T>) {
  const typ = String(data.parameters.type ?? 'string');
  const P = data.parameters.power ? `${data.parameters.power}kW` : '';
  const mppt = data.parameters.mppt ?? '';
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ width: 50, height: 60 }}>
      <Handle type="source" position={Position.Top} id="dc" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#b91c1c', left: 25 }} />
      <svg width="50" height="60" viewBox="0 0 50 60" style={{ overflow: 'visible' }}>
        <text x="25" y="-4" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#333">{data.label || 'U1'}</text>
        <rect x="5" y="6" width="40" height="48" fill="white" stroke="#222" strokeWidth="1.5" />
        <line x1="10" y1="30" x2="40" y2="30" stroke="#222" strokeWidth="1" />
        <text x="15" y="22" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#b91c1c">═</text>
        <text x="35" y="46" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#1d4ed8">∼</text>
        <line x1="20" y1="30" x2="30" y2="30" stroke="#222" strokeWidth="1.5" />
        <text x="25" y="66" textAnchor="middle" fontSize="7" fill="#888">{typ} {P} {mppt && `MPPT×${mppt}`}</text>
      </svg>
      <Handle type="source" position={Position.Bottom} id="ac" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#1d4ed8', left: 25 }} />
    </div>
  );
}
```

- [ ] **Step 2: `SldBatteryNode.tsx` — ogniwo galwaniczne**

```tsx
import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type T = Node<SchematicNodeData, 'sldBattery'>;

export function SldBatteryNode({ data, selected }: NodeProps<T>) {
  const cap = data.parameters.capacity ?? '';
  const v = data.parameters.voltage ?? '';
  const chem = String(data.parameters.chemistry ?? 'LiFePO4');
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ width: 50, height: 50 }}>
      <Handle type="source" position={Position.Top} id="in" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', left: 25 }} />
      <svg width="50" height="50" viewBox="0 0 50 50" style={{ overflow: 'visible' }}>
        <text x="25" y="-4" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#333">{data.label || 'BAT'}</text>
        <line x1="25" y1="0" x2="25" y2="14" stroke="#222" strokeWidth="1.5" />
        <line x1="10" y1="18" x2="40" y2="18" stroke="#222" strokeWidth="2.5" />
        <line x1="16" y1="22" x2="34" y2="22" stroke="#222" strokeWidth="1" />
        <line x1="10" y1="26" x2="40" y2="26" stroke="#222" strokeWidth="2.5" />
        <line x1="16" y1="30" x2="34" y2="30" stroke="#222" strokeWidth="1" />
        <text x="6" y="20" fontSize="9" fontWeight="bold" fill="#222">+</text>
        <text x="6" y="32" fontSize="9" fontWeight="bold" fill="#222">−</text>
        <line x1="25" y1="32" x2="25" y2="50" stroke="#222" strokeWidth="1.5" />
        <text x="25" y="58" textAnchor="middle" fontSize="7" fill="#888">{chem} {cap}kWh {v}V</text>
      </svg>
      <Handle type="source" position={Position.Bottom} id="out" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', left: 25 }} />
    </div>
  );
}
```

- [ ] **Step 3: Build + commit**

```bash
npm run build
git add src/nodes/sld/SldInverterNode.tsx src/nodes/sld/SldBatteryNode.tsx
git commit -m "feat(sld): falownik + magazyn — inverter, battery"
```

---

## Task 10: SLD grounding + OSD boundary (2 symbole)

**Files:**
- Create: `src/nodes/sld/SldGroundNode.tsx`
- Create: `src/nodes/sld/SldOsdBoundaryNode.tsx`

- [ ] **Step 1: `SldGroundNode.tsx` — uziom (3 kreski)**

```tsx
import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type T = Node<SchematicNodeData, 'sldGround'>;

export function SldGroundNode({ data, selected }: NodeProps<T>) {
  const re = data.parameters.re ? `RE=${data.parameters.re}Ω` : '';
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ width: 40, height: 30 }}>
      <Handle type="source" position={Position.Top} id="in" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#228B22', left: 20 }} />
      <svg width="40" height="30" viewBox="0 0 40 30" style={{ overflow: 'visible' }}>
        <line x1="20" y1="0" x2="20" y2="12" stroke="#228B22" strokeWidth="1.5" />
        <line x1="6" y1="12" x2="34" y2="12" stroke="#228B22" strokeWidth="2" />
        <line x1="11" y1="18" x2="29" y2="18" stroke="#228B22" strokeWidth="1.5" />
        <line x1="15" y1="24" x2="25" y2="24" stroke="#228B22" strokeWidth="1" />
        <text x="20" y="38" textAnchor="middle" fontSize="7" fill="#888">{re}</text>
      </svg>
    </div>
  );
}
```

- [ ] **Step 2: `SldOsdBoundaryNode.tsx` — pionowa linia przerywana z etykietą**

```tsx
import { type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type T = Node<SchematicNodeData, 'sldOsdBoundary'>;

export function SldOsdBoundaryNode({ data, selected }: NodeProps<T>) {
  const labelText = String(data.parameters.label ?? 'Granica własności OSD');
  return (
    <div className={`${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ width: 200, height: 80, pointerEvents: 'all' }}>
      <svg width="200" height="80" viewBox="0 0 200 80" style={{ overflow: 'visible' }}>
        <line x1="100" y1="0" x2="100" y2="80" stroke="#b91c1c" strokeWidth="1.2" strokeDasharray="6,4" />
        <text x="100" y="-4" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#b91c1c">{labelText}</text>
        <text x="105" y="40" fontSize="8" fill="#b91c1c">→ OSD</text>
        <text x="95" y="40" textAnchor="end" fontSize="8" fill="#b91c1c">odbiorca ←</text>
      </svg>
    </div>
  );
}
```

(Uwaga: ten node nie ma handles — to wyłącznie znacznik graficzny, nie podłączamy do niego kabli.)

- [ ] **Step 3: Build + commit**

```bash
npm run build
git add src/nodes/sld/SldGroundNode.tsx src/nodes/sld/SldOsdBoundaryNode.tsx
git commit -m "feat(sld): uziemienie + granica OSD"
```

---

## Task 11: Rejestracja wszystkich 18 SLD nodeTypes w `src/nodes/index.ts`

**Files:**
- Modify: `src/nodes/index.ts`

- [ ] **Step 1: Dodaj importy na końcu listy importów**

```typescript
// SLD — Single Line Diagram
import { SldGridSourceNode } from './sld/SldGridSourceNode.tsx';
import { SldCableJunctionNode } from './sld/SldCableJunctionNode.tsx';
import { SldMeterNode } from './sld/SldMeterNode.tsx';
import { SldCtNode } from './sld/SldCtNode.tsx';
import { SldMainSwitchNode } from './sld/SldMainSwitchNode.tsx';
import { SldFireSwitchNode } from './sld/SldFireSwitchNode.tsx';
import { SldMcbNode } from './sld/SldMcbNode.tsx';
import { SldRcdNode } from './sld/SldRcdNode.tsx';
import { SldRcboNode } from './sld/SldRcboNode.tsx';
import { SldSpdAcNode } from './sld/SldSpdAcNode.tsx';
import { SldPvStringNode } from './sld/SldPvStringNode.tsx';
import { SldDcDisconnectNode } from './sld/SldDcDisconnectNode.tsx';
import { SldFuseGpvNode } from './sld/SldFuseGpvNode.tsx';
import { SldSpdDcNode } from './sld/SldSpdDcNode.tsx';
import { SldInverterNode } from './sld/SldInverterNode.tsx';
import { SldBatteryNode } from './sld/SldBatteryNode.tsx';
import { SldGroundNode } from './sld/SldGroundNode.tsx';
import { SldOsdBoundaryNode } from './sld/SldOsdBoundaryNode.tsx';
```

- [ ] **Step 2: Dodaj wpisy w `nodeTypes` przed zamknięciem obiektu**

```typescript
  // SLD — Single Line Diagram
  sldGridSource: SldGridSourceNode,
  sldCableJunction: SldCableJunctionNode,
  sldMeter: SldMeterNode,
  sldCt: SldCtNode,
  sldMainSwitch: SldMainSwitchNode,
  sldFireSwitch: SldFireSwitchNode,
  sldMcb: SldMcbNode,
  sldRcd: SldRcdNode,
  sldRcbo: SldRcboNode,
  sldSpdAc: SldSpdAcNode,
  sldPvString: SldPvStringNode,
  sldDcDisconnect: SldDcDisconnectNode,
  sldFuseGpv: SldFuseGpvNode,
  sldSpdDc: SldSpdDcNode,
  sldInverter: SldInverterNode,
  sldBattery: SldBatteryNode,
  sldGround: SldGroundNode,
  sldOsdBoundary: SldOsdBoundaryNode,
```

- [ ] **Step 3: Build + lint**

Run: `npm run build && npm run lint`
Expected: zielone.

- [ ] **Step 4: Commit**

```bash
git add src/nodes/index.ts
git commit -m "feat(sld): rejestracja 18 SLD nodeTypes"
```

---

## Task 12: `SINGLE_LINE_ELEMENT_DEFINITIONS` — definicje sidebar

**Files:**
- Create: `src/constants/singleLineElements.ts`

- [ ] **Step 1: Utwórz plik z pełną listą 18 definicji**

```typescript
import type { ElementDefinition } from '../types/index.ts';

export const SINGLE_LINE_ELEMENT_DEFINITIONS: ElementDefinition[] = [
  // ===== Źródło + pomiar AC =====
  {
    id: 'sld_grid_source',
    name: 'Źródło sieciowe',
    category: 'sldAcSource',
    designation: '',
    nodeType: 'sldGridSource',
    defaultLabel: 'Sieć',
    parameters: [
      { key: 'network', label: 'Sieć', type: 'text', defaultValue: '~3/N/PE 400/230 V 50 Hz' },
    ],
  },
  {
    id: 'sld_cable_junction',
    name: 'Złącze kablowe',
    category: 'sldAcSource',
    designation: 'ZK',
    nodeType: 'sldCableJunction',
    defaultLabel: 'ZK',
    parameters: [],
  },
  {
    id: 'sld_meter',
    name: 'Licznik energii',
    category: 'sldAcSource',
    designation: 'P',
    nodeType: 'sldMeter',
    defaultLabel: 'P1',
    parameters: [
      { key: 'direction', label: 'Kierunek', type: 'select', options: ['1-kier', '2-kier'], defaultValue: '2-kier' },
      { key: 'phases', label: 'Fazy', type: 'select', options: ['1', '3'], defaultValue: '3' },
    ],
  },
  {
    id: 'sld_ct',
    name: 'Przekładnik prądowy',
    category: 'sldAcSource',
    designation: 'TA',
    nodeType: 'sldCt',
    defaultLabel: 'TA1',
    parameters: [
      { key: 'ratio', label: 'Przekładnia', type: 'text', defaultValue: '100/5A' },
    ],
  },

  // ===== Aparaty łączeniowe + zabezpieczenia AC =====
  {
    id: 'sld_main_switch',
    name: 'Rozłącznik główny',
    category: 'sldAcProtection',
    designation: 'Q',
    nodeType: 'sldMainSwitch',
    defaultLabel: 'Q1',
    parameters: [
      { key: 'poles', label: 'Bieguny', type: 'select', options: ['1P', '2P', '3P', '4P'], defaultValue: '4P' },
      { key: 'ratingCurrent', label: 'In', type: 'number', unit: 'A', defaultValue: 63 },
    ],
  },
  {
    id: 'sld_fire_switch',
    name: 'PWP (wyłącznik pożarowy)',
    category: 'sldAcProtection',
    designation: 'F-PWP',
    nodeType: 'sldFireSwitch',
    defaultLabel: 'PWP',
    parameters: [],
  },
  {
    id: 'sld_mcb',
    name: 'Wyłącznik MCB',
    category: 'sldAcProtection',
    designation: 'F',
    nodeType: 'sldMcb',
    defaultLabel: 'F1',
    parameters: [
      { key: 'curve', label: 'Krzywa', type: 'select', options: ['B', 'C', 'D'], defaultValue: 'B' },
      { key: 'ratingCurrent', label: 'In', type: 'number', unit: 'A', defaultValue: 16 },
      { key: 'poles', label: 'Bieguny', type: 'select', options: ['1P', '2P', '3P', '4P'], defaultValue: '1P' },
    ],
  },
  {
    id: 'sld_rcd',
    name: 'Wyłącznik RCD',
    category: 'sldAcProtection',
    designation: 'F-RCD',
    nodeType: 'sldRcd',
    defaultLabel: 'F-RCD1',
    parameters: [
      { key: 'rcdType', label: 'Typ', type: 'select', options: ['A', 'B', 'F', 'B+'], defaultValue: 'A' },
      { key: 'ratingCurrent', label: 'In', type: 'number', unit: 'A', defaultValue: 25 },
      { key: 'sensitivityCurrent', label: 'IΔn', type: 'number', unit: 'mA', defaultValue: 30 },
      { key: 'poles', label: 'Bieguny', type: 'select', options: ['2P', '4P'], defaultValue: '4P' },
    ],
  },
  {
    id: 'sld_rcbo',
    name: 'Wyłącznik RCBO (MCB+RCD)',
    category: 'sldAcProtection',
    designation: 'F',
    nodeType: 'sldRcbo',
    defaultLabel: 'F1',
    parameters: [
      { key: 'curve', label: 'Krzywa', type: 'select', options: ['B', 'C', 'D'], defaultValue: 'B' },
      { key: 'ratingCurrent', label: 'In', type: 'number', unit: 'A', defaultValue: 16 },
      { key: 'rcdType', label: 'Typ RCD', type: 'select', options: ['A', 'B', 'F', 'B+'], defaultValue: 'A' },
      { key: 'sensitivityCurrent', label: 'IΔn', type: 'number', unit: 'mA', defaultValue: 30 },
      { key: 'poles', label: 'Bieguny', type: 'select', options: ['1P+N', '3P+N'], defaultValue: '1P+N' },
    ],
  },
  {
    id: 'sld_spd_ac',
    name: 'Ogranicznik przepięć AC',
    category: 'sldAcProtection',
    designation: 'F-SPD',
    nodeType: 'sldSpdAc',
    defaultLabel: 'F-SPD1',
    parameters: [
      { key: 'spdClass', label: 'Klasa', type: 'select', options: ['T1', 'T1+2', 'T2', 'T3'], defaultValue: 'T2' },
      { key: 'uc', label: 'UC', type: 'number', unit: 'V', defaultValue: 275 },
    ],
  },

  // ===== Strona DC =====
  {
    id: 'sld_pv_string',
    name: 'String PV',
    category: 'sldDc',
    designation: 'E',
    nodeType: 'sldPvString',
    defaultLabel: 'PV1',
    parameters: [
      { key: 'panelCount', label: 'Liczba paneli', type: 'number', defaultValue: 8 },
      { key: 'voc', label: 'Voc', type: 'number', unit: 'V' },
      { key: 'isc', label: 'Isc', type: 'number', unit: 'A' },
      { key: 'mpp', label: 'Pmpp', type: 'number', unit: 'W' },
    ],
  },
  {
    id: 'sld_dc_disconnect',
    name: 'Rozłącznik DC',
    category: 'sldDc',
    designation: 'QS',
    nodeType: 'sldDcDisconnect',
    defaultLabel: 'QS1',
    parameters: [
      { key: 'poles', label: 'Bieguny', type: 'select', options: ['2P', '4P'], defaultValue: '2P' },
      { key: 'ratingCurrent', label: 'In', type: 'number', unit: 'A', defaultValue: 25 },
      { key: 'ratingVoltage', label: 'Un', type: 'number', unit: 'V', defaultValue: 1000 },
    ],
  },
  {
    id: 'sld_fuse_gpv',
    name: 'Bezpiecznik gPV',
    category: 'sldDc',
    designation: 'F',
    nodeType: 'sldFuseGpv',
    defaultLabel: 'F1',
    parameters: [
      { key: 'ratingCurrent', label: 'In', type: 'number', unit: 'A', defaultValue: 15 },
      { key: 'ratingVoltage', label: 'Un', type: 'number', unit: 'V', defaultValue: 1000 },
    ],
  },
  {
    id: 'sld_spd_dc',
    name: 'Ogranicznik przepięć DC',
    category: 'sldDc',
    designation: 'F-SPD',
    nodeType: 'sldSpdDc',
    defaultLabel: 'F-SPD1',
    parameters: [
      { key: 'spdClass', label: 'Klasa', type: 'select', options: ['T1+2', 'T2'], defaultValue: 'T1+2' },
      { key: 'uc', label: 'UC', type: 'number', unit: 'V', defaultValue: 600 },
    ],
  },

  // ===== Falownik + magazyn =====
  {
    id: 'sld_inverter',
    name: 'Falownik DC/AC',
    category: 'sldInverter',
    designation: 'U',
    nodeType: 'sldInverter',
    defaultLabel: 'U1',
    parameters: [
      { key: 'type', label: 'Typ', type: 'select', options: ['string', 'hybrid', 'mikro'], defaultValue: 'string' },
      { key: 'power', label: 'Moc', type: 'number', unit: 'kW', defaultValue: 10 },
      { key: 'mppt', label: 'MPPT', type: 'number', defaultValue: 2 },
    ],
  },
  {
    id: 'sld_battery',
    name: 'Magazyn energii',
    category: 'sldInverter',
    designation: 'G',
    nodeType: 'sldBattery',
    defaultLabel: 'BAT',
    parameters: [
      { key: 'chemistry', label: 'Chemia', type: 'select', options: ['LiFePO4', 'NMC', 'LTO'], defaultValue: 'LiFePO4' },
      { key: 'capacity', label: 'Pojemność', type: 'number', unit: 'kWh', defaultValue: 10 },
      { key: 'voltage', label: 'Napięcie', type: 'number', unit: 'V', defaultValue: 48 },
    ],
  },

  // ===== Uziemienie + granica =====
  {
    id: 'sld_ground',
    name: 'Uziom',
    category: 'sldGrounding',
    designation: '',
    nodeType: 'sldGround',
    defaultLabel: '',
    parameters: [
      { key: 're', label: 'RE', type: 'number', unit: 'Ω', defaultValue: 10 },
    ],
  },
  {
    id: 'sld_osd_boundary',
    name: 'Granica własności OSD',
    category: 'sldGrounding',
    designation: '',
    nodeType: 'sldOsdBoundary',
    defaultLabel: '',
    parameters: [
      { key: 'label', label: 'Etykieta', type: 'text', defaultValue: 'Granica własności OSD' },
    ],
  },
];
```

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: zielone.

- [ ] **Step 3: Commit**

```bash
git add src/constants/singleLineElements.ts
git commit -m "feat(sld): definicje 18 elementow SLD dla sidebar"
```

---

## Task 13: `SingleLineCanvas` — canvas SLD z drop SLD-only

**Files:**
- Create: `src/components/canvas/SingleLineCanvas.tsx`

- [ ] **Step 1: Utwórz plik**

```tsx
import {
  ReactFlow, Background, BackgroundVariant, Controls, MiniMap,
  useOnSelectionChange, useReactFlow, ConnectionMode,
  type Connection,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useCallback, useRef } from 'react';
import { useProjectStore, generateNextLabel } from '../../store/projectStore.ts';
import { nodeTypes } from '../../nodes/index.ts';
import { edgeTypes } from '../../edges/index.ts';
import { DrawingFrame } from '../drawing-frame/DrawingFrame.tsx';
import { WaypointOverlay } from './WaypointOverlay.tsx';
import { SINGLE_LINE_ELEMENT_DEFINITIONS } from '../../constants/singleLineElements.ts';
import type { SchematicNodeData } from '../../types/index.ts';
import type { Node } from '@xyflow/react';

export function SingleLineCanvas() {
  const {
    singleLineNodes, singleLineEdges,
    setSingleLineEdges, addNode, pushSingleLineHistory,
    setSelectedNodeId, setSelectedEdgeId,
    updateEdgeData,
    onSingleLineNodesChange, onSingleLineEdgesChange,
  } = useProjectStore();

  const { screenToFlowPosition } = useReactFlow();

  useOnSelectionChange({
    onChange: ({ nodes: sel, edges: selE }) => {
      setSelectedNodeId(sel.length === 1 ? sel[0].id : null);
      setSelectedEdgeId(selE.length === 1 ? selE[0].id : null);
    },
  });

  const onConnect = useCallback((connection: Connection) => {
    pushSingleLineHistory();
    const newEdge = {
      id: `e-${connection.source}-${connection.sourceHandle ?? ''}-${connection.target}-${connection.targetHandle ?? ''}-${Date.now()}`,
      source: connection.source,
      target: connection.target,
      sourceHandle: connection.sourceHandle,
      targetHandle: connection.targetHandle,
      type: 'singleLineCable',
      data: { cableType: 'YDY', cores: 5, crossSection: 6, current: 'AC' as const },
    };
    setSingleLineEdges([...useProjectStore.getState().singleLineEdges, newEdge]);
  }, [pushSingleLineHistory, setSingleLineEdges]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const elementId = event.dataTransfer.getData('application/sld-element');
    if (!elementId) return;

    const definition = SINGLE_LINE_ELEMENT_DEFINITIONS.find((d) => d.id === elementId);
    if (!definition) return;

    const GRID = 20;
    const raw = screenToFlowPosition({ x: event.clientX, y: event.clientY });
    const position = {
      x: Math.round(raw.x / GRID) * GRID,
      y: Math.round(raw.y / GRID) * GRID,
    };

    const parameters: Record<string, string | number> = {};
    for (const param of definition.parameters) {
      if (param.defaultValue !== undefined) parameters[param.key] = param.defaultValue;
    }

    const label = definition.designation
      ? (generateNextLabel(definition.designation) || definition.defaultLabel)
      : definition.defaultLabel;

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

  // Dwuklik na edge — dodaj punkt zalamania (manual routing only)
  const onEdgeDoubleClick = useCallback((evt: React.MouseEvent, edge: { id: string; data?: Record<string, unknown> }) => {
    const GRID = 10;
    const raw = screenToFlowPosition({ x: evt.clientX, y: evt.clientY });
    const snapped = { x: Math.round(raw.x / GRID) * GRID, y: Math.round(raw.y / GRID) * GRID };
    const existing = (edge.data?.waypoints as Array<{ x: number; y: number }>) ?? [];
    updateEdgeData(edge.id, { waypoints: [...existing, snapped] });
  }, [screenToFlowPosition, updateEdgeData]);

  const { zoomTo, getViewport } = useReactFlow();
  const zoomTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    clearTimeout(zoomTimeout.current);
    const currentZoom = getViewport().zoom;
    const delta = e.deltaY > 0 ? -0.03 : 0.03;
    const newZoom = Math.min(4, Math.max(0.1, currentZoom + delta));
    zoomTo(newZoom, { duration: 50 });
  }, [zoomTo, getViewport]);

  return (
    <div className="flex-1 relative" onWheel={onWheel}>
      <ReactFlow
        nodes={singleLineNodes}
        edges={singleLineEdges}
        onNodesChange={onSingleLineNodesChange}
        onEdgesChange={onSingleLineEdgesChange}
        onConnect={onConnect}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onEdgeDoubleClick={onEdgeDoubleClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={{ type: 'singleLineCable' }}
        connectionMode={ConnectionMode.Loose}
        isValidConnection={() => true}
        fitView
        snapToGrid
        snapGrid={[10, 10]}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        zoomOnScroll={false}
        minZoom={0.1}
        maxZoom={4}
        style={{ width: '100%', height: '100%' }}
      >
        <Background variant={BackgroundVariant.Lines} gap={20} size={1} color="#e8e8e8" />
        <Background id="bg-dots" variant={BackgroundVariant.Dots} gap={10} size={1} color="#ccc" />
        <Controls />
        <MiniMap pannable zoomable className="!bg-white !border !border-gray-200" />
        <DrawingFrame />
      </ReactFlow>
      <WaypointOverlay />
    </div>
  );
}
```

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: zielone.

- [ ] **Step 3: Commit**

```bash
git add src/components/canvas/SingleLineCanvas.tsx
git commit -m "feat(sld): SingleLineCanvas — drop SLD-only, default edge singleLineCable, manual routing"
```

---

## Task 14: `App.tsx` — switch trzech sheetów

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Importuj nowy canvas**

Dopisz po imporcie `LayoutCanvas`:
```typescript
import { SingleLineCanvas } from './components/canvas/SingleLineCanvas.tsx';
```

- [ ] **Step 2: Zastąp ternary switchem trójstanowym**

Zastąp linię:
```tsx
{activeSheet === 'schematic' ? <SchematicCanvas /> : <LayoutCanvas />}
```

przez:
```tsx
{activeSheet === 'schematic' && <SchematicCanvas />}
{activeSheet === 'singleLine' && <SingleLineCanvas />}
{activeSheet === 'layout' && <LayoutCanvas />}
```

- [ ] **Step 3: Build + lint**

Run: `npm run build && npm run lint`
Expected: zielone.

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx
git commit -m "feat(sld): App.tsx switch trzech sheetow (schematic/singleLine/layout)"
```

---

## Task 15: Toolbar — przełącznik 3-stanowy + ukrywanie konfiguracji nieistotnej dla SLD

**Files:**
- Modify: `src/components/toolbar/Toolbar.tsx`

- [ ] **Step 1: Zastąp blok zakładek (linia ~42–59)** trzystanowym selektorem

Znajdź `{/* Zakladki: Schemat / Lokalizacja */}` i zastąp cały otaczający `<div className="flex items-center gap-1">...</div>` blok:

```tsx
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
```

- [ ] **Step 2: Usuń stałą `isLayout` lub pozostaw w użyciu**

Znajdź `const isLayout = activeSheet === 'layout';` i pozostaw — pomocnicze.

Dodaj poniżej:
```typescript
  const isSingleLine = activeSheet === 'singleLine';
```

- [ ] **Step 3: Ukryj selektor typu linii i tryb trasowania dla SLD**

Znajdź blok `{/* Typ polaczenia */}` (linia ~83) i opakuj cały otaczający `<div>` w warunek:
```tsx
      {!isSingleLine && !isLayout && (
        <>
          <div className="h-6 w-px bg-gray-200" />
          {/* Typ polaczenia */}
          <div className="flex items-center gap-1">
            {/* ...istniejące buttony L1/L2/L3/N/DC/.../PE... */}
          </div>
          <div className="h-6 w-px bg-gray-200" />
          {/* Tryb trasowania */}
          <div className="flex items-center gap-1">
            {/* ...istniejące buttony auto/manual... */}
          </div>
        </>
      )}
```

(W trybie SLD edge zawsze `singleLineCable`, routing zawsze manual — nie ma co wybierać.)

- [ ] **Step 4: Build + lint + dev**

Run: `npm run build && npm run lint`
Expected: zielone.

Run: `npm run dev` i sprawdź wizualnie że:
- są 3 przyciski w toolbarze: Wielokreskowy / Jednokreskowy / Lokalizacja
- po wybraniu „Jednokreskowy" znikają wybory typu linii i trasowania
- po wybraniu „Wielokreskowy" wracają.

- [ ] **Step 5: Commit**

```bash
git add src/components/toolbar/Toolbar.tsx
git commit -m "feat(sld): Toolbar 3-stanowy + ukrycie typu linii/routingu dla SLD"
```

---

## Task 16: Sidebar — gałąź SLD z nowymi kategoriami

**Files:**
- Modify: `src/components/sidebar/Sidebar.tsx`

- [ ] **Step 1: Importuj definicje SLD**

Po imporcie `LAYOUT_ELEMENT_DEFINITIONS`:
```typescript
import { SINGLE_LINE_ELEMENT_DEFINITIONS } from '../../constants/singleLineElements.ts';
```

- [ ] **Step 2: Rozszerz `CATEGORY_NAMES` o kategorie SLD**

```typescript
const CATEGORY_NAMES: Record<ElementCategory, string> = {
  dc: 'Strona DC',
  ac: 'Strona AC',
  inverter: 'Falownik / magazyn',
  ev: 'Ładowarki EV',
  transfer: 'Przełączniki',
  grounding: 'Uziemienie',
  enclosure: 'Rozdzielnice',
  wiring: 'Linie i szyny',
  sldAcSource: 'AC — źródło / pomiar (SLD)',
  sldAcProtection: 'AC — aparaty / zabezpieczenia (SLD)',
  sldDc: 'Strona DC (SLD)',
  sldInverter: 'Falownik / magazyn (SLD)',
  sldGrounding: 'Uziemienie + granica (SLD)',
};
```

- [ ] **Step 3: Rozszerz logikę wyboru zestawu i typu MIME**

Zastąp obecne ciało komponentu od linii `const isLayout = ...` do `const dataType = ...`:

```typescript
  const activeSheet = useProjectStore((s) => s.activeSheet);

  const elements =
    activeSheet === 'layout' ? LAYOUT_ELEMENT_DEFINITIONS
    : activeSheet === 'singleLine' ? SINGLE_LINE_ELEMENT_DEFINITIONS
    : ELEMENT_DEFINITIONS;

  const dataType =
    activeSheet === 'layout' ? 'application/layout-element'
    : activeSheet === 'singleLine' ? 'application/sld-element'
    : 'application/schematic-element';

  const headerTitle =
    activeSheet === 'layout' ? 'Elementy lokalizacji'
    : activeSheet === 'singleLine' ? 'Elementy jednokreskowe'
    : 'Elementy schematu';
```

Następnie zastąp `<h2>` na `{headerTitle}`.

- [ ] **Step 4: Build + lint + dev**

Run: `npm run build && npm run lint`
Expected: zielone.

Run: `npm run dev`, przełącz na "Jednokreskowy" — w sidebar pojawia się 18 elementów w 5 kategoriach.

- [ ] **Step 5: Commit**

```bash
git add src/components/sidebar/Sidebar.tsx
git commit -m "feat(sld): Sidebar — galaz SLD + 5 nowych kategorii"
```

---

## Task 17: PropertiesPanel — formularz edge'a SLD

**Files:**
- Modify: `src/components/properties/PropertiesPanel.tsx`

- [ ] **Step 1: Dodaj definicję pól dla edge'a SLD w `EDGE_FIELDS`**

W `EDGE_FIELDS: Record<string, ParameterDefinition[]>` dopisz nowy klucz:

```typescript
  singleLineCable: [
    { key: 'cableType', label: 'Typ kabla', type: 'select', options: ['YDY', 'YKY', 'YKXS', 'NYM', 'H1Z2Z2-K', 'LgY'], defaultValue: 'YDY' },
    { key: 'cores', label: 'Liczba żył', type: 'number', defaultValue: 5 },
    { key: 'crossSection', label: 'Przekrój [mm²]', type: 'number', defaultValue: 6 },
    { key: 'peCrossSection', label: 'Przekrój PE [mm²]', type: 'number' },
    { key: 'circuitId', label: 'Obwód (W1, O.1)', type: 'text' },
    { key: 'length', label: 'Długość [m]', type: 'number' },
    { key: 'current', label: 'Prąd', type: 'select', options: ['AC', 'DC'], defaultValue: 'AC' },
  ],
```

- [ ] **Step 2: Build + lint**

Run: `npm run build && npm run lint`
Expected: zielone.

Run: `npm run dev`, na arkuszu „Jednokreskowy" połącz dwa symbole, kliknij na edge — w prawej kolumnie powinien pojawić się formularz z 7 polami. Zmień `cores` na 3 → kreski na linii zmniejszą się do 3.

- [ ] **Step 3: Commit**

```bash
git add src/components/properties/PropertiesPanel.tsx
git commit -m "feat(sld): PropertiesPanel — formularz edge'a singleLineCable"
```

---

## Task 18: Helpers SLD templates + template `onGrid1PhaseSld`

**Files:**
- Create: `src/templates/sld/helpers.ts`
- Create: `src/templates/sld/types.ts`
- Create: `src/templates/sld/onGrid1Phase.ts`

- [ ] **Step 1: `src/templates/sld/types.ts`** — typy wspólne

```typescript
import type { Node, Edge } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

export interface SldTemplate {
  id: string;
  name: string;
  description: string;
  generate(): { nodes: Node<SchematicNodeData>[]; edges: Edge[] };
}
```

- [ ] **Step 2: `src/templates/sld/helpers.ts`** — pomocnicze

```typescript
import type { Node, Edge } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

let counter = 0;

export function resetCounter() {
  counter = 0;
}

export function nodeId(prefix: string): string {
  counter += 1;
  return `sld-${prefix}-${counter}`;
}

export function makeNode(
  id: string,
  type: string,
  x: number,
  y: number,
  data: SchematicNodeData,
): Node<SchematicNodeData> {
  return { id, type, position: { x, y }, data };
}

export interface SldCableData {
  cableType: string;
  cores: number;
  crossSection: number;
  peCrossSection?: number;
  circuitId?: string;
  length?: number;
  current?: 'AC' | 'DC';
}

export function makeCable(
  source: string,
  target: string,
  data: SldCableData,
  sourceHandle = 'out',
  targetHandle = 'in',
): Edge {
  return {
    id: `e-${source}-${target}-${counter++}`,
    source,
    target,
    sourceHandle,
    targetHandle,
    type: 'singleLineCable',
    data: data as unknown as Record<string, unknown>,
  };
}
```

- [ ] **Step 3: `src/templates/sld/onGrid1Phase.ts`** — szablon 1-fazowy

```typescript
import type { SldTemplate } from './types.ts';
import { makeNode, makeCable, nodeId, resetCounter } from './helpers.ts';

export const onGrid1PhaseSld: SldTemplate = {
  id: 'sld-on-grid-1phase',
  name: 'SLD — PV 1-faz. ON-grid',
  description: 'Sieć 230V → ZK → licznik 2-kier → PWP → Q1 → RG → RPV-AC → inwerter → DC → string',

  generate() {
    resetCounter();

    const grid = nodeId('grid');
    const zk = nodeId('zk');
    const boundary = nodeId('boundary');
    const meter = nodeId('meter');
    const pwp = nodeId('pwp');
    const q1 = nodeId('q1');
    const f1 = nodeId('f1');
    const rcd = nodeId('rcd');
    const spdAc = nodeId('spdac');
    const fpv = nodeId('fpv');
    const spdPvAc = nodeId('spdpvac');
    const inv = nodeId('inv');
    const qsdc = nodeId('qsdc');
    const fgpv = nodeId('fgpv');
    const spdDc = nodeId('spddc');
    const pv = nodeId('pv');
    const gnd = nodeId('gnd');

    const cx = 300;

    const nodes = [
      makeNode(grid, 'sldGridSource', cx, 0, {
        label: 'Sieć', elementId: 'sld_grid_source', designation: '',
        parameters: { network: '~/N/PE 230 V 50 Hz' },
      }),
      makeNode(zk, 'sldCableJunction', cx, 80, {
        label: 'ZK', elementId: 'sld_cable_junction', designation: 'ZK',
        parameters: {},
      }),
      makeNode(boundary, 'sldOsdBoundary', cx - 100, 130, {
        label: '', elementId: 'sld_osd_boundary', designation: '',
        parameters: { label: 'Granica własności OSD' },
      }),
      makeNode(meter, 'sldMeter', cx, 160, {
        label: 'P1', elementId: 'sld_meter', designation: 'P',
        parameters: { direction: '2-kier', phases: '1' },
      }),
      makeNode(pwp, 'sldFireSwitch', cx, 240, {
        label: 'PWP', elementId: 'sld_fire_switch', designation: 'F-PWP',
        parameters: {},
      }),
      makeNode(q1, 'sldMainSwitch', cx, 320, {
        label: 'Q1', elementId: 'sld_main_switch', designation: 'Q',
        parameters: { poles: '2P', ratingCurrent: 40 },
      }),
      makeNode(f1, 'sldMcb', cx - 80, 400, {
        label: 'F1', elementId: 'sld_mcb', designation: 'F',
        parameters: { curve: 'B', ratingCurrent: 16, poles: '1P' },
      }),
      makeNode(rcd, 'sldRcd', cx - 80, 480, {
        label: 'F-RCD1', elementId: 'sld_rcd', designation: 'F-RCD',
        parameters: { rcdType: 'A', ratingCurrent: 25, sensitivityCurrent: 30, poles: '2P' },
      }),
      makeNode(spdAc, 'sldSpdAc', cx + 80, 400, {
        label: 'F-SPD1', elementId: 'sld_spd_ac', designation: 'F-SPD',
        parameters: { spdClass: 'T2', uc: 275 },
      }),
      makeNode(fpv, 'sldMcb', cx, 480, {
        label: 'F2', elementId: 'sld_mcb', designation: 'F',
        parameters: { curve: 'B', ratingCurrent: 16, poles: '1P' },
      }),
      makeNode(spdPvAc, 'sldSpdAc', cx + 80, 480, {
        label: 'F-SPD2', elementId: 'sld_spd_ac', designation: 'F-SPD',
        parameters: { spdClass: 'T2', uc: 275 },
      }),
      makeNode(inv, 'sldInverter', cx, 560, {
        label: 'U1', elementId: 'sld_inverter', designation: 'U',
        parameters: { type: 'string', power: 3, mppt: 1 },
      }),
      makeNode(qsdc, 'sldDcDisconnect', cx, 660, {
        label: 'QS1', elementId: 'sld_dc_disconnect', designation: 'QS',
        parameters: { poles: '2P', ratingCurrent: 25, ratingVoltage: 1000 },
      }),
      makeNode(fgpv, 'sldFuseGpv', cx - 60, 740, {
        label: 'F3', elementId: 'sld_fuse_gpv', designation: 'F',
        parameters: { ratingCurrent: 15, ratingVoltage: 1000 },
      }),
      makeNode(spdDc, 'sldSpdDc', cx + 60, 740, {
        label: 'F-SPD3', elementId: 'sld_spd_dc', designation: 'F-SPD',
        parameters: { spdClass: 'T1+2', uc: 600 },
      }),
      makeNode(pv, 'sldPvString', cx, 820, {
        label: 'PV1', elementId: 'sld_pv_string', designation: 'E',
        parameters: { panelCount: 8, voc: 40, isc: 11, mpp: 380 },
      }),
      makeNode(gnd, 'sldGround', cx + 160, 320, {
        label: '', elementId: 'sld_ground', designation: '',
        parameters: { re: 10 },
      }),
    ];

    const ac = (source: string, target: string, cores: number, cross: number, circuit?: string, len?: number) =>
      makeCable(source, target, { cableType: 'YKY', cores, crossSection: cross, circuitId: circuit, length: len, current: 'AC' });

    const dc = (source: string, target: string, len?: number) =>
      makeCable(source, target, { cableType: 'H1Z2Z2-K', cores: 1, crossSection: 6, length: len, current: 'DC' });

    const edges = [
      ac(grid, zk, 3, 10, 'W0', 5),
      ac(zk, meter, 3, 10, undefined, 5),
      ac(meter, pwp, 3, 6),
      ac(pwp, q1, 3, 6),
      ac(q1, f1, 3, 6, 'W1', 5),
      ac(f1, rcd, 3, 6),
      ac(q1, fpv, 3, 6, 'W-PV', 8),
      ac(fpv, inv, 3, 6),
      dc(inv, qsdc, 0.5),
      dc(qsdc, fgpv, 0.5),
      dc(fgpv, pv, 12),
    ];

    return { nodes, edges };
  },
};
```

- [ ] **Step 4: Build**

Run: `npm run build`
Expected: zielone (jeszcze nie zarejestrowane w toolbarze — zrobimy w Task 21).

- [ ] **Step 5: Commit**

```bash
git add src/templates/sld/helpers.ts src/templates/sld/types.ts src/templates/sld/onGrid1Phase.ts
git commit -m "feat(sld): helpers + template onGrid1PhaseSld"
```

---

## Task 19: Template `onGrid3PhaseSld` (3-fazowy)

**Files:**
- Create: `src/templates/sld/onGrid3Phase.ts`

- [ ] **Step 1: Utwórz template (analogicznie do 1-faz, ale 3-faz)**

```typescript
import type { SldTemplate } from './types.ts';
import { makeNode, makeCable, nodeId, resetCounter } from './helpers.ts';

export const onGrid3PhaseSld: SldTemplate = {
  id: 'sld-on-grid-3phase',
  name: 'SLD — PV 3-faz. ON-grid',
  description: 'Sieć 400/230V → ZK → licznik 3F 2-kier → PWP → Q1 → RG → RPV-AC → inwerter 3F → DC → 2 stringi',

  generate() {
    resetCounter();

    const grid = nodeId('grid');
    const zk = nodeId('zk');
    const boundary = nodeId('boundary');
    const meter = nodeId('meter');
    const pwp = nodeId('pwp');
    const q1 = nodeId('q1');
    const f1 = nodeId('f1');
    const rcd = nodeId('rcd');
    const spdAc = nodeId('spdac');
    const fpv = nodeId('fpv');
    const spdPvAc = nodeId('spdpvac');
    const inv = nodeId('inv');
    const qsdc = nodeId('qsdc');
    const fgpv1 = nodeId('fgpv1');
    const fgpv2 = nodeId('fgpv2');
    const spdDc = nodeId('spddc');
    const pv1 = nodeId('pv1');
    const pv2 = nodeId('pv2');
    const gnd = nodeId('gnd');

    const cx = 300;

    const nodes = [
      makeNode(grid, 'sldGridSource', cx, 0, {
        label: 'Sieć', elementId: 'sld_grid_source', designation: '',
        parameters: { network: '~3/N/PE 400/230 V 50 Hz' },
      }),
      makeNode(zk, 'sldCableJunction', cx, 80, {
        label: 'ZK', elementId: 'sld_cable_junction', designation: 'ZK',
        parameters: {},
      }),
      makeNode(boundary, 'sldOsdBoundary', cx - 100, 130, {
        label: '', elementId: 'sld_osd_boundary', designation: '',
        parameters: { label: 'Granica własności OSD' },
      }),
      makeNode(meter, 'sldMeter', cx, 160, {
        label: 'P1', elementId: 'sld_meter', designation: 'P',
        parameters: { direction: '2-kier', phases: '3' },
      }),
      makeNode(pwp, 'sldFireSwitch', cx, 240, {
        label: 'PWP', elementId: 'sld_fire_switch', designation: 'F-PWP',
        parameters: {},
      }),
      makeNode(q1, 'sldMainSwitch', cx, 320, {
        label: 'Q1', elementId: 'sld_main_switch', designation: 'Q',
        parameters: { poles: '4P', ratingCurrent: 63 },
      }),
      makeNode(f1, 'sldMcb', cx - 100, 400, {
        label: 'F1', elementId: 'sld_mcb', designation: 'F',
        parameters: { curve: 'B', ratingCurrent: 16, poles: '3P' },
      }),
      makeNode(rcd, 'sldRcd', cx - 100, 480, {
        label: 'F-RCD1', elementId: 'sld_rcd', designation: 'F-RCD',
        parameters: { rcdType: 'A', ratingCurrent: 40, sensitivityCurrent: 30, poles: '4P' },
      }),
      makeNode(spdAc, 'sldSpdAc', cx + 100, 400, {
        label: 'F-SPD1', elementId: 'sld_spd_ac', designation: 'F-SPD',
        parameters: { spdClass: 'T2', uc: 275 },
      }),
      makeNode(fpv, 'sldMcb', cx, 480, {
        label: 'F2', elementId: 'sld_mcb', designation: 'F',
        parameters: { curve: 'C', ratingCurrent: 20, poles: '3P' },
      }),
      makeNode(spdPvAc, 'sldSpdAc', cx + 100, 480, {
        label: 'F-SPD2', elementId: 'sld_spd_ac', designation: 'F-SPD',
        parameters: { spdClass: 'T2', uc: 275 },
      }),
      makeNode(inv, 'sldInverter', cx, 560, {
        label: 'U1', elementId: 'sld_inverter', designation: 'U',
        parameters: { type: 'string', power: 10, mppt: 2 },
      }),
      makeNode(qsdc, 'sldDcDisconnect', cx, 660, {
        label: 'QS1', elementId: 'sld_dc_disconnect', designation: 'QS',
        parameters: { poles: '4P', ratingCurrent: 25, ratingVoltage: 1000 },
      }),
      makeNode(fgpv1, 'sldFuseGpv', cx - 60, 740, {
        label: 'F3', elementId: 'sld_fuse_gpv', designation: 'F',
        parameters: { ratingCurrent: 15, ratingVoltage: 1000 },
      }),
      makeNode(fgpv2, 'sldFuseGpv', cx + 60, 740, {
        label: 'F4', elementId: 'sld_fuse_gpv', designation: 'F',
        parameters: { ratingCurrent: 15, ratingVoltage: 1000 },
      }),
      makeNode(spdDc, 'sldSpdDc', cx + 160, 740, {
        label: 'F-SPD3', elementId: 'sld_spd_dc', designation: 'F-SPD',
        parameters: { spdClass: 'T1+2', uc: 600 },
      }),
      makeNode(pv1, 'sldPvString', cx - 60, 820, {
        label: 'PV1', elementId: 'sld_pv_string', designation: 'E',
        parameters: { panelCount: 12, voc: 40, isc: 11, mpp: 380 },
      }),
      makeNode(pv2, 'sldPvString', cx + 60, 820, {
        label: 'PV2', elementId: 'sld_pv_string', designation: 'E',
        parameters: { panelCount: 12, voc: 40, isc: 11, mpp: 380 },
      }),
      makeNode(gnd, 'sldGround', cx + 200, 320, {
        label: '', elementId: 'sld_ground', designation: '',
        parameters: { re: 10 },
      }),
    ];

    const ac = (source: string, target: string, cores: number, cross: number, circuit?: string, len?: number) =>
      makeCable(source, target, { cableType: 'YKY', cores, crossSection: cross, circuitId: circuit, length: len, current: 'AC' });

    const dc = (source: string, target: string, len?: number) =>
      makeCable(source, target, { cableType: 'H1Z2Z2-K', cores: 1, crossSection: 6, length: len, current: 'DC' });

    const edges = [
      ac(grid, zk, 5, 10, 'W0', 5),
      ac(zk, meter, 5, 10, undefined, 5),
      ac(meter, pwp, 5, 10),
      ac(pwp, q1, 5, 10),
      ac(q1, f1, 5, 6, 'W1', 5),
      ac(f1, rcd, 5, 6),
      ac(q1, fpv, 5, 6, 'W-PV', 8),
      ac(fpv, inv, 5, 6),
      dc(inv, qsdc, 0.5),
      dc(qsdc, fgpv1, 0.5),
      dc(qsdc, fgpv2, 0.5),
      dc(fgpv1, pv1, 12),
      dc(fgpv2, pv2, 12),
    ];

    return { nodes, edges };
  },
};
```

- [ ] **Step 2: Build + commit**

```bash
npm run build
git add src/templates/sld/onGrid3Phase.ts
git commit -m "feat(sld): template onGrid3PhaseSld"
```

---

## Task 20: Template `hybridSld` (3-faz + magazyn)

**Files:**
- Create: `src/templates/sld/hybrid.ts`
- Create: `src/templates/sld/index.ts`

- [ ] **Step 1: Utwórz `hybrid.ts`** — bazując na 3-faz, dodając hybrydę + baterię + drugi licznik

```typescript
import type { SldTemplate } from './types.ts';
import { makeNode, makeCable, nodeId, resetCounter } from './helpers.ts';

export const hybridSld: SldTemplate = {
  id: 'sld-hybrid',
  name: 'SLD — Hybryda PV + magazyn',
  description: 'Sieć 400/230V → licznik OSD 2-kier → PWP → Q1 → inwerter hybrydowy ⇄ bateria, DC → 2 stringi',

  generate() {
    resetCounter();

    const grid = nodeId('grid');
    const zk = nodeId('zk');
    const boundary = nodeId('boundary');
    const meterOsd = nodeId('meter-osd');
    const pwp = nodeId('pwp');
    const q1 = nodeId('q1');
    const f1 = nodeId('f1');
    const rcd = nodeId('rcd');
    const spdAc = nodeId('spdac');
    const meterPv = nodeId('meter-pv');
    const fpv = nodeId('fpv');
    const spdPvAc = nodeId('spdpvac');
    const invH = nodeId('inv-h');
    const bat = nodeId('bat');
    const qsdc = nodeId('qsdc');
    const fgpv1 = nodeId('fgpv1');
    const fgpv2 = nodeId('fgpv2');
    const spdDc = nodeId('spddc');
    const pv1 = nodeId('pv1');
    const pv2 = nodeId('pv2');
    const gnd = nodeId('gnd');

    const cx = 300;

    const nodes = [
      makeNode(grid, 'sldGridSource', cx, 0, {
        label: 'Sieć', elementId: 'sld_grid_source', designation: '',
        parameters: { network: '~3/N/PE 400/230 V 50 Hz' },
      }),
      makeNode(zk, 'sldCableJunction', cx, 80, {
        label: 'ZK', elementId: 'sld_cable_junction', designation: 'ZK',
        parameters: {},
      }),
      makeNode(boundary, 'sldOsdBoundary', cx - 100, 130, {
        label: '', elementId: 'sld_osd_boundary', designation: '',
        parameters: { label: 'Granica własności OSD' },
      }),
      makeNode(meterOsd, 'sldMeter', cx, 160, {
        label: 'P-OSD', elementId: 'sld_meter', designation: 'P',
        parameters: { direction: '2-kier', phases: '3' },
      }),
      makeNode(pwp, 'sldFireSwitch', cx, 240, {
        label: 'PWP', elementId: 'sld_fire_switch', designation: 'F-PWP',
        parameters: {},
      }),
      makeNode(q1, 'sldMainSwitch', cx, 320, {
        label: 'Q1', elementId: 'sld_main_switch', designation: 'Q',
        parameters: { poles: '4P', ratingCurrent: 63 },
      }),
      makeNode(f1, 'sldMcb', cx - 100, 400, {
        label: 'F1', elementId: 'sld_mcb', designation: 'F',
        parameters: { curve: 'B', ratingCurrent: 16, poles: '3P' },
      }),
      makeNode(rcd, 'sldRcd', cx - 100, 480, {
        label: 'F-RCD1', elementId: 'sld_rcd', designation: 'F-RCD',
        parameters: { rcdType: 'B', ratingCurrent: 40, sensitivityCurrent: 30, poles: '4P' },
      }),
      makeNode(spdAc, 'sldSpdAc', cx + 100, 400, {
        label: 'F-SPD1', elementId: 'sld_spd_ac', designation: 'F-SPD',
        parameters: { spdClass: 'T2', uc: 275 },
      }),
      makeNode(meterPv, 'sldMeter', cx, 460, {
        label: 'P-PV', elementId: 'sld_meter', designation: 'P',
        parameters: { direction: '1-kier', phases: '3' },
      }),
      makeNode(fpv, 'sldMcb', cx, 540, {
        label: 'F2', elementId: 'sld_mcb', designation: 'F',
        parameters: { curve: 'C', ratingCurrent: 20, poles: '3P' },
      }),
      makeNode(spdPvAc, 'sldSpdAc', cx + 100, 540, {
        label: 'F-SPD2', elementId: 'sld_spd_ac', designation: 'F-SPD',
        parameters: { spdClass: 'T2', uc: 275 },
      }),
      makeNode(invH, 'sldInverter', cx, 620, {
        label: 'U1', elementId: 'sld_inverter', designation: 'U',
        parameters: { type: 'hybrid', power: 10, mppt: 2 },
      }),
      makeNode(bat, 'sldBattery', cx + 130, 620, {
        label: 'BAT', elementId: 'sld_battery', designation: 'G',
        parameters: { chemistry: 'LiFePO4', capacity: 10, voltage: 48 },
      }),
      makeNode(qsdc, 'sldDcDisconnect', cx, 720, {
        label: 'QS1', elementId: 'sld_dc_disconnect', designation: 'QS',
        parameters: { poles: '4P', ratingCurrent: 25, ratingVoltage: 1000 },
      }),
      makeNode(fgpv1, 'sldFuseGpv', cx - 60, 800, {
        label: 'F3', elementId: 'sld_fuse_gpv', designation: 'F',
        parameters: { ratingCurrent: 15, ratingVoltage: 1000 },
      }),
      makeNode(fgpv2, 'sldFuseGpv', cx + 60, 800, {
        label: 'F4', elementId: 'sld_fuse_gpv', designation: 'F',
        parameters: { ratingCurrent: 15, ratingVoltage: 1000 },
      }),
      makeNode(spdDc, 'sldSpdDc', cx + 160, 800, {
        label: 'F-SPD3', elementId: 'sld_spd_dc', designation: 'F-SPD',
        parameters: { spdClass: 'T1+2', uc: 600 },
      }),
      makeNode(pv1, 'sldPvString', cx - 60, 880, {
        label: 'PV1', elementId: 'sld_pv_string', designation: 'E',
        parameters: { panelCount: 12, voc: 40, isc: 11, mpp: 380 },
      }),
      makeNode(pv2, 'sldPvString', cx + 60, 880, {
        label: 'PV2', elementId: 'sld_pv_string', designation: 'E',
        parameters: { panelCount: 12, voc: 40, isc: 11, mpp: 380 },
      }),
      makeNode(gnd, 'sldGround', cx + 220, 320, {
        label: '', elementId: 'sld_ground', designation: '',
        parameters: { re: 10 },
      }),
    ];

    const ac = (source: string, target: string, cores: number, cross: number, circuit?: string, len?: number) =>
      makeCable(source, target, { cableType: 'YKY', cores, crossSection: cross, circuitId: circuit, length: len, current: 'AC' });

    const dc = (source: string, target: string, len?: number) =>
      makeCable(source, target, { cableType: 'H1Z2Z2-K', cores: 1, crossSection: 6, length: len, current: 'DC' });

    const edges = [
      ac(grid, zk, 5, 10, 'W0', 5),
      ac(zk, meterOsd, 5, 10),
      ac(meterOsd, pwp, 5, 10),
      ac(pwp, q1, 5, 10),
      ac(q1, f1, 5, 6, 'W1', 5),
      ac(f1, rcd, 5, 6),
      ac(q1, meterPv, 5, 6, 'W-PV', 8),
      ac(meterPv, fpv, 5, 6),
      ac(fpv, invH, 5, 6),
      makeCable(invH, bat, { cableType: 'YDY', cores: 2, crossSection: 25, current: 'DC' }, 'out', 'in'),
      dc(invH, qsdc, 0.5),
      dc(qsdc, fgpv1, 0.5),
      dc(qsdc, fgpv2, 0.5),
      dc(fgpv1, pv1, 12),
      dc(fgpv2, pv2, 12),
    ];

    return { nodes, edges };
  },
};
```

- [ ] **Step 2: `src/templates/sld/index.ts`** — barrel + lista templatów

```typescript
import { onGrid1PhaseSld } from './onGrid1Phase.ts';
import { onGrid3PhaseSld } from './onGrid3Phase.ts';
import { hybridSld } from './hybrid.ts';
import type { SldTemplate } from './types.ts';

export const SLD_TEMPLATES: SldTemplate[] = [
  onGrid1PhaseSld,
  onGrid3PhaseSld,
  hybridSld,
];

export type { SldTemplate };
```

- [ ] **Step 3: Build + commit**

```bash
npm run build
git add src/templates/sld/hybrid.ts src/templates/sld/index.ts
git commit -m "feat(sld): template hybridSld + barrel SLD_TEMPLATES"
```

---

## Task 21: TemplateDialog — sekcja szablonów SLD widoczna gdy `activeSheet === 'singleLine'`

**Files:**
- Modify: `src/components/toolbar/TemplateDialog.tsx`

- [ ] **Step 1: Importuj `SLD_TEMPLATES`**

Dopisz po imporcie `TEMPLATES`:
```typescript
import { SLD_TEMPLATES } from '../../templates/sld/index.ts';
```

- [ ] **Step 2: Rozróżnij wczytanie zależnie od `activeSheet`**

Zastąp komponent:

```tsx
export function TemplateDialog({ open, onClose }: TemplateDialogProps) {
  if (!open) return null;

  const activeSheet = useProjectStore((s) => s.activeSheet);
  const isSld = activeSheet === 'singleLine';
  const templates = isSld ? SLD_TEMPLATES : TEMPLATES;

  const applyTemplate = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    if (!template) return;

    const { nodes, edges } = template.generate();
    const store = useProjectStore.getState();
    if (isSld) {
      store.pushSingleLineHistory();
      store.setSingleLineNodes(nodes);
      store.setSingleLineEdges(edges);
    } else {
      store.pushHistory();
      store.setNodes(nodes);
      store.setEdges(edges);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-[480px] max-h-[80vh] overflow-y-auto border border-gray-200">
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          {isSld ? 'Szablony jednokreskowe' : 'Wybierz szablon'}
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Szablon zastąpi aktualny arkusz. Użyj Ctrl+Z aby cofnąć.
        </p>

        <div className="space-y-3">
          {templates.map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => applyTemplate(tpl.id)}
              className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
            >
              <div className="font-medium text-gray-800">{tpl.name}</div>
              <div className="text-xs text-gray-500 mt-1">{tpl.description}</div>
            </button>
          ))}
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded"
          >
            Anuluj
          </button>
        </div>
      </div>
    </div>
  );
}
```

(Uwaga: `useProjectStore` musi być importowane — sprawdź czy import istnieje na początku pliku.)

- [ ] **Step 2: Build + lint + dev**

Run: `npm run build && npm run lint`
Expected: zielone.

Run: `npm run dev`, przełącz na "Jednokreskowy", kliknij "Szablony" — dialog powinien pokazać 3 templates SLD.

- [ ] **Step 3: Commit**

```bash
git add src/components/toolbar/TemplateDialog.tsx
git commit -m "feat(sld): TemplateDialog — sekcja szablonow SLD per activeSheet"
```

---

## Task 22: CLAUDE.md — sekcja SLD + deprecate `singleLineMcb`

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: Dopisz nową sekcję na końcu pliku** (po sekcji „Plan etapów"):

```markdown
## Schemat jednokreskowy (SLD)

Trzeci niezależny arkusz (`activeSheet === 'singleLine'`) — schemat ideowy zgodny z PN-EN 61082-1, do dokumentacji OSD przy zgłoszeniu mikroinstalacji PV.

### Architektura
- Stan w `projectStore`: `singleLineNodes` / `singleLineEdges` / `singleLinePast` / `singleLineFuture`.
- Canvas: `src/components/canvas/SingleLineCanvas.tsx`.
- Symbole: `src/nodes/sld/Sld*Node.tsx` (18 elementów, prefix nodeType `sld*`).
- Edge: `src/edges/SingleLineCableEdge.tsx` — pojedyncza linia + pęczek ukośnych kresek (`cores` sztuk) + etykieta `YDY 5×6 mm² | W1 | L=12 m`.
- Sidebar: definicje w `src/constants/singleLineElements.ts`.
- Templates: `src/templates/sld/` (`onGrid1Phase`, `onGrid3Phase`, `hybrid`).
- Routing: wyłącznie manual (waypoints przez dwuklik), brak auto-routingu.

### Edge data model (`singleLineCable`)
```typescript
{
  cableType: 'YDY' | 'YKY' | 'YKXS' | 'NYM' | 'H1Z2Z2-K' | 'LgY' | string;
  cores: number;            // 1..7 — źródło prawdy dla kresek
  crossSection: number;     // mm² (główne żyły)
  peCrossSection?: number;  // mm² (gdy PE chudszy, np. 3×2,5+1,5)
  circuitId?: string;       // 'W1', 'O.1'
  length?: number;          // m
  current?: 'AC' | 'DC';
}
```

### Lista symboli (kategoria → nodeType)
- **sldAcSource:** sldGridSource, sldCableJunction, sldMeter, sldCt
- **sldAcProtection:** sldMainSwitch, sldFireSwitch, sldMcb, sldRcd, sldRcbo, sldSpdAc
- **sldDc:** sldPvString, sldDcDisconnect, sldFuseGpv, sldSpdDc
- **sldInverter:** sldInverter, sldBattery
- **sldGrounding:** sldGround, sldOsdBoundary

### Deprecated
- `singleLineMcb` (zarejestrowany w wielokreskowym sheecie jako orphan) — **nie używać**. Pozostawiony wyłącznie dla wstecznej kompatybilności starych JSON-ów. Nowe rysunki: używaj `sldMcb` w arkuszu „Jednokreskowy".
```

- [ ] **Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "docs(sld): sekcja CLAUDE.md o SLD + deprecate singleLineMcb"
```

---

## Task 23: Weryfikacja końcowa (manualna)

**Files:** żadne — tylko sprawdzenia.

- [ ] **Step 1: Czysty build i lint**

Run: `npm run build && npm run lint`
Expected: oba zielone.

- [ ] **Step 2: Test dev w przeglądarce — szablon 3-faz**

```bash
npm run dev
```

Otwórz http://localhost:5173/, w toolbarze przełącz na **„Jednokreskowy"**, kliknij **„Szablony"** → wybierz **„SLD — PV 3-faz. ON-grid"**.

Sprawdź wzrokowo:
- Wszystkie 19 elementów renderuje się bez nakładania.
- Edge'e między aparatami mają **ukośne kreski** (5 między aparatami AC, 1 między DC).
- Etykieta przy każdym edge'u: `YKY 5×6 mm²` dla AC, `H1Z2Z2-K 1×6 mm²` dla DC.
- Granica OSD = przerywana czerwona linia z napisem.

- [ ] **Step 3: Test zaznaczenia edge'a + edycja**

Kliknij na dowolny edge — w prawym panelu pojawia się formularz z polami `cableType / cores / crossSection / peCrossSection / circuitId / length / current`. Zmień `cores` z 5 na 3 — liczba kresek na linii spada do 3, etykieta zmienia się na `YKY 3×6 mm²`.

- [ ] **Step 4: Test round-trip JSON**

W toolbarze: kliknij **„JSON"** (eksport) — zapisz plik. Wciśnij **Ctrl+Z** kilka razy żeby cofnąć zmiany. Kliknij **„Wczytaj"** i wybierz zapisany plik. Sprawdź że rysunek wraca do stanu z momentu eksportu (nodes, edges, parametry, etykieta `YKY 3×6 mm²`).

- [ ] **Step 5: Test backward-compat starych projektów**

Przełącz na **„Wielokreskowy"**, wczytaj szablon `Instalacja 3-faz. ON-grid` (stary). Eksportuj JSON. Otwórz w edytorze tekstu i usuń pola `singleLineNodes`, `singleLineEdges`, `singleLineFormat` (symulacja starego pliku bez SLD). Zapisz, wczytaj w aplikacji → powinno się otworzyć bez błędów, pusty SLD.

- [ ] **Step 6: Test eksportu PDF z SLD**

W trybie SLD (z wczytanym szablonem 3-faz): toolbar → **„PDF"** → otwórz wynikowy plik. Schemat jednokreskowy renderowany w ramce A4 z tabliczką, z kreskami na liniach i etykietami kabli.

- [ ] **Step 7: Test niezależności sheetów**

Wczytaj szablon `onGrid3PhaseSld` w SLD. Przełącz na „Wielokreskowy" — powinien być pusty (lub mieć wcześniej istniejący rysunek). Wróć na „Jednokreskowy" — schemat 3-faz nadal tam jest. Wciśnij **Ctrl+Z** — cofnęło ostatnią zmianę W SLD, nie w wielokreskowym.

- [ ] **Step 8: Commit final (jeśli wymagane fixy z weryfikacji)**

Jeśli któryś krok 1–7 wykazał regresję — fixy w osobnych tasach. Jeśli wszystko zielone — nic do commitu.

---

## Self-review checklist (po napisaniu planu — wykonaj na koniec planowania)

- ✓ Każda sekcja specu (§1–§12) ma odpowiadające zadanie:
  - §1 (definicja) — pokryte w CLAUDE.md (Task 22)
  - §2 decyzje — wszystkie 7 odzwierciedlone w kodzie (Task 1–17)
  - §3 architektura — Task 1 (types) + Task 2 (store) + Task 14 (App)
  - §4 biblioteka 18 symboli — Task 5–11
  - §5 edge model + renderer — Task 1 (types) + Task 3 (renderer) + Task 4 (rejestracja)
  - §6 Sidebar/Toolbar/Canvas — Task 13 (canvas) + Task 15 (toolbar) + Task 16 (sidebar)
  - §7 templates 3× — Task 18, 19, 20
  - §8 eksport PDF — reuse istniejącego, weryfikowane w Task 23 Step 6
  - §9 pominięte w MVP — nie kodujemy, ok
  - §10 lista plików — pokryta po wszystkich taskach
  - §11 weryfikacja — Task 23
- ✓ Brak placeholderów `TBD/TODO/implement later` — wszystkie funkcje, SVG, typy podane w pełnej formie.
- ✓ Spójność typów: `SingleLineCableData` (Task 1) używana w `SingleLineCableEdge` (Task 3), helperze `SldCableData` w templates (Task 18), formularzu PropertiesPanel (Task 17). Wszystkie pola jednakowe: `cableType / cores / crossSection / peCrossSection / circuitId / length / current`.
- ✓ Spójność nodeType: prefix `sld*`, identyczny w komponentach (Task 5–10), rejestracji (Task 11), definicjach sidebar (Task 12).
- ✓ Hash marks z `cores` — jedno źródło prawdy, render w Task 3, edycja w Task 17.

Brak luk do uzupełnienia.
