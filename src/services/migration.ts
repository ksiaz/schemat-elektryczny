import { LocalProjectStorage, LOCAL_PROJECTS_KEY } from './localProjectStorage.ts'
import type { ProjectData, ProjectMeta } from '../types/project.ts'

// Musi byc identyczne ze STORAGE_KEY w projectStore.ts:
export const LEGACY_KEY = 'schemat-pv-project'

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
