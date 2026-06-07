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

  it('LEGACY_KEY matches the app STORAGE_KEY', () => {
    expect(LEGACY_KEY).toBe('schemat-pv-project')
  })
})
