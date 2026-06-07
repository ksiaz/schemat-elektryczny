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
