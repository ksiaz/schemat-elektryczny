import { describe, it, expect, vi, beforeEach } from 'vitest'
import { DriveProjectStorage } from './driveProjectStorage.ts'
import type { ProjectData } from '../types/project.ts'

vi.mock('./googleAuth.ts', () => ({ ensureToken: vi.fn().mockResolvedValue('tok') }))

const data = {} as ProjectData

describe('DriveProjectStorage', () => {
  beforeEach(() => vi.restoreAllMocks())

  it('list parses files in folder into meta', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ files: [
        { id: 'f1', appProperties: { projectId: 'p1' }, name: 'A.schemat.json', modifiedTime: '2026-01-02T00:00:00Z' },
        { id: 'f2', appProperties: { projectId: 'p2' }, name: 'B.schemat.json', modifiedTime: '2026-01-01T00:00:00Z' },
      ] }),
    }) as unknown as typeof fetch
    const list = await new DriveProjectStorage().list()
    expect(list.map((m) => m.id)).toEqual(['p1', 'p2'])
    expect(list[0].name).toBe('A')
  })

  it('save returns conflict when remote modifiedTime is newer', async () => {
    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: true, json: async () => ({ files: [{ id: 'f1', modifiedTime: '2026-02-02T00:00:00Z' }] }),
    }) as unknown as typeof fetch
    const r = await new DriveProjectStorage().save('p1', 'A', data, '2026-01-01T00:00:00Z')
    expect(r.conflict).toBe(true)
  })
})
