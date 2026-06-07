# Biblioteka projektów + Google Drive — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add multi-project management with a swappable storage layer (localStorage + Google Drive shared folder) and Google sign-in, so authorized people can open/edit shared schematics while the app still works fully offline.

**Architecture:** A `ProjectStorage` interface with two implementations (`LocalProjectStorage`, `DriveProjectStorage`). The Zustand store gains library actions (new/open/save/rename/delete/duplicate) and serializes the whole working state into a `ProjectData` payload. A `ProjectsModal` drives the UI. Google sign-in uses Google Identity Services (token model, no backend, no client secret). Pure logic (local storage, migration, conflict detection, Drive response parsing) is unit-tested with Vitest; auth/UI are verified by build + manual steps.

**Tech Stack:** React 19, TypeScript, Vite 8, Zustand, Google Identity Services + Google Drive REST API v3, Vitest + jsdom.

**Spec:** `docs/superpowers/specs/2026-06-07-project-management-drive-design.md`

---

## File Structure

- Create `src/types/project.ts` — `ProjectData`, `ProjectFile`, `ProjectMeta`, `SaveResult`, `ProjectStorage`.
- Create `src/config/google.ts` — `GOOGLE_CLIENT_ID`, `DRIVE_FOLDER_ID`, `DRIVE_SCOPE`.
- Create `src/services/localProjectStorage.ts` — `LocalProjectStorage`.
- Create `src/services/migration.ts` — one-time migration of the legacy single-project key.
- Create `src/services/googleAuth.ts` — GIS loader, sign in/out, token, email.
- Create `src/services/driveProjectStorage.ts` — `DriveProjectStorage` (Drive REST in one folder).
- Modify `src/store/projectStore.ts` — `getProjectData`/`applyProjectData`, library state + actions, autosave rework.
- Create `src/components/projects/ProjectsModal.tsx` — library UI.
- Modify `src/components/toolbar/Toolbar.tsx` — "Projekty" button + sign-in status.
- Modify `src/App.tsx` — run migration once on startup.
- Create `vitest.config.ts`, modify `package.json` — test harness.
- Tests: `src/services/localProjectStorage.test.ts`, `src/services/migration.test.ts`, `src/services/driveProjectStorage.test.ts`.

---

## Task 1: Test harness (Vitest + jsdom)

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`
- Create: `src/services/smoke.test.ts` (temporary)

- [ ] **Step 1: Install dev deps**

Run:
```bash
npm i -D vitest@^3 jsdom@^25
```
Expected: installs without errors.

- [ ] **Step 2: Add test scripts to package.json**

In `package.json` `"scripts"`, add:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 3: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
  },
})
```

- [ ] **Step 4: Add a temporary smoke test**

`src/services/smoke.test.ts`:
```ts
import { describe, it, expect } from 'vitest'

describe('harness', () => {
  it('has localStorage from jsdom', () => {
    localStorage.setItem('x', '1')
    expect(localStorage.getItem('x')).toBe('1')
  })
})
```

- [ ] **Step 5: Run and verify pass**

Run: `npm test`
Expected: 1 passed.

- [ ] **Step 6: Delete the smoke test and commit**

```bash
rm src/services/smoke.test.ts
git add package.json package-lock.json vitest.config.ts
git commit -m "test: add Vitest + jsdom harness"
```

---

## Task 2: Shared types

**Files:**
- Create: `src/types/project.ts`

- [ ] **Step 1: Write the types**

`src/types/project.ts`:
```ts
import type { Node, Edge } from '@xyflow/react';
import type { ProjectInfo, SheetFormat, SchematicNodeData } from './index.ts';

// Payload = dokladnie to, co dzis serializuje saveProject().
export interface ProjectData {
  projectName: string;
  projectInfo: ProjectInfo;
  schematicFormat: SheetFormat;
  layoutFormat: SheetFormat;
  nodes: Node<SchematicNodeData>[];
  edges: Edge[];
  layoutNodes: Node[];
  layoutEdges: Edge[];
  singleLineNodes: Node<SchematicNodeData>[];
  singleLineEdges: Edge[];
  singleLineFormat: SheetFormat;
  labelCounters: Record<string, number>;
}

export interface ProjectFile {
  schemaVersion: 1;
  id: string;
  name: string;
  updatedAt: string; // ISO
  data: ProjectData;
}

export interface ProjectMeta {
  id: string;
  name: string;
  updatedAt: string;
}

export interface SaveResult {
  updatedAt: string;
  conflict?: boolean;
}

export interface ProjectStorage {
  list(): Promise<ProjectMeta[]>;
  load(id: string): Promise<ProjectFile>;
  create(name: string, data: ProjectData): Promise<ProjectMeta>;
  save(id: string, name: string, data: ProjectData, knownUpdatedAt?: string): Promise<SaveResult>;
  rename(id: string, name: string): Promise<void>;
  remove(id: string): Promise<void>;
  duplicate(id: string, newName: string): Promise<ProjectMeta>;
}
```

> Note: verify `ProjectInfo`, `SheetFormat`, `SchematicNodeData` are exported from `src/types/index.ts`. They are (used across the codebase). If `SheetFormat` import path differs, adjust.

- [ ] **Step 2: Type-check**

Run: `npx tsc -b`
Expected: EXIT 0 (no unused-import error because the file is referenced next task; if tsc complains about unused, that's fine until imported — run after Task 3 if needed).

- [ ] **Step 3: Commit**

```bash
git add src/types/project.ts
git commit -m "feat(types): project library types"
```

---

## Task 3: Config module

**Files:**
- Create: `src/config/google.ts`

- [ ] **Step 1: Write config**

`src/config/google.ts`:
```ts
// Wartosci publiczne (nie sekrety) — bezpieczne w repo i w przegladarce.
export const GOOGLE_CLIENT_ID =
  '1024580768546-8u00tv82f5oed9rvrliodt6u42s0s730.apps.googleusercontent.com';
export const DRIVE_FOLDER_ID = '1175WlBUyA24EQUCBMeT492l5Fr74lSiB';
export const DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive';
```

- [ ] **Step 2: Commit**

```bash
git add src/config/google.ts
git commit -m "feat(config): google client id + drive folder id"
```

---

## Task 4: LocalProjectStorage (TDD)

**Files:**
- Create: `src/services/localProjectStorage.ts`
- Test: `src/services/localProjectStorage.test.ts`

- [ ] **Step 1: Write failing tests**

`src/services/localProjectStorage.test.ts`:
```ts
import { describe, it, expect, beforeEach } from 'vitest'
import { LocalProjectStorage, LOCAL_PROJECTS_KEY } from './localProjectStorage.ts'
import type { ProjectData } from '../types/project.ts'

const emptyData = (): ProjectData => ({
  projectName: 'Test', projectInfo: {} as ProjectData['projectInfo'],
  schematicFormat: 'A4', layoutFormat: 'A4', singleLineFormat: 'A4',
  nodes: [], edges: [], layoutNodes: [], layoutEdges: [],
  singleLineNodes: [], singleLineEdges: [], labelCounters: {},
})

describe('LocalProjectStorage', () => {
  beforeEach(() => localStorage.clear())

  it('create + list returns the new project', async () => {
    const s = new LocalProjectStorage()
    const meta = await s.create('Projekt A', emptyData())
    expect(meta.id).toBeTruthy()
    const list = await s.list()
    expect(list).toHaveLength(1)
    expect(list[0].name).toBe('Projekt A')
  })

  it('save updates updatedAt and load returns data', async () => {
    const s = new LocalProjectStorage()
    const { id } = await s.create('A', emptyData())
    const r = await s.save(id, 'A2', { ...emptyData(), projectName: 'A2' })
    expect(r.conflict).toBeFalsy()
    const file = await s.load(id)
    expect(file.name).toBe('A2')
    expect(file.data.projectName).toBe('A2')
    expect(file.updatedAt).toBe(r.updatedAt)
  })

  it('save reports conflict when knownUpdatedAt is stale', async () => {
    const s = new LocalProjectStorage()
    const { id } = await s.create('A', emptyData())
    const first = await s.load(id)
    await s.save(id, 'A', emptyData()) // bumps updatedAt
    const r = await s.save(id, 'A', emptyData(), first.updatedAt)
    expect(r.conflict).toBe(true)
  })

  it('rename, duplicate, remove', async () => {
    const s = new LocalProjectStorage()
    const { id } = await s.create('A', emptyData())
    await s.rename(id, 'B')
    expect((await s.load(id)).name).toBe('B')
    const dup = await s.duplicate(id, 'B kopia')
    expect(dup.id).not.toBe(id)
    expect((await s.list())).toHaveLength(2)
    await s.remove(id)
    const list = await s.list()
    expect(list).toHaveLength(1)
    expect(list[0].name).toBe('B kopia')
  })

  it('list sorted by updatedAt desc', async () => {
    const s = new LocalProjectStorage()
    const a = await s.create('A', emptyData())
    const b = await s.create('B', emptyData())
    await s.save(a.id, 'A', emptyData()) // A now newest
    const list = await s.list()
    expect(list[0].id).toBe(a.id)
    expect(list[1].id).toBe(b.id)
  })

  it('uses LOCAL_PROJECTS_KEY', () => {
    expect(LOCAL_PROJECTS_KEY).toBe('schemat:projects')
  })
})
```

- [ ] **Step 2: Run, verify fail**

Run: `npm test -- localProjectStorage`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement**

`src/services/localProjectStorage.ts`:
```ts
import type { ProjectStorage, ProjectFile, ProjectMeta, ProjectData, SaveResult } from '../types/project.ts'

export const LOCAL_PROJECTS_KEY = 'schemat:projects'

type Store = Record<string, ProjectFile>

function read(): Store {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_PROJECTS_KEY) ?? '{}') as Store
  } catch {
    return {}
  }
}

function write(store: Store): void {
  localStorage.setItem(LOCAL_PROJECTS_KEY, JSON.stringify(store))
}

function meta(f: ProjectFile): ProjectMeta {
  return { id: f.id, name: f.name, updatedAt: f.updatedAt }
}

export class LocalProjectStorage implements ProjectStorage {
  async list(): Promise<ProjectMeta[]> {
    return Object.values(read())
      .map(meta)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  }

  async load(id: string): Promise<ProjectFile> {
    const f = read()[id]
    if (!f) throw new Error(`Projekt ${id} nie istnieje`)
    return f
  }

  async create(name: string, data: ProjectData): Promise<ProjectMeta> {
    const store = read()
    const file: ProjectFile = {
      schemaVersion: 1, id: crypto.randomUUID(), name,
      updatedAt: new Date().toISOString(), data,
    }
    store[file.id] = file
    write(store)
    return meta(file)
  }

  async save(id: string, name: string, data: ProjectData, knownUpdatedAt?: string): Promise<SaveResult> {
    const store = read()
    const existing = store[id]
    if (existing && knownUpdatedAt && existing.updatedAt > knownUpdatedAt) {
      return { updatedAt: existing.updatedAt, conflict: true }
    }
    const updatedAt = new Date().toISOString()
    store[id] = { schemaVersion: 1, id, name, updatedAt, data }
    write(store)
    return { updatedAt }
  }

  async rename(id: string, name: string): Promise<void> {
    const store = read()
    if (!store[id]) throw new Error(`Projekt ${id} nie istnieje`)
    store[id] = { ...store[id], name, updatedAt: new Date().toISOString() }
    write(store)
  }

  async remove(id: string): Promise<void> {
    const store = read()
    delete store[id]
    write(store)
  }

  async duplicate(id: string, newName: string): Promise<ProjectMeta> {
    const src = await this.load(id)
    return this.create(newName, src.data)
  }
}
```

- [ ] **Step 4: Run, verify pass**

Run: `npm test -- localProjectStorage`
Expected: all passed.

> Note: the stale-conflict test relies on `updatedAt` strictly increasing. ISO strings from successive `new Date()` calls in the same ms could be equal. If the conflict test flakes, the implementation is still correct (`>` comparison); the test creates a guaranteed gap because `first.updatedAt` is read before the second save which always produces a `>=` value — if equal, no conflict is the correct behavior. To make the test deterministic, the second save in step 1's test happens after load; accept either by asserting `r.conflict === true` only when timestamps differ. Keep the `>` logic.

- [ ] **Step 5: Commit**

```bash
git add src/services/localProjectStorage.ts src/services/localProjectStorage.test.ts
git commit -m "feat(storage): LocalProjectStorage with conflict detection"
```

---

## Task 5: Store — getProjectData / applyProjectData

**Files:**
- Modify: `src/store/projectStore.ts`

- [ ] **Step 1: Add to the store interface**

Find the store type (the interface with `saveProject`, `loadProject`). Add:
```ts
  getProjectData: () => ProjectData;
  applyProjectData: (data: ProjectData) => void;
```
Add import at top of file:
```ts
import type { ProjectData } from '../types/project.ts';
```

- [ ] **Step 2: Implement `getProjectData`**

Add inside the store creator (near `saveProject`):
```ts
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
```

- [ ] **Step 3: Implement `applyProjectData`** (mirror of `loadProject` body but from object)

```ts
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
```

- [ ] **Step 4: Refactor `loadProject` to reuse**

Replace `loadProject` body with:
```ts
  loadProject: (json) => {
    try {
      get().applyProjectData(JSON.parse(json) as ProjectData);
    } catch {
      console.error('Blad wczytywania projektu');
    }
  },
```

- [ ] **Step 5: Type-check**

Run: `npx tsc -b`
Expected: EXIT 0.

- [ ] **Step 6: Commit**

```bash
git add src/store/projectStore.ts src/types/project.ts
git commit -m "refactor(store): getProjectData/applyProjectData"
```

---

## Task 6: Migration of legacy single-project key (TDD)

**Files:**
- Create: `src/services/migration.ts`
- Test: `src/services/migration.test.ts`

> The legacy key is the existing `STORAGE_KEY` in `projectStore.ts`. Open that file and read its value (e.g. `const STORAGE_KEY = 'schemat-elektryczny:project'`). Use that exact string below as `LEGACY_KEY`.

- [ ] **Step 1: Write failing tests**

`src/services/migration.test.ts`:
```ts
import { describe, it, expect, beforeEach } from 'vitest'
import { migrateLegacyProject, LEGACY_KEY } from './migration.ts'
import { LocalProjectStorage, LOCAL_PROJECTS_KEY } from './localProjectStorage.ts'

describe('migrateLegacyProject', () => {
  beforeEach(() => localStorage.clear())

  it('imports legacy project as first library entry', async () => {
    localStorage.setItem(LEGACY_KEY, JSON.stringify({ projectName: 'Stary', nodes: [], edges: [] }))
    const created = await migrateLegacyProject(new LocalProjectStorage())
    expect(created?.name).toBe('Stary')
    const list = await new LocalProjectStorage().list()
    expect(list).toHaveLength(1)
  })

  it('does nothing when library already exists', async () => {
    localStorage.setItem(LOCAL_PROJECTS_KEY, JSON.stringify({ x: { id: 'x', name: 'X', updatedAt: '2020', schemaVersion: 1, data: {} } }))
    localStorage.setItem(LEGACY_KEY, JSON.stringify({ projectName: 'Stary' }))
    const created = await migrateLegacyProject(new LocalProjectStorage())
    expect(created).toBeNull()
  })

  it('does nothing when no legacy key', async () => {
    const created = await migrateLegacyProject(new LocalProjectStorage())
    expect(created).toBeNull()
  })
})
```

- [ ] **Step 2: Run, verify fail**

Run: `npm test -- migration`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement**

`src/services/migration.ts`:
```ts
import { LocalProjectStorage, LOCAL_PROJECTS_KEY } from './localProjectStorage.ts'
import type { ProjectData, ProjectMeta } from '../types/project.ts'

// Musi byc identyczne ze STORAGE_KEY w projectStore.ts:
export const LEGACY_KEY = 'schemat-elektryczny:project'

export async function migrateLegacyProject(storage: LocalProjectStorage): Promise<ProjectMeta | null> {
  if (localStorage.getItem(LOCAL_PROJECTS_KEY)) return null // biblioteka juz istnieje
  const raw = localStorage.getItem(LEGACY_KEY)
  if (!raw) return null
  let data: ProjectData
  try {
    data = JSON.parse(raw) as ProjectData
  } catch {
    return null
  }
  const name = data.projectName || 'Projekt 1'
  return storage.create(name, data)
}
```

> If the real `STORAGE_KEY` differs from `'schemat-elektryczny:project'`, set `LEGACY_KEY` to the real value and update the test accordingly.

- [ ] **Step 4: Run, verify pass**

Run: `npm test -- migration`
Expected: all passed.

- [ ] **Step 5: Commit**

```bash
git add src/services/migration.ts src/services/migration.test.ts
git commit -m "feat(storage): migrate legacy single-project key"
```

---

## Task 7: Store — library state & actions

**Files:**
- Modify: `src/store/projectStore.ts`

- [ ] **Step 1: Add library state + types to the store interface**

Add imports:
```ts
import type { ProjectMeta, ProjectStorage } from '../types/project.ts';
import { LocalProjectStorage } from '../services/localProjectStorage.ts';
```
Add to the store interface:
```ts
  currentProjectId: string | null;
  currentProjectUpdatedAt: string | null;
  storageMode: 'local' | 'drive';
  setStorageMode: (m: 'local' | 'drive') => void;
  getActiveStorage: () => ProjectStorage;
  newProject: (name: string) => Promise<void>;
  openProject: (id: string) => Promise<void>;
  saveCurrent: () => Promise<{ conflict?: boolean }>;
  saveAsProject: (name: string) => Promise<void>;
```

- [ ] **Step 2: Add a module-level drive storage holder (set later by Task 11)**

Near the top of the file (module scope), add:
```ts
// Ustawiane przez warstwe Drive po zalogowaniu; null = brak.
let driveStorageRef: ProjectStorage | null = null;
export function setDriveStorage(s: ProjectStorage | null) { driveStorageRef = s; }
const localStorageBackend = new LocalProjectStorage();
```

- [ ] **Step 3: Implement state defaults + actions**

Add initial state values:
```ts
  currentProjectId: null,
  currentProjectUpdatedAt: null,
  storageMode: 'local',
```
Add actions inside the store creator:
```ts
  setStorageMode: (m) => set({ storageMode: m }),

  getActiveStorage: () => (get().storageMode === 'drive' && driveStorageRef)
    ? driveStorageRef
    : localStorageBackend,

  newProject: async (name) => {
    get().applyProjectData({
      projectName: name, projectInfo: get().projectInfo,
      schematicFormat: 'A4', layoutFormat: 'A4', singleLineFormat: 'A4',
      nodes: [], edges: [], layoutNodes: [], layoutEdges: [],
      singleLineNodes: [], singleLineEdges: [], labelCounters: {},
    });
    const meta = await get().getActiveStorage().create(name, get().getProjectData());
    set({ currentProjectId: meta.id, currentProjectUpdatedAt: meta.updatedAt, projectName: name });
  },

  openProject: async (id) => {
    const file = await get().getActiveStorage().load(id);
    get().applyProjectData(file.data);
    set({ currentProjectId: file.id, currentProjectUpdatedAt: file.updatedAt });
  },

  saveCurrent: async () => {
    const { currentProjectId, currentProjectUpdatedAt } = get();
    if (!currentProjectId) return {};
    const res = await get().getActiveStorage().save(
      currentProjectId, get().projectName, get().getProjectData(),
      currentProjectUpdatedAt ?? undefined,
    );
    if (res.conflict) return { conflict: true };
    set({ currentProjectUpdatedAt: res.updatedAt, isDirty: false });
    return {};
  },

  saveAsProject: async (name) => {
    const meta = await get().getActiveStorage().create(name, { ...get().getProjectData(), projectName: name });
    set({ currentProjectId: meta.id, currentProjectUpdatedAt: meta.updatedAt, projectName: name, isDirty: false });
  },
```

- [ ] **Step 4: Rework autosave to save the current project**

Find `startAutosave()`. Replace its interval body so that when a current project exists it saves through the active storage; otherwise it keeps the legacy localStorage draft. Replace the `if (state.isDirty) { state.saveProject(); }` block with:
```ts
    if (!state.isDirty) return;
    if (state.currentProjectId) {
      state.saveCurrent().catch((e) => console.error('Autozapis nieudany', e));
    } else {
      state.saveProject(); // legacy draft (offline buffer) gdy brak projektu
    }
```

- [ ] **Step 5: Type-check**

Run: `npx tsc -b`
Expected: EXIT 0.

- [ ] **Step 6: Commit**

```bash
git add src/store/projectStore.ts
git commit -m "feat(store): project library actions + autosave rework"
```

---

## Task 8: Run migration on startup

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Read current App.tsx**

Open `src/App.tsx`, find where `startAutosave()` is called (or the top-level effect).

- [ ] **Step 2: Add migration effect**

Add imports:
```ts
import { migrateLegacyProject } from './services/migration.ts';
import { LocalProjectStorage } from './services/localProjectStorage.ts';
import { useProjectStore } from './store/projectStore.ts';
```
In the App component, add an effect that runs once:
```ts
useEffect(() => {
  migrateLegacyProject(new LocalProjectStorage())
    .then((meta) => { if (meta) useProjectStore.getState().openProject(meta.id); })
    .catch((e) => console.error('Migracja nieudana', e));
}, []);
```
> If `useEffect` / `useProjectStore` are already imported, do not duplicate imports.

- [ ] **Step 3: Type-check + build**

Run: `npx tsc -b && npm run build`
Expected: EXIT 0.

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx
git commit -m "feat(app): migrate legacy project on startup"
```

---

## Task 9: ProjectsModal (local mode UI)

**Files:**
- Create: `src/components/projects/ProjectsModal.tsx`

- [ ] **Step 1: Implement the modal**

`src/components/projects/ProjectsModal.tsx`:
```tsx
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
```

- [ ] **Step 2: Type-check**

Run: `npx tsc -b`
Expected: EXIT 0.

- [ ] **Step 3: Commit**

```bash
git add src/components/projects/ProjectsModal.tsx
git commit -m "feat(ui): ProjectsModal (library)"
```

---

## Task 10: Toolbar — "Projekty" button (local end-to-end)

**Files:**
- Modify: `src/components/toolbar/Toolbar.tsx`

- [ ] **Step 1: Wire the modal into the toolbar**

In `Toolbar.tsx` add:
```tsx
import { useState } from 'react';
import { ProjectsModal } from '../projects/ProjectsModal.tsx';
```
Add local state in the component:
```tsx
const [projectsOpen, setProjectsOpen] = useState(false);
```
Add a button near the existing save/export buttons:
```tsx
<button onClick={() => setProjectsOpen(true)}
  className="px-2 py-1 text-xs bg-gray-100 rounded border border-gray-300 hover:bg-gray-200">
  Projekty
</button>
```
And render the modal once in the returned JSX (before the closing fragment/root element):
```tsx
<ProjectsModal open={projectsOpen} onClose={() => setProjectsOpen(false)} />
```
> If `useState` is already imported, don't duplicate.

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: EXIT 0.

- [ ] **Step 3: Manual verification (local mode)**

Run: `npm run dev`, open http://localhost:5173.
- Click "Projekty" → modal opens in "Lokalne".
- "+ Nowy projekt" → name it → modal closes, you're on a blank project.
- Draw something, wait ~3 s (autosave), reopen "Projekty" → project listed with recent time.
- Open another, rename, duplicate, delete — all work.
Expected: all operations succeed; refresh page → projects persist.

- [ ] **Step 4: Commit**

```bash
git add src/components/toolbar/Toolbar.tsx
git commit -m "feat(ui): Projekty button in toolbar (local library works end-to-end)"
```

---

## Task 11: Google auth (GIS)

**Files:**
- Create: `src/services/googleAuth.ts`

- [ ] **Step 1: Implement the auth module**

`src/services/googleAuth.ts`:
```ts
import { GOOGLE_CLIENT_ID, DRIVE_SCOPE } from '../config/google.ts'

// Minimalne typy GIS (token model)
interface TokenResponse { access_token: string; expires_in: number; error?: string }
interface TokenClient { requestAccessToken: (opts?: { prompt?: string }) => void }
declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (cfg: {
            client_id: string; scope: string;
            callback: (r: TokenResponse) => void;
          }) => TokenClient;
        };
      };
    };
  }
}

let accessToken: string | null = null
let tokenExpiry = 0
let userEmail: string | null = null
let tokenClient: TokenClient | null = null
const listeners = new Set<() => void>()

export function onAuthChange(fn: () => void): () => void {
  listeners.add(fn); return () => listeners.delete(fn)
}
function emit() { listeners.forEach((f) => f()) }

export function isSignedIn(): boolean { return !!accessToken && Date.now() < tokenExpiry }
export function getEmail(): string | null { return userEmail }
export function getAccessToken(): string | null { return isSignedIn() ? accessToken : null }

function loadGis(): Promise<void> {
  if (window.google?.accounts?.oauth2) return Promise.resolve()
  return new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = 'https://accounts.google.com/gsi/client'
    s.async = true; s.defer = true
    s.onload = () => resolve()
    s.onerror = () => reject(new Error('Nie udało się załadować Google Identity Services'))
    document.head.appendChild(s)
  })
}

async function fetchEmail(token: string): Promise<void> {
  try {
    const r = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (r.ok) { const j = await r.json(); userEmail = j.email ?? null }
  } catch { /* ignore */ }
}

export async function signIn(): Promise<void> {
  await loadGis()
  await new Promise<void>((resolve, reject) => {
    tokenClient = window.google!.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: DRIVE_SCOPE,
      callback: (r) => {
        if (r.error) { reject(new Error(r.error)); return }
        accessToken = r.access_token
        tokenExpiry = Date.now() + (r.expires_in - 60) * 1000
        fetchEmail(r.access_token).finally(() => { emit(); resolve() })
      },
    })
    tokenClient!.requestAccessToken({ prompt: 'consent' })
  })
}

export async function ensureToken(): Promise<string> {
  if (isSignedIn()) return accessToken!
  // ciche odswiezenie bez ekranu zgody
  await loadGis()
  return new Promise<string>((resolve, reject) => {
    tokenClient = window.google!.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID, scope: DRIVE_SCOPE,
      callback: (r) => {
        if (r.error || !r.access_token) { reject(new Error('Wymagane ponowne logowanie')); return }
        accessToken = r.access_token
        tokenExpiry = Date.now() + (r.expires_in - 60) * 1000
        emit(); resolve(r.access_token)
      },
    })
    tokenClient!.requestAccessToken({ prompt: '' })
  })
}

export function signOut(): void {
  accessToken = null; tokenExpiry = 0; userEmail = null; emit()
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc -b`
Expected: EXIT 0.

- [ ] **Step 3: Commit**

```bash
git add src/services/googleAuth.ts
git commit -m "feat(auth): Google Identity Services sign-in (token model)"
```

---

## Task 12: DriveProjectStorage (TDD on parsing/conflict, fetch mocked)

**Files:**
- Create: `src/services/driveProjectStorage.ts`
- Test: `src/services/driveProjectStorage.test.ts`

- [ ] **Step 1: Write failing tests (mock fetch + token)**

`src/services/driveProjectStorage.test.ts`:
```ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { DriveProjectStorage } from './driveProjectStorage.ts'
import type { ProjectData } from '../types/project.ts'

vi.mock('./googleAuth.ts', () => ({ ensureToken: vi.fn().mockResolvedValue('tok') }))

const data = {} as ProjectData

function mockFetchOnce(json: unknown, ok = true) {
  return vi.fn().mockResolvedValue({ ok, json: async () => json, text: async () => JSON.stringify(json) })
}

describe('DriveProjectStorage', () => {
  beforeEach(() => vi.restoreAllMocks())

  it('list parses files in folder into meta', async () => {
    globalThis.fetch = mockFetchOnce({ files: [
      { id: 'f1', appProperties: { projectId: 'p1' }, properties: undefined, name: 'A.schemat.json', modifiedTime: '2026-01-02T00:00:00Z' },
      { id: 'f2', appProperties: { projectId: 'p2' }, name: 'B.schemat.json', modifiedTime: '2026-01-01T00:00:00Z' },
    ] }) as unknown as typeof fetch
    const list = await new DriveProjectStorage().list()
    expect(list.map((m) => m.id)).toEqual(['p1', 'p2'])
    expect(list[0].name).toBe('A')
  })

  it('save returns conflict when remote modifiedTime is newer', async () => {
    // 1st call: lookup file by projectId -> returns file with newer modifiedTime
    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: true, json: async () => ({ files: [{ id: 'f1', modifiedTime: '2026-02-02T00:00:00Z' }] }),
    }) as unknown as typeof fetch
    const r = await new DriveProjectStorage().save('p1', 'A', data, '2026-01-01T00:00:00Z')
    expect(r.conflict).toBe(true)
  })
})
```

- [ ] **Step 2: Run, verify fail**

Run: `npm test -- driveProjectStorage`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement**

`src/services/driveProjectStorage.ts`:
```ts
import { ensureToken } from './googleAuth.ts'
import { DRIVE_FOLDER_ID } from '../config/google.ts'
import type { ProjectStorage, ProjectFile, ProjectMeta, ProjectData, SaveResult } from '../types/project.ts'

const API = 'https://www.googleapis.com/drive/v3'
const UPLOAD = 'https://www.googleapis.com/upload/drive/v3'

interface DriveFile { id: string; name: string; modifiedTime: string; appProperties?: Record<string, string> }

async function authHeaders(): Promise<HeadersInit> {
  const token = await ensureToken()
  return { Authorization: `Bearer ${token}` }
}

function nameFor(name: string): string { return `${name}.schemat.json` }
function baseName(fileName: string): string { return fileName.replace(/\.schemat\.json$/, '') }

export class DriveProjectStorage implements ProjectStorage {
  // Mapuje nasze projectId -> id pliku Drive (cache w pamieci sesji)
  private idCache = new Map<string, string>()

  private async findFileByProjectId(projectId: string): Promise<DriveFile | null> {
    const q = encodeURIComponent(`'${DRIVE_FOLDER_ID}' in parents and trashed=false and appProperties has { key='projectId' and value='${projectId}' }`)
    const r = await fetch(`${API}/files?q=${q}&fields=files(id,name,modifiedTime,appProperties)&spaces=drive`, { headers: await authHeaders() })
    if (!r.ok) throw new Error(`Drive list: ${r.status}`)
    const j = await r.json() as { files: DriveFile[] }
    const f = j.files?.[0] ?? null
    if (f) this.idCache.set(projectId, f.id)
    return f
  }

  async list(): Promise<ProjectMeta[]> {
    const q = encodeURIComponent(`'${DRIVE_FOLDER_ID}' in parents and trashed=false and name contains '.schemat.json'`)
    const r = await fetch(`${API}/files?q=${q}&fields=files(id,name,modifiedTime,appProperties)&orderBy=modifiedTime desc&spaces=drive`, { headers: await authHeaders() })
    if (!r.ok) throw new Error(`Drive list: ${r.status}`)
    const j = await r.json() as { files: DriveFile[] }
    return (j.files ?? []).map((f) => {
      const id = f.appProperties?.projectId ?? f.id
      this.idCache.set(id, f.id)
      return { id, name: baseName(f.name), updatedAt: f.modifiedTime }
    })
  }

  async load(id: string): Promise<ProjectFile> {
    const f = await this.findFileByProjectId(id)
    if (!f) throw new Error(`Projekt ${id} nie istnieje na Drive`)
    const r = await fetch(`${API}/files/${f.id}?alt=media`, { headers: await authHeaders() })
    if (!r.ok) throw new Error(`Drive get: ${r.status}`)
    const data = await r.json() as ProjectData
    return { schemaVersion: 1, id, name: baseName(f.name), updatedAt: f.modifiedTime, data }
  }

  async create(name: string, data: ProjectData): Promise<ProjectMeta> {
    const id = crypto.randomUUID()
    const metadata = { name: nameFor(name), parents: [DRIVE_FOLDER_ID], mimeType: 'application/json', appProperties: { projectId: id } }
    const body = this.multipart(metadata, data)
    const r = await fetch(`${UPLOAD}/files?uploadType=multipart&fields=id,modifiedTime`, {
      method: 'POST', headers: { ...(await authHeaders()), 'Content-Type': 'multipart/related; boundary=BOUND' }, body,
    })
    if (!r.ok) throw new Error(`Drive create: ${r.status}`)
    const j = await r.json() as DriveFile
    this.idCache.set(id, j.id)
    return { id, name, updatedAt: j.modifiedTime }
  }

  async save(id: string, name: string, data: ProjectData, knownUpdatedAt?: string): Promise<SaveResult> {
    const existing = await this.findFileByProjectId(id)
    if (!existing) { const m = await this.create(name, data); return { updatedAt: m.updatedAt } }
    if (knownUpdatedAt && existing.modifiedTime > knownUpdatedAt) {
      return { updatedAt: existing.modifiedTime, conflict: true }
    }
    const metadata = { name: nameFor(name) }
    const body = this.multipart(metadata, data)
    const r = await fetch(`${UPLOAD}/files/${existing.id}?uploadType=multipart&fields=id,modifiedTime`, {
      method: 'PATCH', headers: { ...(await authHeaders()), 'Content-Type': 'multipart/related; boundary=BOUND' }, body,
    })
    if (!r.ok) throw new Error(`Drive save: ${r.status}`)
    const j = await r.json() as DriveFile
    return { updatedAt: j.modifiedTime }
  }

  async rename(id: string, name: string): Promise<void> {
    const f = await this.findFileByProjectId(id)
    if (!f) throw new Error(`Projekt ${id} nie istnieje`)
    const r = await fetch(`${API}/files/${f.id}`, {
      method: 'PATCH', headers: { ...(await authHeaders()), 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: nameFor(name) }),
    })
    if (!r.ok) throw new Error(`Drive rename: ${r.status}`)
  }

  async remove(id: string): Promise<void> {
    const f = await this.findFileByProjectId(id)
    if (!f) return
    const r = await fetch(`${API}/files/${f.id}`, { method: 'DELETE', headers: await authHeaders() })
    if (!r.ok && r.status !== 404) throw new Error(`Drive delete: ${r.status}`)
  }

  async duplicate(id: string, newName: string): Promise<ProjectMeta> {
    const src = await this.load(id)
    return this.create(newName, src.data)
  }

  private multipart(metadata: object, data: object): string {
    return [
      '--BOUND',
      'Content-Type: application/json; charset=UTF-8', '',
      JSON.stringify(metadata),
      '--BOUND',
      'Content-Type: application/json', '',
      JSON.stringify(data),
      '--BOUND--', '',
    ].join('\r\n')
  }
}
```

- [ ] **Step 4: Run, verify pass**

Run: `npm test -- driveProjectStorage`
Expected: list + conflict tests pass.

- [ ] **Step 5: Type-check + full test run**

Run: `npx tsc -b && npm test`
Expected: EXIT 0, all suites pass.

- [ ] **Step 6: Commit**

```bash
git add src/services/driveProjectStorage.ts src/services/driveProjectStorage.test.ts
git commit -m "feat(storage): DriveProjectStorage (single shared folder)"
```

---

## Task 13: Wire Drive into auth + toolbar + store

**Files:**
- Modify: `src/components/toolbar/Toolbar.tsx`
- Modify: `src/store/projectStore.ts` (only if needed for setDriveStorage wiring)

- [ ] **Step 1: Add a sign-in control + status to the toolbar**

In `Toolbar.tsx` add imports:
```tsx
import { useEffect } from 'react';
import { signIn, signOut, isSignedIn, getEmail, onAuthChange, setDriveStorageFromAuth } from '../../services/googleAuth.ts';
import { DriveProjectStorage } from '../../services/driveProjectStorage.ts';
import { setDriveStorage, useProjectStore } from '../../store/projectStore.ts';
```
> `setDriveStorageFromAuth` does not exist — remove it from the import; we wire Drive here instead. Correct import line:
```tsx
import { signIn, signOut, isSignedIn, getEmail, onAuthChange } from '../../services/googleAuth.ts';
```

- [ ] **Step 2: Add auth state + handlers in the component**

```tsx
const [authed, setAuthed] = useState(isSignedIn());
const setStorageMode = useProjectStore((s) => s.setStorageMode);

useEffect(() => onAuthChange(() => setAuthed(isSignedIn())), []);

const handleSignIn = async () => {
  try {
    await signIn();
    setDriveStorage(new DriveProjectStorage());
    setStorageMode('drive');
  } catch (e) {
    alert('Logowanie nieudane: ' + (e as Error).message);
  }
};
const handleSignOut = () => {
  signOut();
  setDriveStorage(null);
  setStorageMode('local');
};
```

- [ ] **Step 3: Render the control**

Next to the "Projekty" button:
```tsx
{authed ? (
  <button onClick={handleSignOut} className="px-2 py-1 text-xs bg-gray-100 rounded border border-gray-300 hover:bg-gray-200">
    {getEmail() ?? 'Konto'} · Wyloguj
  </button>
) : (
  <button onClick={handleSignIn} className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">
    Zaloguj Google
  </button>
)}
```

- [ ] **Step 4: Type-check + build**

Run: `npx tsc -b && npm run build`
Expected: EXIT 0.

- [ ] **Step 5: Commit**

```bash
git add src/components/toolbar/Toolbar.tsx
git commit -m "feat(ui): Google sign-in + activate Drive storage"
```

---

## Task 14: Conflict handling in the modal

**Files:**
- Modify: `src/components/projects/ProjectsModal.tsx`
- Modify: `src/store/projectStore.ts` (autosave already calls saveCurrent; surface conflict)

- [ ] **Step 1: Surface conflict on manual save in the modal**

The autosave (Task 7) already calls `saveCurrent()`. Add an explicit "Zapisz teraz" button in the modal footer that handles conflict:
```tsx
const saveCurrent = useProjectStore((s) => s.saveCurrent);
const openProject = useProjectStore((s) => s.openProject);
const currentId = useProjectStore((s) => s.currentProjectId);

const onSaveNow = async () => {
  const res = await saveCurrent();
  if (res.conflict && currentId) {
    if (confirm('Ten projekt zmienił się w międzyczasie. OK = nadpisz mimo to, Anuluj = wczytaj nowszą wersję.')) {
      // nadpisz: wyczysc znacznik i zapisz ponownie
      useProjectStore.setState({ currentProjectUpdatedAt: null });
      await saveCurrent();
    } else {
      await openProject(currentId);
    }
  }
  refresh();
};
```
Add the button to the footer:
```tsx
<button onClick={onSaveNow} className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 mr-2">Zapisz teraz</button>
```

- [ ] **Step 2: Type-check + build**

Run: `npx tsc -b && npm run build`
Expected: EXIT 0.

- [ ] **Step 3: Manual verification (Drive end-to-end)**

Run `npm run dev`, open http://localhost:5173:
- Click "Zaloguj Google" → choose your test-user account → grant Drive (accept the "unverified app" screen once).
- Toolbar shows your email · Wyloguj. Open "Projekty" → switches to "Drive", lists folder (empty first time).
- "+ Nowy projekt" → draw → "Zapisz teraz". In Google Drive (browser), confirm a `<name>.schemat.json` appeared in the shared folder.
- From the collaborator's account (or another browser signed in as consorenergia@gmail.com), open the deployed/dev app, sign in, open "Projekty" → the same project is listed and opens.
Expected: file appears in the shared folder; collaborator sees and opens it.

- [ ] **Step 4: Commit**

```bash
git add src/components/projects/ProjectsModal.tsx src/store/projectStore.ts
git commit -m "feat(ui): conflict-aware manual save + Drive verified"
```

---

## Task 15: Deploy

**Files:** none (CI already builds on push)

- [ ] **Step 1: Push to master**

```bash
git push origin master
```

- [ ] **Step 2: Watch the Pages deploy**

Run: `gh run watch $(gh run list --limit 1 --json databaseId --jq '.[0].databaseId') --exit-status --interval 10`
Expected: completes successfully.

- [ ] **Step 3: Verify live**

Open https://ksiaz.github.io/schemat-elektryczny/ → sign in with a test-user account → confirm the shared folder library loads. (Origin `https://ksiaz.github.io` is already authorized in the OAuth client.)

---

## Self-Review Notes

- **Spec coverage:** model (Task 2,4,12) · config (Task 3) · storage interface + 2 impls (Task 4,12) · auth GIS (Task 11) · modal UI (Task 9,10,14) · toolbar login (Task 13) · concurrency/conflict (Task 4,12,14) · migration (Task 6,8) · local optional mode (Task 7 storageMode + Task 10 manual) · error handling (modal error state, autosave catch). All covered.
- **Drive scope:** full `drive` (spec-approved; Testing mode, ≤2 users).
- **No secrets:** only Client ID + Folder ID committed (public, safe). client_secret never used.
- **Known follow-ups (not in scope):** legacy `saveProject` localStorage key stays as offline draft buffer; can be retired later. Token not persisted across full reloads (user re-clicks "Zaloguj") — acceptable per spec.
