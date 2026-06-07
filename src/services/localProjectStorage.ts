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
