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
    const stale = '2000-01-01T00:00:00.000Z'
    await s.save(id, 'A', emptyData()) // bumps updatedAt to now
    const r = await s.save(id, 'A', emptyData(), stale)
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

  it('uses LOCAL_PROJECTS_KEY', () => {
    expect(LOCAL_PROJECTS_KEY).toBe('schemat:projects')
  })
})
