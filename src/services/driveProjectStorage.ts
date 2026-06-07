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
